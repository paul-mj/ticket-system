import { FormControlLabel, Switch } from "@mui/material";
import { Controller } from "react-hook-form";

const FormToggle = ({
    name,
    control,
    label,
    disabled,
    onChange,
    readOnly
}: any) => {
    return (
        <Controller
            name={name}
            control={control}
            defaultValue={false}
            render={({
                field: { onChange: handleOnChange, value },
                fieldState: { error },
                formState,
            }) => (
                <FormControlLabel
                    control={
                        <Switch
                            onChange={(e) => {
                                handleOnChange(e);
                                onChange && onChange(e.target.checked);
                            }}
                            disabled={disabled}
                            checked={value} />
                    }
                    label={label}
                />

            )}
        />
    )
}
export default FormToggle;