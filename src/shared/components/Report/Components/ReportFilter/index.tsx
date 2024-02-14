import { createElement, useCallback, useEffect, useState } from "react";
import ApiService from "../../../../../core/services/axios/api";
import useURLParser from "../../../../../common/hooks/URLParser";
import { useForm } from "react-hook-form";
import PrimaryButton from "../../../Buttons/TextButtons/Curved/PrimaryButton";
import ReportFilterUtils from "./reportFilterUtils";
import './ReportFilter.scss';
import { Button } from "@mui/material";
import { useTranslation } from "react-i18next";
import CommonUtils from "../../../../../common/utils/common.utils";
import { useSelector } from "react-redux";
import ReportUtils from "../../report.utils";
import { CriteriaInputMode } from "../../../../../common/database/enums";
import { useDispatch } from "react-redux";
import { updateConfig } from "../../../../../redux/reducers/common.reducer";
import SkeletonLoader from "../../../UI/Loader/SkeletonLoader";

const FilterControls = ({ controls }: any) => {
    return createElement('div', { className: 'filter-control-wrap' }, controls)
}

const ReportControlBulder = ({ config, onSubmitFilter, patchValues }: any) => {
    const { masterDetails } = useSelector(
        (state: any) => state.menus.masterDetails
    );
    const { getQuery } = useURLParser();
    const { MasterId } = getQuery();
    const { defaultValues, resolver, list, criteria, dbVariables } = config;
    const [controlList, setControlList] = useState<any[]>([]);
    const { t } = useTranslation();
    const {
        control,
        setValue,
        handleSubmit,
        reset,
        resetField,
        formState: { errors },
    } = useForm<any>({
        resolver,
        defaultValues,
    });
    const applyFilter = () => {
        handleSubmit((data: any) => {
            console.log(data)
            if (onSubmitFilter) {
                onSubmitFilter(data)
            } else {
                const masterDetailsFromSession = ReportUtils.getSessionDataByKey('data', 'masterDetails') //for report grid component filter;
                const masterDetailsGlobal = masterDetails.length ? masterDetails : masterDetailsFromSession;
                const currentPage = masterDetailsGlobal.find((item: any) => item.Master.MASTER_ID === MasterId)
                const sessionData = {
                    currentPage,
                    filterData: data,
                    criteria,
                    dbVariables,
                    masterDetails
                }
                const reWriteURL = window.location.pathname.replace('/report/', '/reportViewer/')
                ReportUtils.openWindow(`${window.location.origin}${reWriteURL}`, false, JSON.stringify(sessionData))
            }
        })()
    }
    const onChange = (e: any, props: any) => {
        console.log(e)
    }
    const patchForm = useCallback((patchData: any) => {
        for (const key in patchData) {
            if (Object.prototype.hasOwnProperty.call(patchData, key)) {
                const value = patchData[key];
                setValue(key, value);
            }
        }
    }, [setValue])
    const buildControls = useCallback(async () => {
        const ctrls = ReportFilterUtils.getControls({ list, control, errors, onChange, resetField, t });
        setControlList(ctrls);
    }, [control, errors, list, resetField, t])
    useEffect(() => {
        const masterDetailsFromSession = ReportUtils.getSessionDataByKey('data', 'masterDetails');//for report grid component filter
        if (masterDetails.length || masterDetailsFromSession?.length) {
            buildControls();
        }
    }, [control, list, errors, masterDetails, buildControls])
    useEffect(() => {
        if (patchValues) {
            patchForm(patchValues)
        }
    }, [patchForm, patchValues])
    useEffect(() => {
        if (!patchValues) {
            reset();
        }
    }, [list, reset, patchValues])
    return <div className="filter-control-outer-wrap">
        <FilterControls controls={controlList} />
        <div className="d-flex justify-content-end gap-2">
            {/* <Button onClick={() => { }} >{t("Reset")}</Button> */}
            <PrimaryButton text={t("Preview")} onClick={applyFilter} />
        </div>
    </div>
}


