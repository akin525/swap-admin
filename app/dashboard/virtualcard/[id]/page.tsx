"use client";

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import {
    ArrowLeft, Loader2, CreditCard, RefreshCw, Shield,
    Smartphone, Globe, ShoppingBag, Banknote, Calendar,
    User, AlertTriangle, Lock, Trash2, RotateCcw
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'react-hot-toast';

// Next.js 15+ Params definition
interface PageProps {
    params: Promise<{ id: string }>;
}

export default function CardDetailPage({ params }: PageProps) {
    // 1. Unwrap Params
    const { id } = use(params);
    const { token } = useAuth();

    // 2. State
    const [loading, setLoading] = useState(true);
    const [card, setCard] = useState<any>(null);
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    // 3. Fetch Data
    useEffect(() => {
        const fetchDetails = async () => {
            if (!token || !id) return;
            try {
                const API_URL = process.env.NEXT_PUBLIC_API_URL;
                const res = await fetch(`${API_URL}/virtual-cards/${id}`, {
                    headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
                });
                const data = await res.json();

                if (data.success) {
                    setCard(data.data);
                } else {
                    toast.error("Failed to load card details");
                }
            } catch (error) {
                toast.error("Network Error");
            } finally {
                setLoading(false);
            }
        };

        fetchDetails();
    }, [id, token]);

    // 4. Action Handlers
    const handleAction = async (action: 'freeze' | 'block' | 'delete') => {
        if (!confirm(`Are you sure you want to ${action} this card?`)) return;
        setActionLoading(action);

        // Simulate API call
        setTimeout(() => {
            toast.success(`Card ${action}d successfully`);
            setActionLoading(null);
            // In real app, you'd refresh data here
        }, 1500);
    };

    if (loading) {
        return (
            <div className="flex h-[80vh] items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="animate-spin text-[#7C5CFF]" size={40} />
                    <p className="text-sm font-bold text-gray-400 dark:text-gray-500">Retrieving card details...</p>
                </div>
            </div>
        );
    }

    if (!card) {
        return (
            <div className="flex h-[60vh] flex-col items-center justify-center gap-4">
                <div className="h-20 w-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center text-gray-400">
                    <CreditCard size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Card Not Found</h3>
                <Link href="/dashboard/virtualcard" className="bg-[#0E0627] text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:opacity-90 transition-all">
                    Return to List
                </Link>
            </div>
        );
    }

    const isActive = card.status === 'Active';

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl mx-auto">

            {/* Top Navigation */}
            <div className="flex items-center justify-between">
                <Link
                    href="/dashboard/virtualcard"
                    className="flex items-center gap-2 text-gray-500 hover:text-[#7C5CFF] dark:text-gray-400 dark:hover:text-[#7C5CFF] transition-colors group w-fit px-2 py-1 -ml-2"
                >
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="text-xs font-bold uppercase tracking-wider">Back to Cards</span>
                </Link>

                <div className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2 ${isActive ? 'bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400' : 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400'}`}>
                    <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-500' : 'bg-red-500'}`} />
                    {card.status}
                </div>
            </div>

            {/* 1. Main Info Card */}
            <div className="bg-white dark:bg-[#13131F] rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col lg:flex-row gap-8 lg:gap-12 relative overflow-hidden">
                {/* Background Decoration */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 dark:bg-indigo-900/10 rounded-full -mr-16 -mt-32 opacity-50 pointer-events-none" />

                {/* Visual Card Representation */}
                <div className="flex-shrink-0 w-full lg:w-80">
                    <div className="aspect-[1.586/1] rounded-2xl bg-gradient-to-br from-[#0E0627] to-[#1a1040] dark:from-[#1a1040] dark:to-[#0E0627] p-6 text-white shadow-xl relative overflow-hidden group">
                        {/* Shine Effect */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                        <div className="flex justify-between items-start h-full flex-col relative z-10">
                            <div className="flex justify-between w-full items-center">
                                <span className="font-mono text-xs opacity-70">Virtual Debit</span>
                                <CreditCard size={24} className="opacity-80" />
                            </div>
                            <div className="space-y-4 w-full">
                                <div className="text-2xl font-mono tracking-widest drop-shadow-md">
                                    **** **** **** {card.number.slice(-4)}
                                </div>
                                <div className="flex justify-between items-end w-full">
                                    <div>
                                        <div className="text-[10px] uppercase opacity-60 tracking-wider">Card Holder</div>
                                        <div className="font-bold tracking-wide uppercase text-sm truncate max-w-[180px]">{card.holder}</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-[10px] uppercase opacity-60 tracking-wider">Expires</div>
                                        <div className="font-bold tracking-wide font-mono">{card.expiry}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 flex flex-col gap-3">
                        <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-[#0B0B15] rounded-xl border border-gray-100 dark:border-gray-800">
                            <span className="text-xs font-bold text-gray-500 dark:text-gray-400">Current Balance</span>
                            <span className="text-lg font-bold text-gray-900 dark:text-white">${card.balance}</span>
                        </div>
                    </div>
                </div>

                {/* Details Grid */}
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-6">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Card Information</h2>
                        <span className="px-2 py-0.5 bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-gray-300 rounded text-[10px] font-mono">ID: {card.id}</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                        <InfoRow icon={<User size={16}/>} label="Holder Name" value={card.holder} />
                        <InfoRow icon={<CreditCard size={16}/>} label="Provider" value={card.type || "Visa"} />
                        <InfoRow icon={<Calendar size={16}/>} label="Date Issued" value={card.created_at} />
                        <InfoRow icon={<Lock size={16}/>} label="CVV" value="•••" isSensitive />
                        <InfoRow icon={<Globe size={16}/>} label="Billing Address" value={card.billing || "123 Market St, San Francisco, CA"} />
                    </div>

                    <div className="mt-8 pt-8 border-t border-gray-100 dark:border-gray-800">
                        <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
                        <div className="flex flex-wrap gap-3">
                            <ActionButton
                                onClick={() => handleAction('freeze')}
                                loading={actionLoading === 'freeze'}
                                icon={<Lock size={16} />}
                                label="Freeze Card"
                                variant="secondary"
                            />
                            <ActionButton
                                onClick={() => handleAction('block')}
                                loading={actionLoading === 'block'}
                                icon={<AlertTriangle size={16} />}
                                label="Block Card"
                                variant="warning"
                            />
                            <ActionButton
                                onClick={() => {}} // Handle Reset PIN
                                loading={false}
                                icon={<RotateCcw size={16} />}
                                label="Reset PIN"
                                variant="primary"
                            />
                            <ActionButton
                                onClick={() => handleAction('delete')}
                                loading={actionLoading === 'delete'}
                                icon={<Trash2 size={16} />}
                                label="Terminate"
                                variant="danger"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. Controls & Limits */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Spending Limits */}
                <div className="bg-white dark:bg-[#13131F] rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 dark:border-gray-800">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-gray-900 dark:text-white text-sm flex items-center gap-2">
                            <Banknote size={18} className="text-[#7C5CFF]" /> Spending Limits
                        </h3>
                        <button className="text-xs font-bold text-[#7C5CFF] hover:underline">Edit Limits</button>
                    </div>
                    <div className="space-y-4">
                        <LimitRow label="Daily Transaction Limit" value="$500.00" max="$5,000.00" percentage={10} />
                        <LimitRow label="Monthly Spend Limit" value="$2,000.00" max="$10,000.00" percentage={20} />
                        <LimitRow label="Per Transaction Limit" value="$100.00" max="$1,000.00" percentage={10} />
                    </div>
                </div>

                {/* Usage Controls */}
                <div className="bg-white dark:bg-[#13131F] rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 dark:border-gray-800">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-gray-900 dark:text-white text-sm flex items-center gap-2">
                            <Shield size={18} className="text-[#7C5CFF]" /> Usage Controls
                        </h3>
                    </div>
                    <div className="space-y-4">
                        <ControlSwitch label="Online Purchases" icon={<ShoppingBag size={16}/>} active />
                        <ControlSwitch label="ATM Withdrawals" icon={<Banknote size={16}/>} active />
                        <ControlSwitch label="International Usage" icon={<Globe size={16}/>} active={false} />
                        <ControlSwitch label="Contactless Payments" icon={<Smartphone size={16}/>} active />
                    </div>
                </div>
            </div>

            {/* 3. Recent Transactions */}
            <div className="bg-white dark:bg-[#13131F] rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 dark:border-gray-800">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-gray-900 dark:text-white text-sm">Transaction History</h3>
                    <button className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full text-gray-400 transition-colors">
                        <RefreshCw size={14} />
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                        <tr className="text-gray-400 dark:text-gray-500 uppercase text-[10px] font-bold tracking-widest border-b border-gray-100 dark:border-gray-800">
                            <th className="pb-4 pl-2">Date</th>
                            <th className="pb-4">Merchant</th>
                            <th className="pb-4">Type</th>
                            <th className="pb-4">Amount</th>
                            <th className="pb-4 text-right pr-2">Status</th>
                        </tr>
                        </thead>
                        <tbody className="text-xs">
                        {card.transactions && card.transactions.length > 0 ? (
                            card.transactions.map((tx: any, i: number) => (
                                <tr key={i} className="border-b border-gray-50 dark:border-gray-800 last:border-0 hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors group">
                                    <td className="py-4 pl-2 font-medium text-gray-500 dark:text-gray-400">{tx.date}</td>
                                    <td className="py-4 font-bold text-gray-900 dark:text-white">{tx.desc}</td>
                                    <td className="py-4 font-medium text-gray-500 dark:text-gray-400 capitalize">{tx.type}</td>
                                    <td className={`py-4 font-bold ${tx.type === 'fund' ? 'text-green-600 dark:text-green-400' : 'text-gray-900 dark:text-white'}`}>
                                        {tx.type === 'fund' ? '+' : '-'}${tx.amount}
                                    </td>
                                    <td className="py-4 pr-2 text-right">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                                tx.status.toLowerCase() === 'success' ? 'bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400' : 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400'
                                            }`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${tx.status.toLowerCase() === 'success' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                                {tx.status}
                                            </span>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="py-8 text-center text-gray-400 dark:text-gray-600 font-medium">No transactions found</td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

// --- Helper Components ---

function InfoRow({ icon, label, value, isSensitive = false }: any) {
    return (
        <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                {icon} {label}
            </div>
            <div className="font-bold text-sm text-gray-900 dark:text-white pl-6">
                {isSensitive ? (
                    <span className="font-mono tracking-widest bg-gray-100 dark:bg-white/10 px-2 rounded text-gray-500 dark:text-gray-400">{value}</span>
                ) : value}
            </div>
        </div>
    );
}

function ActionButton({ onClick, loading, icon, label, variant }: any) {
    const variants = {
        primary: "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 dark:bg-transparent dark:border-gray-700 dark:text-gray-300 dark:hover:bg-white/5",
        secondary: "bg-[#7C5CFF] text-white hover:bg-[#6A4DED] border-transparent",
        warning: "bg-orange-500 text-white hover:bg-orange-600 border-transparent",
        danger: "bg-red-50 text-red-600 border border-red-100 hover:bg-red-100 dark:bg-red-500/10 dark:text-red-400 dark:border-red-900/30 dark:hover:bg-red-500/20"
    };

    return (
        <button
            onClick={onClick}
            disabled={loading}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed border shadow-sm ${variants[variant as keyof typeof variants]}`}
        >
            {loading ? <Loader2 size={16} className="animate-spin" /> : icon}
            {label}
        </button>
    );
}

function LimitRow({ label, value, max, percentage }: any) {
    return (
        <div>
            <div className="flex justify-between items-end mb-2">
                <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400">{label}</span>
                <span className="text-xs font-bold text-gray-900 dark:text-white">{value} <span className="text-gray-400 dark:text-gray-600 text-[10px]">/ {max}</span></span>
            </div>
            <div className="h-1.5 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-[#7C5CFF] rounded-full transition-all duration-500" style={{ width: `${percentage}%` }} />
            </div>
        </div>
    );
}

function ControlSwitch({ label, icon, active }: any) {
    const [isActive, setIsActive] = useState(active);

    return (
        <div className="flex items-center justify-between p-3 rounded-xl border border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer group" onClick={() => setIsActive(!isActive)}>
            <div className="flex items-center gap-3">
                <div className="text-gray-400 dark:text-gray-500 group-hover:text-[#7C5CFF] transition-colors">{icon}</div>
                <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{label}</span>
            </div>
            <div className={`w-10 h-5 rounded-full flex items-center px-1 transition-colors ${isActive ? 'bg-[#7C5CFF]' : 'bg-gray-200 dark:bg-gray-700'}`}>
                <div className={`w-3.5 h-3.5 bg-white rounded-full shadow-sm transition-transform ${isActive ? 'translate-x-5' : 'translate-x-0'}`} />
            </div>
        </div>
    );
}