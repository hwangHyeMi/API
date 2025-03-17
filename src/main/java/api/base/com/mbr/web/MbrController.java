package api.base.com.mbr.web;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import api.base.com.file.service.FileService;
import api.base.com.file.vo.FileDto;
import api.base.com.file.vo.FileVO;
import api.base.com.mbr.service.MbrService;
import api.base.com.mbr.vo.CustomUserDetails;
import api.base.com.mbr.vo.MbrDto;
import api.base.com.mbr.vo.MbrLoginVO;
import api.base.com.mbr.vo.MbrTokenDto;
import api.base.com.mbr.vo.MbrVO;
import api.base.front.board.vo.BoardDto;
import api.base.front.board.web.BoardController;
import api.base.front.cmm.exceptions.MemberException;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
//@RequestMapping("/user")
//@RequestMapping(value = "/mbr", method = {RequestMethod.GET, RequestMethod.POST})
@RequestMapping(value = "/mbr", method = {RequestMethod.POST})
@RequiredArgsConstructor
@Slf4j
public class MbrController {
	
	@Autowired
	private final MbrService mbrService;
	
	@Autowired
	private FileService fileService;

	@PostMapping("/login")
	public ResponseEntity<MbrTokenDto> mbrLogin(@RequestBody MbrLoginVO mbrLoginVO, HttpServletRequest request) {
		ResponseEntity<MbrTokenDto> rsEntity = null;
		MbrTokenDto loginDTO = null;
		String ipAddr = request.getRemoteAddr();
		MbrVO mbrVO = new MbrVO();
		mbrVO.setMbrId(mbrLoginVO.getUserId());
		mbrVO.setGroupCd(mbrLoginVO.getGroupCode());
		mbrVO.setMbrLoginIp(ipAddr);
		try {
			
			loginDTO = mbrService.mbrLogin(mbrLoginVO);
			if(loginDTO != null && loginDTO.getMbrSeq() !=null) {
				mbrVO.setMbrSeq(loginDTO.getMbrSeq());
				mbrVO.setMbrLoginYn("Y");
				mbrService.updateMbrLastLoginInfoSuccess(mbrVO);
			}
			
			rsEntity = ResponseEntity.status(HttpStatus.OK).header(loginDTO.getToken()).body(loginDTO);
		} catch (MemberException me) {
			mbrVO.setMbrLoginYn("N");
			mbrService.updateMbrLastLoginInfoFail(mbrVO);
			throw me;
		} catch (Exception e) {
			throw e;
		} finally {
			mbrService.insertMbrLoginHistory(mbrVO);
		}
		return rsEntity;
	}

	@PostMapping("/mypage")
	public ResponseEntity<Map<String, Object>> mbrMypage(MbrVO mbrVO, HttpServletRequest request) {

		FileVO filevo = new FileVO();
		Map resultMap = new HashMap();
			
		//member정보조회 
		MbrDto mbrDto = mbrService.selectMbrDetail(mbrVO);
		
		//파일조회(프로필이미지)
		filevo.setAttachId(mbrDto.getAttachId());
		List<FileDto> file = (List<FileDto>) fileService.selectListFile(filevo);
			
		filevo.setAttachId(mbrDto.getAttachId());
		resultMap.put("mbr", mbrDto);
		resultMap.put("file", file);

		return ResponseEntity.status(HttpStatus.OK).body(resultMap);
	}
	
	//수정(저장)
	@SuppressWarnings({ "unchecked" })
	@GetMapping("/update")
	@PostMapping("/update")
	public ResponseEntity<MbrDto> updateMbr(MbrDto dto, @RequestParam("mutipartFiles") List<MultipartFile> multipartFiles) {

		log.info("updateMbr MbrDto = {}", dto.toString());

		int cnt = mbrService.updateMbr(dto, multipartFiles);
		
		dto.setReturnCnt(cnt);
		dto.setCode("SUCCESS");
		dto.setMessage("저장되었습니다");
		
		return ResponseEntity.status(HttpStatus.OK).body(dto);

	}





}
