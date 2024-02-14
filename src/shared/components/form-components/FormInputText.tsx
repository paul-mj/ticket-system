import React, { useEffect, useId, useRef } from "react";
import { InputAdornment, TextField, IconButton } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";
import { FormInputProps } from "./FormInputProps";
import MuiIconsComponent from "../Mui-Icons/muiicons";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import ClearIcon from '@mui/icons-material/Clear';
import { useNameInputDirective } from "./useNameInputDirective";

export const FormInputText = ({
    name,
    control,
    label,
    errors,
    multiline,
    maxLength,
    minLength,
    align,
    disabled,
    startAdornment,
    startAdornmentPosition,
    endAdornment,
    endAdornmentPosition,
    muiIcon,
    hideError,
    type,
    onChange,
    onKeyDown,
    onKeyUp,
    onInput,
    value,
    password,
    clearField,
    readOnly,
    textLang,
    textOnly,
    minRows,
    autoCompleteName,
    noInputId = false,
}: FormInputProps) => {
    const inptField: any = useRef();

    const inputId = useId();
    const [showPassword, setShowPassword] = React.useState(password);
    const handleClickShowPassword = () => setShowPassword((show) => {
        const newVal = !show;
        inptField.current && inptField.current.setAttribute('type', newVal ? 'text' : 'password')
        return newVal
    });

    return (
        <Controller
            name={name}
            control={control}
            render={({
                field: { onChange: handleOnChange, onBlur, value = "" },
                fieldState: { error },
                formState,
            }) => (
                <TextField
                    inputRef={inptField}
                    helperText={(error && !hideError) ? error.message : null}
                    size="small"
                    id={!noInputId ? inputId : ''}
                    variant="outlined"
                    autoComplete={!noInputId ? (autoCompleteName || 'off') : 'off'}
                    type={type}
                    label={label}
                    error={!!error}
                    disabled={disabled}
                    onBlur={onBlur}
                    value={value}
                    fullWidth
                    minRows={minRows}
                    multiline={multiline}
                    inputProps={{
                        maxLength: maxLength,
                        min: minLength,
                        readOnly: readOnly,
                        style: align,
                        direction: align === 'right' ? 'rtl' : 'ltr',
                        onKeyDown, onInput
                    }}
                    onChange={(e) => {
                        handleOnChange(e);
                        onChange && onChange(e.target.value);
                    }}
                    InputProps={{
                        startAdornment: startAdornment && (
                            <InputAdornment position={startAdornmentPosition || 'start'}>
                                <MuiIconsComponent iconName={muiIcon} />
                            </InputAdornment>
                        ),
                        endAdornment: startAdornment && (
                            <InputAdornment position="end">
                                {endAdornment && (
                                    <InputAdornment position={endAdornmentPosition || 'end'} onClick={handleClickShowPassword} className="cursor-pointer">
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </InputAdornment>
                                )}
                            </InputAdornment>
                        ),
                    }}
                />
            )}
        />
    );
};