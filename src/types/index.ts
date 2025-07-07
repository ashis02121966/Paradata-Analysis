export interface SurveyData {
  id: string;
  surveyName: string;
  state: string;
  district: string;
  totalRecords: number;
  recordsSubmitted: number;
  recordsUnderSupervisorReview: number;
  recordsUnderDSReview: number;
  recordsApproved: number;
  recordsRejected: number;
  recordsPendingCorrection: number;
  submissionDate: string;
  lastUpdated: string;
  fsuCount: number;
  householdCount: number;
}

export interface FSUData {
  id: string;
  fsuCode: string;
  fsuName: string;
  surveyId: string;
  surveyName: string;
  state: string;
  district: string;
  block: string;
  village: string;
  enumeratorId: string;
  enumeratorName: string;
  supervisorId: string;
  supervisorName: string;
  dsId: string;
  dsName: string;
  totalHouseholds: number;
  householdsSubmitted: number;
  householdsApproved: number;
  householdsRejected: number;
  householdsPendingCorrection: number;
  householdsUnderSupervisorReview: number;
  householdsUnderDSReview: number;
  dataQualityScore: number;
  completenessScore: number;
  consistencyScore: number;
  submissionDate: string;
  lastUpdated: string;
  scrutinyChanges: ScrutinyChange[];
}

export interface HouseholdData {
  id: string;
  householdId: string;
  fsuId: string;
  fsuCode: string;
  surveyName: string;
  state: string;
  district: string;
  headOfHousehold: string;
  householdSize: number;
  enumeratorId: string;
  enumeratorName: string;
  submissionDate: string;
  supervisorReviewDate?: string;
  dsReviewDate?: string;
  currentStatus: 'Submitted' | 'Under Supervisor Review' | 'Under DS Review' | 'Approved' | 'Rejected' | 'Pending Correction';
  supervisorComments?: string;
  dsComments?: string;
  dataQualityScore: number;
  completenessPercentage: number;
  criticalErrors: number;
  minorErrors: number;
  scrutinyChanges: ScrutinyChange[];
  originalData: Record<string, any>;
  revisedData: Record<string, any>;
}

export interface ScrutinyChange {
  id: string;
  fieldName: string;
  fieldLabel: string;
  originalValue: any;
  revisedValue: any;
  changeType: 'Correction' | 'Addition' | 'Deletion' | 'Validation';
  changeReason: string;
  changedBy: 'Supervisor' | 'DS';
  changeDate: string;
  severity: 'Critical' | 'Major' | 'Minor';
  impact: 'High' | 'Medium' | 'Low';
}

export interface SupervisorPerformance {
  id: string;
  supervisorName: string;
  supervisorId: string;
  state: string;
  district: string;
  totalAssigned: number;
  totalReviewed: number;
  totalApproved: number;
  totalRejected: number;
  avgReviewTime: number;
  qualityScore: number;
  pendingReviews: number;
  lastActive: string;
  fsusCovered: number;
  householdsReviewed: number;
  criticalErrorsFound: number;
  dataChangesInitiated: number;
}

export interface DSPerformance {
  id: string;
  dsName: string;
  dsId: string;
  state: string;
  totalAssigned: number;
  totalReviewed: number;
  totalApproved: number;
  totalRejected: number;
  totalSentBack: number;
  avgReviewTime: number;
  qualityScore: number;
  pendingReviews: number;
  lastActive: string;
  fsusCovered: number;
  householdsReviewed: number;
  criticalErrorsFound: number;
  dataChangesInitiated: number;
}

export interface MetricCard {
  title: string;
  value: string | number;
  change: number;
  trend: 'up' | 'down' | 'stable';
  icon: string;
  subtitle?: string;
}

export interface FilterState {
  survey: string;
  state: string;
  district: string;
  timeRange: string;
  reviewLevel: string;
  fsu: string;
  dataQuality: string;
}

export interface ChartData {
  name: string;
  value: number;
  [key: string]: any;
}