import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { year: '2019', adoption: 12, investment: 2.4 },
  { year: '2020', adoption: 18, investment: 4.1 },
  { year: '2021', adoption: 31, investment: 7.8 },
  { year: '2022', adoption: 47, investment: 12.3 },
  { year: '2023', adoption: 58, investment: 18.6 },
  { year: '2024', adoption: 72, investment: 26.4 },
];

const AdoptionTrendChart: React.FC = () => {
  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis 
            dataKey="year" 
            tick={{ fill: 'hsl(var(--muted-foreground))' }}
          />
          <YAxis 
            yAxisId="left"
            tick={{ fill: 'hsl(var(--muted-foreground))' }}
            label={{ value: 'Adoption (%)', angle: -90, position: 'insideLeft', fill: 'hsl(var(--muted-foreground))' }}
          />
          <YAxis 
            yAxisId="right"
            orientation="right"
            tick={{ fill: 'hsl(var(--muted-foreground))' }}
            label={{ value: 'Investment ($B)', angle: 90, position: 'insideRight', fill: 'hsl(var(--muted-foreground))' }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'hsl(var(--card))', 
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px'
            }}
            labelStyle={{ color: 'hsl(var(--foreground))' }}
          />
          <Legend />
          <Line 
            yAxisId="left"
            type="monotone" 
            dataKey="adoption" 
            name="Hospital Adoption Rate"
            stroke="hsl(var(--primary))" 
            strokeWidth={3}
            dot={{ fill: 'hsl(var(--primary))' }}
          />
          <Line 
            yAxisId="right"
            type="monotone" 
            dataKey="investment" 
            name="Global Investment"
            stroke="#FF6B4D" 
            strokeWidth={3}
            dot={{ fill: '#FF6B4D' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AdoptionTrendChart;