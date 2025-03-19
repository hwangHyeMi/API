import axios from 'axios';
import { useEffect, useState } from 'react';
import { BrowserRouter, HashRouter, Route, Routes } from 'react-router-dom';
import './css/App.css';
import './css/styles.css';

// description : Modal.Dialog  Alert
import MyModialog from 'component/common/MyModialog';
import MyAlert from 'component/common/MyAlert';
import PrivateRoute from 'component/common/PrivateRoute';

// description : store
import codeStore from 'store/codeStore';
import colorModeStore from 'store/colorModeStore';
import menuStore from 'store/menuStore';
import useLoginStore from 'store/useLoginStore';

// description : layout
import Footer from 'component/layout/Footer';
import Header from 'component/layout/Header';
import Sidebar from 'component/layout/Sidebar';

// description : component/main
import Dashboard from 'component/main/Dashboard';
//import Home from 'component/main/Home';

// description : component/member
import Join from 'component/member/Join';
import Login from 'component/member/Login';
import Profile from 'component/member/Profile';

// description : component/dev
import DevMain from 'component/dev/DevMain';
import TodoList from 'component/dev/todo/TodoList';
import DevDetail from 'component/dev/hm/DevDetail';
import DevMypage from 'component/dev/hm/DevMypage';
import DevSearchList from 'component/dev/hm/DevSearchList';
import DevWrite from 'component/dev/hm/DevWrite';
import DevAssembl from 'component/dev/sj/DevAssembl';
import DevCalendar from 'component/dev/sj/DevCalendar';
import DevListScroll from 'component/dev/sj/DevListScroll';
import DevSjSearchList from 'component/dev/sj/DevSearchList';

