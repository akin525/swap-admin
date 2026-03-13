"use client";

import React from 'react';
import { Users, ShieldCheck, Repeat, CreditCard, Activity, TrendingUp, TrendingDown } from 'lucide-react';

interface StatItem {
    title: string;
    value: string;
    trend: string;
    color: string; // e.g., "bg-blue-50 text-blue-500"
    icon: string;
}

// 1. Map icon strings to React Components
const ICON_MAP: Record<string, React.ReactNode> = {
    'users': <Users size={22} />,
    'monitor': <Activity size={22} />,
    'shield': <ShieldCheck size={22} />,
    'repeat': <Repeat size={22} />,
    'credit-card': <CreditCard size={22} />,
};

// 2. Helper to get Dark Mode colors based on the API's light mode class
// This prevents "bg-blue-50" from looking blindingly white in dark mode
const getThemeColors = (apiColorString: string) => {
    if (apiColorString.includes('blue')) return {
        light: 'bg-blue-50 text-blue-600',
        dark: 'dark:bg-blue-500/10 dark:text-blue-400'
    };
    if (apiColorString.includes('indigo')) return {
        light: 'bg-indigo-50 text-indigo-600',
        dark: 'dark:bg-indigo-500/10 dark:text-indigo-400'
    };
    if (apiColorString.includes('purple')) return {
        light: 'bg-purple-50 text-purple-600',
        dark: 'dark:bg-purple-500/10 dark:text-purple-400'
    };
    if (apiColorString.includes('green')) return {
        light: 'bg-green-50 text-green-600',
        dark: 'dark:bg-green-500/10 dark:text-green-400'
    };
    // Fallback
    return {
        light: 'bg-gray-50 text-gray-600',
        dark: 'dark:bg-gray-800 dark:text-gray-400'
    };
};

export default function StatsGrid({ stats }: { stats: StatItem[] }) {
    if (!stats || stats.length === 0) return null;

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 md:gap-6">
            {stats.map((stat, index) => {
                const isPositive = stat.trend.startsWith('+');
                const TrendIcon = isPositive ? TrendingUp : TrendingDown;
                const themeColors = getThemeColors(stat.color);

                return (
                    <div
                        key={index}
                        className="group relative flex flex-col justify-between rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:shadow-md dark:border-gray-800 dark:bg-[#13131F]"
                    >
                        <div className="flex items-start justify-between mb-4">
                            {/* Icon Container with dynamic dark mode support */}
                            <div className={`flex h-12 w-12 items-center justify-center rounded-xl transition-transform group-hover:scale-110 ${themeColors.light} ${themeColors.dark}`}>
                                {ICON_MAP[stat.icon] || <Users size={22}/>}
                            </div>

                            {/* Trend Badge */}
                            <div className={`flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-bold ${
                                isPositive
                                    ? 'bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400'
                                    : 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400'
                            }`}>
                                <TrendIcon size={12} />
                                <span>{stat.trend}</span>
                            </div>
                        </div>

                        <div>
                            <p className="mb-1 text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                                {stat.title}
                            </p>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                {stat.value}
                            </h2>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}