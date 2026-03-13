"use client";

import React, { useState, useEffect, useCallback } from 'react';
import {
    Repeat, Search, Filter, ChevronDown, ChevronLeft, ChevronRight,
    AlertTriangle, CheckCircle2, Clock, X, ShieldAlert,
    ArrowUpRight, ArrowDownLeft, Loader2, Download, ExternalLink
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'react-hot-toast';

// --- Types ---
interface Transaction {
    id: number;
    reference: string;
    user: string;
    user_image: string;
    description: string;
    action: string;
    amount: string;
    currency: string;
    date: string;
    status: string;
    is_risky: boolean;
}

interface Meta {
    current_page: number;
    last_page: number;
    total: number;
    from: number;
    to: number;
}

// --- Components ---

const StatCard = ({ title, value, trend, color, isNegative }: { title: string, value: string, trend: string, color: string, isNegative?: boolean }) => (
    <div className="bg-white dark:bg-[#13131F] p-5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all group">
        <div className={`w-12 h-12 ${color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-sm`}>
            <Repeat size={22} className="text-current opacity-80" />
        </div>
        <p className="text-gray-400 dark:text-gray-500 text-[10px] md:text-xs mb-1 font-bold uppercase tracking-widest">{title}</p>
        <h2 className="text-2xl font-bold mb-1 text-gray-900 dark:text-white">{value}</h2>
        <div className={`flex items-center gap-1 text-[10px] font-bold ${isNegative ? 'text-red-500' : 'text-green-500'}`}>
            {isNegative ? <ArrowDownLeft size={12} /> : <ArrowUpRight size={12} />}
            {trend}
        </div>
    </div>
);

// --- Main Page ---

export default function TransactionsPage() {
    const { token } = useAuth();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState<Meta>({ current_page: 1, last_page: 1, total: 0, from: 0, to: 0 });
    const [selectedTxId, setSelectedTxId] = useState<number | null>(null);

    const fetchTransactions = useCallback(async () => {
        if (!token) return;
        setLoading(true);
        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL;
            const query = new URLSearchParams({ page: page.toString(), search }).toString();

            const res = await fetch(`${API_URL}/transactions?${query}`, {
                headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
            });
            const response = await res.json();

            if (response.success) {
                setTransactions(response.data);
                setPagination(response.meta);
            } else {
                toast.error("Failed to load transactions");
            }
        } catch (error) {
            toast.error("Network error");
        } finally {
            setLoading(false);
        }
    }, [token, page, search]);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => fetchTransactions(), 500);
        return () => clearTimeout(timer);
    }, [fetchTransactions]);

    return (
        <div className="space-y-6 md:space-y-8 pb-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Transactions</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Real-time monitoring of payments and transfers.</p>
                </div>
                <div className="flex gap-3">
                    <button className="px-4 py-2.5 bg-white dark:bg-[#13131F] border border-gray-200 dark:border-gray-800 rounded-xl text-xs font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 flex items-center gap-2 transition-colors">
                        <Filter size={16} /> Filters
                    </button>
                    <button className="px-4 py-2.5 bg-[#0E0627] dark:bg-indigo-600 text-white rounded-xl text-xs font-bold hover:opacity-90 transition-colors shadow-lg shadow-indigo-500/20 flex items-center gap-2">
                        <Download size={16} /> Export CSV
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                <StatCard title="Total Volume" value="$2.4M" trend="+15.3%" color="bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400" />
                <StatCard title="Success Rate" value="98.5%" trend="-0.2%" color="bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400" />
                <StatCard title="Failed Txns" value="23" trend="+12%" color="bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400" isNegative />
                <StatCard title="Avg. Value" value="$450" trend="+5.4%" color="bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400" />
            </div>

            {/* Risk Alert Banner */}
            <div className="bg-white dark:bg-[#13131F] rounded-2xl border border-red-100 dark:border-red-900/30 p-5 md:p-6 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-red-50 dark:bg-red-900/10 rounded-full -mr-16 -mt-32 opacity-50 pointer-events-none"></div>
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
                    <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center text-red-500 shrink-0 border border-red-100 dark:border-red-900/30">
                            <ShieldAlert size={20} />
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-bold text-gray-900 dark:text-white">Risk Alert: Large Transfer Detected</h3>
                                <span className="bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse">High Risk</span>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                Transaction <span className="font-mono font-bold">#TX-9823</span> of <span className="font-bold text-gray-900 dark:text-white">$50,000</span> flagged for review.
                            </p>
                        </div>
                    </div>
                    <button className="px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-red-500/20 transition-all flex items-center gap-2">
                        Review Now <ArrowUpRight size={14}/>
                    </button>
                </div>
            </div>

            {/* Main Table */}
            <div className="bg-white dark:bg-[#13131F] rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden flex flex-col min-h-[500px]">
                {/* Search Bar */}
                <div className="p-4 md:p-6 border-b border-gray-100 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search by ID, user, or amount..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-11 pr-4 py-2.5 bg-gray-50 dark:bg-[#0B0B15] border border-gray-200 dark:border-gray-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all dark:text-white dark:placeholder-gray-500"
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto w-full flex-1">
                    <table className="w-full text-left min-w-[900px]">
                        <thead className="bg-gray-50/50 dark:bg-white/5 text-gray-400 dark:text-gray-500 text-[10px] uppercase font-bold tracking-widest border-b border-gray-100 dark:border-gray-800">
                        <tr>
                            <th className="px-6 py-4">ID</th>
                            <th className="px-6 py-4">User</th>
                            <th className="px-6 py-4">Description</th>
                            <th className="px-6 py-4">Type</th>
                            <th className="px-6 py-4">Amount</th>
                            <th className="px-6 py-4">Date</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-center">Action</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {loading ? (
                            [...Array(5)].map((_, i) => (
                                <tr key={i}>
                                    <td className="px-6 py-4"><div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-12 animate-pulse" /></td>
                                    <td className="px-6 py-4"><div className="flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 animate-pulse" /><div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-24 animate-pulse" /></div></td>
                                    <td className="px-6 py-4"><div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-32 animate-pulse" /></td>
                                    <td className="px-6 py-4"><div className="h-6 bg-gray-100 dark:bg-gray-800 rounded w-16 animate-pulse" /></td>
                                    <td className="px-6 py-4"><div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-16 animate-pulse" /></td>
                                    <td className="px-6 py-4"><div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-20 animate-pulse" /></td>
                                    <td className="px-6 py-4"><div className="h-5 bg-gray-100 dark:bg-gray-800 rounded w-14 animate-pulse" /></td>
                                    <td className="px-6 py-4"><div className="h-8 bg-gray-100 dark:bg-gray-800 rounded w-16 animate-pulse mx-auto" /></td>
                                </tr>
                            ))
                        ) : transactions.length > 0 ? (
                            transactions.map((tx) => (
                                <tr key={tx.id} className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors group">
                                    <td className="px-6 py-4 text-xs font-bold text-indigo-500 dark:text-indigo-400">#{tx.id}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden border border-gray-200 dark:border-gray-700">
                                                <img src={tx.user_image} className="w-full h-full object-cover" alt="" />
                                            </div>
                                            <span className="text-sm font-bold text-gray-900 dark:text-gray-200">{tx.user}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-xs text-gray-500 dark:text-gray-400 truncate max-w-[180px]">{tx.description}</td>
                                    <td className="px-6 py-4">
                                            <span className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-2.5 py-1 rounded-lg text-[10px] font-bold border border-gray-200 dark:border-gray-700 uppercase tracking-wide">
                                                {tx.action}
                                            </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm font-bold text-gray-900 dark:text-white">{tx.currency} {tx.amount}</span>
                                    </td>
                                    <td className="px-6 py-4 text-xs text-gray-400 dark:text-gray-500 font-medium">{tx.date}</td>
                                    <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                                                tx.status === 'success' ? 'bg-green-50 text-green-600 border-green-100 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20' :
                                                    tx.status === 'pending' ? 'bg-orange-50 text-orange-600 border-orange-100 dark:bg-orange-500/10 dark:text-orange-400 dark:border-orange-500/20' :
                                                        'bg-red-50 text-red-600 border-red-100 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20'
                                            }`}>
                                                {tx.status}
                                            </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <button
                                            onClick={() => setSelectedTxId(tx.id)}
                                            className="bg-white dark:bg-transparent border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 px-3 py-1.5 rounded-lg text-[10px] font-bold hover:bg-[#0E0627] hover:text-white hover:border-[#0E0627] dark:hover:bg-indigo-600 dark:hover:text-white dark:hover:border-indigo-600 transition-all shadow-sm"
                                        >
                                            View
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={8} className="px-6 py-12 text-center text-gray-400 dark:text-gray-600 text-sm">
                                    No transactions found matching your search.
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {!loading && transactions.length > 0 && (
                    <div className="p-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between bg-gray-50/50 dark:bg-white/5">
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                            Showing {pagination.from}-{pagination.to} of {pagination.total} results
                        </p>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={pagination.current_page === 1}
                                className="h-8 w-8 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#0B0B15] text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 disabled:opacity-50 transition-colors"
                            >
                                <ChevronLeft size={16}/>
                            </button>
                            <button
                                onClick={() => setPage(p => p + 1)}
                                disabled={pagination.current_page === pagination.last_page}
                                className="h-8 w-8 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#0B0B15] text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 disabled:opacity-50 transition-colors"
                            >
                                <ChevronRight size={16}/>
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Modal */}
            <TransactionModal
                isOpen={!!selectedTxId}
                onClose={() => setSelectedTxId(null)}
                transactionId={selectedTxId}
                onUpdate={fetchTransactions}
            />
        </div>
    );
}

// --- Transaction Details Modal ---

function TransactionModal({ isOpen, onClose, transactionId, onUpdate }: { isOpen: boolean, onClose: () => void, transactionId: number | null, onUpdate?: () => void }) {
    const { token } = useAuth();
    const [details, setDetails] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        if (isOpen && transactionId && token) {
            setLoading(true);
            const API_URL = process.env.NEXT_PUBLIC_API_URL;
            fetch(`${API_URL}/transactions/${transactionId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            })
                .then(res => res.json())
                .then(res => {
                    if (res.success) setDetails(res.data);
                    else toast.error("Could not fetch details");
                })
                .catch(() => toast.error("Network error"))
                .finally(() => setLoading(false));
        } else {
            setDetails(null);
        }
    }, [isOpen, transactionId, token]);

    const handleAction = async (action: 'approve' | 'reject' | 'flag') => {
        if (!transactionId) return;
        setActionLoading(true);
        try {
            // Mock API call - replace with real endpoint
            await new Promise(r => setTimeout(r, 1000));
            toast.success(`Transaction ${action}ed successfully`);
            if (onUpdate) onUpdate();
            onClose();
        } catch (e) {
            toast.error("Action failed");
        } finally {
            setActionLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 dark:bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-[#13131F] w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200 border border-gray-100 dark:border-gray-800">
                {/* Modal Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-white/5">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Transaction Details</h2>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Viewing ID: <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">#{details?.id || '...'}</span>
                        </p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 dark:hover:bg-white/10 rounded-full transition-colors text-gray-500 dark:text-gray-400">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
                    {loading || !details ? (
                        <div className="h-64 flex flex-col items-center justify-center gap-3 text-gray-400 dark:text-gray-600">
                            <Loader2 size={32} className="animate-spin text-indigo-500" />
                            <p className="text-xs font-bold uppercase tracking-widest">Loading Data...</p>
                        </div>
                    ) : (
                        <div className="space-y-8">
                            {/* Summary Cards */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-5 bg-gray-50 dark:bg-[#0B0B15] rounded-2xl border border-gray-100 dark:border-gray-800">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Total Amount</p>
                                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{details.currency} {details.amount}</h3>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span> Fee: {details.fee}
                                    </p>
                                </div>
                                <div className="p-5 bg-gray-50 dark:bg-[#0B0B15] rounded-2xl border border-gray-100 dark:border-gray-800">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Current Status</p>
                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                                        details.status === 'Success' ? 'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400' :
                                            details.status === 'Pending' ? 'bg-orange-100 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400' :
                                                'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400'
                                    }`}>
                                        <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                                        {details.status}
                                    </span>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">{details.full_date || details.date}</p>
                                </div>
                            </div>

                            {/* Data Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <h4 className="text-xs font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-2 uppercase">Payment Data</h4>
                                    <div className="space-y-3">
                                        <div className="flex justify-between text-sm"><span className="text-gray-500 dark:text-gray-400">Type</span> <span className="font-bold text-gray-800 dark:text-gray-200">{details.type}</span></div>
                                        <div className="flex justify-between text-sm"><span className="text-gray-500 dark:text-gray-400">Method</span> <span className="font-bold text-gray-800 dark:text-gray-200">{details.method}</span></div>
                                        <div className="flex justify-between text-sm"><span className="text-gray-500 dark:text-gray-400">Reference</span> <span className="font-mono text-xs font-bold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">{details.reference}</span></div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h4 className="text-xs font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-2 uppercase">User Information</h4>
                                    <div className="flex items-center gap-3 bg-gray-50 dark:bg-[#0B0B15] p-3 rounded-xl border border-gray-100 dark:border-gray-800">
                                        <div className="w-10 h-10 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center font-bold text-gray-500 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
                                            {details.user_name?.charAt(0) || 'U'}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-900 dark:text-white">{details.user_name}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">{details.user_email}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Timeline */}
                            {details.timeline && (
                                <div className="bg-gray-50 dark:bg-[#0B0B15] rounded-xl p-5 border border-gray-100 dark:border-gray-800">
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Activity Log</h4>
                                    <div className="space-y-0 relative">
                                        <div className="absolute left-[9px] top-2 bottom-2 w-0.5 bg-gray-200 dark:bg-gray-800"></div>
                                        {details.timeline.map((step: any, idx: number) => (
                                            <div key={idx} className="flex gap-4 relative z-10 pb-6 last:pb-0">
                                                <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border-2 ${
                                                    step.status === 'done'
                                                        ? 'bg-green-500 border-green-500 text-white'
                                                        : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-300 dark:text-gray-600'
                                                }`}>
                                                    {step.status === 'done' && <CheckCircle2 size={12} strokeWidth={4} />}
                                                </div>
                                                <div className="-mt-1">
                                                    <p className={`text-sm font-bold ${step.status === 'done' ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-500'}`}>
                                                        {step.label}
                                                    </p>
                                                    <p className="text-xs text-gray-400 dark:text-gray-600">{step.time}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-5 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-[#0B0B15] flex gap-3">
                    <button
                        disabled={actionLoading}
                        className="flex-1 bg-white dark:bg-[#13131F] border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 py-3 rounded-xl font-bold text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors shadow-sm disabled:opacity-50"
                    >
                        Download Receipt
                    </button>
                    <button
                        onClick={() => handleAction('flag')}
                        disabled={actionLoading}
                        className="flex-1 bg-[#0E0627] dark:bg-indigo-600 text-white py-3 rounded-xl font-bold text-sm hover:opacity-90 transition-colors shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {actionLoading ? <Loader2 size={16} className="animate-spin" /> : <ShieldAlert size={16} />}
                        Flag Transaction
                    </button>
                </div>
            </div>
        </div>
    );
}