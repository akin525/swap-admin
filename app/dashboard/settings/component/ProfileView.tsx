"use client";

import React from 'react';
import { User, Mail, Phone, Cake, UserCircle } from 'lucide-react';

export default function ProfileView() {
    return (
        <div className="max-w-5xl">
            {/* Header Section */}
            <div className="mb-8">
                <h2 className="text-xl font-bold text-[#101828]">Profile</h2>
                <p className="text-sm text-gray-500 mt-1">
                    Update your photo and personal details here.
                </p>
                <div className="h-px bg-gray-100 w-full mt-6" />
            </div>

            {/* Form Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">

                {/* First Name */}
                <div className="space-y-2">
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        First Name
                    </label>
                    <div className="relative group">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#7F56D9] transition-colors" size={18} />
                        <input
                            type="text"
                            defaultValue="Emmy"
                            className="w-full bg-white border border-gray-200 rounded-xl py-3.5 pl-12 pr-4 text-sm focus:ring-2 focus:ring-purple-50 focus:border-[#7F56D9] outline-none transition-all"
                        />
                    </div>
                </div>

                {/* Last Name */}
                <div className="space-y-2">
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        Last Name
                    </label>
                    <div className="relative group">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#7F56D9] transition-colors" size={18} />
                        <input
                            type="text"
                            defaultValue="Baba"
                            className="w-full bg-white border border-gray-200 rounded-xl py-3.5 pl-12 pr-4 text-sm focus:ring-2 focus:ring-purple-50 focus:border-[#7F56D9] outline-none transition-all"
                        />
                    </div>
                </div>

                {/* Email Address */}
                <div className="space-y-2">
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        Email Address
                    </label>
                    <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#7F56D9] transition-colors" size={18} />
                        <input
                            type="email"
                            defaultValue="uihutofficial@gmail.com"
                            className="w-full bg-white border border-gray-200 rounded-xl py-3.5 pl-12 pr-4 text-sm focus:ring-2 focus:ring-purple-50 focus:border-[#7F56D9] outline-none transition-all text-gray-600"
                        />
                    </div>
                </div>

                {/* Phone Number */}
                <div className="space-y-2">
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        Phone Number
                    </label>
                    <div className="relative group">
                        <UserCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#7F56D9] transition-colors" size={18} />
                        <input
                            type="text"
                            defaultValue="08168192858"
                            className="w-full bg-white border border-gray-200 rounded-xl py-3.5 pl-12 pr-16 text-sm focus:ring-2 focus:ring-purple-50 focus:border-[#7F56D9] outline-none transition-all text-gray-600"
                        />
                        <button className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-[#7F56D9] hover:underline">
                            edit
                        </button>
                    </div>
                </div>

                {/* Date of Birth */}
                <div className="space-y-2">
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        Date Of Birth
                    </label>
                    <div className="relative group">
                        <Cake className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#7F56D9] transition-colors" size={18} />
                        <input
                            type="text"
                            defaultValue="07.12.195"
                            className="w-full bg-white border border-gray-200 rounded-xl py-3.5 pl-12 pr-4 text-sm focus:ring-2 focus:ring-purple-50 focus:border-[#7F56D9] outline-none transition-all text-gray-600"
                        />
                    </div>
                </div>

                {/* Gender */}
                <div className="space-y-2">
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        Gender
                    </label>
                    <div className="relative group">
                        <UserCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#7F56D9] transition-colors" size={18} />
                        <input
                            type="text"
                            defaultValue="Male"
                            className="w-full bg-white border border-gray-200 rounded-xl py-3.5 pl-12 pr-4 text-sm focus:ring-2 focus:ring-purple-50 focus:border-[#7F56D9] outline-none transition-all text-gray-600"
                        />
                    </div>
                </div>

            </div>
        </div>
    );
}