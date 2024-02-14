import * as React from "react";
import { useController } from "react-hook-form";
import dayjs, { Dayjs } from "dayjs";
import TextField from "@mui/material/TextField";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";

interface FormInputDateProps {
    name: string;
    control: any;
    label: string;
    errors?: any;
    onChange?: (value: any) => any;
    value?: any;
    minDate?: any,
    maxDate?: any,
    inputFormat?: any,
    disabled?: boolean;
    hideError?: boolean;
}

export const FormInputDate = ({
    name,
    control,
    label,
    errors,
    inputFormat,
    minDate,
    maxDate,
    onChange,
    value,
    disabled,
    hideError
}: FormInputDateProps) => {
    const { field } = useController({ name, control }); 
    return (
        <> 
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DesktopDatePicker
                    {...field}
                    label={label}
                    inputFormat={inputFormat}
                    minDate={minDate}
                    maxDate={maxDate}
                    value={field.value ? new Date(field.value) : null}
                    disabled={disabled} 
                    onChange={(date) => { 
                        field.onChange(date); 
                        onChange && onChange(date);
                    }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            size="small"
                            className="w-100"
                            error={!!errors[name]}
                            helperText={!hideError && errors[name] && errors[name].message}
                        />
                    )}
                />
            </LocalizationProvider>
        </>
    );
};