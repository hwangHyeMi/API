package api.base.front.board.web;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import api.base.com.file.service.FileService;
import api.base.com.file.vo.FileDto;
import api.base.com.file.vo.FileVO;
import api.base.front.board.service.BoardService;
import api.base.front.board.vo.BoardDto;
import api.base.front.board.vo.BoardVO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequiredArgsConstructor
@RequestMapping(value = { "/user/board", "/front/board" }, method = { RequestMethod.GET, RequestMethod.POST })
@Slf4j
public class BoardController {

	@Autowired
	private BoardService boardService;

	@Autowired
	private FileService fileService;

	//페이징 목록
	@GetMapping("/list")
	@PostMapping("/list")
	public ResponseEntity<?> selectListBoard(BoardVO vo, Pageable pageable) {

		vo.setPageable(pageable);
		return ResponseEntity.status(HttpStatus.OK).body(boardService.selectListBoard(vo, pageable));
	}

	//상세보기
	@SuppressWarnings({ "unchecked", "rawtypes" })
	@GetMapping("/detail")
	@PostMapping("/detail")
	public ResponseEntity<Map<String, Object>> selectDetailBoard(@RequestBody BoardVO vo) {

		log.info("selectDetailBoard BoardVO= {}", vo.toString());

		FileVO filevo = new FileVO();
		Map resultMap = new HashMap();

		//게시판조회
		BoardDto board = (BoardDto) boardService.selectDetailBoard(vo);

		//파일조회
		filevo.setAttachId(board.getAttachId());
		List<FileDto> file = (List<FileDto>) fileService.selectListFile(filevo);

		resultMap.put("board", board);
		resultMap.put("file", file);

		return ResponseEntity.status(HttpStatus.OK).body(resultMap);
	}

	//등록
	@GetMapping("/insert")
	@PostMapping("/insert")
	public ResponseEntity<BoardDto> insertBoard(BoardDto dto, @RequestParam("mutipartFiles") List<MultipartFile> multipartFiles) {

		int cnt = boardService.insertBoard(dto, multipartFiles);

		dto.setReturnCnt(cnt);
		dto.setCode("SUCCESS");
		dto.setMessage("등록되었습니다.");

		return ResponseEntity.status(HttpStatus.OK).body(dto);
	}

	//수정(저장)
	@GetMapping("/update")
	@PostMapping("/update")
	public ResponseEntity<BoardDto> updateBoard(BoardDto dto, @RequestParam(value = "deleteFileSeqs[]", required = false) ArrayList<String> deleteFileSeqs, @RequestParam("mutipartFiles") List<MultipartFile> multipartFiles) {

		int cnt = boardService.updateBoard(dto, deleteFileSeqs, multipartFiles);

		dto.setReturnCnt(cnt);
		dto.setCode("SUCCESS");
		dto.setMessage("저장되었습니다");

		return ResponseEntity.status(HttpStatus.OK).body(dto);
	}

	//삭제
	@GetMapping("/delete")
	@PostMapping("/delete")
	public ResponseEntity<BoardDto> deleteBoard(@RequestBody BoardDto dto) {

		int cnt = boardService.deleteBoard(dto);

		dto.setReturnCnt(cnt);
		dto.setCode("SUCCESS");
		dto.setMessage("삭제되었습니다");

		return ResponseEntity.status(HttpStatus.OK).body(dto);
	}

}
