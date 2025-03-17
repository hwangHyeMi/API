package api.base.com.security;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.authentication.WebAuthenticationDetails;

import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;

@Slf4j
public class FormWebAuthenticationDetails extends WebAuthenticationDetails {

	private String secretKey;

	// 사용자가 전달하는 추가적인 파라미터들을 저장하는 클래스
	public FormWebAuthenticationDetails(HttpServletRequest request) {
		super(request);
		secretKey = request.getParameter("secret_key");
		log.info("FormWebAuthenticationDetails secretKey: : {}", secretKey);
		
		
		// 회원 가입 구현 전 암호화 Password 확인용도
		String userId = request.getParameter("userId");
		log.info("FormWebAuthenticationDetails userId: {}", userId);
		String userPwd = request.getParameter("userPwd");
		log.info("FormWebAuthenticationDetails userPwd: {}", userPwd);
		BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
		log.info("FormWebAuthenticationDetails passwordEncoder.encode userPwd: {}", passwordEncoder.encode(userPwd));
	}

	public String getSecretKey() {
		return secretKey;
	}
}