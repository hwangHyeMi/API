package api.base.com.exceptions;

import java.io.IOException;

import org.springframework.boot.json.JsonParseException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingRequestHeaderException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.servlet.NoHandlerFoundException;

import com.fasterxml.jackson.core.JsonProcessingException;

import api.base.front.cmm.exceptions.MemberException;
import io.jsonwebtoken.JwtException;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

	private final HttpStatus HTTP_STATUS_OK = HttpStatus.OK;

	// TODO 필요 Exception 추가 하여 사용 하도록 한다.

	/**
	 * 로그인 호출 인증 관련
	 * 
	 * @param e
	 * @return
	 */
	@ExceptionHandler(MemberException.class)
	public ResponseEntity<ErrorResponse> handleMemberException(MemberException e) {
		//log.error("MemberException", e);
		//return new ResponseEntity<>(e.getMessage(), e.getStatus());
		final ErrorResponse response = ErrorResponse.of(ErrorCode.UNAUTHORIZED, null, e.getMessage());
		return new ResponseEntity<>(response, HTTP_STATUS_OK);
	}

	/**
	 * 미사용 중
	 * 
	 * @param e
	 * @return
	 */
	@ExceptionHandler(LoginFailException.class)
	public ResponseEntity<ErrorResponse> handleLoginFailException(LoginFailException e) {
		//log.error("LoginFailException", e);
		//return new ResponseEntity<>(e.getMessage(), e.getStatus());
		final ErrorResponse response = ErrorResponse.of(ErrorCode.UNAUTHORIZED, null, e.getMessage());
		return new ResponseEntity<>(response, HTTP_STATUS_OK);
	}

	/**
	 * 첨부 파일 관련
	 * 
	 * @param e
	 * @return
	 */
	@ExceptionHandler(FileException.class)
	public ResponseEntity<ErrorResponse> handleFileException(FileException e) {
		log.error("FileException", e);
		final ErrorResponse response = ErrorResponse.of(e.getStatus(), e.getMessage(), "F");
		return new ResponseEntity<>(response, HTTP_STATUS_OK);
	}

	/**
	 * 토큰 인증 관련
	 * 
	 * @param ex
	 * @return
	 * 
	 * <pre>
	  request.setAttribute("exception"... > JwtAuthenticationEntryPoint [AuthenticationException > (JwtException) request.getAttribute("exception")] > GlobalExceptionHandler
	 * </pre>
	 */
	@ExceptionHandler(JwtException.class)
	public ResponseEntity<ErrorResponse> handleJwtException(JwtException ex) {

		//return ErrorResponse.createErrorResponse(e);
		//HttpServletResponse.SC_UNAUTHORIZED
		final ErrorResponse response = ErrorResponse.of(ErrorCode.PAYMENT_REQUIRED, ex.getMessage());
		return new ResponseEntity<>(response, HttpStatus.PAYMENT_REQUIRED);
	}

	//참고 출처 : https://adjh54.tistory.com/79#3.%20%40ExceptionHandler-1-7
	/**
	 * [Exception] API 호출 시 '객체' 혹은 '파라미터' 데이터 값이 유효하지 않은 경우
	 *
	 * @param ex MethodArgumentNotValidException
	 * @return ResponseEntity<ErrorResponse>
	 */
	@ExceptionHandler(MethodArgumentNotValidException.class)
	protected ResponseEntity<ErrorResponse> handleMethodArgumentNotValidException(MethodArgumentNotValidException ex) {
		log.error("handleMethodArgumentNotValidException", ex);
		BindingResult bindingResult = ex.getBindingResult();
		StringBuilder stringBuilder = new StringBuilder();
		for (FieldError fieldError : bindingResult.getFieldErrors()) {
			stringBuilder.append(fieldError.getField()).append(":");
			stringBuilder.append(fieldError.getDefaultMessage());
			stringBuilder.append(", ");
		}
		final ErrorResponse response = ErrorResponse.of(ErrorCode.NOT_VALID_ERROR, String.valueOf(stringBuilder));
		return new ResponseEntity<>(response, HTTP_STATUS_OK);
	}

	/**
	 * [Exception] API 호출 시 'Header' 내에 데이터 값이 유효하지 않은 경우
	 *
	 * @param ex MissingRequestHeaderException
	 * @return ResponseEntity<ErrorResponse>
	 */
	@ExceptionHandler(MissingRequestHeaderException.class)
	protected ResponseEntity<ErrorResponse> handleMissingRequestHeaderException(MissingRequestHeaderException ex) {
		log.error("MissingRequestHeaderException", ex);
		final ErrorResponse response = ErrorResponse.of(ErrorCode.REQUEST_BODY_MISSING_ERROR, ex.getMessage());
		return new ResponseEntity<>(response, HTTP_STATUS_OK);
	}

	/**
	 * [Exception] 클라이언트에서 Body로 '객체' 데이터가 넘어오지 않았을 경우
	 *
	 * @param ex HttpMessageNotReadableException
	 * @return ResponseEntity<ErrorResponse>
	 */
	@ExceptionHandler(HttpMessageNotReadableException.class)
	protected ResponseEntity<ErrorResponse> handleHttpMessageNotReadableException(HttpMessageNotReadableException ex) {
		log.error("HttpMessageNotReadableException", ex);
		final ErrorResponse response = ErrorResponse.of(ErrorCode.REQUEST_BODY_MISSING_ERROR, ex.getMessage());
		return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
	}

	/**
	 * [Exception] 클라이언트에서 request로 '파라미터로' 데이터가 넘어오지 않았을 경우
	 *
	 * @param ex MissingServletRequestParameterException
	 * @return ResponseEntity<ErrorResponse>
	 */
	@ExceptionHandler(MissingServletRequestParameterException.class)
	protected ResponseEntity<ErrorResponse> handleMissingRequestHeaderExceptionException(MissingServletRequestParameterException ex) {
		log.error("handleMissingServletRequestParameterException", ex);
		final ErrorResponse response = ErrorResponse.of(ErrorCode.MISSING_REQUEST_PARAMETER_ERROR, ex.getMessage());
		return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
	}

	/**
	 * [Exception] 잘못된 서버 요청일 경우 발생한 경우
	 *
	 * @param e HttpClientErrorException
	 * @return ResponseEntity<ErrorResponse>
	 */
	@ExceptionHandler(HttpClientErrorException.BadRequest.class)
	protected ResponseEntity<ErrorResponse> handleBadRequestException(HttpClientErrorException e) {
		log.error("HttpClientErrorException.BadRequest", e);
		final ErrorResponse response = ErrorResponse.of(ErrorCode.BAD_REQUEST_ERROR, e.getMessage());
		return new ResponseEntity<>(response, HTTP_STATUS_OK);
	}

	/**
	 * [Exception] 잘못된 주소로 요청 한 경우
	 *
	 * @param e NoHandlerFoundException
	 * @return ResponseEntity<ErrorResponse>
	 */
	@ExceptionHandler(NoHandlerFoundException.class)
	protected ResponseEntity<ErrorResponse> handleNoHandlerFoundExceptionException(NoHandlerFoundException e) {
		log.error("handleNoHandlerFoundExceptionException", e);
		final ErrorResponse response = ErrorResponse.of(ErrorCode.NOT_FOUND_ERROR, e.getMessage());
		return new ResponseEntity<>(response, HTTP_STATUS_OK);
	}

	/**
	 * [Exception] NULL 값이 발생한 경우
	 *
	 * @param e NullPointerException
	 * @return ResponseEntity<ErrorResponse>
	 */
	@ExceptionHandler(NullPointerException.class)
	protected ResponseEntity<ErrorResponse> handleNullPointerException(NullPointerException e) {
		log.error("handleNullPointerException", e);
		final ErrorResponse response = ErrorResponse.of(ErrorCode.NULL_POINT_ERROR, e.getMessage());
		return new ResponseEntity<>(response, HTTP_STATUS_OK);
	}

	/**
	 * Input / Output 내에서 발생한 경우
	 *
	 * @param ex IOException
	 * @return ResponseEntity<ErrorResponse>
	 */
	@ExceptionHandler(IOException.class)
	protected ResponseEntity<ErrorResponse> handleIOException(IOException ex) {
		log.error("handleIOException", ex);
		final ErrorResponse response = ErrorResponse.of(ErrorCode.IO_ERROR, ex.getMessage());
		return new ResponseEntity<>(response, HTTP_STATUS_OK);
	}

	/**
	 * com.google.gson 내에 Exception 발생하는 경우
	 *
	 * @param ex JsonParseException
	 * @return ResponseEntity<ErrorResponse>
	 */
	@ExceptionHandler(JsonParseException.class)
	protected ResponseEntity<ErrorResponse> handleJsonParseExceptionException(JsonParseException ex) {
		log.error("handleJsonParseExceptionException", ex);
		final ErrorResponse response = ErrorResponse.of(ErrorCode.JSON_PARSE_ERROR, ex.getMessage());
		return new ResponseEntity<>(response, HTTP_STATUS_OK);
	}

	/**
	 * com.fasterxml.jackson.core 내에 Exception 발생하는 경우
	 *
	 * @param ex JsonProcessingException
	 * @return ResponseEntity<ErrorResponse>
	 */
	@ExceptionHandler(JsonProcessingException.class)
	protected ResponseEntity<ErrorResponse> handleJsonProcessingException(JsonProcessingException ex) {
		log.error("handleJsonProcessingException", ex);
		final ErrorResponse response = ErrorResponse.of(ErrorCode.REQUEST_BODY_MISSING_ERROR, ex.getMessage());
		return new ResponseEntity<>(response, HTTP_STATUS_OK);
	}

	// ==================================================================================================================

	/**
	 * [Exception] 모든 Exception 경우 발생
	 *
	 * @param ex Exception
	 * @return ResponseEntity<ErrorResponse>
	 */
	@ExceptionHandler(Exception.class)
	protected final ResponseEntity<ErrorResponse> handleAllExceptions(Exception ex) {
		log.error("Exception", ex);
		final ErrorResponse response = ErrorResponse.of(ErrorCode.INTERNAL_SERVER_ERROR, ex.getMessage());
		return new ResponseEntity<>(response, HTTP_STATUS_OK);
	}
}
