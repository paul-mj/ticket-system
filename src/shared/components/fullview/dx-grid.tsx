import React, { useCallback, useEffect, useRef, useState } from "react";
import "devextreme/dist/css/dx.light.css";
import "devextreme/data/odata/store";

import DataGrid, {
    Scrolling,
    Column,
    FilterRow,
    LoadPanel,
    ColumnChooser, Export, FilterBuilderPopup, FilterPanel, GroupPanel, Grouping, HeaderFilter, Selection, Sorting
} from "devextreme-react/data-grid";
import "whatwg-fetch";
import FullviewToolbar from "./toolbar";
import { useSelector } from "react-redux";
import { fullGridDataAction, MenuId } from "../../../common/database/enums";
import "./fullview.scss";
import DxGridActions from "./dx-grid-actions";
import ApiService from "../../../core/services/axios/api";
import { useTranslation } from "react-i18next";
import { gridColumnModification, gridRowModification, removeUnderscoreFromColumns } from "./dx-grid-utils";
import { customizeDxCell, isGridCellCustomized } from "./dx-custom-cells";
import DataGridActionContext from "../../../common/providers/datagridActionProvider";
import DataSource from "devextreme/data/data_source";
import ArrayStore from "devextreme/data/array_store";
import localStore from "../../../common/browserstore/localstore";
import { CultureId } from "../../../common/application/i18n";
import { GridLoader } from "../../../assets/images/gif";
import { CircleLoader } from "../UI/Loader/CircleLoader/CircleLoader";
import { v4 } from "uuid";
import ReportUtils from "../Report/report.utils";
import { toast } from "react-toastify";


