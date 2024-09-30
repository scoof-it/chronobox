import React from 'react';
import { FiX } from 'react-icons/fi';

type ModalProps = {
    title: string;
    description: React.ReactNode; // Accepts both string and JSX
    footer?: React.ReactNode;
    isVisible: boolean;
    onClose: () => void;
};

const Modal: React.FC<ModalProps> = ({
    title,
    description,
    footer,
    isVisible,
    onClose,
}) => {
    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="w-80 bg-white p-6 rounded shadow space-y-4">
                <div className="flex">
                    <h2 className="text-[20px] font-bold">{title}</h2>
                    <FiX
                        className="text-[20px] opacity-40 bg-white ml-auto cursor-pointer"
                        onClick={onClose}
                    />
                </div>
                <div className="space-y-2">{description}</div>
                <div className="flex justify-end space-x-2">
                    {footer}
                </div>
            </div>
        </div>
    );
};

export default Modal;