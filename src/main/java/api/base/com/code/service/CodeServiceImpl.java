package api.base.com.code.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import api.base.com.code.mapper.CodeMapper;
import api.base.com.code.vo.CodeVO;

@Service
public class CodeServiceImpl implements CodeService {

	@Autowired
	private CodeMapper codeMapper;

	@Override
	public List<?> selectCodeGroupList(CodeVO vo) {
		return codeMapper.selectCodeGroupList(vo);
	}

	public List<?> selectCodeDetailList(CodeVO vo) {
		return codeMapper.selectCodeDetailList(vo);
	}
}
