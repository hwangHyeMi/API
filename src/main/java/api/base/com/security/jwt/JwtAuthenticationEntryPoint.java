package api.base.com.security.jwt;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerExceptionResolver;

import io.jsonwebtoken.JwtException;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtAuthenticationEntryPoint implements AuthenticationEntryPoint {
	//@Override
	//public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException authException) throws IOException {
	//response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized");
	//}
	private final HandlerExceptionResolver resolver;

	public JwtAuthenticationEntryPoint(@Qualifier("handlerExceptionResolver") HandlerExceptionResolver resolver) {
		this.resolver = resolver;
	}

	@Override
	public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException authException) throws IOException, ServletException {

		// GlobalExceptionHandler 타도록
		//resolver.resolveException(request, response, null, authException);

		// request.setAttribute("exception"... > JwtAuthenticationEntryPoint [AuthenticationException > (JwtException) request.getAttribute("exception")] > GlobalExceptionHandler
		if(request.getAttribute("exception") != null) { // JwtException
			resolver.resolveException(request, response, null, (JwtException) request.getAttribute("exception"));
		} else {
			resolver.resolveException(request, response, null, authException);
		}
	}
}
