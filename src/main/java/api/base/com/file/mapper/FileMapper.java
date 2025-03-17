package api.base.com.file.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

import api.base.com.file.vo.FileDto;
import api.base.com.file.vo.FileVO;

@Mapper
public interface FileMapper {

	List<FileDto> selectListFile(FileVO vo);

	FileDto selectDetailFile(FileVO vo);

	Long selectMaxFileSeq(String attachId);

	int insertFile(FileDto dto);

	int deleteFile(FileDto dto);

	int updateNewFileUpLoadToBoardAttachId(Map<String, Object> map);

	int updateNewFileUpLoadToTodoAttachId(Map<String, Object> map);
}
