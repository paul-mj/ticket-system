import { toast } from "react-toastify";

export const fileUploadMaxSizeCheck = (file: any) => {
    const size = Number((file.size / 1024 / 1024).toFixed(2));
    // if (size > appConfig.config.uploadFileSize) {
    //     toast.error({'To big, maximum is ' + appConfig.config.uploadFileSize + ' MB. Your file size is: ' + size + ' MB' });
    //     return false;
    // } else {
    //     return true;
    // }
}
export const fileUploadaMimeTypeCheck = (file :any, extension:any) => {
    // if (extension.indexOf(file.name.split('.').pop().toLowerCase()) !== -1) {
    //     return true;
    // } else {
    //     toast.error({`This filetype is not allow to upload, Allowed Only ${extension.map((x, i) => x)}`, });
    //     return false;
    // }
}