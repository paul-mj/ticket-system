import { useState } from "react";
import { AuthorizationDialog } from "../../shared/components/dialogs/logout-warning";
import { Modal } from "@mui/material";
import ReactDOM from "react-dom";
import { toast } from "react-toastify";

let confirmationShown = false;

export const ResponseErrorHandler = async (error: any): Promise<void> => {
  const { response } = error;
  const [open, setOpen] = useState(true); 
  if (response && response.status === 401) {
    if (!confirmationShown) {
      confirmationShown = true;
      return new Promise((resolve, reject) => {
        const handleConfirm = () => {
          resolve();
        };
        const handleCancel = () => {
          reject(error);
        };
        const handleClose = () => {
          setOpen(false);
        };
        const dialog = (
          <AuthorizationDialog onConfirm={handleConfirm} onCancel={handleCancel} onClose={handleClose} />
        );
        ReactDOM.render(dialog, document.getElementById("modal-root"));
      });
    }
  } else if (response && response.status === 404) {
    toast.error(response?.Message, { autoClose: 3000 });
  } else if (response && response.status === 400) {
    toast.error(response?.Message, { autoClose: 3000 });
  } else if (response && response.status === 403) {
    toast.error(response?.Message, { autoClose: 3000 });
  } else if (response && response.status === 500) {
    toast.error(response?.Message, { autoClose: 3000 });
  } else {
    toast.error(response?.Message, { autoClose: 3000 });
  }
  return Promise.reject(error);
};