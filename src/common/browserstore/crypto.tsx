import CryptoJS from 'crypto-js';

export const encryptData = (data: any, key: any) => {
    const encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), key);
    return encrypted.toString();
}


export const decryptData = (encryptedData: any, key: any) => {
    const decrypted = CryptoJS.AES.decrypt(encryptedData, key);
    return JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));
}