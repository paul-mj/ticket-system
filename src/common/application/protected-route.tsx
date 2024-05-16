import React, { useEffect, useState } from 'react';

import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom'
import AxiosInterceptor from '../../core/services/axios/response-interceptor';

export const ProtectedRoutes = () => {
  const navigate = useNavigate();
  const location = useLocation()
  const [authState, setAuthState] = useState(false)
  useEffect(() => {
    const isAuthenticated = !!localStorage.getItem('helpdeskAccessToken');
    setAuthState(isAuthenticated)
    if (!isAuthenticated) {
      const redirectUrl = location.pathname + location.search;
      navigate(`/auth/login?redirect=${encodeURIComponent(redirectUrl)}`);
    }
  }, [location.pathname, location.search, navigate])


  return authState ? (
    <>
      <AxiosInterceptor />
      <Outlet />
    </>
  ) : null;

};
