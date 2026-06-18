import React, { createContext, useState,
    useEffect, useContext } from 'react';

// Initialize context cleanly in its own space
export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        try {
            const u = localStorage.getItem('user');
            const t = localStorage.getItem('token');
            if (u && t) {
                setUser(JSON.parse(u));
            }
        } catch(e) {
            console.error("Session restoration error:", e);
            localStorage.clear();
        } finally {
            setLoading(false);
        }
    }, []);

    const login = (userData, token) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        window.location.href = '/login';
    };

    const isAdmin = () => {
        return user?.role === 'ROLE_ADMIN';
    };

    return (
        <AuthContext.Provider value={{
            user, login, logout, isAdmin, loading
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}

// Standalone helpers for non-component files like axios.js
export function getToken() {
    return localStorage.getItem('token');
}

export function clearAuth() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
}