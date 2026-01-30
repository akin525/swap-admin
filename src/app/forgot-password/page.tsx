"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from "next-themes";

export default function ForgotPasswordPage() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // Prevent hydration mismatch
    useEffect(() => setMounted(true), []);

    if (!mounted) return null;

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground px-4 transition-colors duration-300">

            {/* Theme Toggle Button */}
            <div className="absolute top-8 right-8">
                <button
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    aria-label="Toggle Theme"
                    className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:ring-2 hover:ring-brand/50 transition-all border border-transparent dark:border-slate-700"
                >
                    {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
                </button>
            </div>

            {/* Logo Section */}
            <div className="flex items-center gap-2 mb-8">
                <div className="w-10 h-10 bg-slate-900 dark:bg-white rounded-lg flex items-center justify-center transition-colors">
                    <div className="w-6 h-4 border-2 border-white dark:border-black rounded-sm transform -skew-x-12" />
                </div>
                <span className="text-3xl font-bold tracking-tight">Swappay</span>
            </div>

            <div className="text-center mb-8">
                <h1 className="text-2xl font-bold mb-2">Forget password</h1>
                <p className="text-slate-500 dark:text-slate-400">
                    Remember password? <Link href="/login" className="text-brand font-medium hover:underline">Sign in</Link>
                </p>
            </div>

            {/* Reset Card - Using CSS variables for full mode support */}
            <div className="w-full max-w-md bg-card text-card-foreground border border-border p-8 rounded-2xl shadow-xl dark:shadow-none transition-all">
                <form className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium mb-2 opacity-80">Email</label>
                        <input
                            type="email"
                            placeholder="example@gmail.com"
                            className="w-full px-4 py-3 rounded-xl border border-border bg-transparent text-foreground focus:ring-2 focus:ring-brand focus:border-transparent outline-none transition-all"
                            required
                        />
                    </div>

                    <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 cursor-pointer">
                        <input
                            type="checkbox"
                            className="w-4 h-4 rounded border-border bg-transparent text-brand focus:ring-brand transition-all"
                        />
                        <span>Remember me</span>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-brand hover:brightness-110 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-brand/20 active:scale-[0.98]"
                    >
                        Reset Password
                    </button>
                </form>
            </div>
        </div>
    );
}