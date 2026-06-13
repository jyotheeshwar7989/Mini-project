import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../App';
import API from '../api/axios';

export default function Dashboard() {
    const { user } = useAuth();
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        API.get('/tickets/my-tickets')
            .then(res => {
                console.log("User Dashboard RAW Response:", res);

                // Safely extract payload records independently of axios interceptor layer unwrapping
                const cleanList = res?.data?.data || res?.data || res;
                setTickets(Array.isArray(cleanList) ? cleanList : []);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const statusColor = {
        OPEN: '#3b82f6',
        IN_PROGRESS: '#f59e0b',
        RESOLVED: '#10b981',
        CLOSED: '#6b7280'
    };
    const priorityColor = {
        LOW: '#6b7280',
        MEDIUM: '#3b82f6',
        HIGH: '#f59e0b',
        CRITICAL: '#ef4444'
    };

    const stats = [
        { label: 'Total Tickets', value: tickets.length,
            bg: '#eff6ff', color: '#2563eb' },
        { label: 'Open',
            value: tickets.filter(t => t.status === 'OPEN').length,
            bg: '#fff7ed', color: '#ea580c' },
        { label: 'In Progress',
            value: tickets.filter(t => t.status === 'IN_PROGRESS').length,
            bg: '#fefce8', color: '#ca8a04' },
        { label: 'Resolved',
            value: tickets.filter(t => t.status === 'RESOLVED').length,
            bg: '#f0fdf4', color: '#16a34a' },
    ];

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc' }}>
            <Sidebar />
            <div style={{ flex: 1, padding: '32px', overflow: 'auto' }}>
                <div style={{ marginBottom: '32px' }}>
                    <h1 style={{ margin: 0, color: '#1e293b', fontSize: '28px' }}>
                        Welcome back, {user?.fullName || 'User'}! 👋
                    </h1>
                    <p style={{ color: '#64748b', marginTop: '4px' }}>
                        Here's your ticket overview
                    </p>
                </div>

                {/* Stats */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: '16px', marginBottom: '32px'
                }}>
                    {stats.map(({ label, value, bg, color }) => (
                        <div key={label} style={{
                            background: bg, borderRadius: '12px',
                            padding: '24px',
                            border: `1px solid ${color}20`
                        }}>
                            <div style={{ fontSize: '32px', fontWeight: '700', color }}>
                                {value}
                            </div>
                            <div style={{ color: '#64748b', marginTop: '4px', fontSize: '14px' }}>
                                {label}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Recent Tickets */}
                <div style={{
                    background: 'white', borderRadius: '12px',
                    padding: '24px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                }}>
                    <div style={{
                        display: 'flex', justifyContent: 'space-between',
                        alignItems: 'center', marginBottom: '20px'
                    }}>
                        <h3 style={{ margin: 0, color: '#1e293b' }}>
                            Recent Tickets
                        </h3>
                        <Link to="/tickets/new" style={{
                            padding: '8px 16px', background: '#2563eb',
                            color: 'white', borderRadius: '8px',
                            textDecoration: 'none', fontSize: '14px',
                            fontWeight: '500'
                        }}>
                            + New Ticket
                        </Link>
                    </div>

                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                            Loading overview...
                        </div>
                    ) : tickets.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                            <div style={{ fontSize: '48px', marginBottom: '12px' }}>🎫</div>
                            <p style={{ margin: '0 0 12px' }}>No tickets yet.</p>
                            <Link to="/tickets/new" style={{ color: '#2563eb', fontWeight: '500' }}>
                                Create your first ticket
                            </Link>
                        </div>
                    ) : (
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                            <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                                {['ID','Title','Status','Priority','Created'].map(h => (
                                    <th key={h} style={{
                                        textAlign: 'left', padding: '10px 12px',
                                        color: '#64748b', fontSize: '13px', fontWeight: '600'
                                    }}>{h}</th>
                                ))}
                            </tr>
                            </thead>
                            <tbody>
                            {tickets.slice(0, 5).map(ticket => (
                                <tr key={ticket.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                    <td style={{ padding: '12px', color: '#64748b', fontSize: '13px' }}>
                                        #{ticket.id}
                                    </td>
                                    <td style={{ padding: '12px' }}>
                                        <Link to={`/tickets/${ticket.id}`}
                                              style={{ color: '#2563eb', textDecoration: 'none', fontWeight: '500' }}>
                                            {ticket.title}
                                        </Link>
                                    </td>
                                    <td style={{ padding: '12px' }}>
                                            <span style={{
                                                padding: '3px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: '500',
                                                background: `${statusColor[ticket.status] || '#6b7280'}20`,
                                                color: statusColor[ticket.status] || '#6b7280'
                                            }}>
                                                {ticket.status ? ticket.status.replace('_', ' ') : 'OPEN'}
                                            </span>
                                    </td>
                                    <td style={{ padding: '12px' }}>
                                            <span style={{
                                                padding: '3px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: '500',
                                                background: `${priorityColor[ticket.priority] || '#3b82f6'}20`,
                                                color: priorityColor[ticket.priority] || '#3b82f6'
                                            }}>
                                                {ticket.priority}
                                            </span>
                                    </td>
                                    <td style={{ padding: '12px', color: '#64748b', fontSize: '13px' }}>
                                        {ticket.createdAt ? new Date(ticket.createdAt).toLocaleDateString() : 'N/A'}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}