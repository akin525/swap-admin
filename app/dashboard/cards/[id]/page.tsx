"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { cardsApi } from "@/lib/api";
import { toast } from "react-hot-toast";
import {
  ArrowLeft, CreditCard, ShieldOff, ShieldCheck, Trash2, Globe,
  Snowflake, Smartphone, AlertCircle, Activity, User as UserIcon, Building2
} from "lucide-react";

import StatusBadge from "@/components/ui/StatusBadge";
import DataTable from "@/components/ui/DataTable";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";
import StatCard from "@/components/ui/StatCard";

// Types based on your JSON response
export interface CardTransaction {
  id: number;
  user_id: number;
  card_id: number;
  reference: string;
  type: string;
  amount: string;
  fee: string;
  currency: string;
  status: string;
  description: string;
  merchant_name: string | null;
  merchant_category: string | null;
  provider_transaction_id: string | null;
  created_at: string;
  updated_at: string;
  formatted_amount: string;
  formatted_date: string;
}

export interface CardStats {
  total_transactions: number;
  total_spent: number;
  total_funded: number;
}

export interface CardDetailData {
  card: any; // Using the 'Card' interface from the previous file
  masked_number: string;
  expiry_date: string;
  formatted_balance: string;
  recent_transactions: CardTransaction[];
  stats: CardStats;
}

