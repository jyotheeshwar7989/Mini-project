import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

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
// Protects internal private routes
// ============================================
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
                <p style={{
                    fontFamily: 'sans-serif',
                    color: '#64748b'
                }}>
                    Loading Session...
                </p>
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

// ============================================
// Shields public auth routes from logged-in sessions
// ============================================
function PublicRoute({ children }) {
    const { user, loading, isAdmin } = useAuth();

    if (loading) return null;

    if (user) {
        return (
            <Navigate
                to={isAdmin() ? '/admin' : '/dashboard'}
                replace
            />
        );
    }

    return children;
}

// ============================================
// Route tree (lives inside AuthProvider so
// useAuth works correctly)
// ============================================
function AppContent() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Root Redirect */}
                <Route
                    path="/"
                    element={<Navigate to="/login" replace />}
                />

                {/* Public Auth Gateway */}
                <Route
                    path="/login"
                    element={
                        <PublicRoute>
                            <Login />
                        </PublicRoute>
                    }
                />
                <Route
                    path="/register"
                    element={
                        <PublicRoute>
                            <Register />
                        </PublicRoute>
                    }
                />

                {/* Secure Private Spaces */}
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/tickets"
                    element={
                        <ProtectedRoute>
                            <MyTickets />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/tickets/new"
                    element={
                        <ProtectedRoute>
                            <CreateTicket />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/tickets/:id"
                    element={
                        <ProtectedRoute>
                            <TicketDetail />
                        </ProtectedRoute>
                    }
                />

                {/* Admin Restricted Zones */}
                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute adminOnly>
                            <AdminDashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/tickets"
                    element={
                        <ProtectedRoute adminOnly>
                            <AdminTickets />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/users"
                    element={
                        <ProtectedRoute adminOnly>
                            <AdminUsers />
                        </ProtectedRoute>
                    }
                />

                {/* Fallback Guard */}
                <Route
                    path="*"
                    element={<Navigate to="/login" replace />}
                />
            </Routes>
        </BrowserRouter>
    );
}

// ============================================
// Main Entry — injects Auth state at the top
// ============================================
export default function App() {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
}