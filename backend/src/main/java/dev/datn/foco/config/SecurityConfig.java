package dev.datn.foco.config;

import dev.datn.foco.constaint.ApiVersion;
import dev.datn.foco.util.JwtAccessDeniedHandler;
import dev.datn.foco.util.JwtFilter;
import dev.datn.foco.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
    @Autowired
    private JwtFilter jwtFilter;
    @Autowired
    private JwtUtil jwtAuthenticationEntryPoint;
    @Autowired
    private JwtAccessDeniedHandler jwtAccessDeniedHandler;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> {})
                .formLogin(formLogin -> formLogin.disable())
                .httpBasic(httpBasic -> httpBasic.disable())
                .exceptionHandling(exeption ->
                        exeption.authenticationEntryPoint(jwtAuthenticationEntryPoint).accessDeniedHandler(jwtAccessDeniedHandler))
                .authorizeHttpRequests(auth ->
                        auth
                        // Public endpoints - không cần authentication
                        .requestMatchers(
                            ApiVersion.API_VERSION + "/auth/**",
                            ApiVersion.API_VERSION + "/public/**",
                            ApiVersion.API_VERSION + "/customer-auth/**",
                            ApiVersion.API_VERSION + "/menu-items/**",
                            ApiVersion.API_VERSION + "/menu-items/available",
                            ApiVersion.API_VERSION + "/categories/**",
                            "/ws/**"  // WebSocket endpoint
                        ).permitAll()
                        // Tất cả request khác cần authentication
                        .anyRequest().authenticated()
                )
                .sessionManagement(sess -> sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

}
