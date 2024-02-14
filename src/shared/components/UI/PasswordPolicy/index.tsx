import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from "@mui/icons-material/Close";
import './passwordPolicy.scss'
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
const PasswordPolicy = ({ list, isValid }: { list: any[], isValid?: any }) => {
    const { t, i18n } = useTranslation();

    const [pwdList, setList] = useState<any[]>([]);

    useEffect(() => {
        const isInValid = list.some((item: any) => !item.pass);
        isValid && isValid(!isInValid);
        console.log(list)

        const getFromTranslator = (threshold: number, premsg: string, postmsg: string) => {
            return `${t(premsg)} ${threshold} ${t(postmsg)}`
        }
        const setTranslation = list.map((policy: any) => {
            const [pre, post] = policy.msg.split(policy.threshold)
            // console.log(firsthalf)
            return {
                ...policy,
                msg: policy.threshold ? getFromTranslator(policy.threshold, pre.trim(), post.trim()) : t(policy.msg)
            }
        })
        setList(setTranslation)
    }, [isValid, list, t])


    return (
        <ul className='policyList'>
            {pwdList.map((policy: any, index: number) =>
                <li className={`${policy.pass ? 'passed' : 'failed'}`} key={index}>
                    <span>{policy.pass ? <DoneIcon className="done-icon" /> : <CloseIcon className="close-icon" />}</span>
                    <span>
                        {policy.msg}
                    </span>
                </li>
            )}
        </ul>
    )
}
export default PasswordPolicy;