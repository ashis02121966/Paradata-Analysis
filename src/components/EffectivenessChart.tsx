import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { ScrutinyData } from '../types';
import { categoryColors } from '../data/mockData';

interface EffectivenessChartProps {
  data: ScrutinyData[];
}

export const EffectivenessChart: React.FC<EffectivenessChartProps> = ({ data }) => {
  const chartData = data.map(item => ({
    name: item.subcategory,
    effectiveness: item.effectivenessScore,
    category: item.category,
    cases: item.totalCases
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-900">{label}</p>
          <p className="text-sm text-gray-600 mb-2">{data.category}</p>
          <p className="text-blue-600">
            Effectiveness: <span className="font-semibold">{data.effectiveness}%</span>
          </p>
          <p className="text-gray-600">
            Total Cases: <span className="font-semibold">{data.cases.toLocaleString()}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Effectiveness by Subcategory</h3>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="name" 
            tick={{ fontSize: 12 }}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis 
            tick={{ fontSize: 12 }}
            domain={[0, 100]}
            label={{ value: 'Effectiveness (%)', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="effectiveness" radius={[4, 4, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={categoryColors[entry.category as keyof typeof categoryColors]} 
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};