import axios from 'axios';
import localStore from '../../../common/browserstore/localstore';
import { FrmLogout } from '../../../pages/auth/logout/logout';
import { toast } from 'react-toastify';

interface Fork {
    method: string;
    url: string;
    data?: any;
}
axios.interceptors.request.use(request => {
    request.headers["Authorization"] = `Bearer ${localStore.getToken()}`;
    return request;
});

/* const responseErrorHandler = (error: any) => { 
    if (error.response.status === 401 ||
        error.response.status === 403) {
            alert('test') 
        localStore.removeLoggedInfo();
    }
    return Promise.reject(error);
}; */

/* axios.interceptors.response.use(
    response => response,
    error => responseErrorHandler(error)
);
 */
/* Get Base url and set to API endpoint */
export const Url = (endpoint: string) => {
    const config = window['config'];
    return `${config.BASE_URL
        }${endpoint}`;
}
const httpGet = (endpoint: string) => {
    if (!endpoint) {
        return Promise.resolve(null);
    }

    return axios
        .get(Url(endpoint))
        .then((response) => responseHandler(response))
        .then((result) => result)
        .catch((error) => {
            console.error(error);
            showToastMessage(error);
            throw Error(error.response.message);
        });
};
const httpPost = (endpoint: string, data: any) => {
    if (!endpoint) {
        return Promise.resolve(null);
    }

    return axios
        .post(
            Url(endpoint),
            data
                ? data
                : null
        )
        .then((response) => responseHandler(response))
        .then((result) => result)
        .catch((error) => {
            showToastMessage(error);
            return error; // Return the error object
        });
};
const httpPostBlob = (endpoint: string, data: any) => {
    if (!endpoint) {
        return Promise.resolve(null);
    }

    return axios
        .post(
            Url(endpoint),
            data
                ? data
                : null,
            { responseType: 'blob' }
        )
        .then((response) => responseHandler(response))
        .then((result) => result)
        .catch((error) => {
            console.error(error);
            showToastMessage(error);
            throw Error(error);
        });
};
const httpGetBlob = (endpoint: string, data?: any) => {
    if (!endpoint) {
        return Promise.resolve(null);
    }

    return axios
        .get(Url(endpoint), { responseType: 'blob' })
        .then((response) => responseHandler(response))
        .then((result) => result)
        .catch((error) => {
            console.error(error);
            showToastMessage(error);
            throw Error(error);
        });
};
const httpPut = (endpoint: string, data: any) => {
    if (!endpoint) {
        return Promise.resolve(null);
    }

    return axios
        .put(
            Url(endpoint),
            data
                ? data
                : null
        )
        .then((response) => responseHandler(response))
        .then((result) => result)
        .catch((error) => {
            console.error(error);
            showToastMessage(error);
            throw Error(error);
        });
};
const httpDelete = (endpoint: string, data: any) => {
    if (!endpoint) {
        return Promise.resolve(null);
    }

    return axios
        .delete(
            Url(endpoint),
            data
                ? data
                : null
        )
        .then((response) => responseHandler(response))
        .then((result) => result)
        .catch((error) => {
            console.error(error);
            showToastMessage(error);
            throw Error(error);
        });
};
const httpForkJoin = (fork: Fork[]) => {
    const apiForks = fork.map((api) => {
        try {
            if (api.method === 'post') {
                return httpPost(api.url, api.data)
            } else if (api.method === 'get') {
                const url = api.data ? `${api.url}?${new URLSearchParams(api.data)}` : api.url
                return httpGet(url)
            } else {
                return null
            }
        } catch (error: any) {
            showToastMessage(error);
            throw Error(error);
        }

    })
    return axios.all(apiForks)
}
const responseHandler = (response: any) => {
    if (response.status === 200) {
        return response.data;
    }
    throw Error(response && (response.data));
};

const showToastMessage = (error: any) => {
    let errorMessage = error?.message;
    if (error.response) {
        switch (error.response.status) {
            //case 401:
            case 400:
            case 403:
            case 404:
            case 500:
                errorMessage = error?.response?.data?.Message || errorMessage;
                break;
            default:
                errorMessage = error?.response?.data?.Message || errorMessage;
                break;
        }
    }
    toast.error(errorMessage || 'An error occurred', { autoClose: 3000, toastId: 'networkErrorDefault' });
};

const ApiService = {
    httpGet,
    httpPost,
    httpPut,
    httpDelete,
    httpPostBlob,
    httpGetBlob,
    httpForkJoin
}
export default ApiService;