package api.base.com.mbr.vo;

import java.io.Serializable;

import lombok.Data;

@Data
public class MbrAuthoritieDto implements Serializable {
	private static final long serialVersionUID = 1L;
	private Long mbrSeq;
	private String authority;
	private String authorityNm;
	private String groupCd;
	private String groupNm;

}
