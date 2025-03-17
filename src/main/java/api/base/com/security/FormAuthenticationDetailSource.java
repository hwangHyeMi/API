package api.base.com.security;

import org.springframework.security.authentication.AuthenticationDetailsSource;
import org.springframework.security.web.authentication.WebAuthenticationDetails;
import org.springframework.stereotype.Component;

import jakarta.servlet.http.HttpServletRequest;

@Component
public class FormAuthenticationDetailSource implements AuthenticationDetailsSource<HttpServletRequest, WebAuthenticationDetails> {
	@Override
	public WebAuthenticationDetails buildDetails(HttpServletRequest context) {
		return new FormWebAuthenticationDetails(context);
	}
}