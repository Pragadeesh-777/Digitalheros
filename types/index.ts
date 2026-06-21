export interface DashboardStats {
  totalAnalyses: number;
  savedReportsCount: number;
  recentActivity: ActivityLog[];
}

export interface ActivityLog {
  id: string;
  type: 'interview' | 'resume' | 'cover-letter' | 'linkedin' | 'roadmap' | 'eligibility' | 'leetcode' | 'expense' | 'note';
  title: string;
  timestamp: string;
  description: string;
}

export interface SavedNote {
  id: string;
  title: string;
  content: string;
  category: 'interview' | 'resume' | 'cover-letter' | 'linkedin' | 'roadmap' | 'eligibility' | 'leetcode' | 'expense' | 'general';
  createdAt: string;
}

// Interview Answer Improver types
export interface InterviewInput {
  question: string;
  userAnswer: string;
}

export interface InterviewMetrics {
  wordCount: number;
  charCount: number;
  readingTime: number; // in seconds
  confidenceScore: number; // 0-100
  grammarScore: number; // 0-100
  clarityScore: number; // 0-100
  toneScore: number; // 0-100
}

export interface InterviewAnalysis {
  metrics: InterviewMetrics;
  strengths: string[];
  weaknesses: string[];
  missingKeywords: string[];
  suggestions: string[];
  enhancedAnswer: string;
}

// Resume ATS Scanner types
export interface ResumeAnalysis {
  atsScore: number;
  skillsDetected: string[];
  missingKeywords: string[];
  weakSections: string[];
  formattingQuality: 'Excellent' | 'Good' | 'Fair' | 'Needs Improvement';
  suggestedImprovements: string[];
}

// Cover Letter types
export interface CoverLetterInput {
  name: string;
  companyName: string;
  role: string;
  skills: string;
  experience: string;
}

// LinkedIn Post Generator types
export interface LinkedInInput {
  projectName: string;
  skillsUsed: string;
  problemSolved: string;
}

export interface LinkedInOutputs {
  emojiRich: string;
  shortVersion: string;
  longVersion: string;
}

// Placement Roadmap types
export interface RoadmapInput {
  branch: string;
  targetRole: string;
  availableHours: number;
}

export interface RoadmapPhase {
  title: string;
  duration: string;
  description: string;
  topics: string[];
  actionItems: string[];
}

export interface RoadmapOutput {
  title: string;
  phases: RoadmapPhase[];
}

// Placement Eligibility types
export interface EligibilityInput {
  cgpa: number;
  arrears: number;
  skills: string;
}

export interface EligibilityOutput {
  eligibleCategories: {
    serviceBased: boolean;
    productBased: boolean;
    startup: boolean;
  };
  eligibilityPercentage: number;
  missingRequirements: string[];
  suggestions: string[];
}

// LeetCode Study Planner types
export interface LeetCodeInput {
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Mixed';
  topics: string[];
  hoursAvailable: number;
}

export interface StudyTask {
  id: string;
  day: number;
  topic: string;
  problemName: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  completed: boolean;
}

export interface LeetCodePlan {
  id: string;
  title: string;
  tasks: StudyTask[];
  createdAt: string;
}

// Expense Splitter types
export interface Friend {
  id: string;
  name: string;
  paidAmount: number;
}

export interface ExpenseSettlement {
  from: string;
  to: string;
  amount: number;
}

export interface ExpenseSplitReport {
  totalAmount: number;
  sharePerPerson: number;
  settlements: ExpenseSettlement[];
}

// App Settings
export interface AppSettings {
  theme: 'light' | 'dark';
  sidebarCollapsed: boolean;
}
