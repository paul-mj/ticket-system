import { createElement } from "react";
import { FormInputText } from "../../../form-components/FormInputText";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { FormInputDate } from "../../../form-components/FormInputDate";
import ReportUtils from "../../report.utils";
import FormToggle from "../../../form-components/FormToggle";
import { FormInputCheckbox } from "../../../form-components/FormInputCheckbox";
import { formatOptionsArray } from "../../../../../common/application/shared-function";
import { FormInputMultiSelect } from "../../../form-components/FormInputMultiSelect";
import FormInputSelectWithClose from "../../../form-components/FormInputSelectWithClose";
import AutocompleteField from "../../../form-components/FormAutoCompleteSelect";
import { CriteriaInputMode } from "../../../../../common/database/enums";

interface FilterControl {
    list: any[];
    control: any;
    errors: any;
    onChange: any;
    resetField: any;
    t: any
}
class ReportFilterUtils {
    static get yupDataTypes() {
        return {
            int: 'number',
            datetime: 'date',
            string: 'string',
            nvarchar: 'string'
        }
    }
    static controls(props: any) {
        const { name, ParamCaption, control, errors, onChange, options, KeyCol, DispCol, resetField, t, InputMode } = props;
        const commonProps = { name, label: t(ParamCaption), control, errors, key: name, onChange: (e: any) => { onChange(e, props) } };
        let selectComponent = {};
        if (InputMode === CriteriaInputMode.Other) {
            selectComponent = {
                component: AutocompleteField,
                props: { ...commonProps, options: formatOptionsArray(options, DispCol, KeyCol) }
            }
        } else {
            selectComponent = {
                component: FormInputSelectWithClose,
                props: { key: name,resetField, selectProps: { ...commonProps, options: formatOptionsArray(options, DispCol, KeyCol) } }
            }
        }
        
        return new Map([
            ['-1', {
                component: FormInputText,
                props: commonProps
            }],
            ['1', selectComponent],
            ['2', {
                component: FormInputMultiSelect,
                props: { ...commonProps, options: formatOptionsArray(options, DispCol, KeyCol) }
            }],
            ['4', {
                component: FormToggle,
                props: commonProps
            }],
            ['5', {
                component: FormInputDate,
                props: { ...commonProps, inputFormat: 'DD/MM/YYYY' }
            }]
        ])
    }
    static buildList(list: any[]) {
        const dbVariables = list
            .filter((ctrl: any) => !ctrl.ShowInEditor);

        const controlList =
            list
                .filter((ctrl: any) => ctrl.ShowInEditor)
                .map((ctrl: any) => {
                    return {
                        ...ctrl,
                        name: ReportUtils.getFormKeyFromParam(ctrl.ParamName)
                    }
                });
        return {
            dbVariables,
            controlList
        }
    }
    static getControls({ list, control, errors, onChange, resetField, t }: FilterControl) {
        return list.map((ctrl: any, index: number) => {
            let { EditorType } = ctrl;
            EditorType = EditorType.toString();
            const controls: any = this.controls({ ...ctrl, control, errors, onChange, resetField, t });
            const component = controls.get(EditorType)?.component ?? controls.get('-1')?.component
            const props = controls.get(EditorType)?.props ?? controls.get('-1')?.props
            return createElement(
                component,
                props
            )
        })
    }

    static getFilterControls({ list, t }: any) {
        const collector: any = {
            defaultValues: {},
            resolvers: {}
        }
        const { defaultValues, resolvers } = collector;
        let circularDep: any = [];
        let frmDate = '';
        let toDate = '';
        const findFromParamCaption = list.find((ctrl: any) => ctrl.name === 'FROM_DATE');
        const findToParamCaption = list.find((ctrl: any) => ctrl.name === 'TO_DATE');
        if (findFromParamCaption && findToParamCaption) {
            circularDep.push('FROM_DATE', 'TO_DATE');
            frmDate = findFromParamCaption.ParamCaption ?? 'From Date';
            toDate = findToParamCaption.ParamCaption ?? 'To Date';
        }
        list.forEach((ctrl: any, index: number) => {
            const { Value, name, IsRequired, ParamType } = ctrl;
            defaultValues[name] = Value ?? '';
            const requiredValidator = IsRequired ? 'required' : 'notRequired';
            const typeValidator = IsRequired ? (this.yupDataTypes[ParamType] ?? 'mixed') : 'mixed';
            let validator = yup[typeValidator]('')[requiredValidator]('').typeError('');
            if (findFromParamCaption && findToParamCaption) {
                switch (name) {
                    case 'FROM_DATE':
                        validator = yup[typeValidator]()[requiredValidator]('').when('TO_DATE', (TO_DATE: Date) => {
                            if (TO_DATE) {
                                return yup.date()
                                    .max(TO_DATE, t(`From Date must be before To Date`))
                                    .typeError('')
                            }
                        });
                        break;
                    case 'TO_DATE':
                        validator = yup[typeValidator]()[requiredValidator]('').when('FROM_DATE', (FROM_DATE: Date) => {
                            if (FROM_DATE) {
                                return yup.date()
                                    .min(FROM_DATE, t(`To Date must be after From Date`))
                                    .typeError('')
                            }
                        });
                        break;
                    default:
                        break;
                }
            }
            switch (ctrl.EditorType) {
                case 2:
                    validator = requiredValidator ? yup['array']().min(1) : yup['array']();
                    defaultValues[name] = Value ?? [];
                    break;
                case 4:
                    validator = yup['boolean']();
                    defaultValues[name] = !!Value;
                    break;

                default:
                    break;
            }
            resolvers[name] = validator;
        })
        return {
            defaultValues,
            resolver: yupResolver(yup.object().shape(resolvers, [circularDep]))
        }
    }
}
export default ReportFilterUtils;