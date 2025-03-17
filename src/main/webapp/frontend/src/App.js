import React, { useEffect, useState } from 'react';

import { Route, Routes, BrowserRouter, HashRouter } from 'react-router-dom';
import axios from 'axios';

import './App.css';
import './css/styles.css';

// Modal.Dialog 관련
import MyModialog from 'component/com/MyModialog';
// Alert 관련
import MyAlert from 'component/com/MyAlert';
import PrivateRoute from 'component/com/PrivateRoute';

// description : Store import Start
import useLoginStore from 'interface/useLoginStore';
import menuStore from 'interface/menuStore';
import codeStore from 'interface/codeStore';
import colorModeStore from 'interface/colorModeStore';
// description : Store import End

// description : layout import Start
import Header from 'component/layout/Header';
import Sidebar from 'component/layout/Sidebar';
import Footer from 'component/layout/Footer';
// description : layout import End

// description : bootstrap 연동할 화면 import Start
//import Home from 'component/Home';
import Login from 'component/Login';
import Join from 'component/Join';
import Dashboard from 'views/main/Dashboard';
// description : bootstrap 연동할 화면 import End

// description : 메뉴와 연동할 화면 import Start
import DevMain from 'views/dev/DevMain';
import TodoList from 'views/dev/todo/TodoList';
// sj
import DivInfoList from 'views/dev/sj/DivInfoList';
import DivInfoList2 from 'views/dev/sj/DivInfoList2';

import DevSjAssembl from 'views/dev/sj/DevAssembl';
import DevSjTables from 'views/dev/sj/DevTables';
import DevSjMessage from 'views/dev/sj/DevMessage';
import DevSjModals from 'views/dev/sj/DevModals';
import DevSjButtons from 'views/dev/sj/DevButtons';
import DevSjCalendar from 'views/dev/sj/DevCalendar';
import DevSjSearchList from 'views/dev/sj/DevSearchList';
import DevSjListScroll from 'views/dev/sj/DevListScroll';

// 작업 메뉴 협의 후 작업 후 제거 할 건 제거 하고 머지 작업은 추후 진행

//hm
import DevHmAssembl from 'views/dev/hm/DevAssembl';
import DevHmSearchList from 'views/dev/hm/DevSearchList';
import DevHmWrite from 'views/dev/hm/DevWrite';
import DevHmDetail from 'views/dev/hm/DevDetail';
import DevHmMypage from 'views/dev/hm/DevMypage';

// description : 메뉴와 연동할 화면 import End

