import React, { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Col, Row } from "react-bootstrap";
import { FormInputText } from "../../shared/components/form-components/FormInputText";
import { Button, IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

const schema = yup.object().shape({
    list: yup.array().of(
        yup.object().shape({
            firstName: yup.string().required("First Name is required"),
            lastName: yup.string().required("Last Name is required"),
        })
    ),
});

const DynamicFormTest = () => {
    /*  const [data, setData] = useState<{ list: { firstName: string; lastName: string; }[] } | undefined>(); */
    const [data, setData] = useState<any>({
        list: [
            {
                firstName: "John",
                lastName: "Doe",
            },
            {
                firstName: "Jane",
                lastName: "Doe",
            },
        ],
    });
 
    const  methords = useForm({
        defaultValues: {
            list: data.list?.length ? [...data.list] : [{ firstName: "", lastName: "" }],
        },
        resolver: yupResolver(schema),
        
    });
    const { fields, append, remove } = useFieldArray({
        control: methords.control,
        name: "list",
    });

    const addNewRowItem = async () => {
        const lastRowIndex = fields.length - 1;
        const isValid = await methords.trigger(`list.${lastRowIndex}`);

        if (isValid) {
            append({ firstName: "", lastName: "" });
        } else {
            alert("Last row is not valid");
        }
    };

    const removeRowItem = (index: number) => {
        remove(index);
    };

    const onSave = (data: any) => {
        console.log(data);
        /* setData({ ...data }); */
    };

    return (
        <>
        <div className="m-4">
            <Button onClick={() => addNewRowItem()} className="mb-4">
                Add New Row
            </Button>
            {fields.map((field, index) => (
                <Row className="box" key={field.id}>
                    <Col md={3}>
                        <FormInputText
                            name={`list.${index}.firstName`}
                            control={methords.control}
                            label="firstName"
                            errors={methords.formState.errors}
                        />
                    </Col>
                    <Col md={3}>
                        <FormInputText
                            name={`list.${index}.lastName`}
                            control={methords.control}
                            label="lastName"
                            errors={methords.formState.errors}
                        />
                    </Col>
                    <Col md={1}>
                        {fields.length !== 1 && (
                            <IconButton
                                aria-label="delete"
                                size="large"
                                onClick={() => removeRowItem(index)}
                            >
                                <DeleteOutlineIcon />
                            </IconButton>
                        )}
                        {fields.length - 1 === index && (
                            <IconButton
                                aria-label="delete"
                                size="large"
                                onClick={() => addNewRowItem()}
                            >
                                <AddIcon />
                            </IconButton>
                        )}
                    </Col>
                </Row>
            ))}

        </div>
            <Button onClick={methords.handleSubmit(onSave)}>Submit</Button>
            {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
        </>
    );
};

export default DynamicFormTest;
