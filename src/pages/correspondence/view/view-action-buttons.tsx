import { Button } from "@mui/material";
import React from "react";

interface ViewActionButtonInterface {
    actionButtons: any;
    onClickChangeStatus: (button: any) => void;
}

const ViewActionButtons = ({actionButtons, onClickChangeStatus}: ViewActionButtonInterface) => {
    return (
        <React.Fragment>
            {
                actionButtons && actionButtons?.length ? (
                    actionButtons.map((x: any, index: any) => (
                        <div className="btn-sec-wrap">
                            <Button
                                key={index}
                                className={`colored-btn mx-2`}
                                type="submit"
                                variant="contained"
                                onClick={() => onClickChangeStatus(x)}
                            >
                                {x.ACTION_NAME}
                            </Button>
                        </div>
                    ))
                ) : <></>
            }
        </React.Fragment>
    )
}

export default ViewActionButtons;
