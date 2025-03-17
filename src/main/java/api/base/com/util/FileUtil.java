package api.base.com.util;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

import org.apache.tomcat.util.http.fileupload.IOUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import api.base.com.file.mapper.FileMapper;
import api.base.com.file.vo.FileDto;
import api.base.com.file.vo.FileVO;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
public class FileUtil {

	@Value("${project.folderPath}")
	private String uploadPath;
	@Value("${project.mbrFolder}")
	private String mbrFolder;

	@Autowired
	private FileMapper mapper;

	/**
	 * 다중 파일 업로드
	 * 
	 * @param multipartFiles - 파일 객체 List
	 * @return DB에 저장할 파일 정보 List
	 */
	public String uploadFiles(final List<MultipartFile> multipartFiles, String attachKey, String attachId) {

		List<FileDto> files = new ArrayList<>();
		Long fileSeq = 0l;

		if ("".equals(attachId)) { //신규생성일때만 
			attachId = UUID.randomUUID().toString().replaceAll("-", ""); //attachId 생성
			log.info("FileUtil.uploadFiles [create*********] attchId ========================> " + attachId);
			log.info("FileUtil.uploadFiles uploadPath ========================> " + uploadPath);
			log.info("FileUtil.uploadFiles attachKey ========================> " + attachKey);
		} else {
			//fileSeq Max조회하기
			fileSeq = mapper.selectMaxFileSeq(attachId);
			log.info("FileUtil.uploadFiles [update*********] attchId ========================> " + attachId);
			log.info("FileUtil.uploadFiles uploadPath ========================> " + uploadPath);
			log.info("FileUtil.uploadFiles attachKey ========================> " + attachKey);
		}

		log.info("FileUtil.uploadFiles [Max fileSeq]========================> " + fileSeq);
		for (MultipartFile multipartFile : multipartFiles) {
			if (multipartFile.isEmpty()) {
				continue;
			}

			fileSeq++;
			log.info("FileUtil.uploadFiles create fileSeq[" + fileSeq + "]");
			files.add(uploadFile(multipartFile, attachId, fileSeq, attachKey));
		}

		//첨부파일이 정상적으로 업로드 되었을때 db insert 처리
		for (FileDto fileDto : files) {
			log.info("FileUtil.upload FilesFileDto {} " + fileDto.toString());
			int filecnt = mapper.insertFile(fileDto);
		}
		return attachId;
	}

	/**
	 * 단일 파일 업로드
	 * 
	 * @param multipartFile - 파일 객체
	 * @return DB에 저장할 파일 정보
	 */
	public FileDto uploadFile(final MultipartFile multipartFile, String attachId, Long fileSeq, String attachKey) {

		if (multipartFile.isEmpty()) {
			return null;
		}
		log.info("FileUtil.uploadFile separator ========================> " + File.separator);
		String saveName = generateSaveFilename(multipartFile.getOriginalFilename());
		String uploadfilePath = getUploadPath(File.separator + attachKey) + File.separator + saveName;
		File uploadFile = new File(uploadfilePath);
		String fileType = multipartFile.getContentType();
		String extractExt = multipartFile.getOriginalFilename().substring(multipartFile.getOriginalFilename().lastIndexOf("."));

		try {
			multipartFile.transferTo(uploadFile);
		} catch (IOException e) {
			throw new RuntimeException(e);
		}

		return FileDto.builder().attachId(attachId).fileSeq(fileSeq).filePath(uploadfilePath).fileType(fileType).originFileName(multipartFile.getOriginalFilename()).fileSize(multipartFile.getSize()).extractExt(extractExt).attachKey(attachKey).build();
	}

	/**
	 * 저장 파일명 생성
	 * 
	 * @param filename 원본 파일명
	 * @return 디스크에 저장할 파일명 (확장자 제외 by csj 요청사항)
	 */
	private String generateSaveFilename(final String filename) {
		String uuid = UUID.randomUUID().toString().replaceAll("-", "");
		String extension = StringUtils.getFilenameExtension(filename);
		return uuid;
		//return uuid + "." + extension;
	}

	/**
	 * 업로드 경로 반환
	 * 
	 * @return 업로드 경로
	 */
	private String getUploadPath() {
		return makeDirectories(uploadPath);
	}

	/**
	 * 업로드 경로 반환
	 * 
	 * @param addPath - 추가 경로
	 * @return 업로드 경로
	 */
	private String getUploadPath(final String addPath) {
		return makeDirectories(uploadPath + File.separator + addPath);
	}

	/**
	 * 업로드 폴더(디렉터리) 생성
	 * 
	 * @param path - 업로드 경로
	 * @return 업로드 경로
	 */
	private String makeDirectories(final String path) {
		File dir = new File(path);
		if (dir.exists() == false) {
			dir.mkdirs();
		}
		return dir.getPath();
	}

	/**
	 * 파일 attachId 별 전체삭제 리스트 (from Disk)
	 * 
	 * @param attachId - 첨부파일 아이디
	 * @return 삭제한 파일 수
	 */
	public int deleteFiles(final String attachId) {

		log.info("FileUtil.deleteFiles [attachId] ========================> " + attachId);
		FileVO vo = new FileVO();
		vo.setAttachId(attachId);

		//attachId에 해당하는 파일 목록 
		List<FileDto> files = mapper.selectListFile(vo);
		int cnt = 0;

		//첨부파일 삭제 (디스크)
		for (FileDto fileDto : files) {
			log.info("FileUtil.deleteFiles [filePath] ========================> " + fileDto.getFilePath());
			deleteFile(fileDto.getFilePath());
			mapper.deleteFile(fileDto);
			cnt++;
		}

		return cnt;
	}

