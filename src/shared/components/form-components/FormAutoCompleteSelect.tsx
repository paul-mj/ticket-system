import React from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { Controller } from "react-hook-form";
import { FormInputProps } from "./FormInputProps";



export const AutocompleteField: React.FC<FormInputProps> = ({
    control,
    name,
    label,
    options,
    selectedValue,
    defaultValue = null,
    onChange,
    ...rest
}) => {
    
    const getLabel = (option: any) => {
        let label
        if (option.label) {
            label = option.label
        } else {
            const found = options?.find((item: any) => {
                return item.value === option
            })
            label = found ? found.label : ""
        }
        return label
    }

    return (
        <Controller
            control={control}
            name={name}
            defaultValue={defaultValue}
            render={({ field: { onChange: onFieldChange, onBlur, value } }) => (
                <Autocomplete
                    disablePortal
                    options={options}
                    size="small"
                    className='group-seacrh-auto-complete'
                    renderInput={(params) => (
                        <TextField {...params} label={label} onBlur={onBlur} />
                    )}
                    onChange={(e, data) => {
                        onFieldChange(data?.value);
                        onChange && onChange(data);
                    }}
                    value={value}
                    getOptionLabel={getLabel}
                    {...rest}
                />
            )}
        />
    );
};

export default AutocompleteField;
