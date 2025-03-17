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
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequiredArgsConstructor
@RequestMapping(value = "/dev/todo", method = { RequestMethod.GET, RequestMethod.POST })
@Slf4j
public class TodoController {

	@Autowired
	private TodoService todoService;

	@SuppressWarnings({ "unchecked", "rawtypes" })
	@GetMapping("/list")
	@PostMapping("/list")
	public ResponseEntity<List<Map>> todoList(TodoVO vo) {
		// String servletPath = request.getServletPath();

		List<Map> todoList = (List<Map>) todoService.selectTodoList(vo);

		return ResponseEntity.status(HttpStatus.OK).body(todoList);
	}

	@GetMapping("/save")
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

	@GetMapping("/delete")
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