const ReportFilter = ({ MasterId, onSubmitFilter, cssClass, patchValues }: any) => {
    const { configs: { reportFilterAPI } } = useSelector((state: any) => state.commonReducer);
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const { CultureId, UserId } = CommonUtils.userInfo;
    const [controls, setControls] = useState<any>(null)

    const getAPIResponse = useCallback((forkAllApi: any[]) => {
        return new Promise(async (resolve: any) => {
            const isAllLoaded = forkAllApi.every((apiItem: any) => {
                return (reportFilterAPI ?? []).some((item: any) => item.request === JSON.stringify(apiItem));
            })
            if (isAllLoaded) {
                const optionsData = forkAllApi.map((apiItem: any) => {
                    const found = reportFilterAPI.find((item: any) => item.request === JSON.stringify(apiItem))
                    return found.response;
                })
                resolve(optionsData);
            } else {
                const optionsData = await ApiService.httpForkJoin(forkAllApi);
                const storeData = optionsData.map((x: any, index: number) => {
                    return {
                        request: JSON.stringify(forkAllApi[index]),
                        response: x
                    }
                })
                dispatch(updateConfig({
                    action: 'ReportFilter', payload: {
                        reportFilterAPI: [...storeData, ...reportFilterAPI ?? []]
                    }
                }))
                resolve(optionsData);
            }
        })
    }, [dispatch, reportFilterAPI])

    const getCriteria = useCallback(async () => {
        const apiData = {
            Id: MasterId,
            CultureId,
        }
        const { Data } = await ApiService.httpPost('data/getFilterCriteria', apiData);
        const filterCriteriaData = Data ?? [];
        const selectBoxEnumsControls = filterCriteriaData.filter((ctrl: any) => ctrl.InputMode === CriteriaInputMode.Enum || ctrl.InputMode === CriteriaInputMode.Master);
        const selectBoxControls = filterCriteriaData.filter((ctrl: any) => ctrl.InputMode === CriteriaInputMode.Other);
        const forkTable = selectBoxControls.map((ctrl: any) => {
            return {
                Id: ctrl.Id,
                url: 'data/getDataForTableCriteria',
                method: 'post',
                data: {
                    FillProcName: ctrl.FillProcName,
                    DisplayFields: ctrl.KeyCol,
                    FieldCaptions: ctrl.DispCol,
                    RoleId: -1,
                    UserIdRequired: ctrl.UserIdRequired,
                    CultureId,
                    UserId
                }
            }
        });
        const forkEnums = selectBoxEnumsControls.map((ctrl: any) => {
            return {
                Id: ctrl.Id,
                url: 'data/getDataForCriteria',
                method: 'post',
                data: {
                    Id: ctrl.InputValue,
                    Mode: ctrl.InputMode,
                    CultureId,
                }
            }
        });
        const forkAllApi = [...forkTable, ...forkEnums]
        const optionsData: any = await getAPIResponse(forkAllApi);
        filterCriteriaData.forEach((element: any) => {
            const foundIndex = forkAllApi.findIndex((ctrl: any) => ctrl.Id === element.Id);
            if (foundIndex !== -1) {
                element.options = optionsData[foundIndex].Data ?? []
            }
        });
        const { controlList: list, dbVariables } = ReportFilterUtils.buildList(filterCriteriaData);
        const { defaultValues, resolver } = ReportFilterUtils.getFilterControls({ list, t });
        setControls({ list, defaultValues, resolver, criteria: filterCriteriaData, dbVariables })
    }, [CultureId, MasterId, UserId, getAPIResponse, t])
    useEffect(() => {
        setControls(null);
        getCriteria()
    }, [getCriteria])
    return (
        <div className={cssClass ?? ''}>
            {controls ? <ReportControlBulder config={controls} onSubmitFilter={onSubmitFilter} patchValues={patchValues} /> :
             <SkeletonLoader skeleton={{ variant: "rectangular", width: '100%', height: 200, sx: { my: 1 } }} />}
        </div>
    )
}
export default ReportFilter;