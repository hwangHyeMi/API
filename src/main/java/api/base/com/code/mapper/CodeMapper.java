package api.base.com.code.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import api.base.com.code.vo.CodeVO;

@Mapper
public interface CodeMapper {

	List<?> selectCodeGroupList(CodeVO vo);

	List<?> selectCodeDetailList(CodeVO vo);

}
