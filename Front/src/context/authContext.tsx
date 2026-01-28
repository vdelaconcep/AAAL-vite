import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

interface UserDataType {
    id: string
    name: string
    email: string
    token: string
}

interface AuthState {
    isAdminLoggedIn: boolean
    adminUser: UserDataType | null;
}

interface AuthContextType extends AuthState {
    login: (userData: UserDataType) => void;
    logout: () => void;
    checkAuthStatus: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [authState, setAuthState] = useState<AuthState>({
    isAdminLoggedIn: false,
    adminUser: null,
    });

    useEffect(() => {
        checkAuthStatus();
    }, []);

    const checkAuthStatus = () => {
        try {
        const storedAuth = localStorage.getItem('adminAuth');
        if (storedAuth) {
            const parsedAuth = JSON.parse(storedAuth);
            setAuthState({
                isAdminLoggedIn: true,
                adminUser: parsedAuth,
            });
        }
        } catch (error) {
            console.error('Error al verificar estado de autenticación:', error);
            logout();
        }
    };

    const login = (userData: UserDataType) => {
        setAuthState({
            isAdminLoggedIn: true,
            adminUser: userData,
        });
    localStorage.setItem('adminAuth', JSON.stringify(userData));
    };

    const logout = () => {
    setAuthState({
        isAdminLoggedIn: false,
        adminUser: null,
    });
    localStorage.removeItem('adminAuth');
    };

    const value: AuthContextType = {
        ...authState,
        login,
        logout,
        checkAuthStatus,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth debe ser usado dentro de un AuthProvider');
    }
    return context;
};