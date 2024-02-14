import { useTranslation } from 'react-i18next';
import './breadcrumb.scss';

interface HistoryItem {
    icon: string;
    title: string;
}
interface History {
    history: HistoryItem[]
}
const Breadcrumb = (props: History) => {

    const { t, i18n } = useTranslation();
    return (
            <ul className="breadcrumb-list">
                {props.history.map((link: HistoryItem) => <li key={link.title}>
                    {link.icon && <img src={link.icon} alt={link.title} />}
                    <span>{t(link.title)}</span>
                </li>)}
            </ul>
    )
}
export default Breadcrumb;