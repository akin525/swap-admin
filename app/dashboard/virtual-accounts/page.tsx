"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { virtualAccountsApi } from "@/lib/api";
import { toast } from "react-hot-toast";
import {
  Eye, Landmark, Copy, CheckCircle2, Building2,
  User as UserIcon, ShieldAlert, ShieldCheck, Database, Calendar
} from "lucide-react";

import PageHeader from "@/components/ui/PageHeader";
import SearchFilter from "@/components/ui/SearchFilter";
import DataTable from "@/components/ui/DataTable";
import StatusBadge from "@/components/ui/StatusBadge";
import StatCard from "@/components/ui/StatCard";
import Modal from "@/components/ui/Modal";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";

// Updated type based on your JSON response
export interface VirtualAccountUser {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  status: string;
}

export interface VirtualAccount {
  id: number;
  user_id: number;
  wallet_id: number;
  account_number: string;
  bank_name: string;
  account_name: string;
  status: string;
  metadata: any | null;
  created_at: string;
  updated_at: string;
  user_name: string;
  user_status: string;
  formatted_date: string;
  user: VirtualAccountUser;
}

export default function VirtualAccountsPage() {
  const { token } = useAuth();
  const [accounts, setAccounts] = useState<VirtualAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ current_page: 1, last_page: 1, per_page: 20, total: 0 });
  const [selectedAccount, setSelectedAccount] = useState<VirtualAccount | null>(null);
  const [stats, setStats] = useState<any>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [copiedAcc, setCopiedAcc] = useState(false);

  const fetchData = useCallback(async (silent = false) => {
    if (!token) return;
    if (!silent) setLoading(true);
    else setIsRefreshing(true);

    try {
      const res = await virtualAccountsApi.getAll(token, {
        page,
        search: search || undefined,
        status: statusFilter || undefined,
      });

      if (res.success) {
        setAccounts(res.data.data || []);
        if (res.data.current_page) {
          setMeta({
            current_page: res.data.current_page,
            last_page: res.data.last_page,
            per_page: res.data.per_page,
            total: res.data.total
          });
        }
        if (res.stats) setStats(res.stats);
      }
    } catch (err) {
      toast.error("Failed to load virtual accounts");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [token, page, search, statusFilter]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleStatusUpdate = async (id: number, currentStatus: string) => {
    if (!token) return;
    setActionLoading(true);
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    try {
      // Assuming your API handles string statuses ('active' / 'inactive') or booleans
      await virtualAccountsApi.updateStatus(token, id, newStatus);
      toast.success(`Account marked as ${newStatus} successfully`);
      setSelectedAccount(null);
      fetchData(true);
    } catch (err: any) {
      toast.error(err.message || "Failed to update account status");
    } finally {
      setActionLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedAcc(true);
    setTimeout(() => setCopiedAcc(false), 2000);
    toast.success("Account number copied!");
  };

  const columns = [
    {
      key: 'account',
      label: 'Account Details',
      render: (a: VirtualAccount) => (
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 border border-blue-100 text-blue-600 dark:bg-blue-500/10 dark:border-blue-500/20 dark:text-blue-400 shadow-sm">
              <Landmark size={18} />
            </div>
            <div className="flex flex-col">
            <span className="text-sm font-mono font-bold text-gray-900 dark:text-gray-100 tracking-wider">
              {a.account_number}
            </span>
              <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider mt-0.5">
              {a.bank_name}
            </span>
            </div>
          </div>
      ),
    },
    {
      key: 'account_name',
      label: 'Assigned Name',
      render: (a: VirtualAccount) => (
          <span className="text-sm font-semibold text-gray-900 dark:text-gray-200">
          {a.account_name}
        </span>
      ),
    },
    {
      key: 'user',
      label: 'Owner',
      render: (a: VirtualAccount) => (
          <div className="flex flex-col">
          <span className="text-sm font-semibold text-gray-900 dark:text-gray-100 capitalize">
            {a.user_name}
          </span>
            <span className="text-[11px] text-gray-500">
            {a.user?.email || `User #${a.user_id}`}
          </span>
          </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (a: VirtualAccount) => <StatusBadge status={a.status} />,
    },
    {
      key: 'created_at',
      label: 'Provisioned On',
      render: (a: VirtualAccount) => (
          <div className="flex flex-col">
          <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
            {a.formatted_date.split(',')[0]}
          </span>
            <span className="text-[10px] text-gray-500">
            {a.formatted_date.split(',')[1]?.trim()}
          </span>
          </div>
      ),
    },
    {
      key: 'actions',
      label: '',
      className: 'text-right',
      render: (a: VirtualAccount) => (
          <button
              onClick={(e) => { e.stopPropagation(); setSelectedAccount(a); }}
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
            title="Virtual Accounts"
            description="Monitor and manage dedicated bank accounts assigned to users."
            onRefresh={() => fetchData(true)}
            isRefreshing={isRefreshing}
        />

        {/* Stats Board */}
        {stats && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard title="Total Accounts" value={stats.total || '0'} icon="bank" color="indigo" />
              <StatCard title="Active Accounts" value={stats.active || '0'} icon="shield" color="emerald" />
              <StatCard title="Inactive/Suspended" value={stats.inactive || '0'} icon="alert" color="rose" />
              <StatCard title="New This Month" value={stats.new_this_month || '0'} icon="activity" color="blue" />
            </div>
        )}

        {/* Main Table Card */}
        <div className="bg-white dark:bg-[#111118] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-white/[0.02]">
            <SearchFilter
                searchValue={search}
                onSearchChange={(v) => { setSearch(v); setPage(1); }}
                searchPlaceholder="Search by account number, name, or bank..."
                filters={[
                  {
                    key: 'status',
                    label: 'Status',
                    options: [
                      { label: 'Active', value: 'active' },
                      { label: 'Inactive', value: 'inactive' },
                      { label: 'Suspended', value: 'suspended' },
                    ],
                    value: statusFilter,
                    onChange: (v) => { setStatusFilter(v); setPage(1); },
                  },
                ]}
                onClear={() => { setSearch(''); setStatusFilter(''); setPage(1); }}
            />
          </div>

          <DataTable
              columns={columns}
              data={accounts}
              currentPage={meta.current_page}
              totalPages={meta.last_page}
              total={meta.total}
              onPageChange={setPage}
              onRowClick={(a) => setSelectedAccount(a)}
              emptyMessage="No virtual accounts found."
              emptyDescription="Provisioned virtual accounts will appear here."
          />
        </div>

        {/* Detailed Modal */}
        <Modal
            isOpen={!!selectedAccount}
            onClose={() => { setSelectedAccount(null); setCopiedAcc(false); }}
            title="Virtual Account Details"
            size="2xl"
        >
          {selectedAccount && (
              <div className="space-y-6">

                {/* Header: Bank & Account Number */}
                <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-900 rounded-2xl p-6 text-white shadow-md">
                  <div className="absolute -right-6 -top-6 opacity-10">
                    <Landmark size={120} />
                  </div>
                  <div className="relative z-10 flex justify-between items-start mb-6">
                    <div className="flex items-center gap-2">
                      <Building2 size={20} className="text-blue-200" />
                      <span className="text-sm font-bold uppercase tracking-widest text-blue-100">
                    {selectedAccount.bank_name}
                  </span>
                    </div>
                    <StatusBadge status={selectedAccount.status} />
                  </div>

                  <div className="relative z-10">
                    <p className="text-[10px] uppercase tracking-widest text-blue-200 mb-1">Account Number</p>
                    <div className="flex items-center gap-4">
                  <span className="text-3xl sm:text-4xl font-mono font-black tracking-widest">
                    {selectedAccount.account_number}
                  </span>
                      <button
                          onClick={() => copyToClipboard(selectedAccount.account_number)}
                          className="p-2.5 bg-white/10 hover:bg-white/20 rounded-xl transition-colors backdrop-blur-sm"
                          title="Copy Account Number"
                      >
                        {copiedAcc ? <CheckCircle2 size={20} className="text-emerald-400" /> : <Copy size={20} />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Account Details */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 pb-2">
                      <Landmark size={14} className="text-indigo-500" /> Banking Details
                    </h4>
                    <div className="grid grid-cols-1 gap-y-4">
                      <DetailItem label="Assigned Account Name" value={selectedAccount.account_name} />
                      <div className="grid grid-cols-2 gap-4">
                        <DetailItem label="Internal ID" value={`#${selectedAccount.id}`} />
                        <DetailItem label="Linked Wallet ID" value={`#${selectedAccount.wallet_id}`} />
                      </div>
                      <DetailItem label="Provisioned On" value={selectedAccount.formatted_date} icon={<Calendar size={12} />} />
                    </div>
                  </div>

                  {/* Owner Details */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 pb-2">
                      <UserIcon size={14} className="text-indigo-500" /> Owner Context
                    </h4>
                    <div className="grid grid-cols-1 gap-y-4 bg-gray-50 dark:bg-[#1A1A24] p-4 rounded-xl border border-gray-100 dark:border-gray-800">
                      <DetailItem label="Full Name" value={selectedAccount.user_name} />
                      <DetailItem label="Email Address" value={selectedAccount.user?.email || 'N/A'} />
                      <div className="grid grid-cols-2 gap-4">
                        <DetailItem label="Phone" value={selectedAccount.user?.phone || 'N/A'} />
                        <DetailItem label="User Status" value={selectedAccount.user_status} className="capitalize" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* System Metadata (If any) */}
                {selectedAccount.metadata && (
                    <div className="space-y-3 pt-2 border-t border-gray-100 dark:border-gray-800">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
                        <Database size={12} /> System Metadata
                      </h4>
                      <div className="p-4 rounded-xl bg-[#0B0B15] border border-gray-800 overflow-x-auto">
                  <pre className="text-xs text-emerald-400 font-mono">
                    {typeof selectedAccount.metadata === 'string'
                        ? selectedAccount.metadata
                        : JSON.stringify(selectedAccount.metadata, null, 2)}
                  </pre>
                      </div>
                    </div>
                )}

                {/* Administration Actions */}
                <div className="pt-4 mt-6 border-t border-gray-200 dark:border-gray-800 flex justify-end gap-3">
                  {selectedAccount.status === 'active' ? (
                      <button
                          onClick={() => handleStatusUpdate(selectedAccount.id, selectedAccount.status)}
                          disabled={actionLoading}
                          className="inline-flex justify-center items-center gap-2 px-5 py-2.5 bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20 rounded-xl text-sm font-bold hover:bg-rose-100 dark:hover:bg-rose-500/20 transition-all disabled:opacity-50"
                      >
                        <ShieldAlert size={16} />
                        Deactivate Account
                      </button>
                  ) : (
                      <button
                          onClick={() => handleStatusUpdate(selectedAccount.id, selectedAccount.status)}
                          disabled={actionLoading}
                          className="inline-flex justify-center items-center gap-2 px-5 py-2.5 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 rounded-xl text-sm font-bold hover:bg-emerald-100 dark:hover:bg-emerald-500/20 transition-all disabled:opacity-50"
                      >
                        <ShieldCheck size={16} />
                        Activate Account
                      </button>
                  )}
                </div>

              </div>
          )}
        </Modal>
      </div>
  );
}

function DetailItem({ label, value, icon, className = "" }: { label: string; value: string; icon?: React.ReactNode; className?: string }) {
  return (
      <div className={className}>
        <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-1 flex items-center gap-1.5">
          {icon} {label}
        </p>
        <p className="text-sm font-semibold text-gray-900 dark:text-white break-words">{value}</p>
      </div>
  );
}