import { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom'; // path 접근시 active 처리 자동화
// import { IconName } from 'react-icons/fa';
import colorModeStore from 'store/colorModeStore';
import menuStore from 'store/menuStore';
import useLoginStore from 'store/useLoginStore';
//import Icons from 'bootstrap-icons';

function Sidebar() {
  //로그인상태
  const { islogIn } = useLoginStore((state) => {
    return state;
  });
  const { isMenuData, getMenuList } = menuStore((state) => {
    return state;
  });
  const { getColor } = colorModeStore((state) => {
    return state;
  });

  const [liftMenuList, setLiftMenuList] = useState([]);
  //1 뎁스 path 세팅
  const [depth1path, setDepth1path] = useState('');
  //2 뎁스 path 세팅
  const [depth2path, setDepth2path] = useState('');
  //3 뎁스 path 세팅
  const [depth3path, setDepth3path] = useState('');

  // sb-sidenav : react-bootstrap 패턴이 아닌 bootstrap 패턴이라 추가 작업 > 추후 변경 고민
  const [colorMode, setColorMode] = useState('light');

  const location = useLocation(); // useLocation 훅 사용

  const pathname = location.pathname;
  const todoParams = localStorage.getItem('todoParams');

  const fnChkDepthByPath = (depthGb, chkPath) => {
    //console.log('fnChkDepthByPath '+depthGb+' chkPath='+chkPath +' [depth1path='+depth1path +' ,depth2path='+depth2path +' ,depth3path='+depth3path +']');
    if (depthGb === 1) {
      if (depth1path && depth1path !== '' && '' + depth1path === '' + chkPath) {
        return true;
      } else {
        return false;
      }
    } else if (depthGb === 2 || depthGb === 3) {
      let depthpath = depth2path;
      if (depthGb === 3) depthpath = depth3path;
      if (depthpath && depthpath !== '' && chkPath !== '' && chkPath.indexOf(depthpath) > -1) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  };

  useEffect(() => {
    if (isMenuData) {
      let all_menu_list = getMenuList();

      if (islogIn) {
        if (all_menu_list && all_menu_list.userMenuList) setLiftMenuList(all_menu_list.userMenuList);
      } else {
        if (all_menu_list && all_menu_list.frontMenuList) setLiftMenuList(all_menu_list.frontMenuList);
      }

      // pathname 으로 상위 [bootstrap, menu] 뎁스 show 세팅
      if (pathname) {
        if (pathname.indexOf('/') > -1) {
          const pathArry = pathname.split('/');

          let v_depth1path = '';
          let v_depth2path = '';
          let v_depth3path = '';
          if (pathArry.length > 3) {
            v_depth1path = pathArry[1];
            v_depth2path = pathArry[2];
            v_depth3path = pathArry[3];
          } else if (pathArry.length === 3) {
            v_depth1path = pathArry[1];
            v_depth2path = pathArry[2];
          }
          setDepth1path(v_depth1path);
          setDepth2path(v_depth2path);
          setDepth3path(v_depth3path);
        }
      }
    }
    setColorMode(getColor());
  }, [getColor, getMenuList, isMenuData, islogIn, pathname]);

  return (
    <div id="layoutSidenav_nav" className="menus">
      {/* TopMenu 포함 버전 menus.top-level-menus 으로 반응형 디스플레이 제어*/}
      <nav className={'top-level-menus sb-sidenav accordion sb-sidenav-' + colorMode} id="sidenavAccordionTopLevel">
        <div className="sb-sidenav-menu">
          <div className="nav">
            {liftMenuList
              .filter((data) => data.level === 1) // 1뎁스 (Top level)
              .map((topMenu, i) => {
                return (
                  <div key={topMenu.menuSeq} className="collapse show" id={'Menus_' + topMenu.topMenuSeq} aria-labelledby="headingOne" data-bs-parent="#sidenavAccordionTopLevel">
                    <nav className="nav">
                      <div key={topMenu.menuSeq}>
                        <NavLink className={fnChkDepthByPath(1, topMenu.topMenuSeq) ? 'nav-link active' : 'nav-link collapsed'} to={'/' + topMenu.topMenuSeq + topMenu.viewNm} data-bs-toggle="collapse" data-bs-target={'#menu_topuser_' + topMenu.menuSeq + 'Sub0Menus'} aria-expanded={fnChkDepthByPath(1, topMenu.topMenuSeq) ? 'true' : 'false'} aria-controls={'menu_topuser_' + topMenu.menuSeq + 'Sub0Menus'}>
                          <div className="sb-nav-link-icon">
                            <i className="fas fa-folder-open"></i>
                          </div>
                          {topMenu.menuNm}
                          <div className="sb-sidenav-collapse-arrow">
                            <i className="fas fa-angle-down"></i>
                          </div>
                        </NavLink>
                        <div className={fnChkDepthByPath(1, topMenu.topMenuSeq) ? 'collapse show' : 'collapse'} id={'menu_topuser_' + topMenu.menuSeq + 'Sub0Menus'} aria-labelledby="headingOne" data-bs-parent={'#Menus_' + topMenu.topMenuSeq}>
                          {liftMenuList
                            .filter((data1) => {
                              if (data1.level === 2 && topMenu.topMenuSeq === data1.topMenuSeq) {
                                // 2뎁스
                                return true;
                              } else {
                                return false;
                              }
                            })
                            .map((menu1, j) => {
                              if (menu1.menuType === 'FOLDER') {
                                return (
                                  <nav key={menu1.menuSeq} className="sb-sidenav-menu-nested nav">
                                    <NavLink className={fnChkDepthByPath(2, menu1.viewNm) ? 'nav-link active' : 'nav-link collapsed'} to={'/' + menu1.topMenuSeq + menu1.viewNm} data-bs-toggle="collapse" data-bs-target={'#menu_topuser_' + menu1.menuSeq + 'Sub1Menus'} aria-expanded={fnChkDepthByPath(2, menu1.viewNm) ? 'true' : 'false'} aria-controls={'menu_topuser_' + menu1.menuSeq + 'Sub1Menus'}>
                                      <div className="sb-nav-link-icon">
                                        <i className="fas fa-folder-open"></i>
                                      </div>
                                      {menu1.menuNm}
                                      <div className="sb-sidenav-collapse-arrow">
                                        <i className="fas fa-angle-down"></i>
                                      </div>
                                    </NavLink>

                                    <div className={fnChkDepthByPath(2, menu1.viewNm) ? 'collapse show' : 'collapse'} id={'menu_topuser_' + menu1.menuSeq + 'Sub1Menus'} aria-labelledby="headingOne" data-bs-parent={'#menu_topuser_' + topMenu.menuSeq + 'Sub0Menus'}>
                                      <nav className="sb-sidenav-menu-nested nav">
                                        {liftMenuList
                                          .filter((data2) => {
                                            if (data2.level === 3 && menu1.menuSeq === data2.parentMenuSeq) {
                                              // 3뎁스
                                              return true;
                                            } else {
                                              return false;
                                            }
                                          })
                                          .map((menu2, k) => {
                                            return (
                                              <div key={menu2.menuSeq}>
                                                {/* 키에러 발생 방지 */}
                                                <NavLink className="nav-link" to={'/' + menu2.topMenuSeq + menu2.viewNm}>
                                                  <div className="sb-nav-link-icon">
                                                    <i className="fas fa-file"></i>
                                                  </div>
                                                  {menu2.menuNm}
                                                </NavLink>
                                              </div>
                                            );
                                          })}
                                      </nav>
                                    </div>
                                  </nav>
                                );
                              } else {
                                return (
                                  <nav key={menu1.menuSeq} className="sb-sidenav-menu-nested nav">
                                    {/* 키에러 발생 방지 */}
                                    <NavLink className="nav-link" to={'/' + menu1.topMenuSeq + menu1.viewNm + (menu1.viewNm === '/dev/TodoList' && todoParams ? '/' + todoParams : '')}>
                                      <div className="sb-nav-link-icon">
                                        <i className="fas fa-file"></i>
                                      </div>
                                      {menu1.menuNm}
                                    </NavLink>
                                  </nav>
                                );
                              }
                            })}
                        </div>
                      </div>
                    </nav>
                  </div>
                );
              })}
          </div>
        </div>
      </nav>
      {/* TopMenu, Sidebar 분리 버전 menus.top-menus 으로 반응형 디스플레이 제어*/}
      <nav className={'top-menus sb-sidenav accordion sb-sidenav-' + colorMode} id="sidenavAccordion">
        <div className="sb-sidenav-menu">
          <div style={{ fontSize: '9px', color: 'blue', backgroundColor: 'rgb(186, 168, 168)', display: 'none' }}>
            <div>Top Menu child Side Menu [show/hide] 구현 완료 </div>
            <div>Open Parent Menu [collapse/ open] 구현 [완료] </div>
            <div>Open Menu (highlight) 구현 완료</div>
          </div>
          {/* // description : DB 메뉴 구성 */}
          <div className="nav">
            {/* // description : topMenuSeq 그룹({topMenuSeq} + Menus) */}
            {liftMenuList
              .filter((data) => data.level === 1) // 1뎁스 (Top level)
              .map((topMenu, i) => {
                return (
                  // description : className 'show' 노출 제어
                  <div key={topMenu.menuSeq} className={fnChkDepthByPath(1, topMenu.topMenuSeq) ? 'collapse show' : 'collapse'} id={'Menus_' + topMenu.topMenuSeq} aria-labelledby="headingOne">
                    <nav className="nav">
                      {liftMenuList
                        .filter((data1) => {
                          if (data1.level === 2 && topMenu.topMenuSeq === data1.topMenuSeq) {
                            // 2뎁스
                            return true;
                          } else {
                            return false;
                          }
                        })
                        .map((menu1, j) => {
                          if (menu1.menuType === 'FOLDER') {
                            return (
                              <div key={menu1.menuSeq}>
                                <NavLink className={fnChkDepthByPath(2, menu1.viewNm) ? 'nav-link' : 'nav-link collapsed'} to={'/' + menu1.topMenuSeq + menu1.viewNm} data-bs-toggle="collapse" data-bs-target={'#menu_user_' + menu1.menuSeq + 'Sub1Menus'} aria-expanded={fnChkDepthByPath(2, menu1.viewNm) ? 'true' : 'false'} aria-controls={'menu_user_' + menu1.menuSeq + 'Sub1Menus'}>
                                  <div className="sb-nav-link-icon">
                                    <i className="fas fa-folder-open"></i>
                                  </div>
                                  {menu1.menuNm}
                                  <div className="sb-sidenav-collapse-arrow">
                                    <i className="fas fa-angle-down"></i>
                                  </div>
                                </NavLink>

                                <div className={fnChkDepthByPath(2, menu1.viewNm) ? 'collapse show' : 'collapse'} id={'menu_user_' + menu1.menuSeq + 'Sub1Menus'} aria-labelledby="headingOne" data-bs-parent={'#Menus_' + topMenu.topMenuSeq}>
                                  <nav className="sb-sidenav-menu-nested nav">
                                    {liftMenuList
                                      .filter((data2) => {
                                        if (data2.level === 3 && menu1.menuSeq === data2.parentMenuSeq) {
                                          // 3뎁스
                                          return true;
                                        } else {
                                          return false;
                                        }
                                      })
                                      .map((menu2, k) => {
                                        return (
                                          <div key={menu2.menuSeq}>
                                            {/* 키에러 발생 방지 */}
                                            <NavLink className="nav-link" to={'/' + menu2.topMenuSeq + menu2.viewNm}>
                                              <div className="sb-nav-link-icon">
                                                <i className="fas fa-file"></i>
                                              </div>
                                              {menu2.menuNm}
                                            </NavLink>
                                          </div>
                                        );
                                      })}
                                  </nav>
                                </div>
                              </div>
                            );
                          } else {
                            return (
                              <div key={menu1.menuSeq}>
                                {/* 키에러 발생 방지 */}
                                <NavLink className="nav-link" to={'/' + menu1.topMenuSeq + menu1.viewNm + (menu1.viewNm === '/dev/TodoList' && todoParams ? '/' + todoParams : '')}>
                                  <div className="sb-nav-link-icon">
                                    <i className="fas fa-file"></i>
                                  </div>
                                  {menu1.menuNm}
                                </NavLink>
                              </div>
                            );
                          }
                        })}
                    </nav>
                  </div>
                );
              })}
          </div>
        </div>
        {/* <div className="sb-sidenav-footer">
          <div className="small"></div>
        </div> */}
      </nav>
    </div>
  );
}

export default Sidebar;
