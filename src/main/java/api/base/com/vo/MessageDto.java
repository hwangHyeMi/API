package api.base.com.vo;

import java.io.Serializable;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class MessageDto implements Serializable {
	private static final long serialVersionUID = 1L;
	
	private String code;
	private String message;
	private int returnCnt;

}
