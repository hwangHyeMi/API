package api.base.com.file.vo;

import java.io.Serializable;

import lombok.Builder;
import lombok.Data;
import lombok.ToString;

@ToString
@Data
@Builder
public class FileDto implements Serializable {
	private static final long serialVersionUID = 1L;
	private String attachId;
	private Long fileSeq;
	private String filePath;
	private String fileType;
	private String originFileName;
	private Long fileSize;
	private String extractExt;
	private String attachKey;
	private String createDate;
}
