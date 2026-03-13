"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { cardsApi } from "@/lib/api";
import { toast } from "react-hot-toast";
import {
  Eye, CreditCard, Lock, Globe, Smartphone, Shield, Activity, Snowflake, AlertCircle
} from "lucide-react";

import PageHeader from "@/components/ui/PageHeader";
import SearchFilter from "@/components/ui/SearchFilter";
import DataTable from "@/components/ui/DataTable";
import StatusBadge from "@/components/ui/StatusBadge";
import StatCard from "@/components/ui/StatCard";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";

// Updated type based exactly on your JSON response
export interface CardUser {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
}

export interface Card {
  id: number;
  user_id: number;
  card_number: string;
  card_holder_name: string;
  expiry_month: string;
  expiry_year: string;
  card_type: string;
  currency: string;
  balance: string;
  status: string;
  style_id: number;
  freeze_physical_card: boolean;
  disable_web_purchase: boolean;
  disable_contactless: boolean;
  is_disabled: boolean;
  created_at: string;
  updated_at: string;
  masked_number: string;
  formatted_balance: string;
  expiry_date: string;
  user_name: string;
  transaction_count: number;
  formatted_date: string;
  user: CardUser;
}

export default function CardsPage() {
  const { token } = useAuth();
  const router = useRouter();
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ current_page: 1, last_page: 1, per_page: 20, total: 0 });
  const [stats, setStats] = useState<any>(null);

  const fetchData = useCallback(async (silent = false) => {
    if (!token) return;
    if (!silent) setLoading(true);
    else setIsRefreshing(true);

    try {
      const res = await cardsApi.getAll(token, {
        page,
        search: search || undefined,
        status: statusFilter || undefined,
        card_type: typeFilter || undefined,
      });

      if (res.success) {
        // Handle pagination structure
        setCards(res.data.data || []);
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
      toast.error("Failed to load cards");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [token, page, search, statusFilter, typeFilter]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const columns = [
    {
      key: 'card',
      label: 'Card Info',
      render: (c: Card) => {
        const isVirtual = c.card_type === 'virtual';
        return (
            <div className="flex items-center gap-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl border ${
                  isVirtual
                      ? 'bg-indigo-50 border-indigo-100 text-indigo-600 dark:bg-indigo-500/10 dark:border-indigo-500/20 dark:text-indigo-400'
                      : 'bg-amber-50 border-amber-100 text-amber-600 dark:bg-amber-500/10 dark:border-amber-500/20 dark:text-amber-400'
              }`}>
                <CreditCard size={18} />
              </div>
              <div className="flex flex-col">
              <span className="text-sm font-mono font-bold text-gray-900 dark:text-gray-100 tracking-wider">
                {c.masked_number}
              </span>
                <div className="flex items-center gap-1.5 mt-0.5">
                <span className={`text-[9px] uppercase font-bold px-1.5 rounded-sm tracking-wider ${
                    isVirtual ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300'
                        : 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
                }`}>
                  {c.card_type}
                </span>
                  <span className="text-[10px] text-gray-400 font-semibold">{c.currency}</span>
                </div>
              </div>
            </div>
        );
      },
    },
    {
      key: 'holder',
      label: 'Cardholder',
      render: (c: Card) => (
          <div className="flex flex-col">
          <span className="text-sm font-bold text-gray-900 dark:text-gray-100 capitalize">
            {c.card_holder_name.trim()}
          </span>
            <span className="text-[11px] text-gray-500">
            {c.user?.email || `User #${c.user_id}`}
          </span>
          </div>
      ),
    },
    {
      key: 'balance',
      label: 'Balance & Usage',
      render: (c: Card) => (
          <div className="flex flex-col">
          <span className="text-sm font-black text-gray-900 dark:text-white">
            {c.formatted_balance}
          </span>
            <span className="inline-flex items-center gap-1 text-[10px] font-medium text-gray-500 mt-0.5">
            <Activity size={10} />
              {c.transaction_count} Transactions
          </span>
          </div>
      ),
    },
    {
      key: 'expiry',
      label: 'Valid Thru',
      render: (c: Card) => (
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 font-mono">
          {c.expiry_date}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (c: Card) => <StatusBadge status={c.status} />,
    },
    {
      key: 'controls',
      label: 'Security Flags',
      render: (c: Card) => {
        // If everything is normal
        if (!c.is_disabled && !c.freeze_physical_card && !c.disable_web_purchase && !c.disable_contactless) {
          return (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 text-[10px] font-bold tracking-wider">
              <Shield size={12} /> SECURE & ACTIVE
            </span>
          );
        }

        // Display individual flags
        return (
            <div className="flex items-center gap-1.5">
              {c.is_disabled && (
                  <div title="Card is completely disabled" className="p-1.5 rounded-md bg-rose-100 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400">
                    <AlertCircle size={14} />
                  </div>
              )}
              {c.freeze_physical_card && (
                  <div title="Physical card is frozen" className="p-1.5 rounded-md bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400">
                    <Snowflake size={14} />
                  </div>
              )}
              {c.disable_web_purchase && (
                  <div title="Web purchases are blocked" className="p-1.5 rounded-md bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400 relative">
                    <Globe size={14} />
                    <div className="absolute inset-0 flex items-center justify-center"><div className="w-full h-[1.5px] bg-red-500 rotate-45"></div></div>
                  </div>
              )}
              {c.disable_contactless && (
                  <div title="Contactless payments are blocked" className="p-1.5 rounded-md bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400 relative">
                    <Smartphone size={14} />
                    <div className="absolute inset-0 flex items-center justify-center"><div className="w-full h-[1.5px] bg-red-500 rotate-45"></div></div>
                  </div>
              )}
            </div>
        );
      },
    },
    {
      key: 'actions',
      label: '',
      className: 'text-right',
      render: (c: Card) => (
          <button
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/dashboard/cards/${c.id}`);
              }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-gray-800/50 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-xl text-xs font-bold transition-all shadow-sm"
          >
            <Eye size={14} />
            View Details
          </button>
      ),
    },
  ];

  if (loading) return <LoadingSkeleton type="page" />;

  return (
      <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in duration-500">
        <PageHeader
            title="Card Administration"
            description="Monitor issued cards, check balances, and review security settings."
            onRefresh={() => fetchData(true)}
            isRefreshing={isRefreshing}
        />

        {/* Statistics Board */}
        {stats && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard title="Total Cards Issued" value={stats.total || '0'} icon="credit-card" color="indigo" />
              <StatCard title="Virtual Cards" value={stats.virtual || '0'} icon="monitor" color="blue" />
              <StatCard title="Physical Cards" value={stats.physical || '0'} icon="credit-card" color="amber" />
              <StatCard title="Active Cards" value={stats.active || '0'} icon="shield" color="emerald" />
            </div>
        )}

        {/* Main Table Card */}
        <div className="bg-white dark:bg-[#111118] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-white/[0.02]">
            <SearchFilter
                searchValue={search}
                onSearchChange={(v) => { setSearch(v); setPage(1); }}
                searchPlaceholder="Search by cardholder, masked number, or email..."
                filters={[
                  {
                    key: 'status',
                    label: 'Status',
                    options: [
                      { label: 'Active', value: 'active' },
                      { label: 'Inactive', value: 'inactive' },
                      { label: 'Blocked', value: 'blocked' },
                      { label: 'Expired', value: 'expired' },
                    ],
                    value: statusFilter,
                    onChange: (v) => { setStatusFilter(v); setPage(1); },
                  },
                  {
                    key: 'type',
                    label: 'Card Type',
                    options: [
                      { label: 'Virtual', value: 'virtual' },
                      { label: 'Physical', value: 'physical' },
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
              data={cards}
              currentPage={meta.current_page}
              totalPages={meta.last_page}
              total={meta.total}
              onPageChange={setPage}
              onRowClick={(c) => router.push(`/dashboard/cards/${c.id}`)}
              emptyMessage="No cards found."
              emptyDescription="Cards will appear here once they are issued to users."
          />
        </div>
      </div>
  );
}