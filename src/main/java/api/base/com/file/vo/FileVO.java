package api.base.com.file.vo;

import java.io.Serializable;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
@ToString
@Getter
@Setter
@NoArgsConstructor
public class FileVO implements Serializable {
	private static final long serialVersionUID = 1L;

	private String attachKey;
	private String attachId;
	private Long fileSeq;
	private String filePath;
	// attachKey 별 PK
	private String workKey;
}