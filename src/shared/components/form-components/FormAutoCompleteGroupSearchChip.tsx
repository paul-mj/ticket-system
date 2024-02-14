import * as React from 'react';
import { Controller } from 'react-hook-form';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { Chip } from '@mui/material';
import { useId } from 'react';

const LimitTags = (props: any) => {
    const {
        control,
        name,
        label,
        placeholder,
        limitTags,
        optionList,
        handleAutocompleteChange,
        errors,
        selectedAttendees
    } = props;

    const [inputValue, setInputValue] = React.useState("");
    const [filteredOptions, setFilteredOptions] = React.useState(optionList ?? []);
    const inputId = useId();

    React.useEffect(() => {
        handleAutocompleteChange(inputValue);
    }, [inputValue]);
    React.useEffect(() => {
        if (optionList && selectedAttendees) {
            const updatedOptions = optionList.filter((option: any) =>
                !selectedAttendees.find(
                    (selectedAttendee: any) =>
                        selectedAttendee.CONTACT_DET === option.CONTACT_DET &&
                        selectedAttendee.ID_ === option.ID_
                )
            );
            console.log(updatedOptions,'updatedOptions')
            setFilteredOptions(updatedOptions);
        }
        console.log(selectedAttendees,'selectedAttendees')
    }, [optionList, selectedAttendees]);
    React.useEffect(() => {
        setFilteredOptions(optionList ?? []);
    },[optionList])
    const options = [...filteredOptions]
        .map((option: any) => {
            return {
                ENTRY_TYPE: option.ENTRY_TYPE,
                ...option
            };
        })
        .sort((a: any, b: any) =>
            (b.ENTRY_TYPE?.toString() ?? "").localeCompare(
                a.ENTRY_TYPE?.toString() ?? ""
            )
        );

    const groupByEntryType = (option: any) => {
        const recordType = option.RECORD_TYPE?.toString();
        return recordType?.toUpperCase();
    };

    const isOptionEqualToValue = (value: any, option: any) => {
        return (
            option.CONTACT_DET === value.CONTACT_DET && option?.ID_ === value.ID_
        );
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
                    id={inputId}
                    options={options}
                    groupBy={groupByEntryType}
                    getOptionLabel={(option) => option.CONTACT_DET}
                    onChange={(event, value) => onChange(value)}
                    inputValue={inputValue}
                    onInputChange={(event, newInputValue) =>
                        setInputValue(newInputValue)
                    }
                    value={value}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label={label}
                            placeholder={placeholder}
                            onChange={(event: any) => {
                                const inputValue = event.target.value;
                                setInputValue(inputValue);
                            }}
                            error={errors && errors[name]}
                        />
                    )}
                    className='group-seacrh-auto-complete'
                    renderTags={(value, getTagProps: any) =>
                        value.map((option, index) => (
                            <Chip 
                                key={option?.ID_}  
                                {...getTagProps({ index })} 
                                label={
                                    <p className="group-chip-label m-0">
                                        <span className='title'>{option.RECORD_TYPE}</span> <span className='separator'>:</span> {option.CONTACT_DET}
                                    </p>
                                }
                            />
                        ))
                    }
                    sx={{ width: "100%" }}
                    isOptionEqualToValue={isOptionEqualToValue}
                />
            )}
        />
    );
};



export const LimitTagsGroupController = (props: any) => {
    const {
        control,
        defaultValue,
        name,
        optionList,
        handleAutocompleteChange,
        label,
        placeholder,
        limitTags,
        isOnchangeNew,
        errors,
        selectedAttendees
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
                    errors={errors}
                    selectedAttendees={selectedAttendees}
                />
            )}
        />
    );
};