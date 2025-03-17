package api.base.com.vo;

import java.io.Serializable;

import org.springframework.data.domain.Pageable;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@ToString
@Getter
@Setter
@NoArgsConstructor
public class SearchVO implements Serializable {
	private static final long serialVersionUID = 1L;

	/** <sql id="" ... >> <include refid = "" ... 방식 사용시 조각 쿼리 쪽에서 requestList 의 data(vo) 를 인식 하지 못함
	 * 빌드 방식 : RequestList<?> requestList = RequestList.builder().data(vo).pageable(pageable).build()
	 * 변경 사용 : Controller 에서 public ResponseEntity<?> selectList(VO vo, Pageable pageable) { ... vo.setPageable(pageable);
	*/
	private Pageable pageable;

	/** 검색조건 */
	private String searchCondition = "";
	/** 검색키워드 */
	private String searchKeyword = "";

}
