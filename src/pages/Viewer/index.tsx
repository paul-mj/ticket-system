import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from 'react-router-dom'
import ApiService from "../../core/services/axios/api";
import CommonUtils from "../../common/utils/common.utils";
import { popupComponent } from "../../shared/components/pageviewer/popup-component";
import { fullViewRowDataContext } from "../../common/providers/viewProvider";
import PageViewer from "../../shared/components/pageviewer/pageviewer";
import { UserType } from "../../common/database/enums";
import StatusColor from "../../components/StatusColor";

const Viewer = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { search } = useLocation();
    const { UserId, CultureId } = CommonUtils.userInfo;
    const [popupConfiguration, setPopupConfiguration] = useState<any>(null);
    const [open, setOpen] = useState(false);
    const [fullViewContext, setFullViewContext] = useState<any>(null);

    const closeDialog = async () => {
        setOpen(false);
        navigate('/dashboard');
    };

    const getQueryParms = useCallback(() => {
        const searchParams = new URLSearchParams(search);
        return {
            masterID: searchParams.get('mr'),
            menuID: searchParams.get('mn'),
            userType: searchParams.get('ut'),
            rowID: searchParams.get('id')
        }
    }, [search])
    const getDetails = useCallback(async () => {
        const getPayload = (Procedure: string, rowID?: any) => {
            const obj = {
                Procedure,
                CultureId,
                UserId,
                Criteria: [
                    {
                        Name: '@MASTER_ID',
                        Value: Number(ModuleId),
                        IsArray: false
                    }
                ]
            }
            if (rowID) {
                obj.Criteria.push(
                    {
                        Name: '@ID',
                        Value: Number(rowID),
                        IsArray: false
                    })
            }
            return obj
        }
        const { menuID, rowID, masterID: ModuleId } = getQueryParms();
        try {
            const fork = [{
                method: 'post',
                url: 'data/getTable',
                data: getPayload('FRM_TRANS.TRANS_ROW_DATA_FROM_LINK_SPR', rowID)
            }, {
                method: 'post',
                url: 'data/getTable',
                data: getPayload('APP_CORE.MASTER_INFO_FROM_LINK_SPR')
            }]
            const [{ Data: [rowData] }, { Data: [{ MASTER_NAME }] }] = await ApiService.httpForkJoin(fork);
            const fullViewContext = {
                rowData:{...rowData,MASTER_ID_:Number(ModuleId)},
                activeAction: null,
            }
            setFullViewContext(fullViewContext)
            const popupConfig = popupComponent({ MASTER_ID: Number(ModuleId), MASTER_NAME }, { MenuId: Number(menuID) }, rowData);
            setPopupConfiguration(popupConfig);
            setOpen(true);
        } catch (error) {

        }
    }, [CultureId, UserId, getQueryParms])

    useEffect(() => {
        const { userType } = getQueryParms();
        console.log(userType);
        const isAuthenticated = !!localStorage.getItem('helpdeskAccessToken');
        if (!isAuthenticated) {
            const redirectUrl = location.pathname + location.search;
            const redirectBase =  '/auth/login';
            navigate(`${redirectBase}?redirect=${encodeURIComponent(redirectUrl)}`);
            return;
        }
        getDetails();
    }, [getDetails])

    return (
        <>
            <StatusColor />
            <fullViewRowDataContext.Provider value={fullViewContext}>
                {popupConfiguration && <PageViewer open={open} onClose={closeDialog} popupConfiguration={popupConfiguration} />}
            </fullViewRowDataContext.Provider>
        </>
    )
}
export default Viewer;