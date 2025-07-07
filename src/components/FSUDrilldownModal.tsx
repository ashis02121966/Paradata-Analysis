import React from 'react';
import { X, MapPin, User, Calendar, CheckCircle, AlertTriangle, Edit, Clock, Target } from 'lucide-react';
import { FSUData } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface FSUDrilldownModalProps {
  data: FSUData | null;
  isOpen: boolean;
  onClose: () => void;
}

export const FSUDrilldownModal: React.FC<FSUDrilldownModalProps> = ({ data, isOpen, onClose }) => {
  if (!isOpen || !data) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved':
        return 'bg-green-100 text-green-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      case 'Under Review':
        return 'bg-yellow-100 text-yellow-800';
      case 'Pending Correction':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Mock household status distribution for this FSU
  const householdStatusData = [
    { name: 'Approved', value: data.householdsApproved, fill: '#10B981' },
    { name: 'Rejected', value: data.householdsRejected, fill: '#EF4444' },
    { name: 'Under Supervisor Review', value: data.householdsUnderSupervisorReview, fill: '#F59E0B' },
    { name: 'Under DS Review', value: data.householdsUnderDSReview, fill: '#8B5CF6' },
    { name: 'Pending Correction', value: data.householdsPendingCorrection, fill: '#F97316' }
  ].filter(item => item.value > 0);

  // Mock quality metrics over time
  const qualityTrendData = [
    { week: 'Week 1', quality: 85, completeness: 92, consistency: 88 },
    { week: 'Week 2', quality: 88, completeness: 94, consistency: 90 },
    { week: 'Week 3', quality: 90, completeness: 95, consistency: 89 },
    { week: 'Week 4', quality: data.dataQualityScore, completeness: data.completenessScore, consistency: data.consistencyScore }
  ];

  const efficiency = ((data.householdsApproved / data.totalHouseholds) * 100).toFixed(1);
  const rejectionRate = ((data.householdsRejected / data.totalHouseholds) * 100).toFixed(1);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{data.fsuName}</h2>
            <p className="text-gray-600">{data.fsuCode} - {data.village}, {data.block}</p>
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
                <MapPin className="w-8 h-8 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold text-blue-900">{data.totalHouseholds}</p>
                  <p className="text-sm text-blue-700">Total Households</p>
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

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4">
              <div className="flex items-center space-x-3">
                <Target className="w-8 h-8 text-purple-600" />
                <div>
                  <p className="text-2xl font-bold text-purple-900">{data.dataQualityScore}%</p>
                  <p className="text-sm text-purple-700">Quality Score</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="w-8 h-8 text-orange-600" />
                <div>
                  <p className="text-2xl font-bold text-orange-900">{rejectionRate}%</p>
                  <p className="text-sm text-orange-700">Rejection Rate</p>
                </div>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Household Status Distribution */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Household Status Distribution</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={householdStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {householdStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => value.toLocaleString()} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Quality Metrics Trend */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quality Metrics Trend</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={qualityTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis dataKey="week" tick={{ fontSize: 12 }} />
                  <YAxis domain={[70, 100]} tick={{ fontSize: 12 }} />
                  <Tooltip formatter={(value) => `${value}%`} />
                  <Bar dataKey="quality" fill="#3B82F6" name="Quality" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="completeness" fill="#10B981" name="Completeness" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="consistency" fill="#8B5CF6" name="Consistency" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Detailed Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">FSU Details</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center py-3 px-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-blue-600" />
                    <span className="text-gray-700">Location</span>
                  </div>
                  <span className="font-semibold text-blue-800">{data.village}, {data.block}</span>
                </div>
                
                <div className="flex justify-between items-center py-3 px-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center space-x-3">
                    <User className="w-5 h-5 text-green-600" />
                    <span className="text-gray-700">Enumerator</span>
                  </div>
                  <span className="font-semibold text-green-800">{data.enumeratorName}</span>
                </div>
                
                <div className="flex justify-between items-center py-3 px-4 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="flex items-center space-x-3">
                    <Target className="w-5 h-5 text-purple-600" />
                    <span className="text-gray-700">Supervisor</span>
                  </div>
                  <span className="font-semibold text-purple-800">{data.supervisorName}</span>
                </div>
                
                <div className="flex justify-between items-center py-3 px-4 bg-orange-50 rounded-lg border border-orange-200">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-orange-600" />
                    <span className="text-gray-700">DS</span>
                  </div>
                  <span className="font-semibold text-orange-800">{data.dsName}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Performance Metrics</h3>
              
              <div className="space-y-3">
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Data Quality Score</span>
                    <span className="text-lg font-bold text-gray-900">{data.dataQualityScore}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${data.dataQualityScore}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Completeness Score</span>
                    <span className="text-lg font-bold text-gray-900">{data.completenessScore}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full" 
                      style={{ width: `${data.completenessScore}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Consistency Score</span>
                    <span className="text-lg font-bold text-gray-900">{data.consistencyScore}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-purple-600 h-2 rounded-full" 
                      style={{ width: `${data.consistencyScore}%` }}
                    ></div>
                  </div>
                </div>
                
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