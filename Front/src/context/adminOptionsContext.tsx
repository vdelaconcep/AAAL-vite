
import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

type AdminOptionsContextType = {
    showList: boolean;
    setShowList: (show: boolean) => void;
    toggleList: () => void;
};

const AdminOptionsContext = createContext<AdminOptionsContextType | null>(null);

export const useAdminOptions = () => {
    const context = useContext(AdminOptionsContext);
    if (!context) {
    throw new Error('useAdminOptions debe usarse dentro de AdminOptionsProvider');
    }
    return context;
};

export const AdminOptionsProvider = ({ children }: { children: ReactNode }) => {
    const [showList, setShowList] = useState(false);

    const toggleList = () => setShowList(prev => !prev);

    return (
        <AdminOptionsContext.Provider value={{ showList, setShowList, toggleList }}>
        {children}
        </AdminOptionsContext.Provider>
    );
};