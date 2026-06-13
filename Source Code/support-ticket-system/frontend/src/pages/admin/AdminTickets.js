import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import API from '../../api/axios';

export default function AdminTickets() {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('ALL');

    const fetchTickets = () => {
        API.get('/admin/tickets')
            .then(res => {
                console.log("Admin All Tickets RAW Response:", res);

                // Safely unpack data regardless of interceptor unwrapping layer variations
                const cleanList = res?.data?.data || res?.data || res;
                setTickets(Array.isArray(cleanList) ? cleanList : []);
            })
            .catch(err => {
                console.error("Failed to load global admin tickets:", err);
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchTickets();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this ticket?')) return;
        try {
            await API.delete(`/admin/tickets/${id}`);
            fetchTickets();
        } catch (err) {
            console.error("Failed to delete ticket:", err);
            alert("Error deleting ticket. Check console for details.");
        }
    };

    const handleStatusChange = async (id, status) => {
        try {
            await API.put(`/admin/tickets/${id}`, { status });
            fetchTickets();
        } catch (err) {
            console.error("Failed to change status:", err);
            alert("Error updating status. Check console for details.");
        }
    };

    const statusColor = {
        OPEN: '#3b82f6', IN_PROGRESS: '#f59e0b',
        RESOLVED: '#10b981', CLOSED: '#6b7280'
    };

    const filtered = filter === 'ALL'
        ? tickets
        : tickets.filter(t => t.status === filter);

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc' }}>
            <Sidebar />
            <div style={{ flex: 1, padding: '32px' }}>
                <h1 style={{ margin: '0 0 20px', color: '#1e293b' }}>
                    All Tickets ({tickets.length})
                </h1>

                <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
                    {['ALL','OPEN','IN_PROGRESS', 'RESOLVED','CLOSED'].map(s => (
                        <button key={s} onClick={() => setFilter(s)}
                                style={{
                                    padding: '6px 14px',
                                    borderRadius: '20px', border: 'none',
                                    cursor: 'pointer',
                                    background: filter === s ? '#2563eb' : '#e2e8f0',
                                    color: filter === s ? 'white' : '#475569',
                                    fontSize: '13px', fontWeight: '500'
                                }}>
                            {s.replace('_',' ')}
                        </button>
                    ))}
                </div>

                <div style={{
                    background: 'white', borderRadius: '12px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden'
                }}>
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '60px', color: '#64748b' }}>
                            Loading...
                        </div>
                    ) : filtered.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '60px', color: '#64748b' }}>
                            <div style={{ fontSize: '48px', marginBottom: '12px' }}>🎫</div>
                            <p>No tickets found in the system matching this filter.</p>
                        </div>
                    ) : (
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead style={{ background: '#f8fafc' }}>
                            <tr>
                                {['ID','Title','User','Status', 'Priority','Actions'].map(h => (
                                    <th key={h} style={{
                                        textAlign: 'left', padding: '12px 16px',
                                        color: '#64748b', fontSize: '13px', fontWeight: '600',
                                        borderBottom: '1px solid #e2e8f0'
                                    }}>{h}</th>
                                ))}
                            </tr>
                            </thead>
                            <tbody>
                            {filtered.map(ticket => (
                                <tr key={ticket.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                    <td style={{ padding: '12px 16px', color: '#64748b', fontSize: '13px' }}>
                                        #{ticket.id}
                                    </td>
                                    <td style={{ padding: '12px 16px', fontWeight: '500' }}>
                                        <Link to={`/tickets/${ticket.id}`} style={{ color: '#2563eb', textDecoration: 'none' }}>
                                            {ticket.title}
                                        </Link>
                                    </td>
                                    <td style={{ padding: '12px 16px', fontSize: '13px', color: '#475569' }}>
                                        {ticket.createdBy?.fullName || ticket.user?.fullName || 'System User'}
                                    </td>
                                    <td style={{ padding: '12px 16px' }}>
                                        <select
                                            value={ticket.status}
                                            onChange={e => handleStatusChange(ticket.id, e.target.value)}
                                            style={{
                                                padding: '4px 8px',
                                                borderRadius: '6px',
                                                border: `1px solid ${statusColor[ticket.status] || '#6b7280'}`,
                                                color: statusColor[ticket.status] || '#6b7280',
                                                background: `${statusColor[ticket.status] || '#6b7280'}10`,
                                                cursor: 'pointer',
                                                fontSize: '13px'
                                            }}>
                                            {['OPEN','IN_PROGRESS', 'RESOLVED','CLOSED'].map(s => (
                                                <option key={s} value={s}>
                                                    {s.replace('_',' ')}
                                                </option>
                                            ))}
                                        </select>
                                    </td>
                                    <td style={{ padding: '12px 16px', fontSize: '13px', color: '#475569' }}>
                                        {ticket.priority}
                                    </td>
                                    <td style={{ padding: '12px 16px' }}>
                                        <button
                                            onClick={() => handleDelete(ticket.id)}
                                            style={{
                                                padding: '5px 12px',
                                                background: '#fef2f2',
                                                color: '#dc2626',
                                                border: '1px solid #fca5a5',
                                                borderRadius: '6px',
                                                cursor: 'pointer',
                                                fontSize: '13px'
                                            }}>
                                            Delete
                                        </button>
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