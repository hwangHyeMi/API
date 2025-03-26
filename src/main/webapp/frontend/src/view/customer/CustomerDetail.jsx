import './CustomerMain.css';
import axios from 'axios';
import httpHeaderStore from 'stores/HttpHeaderStore';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { Button, Col, Container, Form, Row, Card, Image } from 'react-bootstrap';
import * as Icon from 'react-bootstrap-icons';

// Toast 관련
import MyToast from 'component/common/MyToast';
import ToastContainer from 'react-bootstrap/ToastContainer';
const CustomerDetail = (props) => {
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
    mbrNm: '',
    attachId: '',
    mbrAttachId: '',
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
    navigate('/' + topMenuSeq + '/front/customer/CustomerMain');
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
    <div>
      <Container fluid>
        <div aria-live="polite" aria-atomic="true" className="bg-dark position-relative" style={{ minHeight: '0px', margin: '5px' }}>
          <ToastContainer position="top-end" className="p-3" style={{ zIndex: 1 }}>
            {MyToast(MyToast_show, MyToast_variant, MyToast_title, MyToast_small, MyToast_msg, setMyToastShow, MyToast_delay)}
          </ToastContainer>
        </div>
        <Form noValidate validated={validated} onSubmit={formSubmitHandler} method="post" name="submitForm">
          <Row className="m-3"></Row>
          <Row>
            <Card>
              <Card.Header as="h5">{bbsDetail.title || ''}</Card.Header>
              <Card.Body>
                <Card.Text>
                  <div className="d-flex w-100 justify-content-between">
                    <small className="text-muted">
                      <Image roundedCircle src={`${process.env.REACT_APP_API_URL}` + '/com/file/images/' + bbsDetail.mbrAttachId + '/1'} width={20} height={20} /> {bbsDetail.mbrNm}
                    </small>
                    <small className="text-muted">{bbsDetail.modifiedDate}</small>
                  </div>
                  <div className="d-flex w-100 justify-content-between">
                    <h5 className=""></h5>
                    <small className="text-muted">
                      <i className="fas fa-eye"></i>
                      {'  '}
                      {bbsDetail.viewCount}
                    </small>
                  </div>
                </Card.Text>
                <Card.Text>{bbsDetail.content || ''} </Card.Text>
                &nbsp;
                <Card.Text>
                  {' '}
                  {fileList.map((file, i) => (
                    <div key={file.fileSeq}>
                      <span>
                        {i + 1}.&nbsp;{file.originFileName}[{file.fileSeq}]&nbsp;
                      </span>
                      {localStorage.getItem('mbrSeq') == bbsDetail.mbrSeq ? (
                        <span className="remove">
                          <Icon.XSquare
                            onClick={(evt) => {
                              removeFile(file.fileSeq);
                            }}
                          />
                        </span>
                      ) : null}
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
                </Card.Text>
              </Card.Body>
            </Card>
          </Row>
          <Row className="m-3">
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
};

export default CustomerDetail;
