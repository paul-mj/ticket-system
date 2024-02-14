import { Tooltip } from '@mui/material';
import './ProgressStatus.scss';
const ProgressStatus = ({ operatorDetails = {} }: any) => {
    return (
        <div className="frm-progress-bar" style={{ background: `var(--status-backColor-${operatorDetails.STATUS_ID})`, color: `var(--status-foreColor-${operatorDetails.STATUS_ID})` }}>
            <div className={`progress-sec d-flex gap-1`}>
                <Tooltip title={operatorDetails.STS}><span className="statustext-wrap">{operatorDetails.STS}</span></Tooltip>
                <span>{operatorDetails.CMPL_PRNCT}%</span></div>
        </div>
    )
}
export default ProgressStatus;