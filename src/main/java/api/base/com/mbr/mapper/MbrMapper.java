package api.base.com.mbr.mapper;

import java.util.List;
import java.util.Optional;

import org.apache.ibatis.annotations.Mapper;

import api.base.com.mbr.vo.CustomUserDetails;
import api.base.com.mbr.vo.MbrDto;
import api.base.com.mbr.vo.MbrVO;

@Mapper
public interface MbrMapper {

	Optional<CustomUserDetails> selectMbrChk(MbrVO vo);
	
	CustomUserDetails selectMbrSeq(String mbrId);
	
	List<?> selectMbrAuthorities(MbrVO mbrVO);

	void insertMbrLoginHistory(MbrVO vo);

	int updateMbrKey(MbrVO vo);

	int updateMbrLastLoginInfoSuccess(MbrVO vo);

	int updateMbrLastLoginInfoFail(MbrVO vo);

	List<?> selectMemberLoginHistoryChart1(String mbrLoginYn);
	
	MbrDto selectMbrDetail(MbrVO vo);
	
	int updateMbr(MbrDto dto);
}
