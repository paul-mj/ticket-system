import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import localStore from '../browserstore/localstore';
import ApiService from '../../core/services/axios/api';

const MAX_REFRESH_TOKEN_ATTEMPTS = 2;


type RequestInterceptorProps = {
    children: React.ReactNode;
};

const RequestInterceptor: React.FC<RequestInterceptorProps> = ({ children }: RequestInterceptorProps) => {
    const [refreshTokenAttempts, setRefreshTokenAttempts] = useState<number>(0);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const isProtectedRoute = location.pathname !== '/auth/login';

        if (isProtectedRoute) {

            axios.interceptors.request.use((request: any) => {
                request.headers['Authorization'] = `Bearer ${localStore.getToken()}`;
                return request;
            });

            axios.interceptors.response.use(
                (response) => response,
                async (error) => {
                    const { response, config } = error;
                    const originalRequest = config; 
                    if (response && response.status === 401 && refreshTokenAttempts < MAX_REFRESH_TOKEN_ATTEMPTS) {
                        try {
                            const accessToken = await refreshAccessToken();
                            if (accessToken) {
                                setRefreshTokenAttempts(0);
                                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                                return axios(originalRequest);
                            }
                        } catch (error) {
                            console.log(error);
                            frmLogout();
                            // Handle refresh token error
                            // ...
                            return Promise.resolve(response);
                        }
                    } else if (response && response.status === 419) {
                        alert('hello')
                        return Promise.resolve(response);
                    } else if (response && response.status === 404) {
                        // Handle not found error
                        return Promise.resolve(response);
                    } else if (response && response.status === 400) {
                        // Handle bad request error
                        return Promise.resolve(response);
                    } else if (response && response.status === 403) {
                        // Handle forbidden error
                        return Promise.resolve(response);
                    } else if (response && response.status === 500) {
                        // Handle internal server error
                        return Promise.resolve(response);
                    } else {
                        // Handle other errors
                        return Promise.reject(error);
                    }
                }
            );
        }
    }, [refreshTokenAttempts, location.pathname]);

    const refreshAccessToken = async (): Promise<string | undefined> => { 
        const refreshToken = localStore.getRefreshToken();
        const accessToken = localStore.getToken();
        if (refreshToken && accessToken) {
            try {
                const paramData = {
                    AppId: 2,
                    AccessToken: accessToken,
                    RefreshToken: refreshToken
                };
                const refreshedTokenResponse = await ApiService.httpPost('user/renewToken', paramData);
                localStore.addItem('helpdeskAccessToken', refreshedTokenResponse.AccessToken);
                localStore.addItem('helpdeskRefreshToken', refreshedTokenResponse.RefreshToken);
                return refreshedTokenResponse.AccessToken; 
            } catch (error: any) {
                console.log('Error:', error.message);
                if (axios.isCancel(error)) {
                    // Handle cancellation request
                    return Promise.reject(error);
                }
                setRefreshTokenAttempts(refreshTokenAttempts + 1);
                if (refreshTokenAttempts < MAX_REFRESH_TOKEN_ATTEMPTS && error.response && error.response.status === 401) {
                    return refreshAccessToken();
                } else {
                    frmLogout();
                    return Promise.reject(error);
                }
            }
        }
    }; 

    const frmLogout = (): void => {
        localStore.clearAll()
        navigate('/');
    };

    return <>{children}</>;
};

export default RequestInterceptor;