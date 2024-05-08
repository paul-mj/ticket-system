import { Col } from "react-bootstrap";
import { FormInputDate } from "../../shared/components/form-components/FormInputDate";
import { FormInputDateTime } from "../../shared/components/form-components/FormInputDateTime";
import { MasterId } from "../../common/database/enums";
import { useTranslation } from "react-i18next";
import { useCallback, useEffect, useMemo, useState } from "react";
import React from "react";

interface MinAndMax {
    min: Date | null;
    max: Date | null;
}

export const DatePickerFields = (props: any) => {
    const { popupConfiguration, fields, control, errors, setValue, getValues, watch, colSize } = props;
    const [filteredPickerFields, setFilteredPickerFields] = useState<any[]>([]);

    const pickerFields = useMemo(
        () => [
            { name: 'DocumentDate', label: 'Document Date', inputFormat: 'DD/MM/YYYY', minDate: new Date(), maxDate: null },
            { name: 'StartDate', label: 'Start Date', inputFormat: 'DD/MM/YYYY', isStart: true, minDate: new Date(), maxDate: null },
            { name: 'ResolutionDate', label: 'Resolution Date', inputFormat: 'DD/MM/YYYY', minDate: new Date(), maxDate: null },
            { name: 'DueDate', label: 'Due Date', inputFormat: 'DD/MM/YYYY', isStart: false, minDate: new Date(), maxDate: null },
            { name: 'EndDate', label: 'End Date', inputFormat: 'DD/MM/YYYY', isStart: false, minDate: new Date(), maxDate: null },
            { name: 'ExpiryDate', label: 'Expiry Date', inputFormat: 'DD/MM/YYYY', isStart: false, minDate: new Date(), maxDate: null },
            { name: 'CircularDate', label: 'Circular Date', inputFormat: 'DD/MM/YYYY', minDate: new Date(), maxDate: null },
            { name: 'EffectiveDate', label: 'Effective Date', inputFormat: 'DD/MM/YYYY', minDate: new Date(), maxDate: null },
        ],
        []
    );

    const onChangePickerUpdate = useCallback((e:Date,field:any) => {
        console.log(e, field);
        console.log(watch('StartDate'))
        console.log(watch('EndDate'))

        setFilteredPickerFields((prev:any) => {
            const temp = [...prev]
            const target = temp.find((dt:any) => dt.isStart === !field.isStart);
            if(target){
                const key = field.isStart ?'minDate': 'maxDate';
                target[key] = e;

                console.log(target, 'target value')
            }
            return JSON.parse(JSON.stringify(temp));
        })
    },[]);
 

    useEffect(() => {
        const filteredFields = pickerFields.filter((field) => fields.includes(field.name));
        setFilteredPickerFields(filteredFields);
    }, [fields, pickerFields]);

    useEffect(() => { 
    },[filteredPickerFields]);

    return (
        <>
            {filteredPickerFields.map((field: any, index: number) =>
                    <Col md={colSize || 2} className="mb-3" key={field.name}>
                        <Pickers
                            popupConfiguration={popupConfiguration}
                            field={field}
                            control={control}
                            errors={errors}
                            watch={watch}
                            getValues={getValues}
                            onChangePickerUpdate={onChangePickerUpdate}
                        />
                    </Col>                
            )}
        </>
    )
}


const Pickers = React.memo(({ popupConfiguration, field, control, errors, watch, getValues, onChangePickerUpdate }: any) => {
    const { t, i18n } = useTranslation();
    const [minAndMax, setMinAndMax] = useState<any>({
        min: null,
        max: null
    });
 
    useEffect(() => { 
        const {maxDate:max,minDate:min} = field;
        setMinAndMax({min,max})
    },[field])

    return (
        <>
            { 
                [MasterId.Events, MasterId.Meetings].includes(popupConfiguration?.MasterId) ?
                    <FormInputDateTime
                        name={field.name}
                        control={control}
                        label={t(field.label)}
                        errors={errors}
                        inputFormat={field.inputFormat}
                        minDate={minAndMax.min}
                        maxDate={minAndMax.max}
                        onChange={(event: any) => onChangePickerUpdate(event, field)}
                    />
                    :
                    <FormInputDate
                        name={field.name}
                        control={control}
                        label={t(field.label)}
                        errors={errors}
                        inputFormat={field.inputFormat}
                        hideError={true}
                        minDate={minAndMax.min}
                        maxDate={minAndMax.max}
                        onChange={(event: any) => onChangePickerUpdate(event, field)}
                    />
            }
        </>
    )
})
