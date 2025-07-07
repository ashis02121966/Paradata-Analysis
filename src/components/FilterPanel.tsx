import React from 'react';
import { Filter, X } from 'lucide-react';
import { FilterState } from '../types';

interface FilterPanelProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  surveys: string[];
  states: string[];
  fsus: string[];
  isOpen: boolean;
  onToggle: () => void;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  onFilterChange,
  surveys,
  states,
  fsus,
  isOpen,
  onToggle
}) => {
  const handleFilterChange = (key: keyof FilterState, value: string) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFilterChange({
      survey: 'All',
      state: 'All',
      district: 'All',
      timeRange: '30d',
      reviewLevel: 'All',
      fsu: 'All',
      dataQuality: 'All'
    });
  };

  if (!isOpen) {
    return (
      <button
        onClick={onToggle}
        className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 shadow-sm"
      >
        <Filter className="w-4 h-4" />
        <span>Filters</span>
      </button>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        <button
          onClick={onToggle}
          className="p-1 hover:bg-gray-100 rounded-lg transition-colors duration-200"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Survey
          </label>
          <select
            value={filters.survey}
            onChange={(e) => handleFilterChange('survey', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          >
            <option value="All">All Surveys</option>
            {surveys.map(survey => (
              <option key={survey} value={survey}>{survey}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            State
          </label>
          <select
            value={filters.state}
            onChange={(e) => handleFilterChange('state', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          >
            <option value="All">All States</option>
            {states.map(state => (
              <option key={state} value={state}>{state}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            FSU
          </label>
          <select
            value={filters.fsu}
            onChange={(e) => handleFilterChange('fsu', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          >
            <option value="All">All FSUs</option>
            {fsus.map(fsu => (
              <option key={fsu} value={fsu}>{fsu}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Review Level
          </label>
          <select
            value={filters.reviewLevel}
            onChange={(e) => handleFilterChange('reviewLevel', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          >
            <option value="All">All Levels</option>
            <option value="Supervisor">Supervisor Level</option>
            <option value="DS">DS Level</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Data Quality
          </label>
          <select
            value={filters.dataQuality}
            onChange={(e) => handleFilterChange('dataQuality', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          >
            <option value="All">All Quality</option>
            <option value="High">High (90%+)</option>
            <option value="Medium">Medium (70-89%)</option>
            <option value="Low">Low (&lt;70%)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Time Range
          </label>
          <select
            value={filters.timeRange}
            onChange={(e) => handleFilterChange('timeRange', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
        </div>

        <div className="flex items-end">
          <button
            onClick={clearFilters}
            className="w-full px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            Clear Filters
          </button>
        </div>
      </div>
    </div>
  );
};