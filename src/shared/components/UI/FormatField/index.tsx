import { useEffect, useState } from "react";
import FormatFieldUtils from "./formatField.utils";

const FormatField = ({ value, type, format, delimiter }: { value: string | number, type: string, format?: string, delimiter?: string }) => {
    const [formatedValue, setFormatedValue] = useState<string | number>(value?.toString())
    useEffect(() => {
        const str = FormatFieldUtils.format({ value, type, format, delimiter });
        setFormatedValue(str);
    }, [delimiter, format, type, value])
    return <>{formatedValue}</>
}
export default FormatField; 