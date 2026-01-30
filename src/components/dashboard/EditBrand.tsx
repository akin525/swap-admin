"use client";

import React from 'react';
import { Upload, Trash2, ChevronDown } from 'lucide-react';

export function EditBrandPage({ brandName = "Amazon" }) {
    return (
        <div className="space-y-8 animate-in fade-in duration-500 max-w-[1400px] mx-auto">
            {/* Using text-foreground for dynamic heading color */}
            <h1 className="text-3xl font-bold px-2 text-foreground">
                Edit Brand: <span className="ml-4 opacity-70">{brandName}</span>
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column: Details & Pricing */}
                <div className="space-y-8">
                    {/* Replaced hardcoded bg-white/slate-900 with bg-card and border-border */}
                    <div className="bg-card border border-border p-8 rounded-[2rem] space-y-6 shadow-sm">
                        <h3 className="font-bold text-xl">Brand Details</h3>

                        <div className="space-y-5">
                            <InputField label="Brand Name" defaultValue="Amazon" />

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Category</label>
                                <div className="relative">
                                    <select className="w-full bg-slate-50 dark:bg-slate-800/50 border border-border rounded-xl p-4 appearance-none outline-none font-medium text-foreground">
                                        <option>Shopping</option>
                                        <option>Gaming</option>
                                    </select>
                                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Status</label>
                                <div className="flex gap-10">
                                    <RadioButton label="Active" name="status" checked />
                                    <RadioButton label="inactive" name="status" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Description</label>
                                <textarea
                                    defaultValue="Amzon gift cards for shopping"
                                    className="w-full bg-slate-50 dark:bg-slate-800/50 border border-border rounded-xl p-4 text-sm font-medium outline-none focus:ring-2 focus:ring-brand/20 h-24 resize-none text-foreground"
                                />
                            </div>
                        </div>

                        {/* Denominations & Pricing - Inner Card Style */}
                        <div className="bg-background border border-border rounded-3xl p-6 mt-6">
                            <h3 className="font-bold text-lg mb-6">Denominations & Pricing</h3>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                    <tr className="text-slate-400 text-[10px] uppercase tracking-widest border-b border-border">
                                        <th className="pb-4 font-semibold">Value</th>
                                        <th className="pb-4 font-semibold">Cost</th>
                                        <th className="pb-4 font-semibold">Sell Price</th>
                                        <th className="pb-4 font-semibold text-center">Margin</th>
                                        <th className="pb-4 font-semibold text-center">Stock</th>
                                        <th className="pb-4 font-semibold text-right">Action</th>
                                    </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border">
                                    <PricingRow value="$10" cost="$9.50" sell="$10.50" margin="10%" stock="250" />
                                    <PricingRow value="$25" cost="$23.75" sell="$26.25" margin="10%" stock="150" />
                                    <PricingRow value="$50" cost="$47.50" sell="$52.50" margin="10%" stock="100" />
                                    <PricingRow value="$100" cost="$95.00" sell="$105.00" margin="10%" stock="50" />
                                    </tbody>
                                </table>
                            </div>
                            <button className="w-full mt-6 bg-brand hover:brightness-110 text-white py-4 rounded-2xl font-bold text-sm transition-all shadow-lg shadow-brand/20">
                                Add New Denomination
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Column: Assets & Restrictions */}
                <div className="space-y-8">
                    <div className="bg-card border border-border p-8 rounded-[2rem] space-y-6 shadow-sm">
                        <h3 className="font-bold text-xl">Logo & Assets</h3>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Brand Name</p>

                        <div className="border-2 border-dashed border-brand/40 rounded-3xl p-10 flex flex-col items-center justify-center text-center space-y-4 bg-brand/5 dark:bg-brand/10 transition-colors">
                            <div className="w-10 h-10 bg-brand/20 text-brand rounded-full flex items-center justify-center">
                                <Upload size={20} />
                            </div>
                            <div>
                                <p className="text-sm font-bold">Click to upload logo <span className="text-slate-400 font-normal">or drag and drop</span></p>
                                <p className="text-[10px] text-slate-400 mt-1">PDF (max. 2mb)</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <button className="flex-1 bg-brand text-white py-4 rounded-2xl font-bold text-sm hover:brightness-110 transition-all shadow-md">Upload New Logo</button>
                            <button className="flex-1 border border-brand text-brand py-4 rounded-2xl font-bold text-sm hover:bg-brand hover:text-white transition-all">Remove</button>
                        </div>
                    </div>

                    <div className="bg-card border border-border p-8 rounded-[2rem] space-y-8 shadow-sm">
                        <div className="space-y-6">
                            <h3 className="font-bold text-xl">Settings & Restrictions</h3>
                            <div className="grid grid-cols-2 gap-6">
                                <InputField label="Daily Limit" defaultValue="$1,000" isSelect />
                                <InputField label="Monthly Limit" defaultValue="$5,000" isSelect />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Country Restrictions</p>
                            <div className="space-y-4">
                                <Checkbox label="Nigeria" checked />
                                <Checkbox label="Ghana" />
                                <Checkbox label="United States" />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Auto-restock Settings</p>
                            <div className="flex items-center gap-3 mb-6">
                                <input type="checkbox" defaultChecked className="w-5 h-5 rounded-full accent-brand cursor-pointer" />
                                <span className="text-sm font-bold opacity-80">Enable auto-restock</span>
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <InputField label="Minimum Stock" defaultValue="25" isSelect />
                                <InputField label="Reorder Quantity" defaultValue="100" isSelect />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Actions */}
            <div className="flex justify-end gap-6 pt-10 border-t border-border">
                <button className="px-14 py-4 border border-brand text-brand rounded-2xl font-extrabold text-sm hover:bg-brand/5 transition-all active:scale-95">Cancel</button>
                <button className="px-14 py-4 bg-brand text-white rounded-2xl font-extrabold text-sm shadow-xl shadow-brand/30 hover:brightness-110 transition-all active:scale-95">Save</button>
            </div>
        </div>
    );
}

