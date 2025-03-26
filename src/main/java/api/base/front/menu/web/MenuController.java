package api.base.front.menu.web;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import api.base.com.mbr.vo.CustomUserDetails;
import api.base.com.menu.service.MenuService;
import api.base.com.menu.vo.MenuDto;
import api.base.com.menu.vo.MenuVO;
import api.base.com.util.LoginUtil;
import io.swagger.v3.oas.annotations.Hidden;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
@Tag(name = "Menu", description = "메뉴")
@RestController
@RequiredArgsConstructor
@RequestMapping(value = { "/front/menu" })
@Slf4j
public class MenuController {

	@Autowired
	private MenuService menuService;

	@SuppressWarnings({ "unchecked", "rawtypes" })
	@Hidden //api명세에 보이지 않도록 
	@GetMapping("/sampleMenu")
	public ResponseEntity<Map> sampleMenu(HttpServletRequest request, MenuVO vo) {
		Map rsMap = new HashMap();
		
		String servletPath = request.getServletPath();
		vo.setUserType("FRONT");
		if(LoginUtil.isLogin()) {// 회원용 메뉴 정보
			// CustomUserDetails userDetails = (CustomUserDetails) LoginUtil.getUserDetails();
			// List<MbrAuthoritieDto> mbrAuthoritieList = userDetails.getMbrAuthorities();
			
			vo.setUserType("USER");
		}
		rsMap.put("servletPath", servletPath);
		rsMap.put("userType", vo.getUserType());
		return ResponseEntity.status(HttpStatus.OK).body(rsMap);
	}
	@SuppressWarnings({ "unchecked" })
	@Operation(summary = "메뉴 리스트", description = "CustomUserDetails, MenuVO")
	@Parameter(name = "userType", description = "유저구분 (USER/ADMIN/SYSTEMADMIN")
	@GetMapping("/allRolMenuList")
	public ResponseEntity<Map> allRolMenuList(@AuthenticationPrincipal CustomUserDetails member, MenuVO vo) {
		// String servletPath = request.getServletPath();

		vo.setUserType("FRONT");
		List<MenuDto> frontMenuList = (List<MenuDto>) menuService.selectFrontSubMenuList(vo);
		vo.setUserType("USER");
		List<MenuDto> userMenuList = (List<MenuDto>) menuService.selectFrontSubMenuList(vo);

		Map rsMap = new HashMap<>();
		rsMap.put("frontMenuList", frontMenuList);
		rsMap.put("userMenuList", userMenuList);
		
		return ResponseEntity.status(HttpStatus.OK).body(rsMap);
	}
	
	@SuppressWarnings({ "unchecked" })
	@Operation(summary = "전체 메뉴 리스트", description = "CustomUserDetails, MenuVO")
	@Parameter(name = "userType", description = "유저구분 (USER/ADMIN/SYSTEMADMIN")
	@GetMapping("/allMenuList")
	public ResponseEntity<List<MenuDto>> allMenuList(@AuthenticationPrincipal CustomUserDetails member, MenuVO vo) {
		// String servletPath = request.getServletPath();
		
		vo.setUserType("FRONT");
		if(member != null && !member.getUsername().isEmpty()) {// 회원용 메뉴 정보
			// CustomUserDetails userDetails = (CustomUserDetails) LoginUtil.getUserDetails();
			// List<MbrAuthoritieDto> mbrAuthoritieList = userDetails.getMbrAuthorities();
			
			vo.setUserType("USER");
			
			menuService.selectFrontSubMenuList(vo);
		}
		return ResponseEntity.status(HttpStatus.OK).body( (List<MenuDto>) menuService.selectFrontSubMenuList(vo));
	}

	@SuppressWarnings({ "unchecked" })
	@Operation(summary = "Top 메뉴 리스트", description = "HttpServletRequest, MenuVO")
	@Parameter(name = "userType", description = "유저구분 (USER/ADMIN/SYSTEMADMIN")
	@GetMapping("/topMenuList")
	@PostMapping("/topMenuList")
	public ResponseEntity<List<MenuDto>> topMenuList(HttpServletRequest request, MenuVO vo) {
		//String servletPath = request.getServletPath();
		
		vo.setUserType("FRONT");
		if(LoginUtil.isLogin()) {// 회원용 메뉴 정보
			// CustomUserDetails userDetails = (CustomUserDetails) LoginUtil.getUserDetails();
			// List<MbrAuthoritieDto> mbrAuthoritieList = userDetails.getMbrAuthorities();
			
			vo.setUserType("USER");
		}
		return ResponseEntity.status(HttpStatus.OK).body( (List<MenuDto>) menuService.selectFrontTopMenuList(vo));
	}

	@SuppressWarnings({ "unchecked" })
	@Operation(summary = "Sub 메뉴 리스트", description = "HttpServletRequest, MenuVO")
	@Parameter(name = "userType", description = "유저구분 USER/ADMIN/SYSTEMADMIN")
	@Parameter(name = "topMenuSeq", description = "Top메뉴seq")
	@GetMapping("/subMenuList")
	@PostMapping("/subMenuList")
	public ResponseEntity<List<MenuDto>> subMenuList(HttpServletRequest request, MenuVO vo) {
		// String servletPath = request.getServletPath();
		
		vo.setUserType("FRONT");
		if(LoginUtil.isLogin()) {// 회원용 메뉴 정보
			// CustomUserDetails userDetails = (CustomUserDetails) LoginUtil.getUserDetails();
			// List<MbrAuthoritieDto> mbrAuthoritieList = userDetails.getMbrAuthorities();
			
			vo.setUserType("USER");
			
			menuService.selectFrontSubMenuList(vo);
		}
		return ResponseEntity.status(HttpStatus.OK).body( (List<MenuDto>) menuService.selectFrontSubMenuList(vo));
	}

}
