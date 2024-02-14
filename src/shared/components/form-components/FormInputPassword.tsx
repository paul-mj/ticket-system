import React, { useId } from "react";
import { InputAdornment, TextField, IconButton } from "@mui/material";
import { Controller } from "react-hook-form";
import { FormInputProps } from "./FormInputProps";
import MuiIconsComponent from "../Mui-Icons/muiicons";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import ClearIcon from '@mui/icons-material/Clear';

export const FormInputPassword = ({
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
    onBlur,
    value,
    password,
    clearField,
    readOnly
}: FormInputProps) => {
    const [showPassword, setShowPassword] = React.useState(password);
    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const inputId = useId()
    const handleClear = (event: React.MouseEvent<HTMLButtonElement>) => {
        const target = event.target as HTMLElement;
        const parentElement = target?.parentElement?.parentElement;
        if (parentElement) {
            const input = parentElement.querySelector('input');
            if (input) {
                input.value = '';
                onChange && onChange(null);
            }
        }
    };

    return (
        <Controller
            name={name}
            control={control}
            render={({
                field: { onChange: handleOnChange, onBlur: handleOnBlur, value = "" }, // provide default value of ''
                fieldState: { error },
                formState,
            }) => (
                <TextField
                   
                    size="small"
                    id={inputId}
                    variant="outlined"
                    autoComplete="off"
                    type={showPassword ? 'password' : 'text'}
                    // type = {type}
                    label={label}
                    error={!!error}
                    disabled={disabled}
                    //onChange={onChange}
                    // onBlur={onBlur}
                    value={value}
                    fullWidth
                    multiline={multiline}
                    inputProps={{
                        maxLength: maxLength,
                        min: minLength,
                        readOnly: readOnly,
                        style: align,
                        direction: align === 'right' ? 'rtl' : 'ltr',
                    }}
                    onChange={(e) => {
                        handleOnChange(e);
                        onChange && onChange(e.target.value);
                    }}
                    onBlur={(e) => { // add onBlur function argument
                        handleOnBlur();
                        onBlur && onBlur(e); // pass the event object to onBlur prop
                    }}
                    InputProps={{
                        startAdornment: startAdornment && (
                            <InputAdornment position={startAdornmentPosition}>
                                <MuiIconsComponent iconName={muiIcon} />
                            </InputAdornment>
                        ),
                        endAdornment: (
                            <InputAdornment position="end">
                                {(value && clearField) && (
                                    <IconButton onClick={handleClear}>
                                        <ClearIcon />
                                    </IconButton>
                                )}
                                {endAdornment && (
                                    <InputAdornment position={endAdornmentPosition} onClick={handleClickShowPassword}>
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
