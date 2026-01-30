"use client";

import React, { useState } from 'react';
import {
    ShieldCheck, FileText, CheckCircle2, Clock,
    Search, Filter, ChevronRight
} from 'lucide-react';
import { StatCard } from '@/components/dashboard/StatCard';
import { KYCReviewModal } from '@/components/modals/KYCReviewModal';

const kycApplications = [
    { id: 1, name: "John Doe", level: 3, country: "Nigeria", time: "Jan 19, 2:30 PM", docs: { selfie: true, address: true, nin: true } },
    { id: 2, name: "Jane Smith", level: 2, country: "Ghana", time: "Jan 19, 4:15 PM", docs: { selfie: true, address: true, bvn: true } },
    { id: 3, name: "Mike Johnson", level: 1, country: "Nigeria", time: "Jan 20, 8:45 AM", docs: { selfie: true, address: true } },
];

export default function KYCManagementPage() {
    const [selectedKYC, setSelectedKYC] = useState<any>(null);

    return (
        <div className="space-y-8 bg-background min-h-screen transition-colors duration-300">
            {/* Top Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard label="Pending Reviews" value="342" change="+15.3%" isPositive={true} icon={<Clock size={20} />} />
                <StatCard label="Today's Submission" value="67" change="-0.2%" isPositive={false} icon={<FileText size={20} />} />
                <StatCard label="Approval Rate" value="94.5%" change="+2.1%" isPositive={true} icon={<CheckCircle2 size={20} />} />
                <StatCard label="Rejected this WK" value="23" change="+8%" isPositive={false} icon={<ShieldCheck size={20} />} />
            </div>

            {/* Queue Management Search/Filter */}
            <div className="bg-card border border-border p-6 rounded-[2rem] shadow-sm">
                <h3 className="font-bold text-lg mb-6">KYC Queue Management</h3>
                <div className="flex flex-col md:flex-row gap-4 justify-between">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input type="text" placeholder="Search Transaction" className="w-full pl-12 pr-4 py-3 bg-background border border-border rounded-2xl outline-none" />
                    </div>
                    <div className="flex gap-3">
                        <FilterButton label="Date" />
                        <FilterButton label="KYC level" />
                        <FilterButton label="Country" />
                    </div>
                </div>

                {/* Applications Queue List */}
                <div className="mt-8 space-y-6">
                    <h4 className="font-bold text-slate-900 dark:text-white">KYC Applications Queue</h4>
                    {kycApplications.map((app) => (
                        <div key={app.id} className="flex flex-col md:flex-row items-center justify-between p-6 border border-border rounded-3xl hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-all">
                            <div className="flex items-center gap-5 w-full">
                                <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 font-bold">
                                    {app.name[0]}
                                </div>
                                <div className="flex-1">
                                    <p className="font-bold text-lg">{app.name} (Level {app.level}) – {app.country}</p>
                                    <p className="text-xs text-slate-500 mt-1">Submitted: {app.time}</p>
                                    <div className="flex gap-4 mt-3">
                                        <DocBadge label="Selfie" active={app.docs.selfie} />
                                        <DocBadge label="Address" active={app.docs.address} />
                                        <DocBadge label={app.docs.nin ? "NIN" : "BVN"} active={true} />
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setSelectedKYC(app)}
                                        className="px-8 py-3 bg-orange-500 text-white rounded-xl font-bold text-sm shadow-lg shadow-orange-200 dark:shadow-none hover:bg-orange-600 transition-all"
                                    >
                                        Review
                                    </button>
                                    <button className="px-8 py-3 bg-emerald-500 text-white rounded-xl font-bold text-sm shadow-lg shadow-emerald-200 dark:shadow-none hover:bg-emerald-600 transition-all">
                                        Approve
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {selectedKYC && <KYCReviewModal applicant={selectedKYC} onClose={() => setSelectedKYC(null)} />}
        </div>
    );
}

function FilterButton({ label }: { label: string }) {
    return (
        <button className="px-5 py-3 border border-border rounded-2xl text-sm text-slate-500 flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
            {label} <ChevronRight size={14} className="rotate-90" />
        </button>
    );
}

function DocBadge({ label, active }: { label: string, active: boolean }) {
    return (
        <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-400">
            Documents: <span className="text-slate-900 dark:text-white">{label}</span>
            {active && <CheckCircle2 size={14} className="text-emerald-500" />}
        </div>
    );
}