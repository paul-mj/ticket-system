import React from "react";
import { Controller } from "react-hook-form";
import { FormInputProps } from "./FormInputProps";
import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from "@mui/material";
 


export const FormInputRadio: React.FC<FormInputProps> = ({
    name,
    control,
    label,
    options,
    onChange
}: any) => {
    const generateRadioOptions = () => {
        return (
            options &&
            options.length &&
            options.map((singleOption: any, index: number) => (
                <FormControlLabel
                    key={index}
                    value={singleOption.value}
                    label={singleOption.label}
                    control={<Radio />}
                />
            ))
        );
    };

    const handleRadioChange = (value: any) => {
        if (onChange) {
            onChange(value);
        }
    };

    return (
        <FormControl component="fieldset">
            <FormLabel component="legend">{label}</FormLabel>
            <Controller
                name={name}
                control={control}
                render={({
                    field: { onChange, value },
                    fieldState: { error },
                    formState,
                }) => (
                    <RadioGroup
                        value={value || ''}
                        onChange={(event) => {
                            onChange(event.target.value);
                            handleRadioChange(event.target.value);
                        }}
                        style={{ flexDirection: 'row' }}
                    >
                        {generateRadioOptions()}
                    </RadioGroup>
                )}
            />
        </FormControl>
    );
};
