"use client";

import React, { useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from "@/context/AuthContext";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import {
  LayoutDashboard, Users, Repeat, ShieldCheck, Gift, CreditCard,
  Settings2, BarChart3, Settings, LogOut, X, Hexagon, ChevronRight,
  ArrowUpDown, Wallet, Landmark
} from 'lucide-react';

type NavItemData = { label: string; href: string; icon: React.ElementType };
type NavGroup = { title?: string; items: NavItemData[] };

const NAV_STRUCTURE: NavGroup[] = [
  {
    title: "Overview",
    items: [
      { label: "Dashboard", href: "/dashboard/home", icon: LayoutDashboard },
      { label: "Reports & Analytics", href: "/dashboard/reports", icon: BarChart3 },
    ]
  },
  {
    title: "Finance",
    items: [
      { label: "Transactions", href: "/dashboard/transactions", icon: Repeat },
      { label: "Transfers", href: "/dashboard/transfers", icon: ArrowUpDown },
      { label: "Wallets", href: "/dashboard/wallets", icon: Wallet },
      { label: "Virtual Cards", href: "/dashboard/cards", icon: CreditCard },
      { label: "Gift Cards", href: "/dashboard/gift-cards", icon: Gift },
    ]
  },
  {
    title: "Administration",
    items: [
      { label: "User Management", href: "/dashboard/users", icon: Users },
      { label: "KYC Verifications", href: "/dashboard/kyc", icon: ShieldCheck },
      { label: "Virtual Accounts", href: "/dashboard/virtual-accounts", icon: Landmark },
      { label: "System Config", href: "/dashboard/system-config", icon: Settings2 },
    ]
  }
];

const NavItem = ({ item, isActive, onClick }: { item: NavItemData; isActive: boolean; onClick: () => void }) => {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={`
        group relative flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-200 ease-in-out
        ${isActive
          ? "bg-[#0E0627] text-white shadow-md shadow-indigo-500/20 dark:bg-indigo-600 dark:shadow-indigo-900/30"
          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-white"
        }
      `}
    >
      <Icon
        size={18}
        className={`transition-colors duration-200 ${isActive ? "text-white" : "text-gray-400 group-hover:text-gray-600 dark:text-gray-500 dark:group-hover:text-gray-300"}`}
      />
      <span>{item.label}</span>
      {isActive && (
        <span className="absolute right-3 h-1.5 w-1.5 rounded-full bg-white/30 animate-pulse" />
      )}
    </Link>
  );
};

export default function Sidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const isRouteActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  const userInitials = useMemo(() => {
    if (!user?.name) return "AD";
    const parts = user.name.split(" ").filter(Boolean);
    return parts.length >= 2
      ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
      : parts[0].slice(0, 2).toUpperCase();
  }, [user?.name]);

  return (
    <>
      <div
        className={`
          fixed inset-0 z-40 bg-gray-900/40 backdrop-blur-sm transition-opacity duration-300 md:hidden
          ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
        `}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        className={`
          fixed inset-y-0 left-0 z-50 flex h-full w-[280px] flex-col
          bg-white dark:bg-[#0B0B15] border-r border-gray-200 dark:border-gray-800
          shadow-2xl shadow-gray-200/50 dark:shadow-none
          transition-transform duration-300 cubic-bezier(0.25, 1, 0.5, 1)
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        {/* Header / Brand */}
        <div className="flex h-[80px] items-center justify-between px-6">
          <Link href="/dashboard/home" className="flex items-center gap-3 group focus:outline-none" onClick={onClose}>
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-[#0E0627] text-white shadow-lg shadow-indigo-900/20 transition-transform duration-300 group-hover:scale-105 dark:bg-indigo-600">
              <Hexagon size={22} strokeWidth={2.5} className="relative z-10" />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight text-gray-900 dark:text-white leading-none group-hover:text-[#0E0627] dark:group-hover:text-indigo-400 transition-colors">
                Conerpulse
              </span>
              <span className="mt-1 text-[10px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                Admin
              </span>
            </div>
          </Link>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-white/5 dark:hover:text-white md:hidden transition-all"
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-gray-100 to-transparent dark:via-gray-800/50 mx-6 mb-4" />

        {/* Scrollable Navigation */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden px-4 pb-6 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-800 hover:scrollbar-thumb-gray-300 dark:hover:scrollbar-thumb-gray-700">
          <div className="space-y-8">
            {NAV_STRUCTURE.map((group, groupIdx) => (
              <div key={groupIdx} className="animate-in fade-in slide-in-from-bottom-2 duration-500" style={{ animationDelay: `${groupIdx * 100}ms` }}>
                {group.title && (
                  <h3 className="mb-3 px-3.5 text-[11px] font-bold uppercase tracking-wider text-gray-400/80 dark:text-gray-600 select-none">
                    {group.title}
                  </h3>
                )}
                <nav className="space-y-1">
                  {group.items.map((item) => (
                    <NavItem key={item.href} item={item} isActive={isRouteActive(item.href)} onClick={onClose} />
                  ))}
                </nav>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 bg-gray-50/60 p-4 backdrop-blur-sm dark:border-gray-800 dark:bg-[#0E0E1A]/50">
          <div className="mb-4 flex items-center justify-between px-1">
            <ThemeToggle />
            <Link
              href="/dashboard/settings"
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors"
              aria-label="Settings"
            >
              <Settings size={18} />
            </Link>
          </div>

          <div className="relative group">
            <button className="flex w-full items-center gap-3 rounded-2xl border border-gray-200 bg-white p-2.5 shadow-sm transition-all hover:border-indigo-100 hover:shadow-md dark:border-gray-800 dark:bg-[#13131F] dark:hover:border-indigo-900/50">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#0E0627] to-[#1a1040] text-xs font-bold text-white dark:from-indigo-600 dark:to-indigo-800">
                {userInitials}
              </div>
              <div className="flex-1 overflow-hidden text-left">
                <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">
                  {user?.name || "Admin User"}
                </p>
                <p className="truncate text-[11px] text-gray-500 dark:text-gray-400">
                  {user?.email || "admin@Conerpulse .io"}
                </p>
              </div>
              <ChevronRight size={16} className="text-gray-400 transition-transform group-hover:translate-x-0.5" />
            </button>

            <div className="mt-2">
              <button
                onClick={() => { onClose(); logout(); }}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-transparent px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 hover:border-red-100 transition-all dark:text-red-400 dark:hover:bg-red-900/10 dark:hover:border-red-900/20"
              >
                <LogOut size={14} />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}