import React from 'react';
import { Eye, Clock, CheckCircle, XCircle, AlertCircle, Users, Edit, AlertTriangle } from 'lucide-react';
import { HouseholdData } from '../types';

interface HouseholdDataTableProps {
  data: HouseholdData[];
  onRowClick: (item: HouseholdData) => void;
}

export const HouseholdDataTable: React.FC<HouseholdDataTableProps> = ({ data, onRowClick }) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Approved':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'Rejected':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'Under Supervisor Review':
      case 'Under DS Review':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'Pending Correction':
        return <AlertCircle className="w-4 h-4 text-orange-500" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved':
        return 'text-green-600 bg-green-50';
      case 'Rejected':
        return 'text-red-600 bg-red-50';
      case 'Under Supervisor Review':
      case 'Under DS Review':
        return 'text-yellow-600 bg-yellow-50';
      case 'Pending Correction':
        return 'text-orange-600 bg-orange-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getQualityColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-50';
    if (score >= 80) return 'text-blue-600 bg-blue-50';
    if (score >= 70) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Household-level Scrutiny Details</h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Household Details
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Quality Metrics
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Errors Found
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Data Changes
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Enumerator
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
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
                    <div className="text-sm font-medium text-gray-900">{item.householdId}</div>
                    <div className="text-sm text-gray-500">{item.headOfHousehold}</div>
                    <div className="text-xs text-gray-400">
                      <Users className="w-3 h-3 inline mr-1" />
                      {item.householdSize} members
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(item.currentStatus)}
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.currentStatus)}`}>
                      {item.currentStatus}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-600">Quality:</span>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getQualityColor(item.dataQualityScore)}`}>
                        {item.dataQualityScore}%
                      </span>
                    </div>
                    <div className="text-xs text-gray-600">
                      Completeness: {item.completenessPercentage}%
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="w-3 h-3 text-red-500" />
                      <span className="text-xs text-red-600">
                        Critical: {item.criticalErrors}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="w-3 h-3 text-yellow-500" />
                      <span className="text-xs text-yellow-600">
                        Minor: {item.minorErrors}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    <Edit className="w-4 h-4 text-blue-500" />
                    <span className="text-sm font-medium text-blue-600">
                      {item.scrutinyChanges.length} changes
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{item.enumeratorName}</div>
                  <div className="text-xs text-gray-500">{item.enumeratorId}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 transition-colors duration-200">
                    <Eye className="w-4 h-4" />
                    <span className="text-sm">View Details</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};