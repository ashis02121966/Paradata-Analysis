import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { ScrutinyData } from '../types';
import { riskLevelColors } from '../data/mockData';

interface RiskDistributionProps {
  data: ScrutinyData[];
}

export const RiskDistribution: React.FC<RiskDistributionProps> = ({ data }) => {
  const riskData = data.reduce((acc, item) => {
    const existing = acc.find(r => r.name === item.riskLevel);
    if (existing) {
      existing.value += 1;
      existing.cases += item.totalCases;
    } else {
      acc.push({
        name: item.riskLevel,
        value: 1,
        cases: item.totalCases,
        fill: riskLevelColors[item.riskLevel]
      });
    }
    return acc;
  }, [] as any[]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-900">{data.name} Risk</p>
          <p className="text-gray-600">
            Categories: <span className="font-semibold">{data.value}</span>
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
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Risk Level Distribution</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={riskData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={120}
            paddingAngle={2}
            dataKey="value"
          >
            {riskData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            verticalAlign="bottom" 
            height={36}
            formatter={(value) => `${value} Risk`}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};