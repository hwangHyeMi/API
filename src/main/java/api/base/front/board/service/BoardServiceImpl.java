package api.base.front.board.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import api.base.com.util.FileUtil;
import api.base.front.board.mapper.BoardMapper;
import api.base.front.board.vo.BoardDto;
import api.base.front.board.vo.BoardVO;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class BoardServiceImpl implements BoardService {

	@Autowired
	private BoardMapper mapper;

	@Autowired
	private FileUtil fileUtil;

	@Value("${project.boardFolder}")
	private String boardFolder;

	@Override
	public Page<Map<String, Object>> selectListBoard(BoardVO vo, Pageable pageable) {

		List<Map<String, Object>> content = mapper.selectListBoard(vo);

		int total = mapper.selectListBoardCount(vo);

		return new PageImpl<>(content, pageable, total);

	}

	@Override
	public BoardDto selectDetailBoard(BoardVO vo) {
		//조회 수 증가 
		BoardDto dto = new BoardDto();
		dto.setViewYn("Y");
		dto.setBoardId(vo.getBoardId());
		mapper.updateBoard(dto);

		return mapper.selectDetailBoard(vo);
	}

	@Override
	public int insertBoard(BoardDto dto, List<MultipartFile> multipartFiles) {
		int cnt = 0;

		//1.파일업로드 (disk)
		String attachId = fileUtil.uploadFiles(multipartFiles, boardFolder, "");

		//2.게시글등록
		dto.setAttachId(attachId);
		cnt = mapper.insertBoard(dto);

		return cnt;

	}

	@Override
	public int updateBoard(BoardDto dto, ArrayList<String> deleteFileSeqs, List<MultipartFile> multipartFiles) {
		String attachId = "";
		int cnt = 0;

		//1.파일삭제 (disk)
		if (null != deleteFileSeqs) {

			fileUtil.deleteFileSeqList(deleteFileSeqs, dto.getAttachId());
		}

		//2.파일업로드 (disk)
		if (dto.getAttachId().equals(null) || dto.getAttachId().equals("")) {
			attachId = fileUtil.uploadFiles(multipartFiles, boardFolder, "");
			dto.setAttachId(attachId);
		} else {
			fileUtil.uploadFiles(multipartFiles, boardFolder, dto.getAttachId());
		}

		//3.게시글수정
		cnt = mapper.updateBoard(dto);

		return cnt;
	}

	@Override
	public int deleteBoard(BoardDto dto) {

		//1.파일삭제 (disk)
		int cnt = fileUtil.deleteFiles(dto.getAttachId());

		//2.게시글삭제
		cnt = mapper.deleteBoard(dto);

		return cnt;
	}
}
