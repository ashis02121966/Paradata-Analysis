import React from 'react';
import { X, User, Calendar, MapPin, AlertTriangle, CheckCircle, Edit, Clock } from 'lucide-react';
import { HouseholdData } from '../types';

interface HouseholdDrilldownModalProps {
  data: HouseholdData | null;
  isOpen: boolean;
  onClose: () => void;
}

export const HouseholdDrilldownModal: React.FC<HouseholdDrilldownModalProps> = ({ data, isOpen, onClose }) => {
  if (!isOpen || !data) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved':
        return 'bg-green-100 text-green-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      case 'Under Supervisor Review':
      case 'Under DS Review':
        return 'bg-yellow-100 text-yellow-800';
      case 'Pending Correction':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical':
        return 'bg-red-100 text-red-800';
      case 'Major':
        return 'bg-orange-100 text-orange-800';
      case 'Minor':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{data.householdId}</h2>
            <p className="text-gray-600">{data.headOfHousehold} - {data.fsuCode}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {/* Household Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4">
              <div className="flex items-center space-x-3">
                <User className="w-8 h-8 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold text-blue-900">{data.householdSize}</p>
                  <p className="text-sm text-blue-700">Family Members</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-8 h-8 text-green-600" />
                <div>
                  <p className="text-2xl font-bold text-green-900">{data.dataQualityScore}%</p>
                  <p className="text-sm text-green-700">Quality Score</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4">
              <div className="flex items-center space-x-3">
                <Edit className="w-8 h-8 text-purple-600" />
                <div>
                  <p className="text-2xl font-bold text-purple-900">{data.scrutinyChanges.length}</p>
                  <p className="text-sm text-purple-700">Data Changes</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="w-8 h-8 text-orange-600" />
                <div>
                  <p className="text-2xl font-bold text-orange-900">{data.criticalErrors + data.minorErrors}</p>
                  <p className="text-sm text-orange-700">Total Errors</p>
                </div>
              </div>
            </div>
          </div>

          {/* Status and Timeline */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Status</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Status:</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(data.currentStatus)}`}>
                    {data.currentStatus}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Completeness:</span>
                  <span className="font-semibold text-gray-900">{data.completenessPercentage}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Critical Errors:</span>
                  <span className="font-semibold text-red-600">{data.criticalErrors}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Minor Errors:</span>
                  <span className="font-semibold text-yellow-600">{data.minorErrors}</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Review Timeline</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Submitted</p>
                    <p className="text-sm text-gray-600">{new Date(data.submissionDate).toLocaleDateString()}</p>
                  </div>
                </div>
                {data.supervisorReviewDate && (
                  <div className="flex items-center space-x-3">
                    <Clock className="w-5 h-5 text-yellow-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Supervisor Review</p>
                      <p className="text-sm text-gray-600">{new Date(data.supervisorReviewDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                )}
                {data.dsReviewDate && (
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">DS Review</p>
                      <p className="text-sm text-gray-600">{new Date(data.dsReviewDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Scrutiny Changes */}
          {data.scrutinyChanges.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Changes During Scrutiny</h3>
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Field</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Original Value</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Revised Value</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Changed By</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Severity</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reason</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {data.scrutinyChanges.map((change) => (
                      <tr key={change.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{change.fieldLabel}</div>
                          <div className="text-sm text-gray-500">{change.fieldName}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-900 bg-red-50 px-2 py-1 rounded">
                            {String(change.originalValue)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-900 bg-green-50 px-2 py-1 rounded">
                            {String(change.revisedValue)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-900">{change.changedBy}</span>
                          <div className="text-xs text-gray-500">{new Date(change.changeDate).toLocaleDateString()}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getSeverityColor(change.severity)}`}>
                            {change.severity}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">{change.changeReason}</div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Comments */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {data.supervisorComments && (
              <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-200">
                <h4 className="text-lg font-semibold text-yellow-900 mb-2">Supervisor Comments</h4>
                <p className="text-yellow-800">{data.supervisorComments}</p>
              </div>
            )}
            
            {data.dsComments && (
              <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                <h4 className="text-lg font-semibold text-green-900 mb-2">DS Comments</h4>
                <p className="text-green-800">{data.dsComments}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};