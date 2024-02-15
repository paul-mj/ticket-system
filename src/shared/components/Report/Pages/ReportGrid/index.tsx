import { useCallback, useEffect, useRef, useState } from "react";
import CommonUtils from "../../../../../common/utils/common.utils";
import ApiService from "../../../../../core/services/axios/api";
import ReportUtils from "../../report.utils";
import { useTranslation } from "react-i18next";
import DataGrid, { ColumnChooser, Export, FilterBuilderPopup, FilterPanel, FilterRow, GroupPanel, Grouping, HeaderFilter, Pager, Paging, Scrolling, Selection, Sorting } from "devextreme-react/data-grid";
import DataSource from "devextreme/data/data_source";
import ArrayStore from "devextreme/data/array_store";
import { Card, CardContent } from '@mui/material';
import ReportToolbar from "../../Components/ReportToolbar";
import { toast } from "react-toastify";
import ReportSaveAsLayoutDialog from "../../Components/ReportSaveAsLayoutDialog";

const ReportType = 1;
const ReportGrid = () => {
    const dataGridRef: any = useRef();
    const { t, i18n } = useTranslation();
    const [gridData, setGridData] = useState<any>(null);
    const [gridOptions, setGridOptions] = useState<any[]>(ReportUtils.defaultGridProps);
    const [sessionData, setSessionData] = useState<any>(null);
    const [currentLayout, setCurrentLayout] = useState<any>({});
    const [tempLayoutId, setTempLayoutId] = useState<any>(null);
    const [dataSource, setDataSource] = useState<any>(null);
    const { CultureId, UserId, FranchiseId } = CommonUtils.userInfo;
    const [gridOptionsProps, setGridOptionsProps] = useState<any>({});
    const [gridState, setGridState] = useState<any>(null);
    const [showReportDialog, setShowReportDialog] = useState<any>(false);

    const getReport = useCallback(async (storeData: any) => {
        const { currentPage, filterData, criteria, dbVariables } = storeData;
        const { Master: { MASTER_ID, SP_NAME } } = currentPage;
        const getDbVariables = ReportUtils.getDBVariable({ dbVariables, userInfo: { CultureId, UserId, FranchiseId }, pageDetails: currentPage.Master }) ?? [];
        const criteriaPayload = ReportUtils.formatParamsForAPI(criteria, filterData)
        const criteriaList: any[] = [...getDbVariables, ...criteriaPayload];
        const payLoad = {
            CultureId,
            Mode: 0,
            MasterId: MASTER_ID,
            ReportType: 0,
            Id: 0,
            MenuId: 0,
            Procedure: SP_NAME,
            MasterIdRequired: 0,
            Criteria: criteriaList,
            UserId
        }
        const { Data, Columns, FormatRules } = await ApiService.httpPost('data/getGridData', payLoad);
        let ColumnFromated = Columns.filter((col:any) => !col.dataField.endsWith('_'));
        if(CultureId){
            ColumnFromated = ColumnFromated.map((col:any) => {
                return {
                    ...col,
                    caption:  t(col.caption)
                }
            })
        }
        ReportUtils.buildRules({ Data, FormatRules })
        setGridData({ Data, Columns:ColumnFromated });
    }, [CultureId, FranchiseId, UserId, t])
    const buildGridData = useCallback((data = []) => {
        const newDataSource = new DataSource({
            store: new ArrayStore({
                key: 'ID_',
                data
            })
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
        const { instance } = dataGridRef.current ?? {};
        if (instance) {
            instance.state(gridState)
        }
    }, [gridState])
    const onGridOptionsUpdate = useCallback((values: any[]) => {
        setGridOptions(values);
    }, [])

    const saveLayout = useCallback(async () => {
        const { instance } = dataGridRef.current ?? {};
        const State = instance.state();
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
    }, [CultureId, UserId, currentLayout.ReportId, gridOptions])
    const saveAsLayout = useCallback(async (e: any) => {
        if (e) {
            const { IsPublished, ReportName } = e;
            const storeData = ReportUtils.getSessionData();
            const { currentPage: { Master: { MASTER_ID } } } = storeData;
            const { instance } = dataGridRef.current ?? {};
            const State = instance.state();
            const param = {
                ReportId: null,
                IsActive: 1,
                IsDefault: 0,
                CultureId,
                MasterId: MASTER_ID,
                ReportType: 1,
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
    }, [CultureId, UserId, gridOptions])
    const onCurrentLayoutDetails = useCallback((item: any) => {
        setCurrentLayout(item ?? {})
    }, [])
    const onCellPrepared = (event: any): void => {
        ReportUtils.onCellPreparedHandler(event)
    }
    const onRowPrepared = (event: any): void => {
        ReportUtils.onRowPreparedHandler(event)
    }
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
                setGridOptions(ReportUtils.defaultGridProps)
            }

            if (State) {
                const parsedState = JSON.parse(State);
                setGridState(parsedState)
            } else {
                setGridState(null)
            }
        }
    }, [])
    useEffect(() => {
        loadGrid()
    }, [loadGrid])
    useEffect(() => {
        if (gridData) {
            const { Data } = gridData;
            buildGridData(Data);
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
                tempSelectedLayout={tempLayoutId}
                applyLayoutStyle={applyLayout}
                saveAsLayout={() => { setShowReportDialog(true) }}
                currentLayoutDetails={onCurrentLayoutDetails}
                updatedOptions={onGridOptionsUpdate}
                onFilter={loadGrid}
                sessionData={sessionData}
                ReportType={ReportType} />}
            <Card className='flex-1 mt-1' variant="outlined">
                <CardContent>
                    {gridData && <DataGrid
                        ref={dataGridRef}
                        columns={gridData.Columns}
                        dataSource={dataSource}
                        showBorders={true}
                        remoteOperations={true}
                        height="calc(100vh - 200px)"
                        width="100%"
                        wordWrapEnabled={false}
                        rowAlternationEnabled={true}
                        allowColumnReordering={true}
                        columnAutoWidth={false}
                        showRowLines={false}
                        rtlEnabled={i18n.dir() === "rtl"}
                        onCellPrepared={onCellPrepared}
                        onRowPrepared={onRowPrepared}
                        {...gridOptionsProps}
                    >
                        <Scrolling mode="virtual" />
                        <Export enabled={true} />
                        <FilterRow visible={true} />
                        <FilterPanel visible={true} />
                        <FilterBuilderPopup />
                        <HeaderFilter visible={true} />
                        <ColumnChooser
                            enabled={true}
                            mode="dragAndDrop"
                        />
                        <Selection mode="single" />
                        <Sorting mode="single" />
                        <Grouping contextMenuEnabled={true} />
                        <GroupPanel visible={true} />
                        <Paging
                            defaultPageSize={15}
                            defaultPageIndex={1} />
                        <Pager
                            showPageSizeSelector={true}
                            allowedPageSizes={[10, 20, 50]}
                            showNavigationButtons={true}
                        />
                    </DataGrid>}
                </CardContent>
            </Card>
            <ReportSaveAsLayoutDialog open={showReportDialog} onCloseDialog={saveAsLayout} />
        </div>
    )
}
export default ReportGrid;