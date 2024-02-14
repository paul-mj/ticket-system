import React, { useCallback, useLayoutEffect, useRef, useState } from "react"
import TreeUtils from "./tree.utils"
import { Checkbox, FormControlLabel } from "@mui/material";
import { useForm } from "react-hook-form";
import { FormInputText } from "../FormInputText";
import './tree.scss';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { t } from "i18next";
import { useTranslation } from "react-i18next";

interface TreeSelect {
    list: any[],
    selectedList: string,
    onListUpdate?: any;
    level: number
}
export const FormTreeSelect = React.memo(({ list, selectedList, onListUpdate, level }: TreeSelect) => {
    const {
        control,
        getValues,
    } = useForm<any>({
        defaultValues: {
            Search: ''
        },
    });
    const [tree, setTree] = useState<any[]>([]);
    const { t, i18n } = useTranslation();
    const [selectedAll, setSelectedAll] = useState({ selected: false, indeterminate: false });
    const buildList = useCallback((list: any[] = [], selectedList: any[] = []) => {
        const formatedList = TreeUtils.markCheckedInitial(list, selectedList, 0);
        const selected = TreeUtils.getMarkedNode(formatedList, level);
        onListUpdate && onListUpdate(selected);
        setTree(formatedList);
    }, [level, onListUpdate])
    const onCheckBoxChange = useCallback((item: any, value: boolean) => {
        let temp = [...tree];
        const found = TreeUtils.getNode(temp, item.id);
        if (found) {
            found.isMarked = value;
            if (found.items?.length) {
                let searchedList = TreeUtils.markAllasChecked(item.items, value, getValues('Search'));                
                found.items = searchedList;
            }
        }
        const selected = TreeUtils.getMarkedNode(temp, level);
        const selectedID = selected.map((item: any) => item.id);
        const list = TreeUtils.searchNode(temp, getValues('Search'));
        buildList(list, selectedID)
        onListUpdate && onListUpdate(selected);
    }, [buildList, getValues, level, onListUpdate, tree])
    const onInputHandler = (e: any) => {
        const { target: { value } } = e;
        const list = TreeUtils.searchNode(tree, value)
        setTree([...list]);
    }
    const getCounts = useCallback(() => {
        const leafNodes = TreeUtils.getLeafNodes(list);
        const selectedListParced = TreeUtils.JSONParse(selectedList);
        return {
            leafNodes: leafNodes.length,
            seletedNodes: selectedListParced.length,
            indeterminate: selectedListParced.length > 0 && leafNodes.length > selectedListParced.length
        }
    }, [list, selectedList])
    const selectAllChangeHandler = (e: any) => {
        setSelectedAll((prev: any) => {
            const latestValue = !prev.selected;
            let selected = []
            if (latestValue) {
                const leafNodes = TreeUtils.getLeafNodes(list);
                selected = leafNodes.map((lf: any) => lf.id);
            }
            const listSearched = TreeUtils.searchNode(list, getValues('Search'));
            buildList(listSearched, selected);
            return {
                ...prev,
                selected: latestValue
            }
        })
    }
    useLayoutEffect(() => {
        const listSearched = TreeUtils.searchNode(list, getValues('Search'));
        const selectedParsed = TreeUtils.JSONParse(selectedList)
        buildList(listSearched, selectedParsed);
        const { indeterminate } = getCounts();
        setSelectedAll((prev: any) => {
            return {
                ...prev,
                selected: !!selectedParsed.length,
                indeterminate
            }
        })
    }, [list, selectedList, buildList, getValues, getCounts])
    return <>
        <div className="tree-controls-group">
            <FormControlLabel
                label={t('Select All')}
                control={
                    <Checkbox
                        value={selectedAll.selected}
                        checked={selectedAll.selected}
                        color="primary"
                        disabled={false}
                        indeterminate={selectedAll.indeterminate}
                        onChange={selectAllChangeHandler}
                    />
                }
            />
            <FormInputText
                name="Search"
                control={control}
                label={t("Search")}
                value={''}
                onInput={onInputHandler}
                hideError={true}
            />
        </div>
        <TreeNode list={tree} onCheckBoxChange={onCheckBoxChange} collaps={false} />
    </>
})
const TreeNode = React.memo(({ list, onCheckBoxChange, collaps }: { list: any[], onCheckBoxChange: any, collaps: boolean }) => {
    const menuRef: any = useRef()
    const collapsHandler = (e: any) => {
        e.stopPropagation();
        const ul = e.currentTarget.parentNode.querySelector('ul');
        if (ul) {
            ul.style.display = ul.style.display === 'none' ? 'block' : 'none'
            e.currentTarget.classList.toggle("collaps");
        }
    }

    return (
        <ul className="tree-menu p-0" ref={menuRef} style={{ display: collaps ? 'none' : 'block' }}>
            {
                list.map((item: any) =>
                    <li key={item.id} style={{ display: !!item.allowToShow ? 'block' : 'none' }}>
                        {!!item?.items?.length && <span className={`colpsArrow collaps`} onClick={collapsHandler}> <ArrowDropDownIcon /> </span>}
                        <TreeTitle item={item} onCheckBoxChange={onCheckBoxChange} />
                        {!!item?.items?.length && <TreeNode list={item.items} onCheckBoxChange={onCheckBoxChange} collaps={true} />}
                    </li>
                )
            }
        </ul>
    )
})
const TreeTitle = React.memo(({ item, onCheckBoxChange }: { item: any, onCheckBoxChange: any }) => {
    const [node, setNode] = useState({ text: '', checked: false, isDisabled: false, indeterminate: false });
    const checkBoxChangeHandler = () => {
        setNode((prev: any) => {
            const checked = !prev.checked;
            onCheckBoxChange(item, checked)
            return {
                ...prev,
                checked
            }
        })
    }
    useLayoutEffect(() => {
        const obj = {
            indeterminate: item.indeterminate,
            text: item.text,
            checked: item.isMarked,
            isDisabled: item.isDisabled
        }
        setNode(obj)
    }, [item.text, item.isMarked, item.isDisabled, item.indeterminate])
    return (
        <FormControlLabel
            label={node.text}
            control={
                <Checkbox
                    value={node.checked}
                    checked={node.checked}
                    color="primary"
                    disabled={!!node.isDisabled}
                    indeterminate={node.indeterminate}
                    onChange={checkBoxChangeHandler}
                />
            }
        />
    )
})