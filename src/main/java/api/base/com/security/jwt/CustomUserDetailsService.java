package api.base.com.security.jwt;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import api.base.com.mbr.mapper.MbrMapper;
import api.base.com.mbr.vo.CustomUserDetails;
import api.base.com.mbr.vo.MbrVO;
import api.base.front.cmm.exceptions.MemberException;

/**
 * DaoAuthenticationProvider 구현
 */
@Service
public class CustomUserDetailsService implements UserDetailsService {
	@Value("${project.login-fail-max-cnt}")
	private int loginFailMaxCnt;
	
	@Autowired
	private MbrMapper mbrMapper;

	@Override
	public CustomUserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		MbrVO mbrVO = new MbrVO();
		mbrVO.setMbrId(username);
		//return this.mbrMapper.selectMbrChk(mbrVO).orElseThrow(() -> new ResourceNotFoundException("Member", "Member Id : ", username));
		//return mbrMapper.selectMbrChk(mbrVO).orElseThrow(() -> new ResourceNotFoundException("Member", "Member Id : ", username));
		
		CustomUserDetails userDetails = (CustomUserDetails) mbrMapper.selectMbrChk(mbrVO).orElseThrow(() -> new UsernameNotFoundException("인증에 실패하였습니다."));
		// return User.builder().username(member.getUsername()).password(member.getPassword()).roles(member.getRole().name()).build();

		if(userDetails.getMbrLoginFailCnt() >= loginFailMaxCnt) {
			//throw new LoginFailException("인증에 실패하였습니다.\n인증 횟수를 초과 하였습니다.\n시스템 관라자에게 문의 바랍니다.");
			throw new MemberException("인증에 실패하였습니다.\n인증 횟수를 초과 하였습니다.\n시스템 관라자에게 문의 바랍니다.", HttpStatus.BAD_REQUEST);
		}
		return userDetails;
	}
}
