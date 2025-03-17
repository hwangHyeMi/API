package api.base.com.cmm;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum Role {
	USER("ROLE_USER", "일반사용자"), ADMIN("ROLE_ADMIN", "일반관리자"), SYSADMIN("ROLE_SYSADMIN", "슈퍼관리자");

	private final String key;
	private final String title;
}
