package api.base.com.cmm.data;

import org.springframework.data.domain.Pageable;
import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class RequestList<T> {
	
	private T data;
	private Pageable pageable;
}
