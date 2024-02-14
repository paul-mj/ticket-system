//

import { DialogContent, DialogTitle, IconButton, Dialog, DialogActions, Button } from "@mui/material";
import { useEffect, useState } from "react";
import PixOutlinedIcon from "@mui/icons-material/PixOutlined";
import CloseIcon from '@mui/icons-material/Close';
import { getApplicableGroupinRoles, readGroupLookup, readUserRights } from "../../../common/api/masters.api";
import { Col, Row } from "react-bootstrap";
import DataGrid, { Column, Paging, Selection } from "devextreme-react/data-grid";
import { useTranslation } from "react-i18next";
import { CultureId } from "../../../common/application/i18n";
import { menuGroupTyp } from "../../../common/typeof/MasterTypeof";
import TreeView from "devextreme-react/tree-view";
const UserRoleGroupView = (props: any) => {
    const { open, onClose, roleID } = props;
    const [scroll, setScroll] = useState<any>("paper");
    const [selectedGroupGrd, setSelectedGroupGrd] = useState<any>([]);
    const { t, i18n } = useTranslation();
    const lang = CultureId();
    const [groupID, setGroupID] = useState<any>();
    const [menuGroup, setMenuGroup] = useState<any>();
    const [colorIndex, setColorIndex] = useState<any>(null);
    const readOpeningData = async () => {
        const response = await readGroupLookup(0);

        if (roleID) {
            const responseApplicableRoles = await getApplicableGroupinRoles(roleID);
            const filteredArray = response?.Data.filter((obj1: any) => responseApplicableRoles?.Data.some((obj2: any) => obj2.ID_ === obj1.ID_)).map((x: any) => ({ ...x, DELETE: 0 }))
            setMenuGroup(null);
            setColorIndex(null);
            /*  selectedGroupGrd.splice(0);
             filteredArray.map((e: any) => selectedGroupGrd.push({ ID_: e?.ID_, OBJECT_NAME: e?.OBJECT_NAME })) */
            setSelectedGroupGrd(filteredArray);
        }
    }
    useEffect(() => {
        readOpeningData();
    }, [roleID])

    const closeButton = () => {
        setMenuGroup([]);
        setSelectedGroupGrd([]);
        onClose();
    }
    /* const onSelectionChange = (e: any) => {

        setGroupID(e?.currentSelectedRowKeys[0]);
        userGroupread(e?.currentSelectedRowKeys[0])
    } */
    const userGroupread = async (grpID: any) => {
        const param = {
            Id: grpID,
            CultureId: lang,
            Mode: 1

        }
        const response = await readUserRights(param);
        setMenuGroup(response?.Rights);

        setColorIndex(grpID);

    }

    return (
        <>
            <Dialog
                open={open}
                onClose={onClose}
                //  scroll={scroll}
                //aria-labelledby="saltrans-dialog-title"
                //aria-describedby="saltrans-dialog-description"
                fullWidth={true}
                maxWidth={'md'}
            >
                <DialogTitle sx={{ m: 0, p: 2 }} className="dialog_title_wrapper"
                    id="dialogtitle" >
                    <p className="dialog_title">
                        <PixOutlinedIcon className="head-icon" />
                        <span className="mx-2">
                            {t("Roles Configuration")}
                        </span>
                    </p>
                    {
                        onClose ? (
                            <IconButton
                                aria-label="Close"
                                onClick={closeButton}
                                sx={{
                                    position: 'absolute',
                                    right: 8,
                                    top: 13,
                                    color: (theme) => theme.palette.grey[500],
                                }} >
                                <CloseIcon />

                            </IconButton>
                        ) : null

                    }

                </DialogTitle>
                <DialogContent dividers className="dialog-content-wrapp p-3">
                    <Row >
                        <Col md={6} >

                            <div className="outlined-box mb-3 px-3 h-100">
                                <h5 className="outlined-box-head my-3">
                                    {t("Assinged User Groups")}
                                </h5>

                                <Row>
                                    <Col md={3}>
                                    </Col>
                                    <Col md={6}>
                                        {
                                            selectedGroupGrd && selectedGroupGrd.map((x: any, i: number) => {

                                                return (
                                                    <Button key={i}
                                                        variant="outlined"
                                                        className="mb-3"
                                                        onClick={() => userGroupread(x.ID_)}
                                                        style={{ backgroundColor: colorIndex === x.ID_ ? '#006eff7d' : '', color: colorIndex === x.ID_ ? 'white' : '' }}
                                                    >
                                                        {x.OBJECT_NAME}
                                                    </Button>
                                                )
                                            })
                                        }

                                    </Col>
                                    <Col md={3}>
                                    </Col>

                                    {/*  <Col md={12} className="mb-3"> */}

                                    {/* <DataGrid
                                            dataSource={selectedGroupGrd}
                                           // showBorders={true}
                                            keyExpr="ID_"
                                            onSelectionChanged={onSelectionChange}
                                            width={380}
                                            height={485}
                                            className="mt-3"
                                            showColumnLines={true}
                                            showRowLines={true}
                                            rowAlternationEnabled={true}
                                            rtlEnabled={i18n.dir() === "rtl"}

                                        >
                                            <Selection
                                                mode="single"
                                                selectAllMode='allPages'
                                                showCheckBoxesMode='onClick'

                                            />
                                            <Paging defaultPageSize={10} />
                                            <Column dataField="OBJECT_NAME" caption="User Group on selected user roles"  width={305} />
                                            

                                        </DataGrid> */}
                                    {/* </Col> */}
                                </Row>
                            </div>

                        </Col>
                        <Col md={6}>
                            <div className="outlined-box mb-3 px-3 h-100">
                                <h5 className="outlined-box-head my-3" >
                                    {t("Assigned Rights")}
                                </h5>
                                <Row>
                                    <Col md={12} className="mb-3">
                                        <TreeView
                                            id='Menu-Treeviw'

                                            items={menuGroup}
                                            dataStructure="plain"
                                            keyExpr="Id"
                                            displayExpr="TaskName"
                                            parentIdExpr="ParentId"
                                            selectByClick={false}
                                            showCheckBoxesMode="none"
                                            //  selectionMode="multiple"
                                            width={400}
                                            height={450}
                                            expandedExpr="isExpanded"
                                            //  onItemSelectionChanged={handleSelectTreeView}
                                            //   selectedExpr="IsChecked"
                                            rtlEnabled={i18n.dir() === "rtl"}
                                        >
                                        </TreeView>
                                    </Col>
                                </Row>

                            </div>
                        </Col>
                    </Row>
                </DialogContent>
                <DialogActions>
                    <Button
                        autoFocus
                        onClick={() => closeButton()}
                        className="mx-3"
                    >
                        {t("Close")}
                    </Button>

                </DialogActions>
            </Dialog>
        </>
    )

}
export default UserRoleGroupView;
