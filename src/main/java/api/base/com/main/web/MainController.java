package api.base.com.main.web;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import api.base.com.mbr.service.MbrService;
import api.base.com.util.LoginUtil;
import io.swagger.v3.oas.annotations.Hidden;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
@Tag(name = "Main", description = "메인화면")
@RestController
//@RequestMapping("/")
@RequiredArgsConstructor
@Slf4j
public class MainController {

	@Value("${server.servlet.context-path}")
	private String contextPath;

	private final MbrService mbrService;

//	@GetMapping("/")
//	@PostMapping("/")
	public ResponseEntity<Map<String, Object>> main() {

		Map<String, Object> map = new HashMap<String, Object>();
		map.put("index", "메인");
		map.put("isLogin", LoginUtil.isLogin());
		map.put("userDetails", LoginUtil.getUserDetails());

		return ResponseEntity.status(HttpStatus.OK).body(map);
	}
	@Operation(summary = "차트", description = "param 없음 fetch")
	@RequestMapping(value="/com/dashboard/getChart1", method = {RequestMethod.GET, RequestMethod.POST})
	public ResponseEntity<Map<String, Object>> getChart1() {

		Map rsMap = new HashMap();
		String mbrLoginYn = "Y";
		List<Map> points1 = (List<Map>) mbrService.selectMemberLoginHistoryChart1(mbrLoginYn);
		mbrLoginYn = "N";
		List<Map> points2 = (List<Map>) mbrService.selectMemberLoginHistoryChart1(mbrLoginYn);
		rsMap.put("points1", points1);
		rsMap.put("points2", points2);
		// 쿼리 구현 필요
		List<Map> points3 = (List<Map>) mbrService.selectMemberLoginHistoryChart1(mbrLoginYn);
		rsMap.put("points3", points3);

		return ResponseEntity.status(HttpStatus.OK).body(rsMap);
	}
	@Hidden
	@GetMapping("/expired")
	public Map<String, Object> expired() {
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("session", "expired");
		map.put("isLogin", LoginUtil.isLogin());
		return map;
	}
	@Hidden
	@GetMapping("/invalid")
	public Map<String, Object> invalid() {
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("session", "invalid");
		map.put("isLogin", LoginUtil.isLogin());
		return map;
	}
}
