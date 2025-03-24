import { create } from 'zustand';
import * as Bts from 'react-bootstrap';
import * as Icon from 'react-bootstrap-icons';
import axios from 'axios';

const COM_API_URL = `${process.env.REACT_APP_API_URL}`;
const COM_FILE_URL = `${process.env.REACT_APP_COM_FILE_URL}`;
const com_headers = { Authorization: `Bearer ${localStorage.getItem('com_access_token')}` };

let fileProgress = 0;
// description : downLoad options
const downLoad_options = {
  headers: com_headers,
  responseType: 'blob',
  fileFormId: '',
  fileProgresBar: null,
  fileProgresBarCollapse: null,
  onDownloadProgress: function (progressEvent) {
    fileProgress = Math.floor((progressEvent.loaded / progressEvent.total) * 100);

    fnSetProgresBar(downLoad_options.fileProgresBar, fileProgress);
    if (fileProgress >= 100) {
      setTimeout(() => {
        downLoad_options.fileProgresBarCollapse.classList.add('collapse');
      }, 1000);
    }
  },
};
// description : upLoad options
const upLoad_options = {
  headers: com_headers,
  fileFormId: '',
  fileProgresBar: null,
  fileProgresBarCollapse: null,
  onUploadProgress: function (progressEvent) {
    fileProgress = Math.floor((progressEvent.loaded / progressEvent.total) * 100);

    fnSetProgresBar(upLoad_options.fileProgresBar, fileProgress);
    if (fileProgress >= 100) {
      setTimeout(() => {
        upLoad_options.fileProgresBarCollapse.classList.add('collapse');
      }, 1000);
    }
  },
};
// description : ProgresBar 제어
const fnSetProgresBar = (fileProgresBar, fileProgress) => {
  fileProgresBar.ariaValueNow = fileProgress + '';
  fileProgresBar.ariaLabel = fileProgress + '%';
  fileProgresBar.innerText = fileProgress + '%';
  fileProgresBar.style.width = fileProgress + '%';
};
// description : 파일 목록 조회
const fnFileListData = async (fileInfo) => {
  if (fileInfo && fileInfo.attachKey && fileInfo.attachId) {
    try {
      const formData = new FormData();
      formData.append('attachKey', fileInfo.attachKey); // 모듈 구분
      formData.append('attachId', fileInfo.attachId);

      await axios
        .post(COM_FILE_URL + '/list', formData, { headers: com_headers })
        .then((response) => {
          if (response && response.data) {
            if (!response.data.status) {
              // 오류가 있을 경우 App.js 에서 메세지 처리
              fileInfo.attachList = response.data;
            }
          }
          fileStore.setState({ asyncChk: true });
        })
        .finally(function () {
          fileStore.setState({ asyncChk: false });
        });
    } catch (error) {
      throw error;
    }
  }
};
// description : 업로드
const fnFileUpLoad = async (e, fileInfo) => {
  const targetFiles = e.currentTarget.files;
  const FILE_ADD_MAX_CNT = `${process.env.REACT_APP_FILE_ADD_MAX_CNT}`;
  // alert > myAlert 추후 고려
  if (targetFiles.length > Number(FILE_ADD_MAX_CNT)) {
    alert('한번에 등록 할 수 있는 최대 파일 개수 [' + FILE_ADD_MAX_CNT + ']개를 초과 하였습니다.');
    e.currentTarget.value = '';
    return;
  }
  let chkUpLoad = true;
  const targetFilesArray = Array.from(targetFiles);
  if (targetFilesArray && targetFilesArray.length > 0) {
    const FILE_ADD_MAX_SIZE_TXT = `${process.env.REACT_APP_FILE_ADD_MAX_SIZE_TXT}`;
    const FILE_ADD_MAX_SIZE = `${process.env.REACT_APP_FILE_ADD_MAX_SIZE}`;
    // 하나의 부모 글에 최대 파일 개수, 총 최대 용량을 막을 지는 협의 필요
    targetFilesArray.forEach((file, i) => {
      if (fileInfo.accept && '*' !== fileInfo.accept) {
        if ('*' !== fileInfo.accept) {
          // accept: '*'/* 파일 접근 input 제안 및 function 제약 '*' */,
          let chkAccept = false;
          if (file.type) {
            let chkTypes = file.type.split('/');
            if (fileInfo.accept.indexOf(chkTypes[0]) > -1 || fileInfo.accept.indexOf(chkTypes[1]) > -1) {
              chkAccept = true;
            }
          } else {
            let chkTypes = file.name.split('.');
            if (fileInfo.accept.indexOf(chkTypes[chkTypes.length - 1]) > -1) {
              chkAccept = true;
            }
          }
          if (chkAccept === false) {
            alert(file.name + ' 허용 하지 않는 파일 형식입니다.');
            e.currentTarget.value = '';
            chkUpLoad = false;
            return;
          }
          if (file.size > Number(FILE_ADD_MAX_SIZE)) {
            alert(file.name + ' 허용 size(' + FILE_ADD_MAX_SIZE_TXT + ')를 ' + (file.size - Number(FILE_ADD_MAX_SIZE)) + ' B 초과 하였습니다.');
            e.currentTarget.value = '';
            chkUpLoad = false;
            return;
          }
        }
      }
    });
  } else {
    chkUpLoad = false;
  }
  if (chkUpLoad === false) {
    return;
  }
  try {
    fileInfo.setMaskShow(true);
    const formData = new FormData();
    formData.append('attachKey', fileInfo.attachKey); // 모듈 구분
    formData.append('attachId', fileInfo.attachId);
    formData.append('workKey', fileInfo.workKey);
    if (targetFilesArray && targetFilesArray.length > 0) {
      targetFilesArray.forEach((file, i) => {
        formData.append('mutipartFiles', file);
      });
    }
    e.currentTarget.value = '';

    upLoad_options.fileFormId = fileInfo.fileFormId;
    upLoad_options.fileProgresBar = document.querySelector('#' + fileInfo.fileFormId + '_ProgresBar .progress-bar');
    fnSetProgresBar(upLoad_options.fileProgresBar, 0);
    upLoad_options.fileProgresBarCollapse = document.querySelector('#' + fileInfo.fileFormId + '_ProgresBar').parentNode.parentNode;
    upLoad_options.fileProgresBarCollapse.classList.remove('collapse');

    await axios.post(COM_FILE_URL + '/upLoad', formData, upLoad_options).then((response) => {
      if (response && response.data) {
        if (!response.data.status) {
          // 오류가 있을 경우 App.js 에서 메세지 처리
          if (!fileInfo.attachId) {
            fileInfo.attachId = response.data.attachId;
            fileInfo.setAttachId(response.data.attachId);
          }
          fileInfo.attachList = response.data.attachList;
          fileInfo.setMaskShow(false);
          fileInfo.setMyToasts('success', '✨알림', response.data.returnCnt + ' 건', response.data.message);
        }
      }
    });
  } catch (error) {
    throw error;
  }
};
// description : 다운로드(개별/일괄)
const fnFileDownLoad = async (e, downLoadGb, fileInfo, file) => {
  const formData = new FormData();
  formData.append('attachKey', fileInfo.attachKey); // 모듈 구분
  formData.append('attachId', fileInfo.attachId);
  formData.append('workKey', fileInfo.workKey);

  fileInfo.setMaskShow(true);
  downLoad_options.fileFormId = fileInfo.fileFormId;
  downLoad_options.fileProgresBar = document.querySelector('#' + fileInfo.fileFormId + '_ProgresBar .progress-bar');
  fnSetProgresBar(downLoad_options.fileProgresBar, 0);
  downLoad_options.fileProgresBarCollapse = document.querySelector('#' + fileInfo.fileFormId + '_ProgresBar').parentNode.parentNode;
  downLoad_options.fileProgresBarCollapse.classList.remove('collapse');
  let url = '/download';
  if (downLoadGb === 'A') {
    url = url + 'All';
    fileInfo.setMyToasts('success', '✨알림', '', '서버에서 zip 생성 중입니다.');
  } else {
    formData.append('fileSeq', file.fileSeq);
  }
  await axios
    .post(COM_FILE_URL + url, formData, downLoad_options)
    .then((response) => {
      if (response && response.data) {
        const responseBlob = response.data;
        const disposition = response.headers['content-disposition'];

        const isFile = responseBlob instanceof Blob && typeof disposition !== 'undefined';

        if (isFile) {
          const fileObjectUrl = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = fileObjectUrl;
          link.style.display = 'none';

          const extractDownloadFilename = (response) => {
            const disposition = response.headers['content-disposition'];
            const fileName = decodeURI(disposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/)[1].replace(/['"]/g, ''));
            return fileName;
          };

          link.download = extractDownloadFilename(response);

          document.body.appendChild(link);
          link.click();

          link.remove(); // 다운로드가 끝난 리소스(객체 URL)를 해제합니다.
          window.URL.revokeObjectURL(fileObjectUrl);
        } else {
          responseBlob.text().then((text) => {
            const res = JSON.parse(text);
            console.log(res);
            if (!response.data.status) {
              fileInfo.setMyToasts('warning', '✨알림', '[' + res.divisionCode + ']', '파일이 존재 하지 않습니다.');
            }
          });
        }
      }
      fileInfo.setMaskShow(false);
    })
    .catch((error) => {
      console.error(error);
    });
};
// description : file 삭제
const fnRemoveFile = async (e, delGb, fileInfo, file) => {
  if (fileInfo.attachId && ((file && file.fileSeq) || delGb === 'A')) {
    fileInfo.setMaskShow(true);
    const formData = new FormData();
    formData.append('attachKey', fileInfo.attachKey); // 모듈 구분
    formData.append('attachId', fileInfo.attachId);

    let url = '/delete';
    if (delGb === 'A') {
      url = url + 'All';
    } else {
      formData.append('fileSeq', file.fileSeq);
    }
    try {
      await axios.post(COM_FILE_URL + url, formData, { headers: com_headers }).then((response) => {
        if (response && response.data) {
          if (!response.data.status) {
            // 오류가 있을 경우 App.js 에서 메세지 처리
            fileInfo.attachList = response.data.attachList;
            fileInfo.setMaskShow(false);
            fileInfo.setMyToasts('success', '✨알림', response.data.returnCnt + ' 건', response.data.message);
          }
        }
      });
    } catch (error) {
      throw error;
    }
  }
};
// description : 이미지 원본 보기 팝업
const fnOpenImage = (e, v_url) => {
  var image = new Image();
  image.src = v_url;

  var imagePopup = window.open('_blank', 'imageView');
  imagePopup.document.write(image.outerHTML);
  imagePopup.document.close();
};
// description : 디폴트 UI 세팅 > Form 외부에 배치 type="submit" 버튼은 form="FormId" 로 외부에서 처리 > 데이터 로드 처리 : getFileListData(fileInfo)
const fnCreateFileForm = (fileInfo) => {
  return (
    <>
      {fileInfo && fileInfo.attachId && fileInfo.attachList.length > 1 ? (
        <Bts.Row className="m-1 hstack">
          <Bts.Col className="">
            {fileInfo.delYn === true ? (
              <span
                className="remove"
                onClick={(evt) => {
                  fnRemoveFile(evt, 'A', fileInfo);
                }}
              >
                <Icon.XSquare />
                &nbsp; 전체 삭제
              </span>
            ) : (
              ''
            )}
          </Bts.Col>
          <Bts.Col>
            {fileInfo.downYn === true ? (
              <span
                className="downloader"
                onClick={(evt) => {
                  fnFileDownLoad(evt, 'A', fileInfo);
                }}
              >
                <Icon.CloudDownload />
                &nbsp; 전체 다운로드
              </span>
            ) : (
              ''
            )}
          </Bts.Col>
          <Bts.Col>&nbsp;</Bts.Col>
          <Bts.Col>&nbsp;</Bts.Col>
        </Bts.Row>
      ) : (
        ''
      )}
      <Bts.Collapse in={false} className="hstack">
        <Bts.Row className="m-1 hstack ">
          <Bts.Col>
            <Bts.ProgressBar striped={fileInfo.striped ? fileInfo.striped : true} animated={fileInfo.striped === true ? true : false} variant={fileInfo.variant ? fileInfo.variant : 'info'} id={fileInfo.fileFormId + '_ProgresBar'} now={fileProgress} label={fileProgress + '%'} style={{ width: '30%' }} />
          </Bts.Col>
        </Bts.Row>
      </Bts.Collapse>
      {/* 특정 높이 이상은 스크롤바 추후 적용 */}
      <Bts.Row className="m-1">
        <Bts.Col>
          <Bts.Form.Group controlId="filelist">
            <div>
              {fileInfo.attachList.map((file, i) => (
                <div key={file.fileSeq}>
                  {fileInfo.delYn === true ? (
                    <span className="remove">
                      <Icon.XSquare
                        onClick={(evt) => {
                          fnRemoveFile(evt, 'S', fileInfo, file);
                        }}
                      />
                    </span>
                  ) : (
                    ''
                  )}
                  &nbsp;
                  <span>
                    {i + 1}.&nbsp;{file.originFileName}
                  </span>
                  &nbsp;
                  {fileInfo.downYn === true ? (
                    <span className="downloader">
                      <Icon.CloudDownload
                        onClick={(evt) => {
                          fnFileDownLoad(evt, 'S', fileInfo, file);
                        }}
                      />
                    </span>
                  ) : (
                    ''
                  )}
                  {'image/png' === file.fileType ? (
                    <>
                      &nbsp;
                      <span
                        className="downloader"
                        onClick={(evt) => {
                          fnOpenImage(evt, COM_API_URL + COM_FILE_URL + '/images/' + file.attachId + '/' + file.fileSeq);
                        }}
                      >
                        <Bts.Image src={COM_API_URL + COM_FILE_URL + '/images/' + file.attachId + '/' + file.fileSeq} width={30} height={30} thumbnail></Bts.Image>
                        &nbsp;
                        <Icon.Search></Icon.Search>
                      </span>
                    </>
                  ) : (
                    ''
                  )}
                </div>
              ))}
            </div>
          </Bts.Form.Group>
        </Bts.Col>
      </Bts.Row>
      {/* 파일 선택 영역 */}
      {fileInfo.addYn === true ? (
        <Bts.Row className="m-1">
          <Bts.Col>
            <Bts.Form.Group controlId="mutipartFiles">
              {/* TODO 파일 선택 종류 세팅 추후 구현 accept */}
              <Bts.Form.Control
                type="file"
                multiple={fileInfo.multiple ? fileInfo.multiple : false}
                name="mutipartFiles"
                accept={fileInfo.accept ? fileInfo.accept : '*'}
                onChange={(evt) => {
                  fnFileUpLoad(evt, fileInfo);
                }}
              />
            </Bts.Form.Group>
          </Bts.Col>
        </Bts.Row>
      ) : (
        ''
      )}
    </>
  );
};
// description :
// 1.선언
// import fileStore from 'interface/fileStore';
// const { getFileListData, initFileForm } = fileStore((state) => {return state;});
//  const { getMbrSeq } = useLoginStore((state) => {return state;});

// 2. 설정 값 세팅
// const [attachKey] = useState('업무 구분 키');
// const [attachId, setAttachId] = useState('');
// const [attachList] = useState([]);
// const [attachInfo, setAttachInfo] = useState({
// striped: true /* ProgressBar striped 여부 디폴트 true */,
// variant: 'warning' /* ProgressBar variant ['success' | 'danger' | 'warning' | 'info']  디폴트 info */,
// multiple: true /* multiple 여부 디폴트 false */,
// https://life-is-potatoo.tistory.com/29
// https://www.iana.org/assignments/media-types/media-types.xhtml
// accept: '*'/* 파일 접근 input 제안 및 function 제약 '*' */,
// downYn: true /* multiple 여부 디폴트 true */,
// addYn: true /* 추가 여부 디폴트 true */,
// delYn: false /* multiple 여부 디폴트 false */,
// fileFormId: 'FileStore Control ID' /*한 화면에 1개 이상의 첨부 파일 대비 */,
// attachKey: attachKey,
// attachId: attachId,
// setAttachId: setAttachId/* 메인 화면에 변경 된 값 실시간 적용(최초등록 아이디 발급 결과) */,
// workKey: null/* 메인 정보가 등록 된상태에서 메인 정보의 키값 세팅시 최초 업로드시 attachId 자동 업데이트 */,
// attachList: attachList,
// setMaskShow: props.setMaskShow/* 메인 화면의 MaskShow 공용 사용 */,
// setMyToasts: setMyToasts/* 메인 화면의 MyToasts 공용 사용 */,
// });

// 3. 디폴트 UI 배치
/* Form 외부에 배치 type="submit" 버튼은 form="regTodoForm" 로 외부에서 처리 */
//<Bts.Row className="m-1">
//  <Bts.Form.Group as={Bts.Col} md="12">
//    {initFileForm(attachInfo)}
//  </Bts.Form.Group>
//</Bts.Row>

// 3.attach_id 및 상황에 맞는 제어권 세팅
// 수정 화면 가정. data = 메인 정보
// attachInfo.attachId = data.attach_id;
// attachInfo.addYn = data.req_mbr_seq == getMbrSeq() ? true:false;
// attachInfo.delYn = data.req_mbr_seq == getMbrSeq() ? true:false;
// setAttachInfo(attachInfo); // 설정 정보 갱신
// 4. 첨부 파일 데이터 로드
// getFileListData(attachInfo);

const fileStore = create((set) => ({
  asyncChk: false, // async / await >> then :  fileStore.setState({ asyncChk: true }); 필수 (아무 변수 값이나 setState 를 해주는 것이 핵심)
  getFileListData: (fileInfo) => {
    fnFileListData(fileInfo);
  },
  initFileForm: (fileInfo) => {
    //if (fileInfo.attachId) fnFileListData(fileInfo); // 무한 루프 유발
    return fnCreateFileForm(fileInfo);
  },
}));
export default fileStore;
