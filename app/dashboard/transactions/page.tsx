"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { transactionsApi } from "@/lib/api";
import { toast } from "react-hot-toast";
import { Eye, RotateCcw, ArrowDownRight, ArrowUpRight, Copy, CheckCircle2 } from "lucide-react";

import PageHeader from "@/components/ui/PageHeader";
import SearchFilter from "@/components/ui/SearchFilter";
import DataTable from "@/components/ui/DataTable";
import StatusBadge from "@/components/ui/StatusBadge";
import StatCard from "@/components/ui/StatCard";
import Modal from "@/components/ui/Modal";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";

// Updated type based on your JSON response
export interface TransactionUser {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
}

export interface Transaction {
  id: number;
  user_id: number;
  wallet_id: number;
  source: string;
  currency: string;
  amount: string;
  fee: string;
  bal_before: string;
  bal_after: string;
  type: string;
  note: string;
  status: string;
  reference: string;
  created_at: string;
  updated_at: string;
  formatted_amount: string;
  user_name: string;
  formatted_date: string;
  user: TransactionUser;
  reversed?: boolean; // Assuming this might exist based on your original code
}

export default function TransactionsPage() {
  const { token } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ current_page: 1, last_page: 1, per_page: 20, total: 0 });
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [stats, setStats] = useState<any>(null);
  const [copiedRef, setCopiedRef] = useState(false);

  const fetchData = useCallback(async (silent = false) => {
    if (!token) return;
    if (!silent) setLoading(true);
    else setIsRefreshing(true);

    try {
      const res = await transactionsApi.getAll(token, {
        page,
        search: search || undefined,
        status: statusFilter || undefined,
        type: typeFilter || undefined,
      });

      if (res.success) {
        setTransactions(res.data.data || []);
        setMeta({
          current_page: res.data.current_page,
          last_page: res.data.last_page,
          per_page: res.data.per_page,
          total: res.data.total
        });
        if (res.stats) setStats(res.stats);
      }
    } catch (err) {
      toast.error("Failed to load transactions");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [token, page, search, statusFilter, typeFilter]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleReverse = async (id: number) => {
    if (!token) return;
    try {
      await transactionsApi.reverse(token, id);
      toast.success("Transaction reversed successfully");
      setSelectedTx(null);
      fetchData(true);
    } catch (err: any) {
      toast.error(err.message || "Failed to reverse transaction");
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedRef(true);
    setTimeout(() => setCopiedRef(false), 2000);
    toast.success("Reference copied!");
  };

  const columns = [
    {
      key: 'reference',
      label: 'Transaction',
      render: (tx: Transaction) => (
          <div className="flex flex-col gap-1">
          <span className="text-xs font-mono font-semibold text-indigo-600 dark:text-indigo-400">
            {tx.reference}
          </span>
            <span className="text-[11px] text-gray-500 truncate max-w-[200px]" title={tx.note}>
            {tx.note}
          </span>
          </div>
      ),
    },
    {
      key: 'user',
      label: 'User',
      render: (tx: Transaction) => (
          <div className="flex flex-col">
          <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            {tx.user_name}
          </span>
            <span className="text-[11px] text-gray-500">{tx.user?.email || 'N/A'}</span>
          </div>
      ),
    },
    {
      key: 'type',
      label: 'Type',
      render: (tx: Transaction) => (
          <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 capitalize border border-gray-200 dark:border-gray-700">
          {tx.type.replace('_', ' ')}
        </span>
      ),
    },
    {
      key: 'amount',
      label: 'Amount',
      render: (tx: Transaction) => {
        const isCredit = tx.formatted_amount.startsWith('+');
        return (
            <div className="flex items-center gap-1.5">
              {isCredit ? (
                  <ArrowDownRight size={14} className="text-emerald-500" />
              ) : (
                  <ArrowUpRight size={14} className="text-rose-500" />
              )}
              <span className={`text-sm font-bold ${isCredit ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
              {tx.formatted_amount}
            </span>
            </div>
        );
      },
    },
    {
      key: 'status',
      label: 'Status',
      render: (tx: Transaction) => <StatusBadge status={tx.status} />,
    },
    {
      key: 'created_at',
      label: 'Date',
      render: (tx: Transaction) => (
          <div className="flex flex-col">
          <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
            {tx.formatted_date.split(',')[0]}
          </span>
            <span className="text-[11px] text-gray-500">
            {tx.formatted_date.split(',')[1]?.trim()}
          </span>
          </div>
      ),
    },
    {
      key: 'actions',
      label: '',
      className: 'text-right',
      render: (tx: Transaction) => (
          <button
              onClick={(e) => { e.stopPropagation(); setSelectedTx(tx); }}
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
            title="Transactions"
            description="Monitor and manage all platform financial activities."
            onRefresh={() => fetchData(true)}
            isRefreshing={isRefreshing}
        />

        {/* Stats */}
        {stats && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard title="Total Transactions" value={stats.total || '0'} trend={stats.total_trend} icon="repeat" color="indigo" />
              <StatCard title="Completed" value={stats.completed || '0'} trend={stats.completed_trend} icon="shield" color="emerald" />
              <StatCard title="Pending" value={stats.pending || '0'} icon="monitor" color="amber" />
              <StatCard title="Total Volume" value={stats.volume || '₦0.00'} trend={stats.volume_trend} icon="dollar" color="blue" />
            </div>
        )}

        {/* Main Table Card */}
        <div className="bg-white dark:bg-[#111118] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-white/[0.02]">
            <SearchFilter
                searchValue={search}
                onSearchChange={(v) => { setSearch(v); setPage(1); }}
                searchPlaceholder="Search reference, user, or note..."
                filters={[
                  {
                    key: 'status',
                    label: 'Status',
                    options: [
                      { label: 'Pending', value: 'pending' },
                      { label: 'Completed/Success', value: 'completed' },
                      { label: 'Failed', value: 'failed' },
                    ],
                    value: statusFilter,
                    onChange: (v) => { setStatusFilter(v); setPage(1); },
                  },
                  {
                    key: 'type',
                    label: 'Type',
                    options: [
                      { label: 'Transfer', value: 'transfer' },
                      { label: 'Funding', value: 'funding' },
                      { label: 'Conversion', value: 'conversion' },
                    ],
                    value: typeFilter,
                    onChange: (v) => { setTypeFilter(v); setPage(1); },
                  },
                ]}
                onClear={() => { setSearch(''); setStatusFilter(''); setTypeFilter(''); setPage(1); }}
            />
          </div>

          <DataTable
              columns={columns}
              data={transactions}
              currentPage={meta.current_page}
              totalPages={meta.last_page}
              total={meta.total}
              onPageChange={setPage}
              onRowClick={(tx) => setSelectedTx(tx)}
              emptyMessage="No transactions found."
              emptyDescription="Adjust your filters or search query."
          />
        </div>

        {/* Detail Modal */}
        <Modal
            isOpen={!!selectedTx}
            onClose={() => setSelectedTx(null)}
            title="Transaction Record"
            size="2xl"
        >
          {selectedTx && (
              <div className="space-y-6">
                {/* Header Badge & Reference */}
                <div className="flex items-start justify-between bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-1">Reference Number</p>
                    <div className="flex items-center gap-2">
                  <span className="text-lg font-mono font-bold text-gray-900 dark:text-white">
                    {selectedTx.reference}
                  </span>
                      <button
                          onClick={() => copyToClipboard(selectedTx.reference)}
                          className="p-1.5 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-200 dark:hover:text-gray-200 dark:hover:bg-gray-700 transition-colors"
                      >
                        {copiedRef ? <CheckCircle2 size={16} className="text-emerald-500" /> : <Copy size={16} />}
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <StatusBadge status={selectedTx.status} />
                    <span className={`text-xl font-black ${selectedTx.formatted_amount.startsWith('+') ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                  {selectedTx.formatted_amount}
                </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Financial Breakdown */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 pb-2">
                      Financial Details
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <DetailItem label="Currency" value={selectedTx.currency} />
                      <DetailItem label="Transaction Fee" value={`${selectedTx.currency} ${selectedTx.fee}`} />
                      <DetailItem label="Balance Before" value={`${selectedTx.currency} ${selectedTx.bal_before}`} />
                      <DetailItem label="Balance After" value={`${selectedTx.currency} ${selectedTx.bal_after}`} />
                    </div>
                  </div>

                  {/* Transaction Context */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 pb-2">
                      Context
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <DetailItem label="Type" value={selectedTx.type.replace('_', ' ')} className="capitalize" />
                      <DetailItem label="Source" value={selectedTx.source} className="capitalize" />
                      <DetailItem label="Date" value={selectedTx.formatted_date} className="col-span-2" />
                    </div>
                  </div>
                </div>

                {/* Note Section */}
                <div className="bg-blue-50/50 dark:bg-blue-900/10 p-4 rounded-xl border border-blue-100 dark:border-blue-900/30">
                  <p className="text-xs font-semibold text-blue-800 dark:text-blue-300 uppercase tracking-wider mb-1">Description / Note</p>
                  <p className="text-sm text-gray-800 dark:text-gray-200">{selectedTx.note || "No notes provided."}</p>
                </div>

                {/* User Info */}
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 pb-2">
                    User Information
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <DetailItem label="Name" value={selectedTx.user_name} />
                    <DetailItem label="Email" value={selectedTx.user.email} />
                    <DetailItem label="Phone" value={selectedTx.user.phone} />
                  </div>
                </div>

                {/* Actions */}
                {(selectedTx.status === 'completed' || selectedTx.status === 'success') && !selectedTx.reversed && (
                    <div className="pt-4 mt-6 border-t border-gray-200 dark:border-gray-800 flex justify-end">
                      <button
                          onClick={() => handleReverse(selectedTx.id)}
                          className="inline-flex items-center gap-2 px-5 py-2.5 bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-xl text-sm font-bold hover:bg-rose-100 dark:hover:bg-rose-500/20 transition-all border border-rose-200 dark:border-rose-500/20"
                      >
                        <RotateCcw size={16} />
                        Reverse Transaction
                      </button>
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