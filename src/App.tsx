import React, { useState, useMemo } from 'react';
import { BarChart3, Filter, Download, RefreshCw, Database, MapPin, Home, ArrowLeft } from 'lucide-react';
import { MetricCard } from './components/MetricCard';
import { SurveyOverviewChart } from './components/SurveyOverviewChart';
import { SupervisorPerformanceChart } from './components/SupervisorPerformanceChart';
import { DSPerformanceChart } from './components/DSPerformanceChart';
import { ReviewStatusDistribution } from './components/ReviewStatusDistribution';
import { DetailedDataTable } from './components/DetailedDataTable';
import { FSUPerformanceChart } from './components/FSUPerformanceChart';
import { HouseholdDataTable } from './components/HouseholdDataTable';
import { ScrutinyChangesChart } from './components/ScrutinyChangesChart';
import { FilterPanel } from './components/FilterPanel';
import { DrilldownModal } from './components/DrilldownModal';
import { HouseholdDrilldownModal } from './components/HouseholdDrilldownModal';
import { FSUDrilldownModal } from './components/FSUDrilldownModal';
import { surveyData, supervisorPerformance, dsPerformance, overallMetrics, fsuData, householdData } from './data/mockData';
import { SurveyData, FilterState, HouseholdData, FSUData } from './types';

