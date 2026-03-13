"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    Search,
    Filter,
    Plus,
    CreditCard,
    MoreHorizontal,
    ArrowUpRight,
    ArrowDownLeft,
    ShieldAlert,
    Loader2
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'react-hot-toast';

// --- Types ---
interface CardStats {
    total_cards: number;
    active_cards: number;
    total_spend: string;
    blocked_cards: number;
}

interface VirtualCard {
    id: number;
    masked_pan: string;
    card_holder: string;
    balance: string;
    currency: string;
    status: 'Active' | 'Frozen' | 'Blocked' | 'Terminated';
    spend_limit: string;
    provider: string; // e.g. "Visa" or "Mastercard"
}

interface Transaction {
    id: string;
    description: string;
    amount: string;
    date: string;
    status: string;
    type: 'debit' | 'credit';
}

export default function VirtualCardPage() {
    const { token } = useAuth();
    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<CardStats | null>(null);
    const [cards, setCards] = useState<VirtualCard[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [search, setSearch] = useState('');

    useEffect(() => {
        if (!token) return;

        const fetchData = async () => {
            try {
                const API_URL = process.env.NEXT_PUBLIC_API_URL;
                const res = await fetch(`${API_URL}/virtual-cards`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const response = await res.json();

                if (response.success) {
                    setStats(response.data.stats);
                    setCards(response.data.cards);
                    setTransactions(response.data.transactions);
                } else {
                    toast.error(response.message || "Failed to load data");
                }
            } catch (error) {
                toast.error("Network error");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [token]);

    if (loading) return <VirtualCardSkeleton />;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* 1. Header & Actions */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Virtual Cards</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Manage issuance and card controls.</p>
                </div>
                <div className="flex gap-3">
                    <button className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:bg-[#13131F] dark:text-gray-300 dark:hover:bg-white/5">
                        <Filter size={16} /> Filter
                    </button>
                    <button className="inline-flex items-center gap-2 rounded-xl bg-[#7C5CFF] px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-indigo-500/20 hover:bg-[#6A4DED] transition-all active:scale-95">
                        <Plus size={16} /> Issue Card
                    </button>
                </div>
            </div>

            {/* 2. Stats Overview */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="Total Cards"
                    value={stats?.total_cards || 0}
                    trend="+12%"
                    icon={<CreditCard size={20} />}
                    color="bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400"
                />
                <StatCard
                    title="Active Cards"
                    value={stats?.active_cards || 0}
                    trend="+5%"
                    icon={<CreditCard size={20} />}
                    color="bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400"
                />
                <StatCard
                    title="Total Spend"
                    value={stats?.total_spend || "$0.00"}
                    trend="+8.4%"
                    icon={<ArrowUpRight size={20} />}
                    color="bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400"
                />
                <StatCard
                    title="Blocked"
                    value={stats?.blocked_cards || 0}
                    trend="-2%"
                    icon={<ShieldAlert size={20} />}
                    color="bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400"
                    isNegative
                />
            </div>

            {/* 3. Cards Table */}
            <div className="rounded-3xl border border-gray-100 bg-white shadow-sm dark:border-gray-800 dark:bg-[#13131F] flex flex-col min-h-[400px]">
                {/* Search Header */}
                <div className="flex flex-col gap-4 border-b border-gray-100 p-6 dark:border-gray-800 sm:flex-row sm:items-center sm:justify-between">
                    <h3 className="font-bold text-gray-900 dark:text-white">All Cards</h3>
                    <div className="relative w-full sm:w-72">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search by last 4 digits or name..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-[#7C5CFF] focus:ring-2 focus:ring-[#7C5CFF]/10 dark:border-gray-700 dark:bg-gray-800/50 dark:text-white dark:placeholder-gray-500"
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50/50 text-gray-400 dark:bg-white/5 dark:text-gray-500 border-b border-gray-100 dark:border-gray-800">
                        <tr>
                            <th className="px-6 py-4 font-bold uppercase tracking-wider text-[11px]">Card</th>
                            <th className="px-6 py-4 font-bold uppercase tracking-wider text-[11px]">Cardholder</th>
                            <th className="px-6 py-4 font-bold uppercase tracking-wider text-[11px]">Balance</th>
                            <th className="px-6 py-4 font-bold uppercase tracking-wider text-[11px]">Provider</th>
                            <th className="px-6 py-4 font-bold uppercase tracking-wider text-[11px]">Status</th>
                            <th className="px-6 py-4 text-right font-bold uppercase tracking-wider text-[11px]">Action</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                        {cards.length > 0 ? cards.map((card) => (
                            <tr key={card.id} className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-8 w-12 items-center justify-center rounded bg-indigo-50 text-[10px] font-bold text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
                                            VISA
                                        </div>
                                        <div className="font-mono font-bold text-gray-900 dark:text-white">
                                            •••• {card.masked_pan}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 font-medium text-gray-700 dark:text-gray-300">{card.card_holder}</td>
                                <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">{card.currency} {card.balance}</td>
                                <td className="px-6 py-4 text-xs text-gray-500 dark:text-gray-400">{card.provider || "Stripe"}</td>
                                <td className="px-6 py-4">
                                    <StatusBadge status={card.status} />
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button
                                        onClick={() => router.push(`/dashboard/virtualcard/${card.id}`)}
                                        className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-bold text-gray-700 hover:bg-gray-50 hover:text-indigo-600 dark:border-gray-700 dark:bg-transparent dark:text-gray-300 dark:hover:bg-white/5 dark:hover:text-white transition-all shadow-sm"
                                    >
                                        Manage
                                    </button>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-gray-400 dark:text-gray-500">
                                    No virtual cards found.
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* 4. Recent Transaction Log */}
            <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-[#13131F]">
                <h3 className="mb-6 font-bold text-gray-900 dark:text-white">Recent Card Activity</h3>
                <div className="space-y-4">
                    {transactions.length > 0 ? transactions.map((tx, i) => (
                        <div key={i} className="flex items-center justify-between border-b border-gray-50 pb-4 last:border-0 last:pb-0 dark:border-gray-800">
                            <div className="flex items-center gap-4">
                                <div className={`flex h-10 w-10 items-center justify-center rounded-full ${tx.type === 'credit' ? 'bg-green-50 text-green-600 dark:bg-green-500/10' : 'bg-gray-100 text-gray-600 dark:bg-white/5 dark:text-gray-400'}`}>
                                    {tx.type === 'credit' ? <ArrowDownLeft size={18} /> : <ArrowUpRight size={18} />}
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-gray-900 dark:text-white">{tx.description}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{tx.date}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className={`text-sm font-bold ${tx.type === 'credit' ? 'text-green-600 dark:text-green-400' : 'text-gray-900 dark:text-white'}`}>
                                    {tx.type === 'credit' ? '+' : '-'}{tx.amount}
                                </p>
                                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">{tx.status}</p>
                            </div>
                        </div>
                    )) : (
                        <p className="text-center text-sm text-gray-400 py-4">No recent activity recorded.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

// --- Sub-Components ---

function StatCard({ title, value, trend, icon, color, isNegative }: any) {
    return (
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:shadow-md dark:border-gray-800 dark:bg-[#13131F]">
            <div className="flex items-start justify-between">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${color}`}>
                    {icon}
                </div>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${isNegative ? 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400' : 'bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400'}`}>
                    {trend}
                </span>
            </div>
            <div className="mt-4">
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{title}</p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</h3>
            </div>
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    const s = status.toLowerCase();
    if (s === 'active') return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-2.5 py-1 text-[10px] font-bold text-green-700 dark:bg-green-500/10 dark:text-green-400">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500" /> Active
        </span>
    );
    if (s === 'frozen') return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-50 px-2.5 py-1 text-[10px] font-bold text-orange-700 dark:bg-orange-500/10 dark:text-orange-400">
            <span className="h-1.5 w-1.5 rounded-full bg-orange-500" /> Frozen
        </span>
    );
    return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-1 text-[10px] font-bold text-red-700 dark:bg-red-500/10 dark:text-red-400">
            <span className="h-1.5 w-1.5 rounded-full bg-red-500" /> Blocked
        </span>
    );
}

function VirtualCardSkeleton() {
    return (
        <div className="space-y-8 p-6 animate-pulse">
            <div className="flex justify-between items-center">
                <div className="space-y-2">
                    <div className="h-8 w-48 bg-gray-200 dark:bg-gray-800 rounded-lg" />
                    <div className="h-4 w-64 bg-gray-100 dark:bg-gray-800 rounded-lg" />
                </div>
                <div className="h-10 w-32 bg-gray-200 dark:bg-gray-800 rounded-xl" />
            </div>
            <div className="grid grid-cols-4 gap-4">
                {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-gray-100 dark:bg-gray-800 rounded-2xl" />)}
            </div>
            <div className="h-96 bg-gray-100 dark:bg-gray-800 rounded-3xl" />
        </div>
    );
}