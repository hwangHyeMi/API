package api.base.dev.web;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import api.base.dev.service.TodoService;
import api.base.dev.vo.TodoDto;
import api.base.dev.vo.TodoVO;
import io.micrometer.common.util.StringUtils;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
@Tag(name = "Todo", description = "업무")
@RestController
@RequiredArgsConstructor
@RequestMapping(value = "/dev/todo")
@Slf4j
public class TodoController {

	@Autowired
	private TodoService todoService;

	@SuppressWarnings({ "unchecked", "rawtypes" })
	@Operation(summary = "Todo 리스트", description = "TodoVO")
	@Parameter(name = "searchTodoGb", description = "Todo구분")
	@Parameter(name = "searchKeyword", description = "검색어")
	@Parameter(name = "searchCondition", description = "검색조건")
	@Parameter(name = "searchTodoState", description = "Todo 상태")
	@Parameter(name = "searchRegDtFrom", description = "발생 시작일자")
	@Parameter(name = "searchRegDtTo", description = "발생 종료일자")
	@PostMapping("/list")
	public ResponseEntity<List<Map>> todoList(TodoVO vo) {
		// String servletPath = request.getServletPath();

		List<Map> todoList = (List<Map>) todoService.selectTodoList(vo);

		return ResponseEntity.status(HttpStatus.OK).body(todoList);
	}
	@Operation(summary = "Todo 저장", description = "TodoDto")
	@Parameter(name = "parentTodoSeq", description = "상위TodoSeq")
	@Parameter(name = "todoGb", description = "Todo구분")
	@Parameter(name = "todoNm", description = "제목")
	@Parameter(name = "todoContent", description = "내용")
	@Parameter(name = "todoState", description = "상태")
	@Parameter(name = "todoProgress", description = "진척도")
	@Parameter(name = "attachId", description = "첨부파일Id")
	@Parameter(name = "reqMbrSeq", description = "요청자seq")
	@Parameter(name = "resMbrSeq", description = "실행자seq")
	//(#{parentTodoSeq}, #{todoGb}, #{todoNm}, #{todoContent}, #{todoState}, #{todoProgress}, #{attachId}, current_timestamp(), CASE WHEN IFNULL(#{todoProgress}, 0) = 100 THEN current_timestamp() ELSE null END, #{reqMbrSeq}, #{resMbrSeq}, 'N');
	@PostMapping("/save")
	public ResponseEntity<TodoDto> todoSave(TodoDto dto) {
		// String servletPath = request.getServletPath();
		log.info("save = {}", dto.toString());
		dto.setReturnCnt(0);

		if (StringUtils.isEmpty(dto.getTodoGb())) {
			dto.setCode("REQUIRED");
			dto.setMessage("구분은 필수 값 입니다.");

			return ResponseEntity.status(HttpStatus.OK).body(dto);
		}
		if (StringUtils.isEmpty(dto.getTodoNm())) {
			dto.setCode("REQUIRED");
			dto.setMessage("제목은 필수 값 입니다.");

			return ResponseEntity.status(HttpStatus.OK).body(dto);
		}
		if (StringUtils.isEmpty(dto.getTodoState())) {
			dto.setCode("REQUIRED");
			dto.setMessage("상태는 필수 값 입니다.");

			return ResponseEntity.status(HttpStatus.OK).body(dto);
		}

		todoService.saveTodo(dto);
		dto.setReturnCnt(1);
		dto.setCode("SUCCESS");
		dto.setMessage("저장되었습니다.");

		return ResponseEntity.status(HttpStatus.OK).body(dto);
	}
	@Operation(summary = "Todo 삭제", description = "TodoDto")
	@Parameter(name = "todoSeq", description = "TodoSeq")
	@PostMapping("/delete")
	public ResponseEntity<TodoDto> todoDelete(TodoDto dto) {
		// String servletPath = request.getServletPath();
		log.info("delete = {}", dto.toString());
		dto.setReturnCnt(0);
		if (dto.getTodoSeq() == null) {
			dto.setCode("REQUIRED");
			dto.setMessage("삭제 대상이 없습니다.");

			return ResponseEntity.status(HttpStatus.OK).body(dto);
		}

		int returnCnt = todoService.deleteTodo(dto);
		dto.setReturnCnt(returnCnt);
		dto.setCode("SUCCESS");
		dto.setMessage("삭제되었습니다.");

		return ResponseEntity.status(HttpStatus.OK).body(dto);
	}

}
