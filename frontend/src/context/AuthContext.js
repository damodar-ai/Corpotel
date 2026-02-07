import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useState, useEffect } from 'react';
import { authService } from '../services';
export const AuthContext = createContext(undefined);
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        // Load from localStorage on mount
        const savedToken = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');
        if (savedToken && savedUser) {
            setToken(savedToken);
            setUser(JSON.parse(savedUser));
        }
        setIsLoading(false);
    }, []);
    const updateUser = (userData) => {
        setUser((prev) => {
            if (!prev)
                return null;
            const updated = { ...prev, ...userData };
            localStorage.setItem('user', JSON.stringify(updated));
            return updated;
        });
    };
    const login = async (email, password) => {
        const response = await authService.login(email, password);
        const { token: newToken, user: newUser } = response.data;
        setToken(newToken);
        setUser(newUser);
        localStorage.setItem('token', newToken);
        localStorage.setItem('user', JSON.stringify(newUser));
    };
    const getGoogleAuthUrl = async () => {
        try {
            const response = await authService.getGoogleAuthUrl();
            return response.data.authUrl;
        }
        catch (error) {
            throw error;
        }
    };
    const loginWithGoogle = async (code) => {
        try {
            const response = await authService.loginWithGoogle(code);
            const { token: newToken, user: newUser } = response.data;
            setToken(newToken);
            setUser(newUser);
            localStorage.setItem('token', newToken);
            localStorage.setItem('user', JSON.stringify(newUser));
        }
        catch (error) {
            throw error;
        }
    };
    const register = async (email, password, firstName, lastName) => {
        const response = await authService.register(email, password, firstName, lastName);
        const { token: newToken, user: newUser } = response.data;
        setToken(newToken);
        setUser(newUser);
        localStorage.setItem('token', newToken);
        localStorage.setItem('user', JSON.stringify(newUser));
    };
    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        authService.logout();
    };
    return (_jsx(AuthContext.Provider, { value: { user, token, login, loginWithGoogle, getGoogleAuthUrl, register, updateUser, logout, isAuthenticated: !!token, isLoading }, children: children }));
};
