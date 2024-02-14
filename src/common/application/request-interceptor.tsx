import axios from 'axios';
import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import localStore from '../browserstore/localstore';

const Url = () => {
    const config = window['config'];
    return `${config.BASE_URL}`;
};

const api = axios.create({
    baseURL: Url(),
    headers: {
        'Content-Type': 'application/json'
    }
});


axios.interceptors.request.use(request => {
    request.headers["Authorization"] = `Bearer ${localStore.getToken()}`;
    return request;
});

 
api.interceptors.response.use((response) => {
    return response;
}, async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 404)
    {
        alert("Error 404");
    }
    if (error.response.status === 401 && !originalRequest._retry) { 
        originalRequest._retry = true;
        const refreshToken = localStore.getRefreshToken();
        const accessToken = localStore.getToken();

        const param = {
            AppId: 2,
            AccessToken: accessToken,
            RefreshToken: refreshToken,
        };

        try {
            const response = await axios.post('user/renewToken', param, { headers: { 'frmRefreshToken': refreshToken } });
            const frmAccessToken = response.data.AccessToken;
            const frmRefreshToken = response.data.RefreshToken;

            localStore.addItem('frmAccessToken', frmAccessToken);
            localStore.addItem('frmRefreshToken', frmRefreshToken);

            api.defaults.headers.common['Authorization'] = 'Bearer ' + frmAccessToken;
            originalRequest.headers['Authorization'] = 'Bearer ' + frmAccessToken;

            return api(originalRequest);
        } catch (error) {
            return Promise.reject(error);
        }
    }
    return Promise.reject(error);
});

export const ProtectedRoutes = () => {
    const [requestInterceptorId, setRequestInterceptorId] = useState<any>();

    useEffect(() => {
        const isAuthenticated = !!localStore.getToken();

        if (isAuthenticated) {
            const interceptorId = api.interceptors.request.use((config) => {
                // Do something before sending the request
                return config;
            }, (error) => {
                return Promise.reject(error);
            });

            setRequestInterceptorId(interceptorId);
        }

        return () => {
            if (requestInterceptorId) {
                api.interceptors.request.eject(requestInterceptorId);
            }
        };
    }, []);

    const isAuthenticated = !!localStore.getToken();

    return isAuthenticated ? (
        <Outlet />
    ) : (
        <Navigate to="/auth/itclogin" replace />
    );
};
