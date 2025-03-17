package api.base.dev.vo;

import api.base.com.vo.MessageDto;
import lombok.Data;
import lombok.ToString;

@ToString
@Data
public class TodoDto extends MessageDto {
	private static final long serialVersionUID = 1L;

	private Long todoSeq;
	private Long parentTodoSeq;
	private String todoGb;
	private String todoNm;
	private String todoContent;
	private String todoState;
	private int todoProgress;
	private String attachId;
	private String reqNm;
	private String resNm;
	private Long reqMbrSeq;
	private Long resMbrSeq;
	


}
