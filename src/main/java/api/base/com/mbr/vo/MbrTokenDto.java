package api.base.com.mbr.vo;

import java.util.List;

import api.base.com.cmm.Role;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * -Response-
 * 사용자 정보 반환 + token Dto
 */

@Getter
@Setter
@NoArgsConstructor
public class MbrTokenDto {
    private String mbrId;
    private String token;
    
    private Long mbrSeq;
    private String mbrNm;
    private String groupCode;
    private int mbrLoginFailCnt;
    
    private Role role;
	private Role roles;
	private String mbrKey;//jwt.secret 누출 대비 2차 보안
	
	private List<MbrAuthoritieDto> mbrAuthorities;

	@Builder
	public MbrTokenDto(String mbrId, String token, Long mbrSeq, String mbrNm, String mbrKey, String groupCode, List<MbrAuthoritieDto> mbrAuthorities, int mbrLoginFailCnt, Role role) {
		this.mbrId = mbrId;
		this.token = token;
		this.mbrSeq = mbrSeq;
		this.mbrNm = mbrNm;
		this.mbrKey = mbrKey;
		this.groupCode = groupCode;
		this.mbrAuthorities = mbrAuthorities;
		this.mbrLoginFailCnt = mbrLoginFailCnt;
		this.role = role;
		this.roles = role;
	}
	public void setMbrAuthorities(List<MbrAuthoritieDto> mbrAuthorities) {
		this.mbrAuthorities = mbrAuthorities;
	}

	public void role(Role role) {
    	this.role = role;
    	this.roles = role;
	}

    // Entity -> DTO
    public static MbrTokenDto fromEntity(CustomUserDetails member, String token) {
        return MbrTokenDto.builder()
        		.mbrId(member.getUsername())
                .token(token)
                .mbrSeq(member.getMbrSeq())
                .mbrNm(member.getMbrNm())
                .mbrKey(member.getMbrKey())
                .groupCode(member.getGroupCode())
                .mbrAuthorities(member.getMbrAuthorities())
                .mbrLoginFailCnt(member.getMbrLoginFailCnt())
                .role(member.getRole())
                .build();
    }
}
