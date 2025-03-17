import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import useLoginStore from 'interface/useLoginStore';

//          component: Login 컴포넌트          //
function Login(props) {
  const idRef = useRef('');
  const pwRef = useRef('');
  //로그인 상태체크 (전역)
  const { storeLogin } = useLoginStore((state) => {
    return state;
  });

  const [userId, setUserId] = useState('');
  const [userPwd, setUserPwd] = useState('');

  const [userIdValid, setUserIdValid] = useState(false);
  const [userPwdValid, setUserPwdValid] = useState(false);
  const [notAllow, setNotAllow] = useState(true);

  //네비게이트
  const navigate = useNavigate();

  //          event handler: Enter         //
  const activeEnter = (event) => {
    //console.log(event.key);
    if (event.key === 'Enter') {
      //console.log(event.target.id);
      if (event.target.id === 'inputId') {
        if (event.target.value !== '' && userIdValid && userPwd === '') {
          pwRef.current.focus();
        } else if (userIdValid && event.target.value !== '' && userPwdValid) {
          onClickLoginButton();
        }
      } else if (event.target.id === 'inputPassword') {
        if (userId === '') {
          idRef.current.focus();
        } else if (userIdValid && event.target.value !== '' && userPwdValid) {
          onClickLoginButton();
        }
      }
    }
  };
  //          event handler: handleUserId         //
  const handleUserId = (event) => {
    setUserId(event.target.value);
    //console.log(userIdValid);
    // TODO 대문자 사용 불가 > 추후 정책 정의 후 수정
    const regex = /^[a-z]+[a-z0-9]{2,19}$/g;

    if (regex.test(userId)) {
      setUserIdValid(true);
    } else {
      setUserIdValid(false);
    }
  };
  //          event handler: onJoin         //
  const onJoinButtonClick = () => {
    navigate('/Join');
  };
  //          event handler: handleUserPwd         //
  const handleUserPwd = (event) => {
    setUserPwd(event.target.value);

    const regex = /^(?=.*[a-zA-z]).{2,16}$/;

    if (regex.test(userPwd)) {
      setUserPwdValid(true);
    } else {
      setUserPwdValid(false);
    }
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

  //          event handler: onClickLoginButton         //
  const onClickLoginButton = async () => {
    const req = {
      userId: userId,
      userPwd: userPwd,
      groupCode: `${process.env.REACT_APP_GROUP_CODE}`,
    };
    const LOGIN_URL = `${process.env.REACT_APP_LOGIN_URL}`;
    await axios
      .post(LOGIN_URL, req)
      .then((resp) => {
        //멀티권한맵내용출력
        if (resp.data.mbrAuthorities.length >= 1) {
          for (var i = 0; i < resp.data.mbrAuthorities.length; i++) {
            //console.log(resp.data.mbrAuthorities[i].mbrSeq);
            //console.log(resp.data.mbrAuthorities[i].authority);
            //console.log(resp.data.mbrAuthorities[i].authorityNm);
            //console.log(resp.data.mbrAuthorities[i].groupCd);
            //console.log(resp.data.mbrAuthorities[i].groupNm);
          }
        }
        storeLogin(resp.data);
        //alert(resp.data.mbrNm + '님, 성공적으로 로그인 되었습니다 🔐');
        // navigate('/');
        setMyAlerts('success', '알림!', resp.data.mbrNm + '님, 성공적으로 로그인 되었습니다 🔐', 'OK');
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

  //          effect                                   //
  useEffect(() => {
    if (userIdValid && userPwdValid) {
      setNotAllow(false);
      return;
    }
    setNotAllow(true);
    //console.log(userIdValid);
    //console.log(userPwdValid);
  }, [userIdValid, userPwdValid]);

  return (
    <>
      {/* 레이아웃과 이중 선언됨 _content, _footer 알맹이만 도출 */}
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-5">
            <div className="card shadow-lg border-0 rounded-lg mt-5">
              <div className="card-header">
                <h3 className="text-center font-weight-light my-4">Login</h3>
              </div>
              <div className="card-body">
                <form>
                  <div className="form-floating mb-3">
                    <input
                      className="form-control"
                      type="text"
                      id="inputId"
                      placeholder="아이디를 입력하세요."
                      // @ts-ignore
                      ref={idRef}
                      value={userId}
                      onChange={handleUserId}
                      onKeyUp={activeEnter}
                    />
                    <label htmlFor="inputId">ID</label>
                  </div>
                  <div className="form-floating mb-3">
                    <input
                      className="form-control"
                      type="password"
                      id="inputPassword"
                      placeholder="비밀번호를 입력하세요."
                      // @ts-ignore
                      ref={pwRef}
                      value={userPwd}
                      onChange={handleUserPwd}
                      onKeyUp={activeEnter}
                    />
                    <label htmlFor="inputPassword">Password</label>
                  </div>
                  <div>
                    {!userIdValid && userId.length > 0 && <div className="form-floating mb-3">올바른 아이디를 입력해주세요.</div>}
                    {!userPwdValid && userPwd.length > 0 && <div className="form-floating mb-3">영문, 숫자, 특수문자 포함 8자 이상 입력해 주세요. </div>}
                    <div>
                      {notAllow && <div className="black-large-full-button-disable">로그인</div>}
                      {!notAllow && (
                        <div className="black-large-full-button" onClick={onClickLoginButton}>
                          로그인
                        </div>
                      )}
                    </div>
                  </div>
                </form>
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
      {/*
    // body 안으로 들어가면 이벤트 동작 안함...방법을 찾아주세요..(전체화면을 위한 body) 
      <body className="bg-primary">
    
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
                      <form>
                        <div className="form-floating mb-3">
                          <input
                            className="form-control"
                            type="text"
                            id="inputId"
                            placeholder="아이디를 입력하세요."
                            // @ts-ignore
                            ref={idRef}
                            value={userId}
                            onChange={handleUserId}
                            onKeyUp={activeEnter}
                          />
                          <label htmlFor="inputId">ID</label>
                        </div>
                        <div className="form-floating mb-3">
                          <input
                            className="form-control"
                            type="password"
                            id="inputPassword"
                            placeholder="비밀번호를 입력하세요."
                            // @ts-ignore
                            ref={pwRef}
                            value={userPwd}
                            onChange={handleUserPwd}
                            onKeyUp={activeEnter}
                          />
                          <label htmlFor="inputPassword">Password</label>
                        </div>

                         <div className='form-check mb-3'>
                                              <input className='form-check-input' id='inputRememberPassword' type='checkbox' value='' />
                                              <label className='form-check-label' htmlFor='inputRememberPassword'>Remember Password</label>
                                            </div> 

                        <div>
                          {!userIdValid && userId.length > 0 && <div className="form-floating mb-3">올바른 아이디를 입력해주세요.</div>}
                          {!userPwdValid && userPwd.length > 0 && <div className="form-floating mb-3">영문, 숫자, 특수문자 포함 8자 이상 입력해 주세요. </div>}
                          <div>
                            {notAllow && <div className="black-large-full-button-disable">로그인</div>}
                            {!notAllow && (
                              <div className="black-large-full-button" onClick={onClickLoginButton}>
                                로그인
                              </div>
                            )}
                          </div>
                        </div>
                      </form>
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
        <div id="layoutAuthentication_footer">
          <footer className="py-4 bg-light mt-auto">
            <div className="container-fluid px-4">
              <div className="d-flex align-items-center justify-content-between small">
                <div className="text-muted">Copyright &copy; Your Website 2023</div>
                <div>
                  <a href="#">Privacy Policy</a>
                  &middot;
                  <a href="#">Terms &amp; Conditions</a>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </div>
       </body>*/}
    </>
  );
}

export default Login;
