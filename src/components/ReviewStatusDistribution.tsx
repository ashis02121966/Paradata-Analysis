import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { SurveyData } from '../types';
import { statusColors } from '../data/mockData';

interface ReviewStatusDistributionProps {
  data: SurveyData[];
}

export const ReviewStatusDistribution: React.FC<ReviewStatusDistributionProps> = ({ data }) => {
  const totalApproved = data.reduce((sum, item) => sum + item.recordsApproved, 0);
  const totalUnderReview = data.reduce((sum, item) => sum + item.recordsUnderSupervisorReview + item.recordsUnderDSReview, 0);
  const totalRejected = data.reduce((sum, item) => sum + item.recordsRejected, 0);
  const totalPendingCorrection = data.reduce((sum, item) => sum + item.recordsPendingCorrection, 0);

  const pieData = [
    {
      name: 'Approved',
      value: totalApproved,
      fill: statusColors['Approved']
    },
    {
      name: 'Under Review',
      value: totalUnderReview,
      fill: statusColors['Under Review']
    },
    {
      name: 'Rejected',
      value: totalRejected,
      fill: statusColors['Rejected']
    },
    {
      name: 'Pending Correction',
      value: totalPendingCorrection,
      fill: statusColors['Pending Correction']
    }
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const total = pieData.reduce((sum, item) => sum + item.value, 0);
      const percentage = ((data.value / total) * 100).toFixed(1);
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-900">{data.name}</p>
          <p className="text-gray-600">
            Records: <span className="font-semibold">{data.value.toLocaleString()}</span>
          </p>
          <p className="text-gray-600">
            Percentage: <span className="font-semibold">{percentage}%</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Overall Review Status Distribution</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={120}
            paddingAngle={2}
            dataKey="value"
          >
            {pieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            verticalAlign="bottom" 
            height={36}
            formatter={(value) => value}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};