package api.base.dev.vo;

import api.base.com.vo.SearchVO;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class TodoVO extends SearchVO{
	private static final long serialVersionUID = 1L;

	private String searchTodoGb;
	private String searchTodoState;
	private String searchRegDtFrom;
	private String searchRegDtTo;

}
