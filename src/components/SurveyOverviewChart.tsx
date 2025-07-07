import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { SurveyData } from '../types';
import { surveyColors } from '../data/mockData';

interface SurveyOverviewChartProps {
  data: SurveyData[];
}

export const SurveyOverviewChart: React.FC<SurveyOverviewChartProps> = ({ data }) => {
  const chartData = data.map(item => ({
    name: item.surveyName.split(' ').slice(0, 3).join(' '),
    fullName: item.surveyName,
    state: item.state,
    totalRecords: item.totalRecords,
    approved: item.recordsApproved,
    rejected: item.recordsRejected,
    pending: item.recordsUnderSupervisorReview + item.recordsUnderDSReview + item.recordsPendingCorrection,
    efficiency: ((item.recordsApproved / item.totalRecords) * 100).toFixed(1)
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-900 mb-2">{data.fullName}</p>
          <p className="text-sm text-gray-600 mb-2">State: {data.state}</p>
          <div className="space-y-1">
            <p className="text-green-600">
              Approved: <span className="font-semibold">{data.approved.toLocaleString()}</span>
            </p>
            <p className="text-red-600">
              Rejected: <span className="font-semibold">{data.rejected.toLocaleString()}</span>
            </p>
            <p className="text-yellow-600">
              Pending: <span className="font-semibold">{data.pending.toLocaleString()}</span>
            </p>
            <p className="text-blue-600">
              Efficiency: <span className="font-semibold">{data.efficiency}%</span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Survey-wise Data Review Performance (Pan India)</h3>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
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
            label={{ value: 'Number of Records', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="totalRecords" radius={[4, 4, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={surveyColors[entry.fullName as keyof typeof surveyColors]} 
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};