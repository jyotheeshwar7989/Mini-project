import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import API from '../api/axios';

export default function MyTickets() {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('ALL');

    useEffect(() => {
        API.get('/tickets/my-tickets')
            .then(res => {
                console.log("Raw Tickets List Response:", res);

                // Unpack variables safely based on Axios data layer unwrapping
                const cleanList = res?.data?.data || res?.data || res;

                // Double check if the output is an array before setting it to state
                setTickets(Array.isArray(cleanList) ? cleanList : []);
            })
            .catch(err => {
                console.error("Failed to load tickets list:", err);
            })
            .finally(() => setLoading(false));
    }, []);

    const statusColor = {
        OPEN: '#3b82f6', IN_PROGRESS: '#f59e0b',
        RESOLVED: '#10b981', CLOSED: '#6b7280'
    };
    const priorityColor = {
        LOW: '#6b7280', MEDIUM: '#3b82f6',
        HIGH: '#f59e0b', CRITICAL: '#ef4444'
    };

    const filtered = filter === 'ALL'
        ? tickets
        : tickets.filter(t => t.status === filter);

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc' }}>
            <Sidebar />
            <div style={{ flex: 1, padding: '32px' }}>
                <div style={{
                    display: 'flex', justifyContent: 'space-between',
                    alignItems: 'center', marginBottom: '24px'
                }}>
                    <div>
                        <h1 style={{ margin: 0, color: '#1e293b' }}>
                            My Tickets
                        </h1>
                        <p style={{ color: '#64748b', marginTop: '4px' }}>
                            {tickets.length} ticket(s) total
                        </p>
                    </div>
                    <Link to="/tickets/new" style={{
                        padding: '10px 20px', background: '#2563eb',
                        color: 'white', borderRadius: '8px',
                        textDecoration: 'none', fontWeight: '500'
                    }}>
                        + New Ticket
                    </Link>
                </div>

                {/* Filter Buttons */}
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
                            {s.replace('_', ' ')}
                        </button>
                    ))}
                </div>

                <div style={{
                    background: 'white', borderRadius: '12px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    overflow: 'hidden'
                }}>
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '60px', color: '#64748b' }}>
                            Loading tickets...
                        </div>
                    ) : filtered.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '60px', color: '#64748b' }}>
                            <div style={{ fontSize: '48px', marginBottom: '12px' }}>🎫</div>
                            <p>No tickets found.{' '}
                                <Link to="/tickets/new">
                                    Create one!
                                </Link>
                            </p>
                        </div>
                    ) : (
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead style={{ background: '#f8fafc' }}>
                            <tr>
                                {['ID','Title','Status','Priority','Created','Actions'].map(h => (
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
                                    <td style={{ padding: '14px 16px', color: '#64748b', fontSize: '13px' }}>
                                        #{ticket.id}
                                    </td>
                                    <td style={{ padding: '14px 16px', fontWeight: '500', color: '#1e293b' }}>
                                        {ticket.title}
                                    </td>
                                    <td style={{ padding: '14px 16px' }}>
                                            <span style={{
                                                padding: '3px 10px', borderRadius: '12px',
                                                fontSize: '12px', fontWeight: '500',
                                                background: `${statusColor[ticket.status]}20`,
                                                color: statusColor[ticket.status]
                                            }}>
                                                {ticket.status?.replace('_',' ')}
                                            </span>
                                    </td>
                                    <td style={{ padding: '14px 16px' }}>
                                            <span style={{
                                                padding: '3px 10px', borderRadius: '12px',
                                                fontSize: '12px', fontWeight: '500',
                                                background: `${priorityColor[ticket.priority]}20`,
                                                color: priorityColor[ticket.priority]
                                            }}>
                                                {ticket.priority}
                                            </span>
                                    </td>
                                    <td style={{ padding: '14px 16px', color: '#64748b', fontSize: '13px' }}>
                                        {ticket.createdAt ? new Date(ticket.createdAt).toLocaleDateString() : 'N/A'}
                                    </td>
                                    <td style={{ padding: '14px 16px' }}>
                                        <Link to={`/tickets/${ticket.id}`}
                                              style={{
                                                  padding: '6px 12px', background: '#eff6ff',
                                                  color: '#2563eb', borderRadius: '6px',
                                                  textDecoration: 'none', fontSize: '13px'
                                              }}>
                                            View
                                        </Link>
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