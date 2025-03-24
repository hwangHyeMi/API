import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import httpHeaderStore from 'store/HttpHeaderStore';

import { Col, Row, Form, Button, Container } from 'react-bootstrap';

// Toast 관련
import MyToast from 'component/common/MyToast';
import ToastContainer from 'react-bootstrap/ToastContainer';

//          component (props) App.js확인         //
function DevWrite(props) {
  //선언부
  const FRONT_BOARD_URL = `${process.env.REACT_APP_DEV_BOARD_URL}`;
  const navigate = useNavigate();
  const { getHeaders } = httpHeaderStore((state) => {
    return state;
  });
  const headers = getHeaders();
  const { topMenuSeq } = useParams();
  const [validated, setValidated] = useState(false);

  let writeSave;

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
      BbsInsert(writeSave);
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

  // 저장하기 //api/front/board/insert
  const BbsInsert = async (data) => {
    await axios.post(FRONT_BOARD_URL + '/insert', data, { headers: headers }).then((resp) => {
      if (resp && resp.data.code && resp.data.code === 'SUCCESS') {
        //setMyModialog('static', '✨알림', resp.data.message, '', 'Ok', 'OK');
        setMyToasts('success', '✨알림', resp.data.returnCnt + ' 건', resp.data.message);
        BbsList();
      } else {
        // REQUIRED
        setMyModialog('warning', '🚧경고', resp.data.message, '', 'Ok', '');
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
    if (form.checkValidity() === false) {
      setValidated(true);
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    const formData = new FormData(form);

    writeSave = formData;
    setMyModialog('static', '✅확인', '저장 하시겠습니까?', 'No', 'Yes', 'confirm-s');
  };

  //          effect          //
  useEffect(() => {}, []);
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
              <Form.Group controlId="mbrSeq">
                <Form.Control type="hidden" name="mbrSeq" value={localStorage.getItem('mbrSeq')} required />
              </Form.Group>
              <Form.Group controlId="title">
                <Form.Label HtmlFor="title">제목</Form.Label>
                <Form.Control type="text" name="title" required />
                <Form.Control.Feedback type="invalid">제목을 입력하세요.</Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>
          <Row className="m-3">
            <Col>
              <Form.Group controlId="content">
                <Form.Label HtmlFor="content">내용</Form.Label>
                <Form.Control as="textarea" name="content" rows={5} required />
                <Form.Control.Feedback type="invalid">내용을 입력하세요</Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>
          <Row className="m-3">&nbsp;</Row>
          <Row className="m-3">
            <Col>
              <Form.Group controlId="mutipartFiles">
                <Form.Control type="file" multiple={true} name="mutipartFiles" accept="image/*,audio/*,video/*" />
              </Form.Group>
            </Col>
          </Row>
          <Row className="m-3">&nbsp;</Row>
          <Row className="m-3">
            <Col>
              <Button type="submit" variant="success">
                저장
              </Button>
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
export default DevWrite;
