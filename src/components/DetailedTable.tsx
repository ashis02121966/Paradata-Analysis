import React from 'react';
import { TrendingUp, TrendingDown, Minus, AlertTriangle, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { ScrutinyData } from '../types';
import { riskLevelColors } from '../data/mockData';

interface DetailedTableProps {
  data: ScrutinyData[];
  onRowClick: (item: ScrutinyData) => void;
}

export const DetailedTable: React.FC<DetailedTableProps> = ({ data, onRowClick }) => {
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      default:
        return <Minus className="w-4 h-4 text-gray-500" />;
    }
  };

  const getRiskIcon = (riskLevel: string) => {
    switch (riskLevel) {
      case 'Low':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'Medium':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'High':
        return <AlertCircle className="w-4 h-4 text-orange-500" />;
      case 'Critical':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default:
        return <CheckCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getEffectivenessColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-50';
    if (score >= 80) return 'text-blue-600 bg-blue-50';
    if (score >= 70) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Detailed Scrutiny Analysis</h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category & Subcategory
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Effectiveness
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cases
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Success Rate
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Avg. Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Risk Level
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trend
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((item) => (
              <tr 
                key={item.id} 
                className="hover:bg-gray-50 cursor-pointer transition-colors duration-150"
                onClick={() => onRowClick(item)}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{item.category}</div>
                    <div className="text-sm text-gray-500">{item.subcategory}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getEffectivenessColor(item.effectivenessScore)}`}>
                    {item.effectivenessScore}%
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{item.totalCases.toLocaleString()}</div>
                  <div className="text-sm text-gray-500">{item.successfulCases.toLocaleString()} successful</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {((item.successfulCases / item.totalCases) * 100).toFixed(1)}%
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{item.averageTime} days</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    {getRiskIcon(item.riskLevel)}
                    <span 
                      className="text-sm font-medium"
                      style={{ color: riskLevelColors[item.riskLevel] }}
                    >
                      {item.riskLevel}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getTrendIcon(item.trend)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};