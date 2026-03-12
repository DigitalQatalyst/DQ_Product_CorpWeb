import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const data = [
  { name: 'Medical Imaging', value: 34, color: 'hsl(var(--primary))' },
  { name: 'Drug Discovery', value: 22, color: '#FF6B4D' },
  { name: 'Clinical Decision Support', value: 18, color: 'hsl(280, 80%, 60%)' },
  { name: 'Patient Monitoring', value: 14, color: 'hsl(200, 80%, 60%)' },
  { name: 'Administrative Tasks', value: 12, color: 'hsl(160, 60%, 50%)' },
];

const ApplicationsPieChart: React.FC = () => {
  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={2}
            dataKey="value"
            label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
            labelLine={false}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'hsl(var(--card))', 
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px'
            }}
            formatter={(value: number) => [`${value}%`, 'Market Share']}
          />
          <Legend 
            verticalAlign="bottom"
            formatter={(value) => <span style={{ color: 'hsl(var(--muted-foreground))' }}>{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ApplicationsPieChart;