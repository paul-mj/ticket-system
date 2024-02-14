import React, { useEffect } from 'react';

import { Navigate, Outlet, useNavigate } from 'react-router-dom'
import AxiosInterceptor from '../../core/services/axios/response-interceptor';

export const OperatorRoutes = () => {
    const navigate = useNavigate();

    const isAuthenticated = !!localStorage.getItem('operatorTrack');

    /*  useEffect(() => {
       navigate('/dashboard');
     }, [navigate]); */

    return isAuthenticated ? (
        <>
            <AxiosInterceptor />
            <Outlet />
        </>
    ) : (
        <Navigate to="/auth/itclogin" replace />
    );
};
