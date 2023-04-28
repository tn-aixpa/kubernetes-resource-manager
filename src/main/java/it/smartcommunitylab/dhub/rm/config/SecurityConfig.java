package it.smartcommunitylab.dhub.rm.config;

import it.smartcommunitylab.dhub.rm.SystemKeys;
import java.util.Arrays;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
public class SecurityConfig {

    @Bean("apiSecurityFilterChain")
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .securityMatcher(new AntPathRequestMatcher(SystemKeys.API_PATH + "/**"))
            // public access for now
            .oauth2ResourceServer(oauth2 -> oauth2.jwt())
            .httpBasic()
            .and()
            .requestCache((requestCache) -> requestCache.disable())
            .authorizeHttpRequests(requests -> {
                requests.anyRequest().authenticated();
            })
            // allow cors
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            // disable csrf
            .csrf(csrf -> csrf.disable())
            // we don't want a session for these endpoints
            .sessionManagement(management -> management.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        return http.build();
    }

    @Bean
    public UserDetailsService userDetailsService() {
        UserDetails user = User.withDefaultPasswordEncoder()
            .username("user")
            .password("password")
            .roles("USER")
            .build();
        return new InMemoryUserDetailsManager(user);
    }

    private CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(Arrays.asList("*"));
        config.setAllowedMethods(Arrays.asList("POST", "GET", "PUT", "OPTIONS", "DELETE"));
        config.setAllowedHeaders(Arrays.asList("Content-Type", "X-Total-Count", "Authorization"));
        config.setExposedHeaders(Arrays.asList("X-Total-Count"));
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
