"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";

export default function Home() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        router.push("/dashboard/home");
      } else {
        router.push("/auth/login");
      }
    }
  }, [user, isLoading, router]);

  return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8F9FB]">
        <div className="flex flex-col items-center gap-3">
          <div className="bg-black p-2 rounded-lg">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 11L17 11M7 11L12 6M7 11L12 16"/>
            </svg>
          </div>
          <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
        </div>
      </div>
  );
}