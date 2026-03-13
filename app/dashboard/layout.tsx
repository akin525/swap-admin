"use client";

import React, { useState } from 'react';
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";

export default function DashboardLayout({
                                            children,
                                        }: {
    children: React.ReactNode;
}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-[#F8F9FB] dark:bg-[#0B0B15] text-[#1A1A1A] dark:text-white transition-colors duration-300">
            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />
            <main className="flex-1 md:ml-[280px] p-4 md:p-8 w-full max-w-[100vw] overflow-x-hidden">
                <Header onOpenSidebar={() => setIsSidebarOpen(true)} />
                {children}
            </main>
        </div>
    );
}