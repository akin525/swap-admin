"use client";

import React, { useState } from 'react'; // Added useState
import { Users, UserCheck, ShieldAlert, UserMinus, Search, Filter, ArrowLeft } from 'lucide-react';
import { StatCard } from '@/components/dashboard/StatCard';
import { UserTable } from '@/components/dashboard/UserTable';
import { UserDetails } from '@/components/dashboard/UserDetails'; // Import the details component

export default function UserManagementPage() {
    // State to track which user is being viewed
    const [selectedUser, setSelectedUser] = useState<any>(null);

    return (
        <div className="space-y-8 bg-background min-h-screen transition-colors duration-300">
            {/* 1. Header Logic: Show breadcrumbs if a user is selected */}
            {selectedUser ? (
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setSelectedUser(null)}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all"
                    >
                        <ArrowLeft size={24} className="text-slate-600 dark:text-slate-300" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold">User Details</h1>
                        <p className="text-xs text-slate-500">User Management / {selectedUser.name}</p>
                    </div>
                </div>
            ) : (
                <>
                    {/* Top Stats Row - User Specific */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatCard label="Total Users" value="4,532" change="+12.5%" isPositive={true} icon={<Users size={20} />} />
                        <StatCard label="Active Users" value="8,847" change="+8.1%" isPositive={true} icon={<UserCheck size={20} />} />
                        <StatCard label="KYC Pending" value="1,204" change="-2.4%" isPositive={false} icon={<ShieldAlert size={20} />} />
                        <StatCard label="Suspended" value="125" change="+0.2%" isPositive={false} icon={<UserMinus size={20} />} />
                    </div>

                    {/* Filter & Search Bar */}
                    <div className="bg-card border border-border p-4 rounded-3xl flex flex-col md:flex-row gap-4 items-center justify-between shadow-sm">
                        <div className="relative w-full md:w-96">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search users..."
                                className="w-full pl-12 pr-4 py-2.5 bg-background border border-border rounded-2xl outline-none focus:ring-2 focus:ring-brand/20 transition-all"
                            />
                        </div>
                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <button className="flex items-center gap-2 px-4 py-2.5 border border-border rounded-2xl text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
                                <Filter size={16} /> Filter by KYC
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2.5 border border-border rounded-2xl text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
                                <Filter size={16} /> Filter by Country
                            </button>
                        </div>
                    </div>
                </>
            )}

            {/* 2. Main Content: Conditional Rendering */}
            <div className="pb-10">
                {selectedUser ? (
                    <UserDetails
                        user={selectedUser}
                        onClose={() => setSelectedUser(null)}
                    />
                ) : (
                    <UserTable onViewUser={(user) => setSelectedUser(user)} />
                )}
            </div>
        </div>
    );
}