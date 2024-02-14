import {
    Checkbox,
    FormControl,
    FormHelperText,
    InputLabel,
    ListItemText,
    MenuItem,
    OutlinedInput,
    Select,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { Controller } from "react-hook-form";
import { FormInputProps } from "./FormInputProps";
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 'auto',
        },
    },
};
/* const options = [
    { value: 1, label: "Option 1" }, 
]; */

export const FormInputMultiSelect: React.FC<FormInputProps> = ({
    name,
    control,
    label,
    errors,
    options,
    marked,
    hideError,
    readOnly,
    onChange
}) => {

    const generateSingleOptions = (field: any) => {
        return (
            options &&
            options?.map((option: any) => {
                return (
                    <MenuItem
                        key={option.value}
                        value={option.value}
                        disabled={option.disabled} // add this line to disable the option if option.disabled is true
                        className="multi__option__padd__none"
                    >
                        <Checkbox checked={field.indexOf(option.value) > -1} />
                        <ListItemText primary={option.label} />
                    </MenuItem>
                );
            })
        );
    };
    const generateRenderValue = (selected: any) => {
        const selectedItem = findMatchingNames(options, selected);
        return selectedItem?.map((option: any) => option).join(", ");
    };
    const findMatchingNames = (options: any, selected: any) => {
        const matchingNames = [];

        if (options) {
            for (let i = 0; i < options.length; i++) {
                for (let j = 0; j < selected.length; j++) {
                    if (options[i].value === selected[j]) {
                        matchingNames.push(options[i].label);
                    }
                }
            }
        }
        return matchingNames ? matchingNames : [];
    };

    return (
        <FormControl size={"small"} variant="outlined" fullWidth error={!!errors[name]}>
            <InputLabel id="demo-simple-select-label">{label}</InputLabel>
            <Controller
                render={({ field: { onChange: handleOnChange, onBlur, value }, fieldState: { error } }) => (
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        variant="outlined"
                        label={label}
                        value={value ? value : null}
                        multiple
                        onChange={(e) => {
                            handleOnChange(e);
                            onChange && onChange(e.target.value);
                        }}
                        inputProps={{ readOnly: readOnly }}
                        onBlur={onBlur}
                        input={
                            <OutlinedInput
                                id="demo-multiple-checkbox"
                                label={label}
                            />
                        }
                        renderValue={generateRenderValue}
                        MenuProps={MenuProps}
                    >
                        {generateSingleOptions(value)}
                    </Select>
                )}
                control={control}
                name={name}
            />
            {(errors[name] && !hideError) && (
                <FormHelperText>{errors[name].message}</FormHelperText>
            )}
        </FormControl>
    );
};