function App() {
  const APP_GB = `${process.env.REACT_APP_GB}`;
  const HOME_PATH = `${process.env.REACT_APP_HOME_PATH}`;
  const [maskShow, setMaskShow] = useState(false);
  // Modal.Dialog 관련
  const [modialogShow, setModialogShow] = useState(false);
  // btnNm2 빈값은 버튼 비 노출
  // backdrop:'static' == backdrop or backdrop:''
  const [myModialogInfo, setMyModialogInfo] = useState({
    modialogShow: modialogShow,
    backdrop: '',
    modialogTitle: '',
    modialogBody: '',
    setModialogShow: setModialogShow,
    btnNm1: 'Close',
    btnNm2: '',
    callbackFn1: null,
    callbackFn2: null,
    callbackCd: '',
  });
  const setMyModialogClose = () => {
    setModialogShow(false);
  };
  // Alert 관련
  const [alertShow, setAlertShow] = useState(false);
  const [myAlertInfo, setMyAlertInfo] = useState({ alertShow: alertShow, alertVariant: 'info', alertHeading: '', alertMsg: '', setAlertShow: setAlertShow, setMaskShow: setMaskShow, callbackFn: null, callbackCd: '' });

  axios.defaults.baseURL = `${process.env.REACT_APP_API_URL}`;
  axios.interceptors.response.use(
    (response) => {
      //console.log('response:', response);
      //console.log('response status:', response.data.status);
      //console.log('response resultMsg:', response.data.resultMsg);
      //console.log('response divisionCode:', response.data.divisionCode);
      if (response && response.request && response.request.responseURL) {
        const responseURL = response.request.responseURL;
        if (responseURL && responseURL.indexOf('/mbr/login') === -1 && response.data.status) {
          return new Promise((resolve, reject) => {
            resolve('OK');
          })
            .then((result) => {
              //throw new Error(response.data.resultMsg);
              if (400 <= response.data.status && 500 > response.data.status) {
                // 정상 통신 내 메세지 처리.
                throw new Error(response.data.resultMsg + '[' + response.data.divisionCode + ']');
              } else {
                throw new Error('시스템 관라자에게 문의 바랍니다.[' + response.data.divisionCode + ']');
              }
            })
            .catch((error) => {
              console.error(error);
              setMyAlerts('warning', '오류 발생!', error.message, '');
            });
        } else {
          // 요청이 성공했을 때 실행될 로직
          return response;
        }
      }
    },
    (error) => {
      console.log(error);
      // 요청이 실패했을 때 실행될 로직
      // 여기서 error는 HTTP 응답 상태 코드가 200 범위가 아닌 경우 발생
      if (error.response) {
        console.log(error.response);
        //console.log('Response error:', error.request.responseURL);
        // 서버가 응답을 반환했으나 2xx 범위가 아닌 상태 코드인 경우
        //console.log('Server responded with non 2xx code:', error.response.status);
        //console.log('Response data:', error.response.data);
        if (402 === error.status) {
          return new Promise((resolve, reject) => {
            resolve('OK');
          })
            .then((result) => {
              throw new Error('다시 로그인 하시기 바랍니다.');
            })
            .catch((error) => {
              console.error(error);
              setMyAlerts('warning', '인증 정보 만료!', error.message, 'NO');
            });
          //.catch(alert); // Error: 에러 발생!
        } else {
          return new Promise((resolve, reject) => {
            resolve('OK');
          })
            .then((result) => {
              throw new Error('시스템 관라자에게 문의 바랍니다.');
            })
            .catch((error) => {
              console.error(error);
              setMyAlerts('warning', '접근 권한 없음!', error.message, '');
            });
          //.catch(alert); // Error: 에러 발생!
        }
      } else if (error.request) {
        // 요청이 이루어졌으나 응답을 받지 못한 경우
        console.log('No response received:', error.request);
        return new Promise((resolve, reject) => {
          resolve('OK');
        })
          .then((result) => {
            throw new Error('서버와 통신 에러 발생!\n시스템 관라자에게 문의 바랍니다.');
          })
          .catch((error) => {
            console.error(error);
            setMyAlerts('warning', '통신 에러 발생!', error.message, '');
          });
        //.catch(alert) // Error: 에러 발생!
      } else {
        // 요청 설정 중 발생한 오류
        console.log('Error setting up request:', error.message);
      }

      // 오류 처리 후 오류를 다시 throw하여 호출한 쪽에서도 처리할 수 있게 함
      return Promise.reject(error);
    }
  );
  const { islogIn, storeLogout } = useLoginStore((state) => {
    return state;
  });
  const { isMenuData, getMenuList, initMenuData } = menuStore((state) => {
    return state;
  });
  const { initCodData } = codeStore((state) => {
    return state;
  });
  const { initColorMode } = colorModeStore((state) => {
    return state;
  });

  // Alert 관련
  const setMyAlerts = (v_variant, v_heading, v_msg, v_callbackCd) => {
    myAlertInfo.alertHeading = v_heading;
    myAlertInfo.alertMsg = v_msg;
    myAlertInfo.callbackFn = MyAlertCallbackFn;
    myAlertInfo.callbackCd = v_callbackCd;
    myAlertInfo.alertVariant = v_variant;
    myAlertInfo.alertShow = true;
    myAlertInfo.setAlertShow(true);
    myAlertInfo.setMaskShow(true);
    setMyAlertInfo(myAlertInfo);
  };
  const MyAlertCallbackFn = (callbackCd) => {
    if ('NO' === callbackCd) {
      window.location.replace(HOME_PATH + '/Login');
      storeLogout();
    }
  };
  // Alert 관련

  localStorage.setItem('sb|sidebar-toggle', 'true');

  useEffect(() => {
    //console.log(window.location.hostname);
    let chk_hostname = window.location.hostname;
    if ('localhost' !== chk_hostname) {
      if (`${process.env.REACT_APP_API_URL}`.indexOf(chk_hostname) === -1) {
        //alert('[개발자 확인!]\n개발 환경 세팅 확인\n[접근 hostname, API hostname 다름]\nREACT_APP_API_URL 체킹');
        setMyAlerts('warning', '개발자 확인!!', '개발 환경 세팅 확인\n[접근 hostname, API hostname 다름]\nREACT_APP_API_URL 체킹', '');
      }
    }

    initColorMode();
    // 개발자 업데이트 고지용
    let chkVersion = localStorage.getItem('chkVersion');
    let appVersion = `${process.env.REACT_APP_VERSION}`;
    if (!chkVersion || chkVersion !== appVersion) {
      localStorage.setItem('chkVersion', appVersion);
      initMenuData();
      initCodData();
      alert(`${process.env.REACT_APP_VERSION_MSG}`);
      // codeStore, menuStore 데이터 연계 후 리로드
      // localStorage 생성 setTimeout
      setTimeout(() => window.location.replace(HOME_PATH + '/'), 1000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getMenuList, initCodData, initColorMode, initMenuData, isMenuData, islogIn]);

  return (
    <>
      {APP_GB === 'DEV' ? (
        <BrowserRouter>
          {/* // description : 개발 환경 BrowserRouter > HashRouter 와 다르게 모든 url 시작에 # 자동으로 붙이지 않는다. */}
          <div className="masked" style={{ display: maskShow ? 'block' : 'none' }}></div>

          <div className={modialogShow ? 'modal show' : 'modal'} style={{ display: modialogShow ? 'block' : 'none', position: 'initial' }}>
            {MyModialog(modialogShow, myModialogInfo.backdrop, myModialogInfo.modialogTitle, myModialogInfo.modialogBody, setModialogShow, myModialogInfo.btnNm1, myModialogInfo.btnNm2, myModialogInfo.callbackFn1, myModialogInfo.callbackFn2, myModialogInfo.callbackCd, setMyModialogClose)}
          </div>
          <div style={{ display: alertShow ? '' : 'none' }} className="myAlertArea">
            {MyAlert(myAlertInfo.alertShow, myAlertInfo.alertVariant, myAlertInfo.alertHeading, myAlertInfo.alertMsg, myAlertInfo.setAlertShow, myAlertInfo.setMaskShow, myAlertInfo.callbackFn, myAlertInfo.callbackCd)}
          </div>
          <Header myAlertInfo={myAlertInfo} setMyAlertInfo={setMyAlertInfo} />
          <div id="layoutSidenav">
            <Sidebar />
            <div id="layoutSidenav_content">
              {/* <div id='layoutSidenav_content' className='py-4 bg-dark'>*/}
              {/* <div id='layoutSidenav_content' / <main> 최상위 App.js 로 끄러 올려서 내부에선 재 선언 하지 않게 해봄. 아이디가 Route 안에서 중복으로 사용이 어떻게 될지도 모른상황이라 일단 위로 올려 봄.*/}
              {/* [bg-dark, bg-white, ...] 컬러 모드 변경 적용은 조금더 연구 후 적용 */}
              <main>
                <div className="container-fluid px-4">
                  <Routes>
                    {/* // description : 로그인과 무관 접근 가능 Start */}
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/bootstrap/Dashboard" element={<Dashboard />} />
                    <Route path="/:topMenuSeq/devList/DivInfoList" element={<DivInfoList />} />
                    <Route path="/:topMenuSeq/devList/DivInfoList2" element={<DivInfoList2 />} />
                    {/* // description : 로그인과 무관 접근 가능 End */}

                    {/* // description : 로그인 시에만 접근 가능 Start */}
                    <Route element={<PrivateRoute userAuthentication={true} setMyAlerts={setMyAlerts} />}>
                      {/* // description : 메뉴와 연동할 화면 선언 Start */}
                      <Route path="/:topMenuSeq/dev/DevMain" element={<DevMain />} />
                      <Route path="/:topMenuSeq/dev/TodoList" element={<TodoList myModialogInfo={myModialogInfo} setMyModialogInfo={setMyModialogInfo} setMaskShow={setMaskShow} />} />
                      <Route path="/:topMenuSeq/dev/TodoList/:compressParams" element={<TodoList myModialogInfo={myModialogInfo} setMyModialogInfo={setMyModialogInfo} setMaskShow={setMaskShow} />} />

                      <Route path="/:topMenuSeq/sj/DevAssembl" element={<DevSjAssembl myAlertInfo={myAlertInfo} setMyAlertInfo={setMyAlertInfo} myModialogInfo={myModialogInfo} setMyModialogInfo={setMyModialogInfo} />} />
                      <Route path="/:topMenuSeq/sj/DevTables" element={<DevSjTables />} />
                      <Route path="/:topMenuSeq/sj/DevMessage" element={<DevSjMessage />} />
                      <Route path="/:topMenuSeq/sj/DevModals" element={<DevSjModals />} />
                      <Route path="/:topMenuSeq/sj/DevButtons" element={<DevSjButtons />} />
                      <Route path="/:topMenuSeq/sj/DevCalendar" element={<DevSjCalendar />} />
                      <Route path="/:topMenuSeq/sj/DevSearchList" element={<DevSjSearchList />} />
                      <Route path="/:topMenuSeq/sj/DevListScroll" element={<DevSjListScroll />} />
                      {/* hm */}
                      <Route path="/:topMenuSeq/hm/DevSearchList" element={<DevHmSearchList />} />
                      <Route path="/:topMenuSeq/hm/DevAssembl" element={<DevHmAssembl />} />
                      <Route path="/:topMenuSeq/hm/DevDetail/:boardId" element={<DevHmDetail myModialogInfo={myModialogInfo} setMyModialogInfo={setMyModialogInfo} />} />
                      <Route path="/:topMenuSeq/hm/DevWrite" element={<DevHmWrite myModialogInfo={myModialogInfo} setMyModialogInfo={setMyModialogInfo} />} />
                      {/* // description : 메뉴와 연동할 화면 선언 End */}
                      <Route path="/hm/DevMypage" element={<DevHmMypage myModialogInfo={myModialogInfo} setMyModialogInfo={setMyModialogInfo} />} />
                    </Route>
                    {/* // description : 로그인 시에만 접근 가능 End */}

                    {/* // description : 비 로그인 시에만 접근 가능 Start */}
                    <Route element={<PrivateRoute userAuthentication={false} setMyAlerts={setMyAlerts} />}>
                      <Route path="/Login" element={<Login myAlertInfo={myAlertInfo} setMyAlertInfo={setMyAlertInfo} />} />
                      <Route path="/Join" element={<Join />} />
                    </Route>
                    {/* // description : 비 로그인 시에만 접근 가능 End */}
                  </Routes>
                </div>
              </main>
            </div>
          </div>
          <Footer />
        </BrowserRouter>
      ) : (
        <HashRouter>
          {/* // description : 운영 배포용 HashRouter > 모든 url 시작에 # 자동으로 붙인다. */}
          <div className="masked" style={{ display: maskShow ? 'block' : 'none' }}></div>

          <div className={modialogShow ? 'modal show' : 'modal'} style={{ display: modialogShow ? 'block' : 'none', position: 'initial' }}>
            {MyModialog(modialogShow, myModialogInfo.backdrop, myModialogInfo.modialogTitle, myModialogInfo.modialogBody, setModialogShow, myModialogInfo.btnNm1, myModialogInfo.btnNm2, myModialogInfo.callbackFn1, myModialogInfo.callbackFn2, myModialogInfo.callbackCd, setMyModialogClose)}
          </div>
          <div style={{ display: alertShow ? '' : 'none' }} className="myAlertArea">
            {MyAlert(myAlertInfo.alertShow, myAlertInfo.alertVariant, myAlertInfo.alertHeading, myAlertInfo.alertMsg, myAlertInfo.setAlertShow, myAlertInfo.setMaskShow, myAlertInfo.callbackFn, myAlertInfo.callbackCd)}
          </div>
          <Header myAlertInfo={myAlertInfo} setMyAlertInfo={setMyAlertInfo} />
          <div id="layoutSidenav">
            <Sidebar />
            <div id="layoutSidenav_content">
              {/* <div id='layoutSidenav_content' className='py-4 bg-dark'>*/}
              {/* <div id='layoutSidenav_content' / <main> 최상위 App.js 로 끄러 올려서 내부에선 재 선언 하지 않게 해봄. 아이디가 Route 안에서 중복으로 사용이 어떻게 될지도 모른상황이라 일단 위로 올려 봄.*/}
              {/* [bg-dark, bg-white, ...] 컬러 모드 변경 적용은 조금더 연구 후 적용 */}
              <main>
                <div className="container-fluid px-4">
                  <Routes>
                    {/* // description : 로그인과 무관 접근 가능 Start */}
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/bootstrap/Dashboard" element={<Dashboard />} />
                    <Route path="/:topMenuSeq/devList/DivInfoList" element={<DivInfoList />} />
                    <Route path="/:topMenuSeq/devList/DivInfoList2" element={<DivInfoList2 />} />
                    {/* // description : 로그인과 무관 접근 가능 End */}

                    {/* // description : 로그인 시에만 접근 가능 Start */}
                    <Route element={<PrivateRoute userAuthentication={true} setMyAlerts={setMyAlerts} />}>
                      {/* // description : 메뉴와 연동할 화면 선언 Start */}
                      <Route path="/:topMenuSeq/dev/DevMain" element={<DevMain />} />
                      <Route path="/:topMenuSeq/dev/TodoList" element={<TodoList myModialogInfo={myModialogInfo} setMyModialogInfo={setMyModialogInfo} setMaskShow={setMaskShow} />} />
                      <Route path="/:topMenuSeq/dev/TodoList/:compressParams" element={<TodoList myModialogInfo={myModialogInfo} setMyModialogInfo={setMyModialogInfo} setMaskShow={setMaskShow} />} />

                      <Route path="/:topMenuSeq/sj/DevAssembl" element={<DevSjAssembl myAlertInfo={myAlertInfo} setMyAlertInfo={setMyAlertInfo} myModialogInfo={myModialogInfo} setMyModialogInfo={setMyModialogInfo} />} />
                      <Route path="/:topMenuSeq/sj/DevTables" element={<DevSjTables />} />
                      <Route path="/:topMenuSeq/sj/DevMessage" element={<DevSjMessage />} />
                      <Route path="/:topMenuSeq/sj/DevModals" element={<DevSjModals />} />
                      <Route path="/:topMenuSeq/sj/DevButtons" element={<DevSjButtons />} />
                      <Route path="/:topMenuSeq/sj/DevCalendar" element={<DevSjCalendar />} />
                      <Route path="/:topMenuSeq/sj/DevSearchList" element={<DevSjSearchList />} />
                      <Route path="/:topMenuSeq/sj/DevListScroll" element={<DevSjListScroll />} />
                      {/* hm */}
                      <Route path="/:topMenuSeq/hm/DevSearchList" element={<DevHmSearchList />} />
                      <Route path="/:topMenuSeq/hm/DevAssembl" element={<DevHmAssembl />} />
                      <Route path="/:topMenuSeq/hm/DevDetail/:boardId" element={<DevHmDetail myModialogInfo={myModialogInfo} setMyModialogInfo={setMyModialogInfo} />} />
                      <Route path="/:topMenuSeq/hm/DevWrite" element={<DevHmWrite myModialogInfo={myModialogInfo} setMyModialogInfo={setMyModialogInfo} />} />
                      {/* // description : 메뉴와 연동할 화면 선언 End */}
                      <Route path="/hm/DevMypage" element={<DevHmMypage myModialogInfo={myModialogInfo} setMyModialogInfo={setMyModialogInfo} />} />
                    </Route>
                    {/* // description : 로그인 시에만 접근 가능 End */}

                    {/* // description : 비 로그인 시에만 접근 가능 Start */}
                    <Route element={<PrivateRoute userAuthentication={false} setMyAlerts={setMyAlerts} />}>
                      <Route path="/Login" element={<Login myAlertInfo={myAlertInfo} setMyAlertInfo={setMyAlertInfo} />} />
                      <Route path="/Join" element={<Join />} />
                    </Route>
                    {/* // description : 비 로그인 시에만 접근 가능 End */}
                  </Routes>
                </div>
              </main>
            </div>
          </div>
          <Footer />
        </HashRouter>
      )}
    </>
  );
}

export default App;
