import * as React from "react";
import Dialog from "@mui/material/Dialog";
import { ComponentKey, COMPONENTS } from "./pageviewer-components";
import { TransitionProps } from "@material-ui/core/transitions";
import { Slide } from "@mui/material";

export interface PageviewerDialogProps {
    open: boolean;
    onClose: (value: boolean) => void;
    popupConfiguration: any;
}

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const PageViewer = (props: PageviewerDialogProps) => {
    const { onClose, open, popupConfiguration } = props;

    const handleCloseDialogControl = (event: any, reason: any) => { 
        if (reason && reason === "backdropClick") return;
        onClose(false);
    };

    const handleCloseChild = () => {
        onClose(false);
    };

    /* Component Loader */
    const componentKey: ComponentKey = popupConfiguration.DialogName;
    const ComponentToRender = COMPONENTS[componentKey];

    return (
        <>
            {!popupConfiguration.IsFullPage ? (
                <Dialog
                    fullWidth={popupConfiguration.FullWidth}
                    maxWidth={popupConfiguration.MaxWidth}
                    /* onClose={handleCloseDialogControl} */
                    open={open} 
                >
                    <ComponentToRender
                        onCloseDialog={handleCloseChild}
                        popupConfiguration={popupConfiguration}
                    />
                </Dialog>
            ) : (
                <Dialog
                    fullScreen
                    /* onClose={handleCloseDialogControl} */
                    open={open}
                    TransitionComponent={Transition}
                >
                    <ComponentToRender
                        onCloseDialog={handleCloseChild}
                        popupConfiguration={popupConfiguration}
                    />
                </Dialog>
            )}
        </>
    );
};

export default PageViewer;
