"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { usersApi } from "@/lib/api";
import { toast } from "react-hot-toast";
import {
  ArrowLeft, Mail, Phone, Globe, Shield, ShieldOff, KeyRound,
  MessageSquare, Wallet, CreditCard, Activity, Landmark,
  Clock, Fingerprint, ShieldCheck, ShieldAlert, ArrowDownRight,
  ArrowUpRight, ArrowUpDown
} from "lucide-react";

import StatusBadge from "@/components/ui/StatusBadge";
import DataTable from "@/components/ui/DataTable";
import Modal from "@/components/ui/Modal";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";
import StatCard from "@/components/ui/StatCard";
import { formatCurrency, formatDate, getUserFullName } from "@/lib/utils";

// Types
type TabKey = 'wallets' | 'transactions' | 'transfers' | 'cards' | 'accounts' | 'logins';

export default function UserDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { token } = useAuth();

  // State for overview data
  const [user, setUser] = useState<any>(null);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [userStats, setUserStats] = useState<any>(null);

  // State for tab data
  const [wallets, setWallets] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [transfers, setTransfers] = useState<any[]>([]);
  const [cards, setCards] = useState<any[]>([]);
  const [virtualAccounts, setVirtualAccounts] = useState<any[]>([]);
  const [logins, setLogins] = useState<any[]>([]);

  // Meta state for paginated tabs
  const [txMeta, setTxMeta] = useState({ current_page: 1, last_page: 1, per_page: 20, total: 0 });
  const [txPage, setTxPage] = useState(1);

  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabKey>('wallets');
  const [actionLoading, setActionLoading] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [message, setMessage] = useState("");

  const fetchUserOverview = useCallback(async () => {
    if (!token || !id) return;
    setLoading(true);
    try {
      const res = await usersApi.getById(token, Number(id));
      if (res.success) {
        setUser(res.data.user || res.data);
        setAvatar(res.data.avatar || null);
        setUserStats(res.data.stats || null);
      }
    } catch (err) {
      toast.error("Failed to load user overview");
    } finally {
      setLoading(false);
    }
  }, [token, id]);

  const fetchTabData = useCallback(async () => {
    if (!token || !id) return;
    try {
      switch (activeTab) {
        case 'wallets': {
          const res = await usersApi.getWallets(token, Number(id));
          if (res.success) setWallets(res.data.data || res.data || []);
          break;
        }
        case 'transactions': {
          const res = await usersApi.getTransactions(token, Number(id), { page: txPage });
          if (res.success) {
            setTransactions(res.data.data || res.data || []);
            if (res.data.current_page) setTxMeta(res.data);
          }
          break;
        }
        case 'transfers': {
          const res = await usersApi.getTransfers(token, Number(id));
          if (res.success) setTransfers(res.data.data || res.data || []);
          break;
        }
        case 'cards': {
          const res = await usersApi.getCards(token, Number(id));
          if (res.success) setCards(res.data.data || res.data || []);
          break;
        }
        case 'accounts': {
          const res = await usersApi.getVirtualAccounts(token, Number(id));
          if (res.success) setVirtualAccounts(res.data.data || res.data || []);
          break;
        }
        case 'logins': {
          const res = await usersApi.getLogins(token, Number(id));
          if (res.success) setLogins(res.data.data || res.data || []);
          break;
        }
      }
    } catch (err) {
      console.error("Failed to load tab data", err);
    }
  }, [token, id, activeTab, txPage]);

  useEffect(() => { fetchUserOverview(); }, [fetchUserOverview]);
  useEffect(() => { fetchTabData(); }, [fetchTabData]);

  const handleStatusUpdate = async (status: string) => {
    if (!token || !user) return;
    setActionLoading(true);
    try {
      await usersApi.updateStatus(token, user.id, status);
      toast.success(`User ${status === 'active' ? 'activated' : 'blocked'} successfully`);
      fetchUserOverview();
    } catch (err: any) {
      toast.error(err.message || "Failed to update user status");
    } finally {
      setActionLoading(false);
    }
  };

  const handleResetPin = async () => {
    if (!token || !user) return;
    if (!confirm("Are you sure you want to reset this user's transaction PIN?")) return;
    setActionLoading(true);
    try {
      await usersApi.resetPin(token, user.id);
      toast.success("PIN reset successfully");
    } catch (err: any) {
      toast.error(err.message || "Failed to reset PIN");
    } finally {
      setActionLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!token || !user || !message.trim()) return;
    setActionLoading(true);
    try {
      await usersApi.sendMessage(token, user.id, message);
      toast.success("Message sent successfully");
      setShowMessageModal(false);
      setMessage("");
    } catch (err: any) {
      toast.error(err.message || "Failed to send message");
    } finally {
      setActionLoading(false);
    }
  };

  const tabs: { key: TabKey; label: string; icon: React.ReactNode }[] = [
    { key: 'wallets', label: 'Wallets', icon: <Wallet size={14} /> },
    { key: 'transactions', label: 'Ledger', icon: <Activity size={14} /> },
    { key: 'transfers', label: 'Transfers', icon: <ArrowUpDown size={14} /> },
    { key: 'cards', label: 'Cards', icon: <CreditCard size={14} /> },
    { key: 'accounts', label: 'Virtual Accs', icon: <Landmark size={14} /> },
    { key: 'logins', label: 'Security', icon: <Clock size={14} /> },
  ];

  if (loading && !user) return <LoadingSkeleton type="detail" />;
  if (!user) return <div className="p-8 text-center text-gray-400">User profile not found</div>;

  return (
      <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in duration-500 pb-10">
        <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors uppercase tracking-wider"
        >
          <ArrowLeft size={14} /> Back to Directory
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Main Profile Header */}
          <div className="lg:col-span-8 bg-white dark:bg-[#111118] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
            <div className="p-6 sm:p-8 flex flex-col sm:flex-row gap-6 items-start">

              {/* Avatar */}
              <div className="relative shrink-0">
                {avatar ? (
                    <img src={avatar} alt="Avatar" className="w-24 h-24 rounded-2xl object-cover border-2 border-gray-100 dark:border-gray-800 shadow-sm bg-gray-50 dark:bg-gray-900" />
                ) : (
                    <div className="w-24 h-24 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-3xl font-black shadow-sm">
                      {user.firstname?.charAt(0)}{user.lastname?.charAt(0)}
                    </div>
                )}
                <span
                    className={`absolute -bottom-2 -right-2 h-5 w-5 rounded-full border-4 border-white dark:border-[#111118] ${user.online ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-600'}`}
                    title={user.online ? 'Online Now' : 'Offline'}
                />
              </div>

              {/* Core Info */}
              <div className="flex-1 space-y-4 w-full">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 w-full">
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white capitalize tracking-tight">
                      {user.firstname} {user.lastname}
                    </h1>
                    <p className="text-sm font-medium text-gray-500 mt-1 flex items-center gap-1.5">
                      ID: #{user.id} • {user.ref_code && `Ref: ${user.ref_code}`}
                    </p>
                  </div>
                  <StatusBadge status={user.status} size="lg" />
                </div>

                <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                <span className="flex items-center gap-1.5 bg-gray-50 dark:bg-gray-800/50 px-3 py-1.5 rounded-lg border border-gray-100 dark:border-gray-700/50">
                  <Mail size={14} className="text-gray-400" /> {user.email}
                </span>
                  {user.phone && (
                      <span className="flex items-center gap-1.5 bg-gray-50 dark:bg-gray-800/50 px-3 py-1.5 rounded-lg border border-gray-100 dark:border-gray-700/50">
                    <Phone size={14} className="text-gray-400" /> {user.country_code} {user.phone}
                  </span>
                  )}
                </div>

                {/* Verification Badges */}
                <div className="flex flex-wrap gap-2 pt-2">
                  <VerificationBadge active={user.email_verified} label="Email Verified" />
                  <VerificationBadge active={!!user.bvn} label="BVN Linked" />
                  <VerificationBadge active={user.biometric_enabled} label="Biometrics" />
                  <VerificationBadge active={user.two_factor_enabled} label="2FA Enabled" />
                </div>
              </div>
            </div>

            {/* Action Footer */}
            <div className="bg-gray-50 dark:bg-white/[0.02] border-t border-gray-200 dark:border-gray-800 p-4 sm:px-8 flex flex-wrap gap-3">
              {user.status === 'active' ? (
                  <button onClick={() => handleStatusUpdate('blocked')} disabled={actionLoading} className="flex-1 sm:flex-none inline-flex justify-center items-center gap-2 px-5 py-2.5 bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20 rounded-xl text-sm font-bold hover:bg-rose-100 dark:hover:bg-rose-500/20 transition-all disabled:opacity-50">
                    <ShieldOff size={16} /> Block User
                  </button>
              ) : (
                  <button onClick={() => handleStatusUpdate('active')} disabled={actionLoading} className="flex-1 sm:flex-none inline-flex justify-center items-center gap-2 px-5 py-2.5 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 rounded-xl text-sm font-bold hover:bg-emerald-100 dark:hover:bg-emerald-500/20 transition-all disabled:opacity-50">
                    <ShieldCheck size={16} /> Activate User
                  </button>
              )}
              <button onClick={handleResetPin} disabled={actionLoading} className="flex-1 sm:flex-none inline-flex justify-center items-center gap-2 px-5 py-2.5 bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20 rounded-xl text-sm font-bold hover:bg-amber-100 dark:hover:bg-amber-500/20 transition-all disabled:opacity-50">
                <KeyRound size={16} /> Reset PIN
              </button>
              <div className="w-full sm:w-auto sm:ml-auto">
                <button onClick={() => setShowMessageModal(true)} className="w-full inline-flex justify-center items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold transition-all shadow-sm">
                  <MessageSquare size={16} /> Contact User
                </button>
              </div>
            </div>
          </div>

          {/* Quick Stats Column */}
          <div className="lg:col-span-4 space-y-4">
            <StatCard title="Total Transferred" value={userStats?.total_transferred ? formatCurrency(userStats.total_transferred, 'NGN') : '₦0.00'} icon="repeat" color="indigo" />
            <div className="grid grid-cols-2 gap-4">
              <StatCard title="Transfers" value={userStats?.transfers_count || '0'} icon="activity" color="blue" />
              <StatCard title="Logins" value={userStats?.login_count || '0'} icon="monitor" color="emerald" />
            </div>
            <div className="bg-white dark:bg-[#111118] p-5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-4">
              <InfoRow label="Date of Birth" value={user.dob || '—'} />
              <InfoRow label="Language" value={user.language?.toUpperCase() || 'EN'} />
              <InfoRow label="Base Currency" value={user.currency_preference || 'NGN'} />
              <InfoRow label="Joined Date" value={formatDate(user.created_at).split(',')[0]} />
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white dark:bg-[#111118] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
          <div className="flex overflow-x-auto border-b border-gray-200 dark:border-gray-800 hide-scrollbar">
            {tabs.map((tab) => (
                <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`inline-flex items-center justify-center gap-2 px-6 py-4 text-sm font-bold whitespace-nowrap transition-all border-b-2 ${
                        activeTab === tab.key
                            ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-500/5'
                            : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/[0.02]'
                    }`}
                >
                  {tab.icon} {tab.label}
                  {/* Optional Counters */}
                  {tab.key === 'wallets' && userStats?.wallet_count > 0 && <span className="ml-1 bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 py-0.5 px-2 rounded-full text-[10px]">{userStats.wallet_count}</span>}
                  {tab.key === 'cards' && userStats?.card_count > 0 && <span className="ml-1 bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 py-0.5 px-2 rounded-full text-[10px]">{userStats.card_count}</span>}
                </button>
            ))}
          </div>

          {/* Tab Content Area */}
          <div className="p-0 sm:p-6 bg-gray-50/30 dark:bg-transparent">
            {activeTab === 'wallets' && <WalletsTab wallets={wallets} />}
            {activeTab === 'transactions' && <TransactionsTab transactions={transactions} page={txPage} meta={txMeta} setPage={setTxPage} />}
            {activeTab === 'transfers' && <TransfersTab transfers={transfers} />}
            {activeTab === 'cards' && <CardsTab cards={cards} router={router} />}
            {activeTab === 'accounts' && <VirtualAccountsTab accounts={virtualAccounts} />}
            {activeTab === 'logins' && <LoginsTab logins={logins} />}
          </div>
        </div>

        {/* Send Message Modal */}
        <Modal isOpen={showMessageModal} onClose={() => setShowMessageModal(false)} title="Contact Customer" description={`Send an internal notification or email to ${user.firstname}.`}>
          <div className="space-y-4">
          <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message here..."
              rows={5}
              className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#0B0B15] text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none resize-none transition-all"
          />
            <div className="flex justify-end gap-3 pt-2">
              <button onClick={() => setShowMessageModal(false)} className="px-5 py-2.5 text-gray-500 hover:text-gray-900 dark:hover:text-white font-semibold text-sm transition-colors">
                Cancel
              </button>
              <button
                  onClick={handleSendMessage}
                  disabled={!message.trim() || actionLoading}
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold transition-all disabled:opacity-50 shadow-sm"
              >
                {actionLoading ? 'Sending...' : 'Send Message'}
              </button>
            </div>
          </div>
        </Modal>
      </div>
  );
}

