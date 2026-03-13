"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { reportsApi } from "@/lib/api";
import { toast } from "react-hot-toast";
import {
  Download, Calendar, ChevronDown, TrendingUp, TrendingDown,
  Users, Activity, DollarSign, Wallet, Repeat, ShieldCheck, PieChart as PieIcon
} from "lucide-react";
import { useTheme } from "next-themes";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";

import PageHeader from "@/components/ui/PageHeader";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";
import { formatCurrency } from "@/lib/utils";

type TabKey = 'overview' | 'transactions' | 'users' | 'revenue';

export default function ReportsPage() {
  const { token } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [activeTab, setActiveTab] = useState<TabKey>('overview');
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [data, setData] = useState<any>(null);
  const [period, setPeriod] = useState('30d');
  const [showPeriodDropdown, setShowPeriodDropdown] = useState(false);

  const fetchData = useCallback(async (silent = false) => {
    if (!token) return;
    if (!silent) setLoading(true);
    else setIsRefreshing(true);

    try {
      let res;
      switch (activeTab) {
        case 'overview': res = await reportsApi.getOverview(token, { period }); break;
        case 'transactions': res = await reportsApi.getTransactionReport(token, { period }); break;
        case 'users': res = await reportsApi.getUserReport(token, { period }); break;
        case 'revenue': res = await reportsApi.getRevenueReport(token, { period }); break;
      }
      if (res?.success) setData(res.data);
    } catch (err) {
      toast.error("Failed to load report data");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [token, activeTab, period]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleExport = async () => {
    if (!token) return;
    try {
      const res = await reportsApi.exportReport(token, activeTab, { period });
      if (res.success && res.data?.url) {
        window.open(res.data.url, '_blank');
        toast.success("Export started");
      }
    } catch (err) {
      toast.error("Failed to export report");
    }
  };

  const tabs: { key: TabKey; label: string }[] = [
    { key: 'overview', label: 'Executive Overview' },
    { key: 'users', label: 'User Analytics' },
    { key: 'revenue', label: 'Revenue & Fees' },
  ];

  const periods = [
    { label: 'Last 7 Days', value: '7d' },
    { label: 'Last 30 Days', value: '30d' },
    { label: 'Last 90 Days', value: '90d' },
    { label: 'Year to Date', value: '1y' },
  ];

  const CHART_COLORS = ['#7C5CFF', '#38BDF8', '#F472B6', '#FBBF24', '#34D399'];

  // Sub-component for individual metric cards to handle complex API structures
  const MetricCard = ({ title, value, growth, icon: Icon, colorClass, prefix = "" }: any) => {
    const isPositive = growth > 0;
    const isNegative = growth < 0;

    return (
        <div className="bg-white dark:bg-[#111118] p-5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm relative overflow-hidden group">
          <div className={`absolute -right-6 -top-6 opacity-[0.03] dark:opacity-5 group-hover:scale-110 transition-transform duration-500 ${colorClass}`}>
            <Icon size={100} />
          </div>
          <div className="relative z-10 flex justify-between items-start mb-4">
            <div className={`p-2 rounded-xl ${colorClass.replace('text-', 'bg-').replace('600', '50')} dark:bg-opacity-10`}>
              <Icon size={18} className={colorClass} />
            </div>
            {growth !== undefined && growth !== null && (
                <div className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-md ${
                    isPositive ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400' :
                        isNegative ? 'bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400' :
                            'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                }`}>
                  {isPositive ? <TrendingUp size={12} /> : isNegative ? <TrendingDown size={12} /> : null}
                  {Math.abs(growth).toFixed(1)}%
                </div>
            )}
          </div>
          <div className="relative z-10">
            <p className="text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1">{title}</p>
            <h3 className="text-2xl font-black text-gray-900 dark:text-white">
              {prefix}{value?.toLocaleString() || '0'}
            </h3>
          </div>
        </div>
    );
  };

  // Helper for rendering empty charts
  const EmptyChart = ({ title }: { title: string }) => (
      <div className="h-[300px] flex flex-col items-center justify-center text-gray-400 dark:text-gray-600 border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-xl m-2">
        <PieIcon size={32} className="mb-2 opacity-50" />
        <p className="text-sm font-medium">No {title} data for this period</p>
      </div>
  );

  if (loading && !data) return <LoadingSkeleton type="page" />;

  return (
      <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in duration-500 pb-10">
        <PageHeader
            title="Analytics & Reports"
            description="Comprehensive insights into platform growth, revenue, and user activity."
            onRefresh={() => fetchData(true)}
            isRefreshing={isRefreshing}
            actions={
              <div className="flex items-center gap-3">
                {/* Period Selector */}
                <div className="relative">
                  <button
                      onClick={() => setShowPeriodDropdown(!showPeriodDropdown)}
                      onBlur={() => setTimeout(() => setShowPeriodDropdown(false), 200)}
                      className="inline-flex h-10 items-center gap-2 rounded-xl border border-gray-200 bg-white dark:bg-[#111118] dark:border-gray-800 px-4 text-sm font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors shadow-sm"
                  >
                    <Calendar size={14} className="text-indigo-500" />
                    {periods.find(p => p.value === period)?.label}
                    <ChevronDown size={14} className={`transition-transform ${showPeriodDropdown ? 'rotate-180' : ''}`} />
                  </button>

                  {showPeriodDropdown && (
                      <div className="absolute right-0 top-full z-50 mt-2 w-48 bg-white dark:bg-[#111118] border border-gray-100 dark:border-gray-800 rounded-xl shadow-xl overflow-hidden py-1 animate-in slide-in-from-top-2">
                        {periods.map(p => (
                            <button
                                key={p.value}
                                onMouseDown={() => setPeriod(p.value)}
                                className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                                    period === p.value
                                        ? 'bg-indigo-50 text-indigo-600 font-bold dark:bg-indigo-500/10 dark:text-indigo-400'
                                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 font-medium'
                                }`}
                            >
                              {p.label}
                            </button>
                        ))}
                      </div>
                  )}
                </div>

                {/* Export */}
                <button
                    onClick={handleExport}
                    className="inline-flex h-10 items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white px-5 text-sm font-bold transition-all shadow-sm shadow-indigo-500/20"
                >
                  <Download size={14} /> Export CSV
                </button>
              </div>
            }
        />

        {/* Tabs */}
        <div className="bg-white dark:bg-[#111118] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden mb-6">
          <div className="flex overflow-x-auto hide-scrollbar">
            {tabs.map((tab) => (
                <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`flex-1 min-w-[150px] px-6 py-4 text-sm font-bold whitespace-nowrap transition-all border-b-2 ${
                        activeTab === tab.key
                            ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-500/5'
                            : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/[0.02]'
                    }`}
                >
                  {tab.label}
                </button>
            ))}
          </div>
        </div>

        {/* OVERVIEW TAB CONTENT */}
        {activeTab === 'overview' && data?.users && (
            <div className="space-y-6 animate-in fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard title="Total Users" value={data.users.total} growth={data.users.growth} icon={Users} colorClass="text-indigo-600" />
                <MetricCard title="Txn Volume" value={data.transactions.volume} growth={data.transactions.volume_growth} icon={Activity} colorClass="text-blue-600" />
                <MetricCard title="Total Fees" value={data.transactions.fees} growth={data.transactions.fees_growth} icon={DollarSign} colorClass="text-emerald-600" />
                <MetricCard title="Active Accounts" value={data.virtual_accounts.active} icon={Wallet} colorClass="text-amber-600" />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-[#111118] p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
                  <h3 className="text-base font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                    <Repeat size={16} className="text-indigo-500" /> Transfers & Transactions
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-[#1A1A24] rounded-xl">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Transactions</span>
                      <span className="font-bold text-gray-900 dark:text-white">{data.transactions.total}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-emerald-50 dark:bg-emerald-500/5 rounded-xl">
                      <span className="text-sm font-medium text-emerald-700 dark:text-emerald-400">Success Rate</span>
                      <span className="font-bold text-emerald-700 dark:text-emerald-400">{data.transactions.success_rate}%</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-[#1A1A24] rounded-xl">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Transfers</span>
                      <span className="font-bold text-gray-900 dark:text-white">{data.transfers.total}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-[#111118] p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
                  <h3 className="text-base font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                    <Users size={16} className="text-indigo-500" /> User Demographics
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-indigo-50 dark:bg-indigo-500/5 rounded-xl">
                      <span className="text-sm font-medium text-indigo-700 dark:text-indigo-400">New Users (Period)</span>
                      <span className="font-bold text-indigo-700 dark:text-indigo-400">+{data.users.new}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-[#1A1A24] rounded-xl">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Users</span>
                      <span className="font-bold text-gray-900 dark:text-white">{data.users.active}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-[#1A1A24] rounded-xl">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Verified Users</span>
                      <span className="font-bold text-gray-900 dark:text-white">{data.users.verified}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
        )}

        {/* USERS TAB CONTENT */}
        {activeTab === 'users' && data?.summary && (
            <div className="space-y-6 animate-in fade-in">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard title="Total Users" value={data.summary.total_users} icon={Users} colorClass="text-indigo-600" />
                <MetricCard title="New Signups" value={data.summary.new_users} icon={TrendingUp} colorClass="text-emerald-600" />
                <MetricCard title="Phone Verified" value={data.summary.phone_verified} icon={ShieldCheck} colorClass="text-blue-600" />
                <MetricCard title="BVN Submitted" value={data.summary.bvn_submitted} icon={ShieldCheck} colorClass="text-amber-600" />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Registrations Chart */}
                <div className="lg:col-span-2 bg-white dark:bg-[#111118] p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
                  <h3 className="text-base font-bold text-gray-900 dark:text-white mb-6">User Growth Trend</h3>
                  {data.registrations && data.registrations.length > 0 ? (
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={data.registrations}>
                            <defs>
                              <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#7C5CFF" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#7C5CFF" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? "#27272A" : "#F3F4F6"} />
                            <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                            <Tooltip contentStyle={{ backgroundColor: isDark ? '#0B0B15' : '#fff', borderRadius: '12px', border: isDark ? '1px solid #27272A' : '1px solid #E5E7EB' }} />
                            <Area type="monotone" dataKey="count" stroke="#7C5CFF" strokeWidth={3} fillOpacity={1} fill="url(#colorUsers)" />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                  ) : (
                      <EmptyChart title="registration" />
                  )}
                </div>

                {/* Status Breakdown */}
                <div className="bg-white dark:bg-[#111118] p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
                  <h3 className="text-base font-bold text-gray-900 dark:text-white mb-6">Status Breakdown</h3>
                  {data.by_status && data.by_status.length > 0 ? (
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie data={data.by_status} innerRadius={80} outerRadius={110} paddingAngle={5} dataKey="count" stroke="none">
                              {data.by_status.map((entry: any, index: number) => (
                                  <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip contentStyle={{ backgroundColor: isDark ? '#0B0B15' : '#fff', borderRadius: '12px', border: 'none' }} />
                            <Legend verticalAlign="bottom" height={36} iconType="circle" />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                  ) : (
                      <EmptyChart title="status breakdown" />
                  )}
                </div>
              </div>
            </div>
        )}

        {/* REVENUE TAB CONTENT */}
        {activeTab === 'revenue' && data?.summary && (
            <div className="space-y-6 animate-in fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <MetricCard title="Total Revenue" value={data.summary.total_revenue} growth={data.summary.revenue_growth} icon={DollarSign} colorClass="text-emerald-600" prefix="$" />
                <MetricCard title="Wallet Fees" value={data.summary.wallet_fee_revenue} icon={Wallet} colorClass="text-indigo-600" prefix="$" />
                <MetricCard title="Transfer Fees" value={data.summary.transfer_fee_revenue} icon={Repeat} colorClass="text-blue-600" prefix="$" />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-[#111118] p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
                  <h3 className="text-base font-bold text-gray-900 dark:text-white mb-6">Revenue Over Time</h3>
                  {data.by_period && data.by_period.length > 0 ? (
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={data.by_period}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? "#27272A" : "#F3F4F6"} />
                            <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                            <Tooltip cursor={{ fill: isDark ? '#27272A' : '#F3F4F6' }} contentStyle={{ backgroundColor: isDark ? '#0B0B15' : '#fff', borderRadius: '12px', border: 'none' }} />
                            <Bar dataKey="revenue" fill="#34D399" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                  ) : (
                      <EmptyChart title="revenue timeline" />
                  )}
                </div>

                <div className="bg-white dark:bg-[#111118] p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
                  <h3 className="text-base font-bold text-gray-900 dark:text-white mb-6">Revenue by Source</h3>
                  {data.by_source && data.by_source.length > 0 ? (
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={data.by_source} layout="vertical" margin={{ left: 40 }}>
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={isDark ? "#27272A" : "#F3F4F6"} />
                            <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                            <YAxis dataKey="source" type="category" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                            <Tooltip cursor={{ fill: isDark ? '#27272A' : '#F3F4F6' }} contentStyle={{ backgroundColor: isDark ? '#0B0B15' : '#fff', borderRadius: '12px', border: 'none' }} />
                            <Bar dataKey="revenue" fill="#7C5CFF" radius={[0, 4, 4, 0]} barSize={32} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                  ) : (
                      <EmptyChart title="source breakdown" />
                  )}
                </div>
              </div>
            </div>
        )}

      </div>
  );
}