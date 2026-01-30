import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider"; //

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Swappay Admin Dashboard",
    description: "Secure payment management system",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        // suppressHydrationWarning is necessary for next-themes
        <html lang="en" suppressHydrationWarning>
        <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
        {/* Wrapping children in ThemeProvider enables dark mode globally */}
        <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
        >
            {children}
        </ThemeProvider>
        </body>
        </html>
    );
}