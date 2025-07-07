import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { ScrutinyChange } from '../types';
import { severityColors } from '../data/mockData';

interface ScrutinyChangesChartProps {
  data: ScrutinyChange[];
}

export const ScrutinyChangesChart: React.FC<ScrutinyChangesChartProps> = ({ data }) => {
  // Aggregate data by change type
  const changeTypeData = data.reduce((acc, change) => {
    const existing = acc.find(item => item.name === change.changeType);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: change.changeType, value: 1 });
    }
    return acc;
  }, [] as { name: string; value: number }[]);

  // Aggregate data by severity
  const severityData = data.reduce((acc, change) => {
    const existing = acc.find(item => item.name === change.severity);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ 
        name: change.severity, 
        value: 1,
        fill: severityColors[change.severity as keyof typeof severityColors]
      });
    }
    return acc;
  }, [] as { name: string; value: number; fill: string }[]);

  // Aggregate data by changed by
  const changedByData = data.reduce((acc, change) => {
    const existing = acc.find(item => item.name === change.changedBy);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: change.changedBy, value: 1 });
    }
    return acc;
  }, [] as { name: string; value: number }[]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-900">{label}</p>
          <p className="text-blue-600">
            Count: <span className="font-semibold">{payload[0].value}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Change Type Distribution */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Changes by Type</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={changeTypeData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="value" fill="#3B82F6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Severity Distribution */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Changes by Severity</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={severityData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={120}
              paddingAngle={2}
              dataKey="value"
            >
              {severityData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Changed By Distribution */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Changes by Role</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={changedByData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="value" fill="#10B981" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};