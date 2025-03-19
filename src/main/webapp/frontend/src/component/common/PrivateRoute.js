import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

export default function PrivateRoute({ userAuthentication, setMyAlerts }) {
  const isLogin = localStorage.getItem('com_access_token') ? true : false; // 로그인 여부 확인
  if (userAuthentication) {
    // 사용자 인증을 해야만하는 페이지
    // 인증을 안했을 경우 메인 페이지로, 했을 경우 해당 페이지로
    if (!isLogin) {
      setMyAlerts('warning', '알림!', '로그인 후 이용 가능 합니다.', '');
      return <Navigate to="/Login" />;
    }
    return !isLogin ? <Navigate to="/Login" /> : <Outlet />;
  } else {
    // 인증을 안해야만 하는 페이지
    // 인증을 안했을 경우 해당 페이지로, 인증을 한 상태일 경우 메인 페이지로
    return !isLogin ? <Outlet /> : <Navigate to="/" />;
  }
}
