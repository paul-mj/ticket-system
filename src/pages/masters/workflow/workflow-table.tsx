/* Sajin 19-03-2023 */
import { IconButton } from "@mui/material";
import { useFormContext } from "react-hook-form";
import { FormInputCheckbox } from "../../../shared/components/form-components/FormInputCheckbox";
import { FormInputSelect } from "../../../shared/components/form-components/FormInputSelect";
import { FormInputText } from "../../../shared/components/form-components/FormInputText";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import "./workflow-table.scss"; 
import { t } from "i18next";
import { useTranslation } from "react-i18next";

export const WorkFlowTable = (props: any) => {
    const { handleDeleteRow, handleAddRow } = props;
    const { t, i18n } = useTranslation();
    const { process, role, modeView } = props.initialDataResponse;
    const {
        control,
        formState: { errors },
    } = useFormContext();
    return (
        <>
            {/* <AddIcon sx={{ fontSize: 20 }} /> */}

            <div className="table-wrapper">
                <div className="table-outer workflow-table">
                    <div className="table-header">
                        <div className="element">{t("Sort Order")}</div>
                        <div className="element">{t("Roles name")}</div>
                        <div className="element">{t("From Status")}</div>
                        <div className="element">{t("To status")}</div>
                        <div className="element">{t("Final")}</div>
                        <div className="element">{t("Role 1")}</div>
                        <div className="element">{t("Role 2")}</div>
                        {!modeView &&
                            < div className="element">{t("Delete")}</div>
                        }
                    </div>
                    {props.fieldArrayMethords.fields &&
                        props.fieldArrayMethords.fields.map(
                            (field: any, index: number) => (
                                <div className="table-body" key={field.id}>
                                    <div className="element">
                                        <FormInputText
                                            name={`workFlowTable.${index}.code`}
                                            control={control}
                                            label=""
                                            readOnly={modeView}
                                        />
                                    </div>
                                    <div className="element">
                                        <FormInputSelect
                                            name={`workFlowTable.${index}.RoleName`}
                                            control={control}
                                            label=""
                                            options={role}
                                            errors={errors}
                                            readOnly={modeView}
                                        />
                                    </div>
                                    <div className="element">
                                        <FormInputSelect
                                            name={`workFlowTable.${index}.ToStatus`}
                                            control={control}
                                            label=""
                                            options={process}
                                            errors={errors}
                                            readOnly={modeView}
                                        />
                                    </div>
                                    <div className="element">
                                        <FormInputSelect
                                            name={`workFlowTable.${index}.FromStatus`}
                                            control={control}
                                            label=""
                                            options={process}
                                            errors={errors}
                                            readOnly={modeView}
                                        />
                                    </div>
                                    <div className="element">
                                        <FormInputCheckbox
                                            name={`workFlowTable.${index}.IsFinal`}
                                            control={control}
                                            label=""
                                            errors={errors}
                                            disabled={modeView}
                                        />
                                    </div>
                                    <div className="element">
                                        <FormInputSelect
                                            name={`workFlowTable.${index}.Role1`}
                                            control={control}
                                            label=""
                                            options={role}
                                            errors={errors}
                                            readOnly={modeView}
                                        />
                                    </div>
                                    <div className="element">
                                        <FormInputSelect
                                            name={`workFlowTable.${index}.Role2`}
                                            control={control}
                                            label=""
                                            options={role}
                                            errors={errors}
                                            readOnly={modeView}
                                        />
                                    </div>
                                    {!modeView &&
                                        <div className="element">
                                            <div className="d-flex align-items-center justify-content-between row-action-btns h-100">
                                                {props.fieldArrayMethords.fields.length !== 1 && (
                                                    <IconButton
                                                        aria-label="delete"
                                                        size="large"
                                                        onClick={() => handleDeleteRow(index)}
                                                    >
                                                        <DeleteOutlineIcon />
                                                    </IconButton>
                                                )}
                                                {props.fieldArrayMethords.fields.length - 1 === index && (
                                                    <IconButton
                                                        aria-label="delete"
                                                        size="large"
                                                        onClick={() => handleAddRow()}
                                                    >
                                                        <AddIcon />
                                                    </IconButton>
                                                )}
                                            </div>
                                        </div>
                                    }
                                </div>
                            )
                        )}
                </div>
            </div >
        </>
    );
};
