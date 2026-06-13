import React, { createContext, useState,
    useEffect, useContext } from 'react';
import { BrowserRouter, Routes, Route,
    Navigate } from 'react-router-dom';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import MyTickets from './pages/MyTickets';
import CreateTicket from './pages/CreateTicket';
import TicketDetail from './pages/TicketDetail';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminTickets from './pages/admin/AdminTickets';
import AdminUsers from './pages/admin/AdminUsers';

// ============================================
// AUTH CONTEXT
// ============================================
export const AuthContext = createContext(null);

export function useAuth() {
    return useContext(AuthContext);
}

function AuthProvider({ children }) {
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
            localStorage.clear();
        }
        setLoading(false);
    }, []);

    const login = (userData, token) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user',
            JSON.stringify(userData));
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        // Force full page reload to reset everything
        window.location.href = '/login';
    };

    const isAdmin = () => {
        return user?.role === 'ROLE_ADMIN';
    };

    return (
        <AuthContext.Provider value={{
            user, login, logout,
            isAdmin, loading
        }}>
            {children}
        </AuthContext.Provider>
    );
}

function ProtectedRoute({ children, adminOnly }) {
    const { user, loading, isAdmin } = useAuth();

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh'
            }}>
                <p>Loading...</p>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (adminOnly && !isAdmin()) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
}

export default function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/"
                           element={
                               <Navigate to="/login" replace />
                           }
                    />
                    <Route path="/login"
                           element={<Login />}
                    />
                    <Route path="/register"
                           element={<Register />}
                    />
                    <Route path="/dashboard"
                           element={
                               <ProtectedRoute>
                                   <Dashboard />
                               </ProtectedRoute>
                           }
                    />
                    <Route path="/tickets"
                           element={
                               <ProtectedRoute>
                                   <MyTickets />
                               </ProtectedRoute>
                           }
                    />
                    <Route path="/tickets/new"
                           element={
                               <ProtectedRoute>
                                   <CreateTicket />
                               </ProtectedRoute>
                           }
                    />
                    <Route path="/tickets/:id"
                           element={
                               <ProtectedRoute>
                                   <TicketDetail />
                               </ProtectedRoute>
                           }
                    />
                    <Route path="/admin"
                           element={
                               <ProtectedRoute adminOnly>
                                   <AdminDashboard />
                               </ProtectedRoute>
                           }
                    />
                    <Route path="/admin/tickets"
                           element={
                               <ProtectedRoute adminOnly>
                                   <AdminTickets />
                               </ProtectedRoute>
                           }
                    />
                    <Route path="/admin/users"
                           element={
                               <ProtectedRoute adminOnly>
                                   <AdminUsers />
                               </ProtectedRoute>
                           }
                    />
                    <Route path="*"
                           element={
                               <Navigate to="/login" replace />
                           }
                    />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}