import { createContext, useContext } from 'react';

type RefetchContextType = {
    refetch: () => void;
};

const RefetchContext = createContext<RefetchContextType | null>(null);

export const useRefetch = () => {
    const context = useContext(RefetchContext);
    if (!context) throw new Error('useRefetch debe usarse dentro de RefetchProvider');
    return context;
};

export const RefetchProvider = ({ children, onRefetch }: { children: React.ReactNode, onRefetch: () => void }) => {
    return (
        <RefetchContext.Provider value={{ refetch: onRefetch }}>
        {children}
        </RefetchContext.Provider>
    );
};