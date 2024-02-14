import { useEffect, useId } from "react";
import { useController } from "react-hook-form";
import { FormControlLabel, Switch } from "@material-ui/core";

interface SwitchFieldProps {
    name: string;
    control: any;
    label: string;
    defaultValue?: boolean;
    onChange?: (checked: boolean) => void;
    disabled?:boolean
    fontSize ?:any
}

export const SwitchField = ({
    name,
    control,
    label,
    defaultValue,
    onChange,
    disabled,
    fontSize
}: SwitchFieldProps) => {
    const {
        field: { onChange: handleOnChange, value },
    } = useController({
        name,
        control,
        defaultValue,
    });
    const id = useId();
    
    useEffect(() => {
        onChange?.(value);
    }, [value, onChange]);

    const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const checked = event.target.checked;
        handleOnChange(checked);
        onChange?.(checked);
    };

    return (
        <FormControlLabel
            control={
                <Switch
                    checked={value}
                    name={name}
                    color="primary" 
                    id={id}
                    onChange={handleSwitchChange}
                    disabled = {disabled}
                    style={{ fontSize }}
                />
            }
            label={label}
        />
    );
};