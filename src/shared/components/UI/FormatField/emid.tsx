import { useEffect, useState } from "react";

interface NumberFormatProps {
    mask: string;
    value: string;
    delimiter: string;
}

const NumberFormat = ({ mask, value, delimiter }: NumberFormatProps): JSX.Element => {
    const [stringValue,setStringValue] = useState('');
    useEffect(() => {
        if(!!value){ 
            const formattedValue =  formatNumber(mask, value.toString(), delimiter);
            setStringValue(formattedValue)
        }
    },[delimiter, mask, value])
    const formatNumber = (mask: string, value: string, delimiter: string): string => {
        const res: any[] = [];
        let len = 0;
        mask.split("-").forEach((q, index) => {
            if (index === 0) {
                const val = value.substring(0, q.length);
                len = q.length;
                res.push(val);
            } else {
                const val = value.substring(len, len + q.length);
                len = len + val.length;
                res.push(val);
            }
        });
        return res.join(delimiter);
    };


    return <span>{stringValue}</span>;
};

export default NumberFormat;