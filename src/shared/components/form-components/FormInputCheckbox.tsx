import React, { useEffect, useId, useState } from "react";
import {
    Checkbox,
    FormControl,
    FormControlLabel,
    FormLabel,
} from "@material-ui/core";
import { Controller } from "react-hook-form";
import { FormInputProps } from "./FormInputProps";
import { Typography } from "@mui/material";

export const FormInputCheckbox: React.FC<FormInputProps> = ({
    name,
    control,
    setValue,
    label,
    errors,
    onChange,
    fontSize,
    disabled
}) => {
    const inputId = useId();
    return (
        <FormControl size={"small"} variant={"outlined"}>
            {/* <FormLabel component="legend">{label}</FormLabel> */}
            <Controller
                name={name}
                control={control}
                defaultValue={false}
                render={({ field: { onChange: handleOnChange, onBlur, value } }) => (
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={value}
                                id={inputId}
                               // onChange={(e) => onChange(e.target.checked)}
                                onBlur={onBlur}
                                color="primary"
                                disabled={disabled}
                               
                                onChange={(e) => {
                                    handleOnChange(e);
                                    onChange && onChange(e.target.checked);
                                }}
                            />
                        }
                        label={
                            <Typography variant="body1" style={{ fontSize }}>
                                {label}
                            </Typography>
                        }
                    />
                )}
            />
            {errors[name] && (
                <Typography color="error" variant="body2">
                    {errors[name].message}
                </Typography>
            )}
        </FormControl>
    );
};
