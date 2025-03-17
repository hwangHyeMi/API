package api.base.com.cors;

import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
public class CorsConfig {
	@Value("${cors.allow.origins}")
	private String corsAllowOrigins;

	/* CORS */
	@Bean
	public CorsConfigurationSource corsConfigurationSource() {
		CorsConfiguration configuration = new CorsConfiguration();
		//configuration.setAllowedOrigins(List.of("http://localhost:3000","http://114.206.0.48:3000", "http://jisub1.iptime.org:3000", "http://hm-sj.iptime.org:3000"));
		configuration.setAllowedOrigins(List.of(corsAllowOrigins));
		configuration.setAllowedMethods(Arrays.asList("GET", "POST", "OPTIONS", "PATCH", "DELETE"));
		configuration.setAllowedHeaders(Arrays.asList("Content-Type", "Authorization"));
		configuration.setExposedHeaders(Arrays.asList("Content-Disposition")); // CORS Content-Disposition 접근 불가 해제
		
//		configuration.setAllowedHeaders(Collections.singletonList("*"));
//		configuration.setAllowCredentials(true);

		UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		source.registerCorsConfiguration("/**", configuration);
		return source;
	}
}
