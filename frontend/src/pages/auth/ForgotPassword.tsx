// src/pages/auth/ForgotPassword.tsx
import React, { useState } from 'react';
import { forgotPassword } from '../../utils/apiService';
import { Link } from 'react-router-dom';

export function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');
        try {
            const data = await forgotPassword(email);
            setMessage(data.message);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen flex items-center justify-center">
            <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
                <h2 className="text-2xl font-bold text-center text-gray-900 mb-4">Forgot Password</h2>
                <p className="text-center text-gray-600 mb-6">Enter your email and we'll send you a reset link.</p>
                <form onSubmit={handleSubmit}>
                    {/* ... (form JSX with inputs for email and a submit button) ... */}
                    {/* ... (display message or error states) ... */}
                </form>
            </div>
        </div>
    );
}