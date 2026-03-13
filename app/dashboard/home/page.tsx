"use client";

import React, { useState, useMemo, useCallback, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { dashboardApi } from "@/lib/api";
import { toast } from "react-hot-toast";
import { Filter, ChevronDown, Download } from "lucide-react";

import PageHeader from "@/components/ui/PageHeader";
import StatCard from "@/components/ui/StatCard";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";
import Charts from "@/components/dashboard/Charts";
import RecentTransactions from "@/components/dashboard/RecentTransactions";

import type { DashboardData } from "@/types";

const CURRENCIES = ["ALL", "NGN", "USD", "GHS", "ZAR"];

export default function DashboardHome() {
  const { token } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [currencyFilter, setCurrencyFilter] = useState("ALL");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchData = useCallback(async (silent = false) => {
    if (!token) return;
    if (!silent) setLoading(true);
    else setIsRefreshing(true);
    try {
      const res = await dashboardApi.getStats(token);
      if (res.success) setData(res.data);
    } catch (err) {
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [token]);

  useEffect(() => { fetchData(); }, [fetchData]);

  if (loading) return <LoadingSkeleton type="page" />;

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <PageHeader
        title="Performance"
        description="Real-time overview of Conerpulse  metrics across all currencies."
        onRefresh={() => fetchData(true)}
        isRefreshing={isRefreshing}
        actions={
          <div className="relative group">
            <button className="inline-flex h-11 items-center gap-2 rounded-xl border border-gray-200 bg-white dark:bg-[#13131F] dark:border-gray-800 px-4 text-sm font-bold text-gray-700 dark:text-gray-300">
              <Filter size={16} className="text-[#7C5CFF]" />
              {currencyFilter}
              <ChevronDown size={14} />
            </button>
            <div className="absolute right-0 top-full z-50 mt-2 w-40 hidden group-hover:block bg-white dark:bg-[#13131F] border border-gray-100 dark:border-gray-800 rounded-xl shadow-xl overflow-hidden">
              {CURRENCIES.map(c => (
                <button
                  key={c}
                  onClick={() => setCurrencyFilter(c)}
                  className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 dark:hover:bg-white/5 transition-colors ${currencyFilter === c ? 'text-[#7C5CFF] font-bold' : 'text-gray-600 dark:text-gray-400'}`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        }
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 md:gap-6">
        {(data?.stats || []).map((stat, i) => (
          <StatCard key={i} title={stat.title} value={stat.value} trend={stat.trend} icon={stat.icon} color={stat.color} />
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Charts className="lg:col-span-2" type="line" data={data?.charts?.line || []} currency={currencyFilter} />
        <Charts type="pie" data={data?.charts?.pie || []} />
      </div>

      {/* Recent Transactions */}
      <RecentTransactions transactions={data?.transactions || []} />
    </div>
  );
}