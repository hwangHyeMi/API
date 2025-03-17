package api.base.front.board.vo;

import api.base.com.vo.MessageDto;
import lombok.Data;
import lombok.ToString;
@ToString
@Data

public class BoardDto extends MessageDto{
	private static final long serialVersionUID = 1L;
    private Long boardId;
    private String title;
    private String content;
    private int viewCount;
    private String createDate;
    private String modifiedDate;
    private String mbrNm;
    private Long mbrSeq;
    private String viewYn;
    private String attachId;
}
