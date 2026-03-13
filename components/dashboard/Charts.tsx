"use client";

import React, { useMemo } from 'react';
import { useTheme } from 'next-themes';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

export default function Charts({ type, data, currency, className }: any) {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const activeKeys = useMemo(() => {
        if (currency === 'NGN') return ['Naira'];
        if (currency === 'USD') return ['Dollars'];
        if (currency === 'GHS') return ['Ghana'];
        return ['Naira', 'Dollars', 'Ghana'];
    }, [currency]);

    return (
        <div className={`rounded-3xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-[#13131F] p-6 shadow-sm ${className}`}>
            <h3 className="text-lg font-bold mb-6 dark:text-white">{type === 'line' ? 'Volume' : 'Share'}</h3>
            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    {type === 'line' ? (
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? "#27272A" : "#F3F4F6"} />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} />
                            <YAxis axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} />
                            <Tooltip contentStyle={{backgroundColor: isDark ? '#0B0B15' : '#fff', borderRadius: '12px', border: 'none'}} />
                            {activeKeys.includes('Naira') && <Line type="monotone" dataKey="Naira" stroke="#A5F3FC" strokeWidth={3} dot={false} />}
                            {activeKeys.includes('Dollars') && <Line type="monotone" dataKey="Dollars" stroke="#7C5CFF" strokeWidth={3} dot={false} />}
                            {activeKeys.includes('Ghana') && <Line type="monotone" dataKey="Ghana" stroke="#22D3EE" strokeWidth={3} dot={false} />}
                        </LineChart>
                    ) : (
                        <PieChart>
                            <Pie data={data} innerRadius={60} outerRadius={80} dataKey="value" stroke="none">
                                {data.map((entry: any, i: number) => <Cell key={i} fill={entry.color} />)}
                            </Pie>
                            <Legend />
                        </PieChart>
                    )}
                </ResponsiveContainer>
            </div>
        </div>
    );
}