
import { IconButton, Tooltip } from '@material-ui/core';
import './designationCounter.scss'
import AddIcon from '@mui/icons-material/Add';
import { t } from 'i18next';

interface CounterItem {
    count: number;
    title: string;
    isRequired: boolean;
}
interface DesignationProps {
    list: CounterItem[];
    onClickHandler?: any;
}
const DesignationCounter = ({ list, onClickHandler }: DesignationProps) => {
    return (
        <ul className='designation-counter'>
            {
                list.map((item: CounterItem) =>
                    <li key={item.title}>
                        <Tooltip title={`${t("Mandatory")}`} arrow disableHoverListener={!item.isRequired}>
                            <div className={`designation-counter-group ${item.isRequired && !item.count ? 'designation-counter-group-error' : ''}`}>
                                <div className='designation-counter-title'>{item.title}</div>
                                {onClickHandler &&
                                    <IconButton color="primary" className={`designation-counter-add `} aria-label="Add" onClick={() => onClickHandler(item)}>
                                        <AddIcon />
                                    </IconButton>
                                }
                                {!!item.count && <div className='designation-counter-count'>{item.count}</div>}
                            </div>
                        </Tooltip>
                    </li>
                )
            }
        </ul>
    )
}
export default DesignationCounter;