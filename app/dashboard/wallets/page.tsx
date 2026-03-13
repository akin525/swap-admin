"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { walletsApi } from "@/lib/api";
import { toast } from "react-hot-toast";
import { Settings2, Wallet as WalletIcon, Shield, Activity, Save, User as UserIcon, CreditCard } from "lucide-react";

import PageHeader from "@/components/ui/PageHeader";
import SearchFilter from "@/components/ui/SearchFilter";
import DataTable from "@/components/ui/DataTable";
import StatusBadge from "@/components/ui/StatusBadge";
import StatCard from "@/components/ui/StatCard";
import Modal from "@/components/ui/Modal";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";
import { formatCurrency, formatDate } from "@/lib/utils"; // Fallback for limits if not formatted by API

export interface WalletUser {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
}

export interface Wallet {
  id: number;
  user_id: number;
  currency: string;
  balance: string;
  cashback: string;
  transfer_single_limit: string;
  transfer_cumulative_limit: string;
  status: number | string; // API shows 1 or 0 for user wallets, "active" for available wallets
  created_at: string;
  updated_at: string;
  formatted_balance?: string;
  user_name?: string;
  transaction_count?: number;
  user?: WalletUser;
}

export interface AvailableWallet {
  id: number;
  currency: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export default function WalletsPage() {
  const { token } = useAuth();
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [availableWallets, setAvailableWallets] = useState<AvailableWallet[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [currencyFilter, setCurrencyFilter] = useState("");
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ current_page: 1, last_page: 1, per_page: 20, total: 0 });
  const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(null);
  const [stats, setStats] = useState<any>(null);
  const [editLimits, setEditLimits] = useState({ single: "", cumulative: "" });
  const [savingLimits, setSavingLimits] = useState(false);

