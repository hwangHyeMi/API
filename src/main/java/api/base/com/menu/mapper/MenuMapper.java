package api.base.com.menu.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import api.base.com.menu.vo.MenuVO;

@Mapper
public interface MenuMapper {

	List<?> selectFrontTopMenuList(MenuVO vo);

	List<?> selectFrontSubMenuList(MenuVO vo);

}