// Reusable Sub-components
function InputField({ label, defaultValue, isSelect = false }: any) {
    return (
        <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">{label}</label>
            <div className="relative">
                <input
                    type="text"
                    defaultValue={defaultValue}
                    className="w-full bg-slate-50 dark:bg-slate-800/50 border border-border rounded-xl p-4 text-sm font-semibold outline-none focus:ring-2 focus:ring-brand/20 transition-all text-foreground"
                />
                {isSelect && <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />}
            </div>
        </div>
    );
}

function PricingRow({ value, cost, sell, margin, stock }: any) {
    return (
        <tr className="group">
            <td className="py-5 font-bold text-slate-400 text-sm">{value}</td>
            <td className="py-5 font-bold text-foreground text-sm">{cost}</td>
            <td className="py-5 font-bold text-foreground text-sm">{sell}</td>
            <td className="py-5 font-bold text-foreground text-sm text-center">{margin}</td>
            <td className="py-5 font-bold text-foreground text-sm text-center">{stock}</td>
            <td className="py-5 text-right space-x-2 whitespace-nowrap">
                <button className="px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-black rounded-lg font-bold text-[10px] uppercase hover:opacity-80 transition-all">Edit</button>
                <button className="px-4 py-2 bg-red-500 text-white rounded-lg font-bold text-[10px] uppercase hover:bg-red-600 transition-all">Del</button>
            </td>
        </tr>
    );
}

function RadioButton({ label, name, checked = false }: any) {
    return (
        <label className="flex items-center gap-3 cursor-pointer group">
            <div className="relative flex items-center justify-center">
                <input
                    type="radio"
                    name={name}
                    defaultChecked={checked}
                    className="peer w-5 h-5 border-2 border-border rounded-full bg-transparent checked:border-brand transition-all appearance-none cursor-pointer"
                />
                <div className="absolute w-2.5 h-2.5 bg-brand rounded-full scale-0 peer-checked:scale-100 transition-transform duration-200" />
            </div>
            <span className="text-sm font-bold text-slate-500 dark:text-slate-400 group-hover:text-foreground capitalize">{label}</span>
        </label>
    );
}

function Checkbox({ label, checked = false }: any) {
    return (
        <label className="flex items-center gap-4 cursor-pointer group">
            <div className="relative flex items-center justify-center">
                <input
                    type="checkbox"
                    defaultChecked={checked}
                    className="peer w-6 h-6 border-2 border-border rounded-full bg-transparent checked:border-brand transition-all appearance-none cursor-pointer"
                />
                <div className="absolute w-3 h-3 bg-brand rounded-full scale-0 peer-checked:scale-100 transition-transform duration-200" />
            </div>
            <span className="text-base font-bold text-slate-700 dark:text-slate-300 group-hover:text-brand transition-colors">{label}</span>
        </label>
    );
}