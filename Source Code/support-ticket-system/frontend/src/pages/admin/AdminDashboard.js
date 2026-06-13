import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import API from '../../api/axios';

export default function AdminDashboard() {
    const [tickets, setTickets] = useState([]);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        // Fetch Admin Tickets safely checking unwrapped layers
        API.get('/admin/tickets')
            .then(res => {
                console.log("Admin Tickets RAW Response:", res);
                const cleanTickets = res?.data?.data || res?.data || res;
                setTickets(Array.isArray(cleanTickets) ? cleanTickets : []);
            })
            .catch(err => console.error("Error loading admin tickets queue:", err));

        // Fetch Admin Users safely checking unwrapped layers
        API.get('/admin/users')
            .then(res => {
                console.log("Admin Users RAW Response:", res);
                const cleanUsers = res?.data?.data || res?.data || res;
                setUsers(Array.isArray(cleanUsers) ? cleanUsers : []);
            })
            .catch(err => console.error("Error loading admin users database queue:", err));
    }, []);

    const stats = [
        { label: 'Total Tickets', value: tickets.length,
            color: '#2563eb', bg: '#eff6ff' },
        { label: 'Open',
            value: tickets.filter(t => t.status === 'OPEN').length,
            color: '#ea580c', bg: '#fff7ed' },
        { label: 'In Progress',
            value: tickets.filter(t => t.status === 'IN_PROGRESS').length,
            color: '#ca8a04', bg: '#fefce8' },
        { label: 'Total Users', value: users.length,
            color: '#7c3aed', bg: '#faf5ff' },
    ];

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc' }}>
            <Sidebar />
            <div style={{ flex: 1, padding: '32px' }}>
                <h1 style={{ margin: '0 0 8px', color: '#1e293b' }}>
                    Admin Dashboard ⚡
                </h1>
                <p style={{ color: '#64748b', marginBottom: '28px' }}>
                    System overview
                </p>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: '16px', marginBottom: '32px'
                }}>
                    {stats.map(({ label, value, color, bg }) => (
                        <div key={label} style={{
                            background: bg, borderRadius: '12px',
                            padding: '24px',
                            border: `1px solid ${color}20`
                        }}>
                            <div style={{ fontSize: '32px', fontWeight: '700', color }}>
                                {value}
                            </div>
                            <div style={{ color: '#64748b', fontSize: '14px', marginTop: '4px' }}>
                                {label}
                            </div>
                        </div>
                    ))}
                </div>

                <div style={{
                    background: 'white', borderRadius: '12px',
                    padding: '24px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                }}>
                    <h3 style={{ margin: '0 0 16px', color: '#1e293b' }}>
                        Recent Tickets
                    </h3>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                        <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                            {['ID','Title','User','Status', 'Priority'].map(h => (
                                <th key={h} style={{
                                    textAlign: 'left', padding: '8px 12px',
                                    color: '#64748b', fontSize: '13px', fontWeight: '600'
                                }}>{h}</th>
                            ))}
                        </tr>
                        </thead>
                        <tbody>
                        {tickets.length === 0 ? (
                            <tr>
                                <td colSpan={5} style={{ padding: '24px', textAlign: 'center', color: '#94a3b8', fontSize: '14px' }}>
                                    No active system tickets found.
                                </td>
                            </tr>
                        ) : (
                            tickets.slice(0, 8).map(t => (
                                <tr key={t.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                    <td style={{ padding: '10px 12px', color: '#64748b', fontSize: '13px' }}>
                                        #{t.id}
                                    </td>
                                    <td style={{ padding: '10px 12px', fontWeight: '500', color: '#1e293b' }}>
                                        {t.title}
                                    </td>
                                    <td style={{ padding: '10px 12px', fontSize: '13px', color: '#475569' }}>
                                        {t.createdBy?.fullName || t.user?.fullName || 'System'}
                                    </td>
                                    <td style={{ padding: '10px 12px', fontSize: '13px', color: '#475569' }}>
                                        {t.status ? t.status.replace('_',' ') : 'OPEN'}
                                    </td>
                                    <td style={{ padding: '10px 12px', fontSize: '13px', color: '#475569' }}>
                                        {t.priority}
                                    </td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}