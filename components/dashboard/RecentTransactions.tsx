"use client";

import React from 'react';
import Link from 'next/link';
import { ExternalLink, MoreVertical } from 'lucide-react';

interface Transaction {
    id: string;
    user: string;
    desc: string;
    action: string;
    amount: string;
    date: string;
    status: string;
}

export default function RecentTransactions({ transactions }: { transactions: Transaction[] }) {
    // Helper to style status badges
    const getStatusStyles = (status: string) => {
        const s = status.toLowerCase();
        if (s === 'completed') return 'bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400';
        if (s === 'pending') return 'bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400';
        return 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400';
    };

    return (
        <div className="bg-white dark:bg-[#13131F] rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden transition-colors duration-300">
            {/* Header Area */}
            <div className="p-6 border-b border-gray-50 dark:border-gray-800/50 flex justify-between items-center">
                <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">Recent Transactions</h3>
                    <p className="text-xs text-gray-400 mt-0.5">Real-time update of latest activities</p>
                </div>
                <Link
                    href="/dashboard/transactions"
                    className="flex items-center gap-1.5 text-xs font-bold text-[#7C5CFF] hover:bg-indigo-50 dark:hover:bg-indigo-500/10 px-3 py-2 rounded-xl transition-all"
                >
                    View All
                    <ExternalLink size={14} />
                </Link>
            </div>

            {/* Table Area */}
            <div className="overflow-x-auto">
                <table className="w-full text-left min-w-[800px] border-separate border-spacing-0">
                    <thead className="bg-gray-50/50 dark:bg-white/5 text-gray-400 dark:text-gray-500 text-[10px] uppercase font-bold tracking-widest">
                    <tr>
                        <th className="px-6 py-4 border-b border-gray-50 dark:border-gray-800">ID</th>
                        <th className="px-6 py-4 border-b border-gray-50 dark:border-gray-800">Customer</th>
                        <th className="px-6 py-4 border-b border-gray-50 dark:border-gray-800">Description</th>
                        <th className="px-6 py-4 border-b border-gray-50 dark:border-gray-800">Amount</th>
                        <th className="px-6 py-4 border-b border-gray-50 dark:border-gray-800">Status</th>
                        <th className="px-6 py-4 border-b border-gray-50 dark:border-gray-800">Date</th>
                        <th className="px-6 py-4 border-b border-gray-50 dark:border-gray-800 text-center">Action</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 dark:divide-gray-800/50">
                    {transactions.length > 0 ? (
                        transactions.map((tx, i) => (
                            <tr key={i} className="group hover:bg-gray-50/80 dark:hover:bg-white/[0.02] transition-colors">
                                <td className="px-6 py-4 text-xs font-bold text-[#7C5CFF]">{tx.id}</td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-gray-900 dark:text-gray-200">{tx.user}</span>
                                        <span className="text-[10px] text-gray-400">{tx.action}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-xs text-gray-500 dark:text-gray-400 max-w-[180px] truncate">
                                        {tx.desc}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-sm font-bold text-gray-900 dark:text-white">{tx.amount}</span>
                                </td>
                                <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-tight ${getStatusStyles(tx.status)}`}>
                                            {tx.status}
                                        </span>
                                </td>
                                <td className="px-6 py-4 text-xs text-gray-400 dark:text-gray-500">
                                    {tx.date}
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <button className="inline-flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 px-3 py-1.5 rounded-xl text-[10px] font-bold hover:bg-[#0E0627] hover:text-white dark:hover:bg-indigo-600 dark:hover:text-white transition-all shadow-sm active:scale-95">
                                        Details
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={7} className="px-6 py-12 text-center">
                                <div className="flex flex-col items-center gap-2">
                                    <p className="text-sm font-medium text-gray-400">No recent transactions found.</p>
                                    <p className="text-xs text-gray-300 dark:text-gray-600">New activities will appear here.</p>
                                </div>
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>

            {/* Footer Pagination Link */}
            <div className="p-4 bg-gray-50/30 dark:bg-white/5 border-t border-gray-50 dark:border-gray-800 flex justify-center">
                <Link href="/dashboard/transaction" className="text-[11px] font-bold text-gray-400 hover:text-[#7C5CFF] uppercase tracking-widest transition-colors">
                    Browse All Records
                </Link>
            </div>
        </div>
    );
}