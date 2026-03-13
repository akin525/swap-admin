"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { usersApi } from "@/lib/api";
import { toast } from "react-hot-toast";
import {
  Eye, ShieldCheck, ShieldAlert, Wallet, Phone,
  Mail, Clock, CheckCircle2, XCircle, User as UserIcon
} from "lucide-react";

import PageHeader from "@/components/ui/PageHeader";
import SearchFilter from "@/components/ui/SearchFilter";
import DataTable from "@/components/ui/DataTable";
import StatusBadge from "@/components/ui/StatusBadge";
import StatCard from "@/components/ui/StatCard";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";
import { formatDate } from "@/lib/utils";

// Updated Type based on your JSON response
export interface User {
  id: number;
  firstname: string;
  lastname: string;
  full_name: string;
  email: string;
  country_code: string;
  phone: string;
  email_verified: number;
  bvn: string | null;
  status: string;
  online: boolean | null;
  currency_preference: string;
  wallet_count: number;
  total_balance: number;
  avatar: string;
  created_at: string;
  updated_at: string;
}

export default function UsersPage() {
  const { token } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ current_page: 1, last_page: 1, per_page: 20, total: 0 });
  const [stats, setStats] = useState<any>(null);

  const fetchData = useCallback(async (silent = false) => {
    if (!token) return;
    if (!silent) setLoading(true);
    else setIsRefreshing(true);

    try {
      const res = await usersApi.getAll(token, {
        page,
        search: search || undefined,
        status: statusFilter || undefined,
      });

      if (res.success) {
        setUsers(res.data.data || []);
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
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [token, page, search, statusFilter]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Utility to format numbers as currency since the API returns a raw number for total_balance
  const formatUserBalance = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
    }).format(amount);
  };

  const columns = [
    {
      key: 'user',
      label: 'Customer',
      render: (u: User) => (
          <div className="flex items-center gap-3">
            <div className="relative">
              {u.avatar ? (
                  <img
                      src={u.avatar}
                      alt={u.full_name}
                      className="h-10 w-10 rounded-xl bg-gray-100 dark:bg-gray-800 object-cover border border-gray-200 dark:border-gray-700"
                  />
              ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                    <UserIcon size={18} />
                  </div>
              )}
              <span
                  className={`absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-white dark:border-[#111118] ${
                      u.online ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                  title={u.online ? 'Online' : 'Offline'}
              />
            </div>
            <div className="flex flex-col">
            <span className="text-sm font-bold text-gray-900 dark:text-gray-100 capitalize">
              {u.full_name}
            </span>
              <span className="text-[11px] text-gray-500 flex items-center gap-1 mt-0.5">
              <Mail size={10} /> {u.email}
            </span>
            </div>
          </div>
      ),
    },
    {
      key: 'contact',
      label: 'Contact',
      render: (u: User) => (
          <div className="flex flex-col gap-1">
          <span className="inline-flex items-center gap-1 text-sm font-medium text-gray-700 dark:text-gray-300">
            <Phone size={12} className="text-gray-400" />
            {u.country_code} {u.phone}
          </span>
          </div>
      ),
    },
    {
      key: 'verification',
      label: 'Verification',
      render: (u: User) => (
          <div className="flex flex-col gap-1.5">
            <div className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider ${u.email_verified ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
              {u.email_verified ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
              Email {u.email_verified ? 'Verified' : 'Unverified'}
            </div>
            <div className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider ${u.bvn ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400'}`}>
              {u.bvn ? <ShieldCheck size={12} /> : <ShieldAlert size={12} />}
              {u.bvn ? 'BVN Linked' : 'No BVN'}
            </div>
          </div>
      ),
    },
    {
      key: 'portfolio',
      label: 'Portfolio / Wallets',
      render: (u: User) => (
          <div className="flex flex-col">
          <span className="text-sm font-black text-gray-900 dark:text-white">
            {formatUserBalance(u.total_balance, u.currency_preference)}
          </span>
            <span className="inline-flex items-center gap-1 text-[10px] font-medium text-gray-500 mt-0.5">
            <Wallet size={10} />
              {u.wallet_count} {u.wallet_count === 1 ? 'Wallet' : 'Wallets'}
          </span>
          </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (u: User) => <StatusBadge status={u.status} />,
    },
    {
      key: 'created_at',
      label: 'Joined',
      render: (u: User) => (
          <div className="flex flex-col">
          <span className="text-xs font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1">
            <Clock size={12} className="text-gray-400" />
            {formatDate(u.created_at).split(',')[0]}
          </span>
          </div>
      ),
    },
    {
      key: 'actions',
      label: '',
      className: 'text-right',
      render: (u: User) => (
          <button
              onClick={(e) => { e.stopPropagation(); router.push(`/dashboard/users/${u.id}`); }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-gray-800/50 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-xl text-xs font-bold transition-all shadow-sm"
          >
            <Eye size={14} />
            Profile
          </button>
      ),
    },
  ];

  if (loading) return <LoadingSkeleton type="page" />;

  return (
      <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in duration-500">
        <PageHeader
            title="User Directory"
            description="Manage customer profiles, verify identities, and monitor account activity."
            onRefresh={() => fetchData(true)}
            isRefreshing={isRefreshing}
        />

        {/* Statistics Board */}
        {stats && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard title="Total Users" value={stats.total || '0'} trend={stats.total_trend} icon="users" color="indigo" />
              <StatCard title="Active Users" value={stats.active || '0'} icon="shield" color="emerald" />
              <StatCard title="Blocked Users" value={stats.blocked || '0'} icon="alert" color="rose" />
              <StatCard title="Verified Users" value={stats.verified || '0'} icon="check-circle" color="blue" />
            </div>
        )}

        {/* Main Table Card */}
        <div className="bg-white dark:bg-[#111118] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-white/[0.02]">
            <SearchFilter
                searchValue={search}
                onSearchChange={(v) => { setSearch(v); setPage(1); }}
                searchPlaceholder="Search by name, email, phone, or BVN..."
                filters={[
                  {
                    key: 'status',
                    label: 'Status',
                    options: [
                      { label: 'Active', value: 'active' },
                      { label: 'Blocked', value: 'blocked' },
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
              data={users}
              currentPage={meta.current_page}
              totalPages={meta.last_page}
              total={meta.total}
              onPageChange={setPage}
              onRowClick={(u) => router.push(`/dashboard/users/${u.id}`)}
              emptyMessage="No users found."
              emptyDescription="User registrations will appear here."
          />
        </div>
      </div>
  );
}