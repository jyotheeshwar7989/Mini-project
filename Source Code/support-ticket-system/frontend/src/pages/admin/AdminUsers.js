import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import API from '../../api/axios';

export default function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchUsers = () => {
        API.get('/admin/users')
            .then(r => setUsers(r.data.data || []))
            .finally(() => setLoading(false));
    };

    useEffect(() => { fetchUsers(); }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this user?')) return;
        await API.delete(`/admin/users/${id}`);
        fetchUsers();
    };

    const handleRoleChange = async (id, role) => {
        await API.put(`/admin/users/${id}/role?role=${role}`);
        fetchUsers();
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh',
            background: '#f8fafc' }}>
            <Sidebar />
            <div style={{ flex: 1, padding: '32px' }}>
                <h1 style={{ margin: '0 0 24px', color: '#1e293b' }}>
                    Manage Users ({users.length})
                </h1>

                <div style={{
                    background: 'white', borderRadius: '12px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    overflow: 'hidden'
                }}>
                    {loading ? (
                        <div style={{ textAlign: 'center',
                            padding: '60px' }}>
                            Loading...
                        </div>
                    ) : (
                        <table style={{ width: '100%',
                            borderCollapse: 'collapse' }}>
                            <thead style={{ background: '#f8fafc' }}>
                            <tr>
                                {['ID','Name','Email','Role',
                                    'Joined','Actions'].map(h => (
                                    <th key={h} style={{
                                        textAlign: 'left',
                                        padding: '12px 16px',
                                        color: '#64748b',
                                        fontSize: '13px',
                                        fontWeight: '600',
                                        borderBottom: '1px solid #e2e8f0'
                                    }}>{h}</th>
                                ))}
                            </tr>
                            </thead>
                            <tbody>
                            {users.map(user => (
                                <tr key={user.id} style={{
                                    borderBottom: '1px solid #f1f5f9'
                                }}>
                                    <td style={{ padding: '12px 16px',
                                        color: '#64748b',
                                        fontSize: '13px' }}>
                                        #{user.id}
                                    </td>
                                    <td style={{ padding: '12px 16px',
                                        fontWeight: '500' }}>
                                        {user.fullName}
                                    </td>
                                    <td style={{ padding: '12px 16px',
                                        color: '#475569',
                                        fontSize: '13px' }}>
                                        {user.email}
                                    </td>
                                    <td style={{ padding: '12px 16px' }}>
                                        <select
                                            value={user.role}
                                            onChange={e =>
                                                handleRoleChange(
                                                    user.id,
                                                    e.target.value)}
                                            style={{
                                                padding: '4px 8px',
                                                borderRadius: '6px',
                                                border: '1px solid #d1d5db',
                                                cursor: 'pointer',
                                                fontSize: '13px'
                                            }}>
                                            <option value="ROLE_USER">
                                                USER
                                            </option>
                                            <option value="ROLE_ADMIN">
                                                ADMIN
                                            </option>
                                        </select>
                                    </td>
                                    <td style={{ padding: '12px 16px',
                                        color: '#64748b',
                                        fontSize: '13px' }}>
                                        {user.createdAt
                                            ? new Date(user.createdAt)
                                                .toLocaleDateString()
                                            : '—'}
                                    </td>
                                    <td style={{ padding: '12px 16px' }}>
                                        <button
                                            onClick={() =>
                                                handleDelete(user.id)}
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