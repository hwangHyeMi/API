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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import api.base.com.file.service.FileService;
import api.base.com.file.vo.FileDto;
import api.base.com.file.vo.FileVO;
import api.base.front.board.service.BoardService;
import api.base.front.board.vo.BoardDto;
import api.base.front.board.vo.BoardVO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Tag(name = "Board", description = "게시판")
@RestController
@RequiredArgsConstructor
@RequestMapping(value = { "/front/board" })
@Slf4j
public class BoardController {

	@Autowired
	private BoardService boardService;

	@Autowired
	private FileService fileService;

	//페이징 목록 @Hidden 무시되는 api
	@Operation(summary = "게시판 리스트", description = "BoardVO, Pageable")
	@Parameter(name = "searchCondition", description = "검색조건")
	@Parameter(name = "searchWord", description = "검색어")
	@Parameter(name = "Pageable", description = "Pagenation 정보")
	@GetMapping("/list")
	public ResponseEntity<?> selectListBoard(BoardVO vo, Pageable pageable) {

		vo.setPageable(pageable);
		return ResponseEntity.status(HttpStatus.OK).body(boardService.selectListBoard(vo, pageable));
	}

	//상세보기
	@Operation(summary = "게시판 상세보기", description = "@RequestBody BoardVO 전송")
	@Parameter(name = "boardId", description = "게시판ID")
	@SuppressWarnings({ "unchecked", "rawtypes" })
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
	@Operation(summary = "게시판 등록", description = "BoardDto ,@RequestParam mutipartFiles 전송")
	@PostMapping("/insert")
	public ResponseEntity<BoardDto> insertBoard(BoardDto dto, @RequestParam("mutipartFiles") List<MultipartFile> multipartFiles) {

		int cnt = boardService.insertBoard(dto, multipartFiles);

		dto.setReturnCnt(cnt);
		dto.setCode("SUCCESS");
		dto.setMessage("등록되었습니다.");

		return ResponseEntity.status(HttpStatus.OK).body(dto);
	}

	//수정(저장)
	@Operation(summary = "게시판 수정", description = "BoardDto ,@RequestParam deleteFileSeqs[],mutipartFiles 전송")
	@PostMapping("/update")
	public ResponseEntity<BoardDto> updateBoard(BoardDto dto, @RequestParam(value = "deleteFileSeqs[]", required = false) ArrayList<String> deleteFileSeqs, @RequestParam("mutipartFiles") List<MultipartFile> multipartFiles) {

		int cnt = boardService.updateBoard(dto, deleteFileSeqs, multipartFiles);

		dto.setReturnCnt(cnt);
		dto.setCode("SUCCESS");
		dto.setMessage("저장되었습니다");

		return ResponseEntity.status(HttpStatus.OK).body(dto);
	}

	//삭제
	@Operation(summary = "게시판 삭제", description = "@RequestBody BoardDto 전송")
	@PostMapping("/delete")
	public ResponseEntity<BoardDto> deleteBoard(@RequestBody BoardDto dto) {

		int cnt = boardService.deleteBoard(dto);

		dto.setReturnCnt(cnt);
		dto.setCode("SUCCESS");
		dto.setMessage("삭제되었습니다");

		return ResponseEntity.status(HttpStatus.OK).body(dto);
	}

}
