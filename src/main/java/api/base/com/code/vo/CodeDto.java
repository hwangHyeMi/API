package api.base.com.code.vo;

import java.io.Serializable;

import lombok.Data;

@Data
public class CodeDto implements Serializable {
	private static final long serialVersionUID = 1L;

	private Long codeGroupSeq;
	private String codeGroupCd;
	private String codeGroupNm;
	private String codeGroupDescription;

	private Long codeDetailSeq;
	private String codeCd;
	private String codeNm;
	private String codeDescription;
	private String codeRefer1;
	private String codeRefer2;
	private String codeRefer3;
	private String codeRefer4;
	private String codeRefer5;
	private String codeRefer6;
	private String codeRefer7;
	private String codeRefer8;
	private String codeRefer9;
	private String codeRefer10;
}
