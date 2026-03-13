"use client";

import React from 'react';
import { X, Upload, Trash2, Plus, Image as ImageIcon, Save, DollarSign, Globe, Settings } from 'lucide-react';

interface EditBrandModalProps {
    isOpen: boolean;
    onClose: () => void;
    brandName?: string;
}

export default function EditBrandModal({ isOpen, onClose, brandName = "Amazon" }: EditBrandModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">

            {/* Modal Container: Max Height 95vh, Flex Column for Sticky Header/Footer */}
            <div className="bg-[#F8F9FB] w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh] animate-in fade-in zoom-in duration-200">

                {/* 1. PINNED HEADER */}
                <div className="bg-white px-6 py-4 border-b border-gray-100 flex justify-between items-center shrink-0 z-10">
                    <div>
                        <h2 className="text-lg md:text-xl font-bold text-slate-800 flex items-center gap-2">
                            Edit Brand: <span className="text-indigo-600">{brandName}</span>
                        </h2>
                        <p className="text-xs text-gray-400 mt-0.5">Manage details, pricing, and assets for this gift card.</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-50 rounded-full transition-colors text-gray-400 hover:text-gray-600"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* 2. SCROLLABLE CONTENT */}
                <div className="flex-1 overflow-y-auto p-4 md:p-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">

                        {/* LEFT COLUMN: Details & Pricing */}
                        <div className="space-y-6">

                            {/* Brand Details Card */}
                            <div className="bg-white p-5 md:p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                                <div className="flex items-center gap-2 border-b border-gray-50 pb-3 mb-2">
                                    <Settings size={18} className="text-indigo-500" />
                                    <h3 className="font-bold text-slate-800 text-sm">General Information</h3>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1.5">Brand Name</label>
                                        <input
                                            type="text"
                                            defaultValue={brandName}
                                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-semibold text-slate-700"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1.5">Category</label>
                                            <select className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all cursor-pointer font-medium text-slate-700">
                                                <option>Shopping</option>
                                                <option>Entertainment</option>
                                                <option>Gaming</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1.5">Status</label>
                                            <select className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all cursor-pointer font-medium text-slate-700">
                                                <option value="active">Active</option>
                                                <option value="inactive">Inactive</option>
                                                <option value="draft">Draft</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Pricing Table Card */}
                            <div className="bg-white p-5 md:p-6 rounded-2xl border border-gray-100 shadow-sm">
                                <div className="flex items-center justify-between border-b border-gray-50 pb-3 mb-4">
                                    <div className="flex items-center gap-2">
                                        <DollarSign size={18} className="text-emerald-500" />
                                        <h3 className="font-bold text-slate-800 text-sm">Denominations</h3>
                                    </div>
                                    <span className="text-xs font-medium text-gray-400">3 Active variants</span>
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="w-full text-xs text-left min-w-[300px]">
                                        <thead className="text-gray-400 font-bold uppercase bg-gray-50/50 rounded-lg">
                                        <tr>
                                            <th className="px-3 py-2 rounded-l-lg">Value</th>
                                            <th className="px-3 py-2">Cost</th>
                                            <th className="px-3 py-2">Price</th>
                                            <th className="px-3 py-2">Stock</th>
                                            <th className="px-3 py-2 text-center rounded-r-lg">Action</th>
                                        </tr>
                                        </thead>
                                        <tbody className="text-slate-700 font-medium">
                                        {[10, 25, 50].map((val) => (
                                            <tr key={val} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                                                <td className="px-3 py-3 font-bold">${val}</td>
                                                <td className="px-3 py-3 text-gray-500">${val * 0.95}</td>
                                                <td className="px-3 py-3 text-emerald-600 font-bold">${val * 1.05}</td>
                                                <td className="px-3 py-3">
                                                    <span className="bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded text-[10px] font-bold">250</span>
                                                </td>
                                                <td className="px-3 py-3 flex justify-center gap-2">
                                                    <button className="p-1.5 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600 transition-colors">
                                                        <Settings size={14} />
                                                    </button>
                                                    <button className="p-1.5 hover:bg-red-50 rounded text-red-400 hover:text-red-600 transition-colors">
                                                        <Trash2 size={14} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                                <button className="w-full mt-4 py-3 bg-white border border-dashed border-indigo-300 text-indigo-600 rounded-xl text-xs font-bold hover:bg-indigo-50 transition-all flex items-center justify-center gap-2">
                                    <Plus size={14} /> Add New Denomination
                                </button>
                            </div>
                        </div>

                        {/* RIGHT COLUMN: Assets & Settings */}
                        <div className="space-y-6">

                            {/* Logo Upload Card */}
                            <div className="bg-white p-5 md:p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                                <div className="flex items-center gap-2 border-b border-gray-50 pb-3 mb-2">
                                    <ImageIcon size={18} className="text-orange-500" />
                                    <h3 className="font-bold text-slate-800 text-sm">Brand Assets</h3>
                                </div>

                                <div className="border-2 border-dashed border-gray-200 rounded-2xl p-6 flex flex-col items-center justify-center bg-gray-50/30 group hover:border-indigo-400 hover:bg-indigo-50/10 transition-all cursor-pointer relative overflow-hidden">
                                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-indigo-500 mb-3 shadow-sm border border-gray-100 group-hover:scale-110 transition-transform">
                                        <Upload size={20} />
                                    </div>
                                    <p className="text-xs font-bold text-slate-600 text-center">Click to upload logo</p>
                                    <p className="text-[10px] text-gray-400 mt-1">SVG, PNG, JPG (max. 2mb)</p>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <button className="py-2.5 bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-xl text-xs font-bold hover:bg-indigo-100 transition-colors">
                                        Choose File
                                    </button>
                                    <button className="py-2.5 bg-white border border-gray-200 text-gray-500 rounded-xl text-xs font-bold hover:bg-gray-50 hover:text-red-500 transition-colors">
                                        Remove Logo
                                    </button>
                                </div>
                            </div>

                            {/* Restrictions Card */}
                            <div className="bg-white p-5 md:p-6 rounded-2xl border border-gray-100 shadow-sm space-y-5">
                                <div className="flex items-center gap-2 border-b border-gray-50 pb-3">
                                    <Globe size={18} className="text-blue-500" />
                                    <h3 className="font-bold text-slate-800 text-sm">Regional Settings</h3>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1.5">Daily Limit</label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-bold">$</span>
                                            <input type="number" defaultValue="1000" className="w-full pl-6 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold text-slate-700 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1.5">Monthly Limit</label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-bold">$</span>
                                            <input type="number" defaultValue="5000" className="w-full pl-6 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold text-slate-700 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none" />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-xs font-bold text-slate-700 mb-3 uppercase tracking-wider">Restricted Countries</h4>
                                    <div className="space-y-2.5">
                                        {['Nigeria', 'Ghana', 'United States', 'South Africa'].map((c, i) => (
                                            <label key={c} className="flex items-center gap-3 cursor-pointer group hover:bg-gray-50 p-2 rounded-lg -mx-2 transition-colors">
                                                <div className="relative flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        defaultChecked={i === 0}
                                                        className="peer h-4 w-4 cursor-pointer appearance-none rounded border border-gray-300 shadow-sm checked:border-indigo-600 checked:bg-indigo-600 focus:ring-2 focus:ring-indigo-500/20"
                                                    />
                                                    <svg className="pointer-events-none absolute left-0 top-0 h-4 w-4 opacity-0 peer-checked:opacity-100 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                                        <polyline points="20 6 9 17 4 12" />
                                                    </svg>
                                                </div>
                                                <span className="text-xs font-medium text-slate-600 group-hover:text-slate-900">{c}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. PINNED FOOTER */}
                <div className="p-5 bg-white border-t border-gray-100 flex flex-col sm:flex-row justify-end gap-3 shrink-0 z-10">
                    <button
                        onClick={onClose}
                        className="w-full sm:w-auto px-6 py-3 border border-gray-200 text-gray-600 rounded-xl text-xs font-bold hover:bg-gray-50 hover:text-gray-900 transition-colors"
                    >
                        Cancel
                    </button>
                    <button className="w-full sm:w-auto px-8 py-3 bg-indigo-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2">
                        <Save size={16} /> Save Changes
                    </button>
                </div>

            </div>
        </div>
    );
}