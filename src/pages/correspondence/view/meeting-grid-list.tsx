import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import localStore from "../../../common/browserstore/localstore";
import { CultureId } from "../../../common/application/i18n";
import axios from "axios";
import ApiService from "../../../core/services/axios/api";
import CommonUtils from "../../../common/utils/common.utils";
import MeetingStatusGrid from "./meeting-status-grid";
import TitleBox from "../../../shared/components/TitleBox";

interface MeetingsGridListInterface {
    rowData: any;

}

const MeetingsGridList = ({ rowData }: MeetingsGridListInterface) => {
    const { t } = useTranslation();
    const { UserId, CultureId } = CommonUtils.userInfo;
    const [gridList, setGridList] = useState<any>();

    const fetchData = useCallback(async () => {
        const meetingStatusParam = {
            Procedure: "FRM_TRANS.MEETING_RECIPIENTS_STATUS_SPR",
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
        const response = await ApiService.httpPost('data/getTable', meetingStatusParam);
        console.log(response, 'fetch data')
        if (response?.Valid > 0) {
            setGridList(response?.Data);
        }
    }, [CultureId, UserId, rowData])

    useEffect(() => {
        fetchData()
    }, [rowData, UserId, CultureId, fetchData]);



    return (
        <> 
            {!!gridList?.length &&
                <TitleBox header={t("Meeting Recipients Status")}
                    content={
                        <div className="my-2">
                            <MeetingStatusGrid gridList={gridList} />
                        </div>
                    }
                />
            }
        </>
    )
}

export default MeetingsGridList;
