"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { transfersApi } from "@/lib/api";
import { toast } from "react-hot-toast";
import {
  Eye, CheckCircle, XCircle, Clock, Copy, CheckCircle2,
  Building2, User, ArrowRightLeft, AlertCircle
} from "lucide-react";

import PageHeader from "@/components/ui/PageHeader";
import SearchFilter from "@/components/ui/SearchFilter";
import DataTable from "@/components/ui/DataTable";
import StatusBadge from "@/components/ui/StatusBadge";
import StatCard from "@/components/ui/StatCard";
import Modal from "@/components/ui/Modal";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";

// Updated type based on your JSON response
export interface TransferUser {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
}

export interface Transfer {
  id: number;
  user_id: number;
  wallet_id: number;
  reference: string;
  account_number: string;
  account_name: string;
  bank_code: string;
  bank_name: string;
  amount: string;
  fee: string;
  total_amount: string;
  currency: string;
  country_code: string;
  remarks: string;
  status: string;
  provider_reference: string | null;
  failure_reason: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
  formatted_amount: string;
  formatted_fee: string;
  formatted_total: string;
  formatted_date: string;
  user_name: string;
  user: TransferUser;
}

export default function TransfersPage() {
  const { token } = useAuth();
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currencyFilter, setCurrencyFilter] = useState("");
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ current_page: 1, last_page: 1, per_page: 20, total: 0 });
  const [selectedTransfer, setSelectedTransfer] = useState<Transfer | null>(null);
  const [stats, setStats] = useState<any>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectInput, setShowRejectInput] = useState(false);

  // Copy states
  const [copiedRef, setCopiedRef] = useState(false);
  const [copiedAcc, setCopiedAcc] = useState(false);

  const fetchData = useCallback(async (silent = false) => {
    if (!token) return;
    if (!silent) setLoading(true);
    else setIsRefreshing(true);

    try {
      const res = await transfersApi.getAll(token, {
        page,
        search: search || undefined,
        status: statusFilter || undefined,
        currency: currencyFilter || undefined,
      });
      if (res.success) {
        setTransfers(res.data.data || []);
        setMeta({
          current_page: res.data.current_page,
          last_page: res.data.last_page,
          per_page: res.data.per_page,
          total: res.data.total
        });
        if (res.stats) setStats(res.stats);
      }
    } catch (err) {
      toast.error("Failed to load transfers");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [token, page, search, statusFilter, currencyFilter]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleStatusUpdate = async (id: number, status: string, reason?: string) => {
    if (!token) return;
    setActionLoading(true);
    try {
      await transfersApi.updateStatus(token, id, status, reason);
      toast.success(`Transfer marked as ${status}`);
      setSelectedTransfer(null);
      setShowRejectInput(false);
      setRejectReason("");
      fetchData(true);
    } catch (err: any) {
      toast.error(err.message || `Failed to ${status} transfer`);
    } finally {
      setActionLoading(false);
    }
  };

  const copyToClipboard = (text: string, type: 'ref' | 'acc') => {
    navigator.clipboard.writeText(text);
    if (type === 'ref') {
      setCopiedRef(true);
      setTimeout(() => setCopiedRef(false), 2000);
    } else {
      setCopiedAcc(true);
      setTimeout(() => setCopiedAcc(false), 2000);
    }
    toast.success("Copied to clipboard!");
  };

  const columns = [
    {
      key: 'reference',
      label: 'Reference',
      render: (t: Transfer) => (
          <div className="flex flex-col gap-1">
          <span className="text-xs font-mono font-semibold text-indigo-600 dark:text-indigo-400">
            {t.reference}
          </span>
            <span className="text-[11px] text-gray-500 truncate max-w-[150px]" title={t.provider_reference || ''}>
            {t.provider_reference || 'Awaiting Provider'}
          </span>
          </div>
      ),
    },
    {
      key: 'user',
      label: 'Sender',
      render: (t: Transfer) => (
          <div className="flex flex-col">
          <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            {t.user_name}
          </span>
            <span className="text-[11px] text-gray-500">{t.user?.email || 'N/A'}</span>
          </div>
      ),
    },
    {
      key: 'recipient',
      label: 'Recipient',
      render: (t: Transfer) => (
          <div className="flex flex-col">
          <span className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate max-w-[180px]">
            {t.account_name}
          </span>
            <span className="text-[11px] text-gray-500 flex items-center gap-1">
            <Building2 size={10} /> {t.bank_name} • {t.account_number}
          </span>
          </div>
      ),
    },
    {
      key: 'amount',
      label: 'Total Amount',
      render: (t: Transfer) => (
          <div className="flex flex-col">
          <span className="text-sm font-bold text-gray-900 dark:text-white">
            {t.formatted_total}
          </span>
            <span className="text-[10px] text-gray-400">
            Includes {t.formatted_fee} fee
          </span>
          </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (t: Transfer) => <StatusBadge status={t.status} />,
    },
    {
      key: 'created_at',
      label: 'Date',
      render: (t: Transfer) => (
          <div className="flex flex-col">
          <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
            {t.formatted_date.split(',')[0]}
          </span>
            <span className="text-[11px] text-gray-500">
            {t.formatted_date.split(',')[1]?.trim()}
          </span>
          </div>
      ),
    },
    {
      key: 'actions',
      label: '',
      className: 'text-right',
      render: (t: Transfer) => (
          <button
              onClick={(e) => { e.stopPropagation(); setSelectedTransfer(t); }}
              className="inline-flex items-center justify-center p-2 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-colors"
              title="View Details"
          >
            <Eye size={18} />
          </button>
      ),
    },
  ];

  if (loading) return <LoadingSkeleton type="page" />;

  return (
      <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in duration-500">
        <PageHeader
            title="Payouts & Transfers"
            description="Monitor outgoing bank transfers and user payouts."
            onRefresh={() => fetchData(true)}
            isRefreshing={isRefreshing}
        />

        {/* Stats Board */}
        {stats && (
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
              <StatCard title="Total Transfers" value={stats.total || '0'} icon="transfer" color="indigo" />
              <StatCard title="Pending" value={stats.pending || '0'} icon="monitor" color="amber" />
              <StatCard title="Processing" value={stats.processing || '0'} icon="repeat" color="blue" />
              <StatCard title="Completed" value={stats.completed || '0'} icon="shield" color="emerald" />
              <StatCard title="Failed" value={stats.failed || '0'} icon="alert" color="rose" />
            </div>
        )}

        {/* Main Table Card */}
        <div className="bg-white dark:bg-[#111118] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-white/[0.02]">
            <SearchFilter
                searchValue={search}
                onSearchChange={(v) => { setSearch(v); setPage(1); }}
                searchPlaceholder="Search reference, account name, bank..."
                filters={[
                  {
                    key: 'status',
                    label: 'Status',
                    options: [
                      { label: 'Pending', value: 'pending' },
                      { label: 'Processing', value: 'processing' },
                      { label: 'Completed', value: 'completed' },
                      { label: 'Failed', value: 'failed' },
                    ],
                    value: statusFilter,
                    onChange: (v) => { setStatusFilter(v); setPage(1); },
                  },
                  {
                    key: 'currency',
                    label: 'Currency',
                    options: [
                      { label: 'NGN', value: 'NGN' },
                      { label: 'USD', value: 'USD' },
                      { label: 'GHS', value: 'GHS' },
                    ],
                    value: currencyFilter,
                    onChange: (v) => { setCurrencyFilter(v); setPage(1); },
                  },
                ]}
                onClear={() => { setSearch(''); setStatusFilter(''); setCurrencyFilter(''); setPage(1); }}
            />
          </div>

          <DataTable
              columns={columns}
              data={transfers}
              currentPage={meta.current_page}
              totalPages={meta.last_page}
              total={meta.total}
              onPageChange={setPage}
              onRowClick={(t) => setSelectedTransfer(t)}
              emptyMessage="No transfers found."
              emptyDescription="Adjust filters or check back later."
          />
        </div>

        {/* Transfer Detail Modal */}
        <Modal
            isOpen={!!selectedTransfer}
            onClose={() => { setSelectedTransfer(null); setShowRejectInput(false); setRejectReason(""); }}
            title="Transfer Record"
            size="2xl"
        >
          {selectedTransfer && (
              <div className="space-y-6">
                {/* Header Badge & Reference */}
                <div className="flex items-start justify-between bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-1">Internal Reference</p>
                    <div className="flex items-center gap-2">
                  <span className="text-lg font-mono font-bold text-gray-900 dark:text-white">
                    {selectedTransfer.reference}
                  </span>
                      <button
                          onClick={() => copyToClipboard(selectedTransfer.reference, 'ref')}
                          className="p-1.5 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-200 dark:hover:text-gray-200 dark:hover:bg-gray-700 transition-colors"
                      >
                        {copiedRef ? <CheckCircle2 size={16} className="text-emerald-500" /> : <Copy size={16} />}
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <StatusBadge status={selectedTransfer.status} />
                    <span className="text-xl font-black text-gray-900 dark:text-white">
                  {selectedTransfer.formatted_total}
                </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Recipient Bank Details Container */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 pb-2">
                      Recipient Details
                    </h4>
                    <div className="bg-white dark:bg-[#1A1A24] border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow-sm relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-3 opacity-10">
                        <Building2 size={64} />
                      </div>
                      <div className="relative z-10 space-y-4">
                        <div>
                          <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-1">Account Name</p>
                          <p className="text-sm font-bold text-gray-900 dark:text-white">{selectedTransfer.account_name}</p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-1">Account Number</p>
                          <div className="flex items-center gap-2">
                            <p className="text-lg font-mono tracking-widest text-gray-900 dark:text-white">
                              {selectedTransfer.account_number}
                            </p>
                            <button
                                onClick={() => copyToClipboard(selectedTransfer.account_number, 'acc')}
                                className="text-gray-400 hover:text-indigo-500"
                            >
                              {copiedAcc ? <CheckCircle2 size={14} className="text-emerald-500" /> : <Copy size={14} />}
                            </button>
                          </div>
                        </div>
                        <div className="flex items-center justify-between border-t border-gray-100 dark:border-gray-700/50 pt-3">
                          <p className="text-xs font-medium text-gray-600 dark:text-gray-300">{selectedTransfer.bank_name}</p>
                          <span className="text-[10px] bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-gray-500">
                        Code: {selectedTransfer.bank_code}
                      </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Financial & Context Details */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 pb-2">
                      Transfer Context
                    </h4>
                    <div className="grid grid-cols-2 gap-y-4 gap-x-2">
                      <DetailItem label="Base Amount" value={`${selectedTransfer.currency} ${selectedTransfer.formatted_amount}`} />
                      <DetailItem label="Service Fee" value={`${selectedTransfer.currency} ${selectedTransfer.formatted_fee}`} />
                      <DetailItem label="Sender" value={selectedTransfer.user_name} className="col-span-2" />
                      <DetailItem label="Provider Ref" value={selectedTransfer.provider_reference || 'N/A'} className="col-span-2" />
                      <DetailItem label="Initiated On" value={selectedTransfer.formatted_date} className="col-span-2" />
                    </div>
                  </div>
                </div>

                {/* Remarks / Failure Reason */}
                {(selectedTransfer.remarks || selectedTransfer.failure_reason) && (
                    <div className={`p-4 rounded-xl border ${selectedTransfer.failure_reason ? 'bg-rose-50/50 dark:bg-rose-900/10 border-rose-100 dark:border-rose-900/30' : 'bg-gray-50/50 dark:bg-gray-800/30 border-gray-200 dark:border-gray-700'}`}>
                      {selectedTransfer.failure_reason && (
                          <div className="mb-3">
                            <p className="text-[10px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                              <AlertCircle size={12} /> Failure Reason
                            </p>
                            <p className="text-sm font-medium text-rose-800 dark:text-rose-200">{selectedTransfer.failure_reason}</p>
                          </div>
                      )}
                      {selectedTransfer.remarks && (
                          <div>
                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">User Remarks</p>
                            <p className="text-sm text-gray-800 dark:text-gray-200 italic">"{selectedTransfer.remarks}"</p>
                          </div>
                      )}
                    </div>
                )}

                {/* Actions for Pending/Processing Status */}
                {(selectedTransfer.status === 'pending' || selectedTransfer.status === 'processing') && (
                    <div className="pt-6 border-t border-gray-200 dark:border-gray-800 space-y-4">
                      {!showRejectInput ? (
                          <div className="flex flex-wrap items-center gap-3">
                            <button
                                onClick={() => handleStatusUpdate(selectedTransfer.id, 'completed')}
                                disabled={actionLoading}
                                className="flex-1 sm:flex-none inline-flex justify-center items-center gap-2 px-5 py-2.5 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 rounded-xl text-sm font-bold hover:bg-emerald-100 dark:hover:bg-emerald-500/20 transition-all disabled:opacity-50"
                            >
                              <CheckCircle size={16} />
                              Approve Payout
                            </button>

                            <button
                                onClick={() => handleStatusUpdate(selectedTransfer.id, 'processing')}
                                disabled={actionLoading || selectedTransfer.status === 'processing'}
                                className="flex-1 sm:flex-none inline-flex justify-center items-center gap-2 px-5 py-2.5 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20 rounded-xl text-sm font-bold hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-all disabled:opacity-50"
                            >
                              <Clock size={16} />
                              Mark Processing
                            </button>

                            <div className="flex-1 min-w-[20px] hidden sm:block"></div> {/* Spacer */}

                            <button
                                onClick={() => setShowRejectInput(true)}
                                disabled={actionLoading}
                                className="w-full sm:w-auto inline-flex justify-center items-center gap-2 px-5 py-2.5 bg-white dark:bg-transparent text-rose-600 border border-rose-200 dark:border-rose-500/30 rounded-xl text-sm font-bold hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all disabled:opacity-50"
                            >
                              <XCircle size={16} />
                              Reject
                            </button>
                          </div>
                      ) : (
                          <div className="bg-rose-50/50 dark:bg-rose-500/5 p-4 rounded-xl border border-rose-100 dark:border-rose-500/20 animate-in slide-in-from-bottom-2 fade-in">
                            <label className="block text-xs font-bold text-rose-800 dark:text-rose-300 mb-2">
                              Please provide a reason for rejection:
                            </label>
                            <div className="flex flex-col sm:flex-row gap-3 items-end">
                              <div className="flex-1 w-full">
                                <input
                                    type="text"
                                    value={rejectReason}
                                    onChange={(e) => setRejectReason(e.target.value)}
                                    placeholder="e.g., Invalid account details, Insufficient balance..."
                                    className="w-full px-4 py-2.5 rounded-xl border border-rose-200 dark:border-rose-500/30 bg-white dark:bg-[#0B0B15] text-sm focus:border-rose-500 focus:ring-1 focus:ring-rose-500 outline-none transition-all placeholder:text-gray-400"
                                    autoFocus
                                />
                              </div>
                              <div className="flex gap-2 w-full sm:w-auto">
                                <button
                                    onClick={() => { setShowRejectInput(false); setRejectReason(""); }}
                                    disabled={actionLoading}
                                    className="px-4 py-2.5 text-gray-500 dark:text-gray-400 font-semibold text-sm hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                                >
                                  Cancel
                                </button>
                                <button
                                    onClick={() => handleStatusUpdate(selectedTransfer.id, 'failed', rejectReason)}
                                    disabled={!rejectReason.trim() || actionLoading}
                                    className="flex-1 sm:flex-none px-5 py-2.5 bg-rose-600 text-white rounded-xl text-sm font-bold hover:bg-rose-700 disabled:opacity-50 transition-all shadow-sm"
                                >
                                  Confirm Rejection
                                </button>
                              </div>
                            </div>
                          </div>
                      )}
                    </div>
                )}
              </div>
          )}
        </Modal>
      </div>
  );
}

function DetailItem({ label, value, className = "" }: { label: string; value: string; className?: string }) {
  return (
      <div className={className}>
        <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-1">{label}</p>
        <p className="text-sm font-semibold text-gray-900 dark:text-white break-words">{value}</p>
      </div>
  );
}