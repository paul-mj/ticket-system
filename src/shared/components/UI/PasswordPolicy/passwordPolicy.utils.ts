class PasswordPolicyUtils {
    static getPasswordMutiValidate = ({ MIN_PWD_LENGTH, MIN_PWD_DIGITS, MIN_SPECIAL_CHARS, PWD_IS_UPPER_LOWER_CASE, PASSWORD_AUTO_EXPIRY }: any) => {
        return [{
            regex: `(?=(.*.){${MIN_PWD_LENGTH}})`,
            msg: `Password must have at least ${MIN_PWD_LENGTH} characters`,
            threshold: MIN_PWD_LENGTH
        }, {
            regex: `(?=(.*[0-9]){${MIN_PWD_DIGITS}})`,
            msg: `Password must have at least ${MIN_PWD_DIGITS} digits`,
            threshold: MIN_PWD_DIGITS
        }, {
            regex: `(?=(.*[A-Z]){${PWD_IS_UPPER_LOWER_CASE}})`,
            msg: `Password must have at least ${PWD_IS_UPPER_LOWER_CASE} UpperCase characters`,
            threshold: PWD_IS_UPPER_LOWER_CASE
        }, {
            regex: `(?=(.*[^A-Za-z0-9]){${MIN_SPECIAL_CHARS}})`,
            msg: `Password must have at least ${MIN_SPECIAL_CHARS} special characters`,
            threshold: MIN_SPECIAL_CHARS
        }, {
            msg: `Password expires every ${PASSWORD_AUTO_EXPIRY} Days`,
            threshold: PASSWORD_AUTO_EXPIRY
        }]
    }
    static buildValidator = (list: any[],text:string) => {
        const isValid = (regex:RegExp,str:string) => {
            return regex.test(str);
        }
        return list.filter((rule:any) => rule.threshold).map((rule:any) => {
            return{
                ...rule,
                pass:rule.regex ? isValid(new RegExp(rule.regex),text): true
            }
        })
    }
}
export default PasswordPolicyUtils;