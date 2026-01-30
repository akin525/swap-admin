"use client";

import React from 'react';
import {
    Users, CreditCard, ShieldCheck, Zap,
    Mail, Phone, Calendar, MapPin, Clock
} from 'lucide-react';
import { StatCard } from '@/components/dashboard/StatCard';

interface UserDetailProps {
    user: any; // In production, use a strict User interface
    onClose: () => void;
}

export function UserDetails({ user, onClose }: UserDetailProps) {
    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* 1. Header: Profile Info Section */}
            <div className="bg-card border border-border rounded-[2rem] p-8 shadow-sm">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Basic Info */}
                    <div className="flex items-center gap-6 lg:border-r lg:border-border pr-8">
                        <div className="w-24 h-24 rounded-full bg-brand/20 flex items-center justify-center text-brand text-3xl font-bold">
                            {user.name.split(' ').map((n: string) => n[0]).join('')}
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold">{user.name}</h2>
                            <p className="text-slate-400 text-sm flex items-center gap-2 mt-1">
                                <Mail size={14} /> {user.email}
                            </p>
                        </div>
                    </div>

                    {/* Personal Information Grid */}
                    <div className="lg:col-span-1 space-y-4">
                        <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Personal Information</p>
                        <div className="grid grid-cols-2 gap-y-3 gap-x-4">
                            <InfoItem label="Contact Number" value="+234 801 234." />
                            <InfoItem label="Gender" value="Male" />
                            <InfoItem label="Date of Birth" value="1 Jan, 1985" />
                            <InfoItem label="Member Since" value="Jan 15, 2024" />
                            <InfoItem label="User ID" value="USR001234" />
                        </div>
                    </div>

                    {/* Other Information Grid */}
                    <div className="lg:col-span-1 space-y-4">
                        <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Other Information</p>
                        <div className="grid grid-cols-2 gap-y-3 gap-x-4">
                            <InfoItem label="KYC" value="+234 801 234." />
                            <InfoItem label="Device" value="Male" />
                            <InfoItem label="Location" value="Lagos, Nigeria" />
                            <InfoItem label="Timezone" value="WAT" />
                            <InfoItem label="Status" value="Jan 15, 2024" />
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. Currency Balance Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard label="NGN" value="₦125,000" change="" isPositive={true} icon={<Zap size={20} />} />
                <StatCard label="GHS" value="₵2,500" change="" isPositive={true} icon={<CreditCard size={20} />} />
                <StatCard label="USD" value="$850" change="" isPositive={true} icon={<ShieldCheck size={20} />} />
                <StatCard label="ZAR" value="R4,337" change="" isPositive={true} icon={<Users size={20} />} />
            </div>

            {/* 3. User Transactions Table */}
            <div className="bg-card border border-border rounded-[2rem] p-8 shadow-sm">
                <h3 className="font-bold text-lg mb-6">User Transactions</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="text-slate-400 text-xs uppercase border-b border-border">
                        <tr>
                            <th className="pb-4 font-semibold">ID</th>
                            <th className="pb-4 font-semibold">User</th>
                            <th className="pb-4 font-semibold">Description</th>
                            <th className="pb-4 font-semibold">Action</th>
                            <th className="pb-4 font-semibold">Amount</th>
                            <th className="pb-4 font-semibold">Issued Date</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <tr key={i} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                                <td className="py-4 text-brand font-bold">#5089</td>
                                <td className="py-4 font-semibold">John Doe</td>
                                <td className="py-4 text-slate-500 text-sm">john receive ₦50,000 from Tolu</td>
                                <td className="py-4 text-sm">Transfer NGN</td>
                                <td className="py-4 font-bold">₦50,000</td>
                                <td className="py-4 text-slate-400 text-xs">31 Mar 2025 10:45 AM</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* 4. Action Footer */}
            <div className="flex flex-wrap gap-4 pt-4">
                <ActionButton color="bg-orange-500" text="Update Limit" />
                <ActionButton color="bg-slate-900 dark:bg-slate-700" text="Reset PIN" />
                <ActionButton color="bg-sky-600" text="Send Message" />
                <ActionButton color="bg-rose-500" text="Suspend" />
            </div>
        </div>
    );
}

// Helper Components
function InfoItem({ label, value }: { label: string, value: string }) {
    return (
        <div>
            <p className="text-[10px] text-slate-400 leading-tight">{label}</p>
            <p className="text-sm font-bold mt-0.5">{value}</p>
        </div>
    );
}

function ActionButton({ color, text }: { color: string, text: string }) {
    return (
        <button className={`${color} text-white px-8 py-3 rounded-xl text-sm font-bold shadow-lg hover:opacity-90 active:scale-95 transition-all`}>
            {text}
        </button>
    );
}