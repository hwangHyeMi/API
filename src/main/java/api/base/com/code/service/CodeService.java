package api.base.com.code.service;

import java.util.List;

import api.base.com.code.vo.CodeVO;

public interface CodeService {
	List<?> selectCodeGroupList(CodeVO vo);

	List<?> selectCodeDetailList(CodeVO vo);
}
