export interface FormInputProps {
    name: string;
    control?: any;
    label: string;
    setValue?: any;
    errors?: any;
    mask?: any;
    options?: any;
    multiline?: boolean;
    maxLength?: number;
    minLength?: number;
    align?: any;
    startAdornment?: any;
    startAdornmentPosition?: any;
    endAdornment?: any;
    endAdornmentPosition?: any;
    muiIcon?: string;
    isSlectItem?: any;
    hideError?: any;
    onChange?: (value: any) => any;
    onKeyDown?: (value: any) => any;
    onBlur?: (value: any) => any;
    onKeyUp?:(value: any) => any;
    onInput?:(value: any) => any;
    type?: string;
    disabled?: boolean;
    defaultValue?: any;
    value?: any;
    fontSize?: number;
    password?: boolean;
    marked?: any,
    clearField?: boolean,
    search?: boolean,
    readOnly?:boolean,
    selectedValue?: any,
    textLang?: string,
    textOnly?: boolean,
    noInputId?: boolean,
    minRows?: number,
    autoCompleteName?: string
}
