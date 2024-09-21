import React from 'react';
import Button from './Button';


type ModalProps = {
    title: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
    confirmVariant?: 'primary' | 'danger';
    onConfirm: () => void;
    onCancel: () => void;
    isVisible: boolean;
};

const Modal: React.FC<ModalProps> = ({
    title,
    description,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    confirmVariant = 'primary',
    onConfirm,
    onCancel,
    isVisible,
}) => {
    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="w-80 bg-white p-6 rounded shadow space-y-4">
                <h2 className="text-[20px] font-bold">{title}</h2>
                <div className="space-y-2">{description}</div>
                <div className="flex justify-end space-x-2">
                    <Button variant="secondary" className="button-cancel" onClick={onCancel}>
                        {cancelText}
                    </Button>
                    <Button variant={confirmVariant} onClick={onConfirm}>
                        {confirmText}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Modal;