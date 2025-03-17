package api.base.dev.service;

import java.util.List;

import api.base.dev.vo.TodoDto;
import api.base.dev.vo.TodoVO;

public interface TodoService {

	List<?> selectTodoList(TodoVO vo);

	int saveTodo(TodoDto dto);

	int deleteTodo(TodoDto dto);

}
