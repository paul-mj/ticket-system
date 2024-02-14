import { Checkbox, FormControlLabel } from "@material-ui/core"
import React, { useCallback, useLayoutEffect, useState } from "react"
import './tree.scss';
import { FormInputText } from "../FormInputText";
import { useForm } from "react-hook-form";
import TreeUtils from "./tree.utils";
import { t } from "i18next";
import { useTranslation } from "react-i18next";

interface SeletedTreeList {
    list: any[],
    onChangeList: any,
    label: string
}

export const TreeCheckList = React.memo(({ list, onChangeList, label }: SeletedTreeList) => {
    const {
        control,
        getValues,
    } = useForm<any>({
        defaultValues: {
            Search: ''
        },
    });
    const [checkList, setCheckList] = useState<any[]>([]);
    const onInputHandler = useCallback((e: any) => {
        const { target: { value } } = e;
        const filteredList = TreeUtils.searchNode(checkList, value);
        setCheckList([...filteredList]);
    }, [checkList])
    const onCheckBoxChange = useCallback((item: any, value: boolean) => {
        const result = checkList.filter((f: any) => f.id !== item.id);
        const selectedID = result.map((item: any) => item.id);
        onChangeList(selectedID);
    }, [checkList, onChangeList])
    useLayoutEffect(() => {
        const listSearched = TreeUtils.searchNode(list, getValues('Search'));
        setCheckList(listSearched);
    }, [getValues, list])
    const { t, i18n } = useTranslation();
    return (
        <>
            <div className="tree-controls-group">
                <div className="checklist-title">
                    {label}
                </div>
                <FormInputText
                    name="Search"
                    control={control}
                    label={t("Search")}
                    value={''}
                    onInput={onInputHandler}
                    hideError={true}
                />
            </div>

            {!checkList.length && <p className="text-center mt-3">{t("Nothing is selected")}</p>}
            <ul className="ckecklist-menu">
                {
                    checkList.map((item: any) =>
                        <li key={item.id} style={{ display: !!item.allowToShow ? 'block' : 'none' }}>
                            <TreeTitle item={item} onCheckBoxChange={onCheckBoxChange} />
                        </li>
                    )
                }
            </ul>
        </>
    )
})
const TreeTitle = React.memo(({ item, onCheckBoxChange }: { item: any, onCheckBoxChange: any }) => {
    const [node, setNode] = useState({ text: '', checked: false, isDisabled: false });
    const checkBoxChangeHandler = useCallback(() => {
        setNode((prev: any) => {
            const checked = !prev.checked;
            onCheckBoxChange(item, checked)
            return {
                ...prev,
                checked
            }
        })
    }, [item, onCheckBoxChange])
    useLayoutEffect(() => {
        const obj = {
            text: item.text,
            checked: item.isMarked,
            isDisabled: item.isDisabled
        }
        setNode(obj)
    }, [item.text, item.isMarked, item.isDisabled])
    return (
        <FormControlLabel
            label={node.text}
            control={
                <Checkbox
                    value={node.checked}
                    checked={node.checked}
                    color="primary"
                    disabled={!!node.isDisabled}
                    onChange={checkBoxChangeHandler}
                />
            }
        />
    )
})