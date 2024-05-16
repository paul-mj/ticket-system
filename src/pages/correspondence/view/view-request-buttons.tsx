import { Button } from "@mui/material";
import React from "react";

interface RequestButtonInterface {
    requestButtons: any;
    onClickChangeStatus: (button: any) => void;
}

const ViewRequestButtons = ({requestButtons, onClickChangeStatus}: RequestButtonInterface) => {
    return (
        <React.Fragment>
            {
                requestButtons && requestButtons?.length ?
                    requestButtons.map((button: any, index: any) => (
                        <div className="btn-sec-wrap" key={index}> 
                            <Button
                                type="submit"
                                variant="contained"
                                className={`stat-bttn mx-2  statid-${button?.STATUS_ID}`}
                                onClick={() => onClickChangeStatus(button)}
                            >
                                {button.ACTION_NAME}
                            </Button>
                        </div>
                    )) : <></>
            }
        </React.Fragment>
    )
}



export default ViewRequestButtons;