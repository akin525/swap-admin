"use client";

import React from 'react';

interface StatProps {
    label: string;
    value: string;
    change: string;
    icon: React.ReactNode;
    isPositive: boolean;
}

export function StatCard({ label, value, change, icon, isPositive }: StatProps) {
    return (
        <div className="bg-card p-6 rounded-[2rem] border border-border shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none flex flex-col justify-between h-full">
            <div className="flex items-center gap-4 mb-4">
                {/* Soft icon background */}
                <div className="p-4 bg-brand/10 text-brand rounded-2xl">
                    {icon}
                </div>
                <div className="flex flex-col">
                    <p className="text-slate-400 text-sm font-medium">{label}</p>
                    <h3 className="text-3xl font-bold tracking-tight">{value}</h3>
                </div>
            </div>

            {/* Growth Pill */}
            <div className={`flex items-center gap-1 w-fit px-3 py-1 rounded-full text-xs font-bold ${
                isPositive ? 'text-emerald-500 bg-emerald-500/10' : 'text-rose-500 bg-rose-500/10'
            }`}>
                <span className="text-lg leading-none">{isPositive ? '↗' : '↘'}</span>
                {change}
            </div>
        </div>
    );
}