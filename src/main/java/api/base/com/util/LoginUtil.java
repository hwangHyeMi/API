package api.base.com.util;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;

import api.base.com.mbr.vo.CustomUserDetails;

public class LoginUtil {
	public static boolean isLogin() {
		boolean result = true;

		Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		if (principal instanceof String) {
			result = false;
		}

		return result;
	}

	public static UserDetails getUserDetails() {

		if (LoginUtil.isLogin()) {
			// loadUserByUsername 세팅 정보
			CustomUserDetails userDetails = (CustomUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
			// userDetails.eraseCredentials();
			return userDetails;
		} else {
			return null;
		}
	}
}
