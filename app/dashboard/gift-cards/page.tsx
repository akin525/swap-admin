"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { giftCardsApi } from "@/lib/api";
import { toast } from "react-hot-toast";
import {
  Eye, Gift, Copy, CheckCircle2, Mail, MessageSquare,
  ShoppingBag, User as UserIcon, Tag
} from "lucide-react";

import PageHeader from "@/components/ui/PageHeader";
import SearchFilter from "@/components/ui/SearchFilter";
import DataTable from "@/components/ui/DataTable";
import StatusBadge from "@/components/ui/StatusBadge";
import StatCard from "@/components/ui/StatCard";
import Modal from "@/components/ui/Modal";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";

// Updated type based on your JSON response
export interface GiftCardUser {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
}

export interface GiftCardTransaction {
  id: number;
  user_id: number;
  reference: string;
  gift_card_type: string;
  type: string;
  amount: string;
  fee: string;
  total_amount: string;
  currency: string;
  recipient_email: string | null;
  message: string | null;
  gift_card_code: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  formatted_amount: string;
  formatted_total: string;
  user_name: string;
  formatted_date: string;
  user: GiftCardUser;
}

// Helper to get brand-specific colors
const getBrandStyles = (brandName: string) => {
  const brand = brandName.toLowerCase();
  if (brand.includes('amazon')) return 'bg-orange-50 text-orange-600 border-orange-200 dark:bg-orange-500/10 dark:text-orange-400 dark:border-orange-500/20';
  if (brand.includes('google')) return 'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20';
  if (brand.includes('steam')) return 'bg-indigo-50 text-indigo-600 border-indigo-200 dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/20';
  if (brand.includes('itunes') || brand.includes('apple')) return 'bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700';
  return 'bg-pink-50 text-pink-600 border-pink-200 dark:bg-pink-500/10 dark:text-pink-400 dark:border-pink-500/20';
};

