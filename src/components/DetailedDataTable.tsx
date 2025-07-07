import React from 'react';
import { Eye, Clock, CheckCircle, XCircle, AlertCircle, Users, ChevronRight } from 'lucide-react';
import { SurveyData } from '../types';

interface DetailedDataTableProps {
  data: SurveyData[];
  onRowClick: (item: SurveyData) => void;
  onDrilldown?: (item: SurveyData) => void;
}

export const DetailedDataTable: React.FC<DetailedDataTableProps> = ({ data, onRowClick, onDrilldown }) => {
  const getStatusIcon = (approved: number, total: number) => {
    const percentage = (approved / total) * 100;
    if (percentage >= 90) return <CheckCircle className="w-4 h-4 text-green-500" />;
    if (percentage >= 70) return <AlertCircle className="w-4 h-4 text-yellow-500" />;
    return <XCircle className="w-4 h-4 text-red-500" />;
  };

  const getEfficiencyColor = (approved: number, total: number) => {
    const percentage = (approved / total) * 100;
    if (percentage >= 90) return 'text-green-600 bg-green-50';
    if (percentage >= 70) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Survey Data Review Details</h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Survey & Location
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Records
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Review Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Efficiency
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Pending Reviews
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Updated
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((item) => {
              const efficiency = ((item.recordsApproved / item.totalRecords) * 100).toFixed(1);
              const pendingTotal = item.recordsUnderSupervisorReview + item.recordsUnderDSReview + item.recordsPendingCorrection;
              
              return (
                <tr 
                  key={item.id} 
                  className="hover:bg-gray-50 transition-colors duration-150"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{item.surveyName}</div>
                      <div className="text-sm text-gray-500">{item.state} - {item.district}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-900">
                        {item.totalRecords.toLocaleString()}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-3 h-3 text-green-500" />
                        <span className="text-xs text-gray-600">
                          Approved: {item.recordsApproved.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <XCircle className="w-3 h-3 text-red-500" />
                        <span className="text-xs text-gray-600">
                          Rejected: {item.recordsRejected.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(item.recordsApproved, item.totalRecords)}
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getEfficiencyColor(item.recordsApproved, item.totalRecords)}`}>
                        {efficiency}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      <div className="text-xs text-gray-600">
                        Supervisor: {item.recordsUnderSupervisorReview}
                      </div>
                      <div className="text-xs text-gray-600">
                        DS: {item.recordsUnderDSReview}
                      </div>
                      <div className="text-xs text-gray-600">
                        Correction: {item.recordsPendingCorrection}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-900">
                        {new Date(item.lastUpdated).toLocaleDateString()}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => onRowClick(item)}
                        className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 transition-colors duration-200"
                      >
                        <Eye className="w-4 h-4" />
                        <span className="text-sm">View</span>
                      </button>
                      {onDrilldown && (
                        <button 
                          onClick={() => onDrilldown(item)}
                          className="flex items-center space-x-1 text-green-600 hover:text-green-800 transition-colors duration-200"
                        >
                          <ChevronRight className="w-4 h-4" />
                          <span className="text-sm">FSUs</span>
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
  );
};