"use client";

import React, { useEffect, useState, useMemo } from 'react';
import { Search, Bell, Menu, Calendar, ChevronDown } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface HeaderProps {
    onOpenSidebar: () => void;
}

export default function Header({ onOpenSidebar }: HeaderProps) {
    const { user } = useAuth();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const { formattedDate, greeting } = useMemo(() => {
        if (!mounted) return { formattedDate: "", greeting: "" };

        const now = new Date();
        const hour = now.getHours();

        let greet = "Good Evening";
        if (hour < 12) greet = "Good Morning";
        else if (hour < 18) greet = "Good Afternoon";

        const dateStr = new Intl.DateTimeFormat('en-GB', {
            weekday: 'short',
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        }).format(now);

        return { formattedDate: dateStr, greeting: greet };
    }, [mounted]);

    const firstName = user?.name?.split(' ')[0] || 'User';
    // Use a generic avatar that looks good in both modes
    const avatarUrl = user?.image || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.name || 'User'}`;

    if (!mounted) {
        return (
            <header className="mb-8 flex flex-col gap-6 md:flex-row md:items-center md:justify-between animate-pulse">
                <div className="h-14 w-64 bg-gray-200 dark:bg-gray-800 rounded-xl" />
                <div className="h-12 w-full md:w-96 bg-gray-200 dark:bg-gray-800 rounded-xl" />
            </header>
        );
    }

    return (
        <header className="mb-8 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            {/* Left Section */}
            <div className="flex items-center gap-4">
                <button
                    onClick={onOpenSidebar}
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 dark:border-gray-800 dark:bg-[#13131F] dark:text-gray-400 dark:hover:bg-gray-800 md:hidden"
                >
                    <Menu size={20} />
                </button>

                <div className="flex flex-col">
                    {/* Dark Mode Text: dark:text-white */}
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                        {greeting}, {firstName} 👋
                    </h1>
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-50 text-[#7C5CFF] dark:bg-indigo-500/10 dark:text-indigo-400">
                            <Calendar size={13} />
                        </div>
                        <span>{formattedDate}</span>
                    </div>
                </div>
            </div>

            {/* Right Section */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center">

                {/* Search Bar */}
                <div className="relative w-full md:w-80 group">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <Search className="h-4 w-4 text-gray-400 group-focus-within:text-[#7C5CFF] dark:text-gray-500 dark:group-focus-within:text-[#7C5CFF]" />
                    </div>
                    {/* Dark Mode Input: dark:bg-[#13131F] dark:border-gray-800 dark:text-white */}
                    <input
                        type="search"
                        placeholder="Search..."
                        className="
                            block w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition-all
                            placeholder:text-gray-400 text-gray-900
                            focus:border-[#7C5CFF] focus:ring-4 focus:ring-[#7C5CFF]/10

                            dark:bg-[#13131F]
                            dark:border-gray-800
                            dark:text-white
                            dark:placeholder:text-gray-500
                            dark:focus:border-[#7C5CFF]
                            dark:focus:ring-[#7C5CFF]/20
                        "
                    />
                </div>

                <div className="flex items-center justify-end gap-3">
                    {/* Bell Button */}
                    <button className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 dark:border-gray-800 dark:bg-[#13131F] dark:text-gray-400 dark:hover:bg-gray-800">
                        <Bell size={20} />
                        <span className="absolute right-3 top-3 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-[#13131F]" />
                    </button>

                    {/* Profile Button */}
                    <button className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-1 pr-3 hover:bg-gray-50 dark:border-gray-800 dark:bg-[#13131F] dark:hover:bg-gray-800 transition-colors">
                        <img
                            src={avatarUrl}
                            alt="Profile"
                            className="h-9 w-9 rounded-lg object-cover ring-2 ring-white dark:ring-[#0B0B15]"
                        />
                        <div className="hidden flex-col items-start md:flex">
                            <span className="text-xs font-bold text-gray-900 dark:text-white">
                                {firstName}
                            </span>
                            <span className="text-[10px] font-medium text-gray-500 dark:text-gray-400">
                                Admin
                            </span>
                        </div>
                        <ChevronDown size={14} className="hidden text-gray-400 dark:text-gray-500 md:block" />
                    </button>
                </div>
            </div>
        </header>
    );
}