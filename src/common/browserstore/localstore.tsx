

const FRM_TOKEN = 'helpdeskAccessToken';
const FRM_OPERATOR_TOKEN = 'frmOperatorToken';
const FRM_REFRESH_TOKEN = 'helpdeskRefreshToken';
const FRM_LOGGED_DATA = 'helpdeskLoginData';

/* For Localstorage */
const addItem = (key: any, value: any) => {
    localStorage.setItem(key, value)
}

const getItem = (key: any) => {
    return localStorage.getItem(key);
}

const removeItem = (key: any) => {
    localStorage.removeItem(key)
} 

const clearAll = () => {
    localStorage.clear();
  }

/* For Session */
/*
const addToSession = (key, value) => {
    sessionStorage.setItem(key, value);
}
const getFromSession = (key) => {
    return sessionStorage.getItem(key);
}
const removeFromSession = (key) => {
    sessionStorage.removeItem(key);
}
*/

const removeLoggedInfo = () => {
    removeItem(FRM_TOKEN);
    removeItem(FRM_LOGGED_DATA);
}
const setLoggedInfo = (response: any) => {
    addItem(FRM_TOKEN, response?.Token);
    addItem(FRM_LOGGED_DATA, JSON.stringify(response));
}
const getLoggedInfo = () => {
    return  getItem(FRM_LOGGED_DATA)
}

const getToken = () => {
    return getItem(FRM_TOKEN) ? getItem(FRM_TOKEN) : getItem(FRM_OPERATOR_TOKEN);
}
const getRefreshToken = () => {
    return getItem(FRM_REFRESH_TOKEN)
}


const localStore = {
    addItem, getItem, removeItem, clearAll,
    setLoggedInfo, getToken, getRefreshToken, getLoggedInfo, removeLoggedInfo
    //addToSession, getFromSession, removeFromSession, 
}

export default localStore;