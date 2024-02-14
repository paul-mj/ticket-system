import { TextField } from "@mui/material";
import InputMask from "react-input-mask";
import { Controller } from "react-hook-form";

const FormInputPhone = ({
    name,
    label,
    control,
    errors,
    mask,
    readOnly = false,
    disabled,
    hideError,
}) => { 

    return (
        <Controller
            name={name}
            control={control}
            defaultValue=""
            render={({
                field: { onChange, value },
                fieldState: { error },
                formState,
            }) => (
                <InputMask
                    mask={mask}
                    value={value}
                    readOnly={readOnly}
                    disabled={disabled}
                    onChange={onChange}
                    children={(props) => (
                        <TextField
                            helperText={
                                !hideError && error ? error.message : null
                            } // Updated line
                            size="small"
                            id={`${label+'-outlined-basic'}`} 
                            variant="outlined"
                            label={label}
                            error={!!error}
                            value={value}
                            fullWidth
                            disabled={disabled}
                        />
                    )}
                />
            )}
        />
    );
};

export default FormInputPhone;
