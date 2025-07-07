import React from 'react';
import { X, TrendingUp, Calendar, Users, Clock, Target, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { SurveyData } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface DrilldownModalProps {
  data: SurveyData | null;
  isOpen: boolean;
  onClose: () => void;
}

export const DrilldownModal: React.FC<DrilldownModalProps> = ({ data, isOpen, onClose }) => {
  if (!isOpen || !data) return null;

  // Mock historical data for trend analysis
  const historicalData = [
    { week: 'Week 1', efficiency: 82, reviewed: 2800, approved: 2296 },
    { week: 'Week 2', efficiency: 85, reviewed: 3200, approved: 2720 },
    { week: 'Week 3', efficiency: 87, reviewed: 3600, approved: 3132 },
    { week: 'Week 4', efficiency: 89, reviewed: 4100, approved: 3649 },
    { week: 'Current', efficiency: Math.round((data.recordsApproved / data.totalRecords) * 100), reviewed: data.totalRecords, approved: data.recordsApproved }
  ];

  const reviewLevelData = [
    { level: 'Supervisor Review', pending: data.recordsUnderSupervisorReview, completed: data.totalRecords - data.recordsUnderSupervisorReview },
    { level: 'DS Review', pending: data.recordsUnderDSReview, completed: data.totalRecords - data.recordsUnderDSReview }
  ];

  const efficiency = ((data.recordsApproved / data.totalRecords) * 100).toFixed(1);
  const rejectionRate = ((data.recordsRejected / data.totalRecords) * 100).toFixed(1);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{data.surveyName}</h2>
            <p className="text-gray-600">{data.state} - {data.district}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4">
              <div className="flex items-center space-x-3">
                <Users className="w-8 h-8 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold text-blue-900">{data.totalRecords.toLocaleString()}</p>
                  <p className="text-sm text-blue-700">Total Records</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-8 h-8 text-green-600" />
                <div>
                  <p className="text-2xl font-bold text-green-900">{efficiency}%</p>
                  <p className="text-sm text-green-700">Approval Rate</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-4">
              <div className="flex items-center space-x-3">
                <XCircle className="w-8 h-8 text-red-600" />
                <div>
                  <p className="text-2xl font-bold text-red-900">{rejectionRate}%</p>
                  <p className="text-sm text-red-700">Rejection Rate</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-4">
              <div className="flex items-center space-x-3">
                <AlertCircle className="w-8 h-8 text-yellow-600" />
                <div>
                  <p className="text-2xl font-bold text-yellow-900">
                    {(data.recordsUnderSupervisorReview + data.recordsUnderDSReview + data.recordsPendingCorrection).toLocaleString()}
                  </p>
                  <p className="text-sm text-yellow-700">Pending Review</p>
                </div>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Efficiency Trend */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Review Efficiency Trend</h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={historicalData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis dataKey="week" tick={{ fontSize: 12 }} />
                  <YAxis domain={[70, 100]} tick={{ fontSize: 12 }} />
                  <Tooltip 
                    formatter={(value, name) => [
                      name === 'efficiency' ? `${value}%` : value.toLocaleString(),
                      name === 'efficiency' ? 'Efficiency' : name === 'reviewed' ? 'Reviewed' : 'Approved'
                    ]}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="efficiency" 
                    stroke="#3B82F6" 
                    strokeWidth={3}
                    dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Review Level Performance */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Review Level Performance</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={reviewLevelData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis dataKey="level" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip formatter={(value) => value.toLocaleString()} />
                  <Bar dataKey="completed" fill="#10B981" name="Completed" />
                  <Bar dataKey="pending" fill="#F59E0B" name="Pending" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Detailed Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Review Status Breakdown</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center py-3 px-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-gray-700">Records Approved</span>
                  </div>
                  <span className="font-semibold text-green-800">{data.recordsApproved.toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between items-center py-3 px-4 bg-red-50 rounded-lg border border-red-200">
                  <div className="flex items-center space-x-3">
                    <XCircle className="w-5 h-5 text-red-600" />
                    <span className="text-gray-700">Records Rejected</span>
                  </div>
                  <span className="font-semibold text-red-800">{data.recordsRejected.toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between items-center py-3 px-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center space-x-3">
                    <Clock className="w-5 h-5 text-blue-600" />
                    <span className="text-gray-700">Under Supervisor Review</span>
                  </div>
                  <span className="font-semibold text-blue-800">{data.recordsUnderSupervisorReview.toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between items-center py-3 px-4 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="flex items-center space-x-3">
                    <Target className="w-5 h-5 text-purple-600" />
                    <span className="text-gray-700">Under DS Review</span>
                  </div>
                  <span className="font-semibold text-purple-800">{data.recordsUnderDSReview.toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between items-center py-3 px-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="flex items-center space-x-3">
                    <AlertCircle className="w-5 h-5 text-yellow-600" />
                    <span className="text-gray-700">Pending Correction</span>
                  </div>
                  <span className="font-semibold text-yellow-800">{data.recordsPendingCorrection.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Performance Insights</h3>
              
              <div className="space-y-3">
                {parseFloat(efficiency) >= 90 && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-800">
                      <strong>Excellent Performance:</strong> This survey shows outstanding review efficiency above 90%. Continue current practices.
                    </p>
                  </div>
                )}
                
                {parseFloat(efficiency) < 80 && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-800">
                      <strong>Attention Required:</strong> Review efficiency is below 80%. Consider additional training or process improvements.
                    </p>
                  </div>
                )}
                
                {data.recordsUnderSupervisorReview > data.totalRecords * 0.1 && (
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      <strong>Supervisor Backlog:</strong> High number of records pending supervisor review. Consider resource allocation.
                    </p>
                  </div>
                )}
                
                {data.recordsUnderDSReview > data.totalRecords * 0.05 && (
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>DS Review Queue:</strong> Significant DS review backlog detected. Monitor processing times.
                    </p>
                  </div>
                )}
                
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                  <p className="text-sm text-gray-700">
                    <strong>Last Updated:</strong> {new Date(data.lastUpdated).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-700 mt-1">
                    <strong>Submission Date:</strong> {new Date(data.submissionDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};