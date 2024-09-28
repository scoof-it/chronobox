import { useEffect, useState } from "react";
import { FaCheck, FaTimes } from "react-icons/fa";

interface AlertMessageProps {
    message: string;
    type: "success" | "error";
    onClose: () => void;
}

const AlertMessage: React.FC<AlertMessageProps> = ({ message, type, onClose }) => {
    const [fadeOut, setFadeOut] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setFadeOut(true), 1500);
        const closeTimer = setTimeout(onClose, 2000);
        return () => {
            clearTimeout(timer);
            clearTimeout(closeTimer);
        };
    }, [onClose]);

    return (
        <div
            className={`alert-message fixed bottom-5 right-5 px-4 py-3 flex items-center shadow-md rounded-md font-bold transform transition-all duration-500
            ${fadeOut ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}
        >
            {type === "success" ? (
                <FaCheck className="text-[#50cbeb] mr-2" />
            ) : (
                <FaTimes className="text-[#ff5050] mr-2" />
            )}
            <p className="text-white">{message}</p>
        </div>
    );
};

export default AlertMessage;