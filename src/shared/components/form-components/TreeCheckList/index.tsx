import { TreeCheckList } from "./FormChecklist"
import { FormTreeSelect } from "./FormTreeSelect"
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Col, Row } from "react-bootstrap";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import TreeUtils from "./tree.utils";
import { Badge, Card } from "@mui/material";
import PrimaryButton from "../../Buttons/TextButtons/Curved/PrimaryButton";
import { useTranslation } from "react-i18next";



export const TreeIndex = React.memo(({ selectedOperators, options, onUpdate, label, errors }: any) => {
    const checkboxOuterRef: any = useRef(null);
    const { t } = useTranslation();
    const [selectedCheckList, setSelectedCheckList] = useState<any[]>([]);
    const [selectedList, setSelectedList] = useState<string>('');
    const [isActive, setIsActive] = useState(false);
    const [selectedListLabel, setSelectedListLabel] = useState('');
    const [selectedCount, setSelectedCount] = useState(0);

    const getUpdatedList = useCallback((list: any[]) => {
        setSelectedCheckList(list);
        const updatedList = list.map((x: any) => x.id);
        setSelectedList(TreeUtils.JSONStringify(updatedList));
    }, [])
    const getCheckListUpdate = useCallback((list: any[]) => {
        setSelectedList(TreeUtils.JSONStringify(list));
    }, [])
    useEffect(() => {
        setSelectedList(selectedOperators);
    }, [selectedOperators]);

    const toggleActive = () => {
        setIsActive(!isActive);
    }
    useEffect(() => {
        if (selectedList) {
            onUpdate(selectedList);
        }
    }, [onUpdate, selectedList])
    useEffect(() => {
        if (selectedList) {
            const list = TreeUtils.JSONParse(selectedList);
            const selectedNodes = TreeUtils.getSelectedNode(options, list)
            const text = selectedNodes.map((n: any) => n.text).join(', ')
            setSelectedListLabel(text);
            setSelectedCount(selectedNodes.length);
        }
    }, [options, selectedList, selectedCheckList])
    return (
        <>
            <div className="tree_list_checkbox" ref={checkboxOuterRef}>
                <div className="mb-2">
                    <Badge badgeContent={selectedCount} invisible={!selectedCount} color="primary">
                        <span className="pe-2">{label}</span>
                    </Badge>

                </div>
                <div className={`div_input ${(errors?.Operator?.message && !selectedListLabel) ? 'input_val_error' : ''}`} onClick={toggleActive} >
                    <Row className="no-gutters h-100">
                        <Col md={11}>
                            <div className={"input_val"}>
                                <span>{selectedListLabel}</span>
                            </div>
                        </Col>
                        <Col md={1}>
                            <div className="d-flex align-items-center justify-content-end h-100">
                                <ExpandMoreIcon className={`${isActive ? "exp_icon_up" : ""}`} />
                            </div>
                        </Col>
                    </Row>
                </div>
                <div className="my-2">
                    <span className="tree-label blue-text">{selectedCount ? `${t('Total')} ${selectedCount} ${t('Operators are selected')}` : ''}</span>
                </div>
                {
                    isActive &&
                    <div className="option_block">
                        <Row>
                            <Col>
                                <Card className="p-2 h-100">
                                    <div className="tree-outer-box">
                                        <FormTreeSelect list={options} selectedList={selectedList} onListUpdate={getUpdatedList} level={2} />
                                    </div>
                                </Card>
                            </Col>
                            <Col>
                                <Card className="p-2 h-100">
                                    <div className="tree-outer-box">
                                        <TreeCheckList list={selectedCheckList} onChangeList={getCheckListUpdate} label={`Selected ${label}`} />
                                    </div>
                                </Card>
                            </Col>
                        </Row>
                        <Row>
                            <div className="mt-3 justify-content-end d-flex">
                                <PrimaryButton onClick={() => setIsActive(false)} text={t('Close')} />
                            </div>
                        </Row>
                    </div>
                }
            </div>
        </>
    )
})
