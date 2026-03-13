"use client";

import React from 'react';
import { X, ChevronDown } from 'lucide-react';

interface AddMemberModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AddMemberModal({ isOpen, onClose }: AddMemberModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Semi-transparent Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-[1px] transition-opacity"
                onClick={onClose}
            />

            {/* Popup Frame Design */}
            <div className="relative bg-white w-full max-w-[540px] rounded-[24px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">

                {/* Header */}
                <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100">
                    <h3 className="text-xl font-bold text-[#101828]">Add New Member</h3>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-100 rounded-full transition-colors group"
                    >
                        <X size={24} className="text-gray-400 group-hover:text-gray-600" />
                    </button>
                </div>

                {/* Form Body */}
                <form className="p-8 space-y-6" onSubmit={(e) => e.preventDefault()}>

                    {/* Email Input */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-[#101828]">Email ID</label>
                        <input
                            type="email"
                            placeholder="emmy@email.com"
                            className="w-full border border-gray-200 rounded-xl py-3.5 px-4 text-sm focus:ring-2 focus:ring-purple-50 focus:border-[#7F56D9] outline-none transition-all placeholder:text-gray-400"
                        />
                    </div>

                    {/* Role Selection */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-[#101828]">Select Role</label>
                        <div className="relative">
                            <select className="w-full appearance-none bg-white border border-gray-200 rounded-xl py-3.5 px-4 text-sm focus:ring-2 focus:ring-purple-50 focus:border-[#7F56D9] outline-none cursor-pointer pr-10">
                                <option>Member</option>
                                <option>Admin</option>
                                <option>Super Admin</option>
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                        </div>
                    </div>

                    {/* Department Selection */}
                    <div className="space-y-4">
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
                                        <X className="absolute h-3 w-3 text-white opacity-0 peer-checked:opacity-100 left-1 pointer-events-none rotate-45" strokeWidth={4} />
                                    </div>
                                    <span className="text-sm text-gray-600 font-medium group-hover:text-gray-900 transition-colors">
                    {dept}
                  </span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Invite Button */}
                    <div className="pt-4 pb-2">
                        <button
                            type="submit"
                            className="w-full bg-[#7F56D9] text-white py-4 rounded-xl font-bold text-sm hover:bg-[#6941C6] shadow-lg shadow-purple-100 transition-all active:scale-[0.98]"
                        >
                            Send Invite
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}