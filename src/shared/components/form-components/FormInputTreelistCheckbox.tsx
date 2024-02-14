import React, { useEffect, useState } from "react";
import { TreeView } from "devextreme-react/tree-view";
import { Controller } from "react-hook-form";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import "./Form-Components.scss";
import { Col, Row } from "react-bootstrap";
import { TextField } from "@mui/material";

type TreeDataItem = {
    id: number;
    text: string;
    items?: TreeDataItem[];
};

type Props = {
    options: [];
    selectedOperators: [];
};

/* const FormInputTreelistCheckbox = ({ data }: Props) => { */
const FormInputTreelistCheckbox = (props: any) => {
    const { name, control, label, options, selectedOperators, errors, setValue } = props;
    const [isActive, setIsActive] = useState(false);
    const [treeDataSource, setTreeDataSource] = useState<any>([]);
    const [selectedNodes, setSelectedNodes] = useState<any>([]);
    const [selectedNodeIds, setSelectedNodeIds] = useState<any>([]);
    let defaultOperator: any[] = [];

    /* Clear Text */
    useEffect(() => {

        if (props.resetChildItems) {
            console.log(props.resetChildItems, "Reset Child Items");
            setSelectedNodes([]);
            setSelectedNodeIds([]);
            defaultOperator = [];
        }
    }, [props.resetChildItems])


    /* Sajin Edited 25-05-2023 */
    /*  useEffect(() => {
         if (selectedOperators?.length) {
             const selectedOptions = addKeyToMatchedObjects(
                 options,
                 selectedOperators
             );
             setSelectedNodes(selectedOptions.defaultOperator);
             const defaultIds = selectedOptions.defaultOperator ? selectedOptions.defaultOperator.map((x) => x.id) : []
             setSelectedNodeIds(defaultIds);
             selectedOptions.options && setTreeDataSource(selectedOptions.options);
         } else {
             setTreeDataSource(treeDataSource);
         }
     }, [selectedOperators, options]); */

    /* Sajin Update Below Code 25-05-2023 */
    useEffect(() => {
        const selectedOptions = addKeyToMatchedObjects(options, selectedOperators);
        setSelectedNodes(selectedOptions.defaultOperator);
        const defaultIds = selectedOptions.defaultOperator ? selectedOptions.defaultOperator.map((x) => x.id) : [];
        setSelectedNodeIds(defaultIds);
        setTreeDataSource(selectedOptions.options);
    }, [selectedOperators, options]);








    useEffect(() => {
        const filteredArr = selectedNodeIds.filter((item: any) => typeof item !== 'boolean');
        setValue('Operator', filteredArr);
    }, [selectedNodeIds])

    const addKeyToMatchedObjects = (
        options: any[],
        selectedOperators: any[]
    ): { options: any[]; defaultOperator: any[] } => {
        options.forEach((item: any) => {
            if (selectedOperators.includes(item.id)) {
                item.selected = true;
                defaultOperator.push({ ...item });
            }
            if (item.items) {
                addKeyToMatchedObjects(item.items, selectedOperators);
            }
        });
        return { options, defaultOperator };
    };

    const handleSelectionChange = (e: any) => {
        const selectedNodes = e.component.getSelectedNodes();
        const selectedNodeNames = selectedNodes.map((node: any) => ((node.itemData.id && (node.itemData.isLeaf !== 0)) && node.itemData));
        const selectedNodesIds = selectedNodes.map((node: any) => ((node.itemData.id && (node.itemData.isLeaf !== 0)) && node.itemData.id));
        setSelectedNodes(selectedNodeNames);
        setSelectedNodeIds(selectedNodesIds);
    };

    const renderTreeViewItem = (item: any) => {
        const isNodeSelected = selectedNodes && selectedNodes.some(
            (node: any) => node.id === item.id
        );
        const itemClasses = isNodeSelected ? "selected-node" : "";

        return (
            <div className={`treeview-item ${itemClasses}`}>
                <span>{item.text}</span>
            </div>
        );
    };

    const toggleActive = () => {
        setIsActive(!isActive);
        if (isActive) {
            console.log(control, 'close')
        }
    }

    /* const updateControlValue = (selectedNodeIds: any[]) => {
        const selectedOptions = options.filter((option: any) => selectedNodeIds.includes(option.id));
        control.setValue(selectedOptions);
    }; */

    return (
        <>
            <Controller
                name={name}
                control={control}
                render={({ field, fieldState: { error }, formState }) => (
                    <div className="treeViewInputModel">
                        <div className="treeview_open_ip">
                            <div onClick={(e) => { toggleActive() }} className={`cus__inp__wrap ${error && error.message ? "error_bord" : ""}`}>
                                <Row className="justify-content-end align-items-center">
                                    <Col md={11}>
                                        <div className="d-flex justify-content-start align-items-center h-100 selected-label">
                                            {
                                                selectedNodes?.length ?
                                                    selectedNodes.map((x: any, index: number) => {
                                                        if (x.text) {
                                                            return (
                                                                <span key={index} className="label__name__data">
                                                                    {x.text}
                                                                    {index !== selectedNodes.length - 1 && ','}
                                                                </span>
                                                            );
                                                        }
                                                    }) :
                                                    <span className="label__name"> {label} </span>
                                            }
                                        </div>

                                    </Col>
                                    <Col md={1} className="opr_exp">
                                        <div className="d-flex justify-content-end">
                                            <ExpandMoreIcon
                                                className={`${isActive
                                                    ? "exp_icon_up"
                                                    : ""
                                                    }`}
                                            />
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                        </div>

                        {isActive && (
                            <div className={`treebox ${isActive ? "openBox" : "closeBox"}`}>
                                <div className="tree-wrapp">
                                    <TreeView
                                        dataSource={treeDataSource}
                                        showCheckBoxesMode="selectAll"
                                        selectNodesRecursive={true}
                                        selectByClick={true}
                                        searchEnabled={true}
                                        searchMode="contains"
                                        onSelectionChanged={
                                            handleSelectionChange
                                        }
                                        itemRender={renderTreeViewItem}
                                        keyExpr="id"
                                        parentIdExpr="parentId"

                                    />
                                </div>
                            </div>
                        )}
                    </div>
                )}
            />
            {isActive && (
                <div
                    className="tree__check__overlay__close"
                    onClick={(e) => { toggleActive() }}>
                </div>
            )}
        </>
    );
};

export default FormInputTreelistCheckbox;
