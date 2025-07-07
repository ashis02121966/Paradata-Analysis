import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Eye, ChevronRight } from 'lucide-react';
import { FSUData } from '../types';

interface FSUPerformanceChartProps {
  data: FSUData[];
  onFSUClick?: (item: FSUData) => void;
  onDrilldown?: (item: FSUData) => void;
}

export const FSUPerformanceChart: React.FC<FSUPerformanceChartProps> = ({ data, onFSUClick, onDrilldown }) => {
  const chartData = data.map(item => ({
    name: item.fsuCode,
    fullName: item.fsuName,
    village: item.village,
    block: item.block,
    totalHouseholds: item.totalHouseholds,
    approved: item.householdsApproved,
    rejected: item.householdsRejected,
    pending: item.householdsPendingCorrection,
    underReview: item.householdsUnderSupervisorReview + item.householdsUnderDSReview,
    qualityScore: item.dataQualityScore,
    completeness: item.completenessScore,
    consistency: item.consistencyScore,
    enumerator: item.enumeratorName,
    fsuData: item
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const efficiency = ((data.approved / data.totalHouseholds) * 100).toFixed(1);
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-900 mb-2">{data.fullName}</p>
          <p className="text-sm text-gray-600 mb-2">{data.village}, {data.block}</p>
          <p className="text-sm text-gray-600 mb-2">Enumerator: {data.enumerator}</p>
          <div className="space-y-1">
            <p className="text-blue-600">
              Total Households: <span className="font-semibold">{data.totalHouseholds}</span>
            </p>
            <p className="text-green-600">
              Approved: <span className="font-semibold">{data.approved}</span>
            </p>
            <p className="text-red-600">
              Rejected: <span className="font-semibold">{data.rejected}</span>
            </p>
            <p className="text-yellow-600">
              Under Review: <span className="font-semibold">{data.underReview}</span>
            </p>
            <p className="text-purple-600">
              Efficiency: <span className="font-semibold">{efficiency}%</span>
            </p>
            <p className="text-indigo-600">
              Quality Score: <span className="font-semibold">{data.qualityScore}%</span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">FSU-wise Data Review Performance</h3>
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
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="approved" fill="#10B981" name="Approved" radius={[2, 2, 0, 0]} />
            <Bar dataKey="rejected" fill="#EF4444" name="Rejected" radius={[2, 2, 0, 0]} />
            <Bar dataKey="pending" fill="#F59E0B" name="Pending" radius={[2, 2, 0, 0]} />
            <Bar dataKey="underReview" fill="#8B5CF6" name="Under Review" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* FSU Details Table */}
      <div className="border-t border-gray-200">
        <div className="px-6 py-4">
          <h4 className="text-md font-semibold text-gray-900 mb-4">FSU Details</h4>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">FSU Code</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Households</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Efficiency</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Quality</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Enumerator</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data.map((fsu) => {
                  const efficiency = ((fsu.householdsApproved / fsu.totalHouseholds) * 100).toFixed(1);
                  return (
                    <tr key={fsu.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{fsu.fsuCode}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{fsu.village}, {fsu.block}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{fsu.totalHouseholds}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          parseFloat(efficiency) >= 90 ? 'text-green-600 bg-green-50' :
                          parseFloat(efficiency) >= 70 ? 'text-yellow-600 bg-yellow-50' :
                          'text-red-600 bg-red-50'
                        }`}>
                          {efficiency}%
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          fsu.dataQualityScore >= 90 ? 'text-green-600 bg-green-50' :
                          fsu.dataQualityScore >= 70 ? 'text-yellow-600 bg-yellow-50' :
                          'text-red-600 bg-red-50'
                        }`}>
                          {fsu.dataQualityScore}%
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{fsu.enumeratorName}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center space-x-2">
                          {onFSUClick && (
                            <button
                              onClick={() => onFSUClick(fsu)}
                              className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 transition-colors duration-200"
                            >
                              <Eye className="w-4 h-4" />
                              <span className="text-sm">View</span>
                            </button>
                          )}
                          {onDrilldown && (
                            <button
                              onClick={() => onDrilldown(fsu)}
                              className="flex items-center space-x-1 text-green-600 hover:text-green-800 transition-colors duration-200"
                            >
                              <ChevronRight className="w-4 h-4" />
                              <span className="text-sm">Households</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};