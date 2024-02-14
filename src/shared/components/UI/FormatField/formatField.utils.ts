import { getFormatedNoTwoDigit } from "../../../../core/services/utility/utils";

class FormatFieldUtils {
    static get dayConst() {
        const mL = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        const mS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return {
            mL, mS
        }
    }
    static format({ value, type, format, delimiter }: { value: string | number, type: string, format?: string, delimiter?: string }) {
        if (!value || isNaN(Date.parse(new Date(value).toDateString()))) {
            return ''
        }
        const date = new Date(value);
        const [dd, mm, yyyy] = [date.getDate(), date.getMonth() + 1, date.getFullYear()]
        const dateMaster = { dd, mm, yyyy, mmm: this.dayConst.mS[mm - 1] };
        let result;
        switch (type) {
            case 'date':
                if (delimiter && format) {
                    const dtString = format.split(delimiter).map((fr: string) => getFormatedNoTwoDigit(dateMaster[fr])).join(delimiter);
                    result = dtString;
                } else {
                    result = new Date(value).toDateString();
                }
                break;
            case 'dateTime':
                if (delimiter && format) {
                    const dtString = format.split(delimiter).map((fr: string) => getFormatedNoTwoDigit(dateMaster[fr])).join(delimiter);
                    result = `${dtString} ${new Date(value).toLocaleTimeString()}`;
                } else {
                    result = new Date(value).toDateString();
                }
                break;

            default:
                result = value;
                break;
        }
        return result;
    }

}
export default FormatFieldUtils;