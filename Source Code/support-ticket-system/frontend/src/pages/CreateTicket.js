import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import API from '../api/axios';

export default function CreateTicket() {
    const [form, setForm] = useState({
        title: '', description: '', priority: 'MEDIUM'
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await API.post('/tickets', form);

            // Log the structure to verify exactly how it looks
            console.log("Ticket creation response object structure:", res);

            // Redirect directly to your main tickets portal table/list view
            // This prevents the blank screen issue entirely!
            navigate('/tickets');

        } catch (err) {
            console.dir(err);
            setError(err.response?.data?.message || 'Failed to create ticket');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc' }}>
            <Sidebar />
            <div style={{ flex: 1, padding: '32px' }}>
                <h1 style={{ color: '#1e293b', marginBottom: '8px' }}>
                    Create New Ticket
                </h1>
                <p style={{ color: '#64748b', marginBottom: '32px' }}>
                    Describe your issue and we'll get it resolved
                </p>

                <div style={{
                    background: 'white', borderRadius: '12px',
                    padding: '32px', maxWidth: '680px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                }}>
                    {error && (
                        <div style={{
                            background: '#fef2f2',
                            border: '1px solid #fca5a5',
                            color: '#dc2626', padding: '12px',
                            borderRadius: '8px', marginBottom: '20px',
                            fontSize: '14px'
                        }}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{
                                display: 'block', fontWeight: '500',
                                marginBottom: '6px', color: '#374151',
                                fontSize: '14px'
                            }}>
                                Title *
                            </label>
                            <input
                                value={form.title}
                                onChange={e => setForm({
                                    ...form, title: e.target.value
                                })}
                                required
                                placeholder="Brief summary of the issue"
                                style={{
                                    width: '100%', padding: '10px 12px',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '8px',
                                    boxSizing: 'border-box',
                                    fontSize: '14px'
                                }}
                            />
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <label style={{
                                display: 'block', fontWeight: '500',
                                marginBottom: '6px', color: '#374151',
                                fontSize: '14px'
                            }}>
                                Priority *
                            </label>
                            <select
                                value={form.priority}
                                onChange={e => setForm({
                                    ...form, priority: e.target.value
                                })}
                                style={{
                                    width: '100%', padding: '10px 12px',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '8px',
                                    boxSizing: 'border-box',
                                    fontSize: '14px',
                                    background: 'white'
                                }}
                            >
                                {['LOW','MEDIUM','HIGH','CRITICAL']
                                    .map(p => (
                                        <option key={p} value={p}>{p}</option>
                                    ))}
                            </select>
                        </div>

                        <div style={{ marginBottom: '24px' }}>
                            <label style={{
                                display: 'block', fontWeight: '500',
                                marginBottom: '6px', color: '#374151',
                                fontSize: '14px'
                            }}>
                                Description *
                            </label>
                            <textarea
                                value={form.description}
                                onChange={e => setForm({
                                    ...form, description: e.target.value
                                })}
                                required rows={6}
                                placeholder="Provide detailed information..."
                                style={{
                                    width: '100%', padding: '10px 12px',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '8px',
                                    boxSizing: 'border-box',
                                    fontSize: '14px', resize: 'vertical'
                                }}
                            />
                        </div>

                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button type="submit" disabled={loading}
                                    style={{
                                        padding: '12px 24px',
                                        background: loading
                                            ? '#93c5fd' : '#2563eb',
                                        color: 'white', border: 'none',
                                        borderRadius: '8px', cursor: 'pointer',
                                        fontWeight: '600', fontSize: '15px'
                                    }}>
                                {loading ? 'Creating...' : '🎫 Create Ticket'}
                            </button>
                            <button type="button"
                                    onClick={() => navigate('/tickets')}
                                    style={{
                                        padding: '12px 24px',
                                        background: '#f1f5f9',
                                        color: '#475569', border: 'none',
                                        borderRadius: '8px', cursor: 'pointer',
                                        fontSize: '15px'
                                    }}>
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}