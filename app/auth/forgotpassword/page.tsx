"use client";

import React from 'react';
import Link from 'next/link';

export default function ForgotPassword() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-white font-sans text-[#1A1A1A]">
            {/* Branding & Header */}
            <div className="mb-8 text-center">
                <div className="flex items-center justify-center gap-2 mb-8">
                    {/* Swappay Logo Icon */}
                    <div className="bg-black p-2 rounded-lg">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M7 11L17 11M7 11L12 6M7 11L12 16" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </div>
                    <span className="text-2xl font-bold tracking-tight">Conerpulse </span>
                </div>

                <h1 className="text-3xl font-bold mb-2">Forget password</h1>
                <p className="text-gray-400 text-sm">
                    Remember password? <Link href="/login" className="text-[#7C5CFF] font-medium hover:underline">Sign in</Link>
                </p>
            </div>

            {/* Form Card */}
            <div className="w-full max-w-[440px] border border-gray-100 rounded-2xl p-10 shadow-sm">
                <form className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700">Email</label>
                        <input
                            type="email"
                            placeholder="example@gmail.com"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#7C5CFF] focus:ring-1 focus:ring-[#7C5CFF] outline-none transition-all placeholder:text-gray-300"
                            required
                        />
                    </div>

                    <div className="flex items-center gap-2 py-1">
                        <input type="checkbox" id="remember" className="w-4 h-4 rounded border-gray-300 text-[#7C5CFF] focus:ring-[#7C5CFF]" />
                        <label htmlFor="remember" className="text-sm text-gray-400 cursor-pointer">Remember me</label>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-[#8B6EFE] hover:bg-[#7C5CFF] text-white font-bold py-4 rounded-xl shadow-lg shadow-[#7C5CFF]/20 transition-all active:scale-[0.98]"
                    >
                        Reset Password
                    </button>
                </form>
            </div>
        </div>
    );
}