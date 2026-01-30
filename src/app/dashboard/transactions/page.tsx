"use client";

import React, { useState } from 'react';
import { Activity, CheckCircle2, AlertCircle, TrendingUp, Search, Filter } from 'lucide-react';
import { StatCard } from '@/components/dashboard/StatCard';
import { TransactionModal } from '@/components/modals/TransactionModal';

const transactions = [
    { id: "#5089", user: "John Doe", desc: "john receive ₦50,000 from Tolu", action: "Transfer NGN", amount: "₦50,000", date: "31 Mar 2025 10:45 AM" },
    { id: "#5090", user: "Sarah Wilson", desc: "john receive ₦50,000 from Tolu", action: "Deposit USD", amount: "$200", date: "31 Mar 2025 10:42 AM" },
];

export default function TransactionPage() {
    const [selectedTx, setSelectedTx] = useState<any>(null);

    return (
        <div className="space-y-8 bg-background min-h-screen transition-colors duration-300">
            {/* Top Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard label="Today's Volume" value="$2.4M" change="+15.3%" isPositive={true} icon={<TrendingUp size={20} />} />
                <StatCard label="Success rate" value="98.5%" change="-0.2%" isPositive={false} icon={<CheckCircle2 size={20} />} />
                <StatCard label="Failed Trans." value="23" change="+12%" isPositive={false} icon={<AlertCircle size={20} />} />
                <StatCard label="Revenue Today" value="5" change="+2%" isPositive={true} icon={<Activity size={20} />} />
            </div>

            {/* Corrected Transactions Monitoring Section */}
            <div className="bg-card border border-border p-8 rounded-[2rem] shadow-sm">
                <h3 className="font-bold text-xl mb-6">Transactions Monitoring</h3>
                <div className="space-y-6">
                    <MonitoringAlert
                        type="high"
                        title="Large transfer: $50,000 USD → Nigeria"
                        user="john@email.com"
                        metricLabel="Risk Score"
                        metricValue="85/100"
                        time="2 minutes ago"
                    />
                    <MonitoringAlert
                        type="medium"
                        title="Multiple card attempts from same IP"
                        user="john@email.com"
                        metricLabel="Attempts"
                        metricValue="5"
                        time="2 minutes ago"
                    />
                </div>
            </div>

            {/* Recent Transactions List */}
            <div className="bg-card border border-border rounded-[2rem] overflow-hidden shadow-sm">
                {/* ... (Search and Table headers) */}
                <div className="p-8 border-b border-border flex flex-col md:flex-row justify-between items-center gap-4">
                    <h3 className="font-bold text-xl">Recent Transactions</h3>
                    <div className="flex gap-3">
                        <div className="relative w-64">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input type="text" placeholder="Search Transaction" className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-border rounded-xl text-sm outline-none" />
                        </div>
                        <button className="px-5 py-3 border border-border rounded-xl text-sm font-medium flex items-center gap-2">Date <Filter size={16}/></button>
                    </div>
                </div>

                <table className="w-full text-left">
                    {/* ... (Keep your existing table body) */}
                    <thead className="text-slate-400 text-xs uppercase border-b border-border bg-slate-50/30 dark:bg-slate-800/20">
                    <tr>
                        <th className="px-8 py-5 font-semibold">ID</th>
                        <th className="px-8 py-5 font-semibold">User</th>
                        <th className="px-8 py-5 font-semibold">Description</th>
                        <th className="px-8 py-4 font-semibold">Action</th>
                        <th className="px-8 py-4 font-semibold">Amount</th>
                        <th className="px-8 py-4 font-semibold">Issued Date</th>
                        <th className="px-8 py-4 font-semibold text-center">Action</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                    {transactions.map((tx, i) => (
                        <tr key={i} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                            <td className="px-8 py-6 text-brand font-bold text-sm">{tx.id}</td>
                            <td className="px-8 py-6 font-semibold text-sm">{tx.user}</td>
                            <td className="px-8 py-6 text-slate-500 text-xs">{tx.desc}</td>
                            <td className="px-8 py-6 text-sm">{tx.action}</td>
                            <td className="px-8 py-6 font-bold text-sm">{tx.amount}</td>
                            <td className="px-8 py-6 text-slate-400 text-xs">{tx.date}</td>
                            <td className="px-8 py-6 text-center">
                                <button
                                    onClick={() => setSelectedTx(tx)}
                                    className="bg-slate-900 dark:bg-white text-white dark:text-black px-6 py-2 rounded-xl text-xs font-bold transition-all hover:scale-105"
                                >
                                    View
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {selectedTx && <TransactionModal transaction={selectedTx} onClose={() => setSelectedTx(null)} />}
        </div>
    );
}

function MonitoringAlert({ type, title, user, metricLabel, metricValue, time }: any) {
    const isHigh = type === 'high';

    return (
        <div className="flex flex-col md:flex-row items-center justify-between group transition-all">
            <div className="flex items-center gap-5 w-full">
                {/* Status Glow Dot */}
                <div className="relative">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isHigh ? 'bg-rose-100 dark:bg-rose-900/30' : 'bg-orange-100 dark:bg-orange-900/30'}`}>
                        <div className={`w-4 h-4 rounded-full shadow-sm ${isHigh ? 'bg-rose-500' : 'bg-orange-500'}`} />
                    </div>
                </div>

                <div className="flex-1">
                    <p className="text-base font-bold text-slate-900 dark:text-black leading-tight">{title}</p>
                    <p className="text-xs text-slate-500 mt-1">
                        User: <span className="font-medium dark:text-slate-300">{user}</span> | {metricLabel}: <span className="font-medium">{metricValue}</span>
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex gap-2">
                        {/* Primary Action Button (Review/Investigate) */}
                        <button className={`px-8 py-2.5 rounded-xl text-sm font-bold text-white shadow-md transition-all active:scale-95 ${isHigh ? 'bg-orange-500 hover:bg-orange-600' : 'bg-orange-400 hover:bg-orange-500'}`}>
                            {isHigh ? 'Review' : 'Investigate'}
                        </button>

                        {/* Secondary Action Button (Approve/Block) */}
                        <button className={`px-8 py-2.5 rounded-xl text-sm font-bold text-white shadow-md transition-all active:scale-95 ${isHigh ? 'bg-slate-900 dark:bg-slate-800' : 'bg-rose-500 hover:bg-rose-600'}`}>
                            {isHigh ? 'Approve' : 'Block IP'}
                        </button>
                    </div>
                    <span className="text-sm text-slate-400 font-medium min-w-[100px] text-right">{time}</span>
                </div>
            </div>
        </div>
    );
}