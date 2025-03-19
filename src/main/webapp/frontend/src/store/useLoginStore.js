import { create } from 'zustand';
const getToken = () => {
  const token = localStorage.getItem('com_access_token');
  return token;
};

/*
브라우저 f12 > 애플리케이션 > 로컬저장소 확인(브라우저 닫았다 다시 열어도 값 유지) 
토큰유효시간?? 이런거 고려요망
<방법>
1.로컬저장소 (현재되어있는방식)
2.세션저장소 (해당탭에서만유지)
3.쿠키       (httpOnly설정하면 웹취약성도 괜찮으나 공격가능)?? 잘 모름
*/
const setAuth = (data) => {
  let authorityCd = '';
  localStorage.setItem('mbrId', data.mbrId);
  localStorage.setItem('com_access_token', data.token);
  localStorage.setItem('mbrSeq', data.mbrSeq);
  localStorage.setItem('mbrNm', data.mbrNm);
  localStorage.setItem('groupCode', data.groupCode);
  localStorage.setItem('mbrAuthorities', JSON.stringify(data.mbrAuthorities)); //멀티권한 맵
  console.log(data);
  data.mbrAuthorities.forEach((i) => {
    if (authorityCd != '') {
      authorityCd = authorityCd + ',' + i.authority;
    } else {
      authorityCd = i.authority;
    }
  });
  localStorage.setItem('mbrRoles', authorityCd);
  localStorage.setItem('mbrLoginFailCnt', data.mbrLoginFailCnt);
  localStorage.setItem('role', data.role);
};

const removeAuth = () => {
  localStorage.removeItem('mbrId');
  localStorage.removeItem('com_access_token');
  localStorage.removeItem('mbrSeq');
  localStorage.removeItem('mbrNm');
  localStorage.removeItem('groupCode');
  localStorage.removeItem('mbrAuthorities');
  localStorage.removeItem('mbrRoles');
  localStorage.removeItem('mbrLoginFailCnt');
  localStorage.removeItem('role');
};

//islogIn밑에 변수 추가해서 쓰면 됨
const useLoginStore = create((set) => ({
  islogIn: getToken() ? true : false, //초기값 (토큰이 있으면)
  storeLogin: (data) => {
    set({ islogIn: true });
    setAuth(data);
  },
  storeLogout: () => {
    set({ islogIn: false });
    removeAuth();
  },
  getMbrId: () => {
    return localStorage.getItem('mbrId');
  },
  getMbrNm: () => {
    return localStorage.getItem('mbrNm');
  },
  getMbrSeq: () => {
    return localStorage.getItem('mbrSeq');
  },
  getMbrRoles: () => {
    return localStorage.getItem('mbrRoles');
  },
}));

export default useLoginStore;
