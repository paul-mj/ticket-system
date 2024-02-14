
 
export const isObjectEmpty = (object: {}) => {
    return (Object.keys(object).length === 0) ? true : false
};
export const getFormatedNoTwoDigit = (date: number | string) => {
    if (typeof date === 'number') {
        return date > 9 ? date : ('0' + date).slice(-2)
    } else {
        return date
    }
}
export const getExpTimeByMinute = (Minute:number) => {
    const today = new Date()
    return new Date(today.setMinutes(today.getMinutes() + Minute))
}
export const getExpTimeBySecond = (Second:number) => {
    const today = new Date()
    return new Date(today.setSeconds(today.getSeconds() + Second))
}