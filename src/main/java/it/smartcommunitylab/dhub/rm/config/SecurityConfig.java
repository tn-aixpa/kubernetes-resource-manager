// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

package it.smartcommunitylab.dhub.rm.config;

import it.smartcommunitylab.dhub.rm.SystemKeys;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.function.Predicate;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.convert.converter.Converter;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.oauth2.core.DelegatingOAuth2TokenValidator;
import org.springframework.security.oauth2.core.OAuth2TokenValidator;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtClaimNames;
import org.springframework.security.oauth2.jwt.JwtClaimValidator;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtValidators;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.access.AccessDeniedHandlerImpl;
import org.springframework.security.web.authentication.Http403ForbiddenEntryPoint;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.util.StringUtils;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    Logger logger = LoggerFactory.getLogger(SecurityConfig.class);

    @Value("${security.cors.origins}")
    private String corsOrigins;

    @Autowired
    AuthenticationProperties authenticationProperties;

    @Bean("consoleSecurityFilterChain")
    public SecurityFilterChain consoleFilterChain(HttpSecurity http) throws Exception {
        //base config
        http
            .securityMatcher(new AntPathRequestMatcher(SystemKeys.CONSOLE_PATH + "/**"))
            // disable csrf
            .csrf(csrf -> csrf.disable())
            // we don't want a session for these endpoints
            .sessionManagement(management -> management.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        if (StringUtils.hasText(corsOrigins)) {
            logger.info("CORS origins configured, enabled.");
            http.cors(cors -> cors.configurationSource(corsConfigurationSource(corsOrigins)));
        }

        return http.build();
    }

    @Bean("apiSecurityFilterChain")
    public SecurityFilterChain apiFilterChain(HttpSecurity http) throws Exception {
        //base config
        http
            .securityMatcher(new AntPathRequestMatcher(SystemKeys.API_PATH + "/**"))
            // disable csrf
            .csrf(csrf -> csrf.disable())
            .requestCache(AbstractHttpConfigurer::disable)
            // we don't want a session for these endpoints
            .sessionManagement(management -> management.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        if (StringUtils.hasText(corsOrigins)) {
            logger.info("CORS origins configured, enabled.");
            http.cors(cors -> cors.configurationSource(corsConfigurationSource(corsOrigins)));
        }

        //authentication (when configured)
        if (authenticationProperties.isRequired()) {
            logger.debug("Authentication required, enabled.");
            http.authorizeHttpRequests(requests -> requests.anyRequest().authenticated());

            if (authenticationProperties.isBasicAuthEnabled()) {
                logger.info("Enable basic authentication");
                http                    
                    .httpBasic(basic -> basic.authenticationEntryPoint(new Http403ForbiddenEntryPoint()))
                    .userDetailsService(userDetailsService());

            }

            if (authenticationProperties.isOAuth2Enabled()) {
                logger.info("Enable OAuth2 JWT authentication");
                http.oauth2ResourceServer(oauth2 -> oauth2.jwt(jwt -> jwt.decoder(jwtDecoder()).jwtAuthenticationConverter(jwtAuthenticationConverter())));
            }
        } else {
            logger.warn("Enable anonymous authentication");
            http.anonymous(anon -> {
                anon.authorities("ROLE_USER", "ROLE_ADMIN");
                anon.principal("anonymous");
            });
        }

        http.exceptionHandling(handling -> {
            handling
                .authenticationEntryPoint(new Http403ForbiddenEntryPoint())
                .accessDeniedHandler(new AccessDeniedHandlerImpl()); // use 403
        });

        return http.build();
    }

    private UserDetailsService userDetailsService() {
        if (authenticationProperties.isBasicAuthEnabled()) {
            UserDetails user = User
                .withDefaultPasswordEncoder()
                .username(authenticationProperties.getBasic().getUsername())
                .password(authenticationProperties.getBasic().getPassword())
                .roles("USER", "ADMIN")
                .build();
            return new InMemoryUserDetailsManager(user);
        }

        return new InMemoryUserDetailsManager();
    }

    private JwtDecoder jwtDecoder() {
        NimbusJwtDecoder jwtDecoder = NimbusJwtDecoder
            .withIssuerLocation(authenticationProperties.getOauth2().getIssuerUri())
            .build();

        Predicate<List<String>> audClaimValue = claimValue ->
            (claimValue != null) && claimValue.contains(authenticationProperties.getOauth2().getAudience());
        OAuth2TokenValidator<Jwt> audienceValidator = new JwtClaimValidator<>(JwtClaimNames.AUD, audClaimValue);

        OAuth2TokenValidator<Jwt> withIssuer = JwtValidators.createDefaultWithIssuer(authenticationProperties.getOauth2().getIssuerUri());
        OAuth2TokenValidator<Jwt> withAudience = new DelegatingOAuth2TokenValidator<>(withIssuer, audienceValidator);
        jwtDecoder.setJwtValidator(withAudience);

        return jwtDecoder;
    }

    private Converter<Jwt, AbstractAuthenticationToken> jwtAuthenticationConverter() {
        String claim = authenticationProperties.getOauth2().getRoleClaim();
        JwtAuthenticationConverter converter = new JwtAuthenticationConverter();
        converter.setJwtGrantedAuthoritiesConverter((Jwt source) -> {
            if (source == null) return null;

            List<GrantedAuthority> authorities = new ArrayList<>();
            authorities.add(new SimpleGrantedAuthority("ROLE_USER"));

            if (StringUtils.hasText(claim) && source.hasClaim(claim)) {
                List<String> roles = source.getClaimAsStringList(claim);
                if (roles != null) {
                    roles.forEach(r -> {
                        //use as is
                        authorities.add(new SimpleGrantedAuthority(r));
                    });
                }
            }

            return authorities;
        });
        return converter;
    }

    private CorsConfigurationSource corsConfigurationSource(String origins) {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOriginPatterns(new ArrayList<>(StringUtils.commaDelimitedListToSet(origins)));
        config.setAllowedMethods(
            Stream
                .of(HttpMethod.GET, HttpMethod.POST, HttpMethod.PUT, HttpMethod.DELETE, HttpMethod.OPTIONS)
                .map(HttpMethod::name)
                .collect(Collectors.toList())
        );

        config.setAllowedHeaders(Arrays.asList(HttpHeaders.CONTENT_TYPE, HttpHeaders.AUTHORIZATION, HttpHeaders.RANGE));

        config.setExposedHeaders(Arrays.asList(HttpHeaders.ACCESS_CONTROL_ALLOW_ORIGIN, HttpHeaders.CONTENT_RANGE));
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
    
}


