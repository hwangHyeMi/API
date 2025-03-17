package api.base.com.mbr.vo;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * -Request-
 * 로그인 요청 dto
 */
@Getter
@Setter
@NoArgsConstructor
public class MbrLoginVO {

    private String userId;
    private String userPwd;
    private String groupCode;

    @Builder
    public MbrLoginVO(String userId, String userPwd, String groupCode) {
        this.userId = userId;
        this.userPwd = userPwd;
        this.groupCode = groupCode;
    }
}
