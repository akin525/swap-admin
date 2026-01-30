"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="flex h-screen bg-background text-foreground transition-colors duration-300">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Navbar />

                <main className="flex-1 overflow-y-auto p-8 custom-scrollbar relative">
                    {isLoading ? (
                        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm transition-all duration-500">
                            <div className="relative flex items-center justify-center">
                                <div className="w-16 h-16 border-4 border-brand/20 border-t-brand rounded-full animate-spin"></div>
                                <div className="absolute w-6 h-4 border-2 border-brand rounded-sm transform -skew-x-12 animate-pulse" />
                            </div>
                            <p className="mt-4 text-sm font-bold tracking-widest text-brand animate-pulse uppercase">
                                Swappay
                            </p>
                        </div>
                    ) : (
                        <div className="max-w-[1600px] mx-auto animate-in fade-in slide-in-from-bottom-2 duration-700">
                            {children}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}