// UI Subcomponents
function VerificationBadge({ active, label }: { active: boolean; label: string }) {
  return (
      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-[10px] font-bold uppercase tracking-wider ${
          active
              ? 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20'
              : 'bg-gray-100 text-gray-500 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700'
      }`}>
        {active ? <ShieldCheck size={12} /> : <ShieldAlert size={12} />}
        {label}
      </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
      <div className="flex justify-between items-center text-sm">
        <span className="text-gray-500 dark:text-gray-400">{label}</span>
        <span className="font-semibold text-gray-900 dark:text-white">{value}</span>
      </div>
  );
}

function EmptyTab({ title, description }: { title: string; description: string }) {
  return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center text-gray-400 mb-4">
          <Activity size={24} />
        </div>
        <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1">{title}</h3>
        <p className="text-sm text-gray-500 max-w-sm">{description}</p>
      </div>
  );
}

// Tab Content Components
function WalletsTab({ wallets }: { wallets: any[] }) {
  if (wallets.length === 0) return <EmptyTab title="No Wallets Found" description="This user has not activated any currency wallets yet." />;
  return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 p-4 sm:p-0">
        {wallets.map((w) => (
            <div key={w.id} className="relative overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1A1A24] p-5 shadow-sm transition-hover hover:shadow-md">
              <div className="absolute -right-6 -top-6 opacity-[0.03] dark:opacity-5">
                <Globe size={100} />
              </div>
              <div className="relative z-10 flex items-center justify-between mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 text-sm font-bold border border-indigo-100 dark:border-indigo-500/20">
              <Wallet size={14} /> {w.currency}
            </span>
                <StatusBadge status={w.status === 1 || w.status === 'active' ? 'active' : 'inactive'} />
              </div>
              <div className="relative z-10 mb-5">
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Available Balance</p>
                <p className="text-2xl font-black text-gray-900 dark:text-white">{formatCurrency(w.balance, w.currency)}</p>
              </div>
              <div className="relative z-10 grid grid-cols-2 gap-3 pt-4 border-t border-gray-100 dark:border-gray-800/50">
                <div>
                  <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-0.5">Single Limit</p>
                  <p className="text-sm font-bold text-gray-700 dark:text-gray-300">{formatCurrency(w.transfer_single_limit, w.currency)}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-0.5">Total Limit</p>
                  <p className="text-sm font-bold text-gray-700 dark:text-gray-300">{formatCurrency(w.transfer_cumulative_limit, w.currency)}</p>
                </div>
              </div>
            </div>
        ))}
      </div>
  );
}

function TransactionsTab({ transactions, page, meta, setPage }: { transactions: any[], page: number, meta: any, setPage: any }) {
  const columns = [
    {
      key: 'trx',
      label: 'Reference',
      render: (t: any) => (
          <div className="flex flex-col">
            <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">{t.reference || t.trx}</span>
            <span className="text-[10px] text-gray-500 uppercase tracking-wider">{t.source || 'Wallet'}</span>
          </div>
      )
    },
    {
      key: 'trx_type',
      label: 'Context',
      render: (t: any) => (
          <div className="flex flex-col">
            <span className="text-xs font-bold text-gray-700 dark:text-gray-300 capitalize">{t.type?.replace('_', ' ') || t.trx_type}</span>
            <span className="text-[10px] text-gray-500 truncate max-w-[150px]" title={t.note}>{t.note || '—'}</span>
          </div>
      )
    },
    {
      key: 'amount',
      label: 'Amount',
      render: (t: any) => {
        // Determine credit/debit visually based on type string or amount sign
        const isCredit = t.type?.includes('credit') || t.type?.includes('funding') || t.formatted_amount?.startsWith('+');
        return (
            <div className="flex flex-col">
              <div className="flex items-center gap-1">
                {isCredit ? <ArrowDownRight size={12} className="text-emerald-500" /> : <ArrowUpRight size={12} className="text-rose-500" />}
                <span className={`text-sm font-bold ${isCredit ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-900 dark:text-white'}`}>
                {t.formatted_amount || formatCurrency(t.amount, t.currency || t.wallet)}
              </span>
              </div>
              {Number(t.fee) > 0 && <span className="text-[10px] text-gray-400 mt-0.5">Fee: {t.fee}</span>}
            </div>
        );
      }
    },
    { key: 'status', label: 'Status', render: (t: any) => <StatusBadge status={t.status} /> },
    {
      key: 'date',
      label: 'Date',
      render: (t: any) => (
          <div className="flex flex-col">
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{t.formatted_date?.split(',')[0] || formatDate(t.created_at, true).split(',')[0]}</span>
            <span className="text-[10px] text-gray-500">{t.formatted_date?.split(',')[1] || formatDate(t.created_at, true).split(',')[1]}</span>
          </div>
      )
    },
  ];

  return (
      <div className="border-none shadow-none bg-transparent">
        <DataTable
            columns={columns}
            data={transactions}
            currentPage={meta.current_page || page}
            totalPages={meta.last_page || 1}
            total={meta.total || transactions.length}
            onPageChange={setPage}
            emptyMessage="No ledger history found."
        />
      </div>
  );
}

