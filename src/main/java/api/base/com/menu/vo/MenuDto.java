package api.base.com.menu.vo;

import java.io.Serializable;

import lombok.Data;

@Data
public class MenuDto implements Serializable {
	private static final long serialVersionUID = 1L;

	private Long menuSeq;
	private Long parentMenuSeq;
	private Long topMenuSeq;
	private String menuNm;
	private String menuType;
	private String url;
	private String methodKind;
	private String params;
	private String viewNm;
	private int level;
	private String authorityCd;

}
