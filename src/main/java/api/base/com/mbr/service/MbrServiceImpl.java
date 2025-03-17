package api.base.com.mbr.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import api.base.com.mbr.mapper.MbrMapper;
import api.base.com.mbr.vo.CustomUserDetails;
import api.base.com.mbr.vo.MbrDto;
import api.base.com.mbr.vo.MbrLoginVO;
import api.base.com.mbr.vo.MbrTokenDto;
import api.base.com.mbr.vo.MbrVO;
import api.base.com.security.jwt.CustomUserDetailsService;
import api.base.com.security.jwt.JwtTokenUtil;
import api.base.com.util.FileUtil;
import api.base.front.board.web.BoardController;
import api.base.front.cmm.exceptions.MemberException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RequiredArgsConstructor
@Service
@Slf4j
public class MbrServiceImpl implements MbrService {

	private final PasswordEncoder encoder;
	private final AuthenticationManager authenticationManager;
	private final JwtTokenUtil jwtTokenUtil;
	private final CustomUserDetailsService userDetailsService;

	@Value("${project.login-mbr-key-time}")
	private int mbrKeyTm;
	
	@Value("${project.mbrFolder}")
	private String mbrFolder;
	

	@Autowired
	private MbrMapper mbrMapper;
	
	@Autowired
	private FileUtil fileUtil;
	


	@Override
	public Optional<CustomUserDetails> selectMbrChk(MbrVO vo) {
		return mbrMapper.selectMbrChk(vo);
	}

	@Override
	public CustomUserDetails selectMbrSeq(String mbrId) {
		return mbrMapper.selectMbrSeq(mbrId);
	}

	@Override
	public List<?> selectMbrAuthorities(MbrVO mbrVO) {
		return mbrMapper.selectMbrAuthorities(mbrVO);
	}

	@Override
	public void insertMbrLoginHistory(MbrVO vo) {
		mbrMapper.insertMbrLoginHistory(vo);
		if ("Y".equals(vo.getMbrLoginYn())) {
			// 실패 횟수 초기화
			mbrMapper.updateMbrLastLoginInfoSuccess(vo);
		} else {
			// 회원 정보가 있을경우 실패 횟수 증가
			mbrMapper.updateMbrLastLoginInfoFail(vo);
		}
	}

	public MbrTokenDto mbrLogin(MbrLoginVO mbrLoginVO) {
		authenticate(mbrLoginVO.getUserId(), mbrLoginVO.getUserPwd());
		CustomUserDetails userDetails = userDetailsService.loadUserByUsername(mbrLoginVO.getUserId());
		userDetails.setGroupCode(mbrLoginVO.getGroupCode()); // App 별사용자 그룹 코드(App 에서 부터 고정)

		checkEncodePassword(mbrLoginVO.getUserPwd(), userDetails.getPassword());

		// 멀티 권한 세팅
		MbrVO mbrVO = new MbrVO();
		mbrVO.setMbrSeq(userDetails.getMbrSeq());
		mbrVO.setGroupCd(mbrLoginVO.getGroupCode()); // App 별사용자 그룹 코드(App 에서 부터 고정)
		List mbrAuthorities = mbrMapper.selectMbrAuthorities(mbrVO);
		userDetails.setMbrAuthorities(mbrAuthorities);

		// 멀티 단말기 접속 허용을 위한 대한
		if (userDetails.getMbrKeyTm() >= mbrKeyTm) {// 키발급 24시간 허용
			//jwt.secret 누출 대비 2차 보안 키 발급
			int leftLimit = 97; // letter 'a'
			int rightLimit = 122; // letter 'z'
			int targetStringLength = 10;
			Random random = new Random();
			String mbrKey = random.ints(leftLimit, rightLimit + 1).limit(targetStringLength).collect(StringBuilder::new, StringBuilder::appendCodePoint, StringBuilder::append).toString();
			mbrVO.setMbrKey(mbrKey);
			userDetails.setMbrKey(mbrKey);
			mbrMapper.updateMbrKey(mbrVO);
		}

		String token = jwtTokenUtil.generateToken(userDetails);

		return MbrTokenDto.fromEntity(userDetails, token);
	}

	/**
	 * 사용자 인증
	 * 
	 * @param mbrId
	 * @param pwd
	 */
	private void authenticate(String mbrId, String pwd) {
		try {
			authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(mbrId, pwd));
		} catch (DisabledException e) {
			throw new MemberException("인증되지 않은 아이디입니다.", HttpStatus.BAD_REQUEST);
		} catch (BadCredentialsException e) {
			//throw new MemberException("비밀번호가 일치하지 않습니다.", HttpStatus.BAD_REQUEST);
			throw new MemberException("인증에 실패하였습니다.", HttpStatus.BAD_REQUEST);
		}
	}
	
	/**
	 * 사용자가 입력한 비번과 DB에 저장된 비번이 같은지 체크 : 인코딩 확인
	 * 
	 * @param rawPassword
	 * @param encodedPassword
	 */
	private void checkEncodePassword(String rawPassword, String encodedPassword) {
		if (!encoder.matches(rawPassword, encodedPassword)) {
			//throw new MemberException("패스워드 불일치", HttpStatus.BAD_REQUEST);
			throw new MemberException("인증에 실패하였습니다.", HttpStatus.BAD_REQUEST);
		}
	}

	@Override
	public int updateMbrLastLoginInfoSuccess(MbrVO vo) {
		return mbrMapper.updateMbrLastLoginInfoSuccess(vo);
	}

	@Override
	public int updateMbrLastLoginInfoFail(MbrVO vo) {
		return mbrMapper.updateMbrLastLoginInfoFail(vo);
	};

	@Override
	public List<?> selectMemberLoginHistoryChart1(String mbrLoginYn) {
		return mbrMapper.selectMemberLoginHistoryChart1(mbrLoginYn);
	}

	@Override
	public MbrDto selectMbrDetail(MbrVO vo) {
		return mbrMapper.selectMbrDetail(vo);
	}
	
	@Override
	public int updateMbr(MbrDto dto, List<MultipartFile> multipartFiles) {
		String attachId="";
		int cnt = 0;
		log.info("updateMbr MbrDto"+ dto.toString());
		
		log.info("updateMbr multipartFiles.size()"+ multipartFiles.size());
		//1.파일삭제 (disk)
		if(null!=multipartFiles) {
			
			fileUtil.deleteFiles(dto.getAttachId());//다중파일이 아니라서 attachId로 삭제
		}
		
		//2.파일업로드 (disk)
		if(dto.getAttachId() == null||dto.getAttachId() == "") {
			
			attachId = fileUtil.uploadFiles(multipartFiles, mbrFolder,"");
			dto.setAttachId(attachId);
			
		}else {
			
			fileUtil.uploadFiles(multipartFiles, mbrFolder,dto.getAttachId());
		}
		
		//3.게시글수정
		log.info("updateMbr MbrDto query Excute Before "+ dto.toString());
		cnt = mbrMapper.updateMbr(dto);
		
		return cnt;
	}

}
