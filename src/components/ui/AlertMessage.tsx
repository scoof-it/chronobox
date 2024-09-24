import { useEffect } from "react";

interface AlertMessageProps {
    message: string;
    type: "success" | "error";
    onClose: () => void;
}

const AlertMessage: React.FC<AlertMessageProps> = ({ message, type, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 3000); // 3秒後にメッセージを自動で閉じる
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div
            className={`fixed top-5 right-5 px-4 py-2 rounded font-bold bg-white shadow ${
                type === "success" ? "text-green-400 border border-green-400" : "text-red-400 border border-red-400"
            }`}
        >
            {message}
        </div>
    );
};

export default AlertMessage;