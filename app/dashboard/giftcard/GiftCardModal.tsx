"use client";

import { useEffect, useState } from 'react';
import { X, Copy, CheckCircle2, Gift, Loader2, AlertCircle, Calendar, User, Hash } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'react-hot-toast';

interface GiftCardModalProps {
    isOpen: boolean;
    onClose: () => void;
    txId: string | number | null;
}

export default function GiftCardModal({ isOpen, onClose, txId }: GiftCardModalProps) {
    const { token } = useAuth();
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen && txId && token) {
            setLoading(true);
            const API_URL = process.env.NEXT_PUBLIC_API_URL;

            fetch(`${API_URL}/giftcards/${txId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            })
                .then(res => res.json())
                .then(res => {
                    if (res.success) {
                        setData(res.data);
                    } else {
                        toast.error("Failed to load details");
                        onClose();
                    }
                })
                .catch(() => {
                    toast.error("Network error");
                    onClose();
                })
                .finally(() => setLoading(false));
        } else {
            setData(null);
        }
    }, [isOpen, txId, token]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 dark:bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-[#13131F] w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200 border border-gray-100 dark:border-gray-800">

                {/* Header */}
                <div className="p-5 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-white/5">
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                        <div className="p-1.5 bg-indigo-50 dark:bg-indigo-500/10 rounded-lg">
                            <Gift size={18} className="text-[#7C5CFF]" />
                        </div>
                        Transaction Details
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-200 dark:hover:bg-white/10 rounded-full text-gray-500 dark:text-gray-400 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
                    {loading || !data ? (
                        <div className="h-64 flex flex-col items-center justify-center gap-3 text-gray-400 dark:text-gray-600">
                            <Loader2 className="animate-spin text-[#7C5CFF]" size={32} />
                            <p className="text-xs font-bold uppercase tracking-widest">Retrieving data...</p>
                        </div>
                    ) : (
                        <div className="space-y-6">

                            {/* Brand & Status Card */}
                            <div className="relative overflow-hidden bg-gray-50 dark:bg-[#0B0B15] rounded-2xl p-6 border border-gray-100 dark:border-gray-800 text-center">
                                {/* Background Glow */}
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

                                <div className="relative z-10 flex flex-col items-center">
                                    <div className="w-16 h-16 bg-white dark:bg-[#13131F] rounded-2xl flex items-center justify-center text-[#7C5CFF] font-bold text-2xl shadow-sm border border-gray-100 dark:border-gray-700 mb-4">
                                        {data.brand ? data.brand[0] : 'G'}
                                    </div>
                                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{data.total}</h2>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-4">{data.brand} Gift Card</p>

                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                                        data.status?.toLowerCase() === 'completed' || data.status?.toLowerCase() === 'success'
                                            ? 'bg-green-50 text-green-700 border-green-100 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20'
                                            : 'bg-yellow-50 text-yellow-700 border-yellow-100 dark:bg-yellow-500/10 dark:text-yellow-400 dark:border-yellow-500/20'
                                    }`}>
                                        <span className={`w-1.5 h-1.5 rounded-full ${
                                            data.status?.toLowerCase() === 'completed' || data.status?.toLowerCase() === 'success' ? 'bg-green-500' : 'bg-yellow-500'
                                        }`} />
                                        {data.status}
                                    </span>
                                </div>
                            </div>

                            {/* Info Grid */}
                            <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                                <InfoItem
                                    label="Reference"
                                    value={data.reference}
                                    icon={<Hash size={14} />}
                                    isMono
                                />
                                <InfoItem
                                    label="Date"
                                    value={data.date}
                                    icon={<Calendar size={14} />}
                                />
                                <div className="col-span-2">
                                    <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                                        <User size={14} /> User
                                    </p>
                                    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-[#0B0B15] rounded-xl border border-gray-100 dark:border-gray-800">
                                        <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden border border-gray-100 dark:border-gray-600">
                                            {data.user.image ? (
                                                <img src={data.user.image} alt="" className="w-full h-full object-cover"/>
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-xs font-bold text-gray-500 dark:text-gray-400">
                                                    {data.user.name[0]}
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm text-gray-900 dark:text-white">{data.user.name}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">Recipient: {data.recipient}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Card Code Section */}
                            <div className="bg-[#0E0627] dark:bg-black p-5 rounded-xl relative overflow-hidden group shadow-lg shadow-indigo-500/20">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-[#7C5CFF]/20 rounded-full -mr-16 -mt-16 blur-2xl pointer-events-none" />

                                <div className="relative z-10">
                                    <div className="flex justify-between items-center mb-1">
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Card Code</p>
                                        {data.card_pin && <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">PIN: <span className="text-white font-mono">{data.card_pin}</span></p>}
                                    </div>

                                    <div className="flex items-center justify-between gap-4 mt-2">
                                        <p className="font-mono text-xl font-bold tracking-widest text-white truncate">
                                            {data.card_code || '****-****-****'}
                                        </p>
                                        <button
                                            onClick={() => {
                                                navigator.clipboard.writeText(data.card_code);
                                                toast.success("Code copied!");
                                            }}
                                            className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-white shrink-0"
                                            title="Copy Code"
                                        >
                                            <Copy size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Timeline */}
                            {data.timeline && (
                                <div className="bg-gray-50 dark:bg-[#0B0B15] rounded-xl p-5 border border-gray-100 dark:border-gray-800">
                                    <h4 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">Processing History</h4>
                                    <div className="space-y-0 pl-2">
                                        {data.timeline.map((step: any, i: number) => (
                                            <div key={i} className="flex gap-4 relative pb-6 last:pb-0">
                                                {/* Connecting Line */}
                                                {i !== data.timeline.length - 1 && (
                                                    <div className="absolute left-[9px] top-2.5 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-800" />
                                                )}

                                                <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 z-10 border-2 ${
                                                    step.status === 'done'
                                                        ? 'bg-green-500 border-green-500 text-white'
                                                        : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-300 dark:text-gray-600'
                                                }`}>
                                                    {step.status === 'done' && <CheckCircle2 size={12} strokeWidth={4} />}
                                                </div>

                                                <div className="-mt-1">
                                                    <p className={`text-sm font-bold ${step.status === 'done' ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-500'}`}>
                                                        {step.label}
                                                    </p>
                                                    <p className="text-xs text-gray-400 dark:text-gray-600">{step.time}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer */}
                {data && (
                    <div className="p-5 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-[#0B0B15] flex gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-bold text-sm hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
                        >
                            Close
                        </button>
                        <button className="flex-1 py-3 rounded-xl bg-[#7C5CFF] text-white font-bold text-sm hover:opacity-90 transition-colors shadow-lg shadow-indigo-500/20">
                            Download Receipt
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

// --- Helper Component ---

function InfoItem({ label, value, icon, isMono }: { label: string, value: string, icon: React.ReactNode, isMono?: boolean }) {
    return (
        <div>
            <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                {icon} {label}
            </p>
            <p className={`font-bold text-sm text-gray-900 dark:text-white ${isMono ? 'font-mono bg-gray-100 dark:bg-white/10 px-2 py-0.5 rounded w-fit' : ''}`}>
                {value}
            </p>
        </div>
    );
}