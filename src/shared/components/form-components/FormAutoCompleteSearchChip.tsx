import * as React from 'react';
import { useForm, Controller } from 'react-hook-form';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

const LimitTags = (props: any) => {
    const {
        control,
        name,
        label,
        placeholder,
        limitTags,
        optionList,
        handleAutocompleteChange,
        isOnchangeNew,
    } = props;

    const [inputValue, setInputValue] = React.useState("");

    React.useEffect(() => {
        handleAutocompleteChange(inputValue);
    }, [handleAutocompleteChange, inputValue]);
    

    const isOptionEqualToValue = (option: any, value: any) => {
        return option.value === value.value && option.label === value.label;
    };

    return (
        <Controller
            name={name}
            control={control}
            render={({ field: { onChange, value } }) => (
                <Autocomplete
                    multiple
                    size="small"
                    limitTags={limitTags}
                    id={name}
                    options={optionList && optionList.filter(
                        (option: any) =>
                            !value.find((v: any) =>
                                isOptionEqualToValue(v, option)
                            )
                    )}
                    getOptionLabel={(option) => option.label}
                    onChange={(event, value) => onChange(value)}
                    inputValue={inputValue}
                    onInputChange={(event, newInputValue) =>
                        setInputValue(newInputValue)
                    }
                    className='group-seacrh-auto-complete'
                    value={value}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label={label}
                            placeholder={placeholder}
                            onChange={(event: any) => {
                                const inputValue = event.target.value;
                                if (isOnchangeNew) {
                                    const lastChar = inputValue.slice(-1);
                                    if (lastChar === ";" || lastChar === "; ") {
                                        const newLabel = inputValue.slice(0, -1).trim();
                                        if (newLabel) {
                                            const option = optionList && optionList.find(
                                                (option: any) => option.label === newLabel
                                            );
                                            const newValue = option
                                                ? option
                                                : { label: newLabel, value: -1 };
                                            setInputValue("");
                                            onChange([...value, newValue]);
                                        } else {
                                            setInputValue("");
                                        }
                                    }
                                }
                                else {
                                    setInputValue(inputValue);
                                }
                            }}
                        />
                    )}
                    sx={{ width: "100%" }}
                    isOptionEqualToValue={isOptionEqualToValue}
                />
            )}
        />
    );
};


export const LimitTagsController = (props: any) => {
    const {
        control,
        defaultValue,
        name,
        optionList,
        handleAutocompleteChange,
        label,
        placeholder,
        limitTags,
        isOnchangeNew
    } = props; 

    return (
        <Controller
            name={name}
            control={control}
            defaultValue={defaultValue}
            render={({ field: { onChange, value } }) => (
                <LimitTags
                    name={name}
                    control={control}
                    onChange={onChange}
                    value={value}
                    label={label}
                    placeholder={placeholder}
                    limitTags={limitTags}
                    optionList={optionList}
                    isOnchangeNew={isOnchangeNew}
                    handleAutocompleteChange={handleAutocompleteChange}
                />
            )}
        />
    );
};