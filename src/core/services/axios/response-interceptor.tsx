
import axios from 'axios';
import { useEffect } from 'react';
import localStore from '../../../common/browserstore/localstore';
import { updateConfig } from '../../../redux/reducers/common.reducer';
import { useDispatch } from 'react-redux';
import { useConfirm } from '../../../shared/components/dialogs/confirmation';
import { useNavigate } from 'react-router-dom';
import { UserType } from '../../../common/database/enums';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

const AxiosInterceptor = () => {
    const confirm = useConfirm();
    const accessToken = localStore.getToken();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    useEffect(() => {
        const interceptor = axios.interceptors.response.use(
            (response) => {
                return response;
            },
            async (error) => {
                console.log(error.response.status, 'error')
                console.log(accessToken, 'accessToken')
                if (error.response.status === 401) {
                    if (accessToken) {
                        const choice = await confirm({
                            ui: 'warning',
                            complete: true,
                            title: `${t('Session Expired')}`,
                            description: `${t('Your Session has been expired. Please log out and continue.')}`,
                            confirmBtnLabel: `${t('Okay')}`,
                        });
                        if (choice) {
                            const logData = localStore.getItem('frmLoginData')
                            const loginData = logData && JSON.parse(logData);
                            if (loginData?.USER_TYPE !== UserType.Franchise) {
                                navigate(`/auth/login`)
                                localStore.clearAll();
                            } else {
                                navigate(`/auth/operatorlogin`);
                                localStore.clearAll();
                            }
                            window.location.reload();
                            dispatch(updateConfig({ action: 'triggerLogoutPopup', payload: { isLogout401: false } }))
                        }
                        // dispatch(updateConfig({action:'triggerLogoutPopup',payload:{isLogout401:true}}))                        
                    }
                } else {  
                    toast.error(`${error?.message}, ${(error?.response?.data?.Message) && error?.response?.data?.Message}`, { autoClose: 3000 });
                }
                return Promise.reject(error);
            }
        );

        return () => {
            axios.interceptors.response.eject(interceptor);
        };
    }, [accessToken, dispatch]);

    return null;
};


export default AxiosInterceptor;

