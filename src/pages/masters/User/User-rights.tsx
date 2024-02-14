import { useFormContext } from "react-hook-form";
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { useContext, useEffect, useState } from "react";
import DataGrid, { Column, FilterRow, Paging, Selection } from "devextreme-react/data-grid";
import "./User-right.scss";
import { CultureId } from "../../../common/application/i18n";
import localStore from "../../../common/browserstore/localstore";
import { useTranslation } from "react-i18next";
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { IconButton } from "@material-ui/core";
import UserRoleGroupView from "./UserRoleGroupView";
import { fullViewRowDataContext } from "../../../common/providers/viewProvider";
import { MenuId } from "../../../common/database/enums";


export const UserRights = (props: any) => {
    const { subentities, roles, SubEntityRet, RoleRet, accessEntity, modeView } = props;
    const { t, i18n } = useTranslation();
    const {
        control,
        formState: { errors },
    } = useFormContext();
    const lang = CultureId();
    const userData = localStore.getLoggedInfo();
    const userID = userData && JSON.parse(userData).USER_ID;
    const [tabValue, setTabValue] = useState<any>('1');
    const [roleChecked, setRoleChecked] = useState<any>([]);
    const [selectedRoleRowKeys, setSelectedRoleRowKeys] = useState<any>([]);
    const [selectedEntityRowKeys, setSelectedEntityRowKeys] = useState<any>([]);
    const [entityChecked, setEntityChecked] = useState<any>([]);
    const GridHeight: number = 415;
    const [ColWidth, setColWidth] = useState<number>(290);
    const [openDialogName, setOpenDialog] = useState<any>();
    const [userRoleValue, setUserRoleValue] = useState<any>();
    const [chgRole, setChgRole] = useState<any>();
    const openGroupView = async (grdValue: any) => {
        setOpenDialog("grpView");
        setUserRoleValue(grdValue?.data.ID_);

    };
    const { rowData, activeAction } = useContext(fullViewRowDataContext);
    const closeDialog = async () => {
        setOpenDialog(null);
    };

    const handleChange = (event: any, newValue: any) => {
        setTabValue(newValue);
    };

    const onSelectionRoleChange = ({ selectedRowsData }: any) => {
        RoleRet(selectedRowsData);
        setRoleChecked(selectedRowsData);
       
    };

    const onSelectionEntityChange = ({ selectedRowsData }: any) => {
        SubEntityRet(selectedRowsData);
        setEntityChecked(selectedRowsData);
      
    };

    const renderGridCell = (data: any) => {
        return <>
            <IconButton className="p-0" aria-label="view" onClick={() => openGroupView(data)}  >
                <VisibilityOutlinedIcon className="p-0" style={{ fontSize: 20, transform: 'scale(0.8)' }} />
            </IconButton>
        </>;
    };

    useEffect(() => {
       
        RoleRet(roles.filter((u: any) => u.IS_MARKED === 1));
        SubEntityRet(subentities.filter((u: any) => u.IS_MARKED === 1));
        selectedEntityRowKeys.splice(0);
        subentities.map((x: any) => { if (x.IS_MARKED === 1) { selectedEntityRowKeys.push(x.ID_) } });
        selectedRoleRowKeys.splice(0);
        roles.map((x: any) => { if (x.IS_MARKED === 1) { selectedRoleRowKeys.push(x.ID_) } });
        if (activeAction.MenuId === MenuId.Edit || activeAction.MenuId === MenuId.View) { setTabValue('2') }
        if (activeAction.MenuId === MenuId.Edit || activeAction.MenuId === MenuId.View) {
            const delay = setTimeout(() => {
                setTabValue('1')
            }, 100);
            return () => clearTimeout(delay);
        }
    }, [roles, subentities]);

   /*  useEffect(() => {
        if (!accessEntity) {
            setTabValue("1");
        }
    }, [accessEntity]); */

    return (
        <>
            <div >
                <TabContext value={tabValue}>
                    <TabList onChange={handleChange} aria-label="lab API tabs example">
                        <Tab label={t("User Roles")} value="1" />
                        {accessEntity && <Tab label={t("Sub Entity")} value="2" />}
                    </TabList>
                    <TabPanel value="1" className="UserDataGrid p-0 mt-3">
                        <DataGrid
                            dataSource={roles}
                            showBorders={true}
                            id="UserRights.Roles"
                            keyExpr="ID_"
                            onSelectionChanged={onSelectionRoleChange}
                            height={GridHeight}
                            rtlEnabled={i18n.dir() === "rtl"}
                            defaultSelectedRowKeys={selectedRoleRowKeys}
                        >
                            <Selection
                                mode="multiple"
                                selectAllMode='allPages'
                                showCheckBoxesMode='always'
                                allowSelectAll={true}

                            />
                            <FilterRow visible={true} />
                            <Paging defaultPageSize={10} />

                            <Column type="selection" width={50} />
                            <Column dataField="ROLE_NAME" caption={t("User Roles")} width={ColWidth} />

                            <Column
                                dataField="ID_"
                                cellRender={renderGridCell} width={40}
                                caption=""
                            />
                        </DataGrid>

                    </TabPanel>

                    {accessEntity && <TabPanel value="2" className="UserDataGrid p-0 mt-3" >
                        <DataGrid
                            dataSource={subentities}
                            showBorders={true}
                            keyExpr="ID_"
                            onSelectionChanged={onSelectionEntityChange}
                            defaultSelectedRowKeys={selectedEntityRowKeys}
                            height={GridHeight}
                            rtlEnabled={i18n.dir() === "rtl"}
                        >
                            <Selection
                                mode="multiple"
                                selectAllMode='allPages'
                                showCheckBoxesMode='onClick'
                            />
                            <FilterRow visible={true} />
                            <Paging defaultPageSize={10} />
                            <Column type="selection" width={50} />
                            <Column dataField="SUB_ENTITY_NAME" caption="Sub Entity" width={350} />
                        </DataGrid>
                    </TabPanel>
                    }
                </TabContext>
            </div>
            <UserRoleGroupView open={openDialogName === "grpView"} onClose={closeDialog} roleID={userRoleValue} />
        </>
    )
}