const DxDataGrid: React.FC<any> = () => {
    const { t, i18n } = useTranslation();
    const [gridOptions, setGridOptions] = useState<any[]>(ReportUtils.defaultGridProps);
    const activeDetails = useSelector(
        (state: any) => state.menus.activeDetails?.activeDetails
    );
    const filterCriteria = useSelector(
        (state: any) => state.menus.filterCriteria?.filterCriteria
    );
    const userData = localStore.getLoggedInfo();
    const lang = CultureId();
    const userID = userData && JSON.parse(userData).USER_ID;
    const [activeMasterDetails, setActiveMasterDetails] = useState<any>([]);
    const [masterId, setMasterId] = useState();
    const [actionButtons, setActionButtons] = useState<any[]>([]);
    const [columns, setColumns] = useState<any[]>([]);
    const [dataSource, setDataSource] = useState<any>(null);
    const gridRef = useRef<any>(null); // Use 'any' type for gridRef
    const [dtLoader, setDtGridLoader] = useState(true);
    const [gridOptionsProps, setGridOptionsProps] = useState<any>({});
    const [gridState, setGridState] = useState<any>(null);
    const columnIndex = v4();

    const handleContentReady = () => {
        setDtGridLoader(false);
    };


    const renderGridCell = (data: any) => {
        return (
            <>
                {actionButtons?.length && (
                    <DxGridActions
                        rowData={data.data}
                        actionButtons={actionButtons}
                        className="textRight"
                    />
                )}
            </>
        );
    };




    const buildFullview = useCallback(async (param: any) => {
        const response = await getGrid(param);
        const filteredColumnDetails = response.Columns.filter((column: any) => !column.dataField.endsWith('_'));
        setColumns(filteredColumnDetails);
        const newDataSource = new DataSource({
            store: new ArrayStore({
                key: 'ID_', // use the key of your data object here
                data: response.Data ? response.Data : [], // pass the grid data array to the store
            })
        });
        setDataSource(null);
        setTimeout(() => {
            setDataSource(newDataSource)
        });
    }, []);
    const relodGrid = useCallback(() => {
        const masterDetails = activeDetails[0];
        const Master = masterDetails.Master;
        const criteriaArray = filterCriteria.find((obj: any) => obj.masterId === Master?.MASTER_ID)?.criteria;
        const criteriaParam = criteriaArray && criteriaArray.map(({ DbType, EditorType, ParamName, Value }: any) => ({ DbType, EditorType, ParamName, Value }));
        const param = {
            CultureId: lang,
            ReportType: 1,
            MasterId: Master?.MASTER_ID,
            Procedure: Master?.SP_NAME,
            Criteria: criteriaParam ? criteriaParam : null,
            UserId: userID
        };
        buildFullview(param);
    }, [activeDetails, buildFullview, filterCriteria, lang, userID])
    const getGrid = async (param: any) => {
        return ApiService.httpPost("data/getGridData", param);
    }


    const getGridData = useCallback(async (param: any, action?: any) => {
        setDtGridLoader(true)
        try {
            if (!action) {
                buildFullview(param);
            } else {
                if(action.status === fullGridDataAction.FullReload){
                    relodGrid();
                }else{
                    const response = await getGrid(param);
                    if (action.id > 0) {
                        if (action.status === fullGridDataAction.InsertRow) {
                            setDataSource((prev: any) => {
                                const oldData = prev.items();
                                return new DataSource({
                                    store: new ArrayStore({
                                        key: 'ID_',
                                        data: [...oldData, response.Data[0]],
                                    })
                                });
                            })
                        } else if (action.status === fullGridDataAction.UpdateRow) {
                            setDataSource((prev: any) => {
                                prev.store().update(action.id, response.Data[0])
                                return prev
                            })
                        }
                    }
                }
            }
        } catch (error) {
            console.log(error, 'DXGRIDLOAD')
        } finally {
            setDtGridLoader(false);
        }
    }, [buildFullview, relodGrid])
    const gridActionChangeEvent = useCallback((event: any) => {
        const Master = activeMasterDetails.Master;
        console.log(Master, 'Master');
        const criteriaArray = filterCriteria.find((obj: any) => obj.masterId === Master?.MASTER_ID)?.criteria;
        const criteriaParam = criteriaArray && criteriaArray.map(({ DbType, EditorType, ParamName, Value }: any) => ({ DbType, EditorType, ParamName, Value }));
        /* Updated Id Add to The Filter Param */

        let updatedCriteriaParam: any;
        if (criteriaParam != null) {
            updatedCriteriaParam = criteriaParam.map((param: any) => {
                if (param.ParamName === "@ID") {
                    return {
                        ...param,
                        Value: event.id
                    };
                }
                return param;
            });
        }

        const param = {
            CultureId: lang,
            ReportType: 1,
            MasterId: Master?.MASTER_ID,
            Procedure: Master?.SP_NAME,
            Criteria: updatedCriteriaParam ? updatedCriteriaParam : null,
            UserId: userID
        };
        getGridData(param, event)
    }, [activeMasterDetails.Master, filterCriteria, getGridData, lang, userID])

    const setSearchText = (event: any) => {
        if (gridRef.current?.instance) {
            gridRef.current.instance.searchByText(event);
        }
    };

    const handleExport = () => {
        if (gridRef.current?.instance) {
            gridRef.current.instance.exportToExcel(false);
        }
    };
    const handleColumnChooser = () => {
        if (gridRef.current?.instance) {
            gridRef.current.instance.showColumnChooser()
        }
    };
    const reloadGridData = async () => {
        loadFullviewGridData(activeMasterDetails);
    }

    const readLayout = useCallback(async () => {
        const MasterId = activeDetails[0]?.Master.MASTER_ID
        const payload = {
            MasterId,
            CultureId: lang,
            Mode: 0,
            ProfileType: 0,
            UserId: userID
        }
        const { Appearance, State } = await ApiService.httpPost('layout/read', payload);
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
    }, [activeDetails, lang, userID])

    const saveLayout = async () => {
        const MasterId = activeDetails[0]?.Master.MASTER_ID
        const { instance } = gridRef.current ?? {};
        const State = instance.state();
        const param = {
            MasterId,
            CultureId: 0,
            Mode: 0,
            ProfileType: 0,
            UserId: userID,
            State: JSON.stringify(State),
            Appearance: JSON.stringify(gridOptions)
        }
        const { Message, Id } = await ApiService.httpPost('layout/save', param)
        if (Id < 0) {
            toast.error(Message);
        } else {
            toast.success(Message);
        }
    }
    const removeLayout = async () => {
        const MasterId = activeDetails[0]?.Master.MASTER_ID
        const param = {
            MasterId,
            CultureId: 0,
            Mode: 0,
            ProfileType: 0,
            UserId: userID,
        }
        const { Message, Id } = await ApiService.httpPost('layout/remove', param)
        if (Id < 0) {
            toast.error(Message);
        } else {
            readLayout();
            toast.success(Message);
        }
    }
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
        const { instance } = gridRef.current
        if (instance) {
            instance.state(gridState)
        }
    }, [gridState])

    const loadFullviewGridData = useCallback(async (masterDetails: any) => {
        const Master = masterDetails.Master;
        const criteriaArray = filterCriteria.find((obj: any) => obj.masterId === Master?.MASTER_ID)?.criteria;
        const criteriaParam = criteriaArray && criteriaArray.map(({ DbType, EditorType, ParamName, Value }: any) => ({ DbType, EditorType, ParamName, Value }));
        const param = {
            CultureId: lang,
            ReportType: 1,
            MasterId: Master?.MASTER_ID,
            Procedure: Master?.SP_NAME,
            Criteria: criteriaParam ? criteriaParam : null,
            UserId: userID
        };
        getGridData(param);
    }, [filterCriteria, getGridData, lang, userID]);

    const rowPrepareHandler = useCallback((e: any) => {
        const [{ Master: { MASTER_ID: masterID } }] = activeDetails;
        gridRowModification(e, masterID);
    }, [activeDetails])

    const columnPreparedHandler = useCallback((e: any) => {
        const [{ Master: { MASTER_ID: masterID } }] = activeDetails;
        gridColumnModification(e, masterID);
    }, [activeDetails])
    useEffect(() => {
        readLayout();
    }, [readLayout])
    useEffect(() => {
        if (activeDetails?.length) {
            const details = activeDetails[0];
            setMasterId(activeDetails[0]?.Master?.MASTER_ID);
            console.log(activeDetails[0]?.Master?.MASTER_ID, "master id")
            /* Set Active Master Details */
            setActiveMasterDetails(details);
            /* Grid Action Buttons */
            const actionButtons =
                details.Menus &&
                details.Menus.filter((menu: any) => menu.MenuId !== MenuId.New);
            setActionButtons(actionButtons);
            loadFullviewGridData(details);
        }
    }, [activeDetails, filterCriteria, loadFullviewGridData]);

    useEffect(() => {
        if (gridRef.current?.instance) {
            // Perform any additional initialization or configuration of the grid instance if needed
        }
    }, []);
    const onGridOptionsUpdate = (values: any[]) => {
        setGridOptions(values);
    }

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
        <>
            <DataGridActionContext.Provider value={{ gridActionChangeEvent }}>

                <div className="full-view-wrapp h-100 px-3 pb-2">
                    <div className="full-view-head">
                        <FullviewToolbar
                            setSearchText={setSearchText}
                            onExport={handleExport}
                            onColumnChoose={handleColumnChooser}
                            resetGrid={reloadGridData}
                            saveLayout={saveLayout}
                            deleteLayout={removeLayout}
                            gridOptions={gridOptions}
                            updatedOptions={onGridOptionsUpdate}
                        />
                    </div>
                    <div className="full-view-grid">
                        <div className="full-view-grid-wrapper h-100">
                            {
                                dtLoader &&
                                <>
                                    <CircleLoader />
                                    <div className="body-loader-overlay"></div>
                                </>
                            }
                            {(dataSource) && (
                                <DataGrid
                                    ref={gridRef}
                                    dataSource={dataSource}
                                    showBorders={true}
                                    remoteOperations={true}
                                    height="100%"
                                    width="100%"
                                    wordWrapEnabled={false}
                                    rowAlternationEnabled={false}
                                    allowColumnReordering={true}
                                    allowColumnResizing={true}
                                    columnAutoWidth={false}
                                    rtlEnabled={i18n.dir() === "rtl"}
                                    onContentReady={handleContentReady}
                                    onRowPrepared={rowPrepareHandler}
                                    onCellPrepared={columnPreparedHandler}
                                    {...gridOptionsProps}
                                >
                                    <FilterRow visible={false} />
                                    {/* <Export enabled={true} /> */}
                                    <FilterPanel visible={true} />
                                    <FilterBuilderPopup />
                                    <HeaderFilter visible={true} />
                                    {/* <ColumnChooser
                                        enabled={true}
                                        mode="dragAndDrop"
                                    /> */}
                                    <Selection mode="single" />
                                    <Sorting mode="single" />
                                    <Grouping contextMenuEnabled={true} />
                                    <GroupPanel visible={true} />

                                    {columns &&
                                        columns.map((column: any, index: number) => {
                                            const { caption, dataField, dataType, format, width, minWidth } = column;
                                            const CellComponent = isGridCellCustomized(dataField, masterId);

                                            if (CellComponent) {
                                                return (
                                                    <Column
                                                        key={columnIndex + index}
                                                        caption={t(caption)}
                                                        dataField={dataField}
                                                        dataType={dataType}
                                                        format={format}
                                                        //minWidth={minWidth}
                                                        /* columnAutoWidth={true} */
                                                        minWidth={minWidth}
                                                        width={width}
                                                        cellRender={(cell) => customizeDxCell(cell, column, CellComponent)}
                                                    />
                                                );
                                            } else {
                                                return (
                                                    <Column
                                                        key={index}
                                                        caption={t(caption)}
                                                        dataField={dataField}
                                                        dataType={dataType}
                                                        format={format}
                                                        minWidth={minWidth}
                                                        width={width}
                                                    //minWidth={minWidth} 
                                                    />
                                                );
                                            }
                                        })}

                                    <Column
                                        dataField=""
                                        caption=""
                                        width="50px"
                                        cellRender={renderGridCell}
                                        fixed={true}
                                        fixedPosition={i18n.dir() === "ltr" ? "right" : "left"} // Fix the renderGridCell column to the left
                                        cssClass="fixed-action-button"
                                    />
                                </DataGrid>
                            )}
                        </div>
                    </div>
                </div>
            </DataGridActionContext.Provider>
        </>
    );
};

export default DxDataGrid;
