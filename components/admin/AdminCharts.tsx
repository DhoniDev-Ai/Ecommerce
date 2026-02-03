"use client";

import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar
} from 'recharts';
import { useState } from 'react';

interface ChartProps {
    data: any[];
}

export function AdminCharts({ data }: ChartProps) {
    const [view, setView] = useState<'revenue' | 'orders'>('revenue');

    if (!data || data.length === 0) {
        return (
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-xl border border-dashed border-gray-200 text-gray-400 text-sm">
                Not enough data for insights yet.
            </div>
        );
    }

    // Format data for simpler display if needed, but assuming data passed is already formatted
    // Expected: { date: 'Jan 24', revenue: 1200, orders: 4 }

    return (
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h3 className="font-bold text-gray-900">Ritual Activity</h3>
                    <p className="text-xs text-gray-500 mt-1">Growth trends over the last 30 days</p>
                </div>
                <div className="flex bg-gray-100 p-0.5 rounded-lg">
                    <button
                        onClick={() => setView('revenue')}
                        className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${view === 'revenue' ? 'bg-white text-green-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        Revenue
                    </button>
                    <button
                        onClick={() => setView('orders')}
                        className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${view === 'orders' ? 'bg-white text-green-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        Orders
                    </button>
                </div>
            </div>

            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    {view === 'revenue' ? (
                        <AreaChart data={data}>
                            <defs>
                                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#5A7A6A" stopOpacity={0.2} />
                                    <stop offset="95%" stopColor="#5A7A6A" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8E6E2" />
                            <XAxis
                                dataKey="date"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 10, fill: '#9AA09A' }}
                                dy={10}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 10, fill: '#9AA09A' }}
                                tickFormatter={(value) => `₹${value}`}
                            />
                            <Tooltip
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}
                                itemStyle={{ color: '#2D3A3A', fontSize: '12px', fontWeight: 'bold' }}
                            />
                            <Area
                                type="monotone"
                                dataKey="revenue"
                                stroke="#5A7A6A"
                                strokeWidth={2}
                                fillOpacity={1}
                                fill="url(#colorRev)"
                            />
                        </AreaChart>
                    ) : (
                        <BarChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8E6E2" />
                            <XAxis
                                dataKey="date"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 10, fill: '#9AA09A' }}
                                dy={10}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 10, fill: '#9AA09A' }}
                                allowDecimals={false}
                            />
                            <Tooltip
                                cursor={{ fill: '#F3F1ED' }}
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}
                                itemStyle={{ color: '#2D3A3A', fontSize: '12px', fontWeight: 'bold' }}
                            />
                            <Bar
                                dataKey="orders"
                                fill="#2D3A3A"
                                radius={[4, 4, 0, 0]}
                                barSize={20}
                            />
                        </BarChart>
                    )}
                </ResponsiveContainer>
            </div>
        </div>
    );
}
