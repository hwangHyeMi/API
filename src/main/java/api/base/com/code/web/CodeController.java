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
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequiredArgsConstructor
@RequestMapping(value = "/com", method = {RequestMethod.GET, RequestMethod.POST})
@Slf4j
public class CodeController {

	@Autowired
	private CodeService codeService;

	@SuppressWarnings({ "unchecked", "rawtypes" })
	@GetMapping("/codeAllList")
	@PostMapping("/codeAllList")
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
	@GetMapping("/codeDetailList")
	@PostMapping("/codeDetailList")
	public ResponseEntity<List<CodeDto>> codeDetailList(CodeVO detailVo) {
		List<CodeDto> codeDetailList = (List<CodeDto>) codeService.selectCodeDetailList(detailVo);

		return ResponseEntity.status(HttpStatus.OK).body(codeDetailList);
	}

}
