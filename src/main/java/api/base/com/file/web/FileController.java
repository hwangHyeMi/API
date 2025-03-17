package api.base.com.file.web;

import java.io.BufferedOutputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.zip.ZipOutputStream;

import org.apache.tomcat.util.http.fileupload.IOUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.util.UriUtils;

import api.base.com.exceptions.FileException;
import api.base.com.file.service.FileService;
import api.base.com.file.vo.FileDto;
import api.base.com.file.vo.FileVO;
import api.base.com.util.FileUtil;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequiredArgsConstructor
@RequestMapping(value = "/com/file", method = { RequestMethod.GET, RequestMethod.POST })
@Slf4j
public class FileController {

	@Autowired
	private FileService fileService;
	@Autowired
	private FileUtil fileUtil;

	public static final String APPLICATION_ZIP = "application/zip";

	/**
	 * 첨부 파일 목록
	 * 
	 * @param vo
	 * @return
	 */
	@GetMapping("/list")
	@PostMapping("/list")
	public ResponseEntity<?> selectListFile(FileVO vo) {
		if (!StringUtils.hasText(vo.getAttachKey()))
			throw new FileException("AttachKey 는 필수 값입니다.", HttpStatus.PAYMENT_REQUIRED);
		if (!StringUtils.hasText(vo.getAttachId()))
			throw new FileException("AttachId 는 필수 값입니다.", HttpStatus.PAYMENT_REQUIRED);

		return ResponseEntity.status(HttpStatus.OK).body(fileService.selectListFile(vo));
	}

	/**
	 * 이미지 파일 일경우 웹 보기용
	 * 
	 * @param vo
	 * @return
	 * @throws MalformedURLException
	 */
	@GetMapping("/images/{attachId}/{fileSeq}")
	public ResponseEntity<UrlResource> downloadImage(FileVO vo) throws MalformedURLException {
		FileDto dto = fileService.selectDetailFile(vo);
		UrlResource resource = new UrlResource("file:" + dto.getFilePath());
		String encodedFileName = UriUtils.encode(dto.getOriginFileName(), StandardCharsets.UTF_8);
		String contentDisposition = "attachment; filename=\"" + encodedFileName + "\"";
		return ResponseEntity.status(HttpStatus.OK).header(HttpHeaders.CONTENT_DISPOSITION, contentDisposition).body(resource);
	}

	/**
	 * 첨부파일 다운로드(FileSeq 단위)
	 * 
	 * @param vo
	 * @return
	 * @throws MalformedURLException
	 */
	@GetMapping("/download")
	@PostMapping("/download")
	public ResponseEntity<UrlResource> downloadFile(FileVO vo) throws MalformedURLException {
		if (!StringUtils.hasText(vo.getAttachKey()))
			throw new FileException("AttachKey 는 필수 값입니다.", HttpStatus.PAYMENT_REQUIRED);
		if (!StringUtils.hasText(vo.getAttachId()))
			throw new FileException("AttachId 는 필수 값입니다.", HttpStatus.PAYMENT_REQUIRED);
		if (vo.getFileSeq() == null)
			throw new FileException("FileSeq 는 필수 값입니다.", HttpStatus.PAYMENT_REQUIRED);

		FileDto dto = fileService.selectDetailFile(vo);
		UrlResource resource = null;
		try {
			resource = new UrlResource("file:" + dto.getFilePath());
		} catch (MalformedURLException e) { // 파일 없음 처리
			throw new FileException("다운로드 리소스 정보가 없습니다.", HttpStatus.NOT_FOUND);
		}

		String encodedFileName = UriUtils.encode(dto.getOriginFileName(), StandardCharsets.UTF_8);

		String contentDisposition = "attachment; filename=\"" + encodedFileName + "\"";
		return ResponseEntity.status(HttpStatus.OK).header(HttpHeaders.CONTENT_DISPOSITION, contentDisposition).body(resource);
	}

	/**
	 * 첨부파일 다운로드 - 전체(AttachId 단위)
	 * 
	 * @param vo
	 * @param response
	 * @return
	 * @throws IOException
	 */
	@GetMapping(value = "/downloadAll", produces = APPLICATION_ZIP)
	@PostMapping(value = "/downloadAll", produces = APPLICATION_ZIP)
	public ResponseEntity<byte[]> downloadFileAll(FileVO vo, HttpServletResponse response) throws IOException {

		if (!StringUtils.hasText(vo.getAttachKey()))
			throw new FileException("AttachKey 는 필수 값입니다.", HttpStatus.PAYMENT_REQUIRED);
		if (!StringUtils.hasText(vo.getAttachId()))
			throw new FileException("AttachId 는 필수 값입니다.", HttpStatus.PAYMENT_REQUIRED);

		ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
		BufferedOutputStream bufferedOutputStream = new BufferedOutputStream(byteArrayOutputStream);
		ZipOutputStream zipOutputStream = new ZipOutputStream(bufferedOutputStream);

		List<FileDto> fileList = fileService.selectListFile(vo);
		String zipFileName = "";
		int fileCnt = fileList.size();
		if (fileList != null && fileCnt > 0) {
			// zip File Name 가공
			zipFileName = fileUtil.makeZipFileName(fileList);
			// originFileName 중복 체크 및 재가공
			fileUtil.chkoriginFileNames(fileList);
			try {
				fileUtil.addFilesToArchive(zipOutputStream, fileList);
			} catch (IOException e) { // 파일 없음 처리
				throw new FileException("다운로드 리소스 정보가 없습니다.", HttpStatus.NOT_FOUND);
			}

		} else {
			throw new FileException("다운로드 리소스 정보가 없습니다.", HttpStatus.NOT_FOUND);
		}

		IOUtils.closeQuietly(bufferedOutputStream);
		IOUtils.closeQuietly(byteArrayOutputStream);

		String encodedFileName = UriUtils.encode(zipFileName, StandardCharsets.UTF_8);
		String contentDisposition = "attachment; filename=\"" + encodedFileName + "\"";
		return ResponseEntity.status(HttpStatus.OK).header(HttpHeaders.CONTENT_DISPOSITION, contentDisposition).body(byteArrayOutputStream.toByteArray());
	}

