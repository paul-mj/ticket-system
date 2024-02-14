import { useController } from 'react-hook-form';
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { Button, TextField } from '@mui/material';
import dayjs from 'dayjs';
 
const today = dayjs();
const tomorrow = dayjs().add(1, 'day');

export const FormInputDateTime = ({
    name,
    control,
    label,
    errors,
    inputFormat,
    minDate,
    maxDate,
    onChange,
    value,
    disabled = false,
}: any) => {
    const { field } = useController({ name, control });

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
                {...field}
                label={label}
                inputFormat="DD/MM/YYYY hh:mm a"
                ampm={false}
                minDate={minDate}
                maxDate={maxDate}
                value={field.value ? new Date(field.value) : null}
                onChange={(date: any) => {
                    field.onChange(date);
                    onChange && onChange(date);
                }}
                disabled={disabled}
                renderInput={(params: any) => (
                    <TextField
                        {...params}
                        size="small"
                        variant="outlined"
                        className="w-100"
                        error={!!errors[name]}
                        /* helperText={errors[name] && errors[name].message}  */
                        readOnly 
                    />
                )}  
            />
        </LocalizationProvider>
    );
};

