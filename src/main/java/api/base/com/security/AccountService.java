package api.base.com.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;

import api.base.com.mbr.service.MbrService;
import lombok.extern.slf4j.Slf4j;

@Slf4j
//@Service
// @RequiredArgsConstructor
public class AccountService{// implements UserDetailsService {

	@Value("${project.login-fail-max-cnt}")
	private int loginFailMaxCnt;
	
	@Autowired
	private MbrService mbrService;
/*
	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		MbrVO vo = new MbrVO();
		vo.setMbrId(username);
		
		CustomUserDetails userDetails = (CustomUserDetails) mbrService.selectMbrChk(vo).orElseThrow(() -> new UsernameNotFoundException("없는 회원 입니다..."));
		// return User.builder().username(member.getUsername()).password(member.getPassword()).roles(member.getRole().name()).build();

		if(userDetails.getMbrLoginFailCnt() >= loginFailMaxCnt) {
			throw new LoginFailException("로그인 실패 횟수 초과!");
		}
		return userDetails;
	}
*/

}