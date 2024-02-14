import React, { useState, useCallback, useContext, createContext, useRef } from 'react';
import PropTypes from 'prop-types';
import { DialogTitle, DialogContent, DialogActions, Button, Paper, Dialog } from '@mui/material';
import { Col, Row } from 'react-bootstrap';
import { MdClose, MdCheck } from "react-icons/md";
import { CiSaveUp2 } from "react-icons/ci";
import { FiX } from "react-icons/fi";
import { HiOutlineTrash } from "react-icons/hi2";
import './confirmation.scss';
import { HiOutlineExclamation } from 'react-icons/hi';
import { t } from "i18next";
import { useTranslation } from "react-i18next";


type ConfirmDialogOptions = {
    ui?: 'confirmation' | 'delete' | 'warning' | 'success' | 'error';
    complete?: true;
    title?: string;
    description?: string;
    confirmBtnLabel?: string;
    cancelBtnLabel?: string;
};

type ConfirmDialogContextType = (options?: ConfirmDialogOptions) => Promise<boolean>;

export const ConfirmDialogContext = createContext<ConfirmDialogContextType>(() => Promise.resolve(false));

type ConfirmDialogProviderProps = {
    children: React.ReactNode;
};

export function ConfirmDialogProvider({ children }: ConfirmDialogProviderProps) {
    const [dialogOpen, setDialogOpen] = useState(false);
    const { t, i18n } = useTranslation();
    const [dialogOptions, setDialogOptions] = useState<ConfirmDialogOptions>({});
    const resolveRef = useRef<(value: boolean) => void>(() => { });

    const confirm = useCallback((options: ConfirmDialogOptions = {}) => {
        setDialogOptions(options);
        setDialogOpen(true);
        return new Promise<boolean>((resolve) => {
            resolveRef.current = resolve;
        });
    }, []);

    const handleConfirm = () => {
        resolveRef.current(true);
        setDialogOpen(false);
    };

    const handleCancel = () => {
        resolveRef.current(false);
        setDialogOpen(false);
    };


    const RenderDialogIcon = () => {
        return (
            <div>
                {dialogIcon()}
            </div>
        )
    }

    const dialogIcon = () => {
        let icon;
        switch (dialogOptions.ui) {
            case 'confirmation':
                icon = <CiSaveUp2 />
                break;
            case 'delete':
                icon = <HiOutlineTrash />
                break;
            case 'success':
                icon = <MdCheck />
                break;
            case 'error':
                icon = <MdClose />
                break;
            case 'warning':
                icon = <HiOutlineExclamation />
                break;
            default:
                break;
        }
        return icon;
    }

    return (
        <ConfirmDialogContext.Provider value={confirm}>
            {children}
            {/* <Dialog open={dialogOpen} onClose={handleCancel} className={`confirm__dialog ${dialogOptions.ui}`}> */}
            <Dialog open={dialogOpen} className={`confirm__dialog ${dialogOptions.ui}`}>
                <Paper style={{ maxWidth: '430px', minWidth: '300px' }}>
                    <DialogTitle>
                        <Row className='confirm-heading text-center'>
                            <Col md={12}>
                                <div className='action-icon'>
                                    <RenderDialogIcon/>
                                </div>
                            </Col>
                            <Col md={12}>
                                <h4 className='mt-3 pb-1'>
                                    {dialogOptions.title || 'Confirmation'}
                                </h4>
                            </Col>

                        </Row>
                    </DialogTitle>
                    <DialogContent className='confirm-body'> 
                        <p className='text-center m-0 pt-4 pb-2' dangerouslySetInnerHTML={{ __html: dialogOptions.description || "" }}></p>
                    </DialogContent>
                    <DialogActions className='confirm-footer-buttons'>
                        <Row className='no-gutters w-100 justify-content-end'>
                            {
                                (!dialogOptions.complete && dialogOptions.cancelBtnLabel) &&
                                <Col md={6} className='mb-2'>
                                    <Button className="no mx-1 w-100" onClick={handleCancel}>
                                        <MdClose />
                                        <p className='mx-2 my-0'>{dialogOptions.cancelBtnLabel || 'Cancel'}</p>
                                    </Button>

                                </Col>
                            }
                            <Col md={6}>
                                <Button className="yes mx-1 w-100" color="primary" autoFocus onClick={handleConfirm}>
                                    <MdCheck />
                                    <p className='mx-2 my-0'>{dialogOptions.confirmBtnLabel || 'Confirm'}</p>
                                </Button>
                            </Col>
                        </Row>
                    </DialogActions>
                </Paper>
            </Dialog>
        </ConfirmDialogContext.Provider>
    );
}




export function useConfirm() {
    return useContext(ConfirmDialogContext);
}

ConfirmDialogProvider.propTypes = {
    children: PropTypes.node.isRequired,
};