export default function GiftCardsPage() {
  const { token } = useAuth();
  const [transactions, setTransactions] = useState<GiftCardTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ current_page: 1, last_page: 1, per_page: 20, total: 0 });
  const [selectedTx, setSelectedTx] = useState<GiftCardTransaction | null>(null);
  const [stats, setStats] = useState<any>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  const fetchData = useCallback(async (silent = false) => {
    if (!token) return;
    if (!silent) setLoading(true);
    else setIsRefreshing(true);

    try {
      const res = await giftCardsApi.getAll(token, {
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
      toast.error("Failed to load gift card transactions");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [token, page, search, statusFilter, typeFilter]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const copyToClipboard = (text: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
    toast.success("Gift card code copied!");
  };

  const columns = [
    {
      key: 'reference',
      label: 'Reference & Date',
      render: (t: GiftCardTransaction) => (
          <div className="flex flex-col gap-1">
          <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">
            {t.reference}
          </span>
            <span className="text-[11px] text-gray-500">
            {t.formatted_date.split(',')[0]}
          </span>
          </div>
      ),
    },
    {
      key: 'gift_card_type',
      label: 'Brand & Type',
      render: (t: GiftCardTransaction) => (
          <div className="flex flex-col gap-1.5 items-start">
          <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${getBrandStyles(t.gift_card_type)}`}>
            <Gift size={12} />
            {t.gift_card_type}
          </span>
            <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
            {t.type}
          </span>
          </div>
      ),
    },
    {
      key: 'user',
      label: 'Buyer',
      render: (t: GiftCardTransaction) => (
          <div className="flex flex-col">
          <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            {t.user_name}
          </span>
            <span className="text-[11px] text-gray-500 truncate max-w-[150px]">
            {t.user?.email || 'N/A'}
          </span>
          </div>
      ),
    },
    {
      key: 'amount',
      label: 'Total Paid',
      render: (t: GiftCardTransaction) => (
          <div className="flex flex-col">
          <span className="text-sm font-bold text-gray-900 dark:text-white">
            {t.formatted_total}
          </span>
            <span className="text-[10px] text-gray-400">
            Card Value: {t.formatted_amount}
          </span>
          </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (t: GiftCardTransaction) => <StatusBadge status={t.status} />,
    },
    {
      key: 'actions',
      label: '',
      className: 'text-right',
      render: (t: GiftCardTransaction) => (
          <button
              onClick={(e) => { e.stopPropagation(); setSelectedTx(t); }}
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
            title="Gift Cards Ledger"
            description="Monitor platform gift card purchases, deliveries, and redemptions."
            onRefresh={() => fetchData(true)}
            isRefreshing={isRefreshing}
        />

        {/* Stats Board */}
        {stats && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard title="Total Transactions" value={stats.total || '0'} icon="gift" color="pink" />
              <StatCard title="Purchases" value={stats.purchases || '0'} icon="shopping-bag" color="blue" />
              <StatCard title="Redemptions" value={stats.redemptions || '0'} icon="repeat" color="emerald" />
              <StatCard title="Total Volume" value={stats.volume || '₦0.00'} icon="dollar" color="indigo" />
            </div>
        )}

        {/* Main Table Card */}
        <div className="bg-white dark:bg-[#111118] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-white/[0.02]">
            <SearchFilter
                searchValue={search}
                onSearchChange={(v) => { setSearch(v); setPage(1); }}
                searchPlaceholder="Search by reference, brand, or buyer..."
                filters={[
                  {
                    key: 'status',
                    label: 'Status',
                    options: [
                      { label: 'Pending', value: 'pending' },
                      { label: 'Completed', value: 'completed' },
                      { label: 'Failed', value: 'failed' },
                    ],
                    value: statusFilter,
                    onChange: (v) => { setStatusFilter(v); setPage(1); },
                  },
                  {
                    key: 'type',
                    label: 'Type',
                    options: [
                      { label: 'Purchase', value: 'purchase' },
                      { label: 'Redemption', value: 'redemption' },
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
              onRowClick={(t) => setSelectedTx(t)}
              emptyMessage="No gift card transactions found."
              emptyDescription="Purchases and redemptions will appear here."
          />
        </div>

        {/* Detailed Modal */}
        <Modal
            isOpen={!!selectedTx}
            onClose={() => { setSelectedTx(null); setCopiedCode(false); }}
            title="Gift Card Voucher Details"
            size="2xl"
        >
          {selectedTx && (
              <div className="space-y-6">

                {/* Header: Brand & Status */}
                <div className="flex items-start justify-between bg-gray-50 dark:bg-gray-800/50 p-5 rounded-2xl border border-gray-100 dark:border-gray-700">
                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-1">Transaction Reference</p>
                    <span className="text-lg font-mono font-bold text-gray-900 dark:text-white">
                  {selectedTx.reference}
                </span>
                    <div className="mt-2">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${getBrandStyles(selectedTx.gift_card_type)}`}>
                    <Gift size={12} />
                    {selectedTx.gift_card_type}
                  </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <StatusBadge status={selectedTx.status} />
                    <span className="text-2xl font-black text-gray-900 dark:text-white mt-1">
                  {selectedTx.formatted_total}
                </span>
                  </div>
                </div>

                {/* Revealed Code Section (If available & completed) */}
                {selectedTx.gift_card_code && selectedTx.status === 'completed' && (
                    <div className="bg-emerald-50/50 dark:bg-emerald-900/10 p-5 rounded-2xl border border-emerald-100 dark:border-emerald-900/30 text-center">
                      <p className="text-xs font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-widest mb-3">
                        Digital Card Code
                      </p>
                      <div className="inline-flex items-center gap-3 bg-white dark:bg-[#0B0B15] border border-emerald-200 dark:border-emerald-800 px-6 py-3 rounded-xl shadow-sm">
                  <span className="text-xl sm:text-2xl font-mono font-bold tracking-[0.2em] text-gray-900 dark:text-white">
                    {selectedTx.gift_card_code}
                  </span>
                        <div className="w-px h-8 bg-gray-200 dark:bg-gray-800 mx-1"></div>
                        <button
                            onClick={() => copyToClipboard(selectedTx.gift_card_code!)}
                            className="p-2 rounded-lg text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition-colors"
                            title="Copy Code"
                        >
                          {copiedCode ? <CheckCircle2 size={20} /> : <Copy size={20} />}
                        </button>
                      </div>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Financial & Tx Info */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 pb-2">
                      <ShoppingBag size={14} className="text-indigo-500" /> Transaction Breakdown
                    </h4>
                    <div className="grid grid-cols-2 gap-y-4 gap-x-2">
                      <DetailItem label="Card Value" value={selectedTx.formatted_amount} />
                      <DetailItem label="Platform Fee" value={`${selectedTx.currency} ${selectedTx.fee}`} />
                      <DetailItem label="Type" value={selectedTx.type} className="capitalize" />
                      <DetailItem label="Currency" value={selectedTx.currency} />
                      <DetailItem label="Date" value={selectedTx.formatted_date} className="col-span-2" />
                    </div>
                  </div>

                  {/* Delivery Details */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 pb-2">
                      <Mail size={14} className="text-indigo-500" /> Delivery Details
                    </h4>
                    <div className="bg-gray-50 dark:bg-[#1A1A24] p-4 rounded-xl border border-gray-100 dark:border-gray-800 space-y-4">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-1 flex items-center gap-1.5">
                          Recipient Email
                        </p>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white break-all">
                          {selectedTx.recipient_email || 'Delivered to buyer'}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-1 flex items-center gap-1.5">
                          <MessageSquare size={12} /> Gift Message
                        </p>
                        <p className="text-sm text-gray-800 dark:text-gray-300 italic bg-white dark:bg-[#0B0B15] p-3 rounded-lg border border-gray-100 dark:border-gray-800 mt-1">
                          {selectedTx.message ? `"${selectedTx.message}"` : 'No message attached.'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Buyer Context */}
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 pb-2">
                    <UserIcon size={14} className="text-indigo-500" /> Buyer Information
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <DetailItem label="Name" value={selectedTx.user_name} />
                    <DetailItem label="Email" value={selectedTx.user?.email || 'N/A'} />
                    <DetailItem label="Phone" value={selectedTx.user?.phone || 'N/A'} />
                  </div>
                </div>

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