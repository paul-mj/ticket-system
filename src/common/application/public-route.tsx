import React from 'react';

import { Navigate, Outlet, useLocation } from 'react-router-dom'

const useAuth = () => {
    const location = useLocation();
    const excludedPaths = ['acknowledgement']
    const user = localStorage.getItem('helpdeskAccessToken')
    if (user) {
        return !excludedPaths.some((path:any) => location.pathname.includes(path));
    } else {
        return false
    }
}

const PublicRoutes = (props: any) => {
    const auth = useAuth()  
    return auth ? <Navigate to="/action-queue" /> : <Outlet />
} 

export default PublicRoutes;