import CloseIcon from "@mui/icons-material/Close";
import Breadcrumb from "../../../UI/Breadcrumb";
import './dialogHeader.scss'

interface ExtraItem {
    icon: string;
    title: string;
}

const DialogHeader = ({ config,onCloseDialog }: any) => {
    return (
        <div className="dialog-header-common">
            {config.history && <Breadcrumb history={config.history} />}
            {config.extra && <ExtraDetails list={config.extra} />}
            {config.hasClose && <CloseIcon className="dialog-header-common-close" onClick = {onCloseDialog}/>}
        </div>
    )
}
const ExtraDetails = ({ list }: { list: ExtraItem[] }) => {
    return (
        <ul className="extra-list">
            {list.map((item: ExtraItem) =>
                <li key={item.title}>
                    {item.icon && <img src={item.icon} alt={item.title} />}
                    <span>{item.title}</span>
                </li>
            )}
        </ul>
    )
}
export default DialogHeader;