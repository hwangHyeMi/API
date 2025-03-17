package api.base.front.board.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import api.base.front.board.vo.BoardDto;
import api.base.front.board.vo.BoardVO;

public interface BoardService {

	public Page<Map<String, Object>> selectListBoard(BoardVO vo, Pageable pageable);

	public BoardDto selectDetailBoard(BoardVO vo);

	public int insertBoard(BoardDto dto, List<MultipartFile> multipartFiles);

	public int updateBoard(BoardDto dto, ArrayList<String> deleteFileSeqs, List<MultipartFile> multipartFiles);

	public int deleteBoard(BoardDto dto);

}
