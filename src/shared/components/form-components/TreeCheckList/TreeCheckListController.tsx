import { TreeIndex } from ".";
import React, { useCallback, useEffect, useState } from "react";
import TreeUtils from "./tree.utils";

const TreeCheckListController = React.memo((props: any) => {
    const { options, selectedOperators, getUpdatedValue, name, label,errors } = props;
    const [selectedList, setSelectedList] = useState('');
    const updateValue = useCallback((value: string) => {
        const list = TreeUtils.JSONParse(value);
        getUpdatedValue(name, list)
    }, [getUpdatedValue, name])
    useEffect(() => {
        setSelectedList(TreeUtils.JSONStringify(selectedOperators))
    }, [selectedOperators])
    return (
        (!!selectedList && options) && <TreeIndex selectedOperators={selectedList} options={options} label={label} onUpdate={updateValue} errors={errors} />
    )
})
export default TreeCheckListController;