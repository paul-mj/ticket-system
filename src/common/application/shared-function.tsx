import { IconButton } from "@mui/material";
import ApiService from "../../core/services/axios/api";
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { RedirectUrl, RedirectUrlWithLink, encrypt } from "../../layouts/menu-utils";
import { Link, useNavigate } from "react-router-dom";
import { memo, useEffect, useState } from "react";


type OutputObject = {
    label: string;
    key: number;
};
type OutputArray = Array<OutputObject>;

/* Format Options Array */
export const formatOptionsArray = (inputArray: any, labelKey: any, idKey: any, disableKey?: any, isMarked?: any): OutputArray => {
    return inputArray && inputArray.map((item: any) => ({
        label: item[labelKey] as string,
        value: item[idKey] as number,
        disabled: item[disableKey] as number === 1 ? true : false,
        isMarked: item[isMarked] as number === 1 ? true : false,
    }));
}


/* Format Options Array */
export const formatAutoCompleteOptionsArray = (inputArray: any, labelKey: any, idKey: any, disableKey?: any, isMarked?: any): OutputArray => {
    return inputArray && inputArray.map((item: any) => ({
        label: item[labelKey] as string,
        value: item[idKey] as number,
        disabled: item[disableKey] as number === 1 ? true : false,
        isMarked: item[isMarked] as number === 1 ? true : false,
    }));
}


export const formatString = (str: string) => {
    // Remove all non-alphanumeric characters using regex
    const formattedStr = str.replace(/[^a-z0-9]+/gi, '');
    const lowercaseStr = formattedStr.toLowerCase();
    return lowercaseStr;
}

/* Trim Array */
export const trimArrayElements = (arr: any) => {
    const trimmedArr = arr.map((element: any) => element.trim());
    return trimmedArr;
}

/* Format Date */
export const formatDateTime = (originalDateTime: any) => {
    const dateObj = new Date(originalDateTime);
    const year = dateObj.getFullYear();
    const month = ("0" + (dateObj.getMonth() + 1)).slice(-2);
    const day = ("0" + dateObj.getDate()).slice(-2);
    const hours = ("0" + dateObj.getHours()).slice(-2);
    const minutes = ("0" + dateObj.getMinutes()).slice(-2);
    const seconds = ("0" + dateObj.getSeconds()).slice(-2);
    const formattedDateTime = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
    return formattedDateTime;
};

/* Image crop */

export const resizeImage = (image: any, maxWidth: number, maxHeight: number) => {
    return new Promise((resolve) => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        if (!context) {
            throw new Error('Canvas context is not supported.');
        }

        let width = image.width;
        let height = image.height;

        if (width > height) {
            if (width > maxWidth) {
                height *= maxWidth / width;
                width = maxWidth;
            }
        } else {
            if (height > maxHeight) {
                width *= maxHeight / height;
                height = maxHeight;
            }
        }

        canvas.width = width;
        canvas.height = height;
        context.drawImage(image, 0, 0, width, height);

        canvas.toBlob((blob) => {
            resolve(blob);
        }, 'image/jpeg'); // Change the format if needed
    });
};

interface Attachment {
    path: string;
    name: string
}

export const DownloadBlob = async (attachment: Attachment) => {
    console.log(attachment, 'attachment')
    try {
        const response = await ApiService.httpGetBlob(`file/downloadDoc?docpath=${attachment.path}`);
        const imageUrl = URL.createObjectURL(response);
        const link = document.createElement('a');
        link.href = imageUrl;
        link.download = attachment.name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (error) {
        console.error('Error downloading image:', error);
    }
}


export const convertToBase64 = (file: File) => {
    return new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);
        fileReader.onload = () => {
            resolve(fileReader.result);
        };
        fileReader.onerror = (error) => {
            reject(error);
        };
    });
};

export const getTimeOfDay = () => {
    const currentHour = new Date().getHours();

    if (currentHour >= 5 && currentHour < 12) {
        return 'Good Morning';
    } else if (currentHour >= 12 && currentHour < 17) {
        return 'Good Afternoon';
    } else {
        return 'Good Evening';
    }
};

export const getAdditionalGreeting = () => {
    const currentHour = new Date().getHours();

    if (currentHour >= 0 && currentHour < 5) {
        return 'Late Night';
    } else if (currentHour >= 5 && currentHour < 12) {
        return 'Hope you are having a great morning!';
    } else if (currentHour >= 12 && currentHour < 15) {
        return 'Hope you are having a great Afternoon!';
    } else {
        return 'Hope you are having a great Evening!';
    }
};

export const OpenInWindow = memo((props: any) => { 
    const [link, setLink] = useState('');
    useEffect(() => {
        const menu = props.item.cardData;
        const formattedMenu: any = {
            MenuId: menu.MASTER_ID,
            ModuleId: 12, // Need to update API, this is temp fix 
            MasterId: menu.MASTER_ID,
            to: menu.WEB_LINK,
        };
        const param = JSON.stringify(formattedMenu);
        const newLink: any = `/${RedirectUrlWithLink(formattedMenu)}?query=${encrypt(param)}`;
        setLink(newLink);
    }, [props.item.cardData])

    return (
        <Link to={link} title={''}>
            <IconButton
                aria-label="calendar"
                size="small"
                className="px-1"
            >
                <OpenInNewIcon />
            </IconButton>
        </Link>
    )
});