//          component App       //
function App() {
  const APP_GB = `${process.env.REACT_APP_GB}`;
  const HOME_PATH = `${process.env.REACT_APP_HOME_PATH}`;

  // axios
  axios.defaults.baseURL = `${process.env.REACT_APP_API_URL}`;
  axios.interceptors.response.use(
    // @ts-ignore
    (resp) => {
      //console.log('response:', response);
      //console.log('response status:', response.data.status);
      //console.log('response resultMsg:', response.data.resultMsg);
      //console.log('response divisionCode:', response.data.divisionCode);
      if (resp && resp.request && resp.request.responseURL) {
        const responseURL = resp.request.responseURL;
        if (responseURL && responseURL.indexOf('/mbr/login') === -1 && resp.data.status) {
          return new Promise((resolve, reject) => {
            resolve('OK');
          })
            .then((result) => {
              if (400 <= resp.data.status && 500 > resp.data.status) {
                // 정상 통신 내 메세지 처리.
                throw new Error(resp.data.resultMsg + '[' + resp.data.divisionCode + ']');
              } else {
                throw new Error('시스템 관라자에게 문의 바랍니다.[' + resp.data.divisionCode + ']');
              }
            })
            .catch((error) => {
              console.error(error);
              setMyAlerts('warning', '오류 발생!', error.message, '');
            });
        } else {
          // 요청이 성공했을 때 실행될 로직
          return resp;
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

  // Modal dialog
  const [maskShow, setMaskShow] = useState(false);
  const [modialogShow, setModialogShow] = useState(false);
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
  // Alert
  const [alertShow, setAlertShow] = useState(false);
  const [myAlertInfo, setMyAlertInfo] = useState({ alertShow: alertShow, alertVariant: 'info', alertHeading: '', alertMsg: '', setAlertShow: setAlertShow, setMaskShow: setMaskShow, callbackFn: null, callbackCd: '' });

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

  //          effect          //
  useEffect(() => {
    //토글 저장
    localStorage.setItem('sb|sidebar-toggle', 'true');

    //개발자 호스트 확인
    let chk_hostname = window.location.hostname;
    if ('localhost' !== chk_hostname) {
      if (`${process.env.REACT_APP_API_URL}`.indexOf(chk_hostname) === -1) {
        setMyAlerts('warning', '개발자 확인!!', '개발 환경 세팅 확인\n[접근 hostname, API hostname 다름]\nREACT_APP_API_URL 체킹', '');
      }
    }
    //color모드
    initColorMode();

    // 개발자 업데이트 고지용
    let chkVersion = localStorage.getItem('chkVersion');
    let appVersion = `${process.env.REACT_APP_VERSION}`;
    if (!chkVersion || chkVersion !== appVersion) {
      localStorage.setItem('chkVersion', appVersion);
      initMenuData();
      initCodData();
      alert(`${process.env.REACT_APP_VERSION_MSG}`);
      setTimeout(() => window.location.replace(HOME_PATH + '/'), 1000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getMenuList, initCodData, initColorMode, initMenuData, isMenuData, islogIn]);

  return (
    <>
      {/* // description : 개발 BrowserRouter 운영 HashRouter 모든 url 시작에 # 자동으로 붙인다. */}
      {APP_GB === 'DEV' ? (
        <BrowserRouter>
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
              <main id="main">
                <div className="container-fluid px-4">
                  <Routes>
                    {/* // description : 로그인과 무관 접근 가능 */}
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/bootstrap/Dashboard" element={<Dashboard />} />
                    <Route element={<PrivateRoute userAuthentication={false} setMyAlerts={setMyAlerts} />}>
                      <Route path="/Login" element={<Login myAlertInfo={myAlertInfo} setMyAlertInfo={setMyAlertInfo} />} />
                      <Route path="/Join" element={<Join />} />
                    </Route>
                    {/* // description : 로그인 시에만 접근 가능 */}
                    <Route element={<PrivateRoute userAuthentication={true} setMyAlerts={setMyAlerts} />}>
                      <Route path="/:topMenuSeq/dev/DevMain" element={<DevMain />} />
                      <Route path="/:topMenuSeq/dev/TodoList" element={<TodoList myModialogInfo={myModialogInfo} setMyModialogInfo={setMyModialogInfo} setMaskShow={setMaskShow} />} />
                      <Route path="/:topMenuSeq/dev/TodoList/:compressParams" element={<TodoList myModialogInfo={myModialogInfo} setMyModialogInfo={setMyModialogInfo} setMaskShow={setMaskShow} />} />
                      <Route path="/:topMenuSeq/sj/DevAssembl" element={<DevAssembl myAlertInfo={myAlertInfo} setMyAlertInfo={setMyAlertInfo} myModialogInfo={myModialogInfo} setMyModialogInfo={setMyModialogInfo} />} />
                      <Route path="/:topMenuSeq/sj/DevCalendar" element={<DevCalendar />} />
                      <Route path="/:topMenuSeq/sj/DevSearchList" element={<DevSjSearchList />} />
                      <Route path="/:topMenuSeq/sj/DevListScroll" element={<DevListScroll />} />
                      <Route path="/:topMenuSeq/hm/DevSearchList" element={<DevSearchList />} />
                      <Route path="/:topMenuSeq/hm/DevDetail/:boardId" element={<DevDetail myModialogInfo={myModialogInfo} setMyModialogInfo={setMyModialogInfo} />} />
                      <Route path="/:topMenuSeq/hm/DevWrite" element={<DevWrite myModialogInfo={myModialogInfo} setMyModialogInfo={setMyModialogInfo} />} />
                      <Route path="/Profile" element={<Profile myModialogInfo={myModialogInfo} setMyModialogInfo={setMyModialogInfo} />} />
                    </Route>
                  </Routes>
                </div>
              </main>
            </div>
          </div>
          <Footer />
        </BrowserRouter>
      ) : (
        <HashRouter>
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
              <main>
                <div className="container-fluid px-4">
                  <Routes>
                    {/* // description : 로그인과 무관 접근 가능 */}
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/bootstrap/Dashboard" element={<Dashboard />} />
                    <Route element={<PrivateRoute userAuthentication={false} setMyAlerts={setMyAlerts} />}>
                      <Route path="/Login" element={<Login myAlertInfo={myAlertInfo} setMyAlertInfo={setMyAlertInfo} />} />
                      <Route path="/Join" element={<Join />} />
                    </Route>
                    {/* // description : 로그인 시에만 접근 가능 */}
                    <Route element={<PrivateRoute userAuthentication={true} setMyAlerts={setMyAlerts} />}>
                      <Route path="/:topMenuSeq/dev/DevMain" element={<DevMain />} />
                      <Route path="/:topMenuSeq/dev/TodoList" element={<TodoList myModialogInfo={myModialogInfo} setMyModialogInfo={setMyModialogInfo} setMaskShow={setMaskShow} />} />
                      <Route path="/:topMenuSeq/dev/TodoList/:compressParams" element={<TodoList myModialogInfo={myModialogInfo} setMyModialogInfo={setMyModialogInfo} setMaskShow={setMaskShow} />} />
                      <Route path="/:topMenuSeq/sj/DevAssembl" element={<DevAssembl myAlertInfo={myAlertInfo} setMyAlertInfo={setMyAlertInfo} myModialogInfo={myModialogInfo} setMyModialogInfo={setMyModialogInfo} />} />
                      <Route path="/:topMenuSeq/sj/DevCalendar" element={<DevCalendar />} />
                      <Route path="/:topMenuSeq/sj/DevSearchList" element={<DevSjSearchList />} />
                      <Route path="/:topMenuSeq/sj/DevListScroll" element={<DevListScroll />} />
                      <Route path="/:topMenuSeq/hm/DevSearchList" element={<DevSearchList />} />
                      <Route path="/:topMenuSeq/hm/DevDetail/:boardId" element={<DevDetail myModialogInfo={myModialogInfo} setMyModialogInfo={setMyModialogInfo} />} />
                      <Route path="/:topMenuSeq/hm/DevWrite" element={<DevWrite myModialogInfo={myModialogInfo} setMyModialogInfo={setMyModialogInfo} />} />
                      <Route path="/Profile" element={<Profile myModialogInfo={myModialogInfo} setMyModialogInfo={setMyModialogInfo} />} />
                    </Route>
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