	/**
	 * 첨부 파일 업로드
	 * 
	 * @param vo
	 * @param dto
	 * @param multipartFiles
	 * @return
	 */
	@GetMapping("/upLoad")
	@PostMapping("/upLoad")
	public ResponseEntity<Map<String, Object>> upLoad(FileVO vo, FileDto dto, @RequestParam("mutipartFiles") List<MultipartFile> multipartFiles) {
		if (!StringUtils.hasText(vo.getAttachKey()))
			throw new FileException("AttachKey 는 필수 값입니다.", HttpStatus.PAYMENT_REQUIRED);

		Map<String, Object> rsMap = new HashMap<String, Object>();

		//1.파일업로드 (disk)
		String attachId = fileUtil.uploadFiles(multipartFiles, vo.getAttachKey(), vo.getAttachId());
		// isEmpty > deprecated > hasText or hasLength 
		if (!StringUtils.hasText(vo.getAttachId())) {
			if (StringUtils.hasText(vo.getAttachKey()) && StringUtils.hasText(attachId)) {
				if (StringUtils.hasText(vo.getWorkKey())) {// 최초 업로드 업무 키 자동 매핑 처리(메인 들이 등록 된 상태면 저장 버튼 안눌러도 되도록 처리)
					if (!"null".equals(vo.getWorkKey().toLowerCase())) {
						fileService.updateNewFileUpLoadToWorkAttachId(vo.getAttachKey(), attachId, vo.getWorkKey());
					}
				}
			}
		}
		vo.setAttachKey(dto.getAttachKey());
		vo.setAttachId(attachId);

		rsMap.put("attachList", fileService.selectListFile(vo));
		rsMap.put("attachId", attachId);
		rsMap.put("returnCnt", multipartFiles.size());
		rsMap.put("message", "업로드 완료.");
		return ResponseEntity.status(HttpStatus.OK).body(rsMap);

	}

	/**
	 * 첨부 파일 삭제(FileSeq 단위)
	 * 
	 * @param vo
	 * @param dto
	 * @return
	 */
	@GetMapping("/delete")
	@PostMapping("/delete")
	public ResponseEntity<Map<String, Object>> delete(FileVO vo, FileDto dto) {
		if (!StringUtils.hasText(vo.getAttachKey()))
			throw new FileException("AttachKey 는 필수 값입니다.", HttpStatus.PAYMENT_REQUIRED);
		if (!StringUtils.hasText(vo.getAttachId()))
			throw new FileException("AttachId 는 필수 값입니다.", HttpStatus.PAYMENT_REQUIRED);
		if (vo.getFileSeq() == null)
			throw new FileException("FileSeq 는 필수 값입니다.", HttpStatus.PAYMENT_REQUIRED);

		Map<String, Object> rsMap = new HashMap<String, Object>();

		int cnt = fileService.deleteFile(dto);

		rsMap.put("attachList", fileService.selectListFile(vo));
		rsMap.put("attachId", vo.getAttachId());
		rsMap.put("returnCnt", cnt);
		rsMap.put("message", "삭제 완료.");
		return ResponseEntity.status(HttpStatus.OK).body(rsMap);

	}

	/**
	 * 첨부 파일 삭제 - 전체(AttachId 단위)
	 * 
	 * @param vo
	 * @return
	 */
	@GetMapping("/deleteAll")
	@PostMapping("/deleteAll")
	public ResponseEntity<Map<String, Object>> deleteAll(FileVO vo) {
		if (!StringUtils.hasText(vo.getAttachKey()))
			throw new FileException("AttachKey 는 필수 값입니다.", HttpStatus.PAYMENT_REQUIRED);
		if (!StringUtils.hasText(vo.getAttachId()))
			throw new FileException("AttachId 는 필수 값입니다.", HttpStatus.PAYMENT_REQUIRED);

		Map<String, Object> rsMap = new HashMap<String, Object>();

		int cnt = 0;
		List<FileDto> fileList = fileService.selectListFile(vo);
		if (fileList != null && fileList.size() > 0) {
			for (Iterator<FileDto> iterator = fileList.iterator(); iterator.hasNext();) {
				FileDto fileDto = (FileDto) iterator.next();
				cnt += fileService.deleteFile(fileDto);
			}
		}

		rsMap.put("attachId", vo.getAttachId());
		rsMap.put("attachList", new ArrayList<FileDto>());
		rsMap.put("returnCnt", cnt);
		rsMap.put("message", "삭제 완료.");
		return ResponseEntity.status(HttpStatus.OK).body(rsMap);

	}
}