  const fetchData = useCallback(async (silent = false) => {
    if (!token) return;
    if (!silent) setLoading(true);
    else setIsRefreshing(true);
    try {
      const [walletsRes, availableRes] = await Promise.all([
        walletsApi.getAll(token, { page, search: search || undefined, currency: currencyFilter || undefined }),
        walletsApi.getAvailable(token),
      ]);
      if (walletsRes.success) {
        setWallets(walletsRes.data.data || []);
        if (walletsRes.data.current_page) {
          setMeta({
            current_page: walletsRes.data.current_page,
            last_page: walletsRes.data.last_page,
            per_page: walletsRes.data.per_page,
            total: walletsRes.data.total
          });
        }
        if (walletsRes.stats) setStats(walletsRes.stats);
      }
      if (availableRes.success) {
        // Handle array response structure based on your JSON
        setAvailableWallets(Array.isArray(availableRes.data) ? availableRes.data : []);
      }
    } catch (err) {
      toast.error("Failed to load wallets");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [token, page, search, currencyFilter]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleUpdateLimits = async () => {
    if (!token || !selectedWallet) return;
    setSavingLimits(true);
    try {
      await walletsApi.updateLimits(token, selectedWallet.id, {
        transfer_single_limit: editLimits.single,
        transfer_cumulative_limit: editLimits.cumulative,
      });
      toast.success("Wallet limits updated successfully");
      setSelectedWallet(null);
      fetchData(true);
    } catch (err: any) {
      toast.error(err.message || "Failed to update limits");
    } finally {
      setSavingLimits(false);
    }
  };

  const openWalletDetail = (w: Wallet) => {
    setSelectedWallet(w);
    setEditLimits({
      single: w.transfer_single_limit,
      cumulative: w.transfer_cumulative_limit,
    });
  };

  const columns = [
    {
      key: 'user',
      label: 'Owner',
      render: (w: Wallet) => (
          <div className="flex flex-col">
          <span className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate max-w-[200px]">
            {w.user_name || (w.user ? `${w.user.firstname} ${w.user.lastname}` : `User #${w.user_id}`)}
          </span>
            <span className="text-[11px] text-gray-500">{w.user?.email || 'N/A'}</span>
          </div>
      ),
    },
    {
      key: 'currency',
      label: 'Wallet',
      render: (w: Wallet) => (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 text-indigo-700 dark:text-indigo-400 text-xs font-bold">
          <WalletIcon size={12} />
            {w.currency}
        </span>
      ),
    },
    {
      key: 'balance',
      label: 'Balance',
      render: (w: Wallet) => (
          <div className="flex flex-col">
          <span className="text-sm font-bold text-gray-900 dark:text-white">
            {w.formatted_balance || formatCurrency(w.balance, w.currency)}
          </span>
            {Number(w.cashback) > 0 && (
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
              + {formatCurrency(w.cashback, w.currency)} CB
            </span>
            )}
          </div>
      ),
    },
    {
      key: 'limits',
      label: 'Transfer Limits (Single / Total)',
      render: (w: Wallet) => (
          <div className="flex flex-col gap-0.5">
          <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
            {formatCurrency(w.transfer_single_limit, w.currency)}
          </span>
            <span className="text-[11px] text-gray-400">
            Max: {formatCurrency(w.transfer_cumulative_limit, w.currency)}
          </span>
          </div>
      ),
    },
    {
      key: 'activity',
      label: 'Activity',
      render: (w: Wallet) => (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-600 dark:text-gray-400">
          <Activity size={12} />
            {w.transaction_count || 0} Txns
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (w: Wallet) => (
          <StatusBadge status={w.status === 1 || w.status === 'active' ? 'active' : 'inactive'} />
      ),
    },
    {
      key: 'actions',
      label: '',
      className: 'text-right',
      render: (w: Wallet) => (
          <button
              onClick={(e) => { e.stopPropagation(); openWalletDetail(w); }}
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-50 dark:bg-gray-800/50 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg text-xs font-semibold transition-all shadow-sm"
          >
            <Settings2 size={14} />
            Manage
          </button>
      ),
    },
  ];

  if (loading) return <LoadingSkeleton type="page" />;

  return (
      <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in duration-500">
        <PageHeader
            title="Wallet Management"
            description="Monitor user balances, adjust transfer limits, and track wallet activity."
            onRefresh={() => fetchData(true)}
            isRefreshing={isRefreshing}
        />

        {/* Available Currencies Overview */}
        {availableWallets.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {availableWallets.map((aw) => (
                  <div key={aw.id} className="relative overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#111118] p-4 shadow-sm flex items-center justify-between">
                    <div className="absolute -right-4 -top-4 opacity-[0.03] dark:opacity-5">
                      <GlobeIcon size={80} />
                    </div>
                    <div className="relative z-10">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Supported</p>
                      <span className="text-xl font-black text-gray-900 dark:text-white">{aw.currency} Wallet</span>
                    </div>
                    <div className="relative z-10">
                      <StatusBadge status={aw.status === 'active' || aw.status === 1 ? 'active' : 'inactive'} />
                    </div>
                  </div>
              ))}
            </div>
        )}

        {/* Main Table Card */}
        <div className="bg-white dark:bg-[#111118] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-white/[0.02]">
            <SearchFilter
                searchValue={search}
                onSearchChange={(v) => { setSearch(v); setPage(1); }}
                searchPlaceholder="Search by name, email, or user ID..."
                filters={[
                  {
                    key: 'currency',
                    label: 'Currency',
                    options: availableWallets.map(w => ({ label: w.currency, value: w.currency })),
                    value: currencyFilter,
                    onChange: (v) => { setCurrencyFilter(v); setPage(1); },
                  },
                ]}
                onClear={() => { setSearch(''); setCurrencyFilter(''); setPage(1); }}
            />
          </div>

          <DataTable
              columns={columns}
              data={wallets}
              currentPage={meta.current_page}
              totalPages={meta.last_page}
              total={meta.total}
              onPageChange={setPage}
              onRowClick={openWalletDetail}
              emptyMessage="No wallets found."
              emptyDescription="Adjust your search or filter settings."
          />
        </div>

        {/* Wallet Detail & Configuration Modal */}
        <Modal
            isOpen={!!selectedWallet}
            onClose={() => setSelectedWallet(null)}
            title="Manage Wallet Configuration"
            size="lg"
        >
          {selectedWallet && (
              <div className="space-y-6">
                {/* Header / Balance Card */}
                <div className="bg-gradient-to-br from-indigo-50 to-white dark:from-indigo-900/10 dark:to-gray-900/50 p-5 rounded-2xl border border-indigo-100 dark:border-indigo-500/20 flex justify-between items-center">
                  <div>
                    <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-1 flex items-center gap-1.5">
                      <WalletIcon size={14} />
                      {selectedWallet.currency} Balance
                    </p>
                    <h2 className="text-3xl font-black text-gray-900 dark:text-white">
                      {selectedWallet.formatted_balance || formatCurrency(selectedWallet.balance, selectedWallet.currency)}
                    </h2>
                  </div>
                  <div className="text-right">
                    <StatusBadge status={selectedWallet.status === 1 || selectedWallet.status === 'active' ? 'active' : 'inactive'} />
                    <p className="text-[10px] text-gray-400 mt-2 font-medium">
                      {selectedWallet.transaction_count || 0} Lifetime Txns
                    </p>
                  </div>
                </div>

                {/* User Context */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 pb-2">
                    <UserIcon size={14} /> Account Owner
                  </h4>
                  <div className="grid grid-cols-2 gap-4 bg-gray-50 dark:bg-[#1A1A24] p-4 rounded-xl border border-gray-100 dark:border-gray-800">
                    <DetailItem label="Full Name" value={selectedWallet.user_name || 'N/A'} />
                    <DetailItem label="Email Address" value={selectedWallet.user?.email || 'N/A'} />
                    <DetailItem label="Phone Number" value={selectedWallet.user?.phone || 'N/A'} />
                    <DetailItem label="Wallet ID" value={`#${selectedWallet.id}`} />
                  </div>
                </div>

                {/* Limit Configuration Form */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 pb-2">
                    <Shield size={14} /> Security & Limits
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">
                        Single Transaction Limit ({selectedWallet.currency})
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <CreditCard size={14} className="text-gray-400" />
                        </div>
                        <input
                            type="number"
                            value={editLimits.single}
                            onChange={(e) => setEditLimits(prev => ({ ...prev, single: e.target.value }))}
                            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#0B0B15] text-sm font-semibold focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all placeholder:text-gray-400"
                            placeholder="e.g. 30000"
                        />
                      </div>
                      <p className="text-[10px] text-gray-500 mt-1.5">Maximum amount allowed per transfer.</p>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">
                        Cumulative Limit ({selectedWallet.currency})
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Activity size={14} className="text-gray-400" />
                        </div>
                        <input
                            type="number"
                            value={editLimits.cumulative}
                            onChange={(e) => setEditLimits(prev => ({ ...prev, cumulative: e.target.value }))}
                            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#0B0B15] text-sm font-semibold focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all placeholder:text-gray-400"
                            placeholder="e.g. 100000"
                        />
                      </div>
                      <p className="text-[10px] text-gray-500 mt-1.5">Total aggregate volume allowed.</p>
                    </div>
                  </div>

                  {/* Action Area */}
                  <div className="pt-4 mt-2 flex justify-end">
                    <button
                        onClick={handleUpdateLimits}
                        disabled={savingLimits || (!editLimits.single && !editLimits.cumulative)}
                        className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm shadow-indigo-500/20"
                    >
                      {savingLimits ? (
                          <span className="inline-block animate-pulse">Saving Changes...</span>
                      ) : (
                          <>
                            <Save size={16} />
                            Update Limits
                          </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
          )}
        </Modal>
      </div>
  );
}

// Helper generic icon for global wallets
function GlobeIcon({ size }: { size: number }) {
  return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="2" y1="12" x2="22" y2="12"></line>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
      </svg>
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