"use client";

import React, { useState } from 'react';
import { Gift, ShoppingBag, AlertTriangle, TrendingUp, Search, Plus, ArrowLeft } from 'lucide-react';
import { StatCard } from '@/components/dashboard/StatCard';
import { EditBrandPage } from '@/components/dashboard/EditBrand';

const brands = [
    { id: "#5089", name: "Amazon", status: "Active", stock: "1,234", sales: "$12.5K", margin: "15%", color: "text-emerald-500" },
    { id: "#5090", name: "iTunes", status: "Low", stock: "23", sales: "$3.2K", margin: "12%", color: "text-amber-500" },
    { id: "#5091", name: "Google Play", status: "OutStock", stock: "0", sales: "$8.9K", margin: "18%", color: "text-rose-500" },
];

const recentTransactions = [
    { id: "#5089", user: "John Doe", desc: "john@email.com purchased Amazon $50", amount: "$50", date: "31 Mar 2025 10:45 AM" },
    { id: "#5089", user: "John", desc: "jane@email.com purchased iTunes $25", amount: "$25", date: "31 Mar 2025 10:42 AM" },
    { id: "#5089", user: "mike", desc: "mike@email.com redeemed Google $10", amount: "$10", date: "31 Mar 2025 10:25 AM" },
    { id: "#5089", user: "Femi", desc: "femi@email.com purchased Amazon $50", amount: "$50", date: "31 Mar 2025 09:35 AM" },
];

export default function GiftCardPage() {
    const [view, setView] = useState<'list' | 'edit'>('list');
    const [selectedBrand, setSelectedBrand] = useState<string>("Amazon");

    const handleEdit = (name: string) => {
        setSelectedBrand(name);
        setView('edit');
    };

    if (view === 'edit') {
        return (
            <div className="space-y-6">
                <button
                    onClick={() => setView('list')}
                    className="flex items-center gap-2 text-brand font-bold px-2 hover:underline"
                >
                    <ArrowLeft size={20} /> Back to Management
                </button>
                <EditBrandPage brandName={selectedBrand} />
            </div>
        );
    }

    return (
        <div className="space-y-8 bg-background min-h-screen transition-colors duration-300">
            {/* Top Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard label="Total Sales" value="$45.2K" change="8.5%" isPositive={true} icon={<ShoppingBag size={20} />} />
                <StatCard label="Total brands" value="23" change="15.2%" isPositive={true} icon={<Gift size={20} />} />
                <StatCard label="Low Stock" value="12" change="" isPositive={false} icon={<AlertTriangle size={20} />} />
                <StatCard label="Revenue This wk" value="$23.8K" change="12.3%" isPositive={true} icon={<TrendingUp size={20} />} />
            </div>

            {/* Brand Management Section */}
            <div className="bg-card border border-border rounded-[2rem] shadow-sm overflow-hidden">
                <div className="p-8 border-b border-border flex justify-between items-center">
                    <h3 className="font-bold text-xl">Brand Management</h3>
                    <button className="bg-brand text-white px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 hover:brightness-110 transition-all">
                        <Plus size={18} /> Add Brand
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                        <tr className="text-slate-400 text-[10px] uppercase tracking-widest border-b border-border">
                            <th className="px-8 py-5 font-semibold">Brand</th>
                            <th className="px-8 py-5 font-semibold">Status</th>
                            <th className="px-8 py-5 font-semibold">Stock</th>
                            <th className="px-8 py-5 font-semibold">Sales</th>
                            <th className="px-8 py-5 font-semibold">Margin</th>
                            <th className="px-8 py-5 font-semibold">Actions</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                        {brands.map((brand) => (
                            <tr key={brand.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                                <td className="px-8 py-6 text-brand font-bold text-sm">{brand.id}</td>
                                <td className={`px-8 py-6 text-sm font-bold ${brand.color}`}>{brand.status}</td>
                                <td className="px-8 py-6 font-semibold text-sm">{brand.stock}</td>
                                <td className="px-8 py-6 font-semibold text-sm">{brand.sales}</td>
                                <td className="px-8 py-6 font-semibold text-sm">{brand.margin}</td>
                                <td className="px-8 py-6">
                                    <button
                                        onClick={() => handleEdit(brand.name)}
                                        className="bg-slate-900 dark:bg-white text-white dark:text-black px-6 py-2 rounded-xl text-xs font-bold hover:opacity-80 transition-all"
                                    >
                                        Edit
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Recent Transactions Section */}
            <div className="bg-card border border-border rounded-[2rem] shadow-sm overflow-hidden">
                <div className="p-8 border-b border-border">
                    <h3 className="font-bold text-xl">Recent Transactions</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                        <tr className="text-slate-400 text-[10px] uppercase tracking-widest border-b border-border">
                            <th className="px-8 py-5 font-semibold">ID</th>
                            <th className="px-8 py-5 font-semibold">USER</th>
                            <th className="px-8 py-5 font-semibold">DESCRIPTION</th>
                            <th className="px-8 py-5 font-semibold">AMOUNT</th>
                            <th className="px-8 py-5 font-semibold">ISSUED DATE</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                        {recentTransactions.map((tx, index) => (
                            <tr key={index} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                <td className="px-8 py-6 text-brand font-bold text-sm">{tx.id}</td>
                                <td className="px-8 py-6 font-semibold text-sm">{tx.user}</td>
                                <td className="px-8 py-6 text-slate-500 dark:text-slate-400 text-sm">{tx.desc}</td>
                                <td className="px-8 py-6 font-bold text-sm">{tx.amount}</td>
                                <td className="px-8 py-6 text-slate-400 text-xs">{tx.date}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}