import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

type showConfirmType = (text: string, action:(() => void)) => void

interface ConfirmContextType {
    visible: boolean
    confirmText: string
    actionToConfirm: (() => void | Promise<void>) | null
    inProcess: boolean
    showConfirm: showConfirmType
    hideConfirm: () => void
    proceed: () => void
}

const ConfirmContext = createContext<ConfirmContextType | null>(null);

export const ConfirmProvider = ({ children } : {children: ReactNode}) => {
    const [visible, setVisible] = useState(false);
    const [confirmText, setConfirmText] = useState('');
    const [actionToConfirm, setActionToConfirm] = useState<(() => void | Promise<void>) | null>(null);
    const [inProcess, setInProcess] = useState(false);

    const showConfirm: showConfirmType = (text, action) => {
        setConfirmText(text);
        setActionToConfirm(() => action);
        setVisible(true);
    };

    const hideConfirm = () => {
        setVisible(false);
        setTimeout(() => {
            setConfirmText('');
            setActionToConfirm(null);
            setInProcess(false);
        }, 300);
    };

    const proceed = async () => {
        if (!actionToConfirm) return;
    
        setInProcess(true);
        try {
            await actionToConfirm();
        } finally {
            hideConfirm();
        }
    };

    return (
        <ConfirmContext.Provider value={{
            confirmText,
            visible,
            actionToConfirm,
            inProcess,
            showConfirm,
            hideConfirm,
            proceed
        }}>
            {children}
        </ConfirmContext.Provider>
    );
};

export const useConfirm = () => {
    const context = useContext(ConfirmContext);
    if (!context) {
        throw new Error('useConfirm debe usarse dentro de ConfirmProvider');
    }
    return context;
};