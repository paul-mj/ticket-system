import { useTranslation } from "react-i18next";
import { CultureId } from "../../../common/application/i18n";
import localStore from "../../../common/browserstore/localstore";
import { useCallback, useEffect, useState } from "react";
import ApiService from "../../../core/services/axios/api";
import React from "react";
import { Button } from "@mui/material";
import CommonUtils from "../../../common/utils/common.utils";



interface ViewActionButtonInterface {
    rowData: any;
    onClickChangeStatus: (button: any) => any;
}

const MeetingStatusUpdate = ({ rowData, onClickChangeStatus }: ViewActionButtonInterface) => {
    const { t } = useTranslation();
    const { UserId, CultureId } = CommonUtils.userInfo;
    const [actionButtons, setActionButtons] = useState<any>()


    const fetchData = useCallback(async () => {
        const meetingButtonParam = {
            Procedure: "FRM_TRANS.MEETING_USER_ACTIONS_SPR",
            UserId,
            CultureId,
            Criteria: [
                {
                    Name: "@TRANS_ID",
                    Value: rowData?.ID_,
                    IsArray: false
                }
            ]
        };
        const response = await ApiService.httpPost('data/getTable', meetingButtonParam);
        if (response?.Valid > 0) {
            setActionButtons(response?.Data);
        }
    }, [CultureId, UserId, rowData?.ID_])


    useEffect(() => {
        fetchData();
    }, [fetchData]);




    return (
        <React.Fragment>
            {
                actionButtons && actionButtons?.length ? (
                    actionButtons.map((x: any, index: any) => (
                        <div className="btn-sec-wrap" key={index}>
                            <Button 
                                className={`colored-btn mx-2`}
                                type="submit"
                                variant="contained"
                                onClick={() => onClickChangeStatus(x)}
                            >
                                {x.ACTION_NAME}
                            </Button>
                        </div>
                    ))
                ) : <></>
            }
        </React.Fragment>
    )
}

export default MeetingStatusUpdate;
