import ApiService from "../../core/services/axios/api";
import { RedirectUrl, encrypt } from "../../layouts/menu-utils";
import { CultureId } from "../application/i18n";
import localStore from "../browserstore/localstore";

class CommonUtils {
    static get userInfo() {
        try {
            const userData = localStore.getLoggedInfo();
            const parsedUserData = JSON.parse(userData ?? '{}');
            const { USER_ID: UserId, FRANCHISE_ID: FranchiseId, USER_TYPE: userType } = parsedUserData;
            const lang = CultureId();
            return { UserId, FranchiseId, CultureId: lang, userType };
        } catch (error) {
            return {}
        }
    }
    static getDownloadURL({ ATTACHMENT_NAME, DOC_NAME }: any) {
        return `file/downloadDoc?docpath=${ATTACHMENT_NAME || DOC_NAME}`;
    }
    static async downloadAttachment(image: any) {
        try {
            if (image.src) {
                fetch(image.src).then(res => res.blob()).then(res => {
                    window.open(URL.createObjectURL(res))
                })
                // window.open()
            } else {
                const url = this.getDownloadURL(image);
                const res = await ApiService.httpGetBlob(url);
                const localURL = URL.createObjectURL(res);
                window.open(localURL)
            }
        } catch (error) {

        }
    }
    static getActualWidth(list: any) {
        const promiseList: Promise<any>[] = [];
        list.forEach((x: any) => {
            const pr = new Promise((resolve: any, reject: any) => {
                const img = new Image();
                img.onload = function (e: any) {
                    const { width, height } = e.target
                    resolve({ actualWidth: width, actualHeight: height })
                }
                img.src = x.src;
            })
            promiseList.push(pr);
        })
        return promiseList;
    }
    static convertMSO = async (html: any) => {
        const calculateAspectRatioFit = (srcWidth: number, srcHeight: number, maxWidth: number, maxHeight: number) => {
            var ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);
            return { width: srcWidth * ratio, height: srcHeight * ratio };
        }
        const el = document.createElement('div');
        el.innerHTML = html;
        const imgTags = el.querySelectorAll('img');
        const promiseList = this.getActualWidth(imgTags);
        const actual = await Promise.all(promiseList);
        imgTags.forEach((x, i) => {
            const { height, width } = x.style;
            let widthAsp = Number(width.replace('px', '')) ? Number(width.replace('px', '')) : x.width;
            let heightAsp = Number(height.replace('px', '')) ? Number(height.replace('px', '')) : x.height;
            const { actualWidth, actualHeight } = actual[i];
            widthAsp = widthAsp ? widthAsp : actualWidth;
            heightAsp = heightAsp ? heightAsp : actualHeight;
            const converted = calculateAspectRatioFit(widthAsp, heightAsp, 450, 300);
            x.style.maxWidth = `${converted.width}px`;
            x.style.maxHeight = `${converted.height}px`;
            if (x.width) {
                x.setAttribute("data-PrevWidth", `${x.width}`);
            }
            x.width = converted.width;
        })
        return el.innerHTML
    }
    static parseMSO = (html: any) => {
        const el = document.createElement('div');
        el.innerHTML = html;
        const imgTags = el.querySelectorAll('img');
        imgTags.forEach((x) => {
            x.style.maxWidth = `unset`;
            x.style.maxHeight = `unset`;
            const prevWidth = x.getAttribute("data-PrevWidth");
            if (prevWidth) {
                x.width = Number(prevWidth);
            }
        })
        return el.innerHTML;
    }
    static getTxnUrl(menu: any) {
        const formattedMenu: any = {
            MenuId: menu.MASTER_ID,
            MasterId: menu.MASTER_ID,
            title: menu.MASTER_NAME,
            CriteriaMode: "",
            to: menu.WEB_LINK,
        };
        const param = JSON.stringify(formattedMenu)
        return `/${RedirectUrl(formattedMenu)}?query=${encrypt(param)}`
    }
}
export default CommonUtils;