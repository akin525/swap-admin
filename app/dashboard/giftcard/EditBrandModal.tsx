"use client";

import React, { useState, useEffect } from 'react';
import {
    X, Upload, Trash2, Plus, Image as ImageIcon,
    Save, DollarSign, Globe, Settings, Loader2,
    Check, AlertCircle
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'react-hot-toast';

interface EditBrandModalProps {
    isOpen: boolean;
    onClose: () => void;
    brandId: string | number | null;
    onUpdate?: () => void;
}

interface Denomination {
    id: number;
    value: string;
    cost: string;
    price: string;
    stock: string;
}

interface BrandFormData {
    name: string;
    category: string;
    status: string;
    daily_limit: number;
    monthly_limit: number;
    restricted_countries: string[];
}

export default function EditBrandModal({ isOpen, onClose, brandId, onUpdate }: EditBrandModalProps) {
    const { token } = useAuth();
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    // Form State
    const [formData, setFormData] = useState<BrandFormData>({
        name: '',
        category: 'Shopping',
        status: 'active',
        daily_limit: 0,
        monthly_limit: 0,
        restricted_countries: []
    });

    // Denominations State
    const [denominations, setDenominations] = useState<Denomination[]>([]);
    const [newDenom, setNewDenom] = useState({ value: '', cost: '', price: '', stock: '' });
    const [isAddingDenom, setIsAddingDenom] = useState(false);

    // 1. Fetch Data on Open
    useEffect(() => {
        if (isOpen && brandId && token) {
            setLoading(true);
            const API_URL = process.env.NEXT_PUBLIC_API_URL;

            fetch(`${API_URL}/brands/${brandId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            })
                .then(res => res.json())
                .then(res => {
                    if(res.success) {
                        const d = res.data;
                        setFormData({
                            name: d.name,
                            category: d.category,
                            status: d.status,
                            daily_limit: d.limits?.daily || 0,
                            monthly_limit: d.limits?.monthly || 0,
                            restricted_countries: d.countries || []
                        });
                        setDenominations(d.denominations || []);
                    } else {
                        toast.error("Failed to load brand details");
                        onClose();
                    }
                })
                .catch(() => {
                    toast.error("Network error");
                    onClose();
                })
                .finally(() => setLoading(false));
        } else if (isOpen && !brandId) {
            // Reset for "Add New" mode
            setFormData({
                name: '',
                category: 'Shopping',
                status: 'active',
                daily_limit: 0,
                monthly_limit: 0,
                restricted_countries: []
            });
            setDenominations([]);
            setLoading(false);
        }
    }, [isOpen, brandId, token]);

    // 2. Handle Main Form Submit
    const handleSave = async () => {
        setSaving(true);
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const method = brandId ? 'PUT' : 'POST';
        const url = brandId ? `${API_URL}/brands/${brandId}` : `${API_URL}/brands`;

        try {
            const res = await fetch(url, {
                method,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    ...formData,
                    countries: formData.restricted_countries
                })
            });

            const data = await res.json();
            if (data.success) {
                toast.success(brandId ? "Brand updated successfully" : "Brand created successfully");
                if (onUpdate) onUpdate();
                onClose();
            } else {
                toast.error(data.message || "Operation failed");
            }
        } catch (error) {
            toast.error("Network error");
        } finally {
            setSaving(false);
        }
    };

    // 3. Handle Add Denomination
    const handleAddDenom = async () => {
        // Just local state update for now (or API call if preferred)
        if (!newDenom.value || !newDenom.price) {
            toast.error("Please fill required fields");
            return;
        }

        const newId = Date.now(); // Temp ID
        const denom: Denomination = {
            id: newId,
            value: newDenom.value,
            cost: newDenom.cost,
            price: newDenom.price,
            stock: newDenom.stock
        };

        setDenominations([...denominations, denom]);
        setNewDenom({ value: '', cost: '', price: '', stock: '' });
        setIsAddingDenom(false);
        toast.success("Variant added (Save to persist)");
    };

    // 4. Handle Delete Denomination
    const handleDeleteDenom = (id: number) => {
        if(!confirm("Remove this variant?")) return;
        setDenominations(denominations.filter(d => d.id !== id));
    };

    // Toggle Country Helper
    const toggleCountry = (code: string) => {
        setFormData(prev => {
            const countries = prev.restricted_countries.includes(code)
                ? prev.restricted_countries.filter(c => c !== code)
                : [...prev.restricted_countries, code];
            return { ...prev, restricted_countries: countries };
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-gray-900/60 dark:bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-[#F8F9FB] dark:bg-[#0B0B15] w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh] animate-in zoom-in-95 duration-200 border border-gray-200 dark:border-gray-800">

                {/* Header */}
                <div className="bg-white dark:bg-[#13131F] px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center shrink-0 z-10">
                    <div>
                        <h2 className="text-lg md:text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                            {brandId ? 'Edit Brand:' : 'New Brand'}
                            <span className="text-[#7C5CFF]">{formData.name || (brandId ? 'Loading...' : '')}</span>
                        </h2>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Manage details, pricing, and assets.</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-50 dark:hover:bg-white/5 rounded-full transition-colors text-gray-400 dark:text-gray-500"
                    >
                        <X size={20}/>
                    </button>
                </div>

                {loading ? (
                    <div className="flex-1 flex flex-col items-center justify-center h-64 gap-3">
                        <Loader2 className="animate-spin text-[#7C5CFF]" size={40} />
                        <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Loading Data...</p>
                    </div>
                ) : (
                    <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">

                            {/* LEFT COLUMN */}
                            <div className="space-y-6">
                                {/* General Info */}
                                <div className="bg-white dark:bg-[#13131F] p-5 md:p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-5">
                                    <div className="flex items-center gap-2 border-b border-gray-50 dark:border-gray-800 pb-3 mb-2">
                                        <Settings size={18} className="text-[#7C5CFF]" />
                                        <h3 className="font-bold text-slate-800 dark:text-white text-sm">General Information</h3>
                                    </div>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase block mb-1.5">Brand Name</label>
                                            <input
                                                value={formData.name}
                                                onChange={e => setFormData({...formData, name: e.target.value})}
                                                placeholder="e.g. Amazon, Apple"
                                                className="w-full p-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-bold text-slate-700 dark:text-white focus:bg-white dark:focus:bg-black/40 focus:ring-2 focus:ring-[#7C5CFF]/20 focus:border-[#7C5CFF] outline-none transition-all"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase block mb-1.5">Category</label>
                                                <div className="relative">
                                                    <select
                                                        value={formData.category}
                                                        onChange={e => setFormData({...formData, category: e.target.value})}
                                                        className="w-full p-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium text-slate-700 dark:text-white outline-none appearance-none focus:border-[#7C5CFF]"
                                                    >
                                                        <option>Shopping</option>
                                                        <option>Gaming</option>
                                                        <option>Music</option>
                                                        <option>Streaming</option>
                                                        <option>Electronics</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase block mb-1.5">Status</label>
                                                <select
                                                    value={formData.status}
                                                    onChange={e => setFormData({...formData, status: e.target.value})}
                                                    className="w-full p-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium text-slate-700 dark:text-white outline-none appearance-none focus:border-[#7C5CFF]"
                                                >
                                                    <option value="active">Active</option>
                                                    <option value="inactive">Inactive</option>
                                                    <option value="maintenance">Maintenance</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Pricing Table */}
                                <div className="bg-white dark:bg-[#13131F] p-5 md:p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
                                    <div className="flex items-center justify-between border-b border-gray-50 dark:border-gray-800 pb-3 mb-4">
                                        <div className="flex items-center gap-2">
                                            <DollarSign size={18} className="text-emerald-500" />
                                            <h3 className="font-bold text-slate-800 dark:text-white text-sm">Denominations</h3>
                                        </div>
                                        <span className="text-xs font-medium text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-white/5 px-2 py-1 rounded-lg">
                                            {denominations.length} Variants
                                        </span>
                                    </div>

                                    <div className="overflow-x-auto">
                                        <table className="w-full text-xs text-left">
                                            <thead className="text-gray-400 dark:text-gray-500 font-bold uppercase bg-gray-50/50 dark:bg-white/5">
                                            <tr>
                                                <th className="px-3 py-2 rounded-l-lg">Value</th>
                                                <th className="px-3 py-2">Cost</th>
                                                <th className="px-3 py-2">Price</th>
                                                <th className="px-3 py-2">Stock</th>
                                                <th className="px-3 py-2 text-center rounded-r-lg">Action</th>
                                            </tr>
                                            </thead>
                                            <tbody className="text-slate-700 dark:text-gray-300 font-medium">
                                            {denominations.map((d) => (
                                                <tr key={d.id} className="border-b border-gray-50 dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                                    <td className="px-3 py-3 font-bold text-slate-900 dark:text-white">${d.value}</td>
                                                    <td className="px-3 py-3 text-gray-500 dark:text-gray-400">${d.cost}</td>
                                                    <td className="px-3 py-3 text-emerald-600 dark:text-emerald-400 font-bold">${d.price}</td>
                                                    <td className="px-3 py-3">
                                                            <span className="bg-indigo-50 dark:bg-indigo-500/10 text-[#7C5CFF] dark:text-indigo-400 px-2 py-0.5 rounded text-[10px] font-bold">
                                                                {d.stock}
                                                            </span>
                                                    </td>
                                                    <td className="px-3 py-3 text-center">
                                                        <button
                                                            onClick={() => handleDeleteDenom(d.id)}
                                                            className="text-gray-400 hover:text-red-500 dark:text-gray-600 dark:hover:text-red-400 transition-colors"
                                                        >
                                                            <Trash2 size={14}/>
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                            {isAddingDenom && (
                                                <tr className="bg-indigo-50/30 dark:bg-indigo-900/10">
                                                    <td className="p-2"><input placeholder="10" className="w-full p-1.5 bg-white dark:bg-black/40 border border-indigo-200 dark:border-indigo-800 rounded text-center dark:text-white text-xs" onChange={e => setNewDenom({...newDenom, value: e.target.value})}/></td>
                                                    <td className="p-2"><input placeholder="9.5" className="w-full p-1.5 bg-white dark:bg-black/40 border border-indigo-200 dark:border-indigo-800 rounded text-center dark:text-white text-xs" onChange={e => setNewDenom({...newDenom, cost: e.target.value})}/></td>
                                                    <td className="p-2"><input placeholder="10.5" className="w-full p-1.5 bg-white dark:bg-black/40 border border-indigo-200 dark:border-indigo-800 rounded text-center dark:text-white text-xs" onChange={e => setNewDenom({...newDenom, price: e.target.value})}/></td>
                                                    <td className="p-2"><input placeholder="100" className="w-full p-1.5 bg-white dark:bg-black/40 border border-indigo-200 dark:border-indigo-800 rounded text-center dark:text-white text-xs" onChange={e => setNewDenom({...newDenom, stock: e.target.value})}/></td>
                                                    <td className="p-2 text-center">
                                                        <button onClick={handleAddDenom} className="bg-green-500 text-white p-1 rounded hover:bg-green-600"><Check size={14}/></button>
                                                    </td>
                                                </tr>
                                            )}
                                            </tbody>
                                        </table>
                                    </div>

                                    {!isAddingDenom && (
                                        <button
                                            onClick={() => setIsAddingDenom(true)}
                                            className="w-full mt-4 py-3 bg-white dark:bg-transparent border border-dashed border-indigo-200 dark:border-indigo-800 text-[#7C5CFF] dark:text-indigo-400 rounded-xl text-xs font-bold hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-all flex items-center justify-center gap-2"
                                        >
                                            <Plus size={14} /> Add New Variant
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* RIGHT COLUMN */}
                            <div className="space-y-6">
                                {/* Regional Settings */}
                                <div className="bg-white dark:bg-[#13131F] p-5 md:p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-5">
                                    <div className="flex items-center gap-2 border-b border-gray-50 dark:border-gray-800 pb-3">
                                        <Globe size={18} className="text-blue-500" />
                                        <h3 className="font-bold text-slate-800 dark:text-white text-sm">Regional Settings</h3>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase block mb-1.5">Daily Limit</label>
                                            <input
                                                type="number"
                                                value={formData.daily_limit}
                                                onChange={e => setFormData({...formData, daily_limit: parseFloat(e.target.value)})}
                                                className="w-full p-2.5 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-bold text-slate-700 dark:text-white outline-none focus:border-[#7C5CFF]"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase block mb-1.5">Monthly Limit</label>
                                            <input
                                                type="number"
                                                value={formData.monthly_limit}
                                                onChange={e => setFormData({...formData, monthly_limit: parseFloat(e.target.value)})}
                                                className="w-full p-2.5 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-bold text-slate-700 dark:text-white outline-none focus:border-[#7C5CFF]"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-bold text-slate-700 dark:text-gray-300 mb-3 uppercase tracking-wider flex items-center gap-2">
                                            <AlertCircle size={12} className="text-orange-500" /> Restricted Countries
                                        </h4>
                                        <div className="grid grid-cols-2 gap-2">
                                            {['NG', 'GH', 'US', 'ZA', 'UK', 'KE'].map((code) => (
                                                <label
                                                    key={code}
                                                    className={`flex items-center gap-3 cursor-pointer p-2 rounded-lg border transition-all ${
                                                        formData.restricted_countries.includes(code)
                                                            ? 'bg-red-50 border-red-100 dark:bg-red-900/20 dark:border-red-900/40'
                                                            : 'bg-white dark:bg-white/5 border-transparent hover:border-gray-200 dark:hover:border-gray-700'
                                                    }`}
                                                >
                                                    <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                                                        formData.restricted_countries.includes(code)
                                                            ? 'bg-red-500 border-red-500'
                                                            : 'border-gray-300 dark:border-gray-600'
                                                    }`}>
                                                        {formData.restricted_countries.includes(code) && <Check size={10} className="text-white" />}
                                                    </div>
                                                    <input
                                                        type="checkbox"
                                                        checked={formData.restricted_countries.includes(code)}
                                                        onChange={() => toggleCountry(code)}
                                                        className="hidden"
                                                    />
                                                    <span className={`text-xs font-bold ${
                                                        formData.restricted_countries.includes(code)
                                                            ? 'text-red-700 dark:text-red-400'
                                                            : 'text-gray-600 dark:text-gray-400'
                                                    }`}>
                                                        {code === 'NG' ? 'Nigeria' : code === 'GH' ? 'Ghana' : code === 'US' ? 'USA' : code === 'ZA' ? 'South Africa' : code === 'UK' ? 'UK' : 'Kenya'}
                                                    </span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                )}

                {/* Footer */}
                <div className="p-5 bg-white dark:bg-[#13131F] border-t border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row justify-end gap-3 shrink-0 z-10">
                    <button
                        onClick={onClose}
                        className="px-6 py-3 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 rounded-xl text-xs font-bold hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="px-8 py-3 bg-[#7C5CFF] text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-500/20 hover:bg-[#6A4DED] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {saving ? <Loader2 className="animate-spin" size={16}/> : <Save size={16} />}
                        {brandId ? 'Save Changes' : 'Create Brand'}
                    </button>
                </div>

            </div>
        </div>
    );
}