
export const fileUploadMaxSizeCheck = (file: any, confirm: any): boolean => {
    const size = Number((file.size / 1024 / 1024).toFixed(2));
    const config = window['config'];
    if (size > config.uploadFileSize) {
        confirm({
            complete: true,
            ui: 'error',
            title: 'Error',
            description: `File size is too big, maximum size is ${config.uploadFileSize} MB. Your file size is : ${size} MB.'`,
            confirmBtnLabel: 'Close',
        });
        return false;
    } else {
        return true;
    }
}

export const fileUploadaMimeTypeCheck = (file: any, extension: any, confirm: any): boolean => {
    if (extension.indexOf(file.name.split('.').pop().toLowerCase()) !== -1) {
        return true;
    } else {
        confirm({
            complete: true,
            ui: 'error',
            title: 'Error',
            description: `Unsupported File Type`,
            confirmBtnLabel: 'Close',
        });
        return false;
    }
}

export const blobToBase64 = (blob: any) => {
    return new Promise((resolve, _) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(blob);
    });
}