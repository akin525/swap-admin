"use client";

import React, { useState, useEffect } from 'react';
import { Search, Bell, ChevronDown, Sun, Moon } from 'lucide-react';
import { useTheme } from "next-themes";

export default function Navbar() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // Prevent hydration mismatch
    useEffect(() => setMounted(true), []);

    return (
        <header className="h-20 border-b border-border bg-card text-card-foreground px-8 flex items-center justify-between transition-colors duration-300">

            {/* Left: Dynamic Greeting */}
            <div className="hidden md:block">
                <h2 className="text-xl font-bold">Hello John</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">6.45 pm 19 Mar 2022</p>
            </div>

            {/* Center: Search Bar */}
            {/*<div className="flex-1 max-w-xl px-8">*/}
            {/*    <div className="relative group">*/}
            {/*        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand transition-colors" size={18} />*/}
            {/*        <input*/}
            {/*            type="text"*/}
            {/*            placeholder="Search or type"*/}
            {/*            className="w-full bg-white dark:bg-white border border-border rounded-xl py-3 pl-12 pr-4 text-sm outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all"*/}
            {/*        />*/}
            {/*    </div>*/}
            {/*</div>*/}

            {/* Right: Actions, Theme Toggle & Profile */}
            <div className="flex items-center gap-4">
                {/* Theme Toggle Button */}
                <button
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    className="p-2.5 rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                    aria-label="Toggle Theme"
                >
                    {mounted && (theme === "dark" ? <Sun size={20} /> : <Moon size={20} />)}
                </button>

                {/* Notifications */}
                <button className="relative p-2.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                    <Bell size={22} />
                    <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 border-2 border-white dark:border-slate-900 rounded-full"></span>
                </button>

                {/* Profile Section */}
                <div className="flex items-center gap-3 pl-4 border-l border-border cursor-pointer group">
                    <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-border shadow-sm">
                        {/* Placeholder for Profile Image */}
                        <div className="w-full h-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-[10px] text-slate-500">
                            JD
                        </div>
                    </div>
                    <div className="hidden lg:block text-right">
                        <p className="text-sm font-semibold leading-tight">John Doe</p>
                        <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Admin</p>
                    </div>
                    <ChevronDown size={16} className="text-slate-400 group-hover:text-brand transition-colors" />
                </div>
            </div>
        </header>
    );
}