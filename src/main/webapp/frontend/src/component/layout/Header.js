import React, { useEffect } from 'react';
import { NavLink, Link, useLocation, useParams, useNavigate } from 'react-router-dom'; // NavLink path 접근시 active 처리 자동화
import { useState } from 'react';

import useLoginStore from 'store/useLoginStore';
import menuStore from 'store/menuStore';
import codeStore from 'store/codeStore';
import colorModeStore from 'store/colorModeStore';

//          component: Header 컴포넌트          //
function Header(props) {
  const HOME_PATH = `${process.env.REACT_APP_HOME_PATH}`;
  //로그인상태
  const { islogIn, storeLogout, getMbrId, getMbrRoles } = useLoginStore((state) => {
    return state;
  });
  const { isMenuData, getMenuList, initMenuData } = menuStore((state) => {
    return state;
  });
  const { initCodData } = codeStore((state) => {
    return state;
  });
  const { setColor } = colorModeStore((state) => {
    return state;
  });

  const [topMenuList, setTopMenuList] = useState([]);

  //검색 돋보기 누른상태
  const [status, setStatus] = useState(false);

  //검색어 상태
  const [searchWord, setSearchWord] = useState('');

  //다중권한
  const [roles, setRoles] = useState('EVERY');

  //네비게이트
  const navigate = useNavigate();
  const location = useLocation(); // useLocation 훅 사용
  const pathname = location.pathname;
  const { topMenuSeq } = useParams();

  //          event handler: onClickLoginButton         //
  //로고
  const onLogoClickHandler = () => {
    navigate('/');
  };

  //프로필버튼 클릭
  const onClickMypageButton = () => {
    navigate('/Profile');
  };

  //로그아웃 버튼
  const onClickLogOutButton = () => {
    let userId = getMbrId();
    localStorage.removeItem('todoParams');
    setMyAlerts('success', '알림!', userId + '님, 성공적으로 로그 아웃 되었습니다. 🙈', 'OUT');
  };

  //로그인 버튼
  const onClickLogInButton = () => {
    navigate('/Login');
  };
  //로그인 버튼
  const onClickJoinButton = () => {
    navigate('/Join');
  };

  //메뉴토글
  const onToggleClickHandler = (event) => {
    const sidebarToggle = document.body.querySelector('#sidebarToggle');

    if (sidebarToggle) {
      document.body.classList.toggle('sb-sidenav-toggled');
      localStorage.setItem('sb|sidebar-toggle', 'true');
    }
  };
  //모드변경
  const onClickModeBtn = (colorMode, event) => {
    setColor(colorMode);
    // sb-sidenav : react-bootstrap 패턴이 아닌 bootstrap 패턴이라 추가 작업 > 추후 변경 고민
    // sidenavAccordion 에 [sb-sidenav-light, sb-sidenav-dark] 토글 처리
    const sidenavAccordion = document.getElementById('sidenavAccordion');
    sidenavAccordion.removeAttribute('class');
    sidenavAccordion.setAttribute('class', 'top-menus sb-sidenav accordion sb-sidenav-' + colorMode);

    const sidenavAccordionTopLevel = document.getElementById('sidenavAccordionTopLevel');
    sidenavAccordionTopLevel.removeAttribute('class');
    sidenavAccordionTopLevel.setAttribute('class', 'top-level-menus sb-sidenav accordion sb-sidenav-' + colorMode);

    const topNav = document.getElementById('topNav');
    topNav.removeAttribute('class');
    topNav.setAttribute('class', 'sb-topnav navbar navbar-expand menus navbar-' + colorMode + ' bg-' + colorMode);

    const layoutSidenav = document.getElementById('layoutSidenav');
    layoutSidenav.removeAttribute('class');
    layoutSidenav.setAttribute('class', '' + colorMode + ' bg-' + colorMode + ' text-bg-' + colorMode);

    const footer = document.getElementById('footer');
    footer.removeAttribute('class');
    footer.setAttribute('class', 'py-4 mt-auto bg-' + colorMode);
    // CanvasJS theme re render 방법 모름 > / 로 이동 처리
    //setTimeout(() => navigate('/'), 1000);
    //setTimeout(() => window.location.replace(HOME_PATH + '/'), 1000);
  };

  //메뉴 코드 정보 초기화
  const onClickResetStore = (event) => {
    initMenuData();
    initCodData();
    setMyAlerts('success', '알림!', '메뉴 및 코드 정보 초기화 완료.\n잠시 후 화면을 자동으로 새로 고침 합니다.', 'RSET');
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

  //alert 콜백
  const MyAlertCallbackFn = (callbackCd) => {
    if ('OK' === callbackCd) {
      navigate('/');
    } else if ('OUT' === callbackCd) {
      navigate('/');
      setTimeout(() => storeLogout(), 1000);
    } else if ('RSET' === callbackCd) {
      setTimeout(() => window.location.replace(HOME_PATH + '/'), 1000);
    }
  };
  //          effect          //
  useEffect(() => {
    if (isMenuData) {
      let all_menu_list = getMenuList();

      if (all_menu_list) {
        if (islogIn) {
          if (all_menu_list && all_menu_list.userMenuList) setTopMenuList(all_menu_list.userMenuList);
        } else {
          if (all_menu_list && all_menu_list.frontMenuList) setTopMenuList(all_menu_list.frontMenuList);
        }
      }
    }

    if (islogIn) {
      setRoles(getMbrRoles());
    }
    // setMyAlerts 추가 하면 무한 루프
  }, [getMenuList, isMenuData, islogIn, navigate, pathname]);
  return (
    <>
      <nav id="topNav" className="sb-topnav navbar navbar-expand navbar-dark bg-dark menus">
        <button className="btn btn-link btn-sm" style={{ marginTop: '10px' }} id="sidebarToggle" onClick={onToggleClickHandler}>
          <i className="fas fa-bars"></i>
        </button>
        <div className="navbar-brand ps-3" onClick={onLogoClickHandler}>
          {process.env.REACT_APP_HEADER_TITLE}
        </div>
        {/*
          <button className='btn btn-link btn-sm order-1 order-lg-0 me-4 me-lg-0' id='sidebarToggle' onClick={onToggleClickHandler}><i className='fas fa-bars'></i></button>
        */}
        {/* TopMenu, Sidebar 분리 버전 menus.top-menus 으로 반응형 디스플레이 제어*/}
        <ul className="top-menus navbar-nav" style={{ width: '60%' }}>
          {!islogIn && (
            <>
              {topMenuList
                .filter((data) => data.menuType === 'TOP' && data.authorityCd === 'EVERY')
                .map((menu, i) => {
                  //console.log('2 menu.menuSeq ' + i + ' ' + menu.menuSeq);
                  return (
                    <li key={menu.menuSeq} className="nav-item" style={{ padding: '4px' }}>
                      <NavLink to={'/' + menu.topMenuSeq + menu.viewNm} className="nav-link">
                        {menu.menuNm}
                      </NavLink>
                    </li>
                  );
                })}
            </>
          )}
          {islogIn && (
            <>
              {topMenuList
                .filter((data) => data.menuType === 'TOP' && roles.includes(data.authorityCd))
                .map((menu, i) => {
                  return (
                    <li key={menu.menuSeq} className="nav-item" style={{ padding: '4px' }}>
                      <NavLink to={'/' + menu.topMenuSeq + menu.viewNm} className="nav-link">
                        {menu.menuNm}
                      </NavLink>
                    </li>
                  );
                })}
            </>
          )}
        </ul>
        {/* <form className="d-none d-md-inline-block form-inline ms-auto me-0 me-md-3 my-2 my-md-0">
          <div className="input-group">
            <input className="form-control" type="text" placeholder="Search for..." aria-label="Search for..." aria-describedby="btnNavbarSearch" />
            <button className="btn btn-primary" id="btnNavbarSearch" type="button">
              <i className="fas fa-search"></i>
            </button>
          </div>
        </form> */}
        <ul className="navbar-nav" style={{ width: '60px', marginRight: '25px' }}>
          <li className="nav-item">
            <Link
              className="nav-link"
              to="#"
              onClick={(e) => {
                onClickResetStore();
              }}
            >
              <div className="sb-nav-link-icon">
                <i className="fas fa-tools"></i>
              </div>
            </Link>
          </li>
          <li className="nav-item">
            <Link
              className="nav-link"
              to="#"
              onClick={(e) => {
                onClickModeBtn('light', e);
              }}
            >
              <div className="sb-nav-link-icon">
                <i className="fas fa-sun"></i>
              </div>
            </Link>
          </li>
          <li className="nav-item">
            <Link
              className="nav-link"
              to="#"
              onClick={(e) => {
                onClickModeBtn('dark', e);
              }}
            >
              <div className="sb-nav-link-icon">
                <i className="fas fa-moon"></i>
              </div>
            </Link>
          </li>
        </ul>
        <ul className="navbar-nav ms-auto ms-md-0 me-3 me-lg-4">
          <li className="nav-item dropdown">
            <Link className="nav-link dropdown-toggle" id="navbarDropdown" to="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
              <i className="fas fa-user fa-fw"></i>
            </Link>
            <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
              {!islogIn && (
                <>
                  <li onClick={onClickLogInButton}>
                    <Link className="dropdown-item" to="#">
                      Login
                    </Link>
                  </li>
                  <li onClick={onClickJoinButton}>
                    <Link className="dropdown-item" to="#">
                      Join
                    </Link>
                  </li>
                </>
              )}
              {islogIn && (
                <>
                  <li onClick={onClickMypageButton}>
                    <Link className="dropdown-item" to="#">
                      Profile
                    </Link>
                  </li>
                  <li onClick={onClickLogOutButton}>
                    <Link className="dropdown-item" to="#">
                      LogOut
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </li>
        </ul>
      </nav>
    </>
  );
}

export default Header;
