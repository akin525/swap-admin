"use client";

import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Sun, Moon } from 'lucide-react';
import { useTheme } from "next-themes";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const router = useRouter();

    useEffect(() => setMounted(true), []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.push('/dashboard/dashboard');
    };

    if (!mounted) return null;

    const logoSrc = "/logo.png";

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground px-4 transition-colors duration-300">

            {/* Theme Toggle */}
            <div className="absolute top-8 right-8">
                <button
                    type="button"
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:ring-2 hover:ring-brand/50 transition-all"
                >
                    {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
                </button>
            </div>

            {/* Logo Section - Reduced vertical space */}
            <div className="flex flex-col items-center -mb-10"> {/* Negative margin to pull text up */}
                <div className="relative w-52 h-52">
                    <Image
                        src={logoSrc}
                        alt="Swappay Logo"
                        fill
                        className="object-contain"
                        priority
                    />
                </div>
            </div>

            {/* Header Section - Removed large mb-8 */}
            <div className="text-center mb-6">
                <h1 className="text-2xl font-bold">Get's started.</h1>
            </div>

            {/* Login Card */}
            <div className="w-full max-w-md bg-card text-card-foreground border border-border p-8 rounded-2xl shadow-xl dark:shadow-none transition-all">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium mb-2 opacity-80">Email</label>
                        <input
                            type="email"
                            required
                            placeholder="uistore@gmail.com"
                            className="w-full px-4 py-3 rounded-xl border border-border bg-transparent focus:ring-2 focus:ring-brand focus:border-transparent outline-none transition-all text-foreground"
                        />
                    </div>

                    <div className="relative">
                        <label className="block text-sm font-medium mb-2 opacity-80">Password</label>
                        <input
                            type={showPassword ? "text" : "password"}
                            required
                            placeholder="**********"
                            className="w-full px-4 py-3 rounded-xl border border-border bg-transparent focus:ring-2 focus:ring-brand focus:border-transparent outline-none transition-all text-foreground"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-[42px] text-slate-400 hover:text-brand transition-colors"
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                        <label className="flex items-center gap-2 text-slate-500 cursor-pointer">
                            <input type="checkbox" className="w-4 h-4 rounded border-border bg-transparent text-brand focus:ring-brand" />
                            Remember me
                        </label>
                        <Link href="/forgot-password" title="reset password" className="text-brand font-medium hover:underline">
                            Forgot your password?
                        </Link>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-brand hover:brightness-110 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-brand/20 active:scale-[0.98]"
                    >
                        Sign in
                    </button>
                </form>
            </div>
        </div>
    );
}