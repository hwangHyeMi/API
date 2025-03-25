package api.base.com.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.servlet.util.matcher.MvcRequestMatcher;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.servlet.handler.HandlerMappingIntrospector;

import api.base.com.security.jwt.JwtAuthenticationEntryPoint;
import api.base.com.security.jwt.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

	private final CorsConfigurationSource corsConfigurationSource;
	private final JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;
	private final JwtAuthenticationFilter jwtAuthenticationFilter;

	@Bean
	AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
		return authenticationConfiguration.getAuthenticationManager();
	}

	@Bean
	SecurityFilterChain filterChaina(HttpSecurity http, HandlerMappingIntrospector introspector) throws Exception {
		http
		.httpBasic(httpBasic -> httpBasic.disable())
		.csrf(csrf -> csrf.disable())
		.cors(cors -> cors.configurationSource(corsConfigurationSource))
		.authorizeHttpRequests(authz -> {
			try {
				authz.requestMatchers(
						new MvcRequestMatcher(introspector, "/dev-info/**")
						, new MvcRequestMatcher(introspector, "/front/**")
						, new MvcRequestMatcher(introspector, "/com/**")
						, new MvcRequestMatcher(introspector, "/mbr/**")
						).permitAll()
						// .requestMatchers("/dev-info/**", "/front/**", "/com/**", "/mbr/**", "/login", "/logout", "/expired", "/invalid").permitAll()
						.requestMatchers(new MvcRequestMatcher(introspector, "/user/**")).hasRole("USER")
						.requestMatchers(new MvcRequestMatcher(introspector, "/admin/**")).hasAnyRole("ADMIN")
						.anyRequest()
						.authenticated();
				// 위 설정 이외 모든 요청은 승인을 거치도록 함.
			} catch (Exception e) {
				throw new RuntimeException(e);
			}
		})
		.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
		.exceptionHandling(excep -> excep.authenticationEntryPoint(jwtAuthenticationEntryPoint))
		.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

		return http.build();
	}
}
