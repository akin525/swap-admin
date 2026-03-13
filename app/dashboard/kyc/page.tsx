"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { kycApi } from "@/lib/api";
import { toast } from "react-hot-toast";
import { Eye, CheckCircle, XCircle, FileText, Image } from "lucide-react";

import PageHeader from "@/components/ui/PageHeader";
import SearchFilter from "@/components/ui/SearchFilter";
import DataTable from "@/components/ui/DataTable";
import StatusBadge from "@/components/ui/StatusBadge";
import StatCard from "@/components/ui/StatCard";
import Modal from "@/components/ui/Modal";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";
import { formatDate, getUserFullName, getUserInitials } from "@/lib/utils";

interface KycRecord {
  id: number;
  user_id: number;
  user?: { id: number; firstname: string; lastname: string; email: string; phone?: string };
  document_type: string;
  document_number: string;
  document_front: string | null;
  document_back: string | null;
  selfie: string | null;
  status: 'pending' | 'approved' | 'rejected';
  rejection_reason: string | null;
  submitted_at: string;
  reviewed_at: string | null;
  created_at: string;
  updated_at: string;
}

export default function KycPage() {
  const { token } = useAuth();
  const [records, setRecords] = useState<KycRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ current_page: 1, last_page: 1, per_page: 20, total: 0 });
  const [selected, setSelected] = useState<KycRecord | null>(null);
  const [stats, setStats] = useState<any>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectInput, setShowRejectInput] = useState(false);

  const fetchData = useCallback(async (silent = false) => {
    if (!token) return;
    if (!silent) setLoading(true);
    else setIsRefreshing(true);
    try {
      const res = await kycApi.getAll(token, {
        page,
        search: search || undefined,
        status: statusFilter || undefined,
      });
      if (res.success) {
        setRecords(res.data || []);
        if (res.meta) setMeta(res.meta);
        if (res.stats) setStats(res.stats);
      }
    } catch (err) {
      toast.error("Failed to load KYC records");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [token, page, search, statusFilter]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleApprove = async (id: number) => {
    if (!token) return;
    setActionLoading(true);
    try {
      await kycApi.approve(token, id);
      toast.success("KYC approved successfully");
      setSelected(null);
      fetchData(true);
    } catch (err: any) {
      toast.error(err.message || "Failed to approve KYC");
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (id: number) => {
    if (!token || !rejectReason.trim()) return;
    setActionLoading(true);
    try {
      await kycApi.reject(token, id, rejectReason);
      toast.success("KYC rejected");
      setSelected(null);
      setShowRejectInput(false);
      setRejectReason("");
      fetchData(true);
    } catch (err: any) {
      toast.error(err.message || "Failed to reject KYC");
    } finally {
      setActionLoading(false);
    }
  };

  const columns = [
    {
      key: 'user',
      label: 'User',
      render: (r: KycRecord) => (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#7C5CFF] to-[#0E0627] text-xs font-bold text-white">
            {r.user ? getUserInitials(r.user as any) : 'U'}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-gray-900 dark:text-gray-200">
              {r.user ? getUserFullName(r.user as any) : `User #${r.user_id}`}
            </span>
            <span className="text-[10px] text-gray-400">{r.user?.email || ''}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'document_type',
      label: 'Document',
      render: (r: KycRecord) => (
        <div className="flex items-center gap-2">
          <FileText size={14} className="text-gray-400" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">{r.document_type?.replace(/_/g, ' ') || '—'}</span>
        </div>
      ),
    },
    {
      key: 'document_number',
      label: 'Doc Number',
      render: (r: KycRecord) => (
        <span className="text-xs font-mono text-gray-600 dark:text-gray-400">{r.document_number || '—'}</span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (r: KycRecord) => <StatusBadge status={r.status} />,
    },
    {
      key: 'created_at',
      label: 'Submitted',
      render: (r: KycRecord) => <span className="text-xs text-gray-400">{formatDate(r.submitted_at || r.created_at)}</span>,
    },
    {
      key: 'actions',
      label: '',
      className: 'text-center',
      render: (r: KycRecord) => (
        <button
          onClick={(e) => { e.stopPropagation(); setSelected(r); setShowRejectInput(false); }}
          className="inline-flex items-center gap-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 px-3 py-1.5 rounded-xl text-[10px] font-bold hover:bg-[#0E0627] hover:text-white dark:hover:bg-indigo-600 transition-all shadow-sm active:scale-95"
        >
          <Eye size={12} />
          Review
        </button>
      ),
    },
  ];

  if (loading) return <LoadingSkeleton type="page" />;

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <PageHeader
        title="KYC Verifications"
        description="Review and manage user identity verification submissions."
        onRefresh={() => fetchData(true)}
        isRefreshing={isRefreshing}
      />

      {stats && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 md:gap-6">
          <StatCard title="Total Submissions" value={stats.total || '0'} icon="shield" color="purple" />
          <StatCard title="Pending Review" value={stats.pending || '0'} icon="monitor" color="amber" />
          <StatCard title="Approved" value={stats.approved || '0'} icon="shield" color="green" />
          <StatCard title="Rejected" value={stats.rejected || '0'} icon="monitor" color="red" />
        </div>
      )}

      <SearchFilter
        searchValue={search}
        onSearchChange={(v) => { setSearch(v); setPage(1); }}
        searchPlaceholder="Search by user name, email, document..."
        filters={[
          {
            key: 'status',
            label: 'Status',
            options: [
              { label: 'Pending', value: 'pending' },
              { label: 'Approved', value: 'approved' },
              { label: 'Rejected', value: 'rejected' },
            ],
            value: statusFilter,
            onChange: (v) => { setStatusFilter(v); setPage(1); },
          },
        ]}
        onClear={() => { setSearch(''); setStatusFilter(''); setPage(1); }}
      />

      <DataTable
        columns={columns}
        data={records}
        currentPage={meta.current_page}
        totalPages={meta.last_page}
        total={meta.total}
        onPageChange={setPage}
        onRowClick={(r) => { setSelected(r); setShowRejectInput(false); }}
        emptyMessage="No KYC submissions found."
        emptyDescription="User verification requests will appear here."
      />

      {/* Review Modal */}
      <Modal
        isOpen={!!selected}
        onClose={() => { setSelected(null); setShowRejectInput(false); setRejectReason(""); }}
        title="KYC Review"
        description={selected?.user ? `${getUserFullName(selected.user as any)} — ${selected.document_type?.replace(/_/g, ' ')}` : ''}
        size="lg"
      >
        {selected && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <DetailItem label="User" value={selected.user ? getUserFullName(selected.user as any) : `User #${selected.user_id}`} />
              <DetailItem label="Status" value={selected.status} />
              <DetailItem label="Document Type" value={selected.document_type?.replace(/_/g, ' ') || '—'} />
              <DetailItem label="Document Number" value={selected.document_number || '—'} />
              <DetailItem label="Submitted" value={formatDate(selected.submitted_at || selected.created_at, true)} />
              <DetailItem label="Reviewed" value={selected.reviewed_at ? formatDate(selected.reviewed_at, true) : 'Not yet'} />
            </div>

            {selected.rejection_reason && (
              <div className="p-4 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-900/30">
                <p className="text-xs font-bold text-red-600 dark:text-red-400 mb-1">Rejection Reason</p>
                <p className="text-sm text-red-700 dark:text-red-300">{selected.rejection_reason}</p>
              </div>
            )}

            {/* Document Images */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Submitted Documents</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {selected.document_front && (
                  <DocImage label="Front" src={selected.document_front} />
                )}
                {selected.document_back && (
                  <DocImage label="Back" src={selected.document_back} />
                )}
                {selected.selfie && (
                  <DocImage label="Selfie" src={selected.selfie} />
                )}
                {!selected.document_front && !selected.document_back && !selected.selfie && (
                  <div className="col-span-3 p-8 rounded-xl bg-gray-50 dark:bg-white/5 text-center">
                    <Image size={32} className="mx-auto text-gray-300 dark:text-gray-600 mb-2" />
                    <p className="text-sm text-gray-400">No documents uploaded</p>
                  </div>
                )}
              </div>
            </div>

            {/* Actions for pending KYC */}
            {selected.status === 'pending' && (
              <div className="pt-4 border-t border-gray-100 dark:border-gray-800 space-y-3">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleApprove(selected.id)}
                    disabled={actionLoading}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 rounded-xl text-sm font-bold hover:bg-green-100 transition-all disabled:opacity-50"
                  >
                    <CheckCircle size={16} />
                    Approve KYC
                  </button>
                  <button
                    onClick={() => setShowRejectInput(true)}
                    disabled={actionLoading}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded-xl text-sm font-bold hover:bg-red-100 transition-all disabled:opacity-50"
                  >
                    <XCircle size={16} />
                    Reject KYC
                  </button>
                </div>

                {showRejectInput && (
                  <div className="flex gap-3 items-end">
                    <div className="flex-1">
                      <label className="block text-xs font-bold text-gray-500 mb-1.5">Rejection Reason</label>
                      <input
                        type="text"
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        placeholder="Explain why this KYC is being rejected..."
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#0B0B15] text-sm focus:border-red-400 focus:ring-1 focus:ring-red-400 outline-none"
                      />
                    </div>
                    <button
                      onClick={() => handleReject(selected.id)}
                      disabled={!rejectReason.trim() || actionLoading}
                      className="px-4 py-2.5 bg-red-600 text-white rounded-xl text-sm font-bold hover:bg-red-700 disabled:opacity-50 transition-all"
                    >
                      Confirm Reject
                    </button>
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

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-1">{label}</p>
      <p className="text-sm font-semibold text-gray-900 dark:text-white capitalize">{value}</p>
    </div>
  );
}

function DocImage({ label, src }: { label: string; src: string }) {
  return (
    <div className="space-y-1.5">
      <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">{label}</p>
      <div className="relative aspect-[4/3] rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden bg-gray-50 dark:bg-gray-900">
        <img src={src} alt={label} className="w-full h-full object-cover" />
      </div>
    </div>
  );
}