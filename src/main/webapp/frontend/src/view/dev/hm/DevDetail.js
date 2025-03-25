import axios from 'axios';
import httpHeaderStore from 'stores/HttpHeaderStore';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import * as Icon from 'react-bootstrap-icons';

// Toast 관련
import MyToast from 'component/common/MyToast';
import ToastContainer from 'react-bootstrap/ToastContainer';

//          component (props) App.js확인         //
function DevDetail(props) {
  //선언부
  const FRONT_BOARD_URL = `${process.env.REACT_APP_DEV_BOARD_URL}`;
  const FRONT_FILE_URL = `${process.env.REACT_APP_DEV_FILE_URL}`;
  const navigate = useNavigate();
  const { getHeaders } = httpHeaderStore((state) => {
    return state;
  });
  const headers = getHeaders();

  const [validated, setValidated] = useState(false);
  const { topMenuSeq, boardId } = useParams();
  const [bbsDetail, setBbsDetail] = useState({
    //f12오류해결 화면랜더링 전에 초기화필요함.
    boardId: '',
    title: '',
    content: '',
    viewCount: 0,
    createDate: '',
    modifiedDate: '',
    mbrSeq: '',
    attachId: '',
  });

  let detailSave;

  const [fileList, setFileList] = useState([]);
  const [fileDelList, setFileDelList] = useState([]);

  //          function          //
  // Modal.Dialog 관련
  const setMyModialog = (v_backdrop, v_modialogTitle, v_modialogBody, v_btnNm1, v_btnNm2, v_callbackCd) => {
    props.myModialogInfo.backdrop = v_backdrop;
    props.myModialogInfo.modialogTitle = v_modialogTitle;
    props.myModialogInfo.modialogBody = v_modialogBody;
    props.myModialogInfo.btnNm1 = v_btnNm1;
    props.myModialogInfo.btnNm2 = v_btnNm2;
    props.myModialogInfo.callbackFn2 = MyModialogCallbackFn;
    props.myModialogInfo.callbackCd = v_callbackCd;

    props.myModialogInfo.modialogShow = true;
    props.myModialogInfo.setModialogShow(true);
    props.setMyModialogInfo(props.myModialogInfo);
  };
  const MyModialogCallbackFn = (callbackCd) => {
    if ('OK' === callbackCd) {
      //axios
      BbsList();
    } else if ('confirm-s' === callbackCd) {
      //저장
      BbsUpdate(detailSave);
    } else if ('confirm-d' === callbackCd) {
      //삭제
      BbsDelete();
    }
  };

  // Toast 관련
  const [MyToast_show, setMyToastShow] = useState(false);
  const [MyToast_variant, setMyToastVariant] = useState('info');
  const [MyToast_title, setMyToastTitle] = useState('');
  const [MyToast_small, setMyToastSmall] = useState('');
  const [MyToast_msg, setMyToastMsg] = useState('');
  const [MyToast_delay, setMyToastDelay] = useState(3);

  // 여러개를 동시에 띄우려면 Toast를 여러개 선언 해야 하는 듯 함.
  const setMyToasts = (v_variant, v_title, v_small, v_msg) => {
    setMyToastVariant(v_variant);
    setMyToastTitle(v_title);
    setMyToastSmall(v_small);
    setMyToastMsg(v_msg);
    setMyToastShow(true);
  };

  // 게시글 상세 조회 //api/front/board/detail
  const BbsDetail = async () => {
    let req = { boardId: boardId };
    await axios.post(FRONT_BOARD_URL + '/detail', req, { headers: headers + { 'Content-Type': 'application/json' } }).then((resp) => {
      setBbsDetail(resp.data.board);
      setFileList(resp.data.file);
    });
  };

  // file 다운로드
  const fileDownLoad = async (file) => {
    const formData = new FormData();
    formData.append('attachId', file.attachId);
    formData.append('fileSeq', file.fileSeq);
    formData.append('attachKey', file.attachKey);

    //해더 토큰 뒤에 넣었는데 안됨 ㅠ.ㅠ 이유를 찾아야함
    await axios.post(FRONT_FILE_URL + '/download', formData, { headers: headers, responseType: 'blob' }).then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', file.originFileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  };

  // file 삭제(화면에서 삭제)
  const removeFile = (fileSeq) => {
    setFileList([...fileList.filter((file) => file.fileSeq !== fileSeq)]); //남은파일
    setFileDelList((delList) => [...delList, fileSeq]); //삭제한파일
  };

  // 수정하기 //api/front/board/update
  const BbsUpdate = async (data) => {
    //삭제한 파일 담기
    let delcnt = 0;
    fileDelList.forEach((item) => {
      data.append('deleteFileSeqs[]', item);
      delcnt++;
    });

    await axios.post(FRONT_BOARD_URL + '/update', data, { headers: headers + { 'Content-Type': 'multipart/form-data' } }).then((resp) => {
      if (resp && resp.data.code && resp.data.code === 'SUCCESS') {
        setMyToasts('success', '✨알림', resp.data.returnCnt + ' 건', resp.data.message);
        BbsList();
      } else {
        // REQUIRED
        setMyModialog('warning', '🚧경고', resp.data.message, '', 'OK', '');
      }
    });
  };

  // 삭제하기 //api/front/board/delete
  const BbsDelete = async () => {
    let req = { boardId: boardId, attachId: bbsDetail.attachId };
    await axios.post(FRONT_BOARD_URL + '/delete', req, { headers: headers }).then((resp) => {
      if (resp && resp.data.code && resp.data.code === 'SUCCESS') {
        setMyToasts('success', '✨알림', resp.data.returnCnt + ' 건', resp.data.message);
        BbsList();
      } else {
        // REQUIRED
        setMyModialog('warning', '🚧경고', resp.data.message, '', 'OK', '');
      }
    });
  };

  // 목록보기
  const BbsList = () => {
    navigate('/' + topMenuSeq + '/hm/DevSearchList');
  };

  //          event handler          //
  // 저장 form submit
  const formSubmitHandler = (event) => {
    const form = event.currentTarget;
    const formData = new FormData(form);

    if (form.checkValidity() === false) {
      setValidated(true);
      event.preventDefault();
      return;
    }
    setValidated(false);
    event.preventDefault();
    event.stopPropagation();
    detailSave = formData;
    setMyModialog('static', '✅확인', '저장 하시겠습니까?', 'No', 'Yes', 'confirm-s');
  };

  function onClickDelete() {
    setMyModialog('static', '✅확인', '삭제 하시겠습니까?', 'No', 'Yes', 'confirm-d');
  }

  //          effect          //
  useEffect(() => {
    BbsDetail();
  }, []);
  return (
    <div style={{ margin: '5px' }} className="row">
      <Container fluid className="square">
        <div aria-live="polite" aria-atomic="true" className="bg-dark position-relative" style={{ minHeight: '0px', margin: '5px' }}>
          <ToastContainer position="top-end" className="p-3" style={{ zIndex: 1 }}>
            {MyToast(MyToast_show, MyToast_variant, MyToast_title, MyToast_small, MyToast_msg, setMyToastShow, MyToast_delay)}
          </ToastContainer>
        </div>
        <Form noValidate validated={validated} onSubmit={formSubmitHandler} method="post" name="submitForm">
          <Row className="m-3">
            <Col>
              <Form.Group controlId="boardId">
                <Form.Label HtmlFor="boardId">게시판No.</Form.Label>
                <Form.Control type="hidden" name="attachId" value={bbsDetail.attachId || ''} />
                <Form.Control type="hidden" name="boardId" value={bbsDetail.boardId || ''} />
                <Form.Control name="boardId" value={bbsDetail.boardId || ''} disabled />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="createDate">
                <Form.Label HtmlFor="createDate">작성일시</Form.Label>
                <Form.Control name="createDate" value={bbsDetail.createDate || ''} disabled />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="modifiedDate">
                <Form.Label HtmlFor="modifiedDate">수정일시</Form.Label>
                <Form.Control name="modifiedDate" value={bbsDetail.modifiedDate || ''} disabled />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="viewCount">
                <Form.Label HtmlFor="viewCount">조회수</Form.Label>
                <Form.Control name="viewCount" value={bbsDetail.viewCount || ''} disabled />
              </Form.Group>
            </Col>
          </Row>
          <Row className="m-1">
            <Col>
              <Form.Group controlId="title">
                <Form.Label HtmlFor="title">제목</Form.Label>
                <Form.Control type="text" name="title" defaultValue={bbsDetail.title || ''} required />
                <Form.Control.Feedback type="invalid">제목을 입력하세요.</Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>
          <Row className="m-1">
            <Col>
              <Form.Group controlId="content">
                <Form.Label HtmlFor="content">내용</Form.Label>
                <Form.Control as="textarea" name="content" rows={3} defaultValue={bbsDetail.content || ''} required />
                <Form.Control.Feedback type="invalid">내용을 입력하세요</Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>
          <Row className="m-3">
            <Col>
              <Form.Group controlId="filelist">
                <div>
                  {fileList.map((file, i) => (
                    <div key={file.fileSeq}>
                      <span>
                        {i + 1}.&nbsp;{file.originFileName}[{file.fileSeq}]&nbsp;
                      </span>
                      <span className="remove">
                        <Icon.XSquare
                          onClick={(evt) => {
                            removeFile(file.fileSeq);
                          }}
                        />
                      </span>
                      &nbsp;
                      <span className="downloader">
                        <Icon.CloudDownload
                          onClick={(evt) => {
                            fileDownLoad(file);
                          }}
                        />
                      </span>
                    </div>
                  ))}
                </div>
              </Form.Group>
            </Col>
          </Row>
          <Row className="m-3">
            {localStorage.getItem('mbrSeq') == bbsDetail.mbrSeq ? (
              <Col>
                <Form.Group controlId="mutipartFiles">
                  <Form.Control type="file" multiple={true} name="mutipartFiles" accept="image/*,audio/*,video/*" />
                </Form.Group>
              </Col>
            ) : null}
          </Row>
          <Row className="m-3">
            <Col>
              {localStorage.getItem('mbrSeq') == bbsDetail.mbrSeq ? (
                <>
                  <Button type="submit" variant="success">
                    저장
                  </Button>
                  &nbsp;&nbsp;
                  <Button variant="danger" onClick={onClickDelete}>
                    삭제
                  </Button>
                </>
              ) : null}
            </Col>
            <Col style={{ justifyContent: 'right', display: 'flex' }}>
              <Button variant="primary" onClick={BbsList}>
                목록
              </Button>
            </Col>
          </Row>
        </Form>
      </Container>
    </div>
  );
}

export default DevDetail;
