package api.base.com.mbr.vo;

import java.io.Serializable;

import lombok.Data;

@Data
public class MbrVO implements Serializable {
	private static final long serialVersionUID = 1L;
	private Long mbrSeq;
	private String groupCd;
	private String mbrId;
	private String mbrPw;

	private String situateCd;
	private String situateMsg;
	
	private String mbrLoginYn;
	private String mbrLoginIp;
	private String mbrLoginMac;
	
	private String mbrKey;//jwt.secret 누출 대비 2차 보안
}
