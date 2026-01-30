"use client";

import React from 'react';
import { Users, CreditCard, Activity, Zap } from 'lucide-react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from 'recharts';
import { StatCard } from '@/components/dashboard/StatCard';
import { TransactionTable } from '@/components/dashboard/TransactionTable';

// Demo Data for Line Chart
const lineData = [
    { name: '4 days ago', Naira: 240, Dollars: 180, Ghana: 210 },
    { name: '3 days ago', Naira: 320, Dollars: 250, Ghana: 280 },
    { name: '2 days ago', Naira: 280, Dollars: 340, Ghana: 230 },
    { name: 'Yesterday', Naira: 380, Dollars: 290, Ghana: 310 },
    { name: 'Today', Naira: 350, Dollars: 390, Ghana: 340 },
];

// Demo Data for Pie Chart
const pieData = [
    { name: 'USD', value: 70000, color: '#60A5FA' },
    { name: 'NGN', value: 30000, color: '#34D399' },
    { name: 'GHS', value: 30000, color: '#000000' },
];

export default function DashboardPage() {
    return (
        <div className="space-y-8 bg-background min-h-screen transition-colors duration-300">
            {/* Top Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard label="Total Users" value="4,532" change="+12.5%" isPositive={true} icon={<Users size={20} />} />
                <StatCard label="Active Users" value="8,847" change="+8.1%" isPositive={true} icon={<Activity size={20} />} />
                <StatCard label="Trans. Volume" value="$ 2.4M" change="+15.3%" isPositive={true} icon={<CreditCard size={20} />} />
                <StatCard label="Revenue Today" value="12.5K" change="+5.2%" isPositive={true} icon={<Zap size={20} />} />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Daily Transaction Volume - Line Chart */}
                <div className="lg:col-span-2 bg-card text-card-foreground border border-border p-6 rounded-[2rem] h-[450px] shadow-sm transition-all">
                    <h3 className="font-bold text-lg mb-6">Daily Transaction Volume</h3>
                    <div className="w-full h-[320px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={lineData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" opacity={0.1} />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                                />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                />
                                <Line type="monotone" dataKey="Naira" stroke="#8B5CF6" strokeWidth={3} dot={false} />
                                <Line type="monotone" dataKey="Dollars" stroke="#3B82F6" strokeWidth={3} dot={false} />
                                <Line type="monotone" dataKey="Ghana" stroke="#1E293B" strokeWidth={3} dot={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Metric - Pie Chart */}
                <div className="bg-card text-card-foreground border border-border p-6 rounded-[2rem] h-[450px] shadow-sm transition-all">
                    <h3 className="font-bold text-lg mb-6">Metric</h3>
                    <div className="w-full h-[320px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend verticalAlign="bottom" height={36}/>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <TransactionTable />
        </div>
    );
}