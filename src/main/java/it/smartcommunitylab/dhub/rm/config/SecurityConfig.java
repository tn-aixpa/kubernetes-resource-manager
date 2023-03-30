package it.smartcommunitylab.dhub.rm.config;

import it.smartcommunitylab.dhub.rm.SystemKeys;
import java.util.Arrays;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
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
            // TODO jwt auth
            .authorizeHttpRequests(requests -> requests.anyRequest().permitAll())
            // allow cors
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            // disable csrf
            .csrf(csrf -> csrf.disable())
            // we don't want a session for these endpoints
            .sessionManagement(management -> management.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        return http.build();
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