	/**
	 * 파일 attachId,fileSeq 삭제
	 * 
	 * @param deleteFilesList - 삭제한 파일리스트
	 * @param attachId - 첨부파일 아이디
	 * @return 삭제한 파일 수
	 */
	public int deleteFileSeqList(final ArrayList<String> deleteFilesList, String attachId) {
		log.info("FileUtil.deleteFileSeqList [attachId] ========================> " + attachId);
		int cnt = deleteFilesList.size();

		log.info("FileUtil.deleteFileSeqList [deleteFilesList.size] ========================> " + deleteFilesList.size());
		//첨부파일 삭제 (디스크)
		deleteFilesList.forEach(fileSeq -> {
			log.info("FileUtil.deleteFileSeqList [fileseq] ========================> " + fileSeq);

			if (!"".equals(fileSeq)) { // deleteFilesList 화면에서 임의로 ""
				FileVO vo = new FileVO();
				vo.setAttachId(attachId);
				vo.setFileSeq(Long.parseLong(fileSeq));
				FileDto file = mapper.selectDetailFile(vo);

				log.info("FileUtil.deleteFileSeqList [filePath] ========================> " + file.getFilePath());
				//첨부파일 삭제 (디스크)
				deleteFile(file.getFilePath());
				//첨부파일 삭제 (DB삭제)
				mapper.deleteFile(file);
			}
		});

		return cnt;
	}

	/**
	 * 파일 삭제 (from Disk)
	 * 
	 * @param filePath - 파일 경로
	 */
	private void deleteFile(final String filePath) {
		File file = new File(filePath);
		if (file.exists()) {
			file.delete();
		}
	}

	/**
	 * getHttpHeader 다운로드 해더정보 가지고오기
	 * 
	 * @param Path - 파일 경로
	 * @param fileName - 파일이름
	 */
	public HttpHeaders getHttpHeader(Path path, String fileName) throws IOException {
		String contentType = Files.probeContentType(path); // content type setting

		HttpHeaders httpHeaders = new HttpHeaders();
		httpHeaders.setContentDisposition(ContentDisposition.builder("attachment") //builder type
				.filename(fileName).build());
		httpHeaders.add(HttpHeaders.CONTENT_TYPE, contentType);
		return httpHeaders;
	}

	/**
	 * zip File Name 가공
	 * 
	 * @param fileList
	 * @return
	 * @throws IOException
	 */
	public String makeZipFileName(List<FileDto> fileList) {
		String zipFileName = "temp.zip";
		int fileCnt = fileList.size();
		if (fileList != null && fileCnt > 0) {
			// zip File Name 가공
			zipFileName = fileList.get(0).getOriginFileName();
			if (StringUtils.hasText(zipFileName) && zipFileName.indexOf(".") > -1) {
				String[] fileNames = zipFileName.split("\\.");
				zipFileName = fileNames[0];
				if (zipFileName.length() > 5) {
					zipFileName = zipFileName.substring(0, 5);
				}
				if (fileCnt < 2) {
					zipFileName = zipFileName + ".zip";
				} else {
					zipFileName = zipFileName + " 외 (" + (fileCnt - 1) + ")건.zip";
				}
			}
		}
		return zipFileName;
	}

	/**
	 * originFileName 중복 체크 및 재가공 (zip 파일 내 중복 파일명 제거)
	 * 
	 * @param fileList
	 * @throws IOException
	 */
	public void chkoriginFileNames(List<FileDto> fileList) {
		int fileCnt = fileList.size();
		if (fileList != null && fileCnt > 0) {
			List<String> chkNameList = new ArrayList<String>();
			for (FileDto file : fileList) {
				String chkName = file.getOriginFileName();
				if (chkNameList.indexOf(chkName) > -1) {
					if (StringUtils.hasText(chkName) && chkName.indexOf(".") > -1) {
						String chkRsName = chkNameList.get(chkNameList.indexOf(chkName));
						String[] chkOldNames = chkRsName.split("\\.");
						String firstOldName = chkOldNames[0];

						String[] chkNames = chkName.split("\\.");
						String firstName = chkNames[0];
						// 재 가공
						if (firstOldName.indexOf("_") > -1) {
							String[] chkReNames = firstOldName.split("_");
							String firstReName = chkReNames[0];
							String chkReNo = chkReNames[1];
							if (chkReNo.matches("[+-]?\\d*(\\.\\d+)?")) {
								firstName = firstReName + "_" + (Integer.valueOf(chkReNo) + 1);
							} else {
								firstName = firstReName + "_1";
							}
						} else {
							firstName = firstName + "_1";
						}
						// 변환
						chkNames[0] = firstName;
						chkName = String.join(".", chkNames);
						file.setOriginFileName(chkName);
					}
				}
				chkNameList.add(chkName);
			}
		}
	}

	/**
	 * ZipOutputStream 처리
	 * 
	 * @param zipOutputStream
	 * @param fileList
	 * @throws IOException
	 */
	public void addFilesToArchive(ZipOutputStream zipOutputStream, List<FileDto> fileList) throws IOException {
		for (FileDto file : fileList) {
			FileSystemResource resource = new FileSystemResource(file.getFilePath());
			ZipEntry zipEntry = new ZipEntry(file.getOriginFileName());
			zipOutputStream.putNextEntry(zipEntry);

			IOUtils.copy(resource.getInputStream(), zipOutputStream);
			zipOutputStream.closeEntry();
		}

		zipOutputStream.finish();
		zipOutputStream.flush();
		IOUtils.closeQuietly(zipOutputStream);
	}

	/**
	 * getPreview byte로 파일 받아오기
	 * 
	 * @param Path - 파일 경로
	 */
	public byte[] getPreview(String filePath) throws IOException {

		if (filePath != "" && filePath != null) {

			Path imagePath = Paths.get(filePath);

		}
		return new byte[0];
	}
}
