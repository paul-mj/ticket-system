
export const validateEidCheckSum = (eid: string): boolean => {
    let validchecksum: boolean = false;
    let arr: string[];
    let data: any;
    let total: number = 0;
    eid = eid.replace(/-|_/ig, '');
    if (eid.length === 15) {
        if (eid === '000000000000000' || eid === '999999999999999') {
            return false;
        }
        for (let x = 0; x < 14; x++) {
            if (x % 2 === 1) {
                data = (parseInt(eid.charAt(x)) * 2).toString();
                if (data.length > 1) {
                    arr = [...data];
                    total += parseInt(arr[0]) + parseInt(arr[1]);
                }
                else {
                    total += parseInt(data);
                }
            }
            else {
                total += parseInt(eid.charAt(x));
            }
        }
        const checksum: number = total % 10 + parseInt(eid.charAt(14));
        validchecksum = (checksum === 10 || checksum === 0);
    }
    return validchecksum;
}
