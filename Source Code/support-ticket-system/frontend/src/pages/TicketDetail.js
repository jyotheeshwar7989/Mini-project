import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import API from '../api/axios';

export default function TicketDetail() {
    const { id } = useParams();
    const [ticket, setTicket] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTicketDetails = async () => {
            try {
                const res = await API.get(`/tickets/${id}`);
                const cleanData = res?.data?.data || res?.data || res;
                setTicket(cleanData);
            } catch (err) {
                console.error("Error loading ticket detail payload:", err);
                setError('Failed to load ticket details.');
            } finally {
                setLoading(false);
            }
        };

        void fetchTicketDetails();
    }, [id]);

    const statusColor = {
        OPEN: '#3b82f6', IN_PROGRESS: '#f59e0b',
        RESOLVED: '#10b981', CLOSED: '#6b7280'
    };
    const priorityColor = {
        LOW: '#6b7280', MEDIUM: '#3b82f6',
        HIGH: '#f59e0b', CRITICAL: '#ef4444'
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc' }}>
                <Sidebar />
                <div style={{ flex: 1, padding: '32px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <h3 style={{ color: '#64748b' }}>Loading Ticket Details...</h3>
                </div>
            </div>
        );
    }

    if (error || !ticket) {
        return (
            <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc' }}>
                <Sidebar />
                <div style={{ flex: 1, padding: '32px' }}>
                    <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', color: '#dc2626', padding: '16px', borderRadius: '8px' }}>
                        {error || 'Ticket not found.'}
                    </div>
                    <button onClick={() => navigate('/tickets')} style={{ marginTop: '16px', padding: '10px 20px', cursor: 'pointer' }}>
                        Back to My Tickets
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc' }}>
            <Sidebar />
            <div style={{ flex: 1, padding: '32px' }}>
                <button onClick={() => navigate('/tickets')} style={{ background: 'none', border: 'none', color: '#2563eb', cursor: 'pointer', marginBottom: '16px', fontWeight: '500', fontSize: '14px' }}>
                    ← Back to My Tickets
                </button>

                <div style={{ background: 'white', borderRadius: '12px', padding: '32px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', maxWidth: '800px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid #e2e8f0', paddingBottom: '16px' }}>
                        <div>
                            <span style={{ fontSize: '12px', fontWeight: 'bold', background: '#e2e8f0', padding: '4px 8px', borderRadius: '4px', marginRight: '8px', color: '#475569' }}>
                                TICKET #{ticket.id}
                            </span>
                            <h1 style={{ color: '#1e293b', margin: '8px 0 0', fontSize: '24px' }}>{ticket.title}</h1>
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <span style={{
                                padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: '500',
                                background: `${statusColor[ticket.status] || '#6b7280'}20`, color: statusColor[ticket.status] || '#6b7280'
                            }}>
                                {ticket.status ? ticket.status.replace('_', ' ') : 'OPEN'}
                            </span>
                            <span style={{
                                padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: '500',
                                background: `${priorityColor[ticket.priority] || '#3b82f6'}20`, color: priorityColor[ticket.priority] || '#3b82f6'
                            }}>
                                {ticket.priority || 'MEDIUM'}
                            </span>
                        </div>
                    </div>

                    <div style={{ marginBottom: '24px' }}>
                        <h4 style={{ color: '#475569', marginBottom: '8px', fontSize: '14px' }}>Description</h4>
                        <p style={{ color: '#334155', background: '#f8fafc', padding: '16px', borderRadius: '8px', margin: 0, whiteSpace: 'pre-wrap', lineHeight: '1.6', fontSize: '14px' }}>
                            {ticket.description || 'No description provided.'}
                        </p>
                    </div>

                    <div style={{ color: '#94a3b8', fontSize: '12px' }}>
                        Created on: {ticket.createdAt ? new Date(ticket.createdAt).toLocaleString() : 'N/A'}
                    </div>
                </div>
            </div>
        </div>
    );
}