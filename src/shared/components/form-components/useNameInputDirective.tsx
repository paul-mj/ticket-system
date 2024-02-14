import { useEffect, useRef } from 'react';

export function useNameInputDirective(inputRef: any, language: any, textOnly: any) {

    const regxRef = useRef(textOnly ? /[A-Za-z ]+$/ : /^[\w\s\d~`!@#$%^&*()\-_+=[\]{}|\\;:'",<.>/?]+$/);

    useEffect(() => {
        if (language === 'ar') {
            regxRef.current = /[\u0600-\u065F\u066A-\u06EF\u06FA-\u06FF ]+$/;
        }
    }, [language]);

    useEffect(() => {
        const input = inputRef.current;
        if (input) {
            input.setAttribute('autocomplete', 'off');
            input.oncut = (e: any) => e.preventDefault();
            input.oncopy = (e: any) => e.preventDefault();
            input.onpaste = (e: any) => paste(e, regxRef.current);
            input.onkeypress = (e: any) => regxRef.current.test(e.key);
        }
    }, [inputRef, regxRef]);

    function paste(event: any, regx: any) {
        const clipboardData = event.clipboardData;
        const text = clipboardData.getData('text');
        return regx.test(text);
    }
}