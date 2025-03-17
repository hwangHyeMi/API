package api.base.com.mbr.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.web.multipart.MultipartFile;

import api.base.com.mbr.vo.CustomUserDetails;
import api.base.com.mbr.vo.MbrDto;
import api.base.com.mbr.vo.MbrLoginVO;
import api.base.com.mbr.vo.MbrTokenDto;
import api.base.com.mbr.vo.MbrVO;

public interface MbrService {

	Optional<CustomUserDetails> selectMbrChk(MbrVO vo);
	
	CustomUserDetails selectMbrSeq(String mbrId);

	void insertMbrLoginHistory(MbrVO vo);

	List<?> selectMbrAuthorities(MbrVO mbrVO);

	MbrTokenDto mbrLogin(MbrLoginVO mbrLoginVO);

	int updateMbrLastLoginInfoSuccess(MbrVO vo);

	int updateMbrLastLoginInfoFail(MbrVO vo);

	List<?> selectMemberLoginHistoryChart1(String mbrLoginYn);
	
	MbrDto selectMbrDetail(MbrVO vo);
	
	int updateMbr(MbrDto dto,List<MultipartFile> multipartFiles);
}
