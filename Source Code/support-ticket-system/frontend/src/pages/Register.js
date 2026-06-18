import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';

export default function Register() {
    const [form, setForm] = useState({ fullName: '', email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleRegistrationError = (errObj) => {
        console.dir(errObj);

        // Extracting status codes and messages across raw payloads or infrastructure catch blocks
        const responseStatus = errObj?.status || errObj?.response?.status || errObj?.data?.status;
        const backendMessage = errObj?.message || errObj?.response?.data?.message || errObj?.data?.message;

        // Fallback checks for stringified errors or validation duplicates
        const isDuplicateString = JSON.stringify(errObj)?.toLowerCase().includes('exist') ||
            JSON.stringify(errObj)?.includes('409');

        if (responseStatus === 409 || isDuplicateString) {
            setError('This email address is already registered. Try logging in instead!');
        } else if (backendMessage) {
            setError(backendMessage);
        } else {
            setError('Registration failed. Please try again later.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Your custom wrapper returns the raw parsed JSON response directly (jsonData)
            const res = await API.post('/auth/register', form);
            console.log('API Response received:', res);

            // Access the properties directly without using an extra '.data' layer
            const token = res?.token || res?.data?.token || res?.accessToken;
            const userData = res?.user || res?.data?.user || res;

            if (token) {
                login(userData, token);
                navigate('/dashboard');
            } else {
                // Handle structural anomalies or 200 responses that are missing fields
                console.error("Payload missing token properties:", res);
                setError('Account created, but a valid session token was not found. Please log in manually.');
            }
        } catch (err) {
            // Catches infrastructure failures or explicit rejections thrown by fetch
            handleRegistrationError(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh', background: 'linear-gradient(135deg, #1e293b, #0f172a)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
            <div style={{
                background: 'white', borderRadius: '12px', padding: '40px',
                width: '100%', maxWidth: '420px', boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <div style={{ fontSize: '40px' }}>🎫</div>
                    <h2 style={{ margin: '8px 0 4px', color: '#1e293b' }}>Create Account</h2>
                    <p style={{ color: '#64748b', margin: 0 }}>Join TicketPro today</p>
                </div>

                {error && (
                    <div style={{
                        background: '#fef2f2', border: '1px solid #fca5a5',
                        color: '#dc2626', padding: '12px', borderRadius: '8px', marginBottom: '16px'
                    }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    {[
                        { label: 'Full Name', name: 'fullName', type: 'text', placeholder: 'Enter your Full name' },
                        { label: 'Email', name: 'email', type: 'email', placeholder: 'Enter your email' },
                        { label: 'Password', name: 'password', type: 'password', placeholder: 'Enter your password' }
                    ].map(({ label, name, type, placeholder }) => (
                        <div key={name} style={{ marginBottom: '16px' }}>
                            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#374151' }}>
                                {label}
                            </label>

                            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                                <input
                                    type={name === 'password' ? (showPassword ? 'text' : 'password') : type}
                                    placeholder={placeholder}
                                    value={form[name]}
                                    onChange={e => setForm({ ...form, [name]: e.target.value })}
                                    required
                                    minLength={name === 'password' ? 6 : undefined}
                                    style={{
                                        width: '100%',
                                        padding: '10px 12px',
                                        paddingRight: name === 'password' ? '40px' : '12px',
                                        border: '1px solid #d1d5db',
                                        borderRadius: '8px',
                                        fontSize: '14px',
                                        boxSizing: 'border-box'
                                    }}
                                />

                                {name === 'password' && (
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        style={{
                                            position: 'absolute',
                                            right: '12px',
                                            background: 'none',
                                            border: 'none',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            padding: 0,
                                            color: '#64748b'
                                        }}
                                    >
                                        {showPassword ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: '20px', height: '20px' }}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                                            </svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: '20px', height: '20px' }}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                            </svg>
                                        )}
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}

                    <button type="submit" disabled={loading} style={{
                        width: '100%', padding: '12px', background: '#7c3aed',
                        color: 'white', border: 'none', borderRadius: '8px',
                        fontSize: '15px', fontWeight: '600', cursor: 'pointer', marginTop: '8px'
                    }}>
                        {loading ? 'Creating Account...' : 'Create Account'}
                    </button>
                </form>

                <p style={{ textAlign: 'center', marginTop: '20px', color: '#64748b' }}>
                    Already have an account? <Link to="/login" style={{ color: '#7c3aed' }}>Sign in</Link>
                </p>
            </div>
        </div>
    );
}