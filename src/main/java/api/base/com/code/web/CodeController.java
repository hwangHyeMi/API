package api.base.com.code.web;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import api.base.com.code.service.CodeService;
import api.base.com.code.vo.CodeDto;
import api.base.com.code.vo.CodeVO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
@Tag(name = "Code", description = "공통코드")
@RestController
@RequiredArgsConstructor
@RequestMapping(value = "/com")
@Slf4j
public class CodeController {

	@Autowired
	private CodeService codeService;

	@SuppressWarnings({ "unchecked", "rawtypes" })
	@Operation(summary = "공통코드 전체 리스트", description = "param 없음")
	@GetMapping("/codeAllList")
	public ResponseEntity<List<Map<String, Object>>> codeAllList(CodeVO vo) {
		CodeDto codeDto = null;
		CodeVO detailVo = null;
		List<Map<String, Object>> resList = new ArrayList<Map<String, Object>>();
		List<CodeDto> codeGroupList = (List<CodeDto>) codeService.selectCodeGroupList(vo);
		for (Iterator iterator = codeGroupList.iterator(); iterator.hasNext();) {
			codeDto = (CodeDto) iterator.next();
			Map<String, Object> codeGroupMap = new HashMap<String, Object>();
			codeGroupMap.put("codeGroupCd", codeDto.getCodeGroupCd());
			codeGroupMap.put("codeGroupNm", codeDto.getCodeGroupNm());
			codeGroupMap.put("codeGroupDescription", codeDto.getCodeGroupDescription());

			detailVo = new CodeVO();
			detailVo.setCodeGroupCd(codeDto.getCodeGroupCd());
			List<CodeDto> codeDetailList = (List<CodeDto>) codeService.selectCodeDetailList(detailVo);
			codeGroupMap.put("codeDetailList", codeDetailList);

			resList.add(codeGroupMap);
		}

		return ResponseEntity.status(HttpStatus.OK).body(resList);
	}

	@SuppressWarnings({ "unchecked" })
	@Operation(summary = "공통코드 전체 리스트", description = "CodeVO")
	@Parameter(name = "codeGroupCd", description = "그룹코드")
	@GetMapping("/codeDetailList")
	public ResponseEntity<List<CodeDto>> codeDetailList(CodeVO detailVo) {
		List<CodeDto> codeDetailList = (List<CodeDto>) codeService.selectCodeDetailList(detailVo);

		return ResponseEntity.status(HttpStatus.OK).body(codeDetailList);
	}

}
