import { create } from 'zustand';

const getColorMode = () => {
  return localStorage.getItem('data-bs-theme');
};
const setColorMode = (colorMode) => {
  localStorage.setItem('data-bs-theme', colorMode);
  document.documentElement.setAttribute('data-bs-theme', colorMode);
};

const colorModeStore = create((set) => ({
  getColor: () => {
    return getColorMode();
  },
  setColor: (colorMode) => {
    setColorMode(colorMode);
  },
  initColorMode: () => {
    let colorMode = getColorMode();
    if (!colorMode) colorMode = 'light';

    document.documentElement.setAttribute('data-bs-theme', colorMode);
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

    const footer = document.getElementById('footer');
    footer.removeAttribute('class');
    footer.setAttribute('class', 'py-4 mt-auto bg-' + colorMode);
  },
}));

export default colorModeStore;
