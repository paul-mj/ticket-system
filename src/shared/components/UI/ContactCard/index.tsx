
import './contactCard.scss';
import { Badge, Mail, Phone, Call } from '../../../../assets/images/svgicons/svgicons';
import FormatField from '../FormatField';
import Status from '../Status';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { IconButton, Tooltip } from '@material-ui/core';
import CloseIcon from '@mui/icons-material/Close';
import { useEffect, useState } from 'react';
import { t } from "i18next";
import { useTranslation } from "react-i18next";

const ContactCard = ({ list, onEditClickHandler }: { list: any[], onEditClickHandler?: any }) => {
    const [contactList, setContactList] = useState<any[]>([])
    const { t, i18n } = useTranslation();
    useEffect(() => {
        setContactList(list);
    }, [list])
    const panelHandler = (item: any, mode: boolean) => {
        setContactList((prev) => {
            const temp = [...prev]
            const found = temp.find((row: any) => row.CONTACT_ID === item.CONTACT_ID);
            if (found) {
                found.isShow = mode;
            }
            return temp
        })
    }
    return (
        <ul className='contact-card'>
            {contactList.map((item: any) =>
                <li key={item.CONTACT_ID}>
                    <div className='contact-card-desig'>
                        <div className='contact-card-desig-icon-wrap'>
                            <img src={Badge} alt="Badge" />
                            {item.Designation}
                        </div>
                        <div className='contact-card-desig-name'>{item.Name}</div>
                    </div>
                    <div className='contact-card-details'>
                        <div className='contact-card-details-user-info'>
                            <ul>
                                <li className='contact-card-details-user-info-label'>
                                    {t("Updated By / On")}
                                </li>
                                <li className='contact-card-details-user-info-value'>
                                    <span>{item['Updated By']}</span>
                                    <span>/</span>
                                    <span>
                                        <FormatField type='dateTime' format="dd-mmm-yyyy" delimiter="-" value={item['dt_Updated Time']} /></span>
                                </li>
                            </ul>
                        </div>
                        <div className='contact-card-details-user-contact'>
                            <ul>
                                {item['Mobile No'] && <li>
                                    <img src={Phone} alt="Phone" />
                                    {item['Mobile No']}

                                </li>}
                                {item.Email && <li>
                                    <img src={Mail} alt="Mail" />
                                    {item.Email}
                                </li>}
                                {item['Office No'] && <li>
                                    <img src={Call} alt="Call" />
                                    {item['Office No']}
                                </li>}
                            </ul>
                            <ul>
                                {!!item.addnlDesig.length && <li>
                                    <Tooltip title={`${t("Additional Designation")}`} arrow>
                                        <div className='addnl-desig-count' onClick={() => panelHandler(item, true)}>{item.addnlDesig.length}</div>
                                    </Tooltip>
                                </li>}
                                <li className='pt-1 status-wrapper'><Status label={item.Active === 'Yes' ? 'Active' : 'Inactive'} status={item.Active === 'Yes' ? 'Active' : 'Inactive'} cssClass={`status-${item.Active === 'Yes' ? 'Active' : 'Inactive'}`} styleDisable /></li>
                                {onEditClickHandler && <li>
                                    <Tooltip title={`${t("Edit Contact")}`} arrow>
                                        <IconButton color="primary" className='edit-btn' aria-label="Edit" onClick={() => onEditClickHandler(item)}>
                                            <EditOutlinedIcon />
                                        </IconButton>
                                    </Tooltip>
                                </li>}
                            </ul>
                        </div>
                    </div>
                    <AddnlDesig list={item.addnlDesig} show={!!item.isShow} onClose={() => panelHandler(item, false)} />
                </li>
            )}
        </ul>
    )
}
const AddnlDesig = ({ list, show, onClose }: any) => {
    return (
        <>
            <div className={`addnlDesigPanel-overlay ${show ? 'active' : ''}`} onClick={onClose}></div>
            <div className={`addnlDesigPanel ${show ? 'active' : ''}`}>
                <ul>
                    {
                        list.map((item: any) => <li key={item}>{item}</li>)
                    }
                </ul>
                <IconButton color="secondary" className='addnlDesigPanel-close' aria-label="Close" onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            </div>
        </>
    )
}
export default ContactCard;