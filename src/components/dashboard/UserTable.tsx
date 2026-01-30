"use client";

import React from 'react';

// Define the prop type to receive the navigation function
interface UserTableProps {
    onViewUser: (user: any) => void;
}

const users = [
    { id: 1, name: "John Deo", handle: "@johndeo", email: "jessica.hanson@example.com", country: "Nigeria", kyc: "L2", status: "Active", color: "text-emerald-500 bg-emerald-500/10" },
    { id: 2, name: "Wade Warren", handle: "@wade456", email: "willie.jennings@example.com", country: "Ghana", kyc: "L3", status: "Active", color: "text-emerald-500 bg-emerald-500/10" },
    { id: 3, name: "Guy Hawkins", handle: "@guy", email: "michael.mitc@example.com", country: "Nigeria", kyc: "L2", status: "Suspend", color: "text-amber-500 bg-amber-500/10" },
    { id: 4, name: "Jacob Jones", handle: "@jacob", email: "michael.mitc@example.com", country: "South Africa", kyc: "L3", status: "Block", color: "text-slate-400 bg-slate-400/10" },
];

export function UserTable({ onViewUser }: UserTableProps) {
    return (
        <div className="bg-card border border-border rounded-[2rem] overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                    <tr className="text-slate-400 text-xs uppercase tracking-wider border-b border-border">
                        <th className="px-8 py-5 font-semibold">Users</th>
                        <th className="px-8 py-5 font-semibold">E-mail</th>
                        <th className="px-8 py-5 font-semibold">Country</th>
                        <th className="px-8 py-5 font-semibold">KYC</th>
                        <th className="px-8 py-5 font-semibold">Status</th>
                        <th className="px-8 py-5 font-semibold text-center">Action</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                    {users.map((user) => (
                        <tr
                            key={user.id}
                            onClick={() => onViewUser(user)} // Entire row is now clickable
                            className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors cursor-pointer"
                        >
                            <td className="px-8 py-5">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-brand/20 flex items-center justify-center text-brand font-bold text-xs">
                                        {user.name.split(' ').map(n => n[0]).join('')}
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm">{user.name}</p>
                                        <p className="text-xs text-slate-400">{user.handle}</p>
                                    </div>
                                </div>
                            </td>
                            <td className="px-8 py-5 text-sm text-slate-500 dark:text-slate-400">{user.email}</td>
                            <td className="px-8 py-5 text-sm">{user.country}</td>
                            <td className="px-8 py-5 text-sm font-medium">{user.kyc}</td>
                            <td className="px-8 py-5">
                                <span className={`px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1.5 w-fit ${user.color}`}>
                                    <span className="w-1.5 h-1.5 rounded-full bg-current" />
                                    {user.status}
                                </span>
                            </td>
                            <td className="px-8 py-5 text-center">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation(); // Prevents clicking the button from triggering the row click twice
                                        onViewUser(user);
                                    }}
                                    className="bg-slate-900 dark:bg-white text-white dark:text-black px-5 py-2 rounded-xl text-xs font-bold hover:opacity-80 transition-all"
                                >
                                    View
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination Placeholder */}
            <div className="p-6 border-t border-border flex items-center justify-between">
                <p className="text-sm text-slate-400">Showing <span className="font-bold text-foreground">10</span> of 50</p>
                <div className="flex gap-2">
                    {[1, 2, 3].map(page => (
                        <button key={page} className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold transition-all ${page === 1 ? 'bg-brand text-white' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
                            {page}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}