package api.base.com.menu.service;

import java.util.List;

import api.base.com.menu.vo.MenuVO;

public interface MenuService {

	List<?> selectFrontTopMenuList(MenuVO vo);

	List<?> selectFrontSubMenuList(MenuVO vo);
}
