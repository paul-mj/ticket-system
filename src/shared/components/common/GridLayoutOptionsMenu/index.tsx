import { useTranslation } from "react-i18next";
import { FormInputCheckbox } from "../../form-components/FormInputCheckbox";
import { useFieldArray, useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { MenuItem } from "@mui/material";

const GridLayoutOptionsMenu = ({ options, onUpdate }: any) => {
    const { t } = useTranslation();
    const [optionList, setOptionList] = useState<any[]>([])
    const { control, handleSubmit, getValues, formState: { errors } } = useForm();
    const { fields, append, remove } = useFieldArray({
        control,
        name: "gridOptions"
    });
    const onChangeHandler = () => {
        const formValues = getValues();
        const updatedOptions = options.map((item: any, index: number) => {
            return {
                ...item,
                Value: formValues.gridOptions[index].Value
            }
        })
        onUpdate(updatedOptions)
    }
    useEffect(() => {
        if (options?.length) {
            options.forEach((item: any) => {
                append({ Value: item.Value })
            });
            setOptionList(options)
        }
    }, [append, options])
    return (
        <>
            {(optionList.length && fields.length) && optionList.map((item, index) => (
                <MenuItem key={index} className="option-menu-item">
                    <FormInputCheckbox
                        name={`gridOptions.${index}.Value`}
                        control={control}
                        onChange={onChangeHandler}
                        label={t(item?.Description)}
                        errors={errors}
                    />
                </MenuItem>
            ))}
        </>
    )
}
export default GridLayoutOptionsMenu;