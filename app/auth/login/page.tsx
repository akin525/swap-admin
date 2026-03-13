"use client";

import React, { useState } from 'react';
import { Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'react-hot-toast'; // 1. Import toast

export default function LoginPage() {
    const { login } = useAuth();

    const [formData, setFormData] = useState({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.type === 'email' ? 'email' : 'password']: e.target.value });
        if (errorMessage) setErrorMessage(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMessage(null);

        // 2. Add a loading toast (optional, but nice)
        const toastId = toast.loading('Authenticating...');

        try {
            // Use environment variable with fallback
            const API_URL = process.env.NEXT_PUBLIC_API_URL;

            const response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                    device_name: 'web_dashboard'
                }),
            });

            const data = await response.json();

            if (data.success) {
                // 3. Success Toast & Dismiss Loader
                toast.dismiss(toastId);
                toast.success('Welcome back! Redirecting...');

                // Perform login action
                login(data.token, data.admin);
            } else {
                // 4. Error Toast (Invalid Credentials)
                toast.dismiss(toastId);
                const msg = data.message || 'Invalid credentials. Please try again.';
                setErrorMessage(msg);
                toast.error(msg);
            }

        } catch (error) {
            // 5. Network Error Toast
            toast.dismiss(toastId);
            const msg = 'Network error. Please check your connection.';
            setErrorMessage(msg);
            toast.error(msg);
            console.error('Login error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-white font-sans">
            {/* Header Section */}
            <div className="mb-10 text-center">
                <div className="flex items-center justify-center gap-2 mb-6">
                    <div className="bg-black p-2 rounded-lg">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M7 11L17 11M7 11L12 6M7 11L12 16"/>
                        </svg>
                    </div>
                    <span className="text-2xl font-bold tracking-tight text-gray-900">Conerpulse </span>
                </div>

                <h1 className="text-3xl font-bold mb-2 text-gray-900">Get started.</h1>
                <p className="text-gray-500 text-sm">
                    Don't have an account? <a href="#" className="text-[#7C5CFF] font-medium hover:underline">Sign up</a>
                </p>
            </div>

            {/* Login Form Card */}
            <div className="w-full max-w-[420px] border border-gray-100 rounded-2xl p-8 shadow-sm">

                {/* Error Alert Box (Kept as a visual fallback) */}
                {errorMessage && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
                        <AlertCircle className="text-red-500 shrink-0" size={20} />
                        <p className="text-sm text-red-600 font-medium">{errorMessage}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700">Email</label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="admin@Conerpulse .com"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#7C5CFF] focus:ring-1 focus:ring-[#7C5CFF] outline-none transition-all text-gray-900"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={formData.password}
                                onChange={handleChange}
                                required
                                placeholder="••••••••"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#7C5CFF] focus:ring-1 focus:ring-[#7C5CFF] outline-none transition-all text-gray-900"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center justify-between text-sm py-1">
                        <label className="flex items-center gap-2 cursor-pointer text-gray-400 select-none">
                            <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[#7C5CFF] focus:ring-[#7C5CFF]" />
                            Remember me
                        </label>
                        <a href="#" className="text-[#7C5CFF] font-semibold hover:underline">
                            Forgot your password?
                        </a>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-[#7C5CFF] hover:bg-[#6A4DED] disabled:bg-[#7C5CFF]/70 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl transition-all shadow-md active:scale-[0.99] flex items-center justify-center gap-2"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 size={20} className="animate-spin" />
                                Signing in...
                            </>
                        ) : (
                            "Sign in"
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}