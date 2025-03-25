import { useContext, useEffect, useState } from 'react';
import { Image } from 'react-bootstrap';
import { Link, NavLink, useLocation, useNavigate, useParams } from 'react-router-dom'; // NavLink path 접근시 active 처리 자동화
import CodeStore from 'stores/CodeStore';
import ColorModeStore from 'stores/ColorModeStore';
import { ContextStore } from 'stores/ContextStore';
import MenuStore from 'stores/MenuStore';
import UseLoginStore from 'stores/UseLoginStore';
import { assets } from 'assets/images';
//          component: Header 컴포넌트          //
function Header(props) {
  //로그인상태
  const { islogIn, storeLogout, getMbrId, getMbrRoles } = UseLoginStore((state) => {
    return state;
  });
  const { isMenuData, getMenuList, initMenuData } = MenuStore((state) => {
    return state;
  });
  const { initCodData } = CodeStore((state) => {
    return state;
  });
  const { setColor, getColor } = ColorModeStore((state) => {
    return state;
  });
  const { getTotalQuantity } = useContext(ContextStore);

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

  const totalQuantity = getTotalQuantity();
  const theme = getColor();

  //          event handler        //
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
    //navigate('/Login');
    props.setShowLogin(true);
  };

  //메뉴토글
  const onToggleClickHandler = (event) => {
    const sidebarToggle = document.body.querySelector('#sidebarToggle');

    if (sidebarToggle) {
      document.body.classList.toggle('sb-sidenav-toggled');
      localStorage.setItem('sb|sidebar-toggle', 'false');
    }
  };
  //모드변경
  const onClickModeBtn = (colorMode) => {
    setColor(colorMode);

    const sidenavAccordion = document.getElementById('sidenavAccordion');
    sidenavAccordion.removeAttribute('class');
    sidenavAccordion.setAttribute('class', 'top-menus sb-sidenav accordion sb-sidenav-' + colorMode);

    const sidenavAccordionTopLevel = document.getElementById('sidenavAccordionTopLevel');
    sidenavAccordionTopLevel.removeAttribute('class');
    sidenavAccordionTopLevel.setAttribute('class', 'top-level-menus sb-sidenav accordion sb-sidenav-' + colorMode);

    const sidenavFooter = document.getElementById('sbSidenavFooter');
    sidenavFooter.removeAttribute('class');
    sidenavFooter.setAttribute('class', '' + colorMode + ' bg-' + colorMode);

    const topNav = document.getElementById('topNav');
    topNav.removeAttribute('class');
    topNav.setAttribute('class', 'sb-topnav navbar navbar-expand menus navbar-' + colorMode + ' bg-' + colorMode);

    const layoutSidenav_content = document.getElementById('layoutSidenav_content');
    layoutSidenav_content.removeAttribute('class');
    layoutSidenav_content.setAttribute('class', '' + colorMode + ' bg-' + colorMode + ' text-bg-' + colorMode);

    const footer = document.getElementById('footer');
    footer.removeAttribute('class');
    footer.setAttribute('class', 'bg-' + colorMode + ' text-bg-' + colorMode);
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
      navigate('/');
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
    <div style={{ width: '90%', justifyContent: 'center', display: 'flex' }}>
      <nav id="topNav" className="sb-topnav navbar navbar-expand navbar-dark bg-dark menus">
        <button className="btn btn-link btn-sm" style={{ marginTop: '0px', marginLeft: '5px' }} id="sidebarToggle" onClick={onToggleClickHandler}>
          <i className="fas fa-bars"></i>
        </button>
        <div className="navbar-brand ps-3 pt-2">
          {theme === 'dark' ? (
            <Image
              src={assets.logo_black_kor}
              width={180}
              height={55}
              onClick={(evt) => {
                onLogoClickHandler();
              }}
            />
          ) : (
            <Image
              src={assets.logo_white_kor}
              width={180}
              height={55}
              onClick={(evt) => {
                onLogoClickHandler();
              }}
            />
          )}
        </div>
        {/*
          <button className='btn btn-link btn-sm order-1 order-lg-0 me-4 me-lg-0' id='sidebarToggle' onClick={onToggleClickHandler}><i className='fas fa-bars'></i></button>
        */}
        {/* TopMenu, Sidebar 분리 버전 menus.top-menus 으로 반응형 디스플레이 제어*/}
        <ul className="top-menus navbar-nav" style={{ width: '80%' }}>
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
              <i className="fas fa-search" />
            </button>
          </div>
        </form> */}
        <ul className="navbar-nav ms-auto ms-md-0">
          <Link className="nav-link dropdown-item" to="/cart">
            <i className="fas fa-shopping-cart fa-fw"></i>
            &nbsp;{totalQuantity === 0 ? ' ' : totalQuantity}
          </Link>
        </ul>
        <ul className="navbar-nav ms-auto ms-md-0">
          <li className="nav-item dropdown">
            <Link className="nav-link dropdown-toggle" id="navbarDropdown" to="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
              <i className="fas fa-gear fa-fw"></i>
            </Link>
            <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
              <li onClick={onClickResetStore}>
                <Link className="dropdown-item" to="#">
                  <i className="fas fa-tools" />
                  {'  '}Config Reset
                </Link>
              </li>
              <li>
                <Link
                  className="dropdown-item"
                  to="#"
                  onClick={(e) => {
                    onClickModeBtn('light');
                  }}
                >
                  <i className="fas fa-sun" />
                  {'  '}Light Mode
                </Link>
              </li>
              <li>
                <Link
                  className="dropdown-item"
                  to="#"
                  onClick={(e) => {
                    onClickModeBtn('dark');
                  }}
                >
                  <i className="fas fa-moon" />
                  {'  '}Dark Mode
                </Link>
              </li>
            </ul>
          </li>
        </ul>
        <ul className="navbar-nav ms-auto ms-md-0 me-3">
          <li className="nav-item dropdown">
            <Link className="nav-link dropdown-toggle" id="navbarDropdown2" to="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
              <i className="fas fa-user fa-fw"></i>
            </Link>
            <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown2">
              {!islogIn && (
                <>
                  <li onClick={onClickLogInButton}>
                    <Link className="dropdown-item" to="#">
                      Login
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
    </div>
  );
}

export default Header;
