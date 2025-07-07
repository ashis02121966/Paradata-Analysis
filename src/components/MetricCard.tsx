import React from 'react';
import { TrendingUp, TrendingDown, Minus, FileText, Clock, CheckCircle, MapPin, Edit } from 'lucide-react';
import { MetricCard as MetricCardType } from '../types';

interface MetricCardProps {
  metric: MetricCardType;
}

const iconMap = {
  TrendingUp,
  FileText,
  Clock,
  CheckCircle,
  MapPin,
  Edit
};

export const MetricCard: React.FC<MetricCardProps> = ({ metric }) => {
  const IconComponent = iconMap[metric.icon as keyof typeof iconMap] || TrendingUp;
  
  const getTrendIcon = () => {
    switch (metric.trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      default:
        return <Minus className="w-4 h-4 text-gray-500" />;
    }
  };

  const getTrendColor = () => {
    switch (metric.trend) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
          <IconComponent className="w-7 h-7 text-blue-600" />
        </div>
        <div className="flex items-center space-x-1">
          {getTrendIcon()}
          <span className={`text-sm font-semibold ${getTrendColor()}`}>
            {Math.abs(metric.change)}%
          </span>
        </div>
      </div>
      
      <div>
        <h3 className="text-3xl font-bold text-gray-900 mb-1">{metric.value}</h3>
        <p className="text-sm font-medium text-gray-700 mb-1">{metric.title}</p>
        {metric.subtitle && (
          <p className="text-xs text-gray-500">{metric.subtitle}</p>
        )}
      </div>
    </div>
  );
};