"use client";

import React from 'react';

export function TransactionModal({ transaction, onClose }: any) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            {/* Using bg-card and text-card-foreground for automatic theme switching */}
            <div className="bg-card text-card-foreground w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-border">
                <div className="p-8 border-b border-border flex justify-between items-center">
                    <h2 className="text-xl font-bold">Transaction Details</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all text-slate-500"
                    >
                        ✕
                    </button>
                </div>

                <div className="p-8 space-y-8">
                    {/* ID & Status */}
                    <div className="flex justify-between border-b border-dashed border-border pb-4">
                        <div>
                            <p className="text-xs text-slate-400 font-medium">Transaction ID</p>
                            <p className="font-bold">{transaction?.id || 'TX123456'}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-slate-400 font-medium">Status</p>
                            <p className="font-bold text-orange-500">Pending Review</p>
                        </div>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <h4 className="text-sm font-bold">Transaction Details</h4>
                            <DetailRow label="Amount" value={transaction?.amount || "$5,000"} />
                            <DetailRow label="From" value="NGN Wallet" />
                            <DetailRow label="To" value={transaction?.user || "John Smith"} />
                            <DetailRow label="Method" value={transaction?.action || "Transfer"} />
                        </div>

                        {/* Risk Assessment Box with dynamic background */}
                        <div className="space-y-4 bg-white-50/50 dark:bg-slate-800/20 p-5 rounded-3xl border border-border">
                            <h4 className="text-sm font-bold">Risk Assessment</h4>
                            <p className="text-xs font-bold flex justify-between">
                                Overall Risk: <span className="text-rose-500">High (85/100)</span>
                            </p>
                            <ul className="text-[10px] text-slate-500 dark:text-slate-400 space-y-1.5 mt-2">
                                <li className="flex items-center gap-2">• Large amount ({'>'}$1,000)</li>
                                <li className="flex items-center gap-2">• New recipient</li>
                                <li className="flex items-center gap-2">• Late night transaction</li>
                            </ul>
                        </div>
                    </div>

                    {/* Timeline Section */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-bold">Transaction Timeline</h4>
                        <div className="space-y-6 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-100 dark:before:bg-slate-800">
                            <TimelineStep label="Initiated" date="Jan 20, 2:30 AM" status="completed" />
                            <TimelineStep label="Validated" date="Jan 20, 2:30 AM" status="completed" />
                            <TimelineStep label="Risk Flagged" date="Jan 20, 2:30 AM" status="alert" />
                            <TimelineStep label="Pending Review" date="Current" status="pending" />
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="pt-4 flex flex-wrap gap-4">
                        <button className="flex-1 min-w-[140px] bg-brand hover:brightness-110 text-white py-3.5 rounded-2xl font-bold shadow-lg shadow-brand/20 transition-all active:scale-[0.98]">
                            Approve
                        </button>
                        <button className="flex-1 min-w-[140px] bg-orange-500 hover:brightness-110 text-white py-3.5 rounded-2xl font-bold transition-all active:scale-[0.98]">
                            Reject
                        </button>
                        <button className="flex-1 min-w-[140px] bg-slate-900 dark:bg-slate-700 hover:opacity-90 text-white py-3.5 rounded-2xl font-bold transition-all active:scale-[0.98]">
                            Request Info
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function DetailRow({ label, value }: any) {
    return (
        <div className="flex justify-between items-center text-sm">
            <span className="text-slate-500 dark:text-slate-400">{label}:</span>
            <span className="font-bold">{value}</span>
        </div>
    );
}

function TimelineStep({ label, date, status }: any) {
    return (
        <div className="flex items-center gap-4 relative z-10">
            <div className={`w-6 h-6 rounded-full border-4 border-white dark:border-slate-900 shadow-sm ${
                status === 'completed' || status === 'alert' ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-700'
            }`} />
            <div>
                <p className="text-sm font-bold leading-none">{label}</p>
                <p className="text-[10px] text-slate-400 mt-1.5">{date}</p>
            </div>
        </div>
    );
}