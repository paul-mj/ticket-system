import styled from "@emotion/styled";
import CloseIcon from "@mui/icons-material/Close";
import {
    TextField,
    Select,
    MenuItem,
    Checkbox,
    FormControlLabel,
    Radio,
    RadioGroup,
    FormControl,
    FormLabel,
    Button,
    Grid,
    Box,
    Typography,
    IconButton,
    Autocomplete,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { CultureId } from "../../../common/application/i18n";
import { CriteriaInputMode } from "../../../common/database/enums";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import dayjs from "dayjs";

import * as Yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { FormInputText } from "../form-components/FormInputText";
import { setActiveFilter } from "../../../redux/reducers/sidebar.reducer";
import { useDispatch, useSelector } from "react-redux";
import { ThunkDispatch } from "@reduxjs/toolkit";
import { format, formatISO, parseISO } from "date-fns";
import { t } from "i18next";
import { useTranslation } from "react-i18next";

const FilterWrapper = styled.div` 
    height: 100%;  
`;
const FilterHeader = styled.div` 
        height: 6%;  
        display: flex;
        align-items: center;
        padding: 15px;
        background:#ecedf6
    }
`;
const FilterBody = styled.div` 
    height: 86%;  
`;
const FilterFooter = styled.div` 
        height: 8%;  
        display: flex;
        align-items: center;
        padding: 15px;
    }
`;

interface FormValues {
    [key: string]: any;
}

export const DxGridFilter: React.FC<{
    handleCloseFilter: () => void;
    CriteriaDetails: any;
    ActiveDetails: any;
}> = (props) => {
    const { ActiveDetails } = props;
    const dispatch = useDispatch<any>();
    const { filterCriteria } = useSelector(
        (state: any) => state.menus.filterCriteria
    );
    const lang = CultureId();
    const { t, i18n } = useTranslation();
    const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
    const checkedIcon = <CheckBoxIcon fontSize="small" />;
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<FormValues>();
    const [CriteriaDetails, setCriteriaDetails] = useState([]);

    /* Active Details Change */
    useEffect(() => {
        const Master = ActiveDetails && ActiveDetails[0].Master;
        /* Get correspondant filterCriteria from store based on masterId*/
        const criteriaArray = filterCriteria.find(
            (obj: any) => obj.masterId === Master?.MASTER_ID
        )?.criteria;
        if (criteriaArray) {
            /* console.log(criteriaArray, "Filter Criteria Filter Criteria"); */
            setCriteriaDetails(criteriaArray);
        }
    }, [ActiveDetails]);

    const onSubmit = async (data: any) => {
        const validationSchema = Yup.object().shape(
            CriteriaDetails.reduce((accumulator: any, criteria: any) => {
                if (criteria.ShowInEditor === 1 && criteria.IsRequired === 1) {
                    accumulator[criteria.ParamCaption] = Yup.string().required(
                        `${criteria.ParamCaption} is required`
                    );
                }
                return accumulator;
            }, {})
        );

        try {
            await validationSchema.validate(data, { abortEarly: false });
            const updatedCriteriaDetails = CriteriaDetails.map((item: any) => {
                const matchingKey = Object.keys(data).find(
                    (key) => key === item.ParamCaption
                );
                if (matchingKey) {
                    return { ...item, Value: data[matchingKey] };
                } else {
                    return item;
                }
            });  
            const updatedArray = [
                {
                    Criteria: formattedDate(updatedCriteriaDetails),
                    Master: ActiveDetails[0].Master,
                },
            ];
            dispatch(setActiveFilter({ activeItem: updatedArray, isCheck: true }));
            handleCloseFilter();
            // Call your other function here
        } catch (error) {
            console.log(error, "validation errors");
        }
    };


    const formattedDate = (data: any) => data.map((item: any) => {
        if (item.EditorType === 5) {
          const formattedValue = item.Value ? new Date(item.Value).toISOString() : null;
          return {
            ...item,
            Value: formattedValue ? format(new Date(formattedValue), "yyyy-MM-dd'T'HH:mm:ssxxx") : null
          };
        }
        return item;
      });
 

    const handleCloseFilter = () => {
        props.handleCloseFilter();
    };

    return (
        <FilterWrapper className="filter_wrapper">
            <FilterHeader>
                <div className="d-flex justify-content-between align-items-center w-100 header-wrapper">
                    <h4 className="m-0">{t("Filter")}</h4>
                    <IconButton
                        aria-label="close"
                        className="head-close-bttn"
                        onClick={handleCloseFilter}
                        sx={{
                            position: "absolute",
                            right: 4,
                            top: 4,
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                </div>
            </FilterHeader>
            <FilterBody>
                <div className="h-100 overflow-auto px-3">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        {CriteriaDetails?.length &&
                            CriteriaDetails.map((criteria: any, index: number) => {
                                const { ShowInEditor, EditorType, IsRequired, ParamCaption } =
                                    criteria;
                                const isRequired = IsRequired === 1;

                                if (ShowInEditor === 1) {
                                    switch (EditorType) {
                                        case -1:
                                            return (
                                                <Grid item xs={12} key={index} className="mt-3">
                                                    <Controller
                                                        name={ParamCaption}
                                                        control={control}
                                                        defaultValue={criteria.Value || ""}
                                                        rules={{ required: isRequired }}
                                                        render={({ field }) => (
                                                            <TextField
                                                                {...field}
                                                                id={ParamCaption}
                                                                label={ParamCaption}
                                                                required={isRequired}
                                                                variant="outlined"
                                                                size="small"
                                                                fullWidth
                                                                type={
                                                                    criteria.ParamType === "int"
                                                                        ? "number"
                                                                        : "text"
                                                                }
                                                                error={!!errors[ParamCaption]}
                                                                helperText={
                                                                    errors[ParamCaption]
                                                                        ? `${ParamCaption} is required`
                                                                        : ""
                                                                }
                                                            />
                                                        )}
                                                    />
                                                </Grid>
                                            );
                                        case 1:
                                            return (
                                                <Grid item xs={12} key={index} className="mt-3">
                                                    <Controller
                                                        name={ParamCaption}
                                                        control={control}
                                                        rules={{ required: isRequired }}
                                                        render={({ field }) => {
                                                            const selectedOption = criteria.list?.find(
                                                                (option: any) => option.Id === criteria.Value
                                                            );
                                                            console.log(selectedOption, "selected option");
                                                            return (
                                                                <Autocomplete
                                                                    disablePortal
                                                                    id="combo-box-demo"
                                                                    options={criteria.list || []}
                                                                    getOptionLabel={(option: any) =>
                                                                        option.Description
                                                                    }
                                                                    value={selectedOption}
                                                                    renderInput={(params: any) => (
                                                                        <TextField
                                                                            {...params}
                                                                            label={ParamCaption}
                                                                            required={isRequired}
                                                                            variant="outlined"
                                                                            size="small"
                                                                            {...field}
                                                                            error={!!errors[ParamCaption]}
                                                                            helperText={errors[ParamCaption]?.message}
                                                                        />
                                                                    )}
                                                                    onChange={(event, newValue) => {
                                                                        const value = newValue ? newValue.Id : "";
                                                                        field.onChange(value);
                                                                    }}
                                                                />
                                                            );
                                                        }}
                                                    />
                                                </Grid>
                                            );
                                        case 2:
                                            return (
                                                <Grid item xs={12} key={index} className="mt-3">
                                                    <Controller
                                                        name={ParamCaption}
                                                        control={control}
                                                        rules={{ required: isRequired }}
                                                        render={({ field }) => (
                                                            <Autocomplete
                                                                multiple
                                                                id="checkboxes-tags-demo"
                                                                options={criteria.list || []}
                                                                disableCloseOnSelect
                                                                getOptionLabel={(option: any) =>
                                                                    option.Description
                                                                }
                                                                renderOption={(props, option, { selected }) => (
                                                                    <li {...props}>
                                                                        <Checkbox
                                                                            icon={icon}
                                                                            checkedIcon={checkedIcon}
                                                                            style={{ marginRight: 8 }}
                                                                            checked={selected}
                                                                        />
                                                                        {option.Description}
                                                                    </li>
                                                                )}
                                                                style={{ width: "100%" }} // Use a percentage value to take up the full width of the container
                                                                renderInput={(params) => (
                                                                    <TextField
                                                                        {...params}
                                                                        label={ParamCaption}
                                                                        required={isRequired}
                                                                        variant="outlined"
                                                                        size="small"
                                                                        {...field}
                                                                        error={!!errors[ParamCaption]}
                                                                    />
                                                                )}
                                                                onChange={(event, newValue) => {
                                                                    const value = newValue
                                                                        ? newValue.map((option: any) => option.Id)
                                                                        : [];
                                                                    field.onChange(value);
                                                                }}
                                                            />
                                                        )}
                                                    />
                                                </Grid>
                                            );
                                        case 4:
                                            return (
                                                <Grid item xs={12} key={index} className="mt-3">
                                                    <Controller
                                                        name={ParamCaption}
                                                        control={control}
                                                        rules={{ required: isRequired }}
                                                        render={({ field }) => (
                                                            <Checkbox
                                                                {...field}
                                                                checked={criteria.Value}
                                                                onChange={(event) => {
                                                                    const value = event.target.checked;
                                                                    field.onChange(value);
                                                                    criteria = { ...criteria, Value: value }; // create a new object with updated property
                                                                }}
                                                                inputProps={{ "aria-label": ParamCaption }}
                                                                required={isRequired}
                                                            />
                                                        )}
                                                    />
                                                </Grid>
                                            );
                                        case 5:
                                            return (
                                                <Grid item xs={12} key={index} className="mt-3">
                                                    <Controller
                                                        key={ParamCaption}
                                                        name={ParamCaption}
                                                        control={control}
                                                        defaultValue={
                                                            criteria.Value ? parseISO(criteria.Value) : null
                                                        }
                                                        rules={{ required: isRequired }}
                                                        render={({ field }) => (
                                                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                                <DesktopDatePicker
                                                                    label={ParamCaption}
                                                                    inputFormat="DD/MM/YYYY"
                                                                    value={field.value}
                                                                    onChange={(date) => {
                                                                        const formattedDate = dayjs(date).format('YYYY-MM-DD'); // Change the format here
                                                                        console.log(formattedDate); // Log the formatted date
                                                                        field.onChange(date); // Update the field value with the selected date
                                                                    }}
                                                                    renderInput={(params) => (
                                                                        <TextField
                                                                            {...params}
                                                                            size="small"
                                                                            className="w-100"
                                                                            required={isRequired}
                                                                            error={!!errors[ParamCaption]}
                                                                        />
                                                                    )}
                                                                />
                                                            </LocalizationProvider>
                                                        )}
                                                    />
                                                </Grid>
                                            );
                                        default:
                                            return null;
                                    }
                                }
                            })}
                    </form>
                </div>
            </FilterBody>
            <FilterFooter>
                <div className="d-flex justify-content-end align-items-center w-100 h-100">
                    <Button className="filter-bttn" onClick={handleSubmit(onSubmit)}>
                        {t("Submit")}
                    </Button>
                </div>
            </FilterFooter>
        </FilterWrapper>
    );
};
