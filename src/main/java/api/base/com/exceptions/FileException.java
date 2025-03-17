package api.base.com.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.AuthenticationException;

import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class FileException extends AuthenticationException {

	private HttpStatus status;
	private String message;

	public FileException(String message, HttpStatus status) {
		super(message);
		this.message = message;
		this.status = status;
	}
}
