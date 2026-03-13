"use client";

import * as React from "react";
import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = React.useState(false);

    // Prevent hydration mismatch
    React.useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <div className="h-8 w-20 rounded-lg bg-gray-100 dark:bg-gray-800 animate-pulse" />;
    }

    return (
        <div className="flex items-center gap-1 rounded-xl bg-gray-100 p-1 dark:bg-[#13131F] border border-gray-200 dark:border-gray-800">
            <button
                onClick={() => setTheme("light")}
                className={`p-1.5 rounded-lg transition-all ${
                    theme === "light" ? "bg-white text-orange-500 shadow-sm" : "text-gray-400 hover:text-gray-600"
                }`}
            >
                <Sun size={14} />
            </button>
            <button
                onClick={() => setTheme("system")}
                className={`p-1.5 rounded-lg transition-all ${
                    theme === "system" ? "bg-white text-blue-500 shadow-sm dark:bg-gray-700" : "text-gray-400 hover:text-gray-600"
                }`}
            >
                <Monitor size={14} />
            </button>
            <button
                onClick={() => setTheme("dark")}
                className={`p-1.5 rounded-lg transition-all ${
                    theme === "dark" ? "bg-gray-700 text-indigo-400 shadow-sm" : "text-gray-400 hover:text-gray-600"
                }`}
            >
                <Moon size={14} />
            </button>
        </div>
    );
}