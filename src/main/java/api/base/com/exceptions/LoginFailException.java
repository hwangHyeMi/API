package api.base.com.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.AuthenticationException;

import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class LoginFailException extends AuthenticationException {

	private HttpStatus status;
	private String message;

	public LoginFailException(String message, HttpStatus status) {
		super(message);
		this.message = message;
		this.status = status;
	}
}
