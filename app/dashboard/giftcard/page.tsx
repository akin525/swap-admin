"use client";

import React, { useState, useEffect, useCallback } from 'react';
import {
    Plus, Search, Loader2, TrendingUp, AlertCircle,
    ShoppingBag, Tag, ChevronRight, MoreHorizontal,
    Gift, Filter, ArrowUpRight
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'react-hot-toast';

import EditBrandModal from './EditBrandModal';
import GiftCardModal from './GiftCardModal';

// --- Sub-Components ---

const MetricCard = ({ label, value, change, colorClass, icon: Icon }: any) => {
    // Helper to extract color base for dark mode opacity
    const getColorStyles = () => {
        if (colorClass.includes('slate') || colorClass.includes('gray')) return 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300';
        if (colorClass.includes('fuchsia') || colorClass.includes('purple')) return 'bg-fuchsia-50 text-fuchsia-600 dark:bg-fuchsia-500/10 dark:text-fuchsia-400';
        if (colorClass.includes('orange')) return 'bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400';
        return 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400';
    };

    return (
        <div className="bg-white dark:bg-[#13131F] p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all group">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">{label}</p>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1 group-hover:text-[#7C5CFF] transition-colors">{value}</h3>
                </div>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${getColorStyles()}`}>
                    <Icon size={20} />
                </div>
            </div>
            <div className="flex items-center gap-1.5">
                <span className="flex items-center text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-1.5 py-0.5 rounded-md">
                    <TrendingUp size={12} className="mr-1"/> {change}
                </span>
                <span className="text-[10px] text-gray-400 dark:text-gray-600">vs last week</span>
            </div>
        </div>
    );
};

// --- Main Component ---

export default function GiftCardsPage() {
    const { token } = useAuth();

    // UI State
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedBrandId, setSelectedBrandId] = useState<string | null>(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [selectedTxId, setSelectedTxId] = useState<string | null>(null);
    const [search, setSearch] = useState('');

    // Data State
    const [stats, setStats] = useState<any[]>([]);
    const [brands, setBrands] = useState<any[]>([]);
    const [transactions, setTransactions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(async () => {
        if (!token) return;
        setLoading(true);

        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL;
            const res = await fetch(`${API_URL}/giftcards`, {
                headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
            });

            const response = await res.json();

            if (response.success) {
                setStats(response.data.stats);
                setBrands(response.data.brands);
                setTransactions(response.data.transactions);
            } else {
                toast.error(response.message || "Failed to load data");
            }
        } catch (error) {
            toast.error("Network error");
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Handlers
    const handleEditClick = (brandId: string | number) => {
        setSelectedBrandId(brandId.toString());
        setIsEditModalOpen(true);
    };

    const handleAddBrand = () => {
        setSelectedBrandId(null);
        setIsEditModalOpen(true);
    };

    const handleViewTransaction = (id: string | number) => {
        setSelectedTxId(id.toString());
        setIsViewModalOpen(true);
    };

    const getIconForStat = (index: number) => {
        const icons = [ShoppingBag, Tag, AlertCircle, TrendingUp];
        return icons[index] || ShoppingBag;
    };

    if (loading) return <GiftCardsSkeleton />;

    return (
        <div className="flex flex-col gap-8 pb-10 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Gift Cards</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Manage brands, inventory, and transactions.</p>
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search brands..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-[#13131F] border border-gray-200 dark:border-gray-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#7C5CFF]/20 focus:border-[#7C5CFF] transition-all dark:text-white dark:placeholder-gray-500"
                        />
                    </div>
                    <button
                        onClick={handleAddBrand}
                        className="bg-[#0E0627] dark:bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:opacity-90 transition-all shadow-lg shadow-indigo-500/20 flex items-center gap-2 whitespace-nowrap"
                    >
                        <Plus size={16} /> <span className="hidden sm:inline">Add Brand</span>
                    </button>
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {stats.map((stat, i) => (
                    <MetricCard
                        key={i}
                        {...stat}
                        icon={getIconForStat(i)}
                        colorClass={i === 0 ? 'bg-slate-800' : i === 1 ? 'bg-fuchsia-500' : i === 2 ? 'bg-orange-500' : 'bg-emerald-500'}
                    />
                ))}
            </div>

            {/* BRAND MANAGEMENT */}
            <div className="bg-white dark:bg-[#13131F] rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden flex flex-col min-h-[400px]">
                <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <Gift size={18} className="text-[#7C5CFF]" />
                        <h2 className="font-bold text-slate-900 dark:text-white">Brand Inventory</h2>
                    </div>
                    <button className="text-xs font-bold text-[#7C5CFF] hover:bg-indigo-50 dark:hover:bg-indigo-500/10 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1">
                        View All <ChevronRight size={14}/>
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="text-gray-400 dark:text-gray-500 uppercase text-[10px] font-bold border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-white/5">
                        <tr>
                            <th className="px-6 py-4">Brand Name</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Stock Level</th>
                            <th className="px-6 py-4">Total Sales</th>
                            <th className="px-6 py-4">Margin</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {brands.length > 0 ? brands.filter(b => b.brand.toLowerCase().includes(search.toLowerCase())).map((row, idx) => (
                            <tr key={idx} className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-sm uppercase">
                                            {row.brand.substring(0, 2)}
                                        </div>
                                        <span className="font-bold text-slate-700 dark:text-gray-200">{row.brand}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                                            row.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20' :
                                                row.status === 'Low' ? 'bg-orange-50 text-orange-600 border-orange-100 dark:bg-orange-500/10 dark:text-orange-400 dark:border-orange-500/20' :
                                                    'bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20'
                                        }`}>
                                            <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                                                row.status === 'Active' ? 'bg-emerald-500' :
                                                    row.status === 'Low' ? 'bg-orange-500' :
                                                        'bg-rose-500'
                                            }`}></span>
                                            {row.status}
                                        </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-col gap-1.5 max-w-[140px]">
                                        <div className="flex justify-between text-[10px] font-bold text-gray-500 dark:text-gray-400">
                                            <span>{row.stock}</span>
                                            <span>Target: 1k</span>
                                        </div>
                                        <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full ${parseInt(String(row.stock).replace(/,/g, '')) > 100 ? 'bg-emerald-400' : 'bg-orange-400'}`}
                                                style={{ width: `${Math.min((parseInt(String(row.stock).replace(/,/g, '')) / 1000) * 100, 100)}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 font-bold text-slate-700 dark:text-gray-300">{row.sales}</td>
                                <td className="px-6 py-4 text-gray-500 dark:text-gray-400 font-medium">{row.margin}</td>
                                <td className="px-6 py-4 text-right">
                                    <button
                                        onClick={() => handleEditClick(row.id)}
                                        className="text-gray-400 hover:text-[#7C5CFF] p-2 hover:bg-indigo-50 dark:hover:bg-white/10 rounded-lg transition-colors"
                                    >
                                        <MoreHorizontal size={18} />
                                    </button>
                                </td>
                            </tr>
                        )) : (
                            <tr><td colSpan={6} className="text-center py-12 text-gray-400 dark:text-gray-600">No brands found.</td></tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* RECENT TRANSACTIONS */}
            <div className="bg-white dark:bg-[#13131F] rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <ShoppingBag size={18} className="text-[#7C5CFF]" />
                        <h2 className="font-bold text-slate-900 dark:text-white">Recent Transactions</h2>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="text-gray-400 dark:text-gray-500 uppercase text-[10px] font-bold border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-white/5">
                        <tr>
                            <th className="px-6 py-4">Transaction ID</th>
                            <th className="px-6 py-4">User</th>
                            <th className="px-6 py-4">Description</th>
                            <th className="px-6 py-4">Amount</th>
                            <th className="px-6 py-4">Date</th>
                            <th className="px-6 py-4 text-center">Action</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {transactions.length > 0 ? transactions.map((t, i) => (
                            <tr key={i} className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors group cursor-pointer" onClick={() => handleViewTransaction(t.id)}>
                                <td className="px-6 py-4 font-mono text-xs font-bold text-[#7C5CFF]">#{t.id}</td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-700 border border-white dark:border-gray-600 shadow-sm overflow-hidden">
                                            <div className="w-full h-full flex items-center justify-center text-[9px] font-bold text-gray-500 dark:text-gray-300 uppercase">
                                                {t.user.charAt(0)}
                                            </div>
                                        </div>
                                        <span className="font-bold text-slate-700 dark:text-gray-200 text-xs">{t.user}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-gray-500 dark:text-gray-400 text-xs truncate max-w-[250px]">{t.description}</td>
                                <td className="px-6 py-4 font-bold text-slate-800 dark:text-white">{t.amount}</td>
                                <td className="px-6 py-4 text-gray-400 dark:text-gray-500 text-xs">{t.date}</td>
                                <td className="px-6 py-4 text-center">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleViewTransaction(t.id); }}
                                        className="px-3 py-1.5 bg-white dark:bg-transparent border border-gray-200 dark:border-gray-700 rounded-lg text-xs font-bold text-gray-600 dark:text-gray-400 hover:bg-[#0E0627] hover:text-white hover:border-[#0E0627] dark:hover:bg-indigo-600 dark:hover:text-white dark:hover:border-indigo-600 transition-all shadow-sm"
                                    >
                                        View
                                    </button>
                                </td>
                            </tr>
                        )) : (
                            <tr><td colSpan={6} className="text-center py-12 text-gray-400 dark:text-gray-600">No recent transactions.</td></tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modals - Passed ID correctly */}
            {isEditModalOpen && (
                <EditBrandModal
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    brandId={selectedBrandId}
                    onUpdate={fetchData}
                />
            )}

            {isViewModalOpen && (
                <GiftCardModal
                    isOpen={isViewModalOpen}
                    onClose={() => setIsViewModalOpen(false)}
                    txId={selectedTxId}
                />
            )}
        </div>
    );
}

// --- Skeleton Component ---
function GiftCardsSkeleton() {
    return (
        <div className="flex flex-col gap-8 pb-10 animate-pulse">
            <div className="flex justify-between items-center">
                <div className="space-y-2">
                    <div className="h-8 w-48 bg-gray-200 dark:bg-gray-800 rounded-lg" />
                    <div className="h-4 w-64 bg-gray-100 dark:bg-gray-800 rounded-lg" />
                </div>
                <div className="h-10 w-32 bg-gray-200 dark:bg-gray-800 rounded-xl" />
            </div>
            <div className="grid grid-cols-4 gap-4">
                {[1,2,3,4].map(i => <div key={i} className="h-32 bg-gray-100 dark:bg-gray-800 rounded-2xl" />)}
            </div>
            <div className="h-96 bg-gray-100 dark:bg-gray-800 rounded-3xl" />
        </div>
    );
}