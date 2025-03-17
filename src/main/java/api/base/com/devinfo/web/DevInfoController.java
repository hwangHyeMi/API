package api.base.com.devinfo.web;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import api.base.com.util.LoginUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping(value = "/dev-info", method = {RequestMethod.GET, RequestMethod.POST})
@RequiredArgsConstructor
@Slf4j
public class DevInfoController {

	@Value("${server.servlet.context-path}")
	private String contextPath;

	@GetMapping("/info-list")
	@PostMapping("/info-list")
	public ResponseEntity<Map<String, Object>> infoList() {

		Map<String, Object> map = new HashMap<String, Object>();
		map.put("index", "메인");
		map.put("isLogin", LoginUtil.isLogin());
		map.put("userDetails", LoginUtil.getUserDetails());
		
		List<Map<String, String>> urlList = new ArrayList<Map<String, String>>();
		Map<String, String> urlMap = new HashMap<String, String>();
		
		urlMap = new HashMap<String, String>();
		urlMap.put("url", contextPath + "/dev-info/info-list");
		urlMap.put("parameters", "");
		urlMap.put("method", "[GET,POST]");
		urlMap.put("direction", "개발 정보 및 ");
		urlMap.put("direction1", "로그인 회원 정보 조회[임시]");
		urlMap.put("direction2", "");
		urlList.add(urlMap);
		/*
		urlMap = new HashMap<String, String>();
		urlMap.put("url", contextPath + "/loginProc");
		urlMap.put("parameters", "userId=&userPwd=");
		urlMap.put("method", "POST");
		urlMap.put("direction", "로그인 처리[axios toekn 추가 인증 필요 함.]");
		urlMap.put("direction1", "원칙적으로 post 방식만 지원");
		urlMap.put("direction2", "추가 parameters 협의, 변수 명 변경 가능");
		urlList.add(urlMap);
		*/
		urlMap = new HashMap<String, String>();
		urlMap.put("url", contextPath + "/mbr/login");
		urlMap.put("parameters", "userId=&userPwd=&groupCode=GROUP-CODE");
		urlMap.put("method", "POST");
		urlMap.put("direction", "로그인 처리[axios toekn 방식.]");
		urlMap.put("direction1", "원칙적으로 post 방식만 지원/ groupCode=GROUP-CODE 고정 값 추가( 설정 파일어딘가에 쓸 예정 ) ");
		urlMap.put("direction2", "추가 parameters 협의, 변수 명 변경 가능");
		urlList.add(urlMap);
		
		urlMap = new HashMap<String, String>();
		urlMap.put("url", contextPath + "/logout");
		urlMap.put("parameters", "");
		urlMap.put("method", "POST");
		urlMap.put("direction", "로그아웃 처리");
		urlMap.put("direction1", "원칙적으로 post 방식만 지원");
		urlMap.put("direction2", "");
		urlList.add(urlMap);

		urlMap = new HashMap<String, String>();
		urlMap.put("url", contextPath + "/com/codeAllList");
		urlMap.put("parameters", "");
		urlMap.put("method", "[GET,POST]");
		urlMap.put("direction", "샘플-코드-전체");
		urlMap.put("direction1", "상시 접근 가능");
		urlMap.put("direction2", "");
		urlList.add(urlMap);

		urlMap = new HashMap<String, String>();
		urlMap.put("url", contextPath + "/com/codeDetailList");
		urlMap.put("parameters", "ex) codeGroupCd=CODE0001");
		urlMap.put("method", "[GET,POST]");
		urlMap.put("direction", "샘플-코드-상세");
		urlMap.put("direction1", "상시 접근 가능");
		urlMap.put("direction2", "");
		urlList.add(urlMap);
		
		urlMap = new HashMap<String, String>();
		urlMap.put("url", contextPath + "/front/menu/topMenuList");
		urlMap.put("parameters", "");
		urlMap.put("method", "[GET,POST]");
		urlMap.put("direction", "front- Top 메뉴 목록[USER Role 로그인 정보 존재시 user- 메뉴 목록 반환]");
		urlMap.put("direction1", "상시 접근 가능");
		urlMap.put("direction2", "");
		urlList.add(urlMap);
		
		urlMap = new HashMap<String, String>();
		urlMap.put("url", contextPath + "/front/menu/subMenuList");
		urlMap.put("parameters", "ex) topMenuSeq=3");
		urlMap.put("method", "[GET,POST]");
		urlMap.put("direction", "front- Sub 메뉴 목록[USER Role 로그인 정보 존재시 user- 메뉴 목록 반환]");
		urlMap.put("direction1", "상시 접근 가능");
		urlMap.put("direction2", "");
		urlList.add(urlMap);
		
		urlMap = new HashMap<String, String>();
		urlMap.put("url", contextPath + "/user/menu/topMenuList");
		urlMap.put("parameters", "");
		urlMap.put("method", "[GET,POST]");
		urlMap.put("direction", "user- Top 메뉴 목록");
		urlMap.put("direction1", "USER Role 로그인 후에 접근 가능");
		urlMap.put("direction2", "user/test");
		urlList.add(urlMap);
		
		urlMap = new HashMap<String, String>();
		urlMap.put("url", contextPath + "/user/menu/subMenuList");
		urlMap.put("parameters", "ex) topMenuSeq=3");
		urlMap.put("method", "[GET,POST]");
		urlMap.put("direction", "user- Sub 메뉴 목록");
		urlMap.put("direction1", "USER Role 로그인 후에 접근 가능");
		urlMap.put("direction2", "user/test");
		urlList.add(urlMap);

		urlMap = new HashMap<String, String>();
		urlMap.put("url", contextPath + "/front/board/list2");
		urlMap.put("parameters", "");
		urlMap.put("method", "GET");
		urlMap.put("direction", "샘플-리스트형");
		urlMap.put("direction1", "상시 접근 가능");
		urlMap.put("direction2", "");

		urlMap = new HashMap<String, String>();
		urlMap.put("url", contextPath + "/user/board/list2");
		urlMap.put("parameters", "");
		urlMap.put("method", "GET");
		urlMap.put("direction", "샘플-리스트형");
		urlMap.put("direction1", "USER Role 로그인 후에 접근 가능");
		urlMap.put("direction2", "user/test");
		urlList.add(urlMap);

		urlMap = new HashMap<String, String>();
		urlMap.put("url", contextPath + "/admin/**");
		urlMap.put("parameters", "");
		urlMap.put("method", "미구현");
		urlMap.put("direction", "샘플-미구현");
		urlMap.put("direction1", "ADMIN Role 로그인 후에 접근 가능");
		urlMap.put("direction2", "admin/test");
		urlList.add(urlMap);

		map.put("urlList", urlList);
		return ResponseEntity.status(HttpStatus.OK).body(map);
	}

	@GetMapping("/expired")
	public Map<String, Object> expired() {
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("session", "expired");
		map.put("isLogin", LoginUtil.isLogin());
		return map;
	}

	@GetMapping("/invalid")
	public Map<String, Object> invalid() {
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("session", "invalid");
		map.put("isLogin", LoginUtil.isLogin());
		return map;
	}
}
