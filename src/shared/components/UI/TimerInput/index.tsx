import React, { useCallback, useEffect, useRef, useState } from "react";
import { getFormatedNoTwoDigit } from "../../../../core/services/utility/utils";

interface TimerInputProps {
    countDownDate: Date;
    format?: string;
    delimiter?: string;
    expired?: () => any;
    expiredText?:string;
}
const TimerInput = React.memo(({ countDownDate, format = 'MM:SS', delimiter = ':', expired, expiredText = 'EXPIRED' }: TimerInputProps) => {
    const [timer, setTimer] = useState('');
    const timerIntervalRef = useRef<any>();
    const buildTimer = useCallback(() => {
        if(timerIntervalRef.current){
            clearInterval(timerIntervalRef.current);
        }
        const endDate = countDownDate.getTime();
        timerIntervalRef.current = setInterval(function () {
            const now = new Date().getTime();
            const distance = endDate - now;
            const DD = Math.floor(distance / (1000 * 60 * 60 * 24));
            const HH = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const MM = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const SS = Math.floor((distance % (1000 * 60)) / 1000);
            const timerMaster = { DD, HH, MM, SS };
            const timeString = format
                .split(delimiter)
                .map((key: any) => {
                    return getFormatedNoTwoDigit(timerMaster[key])
                }).join(delimiter);
            setTimer(timeString);
            if (distance < 0) {
                clearInterval(timerIntervalRef.current);
                expired && expired();
                setTimer(expiredText);
            }
        }, 1000);
    }, [countDownDate, format, delimiter, expired, expiredText])
    useEffect(() => {
        buildTimer();
    }, [buildTimer])
    useEffect(() => {
        return () => {
            clearInterval(timerIntervalRef.current);
        }
    }, [])
    return (<span>{timer}</span>)
})
export default TimerInput;