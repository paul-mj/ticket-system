import { IconButton } from "@mui/material";
import { FormInputSelect } from "./FormInputSelect";
import ClearIcon from '@mui/icons-material/Clear';
import './Form-Components.scss';

const FormInputSelectWithClose = ({ selectProps, resetField }: any) => {
    return (
        <div className="select-clear-wrap">
            <FormInputSelect {...selectProps} />
            <IconButton aria-label="clear" size="large" className="select-clear-btn" onClick={() => { resetField(selectProps.name) }} title="Clear">
                <ClearIcon />
            </IconButton>
        </div>
    )
}
export default FormInputSelectWithClose;