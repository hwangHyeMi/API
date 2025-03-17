package api.base.dev.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import api.base.dev.mapper.TodoMapper;
import api.base.dev.vo.TodoDto;
import api.base.dev.vo.TodoVO;

@Service
public class TodoServiceImpl implements TodoService {

	@Autowired
	private TodoMapper todoMapper;

	@Override
	public List<?> selectTodoList(TodoVO vo) {
		return todoMapper.selectTodoList(vo);
	}

	@Override
	public int saveTodo(TodoDto dto) {
		if (dto.getTodoSeq() == null) {
			todoMapper.insertTodo(dto);
			return 1;
		} else {
			return todoMapper.updateTodo(dto);
		}
	}

	public int deleteTodo(TodoDto dto) {
		return todoMapper.deleteTodo(dto);
	}

}
