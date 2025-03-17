package api.base.com.mbr.vo;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Iterator;
import java.util.List;

import org.springframework.security.core.CredentialsContainer;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import api.base.com.cmm.Role;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor(force = true)
@SuppressWarnings("serial")
public class CustomUserDetails implements UserDetails, CredentialsContainer {

	private Long mbrSeq;
	private String email;
	private String password;
	private String mbrId;
	private String mbrNm;
	private String username;
	private String groupCode;
	private int mbrLoginFailCnt;

	private Role role;
	private Role roles;
	private String mbrKey;//jwt.secret 누출 대비 2차 보안
	private int mbrKeyTm;//mbrKey 발급일자 유효 타임 (여러 단말기 동시 접속을 위한 대안)
	
	private List<MbrAuthoritieDto> mbrAuthorities;

	public void setGroupCode(String groupCode) {
		this.groupCode = groupCode;
	}
	public void setMbrKey(String mbrKey) {
		this.mbrKey = mbrKey;
	}
	
	public void setMbrAuthorities(List<MbrAuthoritieDto> mbrAuthorities) {
		this.mbrAuthorities = mbrAuthorities;
	}
	
	// == 생성자 Builder ==//
	/*
	 * @Builder public CustomUserDetails(String email, String password, String username, Role roles) { this.email = email; this.password = password; this.username = username; this.roles = roles; }
	 */
	@Builder
	public CustomUserDetails(String username, String password, Role role) {
		this.username = username;
		this.password = password;
		this.role = role;

	}

	public String getRoleKey() {
		return this.role.getKey();
	}

	// == update ==//
	public void update(String password, String username) {
		this.password = password;
		this.username = username;
	}

	@Override
	public void eraseCredentials() {// 인증 후 초기화
		this.password = null;
	}

	// ========== CustomUserDetails implements ==========//
	/**
	 * Token을 고유한 Email 값으로 생성합니다
	 * 
	 * @return email;
	 */
	@Override
	public String getUsername() {
		return username;
	}

	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		Collection<SimpleGrantedAuthority> authorities = new ArrayList<>();
		//authorities.add(new SimpleGrantedAuthority("ROLE_" + this.roles.name()));
		
		if (this.mbrAuthorities!= null) {
			for (Iterator authority = this.mbrAuthorities.iterator(); authority.hasNext();) {
				MbrAuthoritieDto authorityDto = (MbrAuthoritieDto) authority.next();
				authorities.add(new SimpleGrantedAuthority("ROLE_" + authorityDto.getAuthority()));
			}
		}
		return authorities;
	}

	@Override
	public boolean isAccountNonExpired() {
		return true;
	}

	@Override
	public boolean isAccountNonLocked() {
		return true;
	}

	@Override
	public boolean isCredentialsNonExpired() {
		return true;
	}

	@Override
	public boolean isEnabled() {
		return true;
	}

}