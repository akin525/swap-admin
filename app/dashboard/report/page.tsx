"use client";

import React from 'react';
import {
    Search,
    Filter,
    Download,
    CreditCard,
    Activity,
    AlertCircle,
    CheckCircle2,
    Lock,
    MoreVertical
} from 'lucide-react';

export default function VirtualCardsPage() {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">

            {/* 1. Page Title & Actions */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                        Virtual Cards
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Manage issuance, freezing, and analytics for virtual cards.
                    </p>
                </div>
                <div className="flex gap-3">
                    <button className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:bg-[#13131F] dark:text-gray-300 dark:hover:bg-white/5">
                        <Filter size={16} />
                        Filter
                    </button>
                    <button className="inline-flex items-center gap-2 rounded-xl bg-[#7C5CFF] px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-indigo-500/20 hover:bg-[#6b4ce6] transition-all">
                        <CreditCard size={16} />
                        Issue New Card
                    </button>
                </div>
            </div>

            {/* 2. Stats Overview */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="Active Cards"
                    value="1,234"
                    trend="+12%"
                    icon={<CheckCircle2 size={20} />}
                    color="bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400"
                />
                <StatCard
                    title="Total Spending"
                    value="$125.4K"
                    trend="+8.2%"
                    icon={<Activity size={20} />}
                    color="bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400"
                />
                <StatCard
                    title="Blocked / Frozen"
                    value="12"
                    trend="-2%"
                    icon={<Lock size={20} />}
                    color="bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400"
                />
                <StatCard
                    title="Monthly Revenue"
                    value="$3.2K"
                    trend="+15%"
                    icon={<CreditCard size={20} />}
                    color="bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400"
                />
            </div>

            {/* 3. Main Card List Table */}
            <div className="rounded-3xl border border-gray-100 bg-white shadow-sm dark:border-gray-800 dark:bg-[#13131F]">
                {/* Table Header */}
                <div className="flex flex-col gap-4 border-b border-gray-100 p-6 dark:border-gray-800 sm:flex-row sm:items-center sm:justify-between">
                    <h3 className="font-bold text-gray-900 dark:text-white">All Virtual Cards</h3>

                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search cardholder..."
                            className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2 pl-10 pr-4 text-sm outline-none focus:border-[#7C5CFF] focus:ring-2 focus:ring-[#7C5CFF]/10 dark:border-gray-700 dark:bg-gray-800/50 dark:text-white dark:placeholder-gray-500"
                        />
                    </div>
                </div>

                {/* Table Content */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50/50 text-gray-400 dark:bg-white/5 dark:text-gray-500">
                        <tr>
                            <th className="px-6 py-4 font-bold uppercase tracking-wider text-[11px]">Card Details</th>
                            <th className="px-6 py-4 font-bold uppercase tracking-wider text-[11px]">Cardholder</th>
                            <th className="px-6 py-4 font-bold uppercase tracking-wider text-[11px]">Balance</th>
                            <th className="px-6 py-4 font-bold uppercase tracking-wider text-[11px]">Spent (30d)</th>
                            <th className="px-6 py-4 font-bold uppercase tracking-wider text-[11px]">Status</th>
                            <th className="px-6 py-4 text-right font-bold uppercase tracking-wider text-[11px]">Action</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                        <CardRow cardLast4="4532" type="Visa" user="John Doe" balance="$250.00" spend="$1,200" status="Active" />
                        <CardRow cardLast4="7834" type="Mastercard" user="Sarah Wilson" balance="$100.50" spend="$450" status="Active" />
                        <CardRow cardLast4="9012" type="Visa" user="Mike Johnson" balance="$450.00" spend="$150" status="Frozen" />
                        <CardRow cardLast4="5678" type="Mastercard" user="Anna Smith" balance="$0.00" spend="$3,800" status="Blocked" />
                        <CardRow cardLast4="5089" type="Visa" user="David Brown" balance="$500.00" spend="$890" status="Active" />
                        </tbody>
                    </table>
                </div>

                {/* Pagination Footer */}
                <div className="flex items-center justify-between border-t border-gray-100 p-4 dark:border-gray-800">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Showing 1-5 of 1,234 cards</p>
                    <div className="flex gap-2">
                        <button className="rounded-lg border border-gray-200 px-3 py-1 text-xs font-medium hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800">Previous</button>
                        <button className="rounded-lg border border-gray-200 px-3 py-1 text-xs font-medium hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800">Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// --- Sub-Components ---

function StatCard({ title, value, trend, icon, color }: any) {
    const isPositive = trend.startsWith('+');
    return (
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:shadow-md dark:border-gray-800 dark:bg-[#13131F]">
            <div className="flex items-start justify-between">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${color}`}>
                    {icon}
                </div>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${isPositive ? 'bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400'}`}>
                    {trend}
                </span>
            </div>
            <div className="mt-3">
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">{title}</p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{value}</h3>
            </div>
        </div>
    );
}

function CardRow({ cardLast4, type, user, balance, spend, status }: any) {
    const statusStyles = {
        Active: 'bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400',
        Frozen: 'bg-orange-50 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400',
        Blocked: 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400'
    };

    return (
        <tr className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors">
            <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                    <div className="flex h-8 w-12 items-center justify-center rounded bg-gray-100 text-[10px] font-bold text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                        {type}
                    </div>
                    <div>
                        <p className="text-sm font-bold text-gray-900 dark:text-white">•••• {cardLast4}</p>
                        <p className="text-[10px] text-gray-500">Exp 12/28</p>
                    </div>
                </div>
            </td>
            <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-[10px] font-bold text-indigo-600 dark:text-indigo-400">
                        {user.charAt(0)}
                    </div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{user}</span>
                </div>
            </td>
            <td className="px-6 py-4 font-mono text-sm font-medium text-gray-600 dark:text-gray-400">{balance}</td>
            <td className="px-6 py-4 font-mono text-sm font-medium text-gray-600 dark:text-gray-400">{spend}</td>
            <td className="px-6 py-4">
                <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${statusStyles[status as keyof typeof statusStyles]}`}>
                    <span className="h-1.5 w-1.5 rounded-full bg-current" />
                    {status}
                </span>
            </td>
            <td className="px-6 py-4 text-right">
                <button className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-white">
                    <MoreVertical size={16} />
                </button>
            </td>
        </tr>
    );
}