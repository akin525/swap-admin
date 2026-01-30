"use client";
import React, { useState } from "react"; // Added useState
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard, Users, CreditCard, ShieldCheck,
    Gift, Laptop, Settings, LogOut, FileText, Menu, X // Added Menu and X icons
} from "lucide-react";

const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard, href: "/dashboard/dashboard" },
    { name: "User Management", icon: Users, href: "/dashboard/users" },
    { name: "Transaction", icon: CreditCard, href: "/dashboard/transactions" },
    { name: "KYC Management", icon: ShieldCheck, href: "/dashboard/kyc" },
    { name: "Gift Cards", icon: Gift, href: "/dashboard/gift-cards" },
    { name: "Virtual Cards", icon: Laptop, href: "/virtual-cards" },
    { name: "System Config", icon: LayoutDashboard, href: "/config" },
    { name: "Report", icon: FileText, href: "/reports" },
];

export default function Sidebar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false); // State for mobile toggle

    const toggleSidebar = () => setIsOpen(!isOpen);

    return (
        <>
            {/* Mobile Toggle Button - Visible only on small screens */}
            <button
                onClick={toggleSidebar}
                className="lg:hidden fixed top-6 left-4 z-50 p-2 bg-brand text-white rounded-lg shadow-lg"
            >
                {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            {/* Backdrop Overlay for Mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
                    onClick={toggleSidebar}
                />
            )}

            {/* Sidebar Container */}
            <aside className={`
                fixed inset-y-0 left-0 z-40 w-64 border-r border-border bg-card text-card-foreground flex flex-col transition-transform duration-300 ease-in-out
                lg:translate-x-0 lg:static lg:block
                ${isOpen ? "translate-x-0" : "-translate-x-full"}
            `}>
                <div className="p-6">
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <div className="w-8 h-8 bg-slate-900 dark:bg-white rounded-md transition-colors" />
                        <span className="tracking-tight">Swappay</span>
                    </h1>
                </div>

                <nav className="flex-1 px-4 space-y-1 mt-4 overflow-y-auto">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={() => setIsOpen(false)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                                    isActive
                                        ? "bg-brand text-white shadow-lg shadow-brand/20 dark:shadow-none"
                                        : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-foreground"
                                }`}
                            >
                                <item.icon size={20} />
                                <span className="font-medium text-sm">{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-border space-y-1">
                    <button className="flex items-center gap-3 px-4 py-3 w-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-foreground rounded-xl transition-all">
                        <Settings size={20} /> <span className="text-sm font-medium">Settings</span>
                    </button>
                    <button className="flex items-center gap-3 px-4 py-3 w-full text-slate-500 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 rounded-xl transition-all">
                        <LogOut size={20} /> <span className="text-sm font-medium">Log out</span>
                    </button>
                </div>
            </aside>
        </>
    );
}