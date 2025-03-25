import axios from 'axios';
import { assets } from 'assets/images';
import { useEffect, useState } from 'react';
import { Button, Col, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import UseLoginStore from 'stores/UseLoginStore';
import './LoginPopup.css';
//          component: Login 컴포넌트          //
const LoginPopup = (props) => {
  const [currentState, setCurrentState] = useState('Login');
  const { storeLogin } = UseLoginStore((state) => {
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
  //          event handler        //
  //폼 변경
  const onChangeForm = (event) => {
    const { name, value } = event.target;
    setLoginFormData({
      ...loginFormData,
      [name]: value,
    });
  };

  //폼 submit
  const loginSubmit = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      setLoginValidated(true);
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    fnGoLogin();
    event.preventDefault();
    event.stopPropagation();
  };

  //로그인
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
      props.setShowLogin(false);
    }
  };
  // Alert 관련
  //          effect                                   //
  useEffect(() => {}, []);

  return (
    <div className="login-popup">
      <Form className="login-popup-container" noValidate validated={loginValidated} onSubmit={loginSubmit} id="loginForm">
        <div className="login-popup-title">
          <h2>{currentState}</h2>
          <img src={assets.cross_icon} alt="cross_icon" onClick={() => props.setShowLogin(false)} />
        </div>
        <div className="login-popup-inputs">
          {currentState === 'Login' ? <></> : <input type="text" placeholder="Your name" required />}
          <Form.Group as={Col} controlId="userId">
            <Form.Control className="form-control" type="text" name="userId" placeholder="아이디를 입력하세요." onChange={onChangeForm} value={loginFormData.userId} required pattern="^[a-z]+[a-z0-9]{2,19}$" isInvalid={loginValidated && !/^[a-z]+[a-z0-9]{2,19}$/g.test(loginFormData.userId)} />
            <Form.Control.Feedback type="invalid">올바른 아이디를 입력해주세요.</Form.Control.Feedback>
          </Form.Group>
          <Form.Group as={Col} controlId="userPwd">
            <Form.Control className="form-control" type="password" name="userPwd" placeholder="비밀번호를 입력하세요." onChange={onChangeForm} value={loginFormData.userPwd} required pattern="^(?=.*[a-zA-z]).{2,16}$" isInvalid={loginValidated && !/^(?=.*[a-zA-z]).{2,16}$/.test(loginFormData.userId)} />
            <Form.Control.Feedback type="invalid">영문, 숫자, 특수문자 포함 8자 이상 입력해 주세요.</Form.Control.Feedback>
          </Form.Group>
        </div>
        <Button type="submit">{currentState === 'Sign up' ? 'Create Account' : 'Login'}</Button>
        {currentState === 'Sign up' ? (
          <div className="login-popup-condition">
            <input type="checkbox" required />
            <p>By continuing, I agree to the terms of use & privacy policy</p>
          </div>
        ) : (
          <></>
        )}
        {currentState === 'Login' ? (
          <p>
            Create a new account?
            <span onClick={() => setCurrentState('Sign up')}>Click here</span>
          </p>
        ) : (
          <p>
            Already have an account?
            <span onClick={() => setCurrentState('Login')}>Login here</span>
          </p>
        )}
      </Form>
    </div>
  );
};

export default LoginPopup;
