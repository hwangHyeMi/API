package api.base.com.file.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import api.base.com.file.mapper.FileMapper;
import api.base.com.file.vo.FileDto;
import api.base.com.file.vo.FileVO;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class FileServiceImpl implements FileService {

	@Autowired
	private FileMapper mapper;

	@Override
	public List<FileDto> selectListFile(FileVO vo) {
		return mapper.selectListFile(vo);
	}

	@Override
	public FileDto selectDetailFile(FileVO vo) {
		return mapper.selectDetailFile(vo);
	}

	@Override
	public int insertFile(FileDto dto) {
		return mapper.insertFile(dto);
	}

	@Override
	public int deleteFile(FileDto dto) {
		return mapper.deleteFile(dto);
	}
	@Override
	public int updateNewFileUpLoadToWorkAttachId(String attachKey, String attachId, String workKey) {
		Map<String, Object> reqMap = new HashMap<String, Object>();
		reqMap.put("workKey", workKey);
		reqMap.put("attachId", attachId);
		if ("board".equals(attachKey)) {
			mapper.updateNewFileUpLoadToBoardAttachId(reqMap);
		} else if ("TODO".equals(attachKey)) {
			mapper.updateNewFileUpLoadToTodoAttachId(reqMap);
		}
		return 1;
	}
}
