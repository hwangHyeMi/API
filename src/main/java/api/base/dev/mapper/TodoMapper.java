package api.base.dev.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import api.base.dev.vo.TodoDto;
import api.base.dev.vo.TodoVO;

@Mapper
public interface TodoMapper {

	List<?> selectTodoList(TodoVO vo);

	void insertTodo(TodoDto dto);

	int updateTodo(TodoDto dto);

	int deleteTodo(TodoDto dto);

}
