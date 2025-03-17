package api.base.com.mbr.vo;

import java.io.Serializable;

import api.base.com.vo.MessageDto;
import lombok.Data;
import lombok.ToString;
@ToString
@Data
public class MbrDto extends MessageDto{
	private static final long serialVersionUID = 1L;
	private String mbrSeq;
	private String mbrId;
	private String mbrPw;
	private String mbrNm;
	private String mbrPon;
	private String mbrLastLoginDt;
	private String mbrLastLoginIp;
	private String mbrLastLoginMac;
	private int mbrLoginFailCnt;
	private String mbrJoinDt;
	private String role;
	private String roles;
	private String email;
	private String mbrKey;
	private String mbrKeyDt;
	private String useYn;
	private String delYn;
	private String attachId;
	private String mbrLoginYn;

}
