"use client";

import React, { useState } from 'react';
import { Plus, X, ChevronDown } from 'lucide-react';

// Sample data matching your design
const teamData = [
    { name: 'Daniel Okonjo', email: 'daniel.okonjo@email.com', dept: 'Operations', status: 'Active', role: 'Admin', date: 'Sep 4, 2025' },
    { name: 'Grace Adeniran', email: 'grace.adeniran@email.com', dept: 'Compliance', status: 'Active', role: 'Super Admin', date: 'Sep 4, 2025' },
    { name: 'Samuel Olabisi', email: 'samuel.olabisi@email.com', dept: 'Operations', status: 'Active', role: 'Admin', date: 'Sep 4, 2025' },
    { name: 'Esther Nwachukwu', email: 'esther.nwachukwu@email.com', dept: 'Accountant', status: 'Active', role: 'Super Admin', date: 'Sep 4, 2025' },
    { name: 'Michael Ayodele', email: 'michael.ayodele@email.com', dept: 'Operations', status: 'Pending', role: 'Admin', date: 'Sep 4, 2025' },
    { name: 'Deborah Ogunlana', email: 'deborah.ogunlana@email.com', dept: 'Compliance', status: 'Deactivated', role: 'Super Admin', date: 'Sep 4, 2025' },
    { name: 'David Ezeh', email: 'david.ezeh@email.com', dept: 'Accountant', status: 'Active', role: 'Super Admin', date: 'Sep 4, 2025' },
    { name: 'Ruth Akinyemi', email: 'ruth.akinyemi@email.com', dept: 'Operations', status: 'Pending', role: 'Admin', date: 'Sep 4, 2025' },
    { name: 'John Chukwuma', email: 'john.chukwuma@email.com', dept: 'Operations', status: 'Pending', role: 'Super Admin', date: 'Sep 4, 2025' },
];

export default function TeamView() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="relative">
            {/* Header Section */}
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h2 className="text-xl font-bold text-[#101828]">Team</h2>
                    <p className="text-sm text-gray-500">Manager your team member</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-[#7F56D9] text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#6941C6] transition-all flex items-center gap-2 shadow-sm"
                >
                    Add Team Member
                </button>
            </div>

            {/* Table Section */}
            <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse">
                    <thead>
                    <tr className="bg-white border-b border-gray-50 text-gray-400 text-xs font-semibold uppercase tracking-wider">
                        <th className="px-6 py-4">User</th>
                        <th className="px-6 py-4">E-mail</th>
                        <th className="px-6 py-4">Department</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4">Role</th>
                        <th className="px-6 py-4">Date Initiated</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                    {teamData.map((member, index) => (
                        <tr key={index} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 text-sm font-medium text-gray-700">{member.name}</td>
                            <td className="px-6 py-4 text-sm text-gray-500">{member.email}</td>
                            <td className="px-6 py-4 text-sm text-gray-500">{member.dept}</td>
                            <td className="px-6 py-4">
                                <StatusBadge status={member.status} />
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500">{member.role}</td>
                            <td className="px-6 py-4 text-sm text-gray-500">{member.date}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/* Modal Popup */}
            {isModalOpen && (
                <AddMemberModal onClose={() => setIsModalOpen(false)} />
            )}
        </div>
    );
}

/**
 * Status Badge Component
 */
function StatusBadge({ status }: { status: string }) {
    const configs: Record<string, string> = {
        Active: "bg-green-50 text-green-700",
        Pending: "bg-orange-50 text-orange-600",
        Deactivated: "bg-gray-100 text-gray-600",
    };

    const dotConfigs: Record<string, string> = {
        Active: "bg-green-500",
        Pending: "bg-orange-500",
        Deactivated: "bg-gray-400",
    };

    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${configs[status]}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${dotConfigs[status]}`} />
            {status}
        </span>
    );
}

/**
 * Add Member Modal Component
 */
function AddMemberModal({ onClose }: { onClose: () => void }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative bg-white w-full max-w-lg rounded-2xl shadow-2xl animate-in fade-in zoom-in duration-200 overflow-hidden">
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <h3 className="text-xl font-bold text-[#101828]">Add New Member</h3>
                    <button
                        onClick={onClose}
                        className="p-1.5 hover:bg-gray-100 rounded-full transition-colors group"
                    >
                        <X size={20} className="text-gray-400 group-hover:text-gray-600" />
                    </button>
                </div>

                <form className="p-8 space-y-6" onSubmit={(e) => e.preventDefault()}>
                    {/* Email ID */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-bold text-[#101828]">Email ID</label>
                        <input
                            type="email"
                            placeholder="emmy@email.com"
                            className="w-full border border-gray-200 rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-purple-50 focus:border-[#7F56D9] outline-none transition-all placeholder:text-gray-400"
                        />
                    </div>

                    {/* Select Role */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-bold text-[#101828]">Select Role</label>
                        <div className="relative group">
                            <select className="w-full appearance-none bg-white border border-gray-200 rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-purple-50 focus:border-[#7F56D9] outline-none cursor-pointer">
                                <option>Member</option>
                                <option>Admin</option>
                                <option>Super Admin</option>
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                <ChevronDown size={18} />
                            </div>
                        </div>
                    </div>

                    {/* Select Department */}
                    <div className="space-y-3">
                        <label className="text-sm font-bold text-[#101828]">Select Department</label>
                        <div className="space-y-3">
                            {['Operations', 'Compliance', 'Accountant'].map((dept) => (
                                <label key={dept} className="flex items-center gap-3 cursor-pointer group w-fit">
                                    <div className="relative flex items-center">
                                        <input
                                            type="checkbox"
                                            defaultChecked={dept === 'Accountant'}
                                            className="peer h-5 w-5 cursor-pointer appearance-none rounded border border-gray-300 checked:border-[#7F56D9] checked:bg-[#7F56D9] transition-all"
                                        />
                                        <svg
                                            className="absolute h-3.5 w-3.5 text-white opacity-0 peer-checked:opacity-100 left-[3px] pointer-events-none transition-opacity"
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <polyline points="20 6 9 17 4 12"></polyline>
                                        </svg>
                                    </div>
                                    <span className="text-sm text-gray-600 font-medium group-hover:text-gray-900 transition-colors">
                                        {dept}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Action Button */}
                    <div className="pt-4">
                        <button className="w-full bg-[#7F56D9] text-white py-4 rounded-xl font-bold hover:bg-[#6941C6] shadow-lg shadow-purple-100 transition-all active:scale-[0.98]">
                            Send Invite
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}