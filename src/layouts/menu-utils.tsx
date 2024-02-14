 type Menu = {
    items: Menu;
    MenuId: number;
    title: string;
    to: string;
    icon: string;
    CriteriaMode: number;
    iconSize: IconSize;
};

type IconSize = {
    width: number;
    height: number;
};

export const encrypt = (value: string): string => {
    const val = encodeURIComponent(window.btoa(encodeURIComponent(value)));
    return val;
};

export const decrypt = (value: any): string => {
    const val = decodeURIComponent(window.atob(decodeURIComponent(value)));
    return val;
};

export const RedirectUrl = (menu: Menu) => {  
    const url = menu.to.replace(/ /g, "").toLowerCase();
    return url;
};

export const RedirectUrlWithLink = (menu: Menu) => {  
    const url = menu.to.replace(/ /g, "").toLowerCase();
    return url;
};

