'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const data = [
    { name: 'Rates', value: 40, color: '#3b82f6' }, // Blue
    { name: 'Crypto', value: 35, color: '#eab308' }, // Yellow
    { name: 'Commodities', value: 15, color: '#f97316' }, // Orange
    { name: 'Equities', value: 10, color: '#22c55e' } // Green
];

export function MacroChart() {
    return (
        <div className="h-full w-full flex flex-col">
             <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wide">Open Interest by Asset</h3>
             </div>
            
            <div className="flex-1 min-h-[250px] relative">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                            stroke="none"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip 
                            contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                            itemStyle={{ color: 'hsl(var(--foreground))', fontSize: '12px' }}
                        />
                        <Legend 
                            verticalAlign="bottom" 
                            height={36} 
                            iconType="circle"
                            formatter={(value) => <span className="text-xs text-muted-foreground font-medium ml-1">{value}</span>}
                        />
                    </PieChart>
                </ResponsiveContainer>
                
                {/* Center Label */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none pb-8">
                    <div className="text-center">
                        <span className="block text-2xl font-bold font-mono">Diverse</span>
                        <span className="text-[10px] text-muted-foreground uppercase">Exposure</span>
                    </div>
                </div>
            </div>
            
            <div className="mt-4 p-3 bg-primary/5 border border-primary/10 rounded-lg">
                <p className="text-xs text-muted-foreground">
                    <span className="font-bold text-primary">Bondemi Advantage:</span> High Rates dominance proves institutional adoption over retail speculation.
                </p>
            </div>
        </div>
    );
}