function App() {
  const [filters, setFilters] = useState<FilterState>({
    survey: 'All',
    state: 'All',
    district: 'All',
    timeRange: '30d',
    reviewLevel: 'All',
    fsu: 'All',
    dataQuality: 'All'
  });
  
  const [selectedItem, setSelectedItem] = useState<SurveyData | null>(null);
  const [selectedHousehold, setSelectedHousehold] = useState<HouseholdData | null>(null);
  const [selectedFSU, setSelectedFSU] = useState<FSUData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHouseholdModalOpen, setIsHouseholdModalOpen] = useState(false);
  const [isFSUModalOpen, setIsFSUModalOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentView, setCurrentView] = useState<'survey' | 'fsu' | 'household'>('survey');
  const [drilldownContext, setDrilldownContext] = useState<{
    surveyId?: string;
    fsuId?: string;
    breadcrumb: string[];
  }>({
    breadcrumb: ['All Surveys']
  });

  const surveys = useMemo(() => {
    return Array.from(new Set(surveyData.map(item => item.surveyName)));
  }, []);

  const states = useMemo(() => {
    return Array.from(new Set(surveyData.map(item => item.state)));
  }, []);

  const fsus = useMemo(() => {
    return Array.from(new Set(fsuData.map(item => item.fsuCode)));
  }, []);

  const filteredSurveyData = useMemo(() => {
    return surveyData.filter(item => {
      if (filters.survey !== 'All' && item.surveyName !== filters.survey) return false;
      if (filters.state !== 'All' && item.state !== filters.state) return false;
      return true;
    });
  }, [filters]);

  const filteredFSUData = useMemo(() => {
    return fsuData.filter(item => {
      if (drilldownContext.surveyId && item.surveyId !== drilldownContext.surveyId) return false;
      if (filters.survey !== 'All' && item.surveyName !== filters.survey) return false;
      if (filters.state !== 'All' && item.state !== filters.state) return false;
      if (filters.fsu !== 'All' && item.fsuCode !== filters.fsu) return false;
      if (filters.dataQuality !== 'All') {
        if (filters.dataQuality === 'High' && item.dataQualityScore < 90) return false;
        if (filters.dataQuality === 'Medium' && (item.dataQualityScore < 70 || item.dataQualityScore >= 90)) return false;
        if (filters.dataQuality === 'Low' && item.dataQualityScore >= 70) return false;
      }
      return true;
    });
  }, [filters, drilldownContext]);

  const filteredHouseholdData = useMemo(() => {
    return householdData.filter(item => {
      if (drilldownContext.fsuId && item.fsuId !== drilldownContext.fsuId) return false;
      if (drilldownContext.surveyId) {
        const fsu = fsuData.find(f => f.id === item.fsuId);
        if (fsu && fsu.surveyId !== drilldownContext.surveyId) return false;
      }
      if (filters.survey !== 'All' && item.surveyName !== filters.survey) return false;
      if (filters.state !== 'All' && item.state !== filters.state) return false;
      if (filters.fsu !== 'All' && item.fsuCode !== filters.fsu) return false;
      if (filters.dataQuality !== 'All') {
        if (filters.dataQuality === 'High' && item.dataQualityScore < 90) return false;
        if (filters.dataQuality === 'Medium' && (item.dataQualityScore < 70 || item.dataQualityScore >= 90)) return false;
        if (filters.dataQuality === 'Low' && item.dataQualityScore >= 70) return false;
      }
      return true;
    });
  }, [filters, drilldownContext]);

  const filteredSupervisorData = useMemo(() => {
    return supervisorPerformance.filter(item => {
      if (filters.state !== 'All' && item.state !== filters.state) return false;
      return true;
    });
  }, [filters]);

  const filteredDSData = useMemo(() => {
    return dsPerformance.filter(item => {
      if (filters.state !== 'All' && item.state !== filters.state) return false;
      return true;
    });
  }, [filters]);

  // Get all scrutiny changes from filtered household data
  const allScrutinyChanges = useMemo(() => {
    return filteredHouseholdData.flatMap(household => household.scrutinyChanges);
  }, [filteredHouseholdData]);

  const handleRowClick = (item: SurveyData) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleHouseholdClick = (item: HouseholdData) => {
    setSelectedHousehold(item);
    setIsHouseholdModalOpen(true);
  };

  const handleFSUClick = (item: FSUData) => {
    setSelectedFSU(item);
    setIsFSUModalOpen(true);
  };

  const handleSurveyDrilldown = (survey: SurveyData) => {
    setDrilldownContext({
      surveyId: survey.id,
      breadcrumb: ['All Surveys', survey.surveyName]
    });
    setCurrentView('fsu');
  };

  const handleFSUDrilldown = (fsu: FSUData) => {
    setDrilldownContext(prev => ({
      ...prev,
      fsuId: fsu.id,
      breadcrumb: [...prev.breadcrumb, fsu.fsuName]
    }));
    setCurrentView('household');
  };

  const handleBreadcrumbClick = (index: number) => {
    const newBreadcrumb = drilldownContext.breadcrumb.slice(0, index + 1);
    
    if (index === 0) {
      // Back to all surveys
      setDrilldownContext({ breadcrumb: ['All Surveys'] });
      setCurrentView('survey');
    } else if (index === 1) {
      // Back to FSU level for selected survey
      setDrilldownContext({
        surveyId: drilldownContext.surveyId,
        breadcrumb: newBreadcrumb
      });
      setCurrentView('fsu');
    }
  };

  const handleExport = () => {
    let csvContent = '';
    
    switch (currentView) {
      case 'survey':
        csvContent = [
          ['Survey Name', 'State', 'District', 'Total Records', 'Approved', 'Rejected', 'Under Supervisor Review', 'Under DS Review', 'Pending Correction', 'Efficiency %', 'FSU Count'],
          ...filteredSurveyData.map(item => [
            item.surveyName,
            item.state,
            item.district,
            item.totalRecords,
            item.recordsApproved,
            item.recordsRejected,
            item.recordsUnderSupervisorReview,
            item.recordsUnderDSReview,
            item.recordsPendingCorrection,
            ((item.recordsApproved / item.totalRecords) * 100).toFixed(1),
            item.fsuCount
          ])
        ].map(row => row.join(',')).join('\n');
        break;
      case 'fsu':
        csvContent = [
          ['FSU Code', 'FSU Name', 'State', 'District', 'Block', 'Village', 'Total Households', 'Approved', 'Rejected', 'Quality Score', 'Completeness', 'Enumerator'],
          ...filteredFSUData.map(item => [
            item.fsuCode,
            item.fsuName,
            item.state,
            item.district,
            item.block,
            item.village,
            item.totalHouseholds,
            item.householdsApproved,
            item.householdsRejected,
            item.dataQualityScore,
            item.completenessScore,
            item.enumeratorName
          ])
        ].map(row => row.join(',')).join('\n');
        break;
      case 'household':
        csvContent = [
          ['Household ID', 'Head of Household', 'FSU Code', 'State', 'Status', 'Quality Score', 'Completeness %', 'Critical Errors', 'Minor Errors', 'Data Changes', 'Enumerator'],
          ...filteredHouseholdData.map(item => [
            item.householdId,
            item.headOfHousehold,
            item.fsuCode,
            item.state,
            item.currentStatus,
            item.dataQualityScore,
            item.completenessPercentage,
            item.criticalErrors,
            item.minorErrors,
            item.scrutinyChanges.length,
            item.enumeratorName
          ])
        ].map(row => row.join(',')).join('\n');
        break;
    }

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `survey-scrutiny-${currentView}-data.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getViewTitle = () => {
    switch (currentView) {
      case 'survey': return 'Survey-wise Analysis';
      case 'fsu': return 'FSU-level Analysis';
      case 'household': return 'Household-level Analysis';
      default: return 'Survey Data Analysis';
    }
  };

  const getCurrentMetrics = () => {
    switch (currentView) {
      case 'fsu':
        const totalFSUs = filteredFSUData.length;
        const avgQuality = filteredFSUData.reduce((sum, fsu) => sum + fsu.dataQualityScore, 0) / totalFSUs || 0;
        const totalHouseholds = filteredFSUData.reduce((sum, fsu) => sum + fsu.totalHouseholds, 0);
        const approvedHouseholds = filteredFSUData.reduce((sum, fsu) => sum + fsu.householdsApproved, 0);
        
        return [
          {
            title: 'Total FSUs',
            value: totalFSUs.toString(),
            change: 0,
            trend: 'stable' as const,
            icon: 'MapPin',
            subtitle: 'In current selection'
          },
          {
            title: 'Avg Quality Score',
            value: `${avgQuality.toFixed(1)}%`,
            change: 0,
            trend: 'stable' as const,
            icon: 'CheckCircle',
            subtitle: 'Across all FSUs'
          },
          {
            title: 'Total Households',
            value: totalHouseholds.toLocaleString(),
            change: 0,
            trend: 'stable' as const,
            icon: 'FileText',
            subtitle: 'In selected FSUs'
          },
          {
            title: 'Approval Rate',
            value: `${((approvedHouseholds / totalHouseholds) * 100).toFixed(1)}%`,
            change: 0,
            trend: 'stable' as const,
            icon: 'TrendingUp',
            subtitle: 'Household approval'
          }
        ];
      
      case 'household':
        const totalHH = filteredHouseholdData.length;
        const avgHHQuality = filteredHouseholdData.reduce((sum, hh) => sum + hh.dataQualityScore, 0) / totalHH || 0;
        const approvedHH = filteredHouseholdData.filter(hh => hh.currentStatus === 'Approved').length;
        const totalChanges = filteredHouseholdData.reduce((sum, hh) => sum + hh.scrutinyChanges.length, 0);
        
        return [
          {
            title: 'Total Households',
            value: totalHH.toString(),
            change: 0,
            trend: 'stable' as const,
            icon: 'Home',
            subtitle: 'In current selection'
          },
          {
            title: 'Avg Quality Score',
            value: `${avgHHQuality.toFixed(1)}%`,
            change: 0,
            trend: 'stable' as const,
            icon: 'CheckCircle',
            subtitle: 'Across households'
          },
          {
            title: 'Approval Rate',
            value: `${((approvedHH / totalHH) * 100).toFixed(1)}%`,
            change: 0,
            trend: 'stable' as const,
            icon: 'TrendingUp',
            subtitle: 'Household approval'
          },
          {
            title: 'Data Changes',
            value: totalChanges.toString(),
            change: 0,
            trend: 'stable' as const,
            icon: 'Edit',
            subtitle: 'Total scrutiny changes'
          }
        ];
      
      default:
        return overallMetrics;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl">
                <Database className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Survey Data Scrutiny Dashboard</h1>
                <p className="text-sm text-gray-600">Field Data Review & Performance Analytics with FSU/Household Drill-down</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={handleExport}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-sm"
              >
                <Download className="w-4 h-4" />
                <span>Export Data</span>
              </button>
              
              <button className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-sm">
                <RefreshCw className="w-4 h-4" />
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb Navigation */}
        {drilldownContext.breadcrumb.length > 1 && (
          <div className="flex items-center space-x-2 mb-6">
            {drilldownContext.breadcrumb.map((crumb, index) => (
              <React.Fragment key={index}>
                {index > 0 && <span className="text-gray-400">/</span>}
                <button
                  onClick={() => handleBreadcrumbClick(index)}
                  className={`text-sm font-medium transition-colors duration-200 ${
                    index === drilldownContext.breadcrumb.length - 1
                      ? 'text-gray-900 cursor-default'
                      : 'text-blue-600 hover:text-blue-800 cursor-pointer'
                  }`}
                >
                  {crumb}
                </button>
              </React.Fragment>
            ))}
          </div>
        )}

        {/* Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {getCurrentMetrics().slice(0, 4).map((metric, index) => (
            <MetricCard key={index} metric={metric} />
          ))}
        </div>

        {/* View Toggle */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="flex bg-white rounded-lg shadow-sm border border-gray-200 p-1">
              <button
                onClick={() => {
                  setCurrentView('survey');
                  setDrilldownContext({ breadcrumb: ['All Surveys'] });
                }}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all duration-200 ${
                  currentView === 'survey' 
                    ? 'bg-blue-600 text-white shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                <span>Survey Level</span>
              </button>
              <button
                onClick={() => setCurrentView('fsu')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all duration-200 ${
                  currentView === 'fsu' 
                    ? 'bg-blue-600 text-white shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <MapPin className="w-4 h-4" />
                <span>FSU Level</span>
              </button>
              <button
                onClick={() => setCurrentView('household')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all duration-200 ${
                  currentView === 'household' 
                    ? 'bg-blue-600 text-white shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Home className="w-4 h-4" />
                <span>Household Level</span>
              </button>
            </div>
            <h2 className="text-xl font-semibold text-gray-900">{getViewTitle()}</h2>
          </div>

          {/* Back Button for drill-down views */}
          {drilldownContext.breadcrumb.length > 1 && (
            <button
              onClick={() => handleBreadcrumbClick(drilldownContext.breadcrumb.length - 2)}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="mb-8">
          <FilterPanel
            filters={filters}
            onFilterChange={setFilters}
            surveys={surveys}
            states={states}
            fsus={fsus}
            isOpen={isFilterOpen}
            onToggle={() => setIsFilterOpen(!isFilterOpen)}
          />
        </div>

        {/* Content based on current view */}
        {currentView === 'survey' && (
          <>
            {/* Main Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <div className="lg:col-span-2">
                <SurveyOverviewChart data={filteredSurveyData} />
              </div>
              <div>
                <ReviewStatusDistribution data={filteredSurveyData} />
              </div>
            </div>

            {/* Performance Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <SupervisorPerformanceChart data={filteredSupervisorData} />
              <DSPerformanceChart data={filteredDSData} />
            </div>

            {/* Detailed Table */}
            <DetailedDataTable 
              data={filteredSurveyData} 
              onRowClick={handleRowClick}
              onDrilldown={handleSurveyDrilldown}
            />
          </>
        )}

        {currentView === 'fsu' && (
          <>
            {/* FSU Performance Chart */}
            <div className="mb-8">
              <FSUPerformanceChart 
                data={filteredFSUData} 
                onFSUClick={handleFSUClick}
                onDrilldown={handleFSUDrilldown}
              />
            </div>

            {/* Scrutiny Changes Analysis */}
            {allScrutinyChanges.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Data Changes Analysis</h3>
                <ScrutinyChangesChart data={allScrutinyChanges} />
              </div>
            )}
          </>
        )}

        {currentView === 'household' && (
          <>
            {/* Household Data Table */}
            <HouseholdDataTable data={filteredHouseholdData} onRowClick={handleHouseholdClick} />
          </>
        )}

        {/* Drilldown Modals */}
        <DrilldownModal
          data={selectedItem}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />

        <FSUDrilldownModal
          data={selectedFSU}
          isOpen={isFSUModalOpen}
          onClose={() => setIsFSUModalOpen(false)}
        />

        <HouseholdDrilldownModal
          data={selectedHousehold}
          isOpen={isHouseholdModalOpen}
          onClose={() => setIsHouseholdModalOpen(false)}
        />
      </main>
    </div>
  );
}

export default App;