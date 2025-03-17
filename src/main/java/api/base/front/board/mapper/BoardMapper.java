package api.base.front.board.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

import api.base.front.board.vo.BoardDto;
import api.base.front.board.vo.BoardVO;

@Mapper
public interface BoardMapper {

	List<Map<String, Object>> selectListBoard(BoardVO vo);

	int selectListBoardCount(BoardVO vo);

	BoardDto selectDetailBoard(BoardVO vo);

	int insertBoard(BoardDto dto);

	int updateBoard(BoardDto dto);

	int deleteBoard(BoardDto dto);

}
