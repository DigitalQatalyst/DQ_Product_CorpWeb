import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { condition: 'Lung Cancer', ai: 94.2, traditional: 87.1 },
  { condition: 'Diabetic Retinopathy', ai: 97.5, traditional: 84.3 },
  { condition: 'Skin Melanoma', ai: 91.8, traditional: 82.6 },
  { condition: 'Breast Cancer', ai: 96.1, traditional: 88.4 },
  { condition: 'Cardiac Arrhythmia', ai: 93.7, traditional: 79.2 },
  { condition: 'Brain Tumor', ai: 89.4, traditional: 76.8 },
];

const DiagnosticAccuracyChart: React.FC = () => {
  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis 
            dataKey="condition" 
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis 
            tick={{ fill: 'hsl(var(--muted-foreground))' }}
            domain={[70, 100]}
            label={{ value: 'Accuracy (%)', angle: -90, position: 'insideLeft', fill: 'hsl(var(--muted-foreground))' }}
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
          <Bar dataKey="ai" name="AI-Assisted" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
          <Bar dataKey="traditional" name="Traditional" fill="hsl(var(--muted-foreground))" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DiagnosticAccuracyChart;