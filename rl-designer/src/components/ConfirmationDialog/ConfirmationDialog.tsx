import React, { useState } from "react";
import Modal from "react-modal";
import { useConfirmationDialogStore } from "@/stores/confirmationDialogStore";

import "./ConfirmationDialog.scss";

Modal.setAppElement("#root");

const ConfirmationDialog: React.FC = () => {
    // const [modalIsOpen, setModalIsOpen] = useState(true);
    const { isOpen, message, onConfirm, onCancel, closeConfirmationDialog } = useConfirmationDialogStore();

    const handleConfirm = () => {
        onConfirm();
        closeConfirmationDialog();
    };

    const handleCancel = () => {
        onCancel();
        closeConfirmationDialog();
    };

    return (
            <Modal
                isOpen={isOpen}
                onRequestClose={handleCancel}
                contentLabel="Confirmation Dialog"
                className="confirmation-dialog__modal"
                overlayClassName="confirmation-dialog__overlay"
            >
                <h2 className="confirmation-dialog__modal__title">{message}</h2>
                <div className="confirmation-dialog__modal__buttons">
                    <button className="confirmation-dialog__modal__buttons__button confirmation-dialog__modal__buttons__button--confirm" onClick={handleConfirm}>Confirm</button>
                    <button className="confirmation-dialog__modal__buttons__button confirmation-dialog__modal__buttons__button--cancel" onClick={handleCancel}>Cancel</button>
                </div>

            </Modal>
    );
};

export default ConfirmationDialog;