function TransfersTab({ transfers }: { transfers: any[] }) {
  const columns = [
    { key: 'ref', label: 'Reference', render: (t: any) => <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">{t.reference}</span> },
    {
      key: 'recipient',
      label: 'Recipient Details',
      render: (t: any) => (
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-gray-900 dark:text-white">{t.account_name || '—'}</span>
            <span className="text-[10px] text-gray-500 flex items-center gap-1 mt-0.5"><Landmark size={10} /> {t.bank_name || 'Bank'} • {t.account_number}</span>
          </div>
      )
    },
    {
      key: 'amount',
      label: 'Transfer Value',
      render: (t: any) => (
          <div className="flex flex-col">
            <span className="text-sm font-bold text-gray-900 dark:text-white">{t.formatted_total || formatCurrency(t.amount, t.currency)}</span>
          </div>
      )
    },
    { key: 'status', label: 'Status', render: (t: any) => <StatusBadge status={t.status} /> },
    { key: 'date', label: 'Initiated On', render: (t: any) => <span className="text-xs text-gray-500">{t.formatted_date || formatDate(t.created_at, true)}</span> },
  ];
  return <div className="border-none shadow-none bg-transparent"><DataTable columns={columns} data={transfers} emptyMessage="No transfers executed by this user." /></div>;
}

function CardsTab({ cards, router }: { cards: any[]; router: any }) {
  if (cards.length === 0) return <EmptyTab title="No Cards Issued" description="User does not have any active virtual or physical cards." />;

  return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 p-4 sm:p-0">
        {cards.map((c) => {
          const isVirtual = c.card_type === 'virtual';
          return (
              <div
                  key={c.id}
                  onClick={() => router.push(`/dashboard/cards/${c.id}`)}
                  className="group cursor-pointer relative overflow-hidden rounded-2xl p-5 shadow-sm hover:shadow-md transition-all border border-transparent hover:border-indigo-500/30"
                  style={{
                    background: isVirtual
                        ? 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)'
                        : 'linear-gradient(135deg, #78350f 0%, #451a03 100%)',
                  }}
              >
                <div className="relative z-10 flex justify-between items-start mb-6">
              <span className="px-2 py-1 bg-white/10 rounded border border-white/20 text-[10px] font-bold text-white uppercase tracking-widest">
                {c.card_type}
              </span>
                  <StatusBadge status={c.status} />
                </div>
                <div className="relative z-10 mb-4">
                  <p className="text-[10px] text-white/50 uppercase tracking-widest mb-1">Card Number</p>
                  <p className="text-lg font-mono tracking-widest text-white">{c.masked_number || `**** ${c.card_number.slice(-4)}`}</p>
                </div>
                <div className="relative z-10 flex justify-between items-end">
                  <div>
                    <p className="text-[10px] text-white/50 uppercase tracking-widest mb-0.5">Balance</p>
                    <p className="text-sm font-bold text-white">{c.formatted_balance || formatCurrency(c.balance, c.currency)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-white/50 uppercase tracking-widest mb-0.5">Exp</p>
                    <p className="text-sm font-bold text-white">{c.expiry_date || `${c.expiry_month}/${c.expiry_year}`}</p>
                  </div>
                </div>

                {/* Decorative hover effect */}
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-5 transition-opacity"></div>
              </div>
          );
        })}
      </div>
  );
}

