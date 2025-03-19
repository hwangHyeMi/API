import axios from 'axios';
import { useState, useEffect, useRef } from 'react';
import httpHeaderStore from 'store/httpHeaderStore';
import useLoginStore from 'store/useLoginStore';

import { Col, Row, Form, Button, Container, Image } from 'react-bootstrap';
import * as Icon from 'react-bootstrap-icons';

// Toast 관련
import MyToast from 'component/common/MyToast';
import ToastContainer from 'react-bootstrap/ToastContainer';
//          component (props) App.js확인         //
function DevMypage(props) {
  const MBR_URL = `${process.env.REACT_APP_MBR_URL}`;
  const defaultProfileImg = `${process.env.REACT_APP_PUBLIC_URL}` + '/assets/image/default_profile_img.png';

  const COM_API_URL = `${process.env.REACT_APP_API_URL}`;
  const { getHeaders } = httpHeaderStore((state) => {
    return state;
  });
  //로그인상태
  const { getMbrSeq } = useLoginStore((state) => {
    return state;
  });
  let formSave;
  const mbrSeq = getMbrSeq();
  const headers = getHeaders();
  const fileInput = useRef(null);

  const [validated, setValidated] = useState(false);
  const [ImageSrc, setImageSrc] = useState(defaultProfileImg);
  const [file, setFile] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [mbrDetail, setMbrDetail] = useState({
    //f12오류해결 화면랜더링 전에 초기화필요함.
    mbrSeq: 0,
    mbrId: '',
    mbrNm: '',
    email: '',
    mbrPon: '',
    attachId: '',
  });
  //          function                                  //
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
      MbrDetail();
    } else if ('confirm-s' === callbackCd) {
      //저장
      MbrUpdate();
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

  // user정보 상세조회  //api/mbr/mypage
  const MbrDetail = async () => {
    const formData = new FormData();
    formData.append('mbrSeq', mbrSeq);

    console.log(headers);
    await axios.post(MBR_URL + '/mypage', formData, { headers: headers }).then((resp) => {
      setMbrDetail(resp.data.mbr);
      setFileList(resp.data.file);

      if (resp.data.file.length > 0) {
        setImageSrc(COM_API_URL + '/com/file/images/' + resp.data.mbr.attachId + '/1'); //api/com/file/images
      }
    });
  };

  // 수정하기 //api/mbr/update
  const MbrUpdate = async () => {
    await axios.post(MBR_URL + '/update', formSave, { headers: headers + { 'Content-Type': 'multipart/form-data' } }).then((resp) => {
      if (resp && resp.data.code && resp.data.code === 'SUCCESS') {
        setMyToasts('success', '✨알림', resp.data.returnCnt + ' 건', resp.data.message);
        MbrDetail();
      } else {
        // REQUIRED
        setMyModialog('warning', '🚧경고', resp.data.message, '', 'Ok', '');
      }
    });
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
    formSave = formData;
    setMyModialog('static', '✅확인', '저장 하시겠습니까?', 'No', 'Yes', 'confirm-s');
  };

  //프로필 사진 선택 변경
  const onChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
    } else {
      //업로드 취소할 시
      setImageSrc(defaultProfileImg);
      return;
    }
    //화면에 프로필 사진 표시
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        console.log(reader.result);
        setImageSrc(reader.result);
      }
    };
    reader.readAsDataURL(e.target.files[0]);
  };
  //          effect          //
  useEffect(() => {
    MbrDetail();
  }, []);
  return (
    <div>
      <Container>
        <div aria-live="polite" aria-atomic="true" className="bg-dark position-relative" style={{ minHeight: '5px', margin: '5px' }}>
          <ToastContainer position="top-end" className="p-3" style={{ zIndex: 1 }}>
            {MyToast(MyToast_show, MyToast_variant, MyToast_title, MyToast_small, MyToast_msg, setMyToastShow, MyToast_delay)}
          </ToastContainer>
        </div>
        <Form noValidate validated={validated} onSubmit={formSubmitHandler} method="post" name="submitForm">
          <Row>
            <Col style={{ justifyContent: 'center', display: 'flex' }}>
              <Image
                roundedCircle
                src={ImageSrc}
                width={200}
                height={200}
                onClick={(evt) => {
                  fileInput.current.click();
                }}
              />
              <div style={{ paddingTop: 150, display: 'flex' }}>
                <Icon.Calendar2XFill
                  onClick={() => {
                    fileInput.current.click();
                  }}
                />
              </div>
              <input type="file" name="mutipartFiles" style={{ display: 'none' }} accept="image/*" onChange={onChange} ref={fileInput} />
            </Col>
          </Row>
          <Row className="m-2">
            <Col>
              <Form.Group controlId="mbrId">
                <Form.Label HtmlFor="mbrId">아이디</Form.Label>
                <Form.Control type="text" name="mbrId" defaultValue={mbrDetail.mbrId} value={mbrDetail.mbrId} disabled />
                <Form.Control type="hidden" name="mbrSeq" defaultValue={mbrSeq} value={mbrDetail.mbrSeq} />
                <Form.Control type="hidden" name="attachId" defaultValue={mbrDetail.attachId} value={mbrDetail.attachId || ''} />
                <Form.Control.Feedback type="invalid"></Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>
          <Row className="m-2">
            <Col>
              <Form.Group controlId="mbrNm">
                <Form.Label HtmlFor="mbrNm">이름</Form.Label>
                <Form.Control type="text" name="mbrNm" defaultValue={mbrDetail.mbrNm} required />
                <Form.Control.Feedback type="invalid">이름을 입력하세요.</Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>
          <Row className="m-2">
            <Col>
              <Form.Group controlId="email">
                <Form.Label HtmlFor="email">E-mail</Form.Label>
                <Form.Control type="text" name="email" defaultValue={mbrDetail.email || ''} required />
                <Form.Control.Feedback type="invalid">이메일을 입력하세요.</Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>
          <Row className="m-2">
            <Col>
              <Form.Group controlId="mbrPon">
                <Form.Label HtmlFor="mbrPon">휴대폰번호</Form.Label>
                <Form.Control type="text" name="mbrPon" defaultValue={mbrDetail.mbrPon || ''} required />
                <Form.Control.Feedback type="invalid">휴대폰번호를 입력하세요.</Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>
          <Row className="m-1"></Row>
          <Row className="m-3"></Row>
          <Row className="m-3"></Row>
          <Row className="m-3">
            <Col style={{ justifyContent: 'center', display: 'flex' }}>
              <Button type="submit" variant="primary">
                프로필 수정하기
              </Button>
            </Col>
          </Row>
        </Form>
      </Container>
    </div>
  );
}
export default DevMypage;
