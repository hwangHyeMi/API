package api.base.com.menu.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import api.base.com.menu.mapper.MenuMapper;
import api.base.com.menu.vo.MenuVO;

@Service
public class MenuServiceImpl implements MenuService {

	@Autowired
	private MenuMapper menuMapper;

	@Override
	public List<?> selectFrontTopMenuList(MenuVO vo) {
		return menuMapper.selectFrontTopMenuList(vo);
	}

	public List<?> selectFrontSubMenuList(MenuVO vo) {
		return menuMapper.selectFrontSubMenuList(vo);
	}
}
