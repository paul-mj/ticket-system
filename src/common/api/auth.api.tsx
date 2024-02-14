import ApiService from "../../core/services/axios/api";

export async function Login(param: any) {
    const responseMasterList = await ApiService.httpPost('user/login', param);
    return responseMasterList;
};