import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import PivotGrid, {
    FieldChooser, FieldPanel,
} from 'devextreme-react/pivot-grid';
import ReportUtils from "../../report.utils";
import ApiService from "../../../../../core/services/axios/api";
import ArrayStore from "devextreme/data/array_store";
import ReportToolbar from "../../Components/ReportToolbar";
import { Card, CardContent } from "@mui/material";
import CommonUtils from "../../../../../common/utils/common.utils";
import PivotGridDataSource from "devextreme/ui/pivot_grid/data_source";
import { Export, Scrolling } from "devextreme-react/data-grid";
import { toast } from "react-toastify";
import ReportSaveAsLayoutDialog from "../../Components/ReportSaveAsLayoutDialog";
const ReportType = 0;
const ReportPivot = () => {
    const dataGridOuterRef: any = useRef();
    const dataGridRef: any = useRef();
    const { t, i18n } = useTranslation();
    const [gridData, setGridData] = useState<any>(null);
    const [gridOptions, setGridOptions] = useState<any[]>(ReportUtils.defaultPivotProps);
    const [sessionData, setSessionData] = useState<any>(null);
    const [dataSource, setDataSource] = useState<any>(null);
    const { CultureId, UserId, FranchiseId } = CommonUtils.userInfo;
    const [gridOptionsProps, setGridOptionsProps] = useState<any>({});
    const [gridState, setGridState] = useState<any>(null);
    const [tempLayoutId, setTempLayoutId] = useState<any>(null);
    const [currentLayout, setCurrentLayout] = useState<any>({});
    const [showReportDialog, setShowReportDialog] = useState<any>(false);

    const getReport = useCallback(async (storeData: any) => {
        const { currentPage, filterData, criteria, dbVariables } = storeData;
        const getDbVariables = ReportUtils.getDBVariable({ dbVariables, userInfo: { CultureId, UserId, FranchiseId }, pageDetails: currentPage.Master }) ?? [];
        const criteriaPayload = ReportUtils.formatParamsForAPI(criteria, filterData)
        const criteriaList: any[] = [...getDbVariables, ...criteriaPayload];
        const { Master: { MASTER_ID, SP_NAME } } = currentPage;
        const payLoad = {
            CultureId,
            Mode: 0,
            MasterId: MASTER_ID,
            ReportType,
            Id: 0,
            MenuId: 0,
            Procedure: SP_NAME,
            MasterIdRequired: 0,
            Criteria: criteriaList,
            UserId
        }
        const { Data, Fields } = await ApiService.httpPost('data/getPivotData', payLoad);
        let ColumnFromated = Fields.filter((col:any) => !col.dataField.endsWith('_'));
        if(CultureId){
            ColumnFromated = ColumnFromated.map((col:any) => {
                return {
                    ...col,
                    caption:  t(col.caption) 
                }
            })
        }
        setGridData({ Data, Fields:ColumnFromated });
    }, [CultureId, FranchiseId, UserId, t])
    const buildGridData = useCallback((data = [], fields = []) => {
        const newDataSource = new PivotGridDataSource({
            store: new ArrayStore({
                data,
            }),
            fields
        });
        setDataSource(newDataSource)
    }, [])

    const updateLayout = useCallback(() => {
        if (gridOptions?.length) {
            let obj = {}
            gridOptions.forEach((option) => {
                const newObj = ReportUtils.createObject(option.Value, option.Name, obj);
                obj = { ...obj, ...newObj }
            });
            setGridOptionsProps(obj)
        }
    }, [gridOptions])
    const updateState = useCallback(() => {       
        if (dataSource) {
            dataSource.state(gridState)
        }
    }, [dataSource, gridState])
    const onGridOptionsUpdate = (values: any[]) => {
        setGridOptions(values);
    }

    const saveLayout = useCallback(async () => {
        const State = dataSource.state();
        const param = {
            ReportId: currentLayout.ReportId ?? -1,
            CultureId,
            UserId,
            State: JSON.stringify(State),
            Appearance: JSON.stringify(gridOptions)
        }
        const { Message, Id } = await ApiService.httpPost('report/saveLayout', param)
        if (Id < 0) {
            toast.error(Message);
        } else {
            toast.success(Message);
        }
    }, [CultureId, UserId, currentLayout.ReportId, dataSource, gridOptions])
    const saveAsLayout = useCallback(async (e: any) => {
        if (e) {
            const { IsPublished, ReportName } = e;
            const storeData = ReportUtils.getSessionData();
            const { currentPage: { Master: { MASTER_ID } } } = storeData;            
            const State = dataSource.state();
            const param = {
                ReportId: null,
                IsActive: 1,
                IsDefault: 0,
                CultureId,
                MasterId: MASTER_ID,
                ReportType,
                MenuId: -1,
                RptId: -1,
                ParentReportId: null,
                PublishFlag: 0,
                ReportName,
                IsBase: false,
                IsUserReport: true,
                IsPublished,
                UserId,
                State: JSON.stringify(State),
                Appearance: JSON.stringify(gridOptions)
            }
            const { Message, Id } = await ApiService.httpPost('report/saveReport', param)
            if (Id < 0) {
                toast.error(Message);
            } else {
                setTempLayoutId(Id);
                setShowReportDialog(false)
                toast.success(Message);
            }
        } else {
            setShowReportDialog(false)
        }
    }, [CultureId, UserId, dataSource, gridOptions])
    const loadGrid = useCallback(() => {
        const storeData = ReportUtils.getSessionData();
        if (storeData) {
            setSessionData(storeData);
            getReport(storeData);
        }
    }, [getReport])
    const applyLayout = useCallback((data: any) => {
        if (data) {
            const { Appearance, State } = data;
            if (!!Appearance) {
                const parsedAprrnce = JSON.parse(Appearance);
                setGridOptions(parsedAprrnce)
            } else {
                setGridOptions(ReportUtils.defaultPivotProps)
            }

            if (State) {
                const parsedState = JSON.parse(State);
                setGridState(parsedState)
            } else {
                setGridState(null)
            }
        }
    }, [])
    const onloadeddata = (e: any) => {
        const { component } = e;
        const columnLen = document.querySelectorAll('.dx-area-column-cell table tr > td')?.length;
        const container = dataGridOuterRef.current;
        if (columnLen < 2) {
            container.style.maxWidth = '800px'
        } else if (columnLen < 4) {
            container.style.maxWidth = '1200px'
        } else if (columnLen < 6) {
            container.style.maxWidth = '1600px'
        } else {
            container.style.maxWidth = 'unset'
        }
        component.updateDimensions();
    }
    const onCurrentLayoutDetails = useCallback((item: any) => {
        setCurrentLayout(item ?? {})
    }, [])
    useEffect(() => {
        loadGrid()
    }, [loadGrid])
    useEffect(() => {
        if (gridData) {
            const { Data, Fields } = gridData;
            buildGridData(Data, Fields);
        }
    }, [buildGridData, gridData])
    useEffect(() => {
        if (dataSource) {
            updateLayout();
        }
    }, [gridOptions, updateLayout, dataSource])
    useEffect(() => {
        if (dataSource) {
            updateState();
        }
    }, [gridState, updateState, dataSource])
    return (

        <div>
            {sessionData && <ReportToolbar
                gridOptions={gridOptions}
                saveLayout={saveLayout}
                saveAsLayout={() => { setShowReportDialog(true) }}
                tempSelectedLayout={tempLayoutId}
                applyLayoutStyle={applyLayout}
                currentLayoutDetails={onCurrentLayoutDetails}
                updatedOptions={onGridOptionsUpdate}
                onFilter={loadGrid}
                sessionData={sessionData}
                ReportType={ReportType} />}
            <Card className='flex-1 mt-1' variant="outlined" ref={dataGridOuterRef}>
                <CardContent>
                    {gridData && <PivotGrid
                        id="pivotgrid"
                        dataSource={dataSource}
                        allowSortingBySummary={true}
                        allowFiltering={true}
                        showBorders={true}
                        showColumnTotals={false}
                        showColumnGrandTotals={false}
                        showRowTotals={false}
                        showRowGrandTotals={false}
                        ref={dataGridRef}
                        onContentReady={onloadeddata}
                        {...gridOptionsProps}
                        height="calc(100vh - 200px)"
                    >
                        <Scrolling mode="virtual" />
                        <FieldChooser enabled={true} height={400} />
                        <Export enabled={true} />
                        <FieldPanel
                            showColumnFields={true}
                            showDataFields={true}
                            showFilterFields={true}
                            showRowFields={true}
                            allowFieldDragging={true}
                            visible={true}
                        />
                    </PivotGrid>}
                </CardContent>
            </Card>
            <ReportSaveAsLayoutDialog open={showReportDialog} onCloseDialog={saveAsLayout} />
        </div>
    )
}
export default ReportPivot;