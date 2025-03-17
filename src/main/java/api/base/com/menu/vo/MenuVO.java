package api.base.com.menu.vo;

import java.io.Serializable;

import lombok.Data;

@Data
public class MenuVO implements Serializable {
	private static final long serialVersionUID = 1L;
	
	private String userType;
	private Long topMenuSeq;

}
