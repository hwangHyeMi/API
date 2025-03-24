import { create } from 'zustand';
const getToken = () => {
  const token = localStorage.getItem('com_access_token');
  return token;
};

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
    return localStorage.getItem('mbrRoles'); // ADMIN,USER OR USER
  },
}));

export default useLoginStore;
