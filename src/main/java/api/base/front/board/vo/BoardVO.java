package api.base.front.board.vo;

import api.base.com.vo.SearchVO;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
@ToString
@Getter
@Setter
@NoArgsConstructor
public class BoardVO extends SearchVO{
	private static final long serialVersionUID = 1L;
	private Long boardId;
	private Long attachId;
}