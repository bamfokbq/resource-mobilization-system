// Dashboard-specific types and interfaces

export interface Survey {
  _id: string;
  projectInfo: ProjectInfo | null;
  organisationInfo: OrganisationInfo | null;
  status: 'draft' | 'submitted' | 'in-progress';
  submissionDate: string | null;
  lastUpdated: string | null;
  createdBy: CreatedBy | null;
}

export interface ProjectInfo {
  projectName: string;
  totalProjects: number;
  projectDescription: string;
  startDate: string;
  endDate: string;
  projectGoal: string;
  regions: string[];
  targetedNCDs: string[];
  fundingSource: string;
}

export interface OrganisationInfo {
  organisationName: string;
  region: string;
  sector: string;
  email: string;
  phone: string;
}

export interface CreatedBy {
  userId: string;
  userName: string;
}

export interface ActiveSurvey {
  id: string;
  title: string;
  progress: number;
  lastUpdated: string;
}

export interface DashboardMetrics {
  totalSurveys: number;
  completedSurveys: number;
  inProgressSurveys: number;
  avgCompletion: number;
  completionRate: number;
  totalUsers: number;
}

export interface SurveyMetric {
  month: string;
  submitted: number;
  draft: number;
  total: number;
}

export interface StatusData {
  name: string;
  value: number;
  color: string;
}

export interface ProgressData {
  step: string;
  completion: number;
  users: number;
}

export interface TimelineData {
  date: string;
  progress: number;
  target: number;
}

export interface PredictionData {
  date: string;
  actual: number | null;
  predicted: number;
  confidence: {
    lower: number;
    upper: number;
  };
  target: number;
}

export interface Milestone {
  date: string;
  label: string;
  value: number;
}

export interface DashboardData {
  userSurveys: Survey[];
  metrics: DashboardMetrics;
  surveyMetricsData: SurveyMetric[];
  statusData: StatusData[];
  progressData: ProgressData[];
  timelineData: TimelineData[];
  regionalData: any[];
  effortData: any[];
  predictionData: PredictionData[];
  milestones: Milestone[];
  projectedCompletion: number;
  timeToTarget: number;
  confidenceLevel: number;
  activeSurveys: ActiveSurvey[];
  analyticsData: any;
  userStats: any;
  predictiveData: any;
}

export interface ApiResult<T> {
  success: boolean;
  data?: T;
  message?: string;
}

export interface DraftResult {
  success: boolean;
  draft?: {
    formData?: {
      projectInfo?: {
        projectName?: string;
      };
    };
    progress?: number;
    lastSaved?: string;
  };
}
