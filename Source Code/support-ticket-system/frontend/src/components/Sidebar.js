import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../App';

export default function Sidebar() {
    const { user, logout, isAdmin } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        // Clear storage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Force full page reload
        window.location.href = '/login';
    };

    const navItems = [
        { to: '/dashboard', label: '📊 Dashboard' },
        { to: '/tickets', label: '🎫 My Tickets' },
        { to: '/tickets/new', label: '➕ New Ticket' },
        ...(isAdmin() ? [
            { to: '/admin', label: '⚡ Admin Panel' },
            { to: '/admin/tickets', label: '📋 All Tickets' },
            { to: '/admin/users', label: '👥 Manage Users' },
        ] : [])
    ];

    return (
        <div style={{
            width: '240px',
            minHeight: '100vh',
            background: '#1e293b',
            color: 'white',
            display: 'flex',
            flexDirection: 'column',
            flexShrink: 0
        }}>
            {/* Logo */}
            <div style={{
                padding: '24px 20px',
                borderBottom: '1px solid #334155'
            }}>
                <div style={{
                    fontSize: '20px',
                    fontWeight: '700',
                    color: '#60a5fa'
                }}>
                    🎫 TicketPro
                </div>
                <div style={{
                    fontSize: '12px',
                    color: '#94a3b8',
                    marginTop: '4px'
                }}>
                    {user?.fullName}
                </div>
                <span style={{
                    fontSize: '10px',
                    padding: '2px 8px',
                    background: isAdmin()
                        ? '#7c3aed' : '#0284c7',
                    borderRadius: '12px',
                    marginTop: '6px',
                    display: 'inline-block',
                    color: 'white'
                }}>
                    {isAdmin() ? 'Admin' : 'User'}
                </span>
            </div>

            {/* Nav Links */}
            <nav style={{
                padding: '12px 0',
                flex: 1
            }}>
                {navItems.map(({ to, label }) => (
                    <NavLink
                        key={to}
                        to={to}
                        style={({ isActive }) => ({
                            display: 'block',
                            padding: '10px 20px',
                            color: isActive
                                ? '#60a5fa' : '#94a3b8',
                            textDecoration: 'none',
                            background: isActive
                                ? '#0f172a' : 'transparent',
                            borderLeft: isActive
                                ? '3px solid #60a5fa'
                                : '3px solid transparent',
                            fontSize: '14px'
                        })}
                    >
                        {label}
                    </NavLink>
                ))}
            </nav>

            {/* Logout */}
            <div style={{
                padding: '16px 20px',
                borderTop: '1px solid #334155'
            }}>
                <button
                    onClick={handleLogout}
                    style={{
                        width: '100%',
                        padding: '10px',
                        background: '#dc2626',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontWeight: '500',
                        fontSize: '14px'
                    }}
                >
                    🚪 Logout
                </button>
            </div>
        </div>
    );
}