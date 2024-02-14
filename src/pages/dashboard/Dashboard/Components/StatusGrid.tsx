import { memo, useEffect } from "react";
import './dashboard-components.scss';
import { OpenInWindow } from "../../../../common/application/shared-function";
import { iconSpeechBubble } from "../../../../assets/images/svgicons/svgicons";


interface StatusGridInterface {
    cardDatas: any;
}

export const StatusGrid = memo(({ cardDatas }: StatusGridInterface): any => {

    useEffect(() => {
    }, [cardDatas])

    return (
        <div className="statgrid-wrap">
            <div className="statgrid-header mb-2 px-3 d-flex">
                <div className="elem">Transaction</div>
                <div className="elem">Count</div>
                <div className="elem">View</div>
            </div>
            <div className="statgrid-body px-3">
                {
                    cardDatas.map((item: any, index: any) => {
                        return <RowItem cardData={item} cardLength={cardDatas?.length} key={`${item.MasterId}-${index}`} />
                    })
                }
            </div>
        </div>
    )
});


const RowItem = (props: any) => {
    return (
        <div className="statgrid-row d-flex align-items-center">
            <div className="elem">
                <div className="d-flex align-items-center">
                    <img src={iconSpeechBubble} alt="" /> 
                    <span className="value"> {props?.cardData?.ARG} </span>
                </div>
            </div>
            <div className="elem"><span className="px-3 value">{props?.cardData?.VALUE}</span></div>
            <div className="elem">
                <OpenInWindow item={props} />
            </div>
        </div>
    )
}

