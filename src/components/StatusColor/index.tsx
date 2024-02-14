import { useCallback, useEffect } from "react";
import CommonUtils from "../../common/utils/common.utils";
import ApiService from "../../core/services/axios/api";

const StatusColor = () => {
    const { UserId, CultureId } = CommonUtils.userInfo;
    const getStatusColors = useCallback(async () => {
        const payload = {
            Procedure: "FRM_CORE.STATUS_STYLE_SPR",
            UserId,
            CultureId
        }
        const { Data = [] } = await ApiService.httpPost('data/getTable', payload);
        const rt: any = document.querySelector(':root');
        Data.forEach((element: any) => {
            rt?.style.setProperty(`--status-backColor-${element.STATUS_ID}`, element.BACK_COLOR);
            rt?.style.setProperty(`--status-foreColor-${element.STATUS_ID}`, element.FORE_COLOR);
        });
    }, [CultureId, UserId])

    useEffect(() => {
        getStatusColors();
    }, [getStatusColors])
    return <></>
};
export default StatusColor;