function VirtualAccountsTab({ accounts }: { accounts: any[] }) {
  const columns = [
    {
      key: 'account',
      label: 'Account Details',
      render: (a: any) => (
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <Landmark size={18} />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-gray-900 dark:text-gray-200 font-mono">{a.account_number}</span>
              <span className="text-[10px] text-gray-500 uppercase tracking-wider mt-0.5">{a.bank_name}</span>
            </div>
          </div>
      )
    },
    {
      key: 'account_name',
      label: 'Assigned Name',
      render: (a: any) => <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{a.account_name}</span>
    },
    { key: 'status', label: 'Status', render: (a: any) => <StatusBadge status={a.status === 'active' || a.status === 1 ? 'active' : 'inactive'} /> },
    { key: 'date', label: 'Provisioned On', render: (a: any) => <span className="text-xs text-gray-500">{formatDate(a.created_at)}</span> },
  ];
  return <div className="border-none shadow-none bg-transparent"><DataTable columns={columns} data={accounts} emptyMessage="No dedicated virtual accounts." /></div>;
}

function LoginsTab({ logins }: { logins: any[] }) {
  const columns = [
    { key: 'ip', label: 'IP Address', render: (l: any) => <span className="text-sm font-mono text-gray-900 dark:text-gray-200">{l.ip_address || '—'}</span> },
    { key: 'device', label: 'Device Agent', render: (l: any) => <span className="text-sm text-gray-600 dark:text-gray-400 truncate max-w-[250px]" title={l.device}>{l.device || '—'}</span> },
    { key: 'location', label: 'Geographic Location', render: (l: any) => <span className="text-sm text-gray-600 dark:text-gray-400">{l.location || '—'}</span> },
    { key: 'date', label: 'Timestamp', render: (l: any) => <span className="text-xs text-gray-500">{formatDate(l.created_at, true)}</span> },
  ];
  return <div className="border-none shadow-none bg-transparent"><DataTable columns={columns} data={logins} emptyMessage="No security or login history logged yet." /></div>;
}