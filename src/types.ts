export type ProficiencyLevel = 'Foundation' | 'Intermediate' | 'Proficient' | 'Expert';

export type CompetencyCategory = 'Functional' | 'Behavioral';

export type LNAWorkflowStatus =
  | 'PENDING EMPLOYEE SUBMISSION'
  | 'SUBMITTED FOR MANAGER REVIEW'
  | 'SENT BACK TO EMPLOYEE'
  | 'MANAGER APPROVED';

export interface Skill {
  id: string;
  name: string;
  code: string;
  description: string;
  category: CompetencyCategory;
  competencyId: string;
}

export interface Competency {
  id: string;
  name: string;
  code: string;
  category: CompetencyCategory;
  description: string;
  department?: string;
  division?: string;
  functional?: string;
  entity?: string;
  grade?: string;
  role?: string;
  proficiency?: ProficiencyLevel;
  recommendedCourse?: string;
  skills: Skill[];
}

export interface TrainingCourse {
  id: string;
  courseCode: string;
  title: string;
  provider: string;
  duration: string;
  deliveryMethod: 'Classroom' | 'E-Learning' | 'Blended' | 'Simulation' | 'Workshop';
  description: string;
}

export interface EmployeeProfile {
  name: string;
  employeeId: string;
  email: string;
  function?: string;
  reportingManager: string;
  position: string;
  division: string;
  department: string;
  grade: number;
  joinDate?: string;
  reviewPeriod?: string;
  section?: string;
  location?: string;
  entity?: string;
}

export interface SelectedCompetencyState {
  competencyId: string;
  selectedSkillId: string | null;
  employeeRemarks?: string;
}

export interface LNAAssessmentItem {
  competency: Competency;
  skill: Skill;
  idealProficiency: ProficiencyLevel;
  trainingCourse: TrainingCourse;
  employeeRemarks?: string;
  managerRemarks?: string;
}

export interface LNAChatMessage {
  id: string;
  sender: 'employee' | 'manager' | 'system';
  senderName: string;
  text: string;
  timestamp: string;
}

export interface LNAAssessmentSubmission {
  referenceNo: string;
  submissionDate: string;
  cycleYear?: string;
  employee: EmployeeProfile;
  selectedItems: LNAAssessmentItem[];
  comments: string;
  status: LNAWorkflowStatus;
  managerComments?: string;
  managerActionDate?: string;
  messages?: LNAChatMessage[];
}

export interface EmployeeLNAState {
  employee: EmployeeProfile;
  submission: LNAAssessmentSubmission | null;
}

export interface AssessmentReleaseRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  division: string;
  location: string;
  grade: number;
  position: string;
  cycleType: 'LNA' | 'PDP';
  releaseDate: string;
  deadlineDate: string;
  status: 'Released' | 'In Progress' | 'Submitted' | 'Approved';
  notificationSent: boolean;
}

export interface ReleaseEmployeeOutcome {
  employeeId: string;
  employeeName: string;
  department: string;
  status: 'Delivered' | 'Skipped' | 'Failed';
  reason?: string;
  details?: string;
}

export interface AssessmentReleaseRun {
  releaseId: string;
  releaseDate: string;
  cycleType: 'LNA';
  targetScope: string;
  totalEmployees: number;
  emailsSent: number;
  deadlineDate: string;
  status: 'Delivered' | 'In Progress' | 'Completed' | 'Sent';
  employeeIds: string[];
  remarks?: string;
  deliveredCount?: number;
  skippedCount?: number;
  failedCount?: number;
  outcomes?: ReleaseEmployeeOutcome[];
}

export interface SkippedEmployeeLna {
  employeeId: string;
  releaseId: string;
  reason: string;
  skippedDate: string;
  skippedBy: string;
  remarks?: string;
}

export interface ManagerDelegation {
  id: string;
  fromEmployeeId: string;
  fromName: string;
  fromRole?: string;
  fromDepartment?: string;
  fromAvatar?: string;
  toEmployeeId: string;
  toName: string;
  toRole?: string;
  toDepartment?: string;
  toAvatar?: string;
  type?: 'Temporary' | 'Permanent' | string;
  startDate: string;
  endDate?: string;
  status?: 'Active' | 'Inactive' | 'Expired';
  remarks?: string;
  createdAt?: string;
  createdBy?: string;
  entity?: 'GANS' | 'Eshara' | 'YHA' | string;
}
