"use client";

import React, { useEffect, useState } from 'react';
import { X, CheckCircle2, Clock, AlertTriangle, Loader2, ShieldAlert } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'react-hot-toast';

interface TransactionModalProps {
    isOpen: boolean;
    onClose: () => void;
    txId: string | number | null;
    onUpdate?: () => void; // Callback to refresh parent list after action
}

export function TransactionModal({ isOpen, onClose, txId, onUpdate }: TransactionModalProps) {
    const { token } = useAuth();
    const [details, setDetails] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [processing, setProcessing] = useState(false); // For button loading states

    // 1. Fetch Details on Open
    useEffect(() => {
        if (isOpen && txId && token) {
            setLoading(true);
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

            fetch(`${API_URL}/admin/transactions/${txId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            })
                .then(res => res.json())
                .then(res => {
                    if (res.success) {
                        setDetails(res.data);
                    } else {
                        toast.error("Could not load transaction details");
                        onClose();
                    }
                })
                .catch(() => {
                    toast.error("Network error");
                    onClose();
                })
                .finally(() => setLoading(false));
        } else {
            setDetails(null);
        }
    }, [isOpen, txId, token]);

    // 2. Handle Actions (Approve/Reject)
    const handleAction = async (action: 'approve' | 'reject' | 'flag') => {
        if (!token || !txId) return;
        setProcessing(true);

        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

        try {
            const res = await fetch(`${API_URL}/admin/transactions/${txId}/status`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ action })
            });

            const data = await res.json();

            if (data.success) {
                toast.success(`Transaction ${action}d successfully`);
                if (onUpdate) onUpdate(); // Refresh parent
                onClose();
            } else {
                toast.error(data.message || "Action failed");
            }
        } catch (error) {
            toast.error("Network error processing request");
        } finally {
            setProcessing(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-2xl max-h-[95vh] overflow-y-auto bg-white rounded-3xl shadow-2xl p-5 md:p-8 animate-in zoom-in-95 duration-300 relative">

                {/* Loading State */}
                {loading || !details ? (
                    <div className="h-64 flex flex-col items-center justify-center gap-3">
                        <Loader2 className="animate-spin text-[#7C5CFF]" size={32} />
                        <p className="text-gray-400 text-sm font-bold">Loading details...</p>
                    </div>
                ) : (
                    <>
                        {/* Header */}
                        <header className="flex justify-between items-start md:items-center mb-6 md:mb-8 gap-4">
                            <div>
                                <h2 className="text-xl md:text-2xl font-bold text-gray-900">Transaction Details</h2>
                                <p className="text-xs md:text-sm text-gray-500 mt-1 font-medium">
                                    ID: <span className="font-mono text-gray-700">{details.id}</span>
                                    <span className="hidden sm:inline mx-2">•</span>
                                    <br className="sm:hidden" />
                                    Status:
                                    <span className={`ml-1 font-bold ${
                                        details.status.toLowerCase() === 'success' ? 'text-green-500' :
                                            details.status.toLowerCase() === 'failed' ? 'text-red-500' : 'text-orange-500'
                                    }`}>
                                        {details.status}
                                    </span>
                                </p>
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors shrink-0">
                                <X size={24}/>
                            </button>
                        </header>

                        {/* Data Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 mb-6 md:mb-8">

                            {/* Detailed Facts */}
                            <div className="bg-gray-50 rounded-2xl p-5 md:p-6 border border-gray-100 space-y-4">
                                <h3 className="font-bold text-sm text-gray-800 border-b border-gray-200 pb-2 uppercase tracking-wide">Transaction Data</h3>
                                <DetailRow label="Amount" value={details.amount} />
                                <DetailRow label="Fee" value={details.fee} />
                                <DetailRow label="User" value={details.user_name} />
                                <DetailRow label="Type" value={details.type} />
                                <DetailRow label="Method" value={details.method} />
                                <DetailRow label="Time" value={details.timestamp} />
                            </div>

                            {/* Risk Assessment */}
                            <div className={`rounded-2xl p-5 md:p-6 border space-y-4 ${
                                details.risk_info.level === 'High'
                                    ? 'bg-red-50/50 border-red-100'
                                    : 'bg-green-50/50 border-green-100'
                            }`}>
                                <h3 className={`font-bold text-sm border-b pb-2 flex items-center gap-2 ${
                                    details.risk_info.level === 'High' ? 'text-red-800 border-red-200' : 'text-green-800 border-green-200'
                                }`}>
                                    <ShieldAlert size={16}/> Risk Assessment
                                </h3>

                                <div className="flex justify-between items-center">
                                    <span className="text-xs font-bold text-gray-500">Score</span>
                                    <span className={`text-sm font-bold ${
                                        details.risk_info.level === 'High' ? 'text-red-600' : 'text-green-600'
                                    }`}>
                                        {details.risk_info.score}/100 ({details.risk_info.level})
                                    </span>
                                </div>

                                <ul className={`text-xs space-y-2 font-medium ${
                                    details.risk_info.level === 'High' ? 'text-red-600' : 'text-green-700'
                                }`}>
                                    {details.risk_info.flags.map((flag: string, i: number) => flag && (
                                        <li key={i}>• {flag}</li>
                                    ))}
                                    {details.risk_info.flags.length === 0 && <li>• No risk flags detected</li>}
                                </ul>
                            </div>
                        </div>

                        {/* Timeline */}
                        <div className="mb-8 px-2">
                            <h3 className="font-bold text-[10px] md:text-xs text-gray-400 uppercase tracking-widest mb-4">Processing Timeline</h3>
                            <div className="space-y-4 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-gray-100">
                                {details.timeline.map((step: any, idx: number) => (
                                    <TimelineItem
                                        key={idx}
                                        label={step.label}
                                        time={step.time}
                                        status={step.status}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Actions Footer */}
                        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-100">
                            <button
                                onClick={() => handleAction('approve')}
                                disabled={processing || details.status === 'Success'}
                                className="flex-1 bg-[#7C5CFF] text-white py-3.5 rounded-xl text-sm font-bold shadow-lg shadow-[#7C5CFF]/20 hover:bg-[#6A4DED] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {processing ? <Loader2 className="animate-spin" size={16}/> : <CheckCircle2 size={16} />}
                                Approve
                            </button>

                            <button
                                onClick={() => handleAction('reject')}
                                disabled={processing || details.status !== 'Pending'}
                                className="flex-1 bg-orange-500 text-white py-3.5 rounded-xl text-sm font-bold hover:bg-orange-600 transition-colors shadow-lg shadow-orange-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Reject
                            </button>

                            <button
                                onClick={() => handleAction('flag')}
                                disabled={processing}
                                className="flex-1 bg-[#0E0627] text-white py-3.5 rounded-xl text-sm font-bold hover:bg-black transition-colors disabled:opacity-50"
                            >
                                Request Info
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

// --- Helpers ---
function DetailRow({ label, value }: { label: string, value: string }) {
    return (
        <div className="flex justify-between text-xs border-b border-gray-100 pb-1 last:border-0 last:pb-0">
            <span className="text-gray-400 font-medium">{label}</span>
            <span className="font-bold text-gray-900 text-right">{value}</span>
        </div>
    );
}

function TimelineItem({ label, time, status }: { label: string, time: string, status: 'done' | 'warning' | 'pending' }) {
    const icons = {
        done: <CheckCircle2 size={24} className="text-green-500 bg-white z-10 shrink-0" />,
        warning: <AlertTriangle size={24} className="text-orange-500 bg-white z-10 shrink-0" />,
        pending: <Clock size={24} className="text-gray-300 bg-white z-10 shrink-0" />,
    };
    return (
        <div className="flex items-center gap-4 relative">
            {icons[status] || icons.pending}
            <div className="flex flex-col">
                <span className={`text-xs font-bold ${status === 'done' ? 'text-gray-900' : 'text-gray-500'}`}>{label}</span>
                <span className="text-[10px] text-gray-400">{time}</span>
            </div>
        </div>
    );
}