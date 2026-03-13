"use client";

import React, { useState } from 'react';

export default function ChangePasswordView() {
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    return (
        <div className="max-w-2xl animate-in fade-in duration-500">
            {/* Section Header */}
            <div className="mb-8">
                <h2 className="text-xl font-bold text-[#101828]">Change Password</h2>
                <div className="h-px bg-gray-100 w-full mt-6" />
            </div>

            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                {/* Current Password Field */}
                <div className="space-y-2">
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        Current Password
                    </label>
                    <input
                        type="password"
                        placeholder="Enter current password"
                        className="w-full bg-white border border-gray-200 rounded-xl py-3.5 px-4 text-sm placeholder:text-gray-300 focus:ring-2 focus:ring-purple-50 focus:border-[#7F56D9] outline-none transition-all"
                        value={formData.currentPassword}
                        onChange={(e) => setFormData({...formData, currentPassword: e.target.value})}
                    />
                </div>

                {/* New Password Field */}
                <div className="space-y-2">
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        New Password
                    </label>
                    <input
                        type="password"
                        placeholder="Enter new current password"
                        className="w-full bg-white border border-gray-200 rounded-xl py-3.5 px-4 text-sm placeholder:text-gray-300 focus:ring-2 focus:ring-purple-50 focus:border-[#7F56D9] outline-none transition-all"
                        value={formData.newPassword}
                        onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
                    />
                </div>

                {/* Confirm Password Field */}
                <div className="space-y-2">
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        Confirm Password
                    </label>
                    <input
                        type="password"
                        placeholder="Enter confirm password"
                        className="w-full bg-white border border-gray-200 rounded-xl py-3.5 px-4 text-sm placeholder:text-gray-300 focus:ring-2 focus:ring-purple-50 focus:border-[#7F56D9] outline-none transition-all"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                    />
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                    <button
                        type="submit"
                        className="bg-[#7F56D9] text-white px-8 py-3 rounded-lg text-sm font-semibold hover:bg-[#6941C6] active:scale-95 transition-all shadow-sm"
                    >
                        Change Password
                    </button>
                </div>
            </form>
        </div>
    );
}