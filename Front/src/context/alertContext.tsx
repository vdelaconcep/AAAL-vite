import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

interface alertOptionsType {
    important?: boolean
    addAction?: (() => void) | null
}

type showAlertType = (text: string, options?: alertOptionsType) => void

interface AlertContextType extends Required<alertOptionsType> {
    visible: boolean
    alertText: string
    showAlert: showAlertType
    hideAlert: () => void
}

const AlertContext = createContext<AlertContextType | null>(null);

export const AlertProvider = ({ children } : {children: ReactNode}) => {
    const [visible, setVisible] = useState(false);
    const [alertText, setalertText] = useState('');
    const [important, setImportant] = useState(false);
    const [addAction, setAddAction] = useState<(() => void) | null>(null);

    const showAlert: showAlertType = (text, options = {}) => {
        setalertText(text);
        setImportant(options.important ?? false);
        setAddAction(() => options.addAction ?? null);
        setVisible(true);
    };

    const hideAlert = () => {
        setVisible(false);
        addAction?.();
        setTimeout(() => {
            setalertText('');
            setImportant(false);
            setAddAction(null);
        }, 300);
    };


    return (
        <AlertContext.Provider value={{
            alertText,
            visible,
            important,
            addAction,
            showAlert,
            hideAlert
        }}>
            {children}
        </AlertContext.Provider>
    );
};

export const useAlert = () => {
    const context = useContext(AlertContext);
    if (!context) {
        throw new Error('useAlert debe usarse dentro de AlertProvider');
    }
    return context;
};