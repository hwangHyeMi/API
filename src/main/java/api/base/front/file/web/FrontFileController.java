package api.base.front.file.web;

import java.net.MalformedURLException;
import java.nio.charset.StandardCharsets;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.util.UriUtils;

import api.base.com.file.service.FileService;
import api.base.com.file.vo.FileDto;
import api.base.com.file.vo.FileVO;
import api.base.com.util.FileUtil;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * mif.prunus.com.file.web.FileController 정리 완료 전 까지 이전 구현 유지를 위해 FileController > FrontFileController 리네임
 */
@RestController
@RequiredArgsConstructor
@RequestMapping(value = { "/user/file", "/front/file" }, method = { RequestMethod.GET, RequestMethod.POST })
@Slf4j
public class FrontFileController {

	@Autowired
	private FileService fileService;
	@Autowired
	private FileUtil fileUtil;

	//목록
	@SuppressWarnings({ "unchecked" })
	@GetMapping("/list")
	@PostMapping("/list")
	public ResponseEntity<?> selectListFile(FileVO vo) {

		return ResponseEntity.status(HttpStatus.OK).body(fileService.selectListFile(vo));

	}

	//첨부파일 다운로드
	@SuppressWarnings({ "unchecked" })
	@GetMapping("/download")
	@PostMapping("/download")
	public ResponseEntity<UrlResource> downloadFile(FileVO vo, HttpServletResponse response) throws MalformedURLException{

		log.info("FrontFileController downloadFile FileVO = {}", vo.toString());

		FileDto dto = fileService.selectDetailFile(vo);

		UrlResource resource = new UrlResource("file:" + dto.getFilePath());
		String encodedFileName = UriUtils.encode(dto.getOriginFileName(), StandardCharsets.UTF_8);
		response.addHeader("Access-Control-Expose-Headers", "Content-Disposition");
		// 파일 다운로드 대화상자가 뜨도록 하는 헤더를 설정해주는 것
		String contentDisposition = "attachment; filename=\"" + encodedFileName + "\"";
		return ResponseEntity.status(HttpStatus.OK).header(HttpHeaders.CONTENT_DISPOSITION, contentDisposition).body(resource);

		
	}
}
