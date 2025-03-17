import { useState, useEffect } from 'react';
import axios from 'axios';

import * as Icon from 'react-bootstrap-icons';
import * as Bts from 'react-bootstrap';

import { useNavigate } from 'react-router-dom';

import useLoginStore from 'interface/useLoginStore';

//          component: Login 컴포넌트          //
function Login(props) {
  //          component: useLoginStore          //
  const { storeLogin } = useLoginStore((state) => {
    return state;
  });
  //네비게이트
  const navigate = useNavigate();

  const [loginValidated, setLoginValidated] = useState(false);

  const [loginFormData, setLoginFormData] = useState({
    userId: '',
    userPwd: '',
    groupCode: `${process.env.REACT_APP_GROUP_CODE}`,
  });
  //          event handler: onChangeForm         //
  const onChangeForm = (event) => {
    const { name, value } = event.target;
    setLoginFormData({
      ...loginFormData,
      [name]: value,
    });
  };
  //          event handler: loginSubmit         //
  const loginSubmit = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      setLoginValidated(true);
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    fnGoLogin();
    // 화면 이동 하지 않고 axios 통신
    event.preventDefault();
    event.stopPropagation();
  };
  const fnGoLogin = async () => {
    const LOGIN_URL = `${process.env.REACT_APP_LOGIN_URL}`;
    await axios
      .post(LOGIN_URL, loginFormData)
      .then((resp) => {
        if (resp && resp.data) {
          if (resp.data.status) {
            setMyAlerts('warning', '알림!', '⚠️ ' + resp.data.resultMsg, '');
          } else {
            storeLogin(resp.data);
            //alert(resp.data.mbrNm + '님, 성공적으로 로그인 되었습니다 🔐');
            // navigate('/');
            setMyAlerts('success', '알림!', resp.data.mbrNm + '님, 성공적으로 로그인 되었습니다 🔐', 'OK');
          }
        }
      })
      .catch((err) => {
        console.log(err);
        if (err.response && err.response.data) {
          //alert('⚠️ ' + err.response.data);
          setMyAlerts('warning', '알림!', '⚠️ ' + err.response.data, '');
        } else {
          //alert('⚠️ 관리자에게 문의하세요');
          setMyAlerts('warning', '알림!', '⚠️ 관리자에게 문의하세요', '');
        }
      });
  };
  //          event handler: onJoinButtonClick         //
  const onJoinButtonClick = () => {
    navigate('/Join');
  };
  // Alert 관련
  const setMyAlerts = (v_variant, v_heading, v_msg, v_callbackCd) => {
    props.myAlertInfo.alertHeading = v_heading;
    props.myAlertInfo.alertMsg = v_msg;
    props.myAlertInfo.callbackFn = MyAlertCallbackFn;
    props.myAlertInfo.callbackCd = v_callbackCd;
    props.myAlertInfo.alertVariant = v_variant;
    props.myAlertInfo.alertShow = true;
    props.myAlertInfo.setAlertShow(true);
    props.myAlertInfo.setMaskShow(true);
    props.setMyAlertInfo(props.myAlertInfo);
  };
  const MyAlertCallbackFn = (callbackCd) => {
    if ('OK' === callbackCd) {
      navigate('/');
    }
  };
  // Alert 관련
  //          effect                                   //
  useEffect(() => {}, []);

  return (
    <>
      <div id="layoutAuthentication">
        <div id="layoutAuthentication_content">
          <main>
            <div className="container">
              <div className="row justify-content-center">
                <div className="col-lg-5">
                  <div className="card shadow-lg border-0 rounded-lg mt-5">
                    <div className="card-header">
                      <h3 className="text-center font-weight-light my-4">Login</h3>
                    </div>
                    <div className="card-body">
                      <Bts.Form noValidate validated={loginValidated} onSubmit={loginSubmit} id="loginForm">
                        <Bts.Container fluid className="">
                          <Bts.Row className="form-floating mb-3">
                            <Bts.Form.Group as={Bts.Col} controlId="userId">
                              <Bts.Form.Control className="form-control" type="text" name="userId" placeholder="아이디를 입력하세요." onChange={onChangeForm} value={loginFormData.userId} required pattern="^[a-z]+[a-z0-9]{2,19}$" isInvalid={loginValidated && !/^[a-z]+[a-z0-9]{2,19}$/g.test(loginFormData.userId)} />
                              <Bts.Form.Control.Feedback type="invalid">올바른 아이디를 입력해주세요.</Bts.Form.Control.Feedback>
                            </Bts.Form.Group>
                          </Bts.Row>
                          <Bts.Row className="form-floating mb-3">
                            <Bts.Form.Group as={Bts.Col} controlId="userPwd">
                              <Bts.Form.Control className="form-control" type="password" name="userPwd" placeholder="비밀번호를 입력하세요." onChange={onChangeForm} value={loginFormData.userPwd} required pattern="^(?=.*[a-zA-z]).{2,16}$" isInvalid={loginValidated && !/^(?=.*[a-zA-z]).{2,16}$/.test(loginFormData.userId)} />
                              <Bts.Form.Control.Feedback type="invalid">영문, 숫자, 특수문자 포함 8자 이상 입력해 주세요.</Bts.Form.Control.Feedback>
                            </Bts.Form.Group>
                          </Bts.Row>
                          <Bts.Row className="form-floating mb-3">
                            <Bts.Button type="submit" className="black-large-full-button">
                              로그인
                            </Bts.Button>
                          </Bts.Row>
                        </Bts.Container>
                      </Bts.Form>
                    </div>
                    <div className="card-footer text-center py-3">
                      <div className="small" onClick={onJoinButtonClick}>
                        신규사용자 이신가요? 회원가입
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}

export default Login;
