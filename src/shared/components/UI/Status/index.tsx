import './status.scss';

interface StatusProps {
    label: string,
    status: string,
    outline?: Boolean,
    cssClass?: string,
    styleDisable?: boolean
}

const Status = ({ label, status, outline, cssClass, styleDisable }: StatusProps) => {

    return (
        <>
            {outline ?
                <div title={label} className={`status ${cssClass ?? ''}`} style={styleDisable ? {} : { border: `1px solid`, color: `var(--status-backColor-${status})` }}>{label}</div> :
                <div title={label} className={`status ${cssClass ?? ''}`} style={styleDisable ? {} : { background: `var(--status-backColor-${status})`, color: `var(--status-foreColor-${status})` }}>{label}</div>}
        </>
    )
}
export default Status;