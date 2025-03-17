package api.base.com.file.service;

import java.nio.file.Path;
import java.util.List;

import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;

import api.base.com.file.vo.FileDto;
import api.base.com.file.vo.FileVO;
import api.base.front.board.vo.BoardDto;
import api.base.front.board.vo.BoardVO;

public interface FileService {

	public List<FileDto> selectListFile(FileVO vo);
	
	public FileDto selectDetailFile(FileVO vo);
		
	public int insertFile(FileDto dto);
	
	public int deleteFile(FileDto dto);
	
	public int updateNewFileUpLoadToWorkAttachId(String attachKey, String attachId, String workKey);

}