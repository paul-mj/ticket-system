import {
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    FormHelperText,
    InputAdornment,

} from "@mui/material";
import React, { memo, useId } from "react";
import { useFormContext, Controller } from "react-hook-form";
import MuiIconsComponent from "../Mui-Icons/muiicons";
import { FormInputProps } from "./FormInputProps"; 
import './Form-Components.scss'
 
export const FormInputSelect: React.FC<FormInputProps> = memo(
    ({
        name,
        control,
        label,
        errors,
        options,
        startAdornment,
        startAdornmentPosition,
        muiIcon,
        isSlectItem,
        hideError,
        onChange,
        disabled,
        readOnly
    }) => { 
        const generateSingleOptions = () => {
            return (
                options &&
                options?.map((option: any) => {
                    return (
                        <MenuItem key={option.value} value={option.value} disabled={option.disabled}>
                            {option.label}
                        </MenuItem>
                    );
                })
            );
        };

        const generateStartAdornment = () => {
            return (
                <InputAdornment position={startAdornmentPosition}>
                    <MuiIconsComponent iconName={muiIcon} />
                </InputAdornment>
            );
        };

        const inputId = useId()

        return (
            <FormControl
                size={"small"}
                variant="outlined"
                fullWidth
                error={!!errors[name]} 
            >
                <InputLabel id="demo-simple-select-label">{label}</InputLabel>
                <Controller
                    render={({
                        field: { onChange: handleOnChange, onBlur, value = "" }, // provide default value of ''
                        fieldState: { error },
                        formState,
                    }) => (
                        <Select  
                            labelId="demo-simple-select-label"
                            id={inputId}
                            variant="outlined"
                            label={label}
                            error={!!error}
                            onBlur={onBlur}
                            disabled={disabled}
                            value={value ?? ""}
                            startAdornment={startAdornment && generateStartAdornment()}
                            inputProps={{ readOnly: readOnly }}
                            onChange={(e) => {
                                handleOnChange(e);
                                onChange && onChange(e.target.value);
                            }}

                        >
                            {isSlectItem && <MenuItem key="" value=""> {isSlectItem} </MenuItem>}
                            {generateSingleOptions()}
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
    }
);
