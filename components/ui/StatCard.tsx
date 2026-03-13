"use client";

import React from 'react';
import {
  Users, Activity, ShieldCheck, Repeat, CreditCard, Wallet, ArrowUpDown,
  Gift, TrendingUp, TrendingDown, DollarSign, Globe, Landmark, BarChart3
} from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  trend?: string;
  icon?: string;
  color?: string;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  'users': <Users size={22} />,
  'monitor': <Activity size={22} />,
  'shield': <ShieldCheck size={22} />,
  'repeat': <Repeat size={22} />,
  'credit-card': <CreditCard size={22} />,
  'wallet': <Wallet size={22} />,
  'transfer': <ArrowUpDown size={22} />,
  'gift': <Gift size={22} />,
  'dollar': <DollarSign size={22} />,
  'globe': <Globe size={22} />,
  'bank': <Landmark size={22} />,
  'chart': <BarChart3 size={22} />,
};

const getThemeColors = (colorStr: string) => {
  if (colorStr?.includes('blue')) return { light: 'bg-blue-50 text-blue-600', dark: 'dark:bg-blue-500/10 dark:text-blue-400' };
  if (colorStr?.includes('indigo')) return { light: 'bg-indigo-50 text-indigo-600', dark: 'dark:bg-indigo-500/10 dark:text-indigo-400' };
  if (colorStr?.includes('purple')) return { light: 'bg-purple-50 text-purple-600', dark: 'dark:bg-purple-500/10 dark:text-purple-400' };
  if (colorStr?.includes('green')) return { light: 'bg-green-50 text-green-600', dark: 'dark:bg-green-500/10 dark:text-green-400' };
  if (colorStr?.includes('amber') || colorStr?.includes('orange') || colorStr?.includes('yellow')) return { light: 'bg-amber-50 text-amber-600', dark: 'dark:bg-amber-500/10 dark:text-amber-400' };
  if (colorStr?.includes('red')) return { light: 'bg-red-50 text-red-600', dark: 'dark:bg-red-500/10 dark:text-red-400' };
  if (colorStr?.includes('cyan') || colorStr?.includes('teal')) return { light: 'bg-cyan-50 text-cyan-600', dark: 'dark:bg-cyan-500/10 dark:text-cyan-400' };
  return { light: 'bg-gray-50 text-gray-600', dark: 'dark:bg-gray-800 dark:text-gray-400' };
};

export default function StatCard({ title, value, trend, icon, color }: StatCardProps) {
  const isPositive = trend ? trend.startsWith('+') : true;
  const TrendIcon = isPositive ? TrendingUp : TrendingDown;
  const themeColors = getThemeColors(color || 'blue');

  return (
    <div className="group relative flex flex-col justify-between rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:shadow-md dark:border-gray-800 dark:bg-[#13131F]">
      <div className="flex items-start justify-between mb-4">
        <div className={`flex h-12 w-12 items-center justify-center rounded-xl transition-transform group-hover:scale-110 ${themeColors.light} ${themeColors.dark}`}>
          {ICON_MAP[icon || 'chart'] || <BarChart3 size={22} />}
        </div>
        {trend && (
          <div className={`flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-bold ${
            isPositive
              ? 'bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400'
              : 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400'
          }`}>
            <TrendIcon size={12} />
            <span>{trend}</span>
          </div>
        )}
      </div>
      <div>
        <p className="mb-1 text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
          {title}
        </p>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          {value}
        </h2>
      </div>
    </div>
  );
}