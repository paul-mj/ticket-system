import React, { useEffect, useState } from "react";
import "./header-component.scss";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, MobileStepper, Paper, Typography } from "@mui/material";
import { Col, Row } from "react-bootstrap";
import CloseIconButton from "../../shared/components/Buttons/IconButtons/CloseIconButton";
import { useTheme } from '@mui/material/styles';
import SwipeableViews from 'react-swipeable-views';
import { autoPlay } from 'react-swipeable-views-utils';
import SkeletonLoader from "../../shared/components/UI/Loader/SkeletonLoader";
import { ImageComponent } from "../../shared/components/DocsView/docs";
import ViewIconButton from "../../shared/components/Buttons/IconButtons/ViewIconButton";
import { ReactFileViewer } from "../../shared/components/dialogs/Preview/react-file-viewer";
import './header-component.scss';
import { t } from "i18next";
import { useTranslation } from "react-i18next";
import { NextArrowBtn, PrevArrowBtn } from "../../assets/images/svgicons/svgicons";
import { ExpandedLogo } from "../../assets/images/png/pngimages";
 

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

const NoticeBoardMessages: React.FC<any> = (props: any) => {
    const { t, i18n } = useTranslation();
    const { dialogOpen, isLoading, noticeBoardItems, resetNoticeBoardStatus } = props; 
    const theme = useTheme();
    const [activeStep, setActiveStep] = React.useState(0);
    const [open, setOpen] = React.useState(false);
    const maxSteps = noticeBoardItems.length;
    const [previewParam, setPreviewParam] = useState({
        popupOpenState: false,
        image: null
    });

    const [noticeBoardItemsList, setNoticeBoardItems] = useState<any>(noticeBoardItems);

    useEffect(() => {
        if(noticeBoardItems) {
            const updatedData = { ...noticeBoardItems };
            for (const key in updatedData) {
                updatedData[key].Attachments = updatedData[key].Attachments.map((attachment : any) => ({
                  ...attachment,
                  ext: attachment.ATTACHMENT_NAME.split('.').pop(),
                  isExist: true
                }));
              }
              setNoticeBoardItems(updatedData)
              

        }
    },[noticeBoardItems])
 

    const onCloseDialog = () => {
        setOpen(false);
        resetNoticeBoardStatus(false)
    }

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleStepChange = (step: number) => {
        setActiveStep(step);
    };

    const handleImageView = (image: any) => {
        setPreviewParam({
            popupOpenState: true,
            image: image
        })
    }

    const handleclosePreview = () => {
        setPreviewParam({
            popupOpenState: false,
            image: null
        })
    }

    useEffect(() => {
        if (noticeBoardItems?.length) {
            setOpen(dialogOpen)
        }
    }, [dialogOpen, noticeBoardItems?.length])


    return (
        <>
            <Dialog open={open} className="" maxWidth={'md'} fullWidth={true}>
                <DialogTitle className="py-0">
                    <Row className='confirm-heading'>
                        <Col md={11}>
                            <div className="d-flex align-items-center h-100">
                                {/* <h4 className="m-0">{noticeBoardItems[activeStep]?.SUBJECT_TEXT}</h4> */}
                            </div>
                        </Col>
                        <Col md={1}>
                            <CloseIconButton onClick={onCloseDialog} />
                        </Col>
                    </Row>
                </DialogTitle>
                <DialogContent className='confirm-body noticeboard-body-wrap'>

                    {isLoading ? (
                        <div>
                            <SkeletonLoader skeleton={{ variant: "rectangular", width: '100%', height: 40, sx: { my: 1 } }} />
                            <SkeletonLoader skeleton={{ variant: "rectangular", width: '100%', height: 400, sx: { my: 1 } }} />
                        </div>
                    ) : (
                        <div>
                            <Box sx={{ flexGrow: 1 }}>
                                <AutoPlaySwipeableViews
                                    axis={'x'}
                                    index={activeStep}
                                    onChangeIndex={handleStepChange}
                                    enableMouseEvents
                                    autoPlay={false}
                                    autoplay={false}
                                >
                                    {noticeBoardItems.map((step: any, index: number) => (
                                        <div key={index} className="text-center">
                                            {Math.abs(activeStep - index) <= 2 ? (
                                                <>
                                                    <Row className="no-gutters justify-content-center align-items-center">
                                                        <div className="logo-img mb-3">
                                                            <img src={ExpandedLogo} alt="" />
                                                        </div>
                                                        <h4 className="m-0 notice-head">{noticeBoardItems[activeStep]?.SUBJECT_TEXT}</h4>
                                                    </Row>
                                                    {
                                                        step?.downloadedDocs?.length ?
                                                            <Box
                                                                sx={{
                                                                    height: 350,
                                                                    width: '100%',
                                                                }}
                                                                display="flex"
                                                                alignItems="center"
                                                                justifyContent="center"
                                                                mb="50px"
                                                                mt="20px"
                                                            >
                                                                <Box
                                                                    component="img"
                                                                    sx={{
                                                                        maxHeight: '100%',
                                                                        maxWidth: '100%',
                                                                        objectFit: 'cover',
                                                                    }}
                                                                    className="slider-imgg"
                                                                    src={step.downloadedDocs[0]?.base64}
                                                                    alt={step?.SUBJECT_TEXT}
                                                                />
                                                            </Box>
                                                            : <></>
                                                    }
                                                    <Row className="no-gutters text-center px-5">
                                                        <Typography dangerouslySetInnerHTML={{ __html: step.TRANS_CONTENT }}></Typography>
                                                    </Row>

                                                    {/* {(step.Attachments && step.Attachments?.length) && (
                                                        <Row className="selected_doc_corr no-gutters">
                                                            <h4 className="mt-2 mb-4">{t("Attachments")}</h4>
                                                            {step.Attachments.map((image: any, index: number) => (
                                                                <Col md={6} key={index} className="my-2">
                                                                    <Row className="each-img align-items-center no-gutters py-2 no-gutters">
                                                                        <Col md={4}>
                                                                            <ImageComponent image={{ ...image, isExist: true, ext: image?.ATTACHMENT_NAME && image?.ATTACHMENT_NAME.split('.').pop()?.toLowerCase() }} />
                                                                        </Col>
                                                                        <Col md={6}>
                                                                            <p className="m-0 filename">{image.DISPLAY_NAME}</p>
                                                                        </Col>
                                                                        <Col md={2}>
                                                                            <ViewIconButton onClick={() => handleImageView(image)} />
                                                                        </Col>
                                                                    </Row>
                                                                </Col>


                                                            ))}
                                                        </Row>

                                                    )} */}
 

                                                </>
                                            ) : null}
                                        </div>
                                    ))}
                                </AutoPlaySwipeableViews>

                            </Box>
                        </div>
                    )}
                </DialogContent>
                <DialogActions className="w-100 notice-stepper-btns">
                    <MobileStepper
                        steps={noticeBoardItems.length}
                        position="static"
                        className="w-100"
                        activeStep={activeStep}
                        nextButton={
                            <Button size="small" onClick={handleNext} disabled={activeStep === noticeBoardItems.length - 1}>
                                {/* {t("Next")} */}
                                <img className="notice-arrw-btn" src={NextArrowBtn} alt="" />

                            </Button>
                        }
                        backButton={
                            <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
                                {/* {t("Back")} */}
                                <img className="notice-arrw-btn" src={PrevArrowBtn} alt="" />

                            </Button>
                        }
                    />
                </DialogActions>
            </Dialog>

            <ReactFileViewer previewParentProps={previewParam} onClose={handleclosePreview} > </ReactFileViewer>

        </>
    )
};

export default NoticeBoardMessages;

