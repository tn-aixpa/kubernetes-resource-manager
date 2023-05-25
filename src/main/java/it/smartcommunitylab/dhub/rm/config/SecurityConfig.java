package it.smartcommunitylab.dhub.rm.config;

import static org.springframework.security.config.Customizer.withDefaults;

import it.smartcommunitylab.dhub.rm.SystemKeys;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.function.Predicate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.convert.converter.Converter;
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
import org.springframework.security.oauth2.jwt.JwtDecoders;
import org.springframework.security.oauth2.jwt.JwtValidators;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    Logger logger = LoggerFactory.getLogger(SecurityConfig.class);

    @Autowired
    AuthenticationProperties authProps;

    @Bean("apiSecurityFilterChain")
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        //base config
        http
            .securityMatcher(new AntPathRequestMatcher(SystemKeys.API_PATH + "/**"))
            // allow cors
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            // disable csrf
            .csrf(csrf -> csrf.disable())
            .requestCache(AbstractHttpConfigurer::disable)
            // we don't want a session for these endpoints
            .sessionManagement(management -> management.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        //authentication (when configured)
        if (authProps.isRequired()) {
            logger.debug("Authentication required, enabled.");
            http.authorizeHttpRequests(requests -> requests.anyRequest().authenticated());

            if (authProps.isBasicAuthEnabled()) {
                logger.info("Enable basic authentication");
                http.httpBasic(withDefaults());
            }

            if (authProps.isOAuthEnabled()) {
                logger.info("Enable JWT authentication");
                http.oauth2ResourceServer(oauth2 ->
                    oauth2.jwt().decoder(jwtDecoder()).jwtAuthenticationConverter(jwtAuthenticationConverter())
                );
            }
        } else {
            logger.warn("Enable anonymous authentication");
            http.anonymous(anon -> anon.authorities("ROLE_USER"));
        }

        return http.build();
    }

    @Bean
    public UserDetailsService userDetailsService() {
        if (authProps.isBasicAuthEnabled()) {
            UserDetails user = User
                .withDefaultPasswordEncoder()
                .username(authProps.getBasicUsername())
                .password(authProps.getBasicPassword())
                .roles("USER", "ADMIN")
                .build();
            return new InMemoryUserDetailsManager(user);
        }

        return new InMemoryUserDetailsManager();
    }

    private JwtDecoder jwtDecoder() {
        NimbusJwtDecoder jwtDecoder = (NimbusJwtDecoder) JwtDecoders.fromIssuerLocation(authProps.getOauth2IssuerUri());

        Predicate<List<String>> testClaimValue = claimValue ->
            (claimValue != null) && claimValue.contains(authProps.getOauth2Audience());
        OAuth2TokenValidator<Jwt> audienceValidator = new JwtClaimValidator<>(JwtClaimNames.AUD, testClaimValue);

        OAuth2TokenValidator<Jwt> withIssuer = JwtValidators.createDefaultWithIssuer(authProps.getOauth2IssuerUri());
        OAuth2TokenValidator<Jwt> withAudience = new DelegatingOAuth2TokenValidator<>(withIssuer, audienceValidator);

        jwtDecoder.setJwtValidator(withAudience);

        return jwtDecoder;
    }

    private Converter<Jwt, AbstractAuthenticationToken> jwtAuthenticationConverter() {
        JwtAuthenticationConverter converter = new JwtAuthenticationConverter();
        converter.setJwtGrantedAuthoritiesConverter((Jwt source) -> {
            if (source == null) return null;

            List<GrantedAuthority> roles = new ArrayList<>();
            roles.add(new SimpleGrantedAuthority("ROLE_USER"));

            return roles;
        });
        return converter;
    }

    private CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(Arrays.asList("http://localhost:3000"));
        config.setAllowedMethods(Arrays.asList("POST", "GET", "PUT", "OPTIONS", "DELETE"));
        config.setAllowedHeaders(Arrays.asList("Content-Type", "X-Total-Count", "Authorization", "Range"));
        config.setExposedHeaders(Arrays.asList("X-Total-Count", "Access-Control-Allow-Origin", "Content-Range"));
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
