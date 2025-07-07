import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { SupervisorPerformance } from '../types';

interface SupervisorPerformanceChartProps {
  data: SupervisorPerformance[];
}

export const SupervisorPerformanceChart: React.FC<SupervisorPerformanceChartProps> = ({ data }) => {
  const chartData = data.map(item => ({
    name: item.supervisorName.split(' ')[0],
    fullName: item.supervisorName,
    state: item.state,
    district: item.district,
    reviewed: item.totalReviewed,
    approved: item.totalApproved,
    rejected: item.totalRejected,
    pending: item.pendingReviews,
    qualityScore: item.qualityScore,
    avgTime: item.avgReviewTime
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-900 mb-2">{data.fullName}</p>
          <p className="text-sm text-gray-600 mb-2">{data.state} - {data.district}</p>
          <div className="space-y-1">
            <p className="text-blue-600">
              Reviewed: <span className="font-semibold">{data.reviewed.toLocaleString()}</span>
            </p>
            <p className="text-green-600">
              Approved: <span className="font-semibold">{data.approved.toLocaleString()}</span>
            </p>
            <p className="text-red-600">
              Rejected: <span className="font-semibold">{data.rejected.toLocaleString()}</span>
            </p>
            <p className="text-yellow-600">
              Pending: <span className="font-semibold">{data.pending.toLocaleString()}</span>
            </p>
            <p className="text-purple-600">
              Quality Score: <span className="font-semibold">{data.qualityScore}%</span>
            </p>
            <p className="text-orange-600">
              Avg Time: <span className="font-semibold">{data.avgTime} hrs</span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Supervisor's Data Review Performance</h3>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar dataKey="approved" fill="#10B981" name="Approved" radius={[2, 2, 0, 0]} />
          <Bar dataKey="rejected" fill="#EF4444" name="Rejected" radius={[2, 2, 0, 0]} />
          <Bar dataKey="pending" fill="#F59E0B" name="Pending" radius={[2, 2, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};