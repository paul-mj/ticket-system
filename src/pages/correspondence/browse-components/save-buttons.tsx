import { Button } from "@mui/material"
import React from "react"

interface SaveButtonInterface {
    buttonList: any;
    methods: any;
    onSubmit: any;
    onError: any;
    onClick: (statusId: any) => void;
}

const SaveButtons = ({ buttonList, methods, onSubmit, onError, onClick }: SaveButtonInterface) => {
    return (
        <React.Fragment>
            {
                buttonList?.length ? (
                    buttonList.map((x: any) => (
                        <Button
                            key={x.STATUS_ID}
                            type="submit"
                            variant="contained"
                            className={`colored-btn mx-2 ${x.ACTION_NAME.replace(/\s/g, '')}`}
                            onClick={() => {
                                onClick(x.STATUS_ID);
                                methods.handleSubmit(onSubmit(x.STATUS_ID), onError);
                            }}
                        >
                            {x.ACTION_NAME}
                        </Button>
                    ))
                ) : (
                    <p> </p>
                )
            }
        </React.Fragment>
    )
}

export default SaveButtons;