export default function CardDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { token } = useAuth();

  const [data, setData] = useState<CardDetailData | null>(null);
  const [transactions, setTransactions] = useState<CardTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [txMeta, setTxMeta] = useState({ current_page: 1, last_page: 1, per_page: 20, total: 0 });
  const [txPage, setTxPage] = useState(1);

  const fetchCardDetails = useCallback(async () => {
    if (!token || !id) return;
    try {
      // Assuming your API returns the combined data structure you provided
      const res = await cardsApi.getById(token, Number(id));
      if (res.success) {
        setData(res.data);
      }
    } catch (err) {
      toast.error("Failed to load card details");
    }
  }, [token, id]);

  const fetchTransactions = useCallback(async () => {
    if (!token || !id) return;
    try {
      // Assuming your API has a paginated endpoint for card transactions
      const res = await cardsApi.getTransactions(token, Number(id), { page: txPage });
      if (res.success) {
        // Handle both standard paginated format and the specific JSON format provided
        const txData = res.data.data || res.data;
        setTransactions(txData);
        if (res.data.current_page) {
          setTxMeta({
            current_page: res.data.current_page,
            last_page: res.data.last_page,
            per_page: res.data.per_page,
            total: res.data.total
          });
        }
      }
    } catch (err) {
      console.error("Failed to load paginated transactions", err);
    }
  }, [token, id, txPage]);

  // Initial load
  useEffect(() => {
    const loadAll = async () => {
      setLoading(true);
      await Promise.all([fetchCardDetails(), fetchTransactions()]);
      setLoading(false);
    };
    loadAll();
  }, [fetchCardDetails, fetchTransactions]);

  const updateStatus = async (status: string) => {
    if (!token || !data?.card) return;
    setActionLoading(true);
    try {
      await cardsApi.updateStatus(token, data.card.id, status);
      toast.success(`Card ${status} successfully`);
      fetchCardDetails();
    } catch (err: any) {
      toast.error(err.message || "Failed to update card status");
    } finally {
      setActionLoading(false);
    }
  };

  const toggleSetting = async (setting: string, currentValue: boolean) => {
    if (!token || !data?.card) return;
    setActionLoading(true);
    try {
      // Assuming the API expects the opposite of the current value
      await cardsApi.updateSettings(token, data.card.id, { [setting]: !currentValue });
      toast.success("Security setting updated");
      fetchCardDetails();
    } catch (err: any) {
      toast.error(err.message || "Failed to update setting");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!token || !data?.card) return;
    if (!confirm("Are you sure you want to permanently delete this card? This action cannot be undone.")) return;
    setActionLoading(true);
    try {
      await cardsApi.delete(token, data.card.id);
      toast.success("Card deleted successfully");
      router.push("/dashboard/cards");
    } catch (err: any) {
      toast.error(err.message || "Failed to delete card");
    } finally {
      setActionLoading(false);
    }
  };

  const txColumns = [
    {
      key: 'reference',
      label: 'Reference',
      render: (tx: CardTransaction) => (
          <div className="flex flex-col">
          <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">
            {tx.reference}
          </span>
            <span className="text-[10px] text-gray-500 uppercase tracking-wider">{tx.type || 'Transaction'}</span>
          </div>
      ),
    },
    {
      key: 'description',
      label: 'Description / Merchant',
      render: (tx: CardTransaction) => (
          <div className="flex flex-col">
          <span className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate max-w-[200px]">
            {tx.merchant_name || tx.description || '—'}
          </span>
            {tx.merchant_category && (
                <span className="text-[11px] text-gray-500 flex items-center gap-1">
              <Building2 size={10} /> {tx.merchant_category}
            </span>
            )}
          </div>
      ),
    },
    {
      key: 'amount',
      label: 'Amount',
      render: (tx: CardTransaction) => {
        const isCredit = tx.type.toLowerCase() === 'refund' || tx.type.toLowerCase() === 'deposit' || tx.type.toLowerCase() === 'funding';
        return (
            <div className="flex flex-col">
            <span className={`text-sm font-bold ${isCredit ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-900 dark:text-white'}`}>
              {isCredit ? '+' : ''}{tx.formatted_amount}
            </span>
              {Number(tx.fee) > 0 && (
                  <span className="text-[10px] text-gray-400">Fee: {tx.currency} {tx.fee}</span>
              )}
            </div>
        );
      },
    },
    {
      key: 'status',
      label: 'Status',
      render: (tx: CardTransaction) => <StatusBadge status={tx.status || 'completed'} />, // Fallback to completed if empty in JSON
    },
    {
      key: 'date',
      label: 'Date',
      render: (tx: CardTransaction) => (
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
  ];

  if (loading || !data) return <LoadingSkeleton type="page" />;

  const { card, masked_number, expiry_date, formatted_balance, stats } = data;

  return (
      <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in duration-500 pb-10">

        {/* Header & Navigation */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
          <div>
            <button
                onClick={() => router.back()}
                className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors mb-2 uppercase tracking-wider"
            >
              <ArrowLeft size={14} /> Back to Directory
            </button>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight">
              Card Details
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Manage configuration, security, and transactions for card #{card.id}.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <StatusBadge status={card.status} />
            {card.is_disabled && (
                <span className="px-3 py-1 bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400 rounded-full text-xs font-bold uppercase tracking-wider">
              System Disabled
            </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Left Column: Visual Card & Stats */}
          <div className="lg:col-span-4 space-y-6">

            {/* Virtual Card UI */}
            <div className="relative w-full aspect-[1.586/1] rounded-2xl p-6 flex flex-col justify-between overflow-hidden shadow-xl"
                 style={{
                   background: card.card_type === 'virtual'
                       ? 'linear-gradient(135deg, #4f46e5 0%, #0f172a 100%)'
                       : 'linear-gradient(135deg, #f59e0b 0%, #78350f 100%)',
                 }}>
              <div className="absolute -right-16 -top-16 w-48 h-48 bg-white opacity-5 rounded-full blur-2xl"></div>
              <div className="absolute -left-16 -bottom-16 w-48 h-48 bg-black opacity-20 rounded-full blur-2xl"></div>

              <div className="relative z-10 flex justify-between items-start">
                <div className="flex items-center gap-2 text-white/90">
                  <CreditCard size={20} />
                  <span className="text-xs font-bold tracking-widest uppercase">
                  {card.card_type}
                </span>
                </div>
                <span className="px-2.5 py-1 bg-white/10 rounded-md text-[10px] font-bold text-white tracking-widest border border-white/20">
                {card.currency}
              </span>
              </div>

              <div className="relative z-10 mt-auto mb-6">
                <div className="w-10 h-8 bg-gradient-to-br from-yellow-200 to-yellow-500 rounded-md mb-4 opacity-90 border border-yellow-600/50"></div>
                <div className="text-xl sm:text-2xl font-mono text-white tracking-[0.15em] sm:tracking-[0.2em] drop-shadow-md">
                  {masked_number}
                </div>
              </div>

              <div className="relative z-10 flex justify-between items-end">
                <div>
                  <p className="text-[8px] uppercase tracking-widest text-white/60 mb-0.5">Cardholder</p>
                  <p className="text-sm font-semibold text-white tracking-widest uppercase truncate max-w-[140px]">
                    {card.card_holder_name.trim()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[8px] uppercase tracking-widest text-white/60 mb-0.5">Valid Thru</p>
                  <p className="text-sm font-semibold text-white tracking-widest">{expiry_date}</p>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
              <StatCard
                  title="Available Balance"
                  value={formatted_balance}
                  icon="wallet"
                  color="indigo"
              />
              <StatCard
                  title="Total Transactions"
                  value={stats.total_transactions.toString()}
                  icon="activity"
                  color="blue"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <StatCard
                  title="Total Funded"
                  value={`${card.currency} ${stats.total_funded.toFixed(2)}`}
                  icon="arrow-down-right"
                  color="emerald"
              />
              <StatCard
                  title="Total Spent"
                  value={`${card.currency} ${stats.total_spent.toFixed(2)}`}
                  icon="arrow-up-right"
                  color="rose"
              />
            </div>
          </div>

          {/* Right Column: Settings & Data */}
          <div className="lg:col-span-8 space-y-6">

            {/* Details Card */}
            <div className="bg-white dark:bg-[#111118] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm p-5 sm:p-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-gray-100 flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 pb-3 mb-4">
                <UserIcon size={16} className="text-indigo-500" /> Account Information
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-6 gap-x-4">
                <InfoItem label="Internal ID" value={`#${card.id}`} />
                <InfoItem label="Style Profile" value={`Style ${card.style_id}`} />
                <InfoItem label="Currency" value={card.currency} />
                <InfoItem label="Owner Name" value={`${card.user.firstname} ${card.user.lastname}`} />
                <InfoItem label="Owner Email" value={card.user.email} />
                <InfoItem label="Owner Phone" value={`${card.user.country_code} ${card.user.phone}`} />
              </div>
            </div>

            {/* Security Console */}
            <div className="bg-white dark:bg-[#111118] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm p-5 sm:p-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-gray-100 flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 pb-3 mb-4">
                <ShieldOff size={16} className="text-indigo-500" /> Security Console
              </h3>
              <p className="text-xs text-gray-500 mb-4">Toggle switches to enable or disable specific card capabilities in real-time.</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <SecurityToggle
                    icon={<Snowflake size={18} />}
                    title="Freeze Physical Card"
                    description="Temporarily block physical usage."
                    isActive={card.freeze_physical_card}
                    onToggle={() => toggleSetting('freeze_physical_card', card.freeze_physical_card)}
                    disabled={actionLoading || card.card_type === 'virtual'}
                />
                <SecurityToggle
                    icon={<Globe size={18} />}
                    title="Disable Web Purchases"
                    description="Block online ecommerce transactions."
                    isActive={card.disable_web_purchase}
                    onToggle={() => toggleSetting('disable_web_purchase', card.disable_web_purchase)}
                    disabled={actionLoading}
                />
                <SecurityToggle
                    icon={<Smartphone size={18} />}
                    title="Disable Contactless"
                    description="Block NFC / Tap-to-pay usage."
                    isActive={card.disable_contactless}
                    onToggle={() => toggleSetting('disable_contactless', card.disable_contactless)}
                    disabled={actionLoading || card.card_type === 'virtual'}
                />
                <SecurityToggle
                    icon={<AlertCircle size={18} />}
                    title="Master Kill Switch"
                    description="Completely disable all card functions."
                    isActive={card.is_disabled}
                    onToggle={() => toggleSetting('is_disabled', card.is_disabled)}
                    disabled={actionLoading}
                    isDanger
                />
              </div>

              {/* Admin Actions */}
              <div className="mt-8 pt-5 border-t border-gray-100 dark:border-gray-800 flex flex-wrap gap-3">
                {card.status !== 'active' && (
                    <button
                        onClick={() => updateStatus('active')}
                        disabled={actionLoading}
                        className="inline-flex flex-1 sm:flex-none justify-center items-center gap-2 px-5 py-2.5 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 rounded-xl text-sm font-bold hover:bg-emerald-100 dark:hover:bg-emerald-500/20 transition-all disabled:opacity-50"
                    >
                      <ShieldCheck size={16} /> Mark Active
                    </button>
                )}
                {card.status !== 'blocked' && (
                    <button
                        onClick={() => updateStatus('blocked')}
                        disabled={actionLoading}
                        className="inline-flex flex-1 sm:flex-none justify-center items-center gap-2 px-5 py-2.5 bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20 rounded-xl text-sm font-bold hover:bg-amber-100 dark:hover:bg-amber-500/20 transition-all disabled:opacity-50"
                    >
                      <ShieldOff size={16} /> Mark Blocked
                    </button>
                )}

                <div className="w-full sm:w-auto sm:ml-auto">
                  <button
                      onClick={handleDelete}
                      disabled={actionLoading}
                      className="w-full sm:w-auto inline-flex justify-center items-center gap-2 px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-sm font-bold transition-all disabled:opacity-50 shadow-sm"
                  >
                    <Trash2 size={16} /> Permanently Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Transaction History */}
        <div className="bg-white dark:bg-[#111118] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden mt-6">
          <div className="p-5 border-b border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-white/[0.02] flex items-center justify-between">
            <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Activity size={18} className="text-indigo-500" /> Card Ledger
            </h3>
          </div>
          <DataTable
              columns={txColumns}
              data={transactions}
              currentPage={txMeta.current_page}
              totalPages={txMeta.last_page}
              total={txMeta.total}
              onPageChange={setTxPage}
              emptyMessage="No transactions found."
              emptyDescription="When this card is used, the transactions will appear here."
          />
        </div>

      </div>
  );
}

// Subcomponents
function InfoItem({ label, value }: { label: string; value: string }) {
  return (
      <div>
        <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-1">{label}</p>
        <p className="text-sm font-semibold text-gray-900 dark:text-white break-words">{value}</p>
      </div>
  );
}

function SecurityToggle({
                          icon,
                          title,
                          description,
                          isActive,
                          onToggle,
                          disabled,
                          isDanger = false
                        }: {
  icon: React.ReactNode;
  title: string;
  description: string;
  isActive: boolean;
  onToggle: () => void;
  disabled?: boolean;
  isDanger?: boolean;
}) {

  // Style changes based on state
  const containerClass = isActive
      ? (isDanger ? 'bg-rose-50 border-rose-200 dark:bg-rose-900/10 dark:border-rose-900/30' : 'bg-amber-50 border-amber-200 dark:bg-amber-900/10 dark:border-amber-900/30')
      : 'bg-white border-gray-200 dark:bg-[#1A1A24] dark:border-gray-800';

  const iconClass = isActive
      ? (isDanger ? 'text-rose-600 dark:text-rose-400' : 'text-amber-600 dark:text-amber-400')
      : 'text-gray-400 dark:text-gray-500';

  const toggleClass = isActive
      ? (isDanger ? 'bg-rose-500 justify-end' : 'bg-amber-500 justify-end')
      : 'bg-gray-200 dark:bg-gray-700 justify-start';

  return (
      <div className={`p-4 rounded-xl border transition-all duration-300 flex items-center justify-between gap-4 ${containerClass} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
        <div className="flex gap-3 items-start">
          <div className={`mt-0.5 ${iconClass}`}>
            {icon}
          </div>
          <div>
            <p className={`text-sm font-bold ${isActive && isDanger ? 'text-rose-900 dark:text-rose-100' : 'text-gray-900 dark:text-white'}`}>
              {title}
            </p>
            <p className="text-[10px] text-gray-500 mt-0.5 leading-tight">{description}</p>
          </div>
        </div>

        <button
            onClick={onToggle}
            disabled={disabled}
            className={`w-10 h-5 rounded-full flex items-center p-0.5 transition-colors cursor-pointer disabled:cursor-not-allowed shrink-0 ${toggleClass}`}
        >
          <div className="w-4 h-4 rounded-full bg-white shadow-sm" />
        </button>
      </div>
  );
}