import React from "react";
import { MasterId } from "../../../common/database/enums";
import { Button } from "@mui/material";

interface EditInModeButtonInterface {
    popupConfiguration: any;
    masterId: number;
    requestButtons: any;
    onClickOpenEditMode: () => void;
}

const ViewActionQueueEditButton = ({ popupConfiguration, masterId, requestButtons, onClickOpenEditMode }: EditInModeButtonInterface) => {
    return (
        <React.Fragment>
            {
                (popupConfiguration?.isActionQueue && (masterId === MasterId.Requests) && requestButtons?.length) &&
                    requestButtons && requestButtons.length ?
                    (
                        requestButtons.filter((button: any) => button?.STATUS_ID === 4).length > 0 &&
                        <div className="btn-sec-wrap">
                            <Button
                                type="submit"
                                variant="contained"
                                className={`colored-btn mx-2`}
                                onClick={onClickOpenEditMode}
                            >
                                Open In Edit Mode
                            </Button>
                        </div>
                    ) : null
            }
        </React.Fragment>
    )
}

export default ViewActionQueueEditButton;
