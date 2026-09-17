import React, { useState, useEffect } from 'react';
import { GansHeader } from './components/GansHeader';
import { GansSidebar } from './components/GansSidebar';
import { EmployeeDetailsSection } from './components/EmployeeDetailsSection';
import { CompetencySelectionSection } from './components/CompetencySelectionSection';
import { SelectedCompetenciesTable } from './components/SelectedCompetenciesTable';
import { CommentsSection } from './components/CommentsSection';
import { ValidationBanner } from './components/ValidationBanner';
import { SubmissionModal } from './components/SubmissionModal';
import { ManagerReviewView } from './components/ManagerReviewView';
import { HrDashboardView } from './components/HrDashboardView';
import { EmployeeDashboardView } from './components/EmployeeDashboardView';
import { HrEmployeeMasterView } from './components/HrEmployeeMasterView';
import { HrCompetencySkillsMasterView } from './components/HrCompetencySkillsMasterView';
import { HrReportsView } from './components/HrReportsView';
import { HrPdpDashboardView } from './components/HrPdpDashboardView';
import { HrReleaseAssessmentView } from './components/HrReleaseAssessmentView';
import { HrAssessmentHistoryView } from './components/HrAssessmentHistoryView';
import { HrDelegationView } from './components/HrDelegationView';
import {
  DEFAULT_EMPLOYEE,
  ALTERNATE_EMPLOYEES,
  FUNCTIONAL_COMPETENCIES,
  BEHAVIORAL_COMPETENCIES,
  getCompetencyById,
  determineIdealProficiency,
  determineMappedTrainingCourse,
  createDefaultPreloadedSubmission
} from './data/lnaData';
import {
  INITIAL_ORG_ASSESSMENTS,
  OrgAssessmentRecord
} from './data/orgAssessments';
import {
  EmployeeProfile,
  Competency,
  Skill,
  SelectedCompetencyState,
  LNAAssessmentSubmission,
  LNAChatMessage,
  LNAAssessmentItem,
  ProficiencyLevel,
  TrainingCourse,
  AssessmentReleaseRecord,
  AssessmentReleaseRun,
  ReleaseEmployeeOutcome,
  SkippedEmployeeLna,
  ManagerDelegation
} from './types';
import {
  Send,
  Calendar,
  Clock,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  FileText,
  Save,
  Lock,
  ArrowRight,
  ArrowLeft,
  LayoutDashboard
} from 'lucide-react';

export default function App() {
  // Active Role State: 'employee' | 'manager' | 'hr'
  const [activeRole, setActiveRole] = useState<'employee' | 'manager' | 'hr'>('employee');

  // Centralized Organization Assessment Records (Single Source of Truth across Employee, Manager, HR)
  const [orgRecords, setOrgRecords] = useState<OrgAssessmentRecord[]>(INITIAL_ORG_ASSESSMENTS);

  // Current active employee profile
  const [employee, setEmployee] = useState<EmployeeProfile>(DEFAULT_EMPLOYEE);

  // Left sidebar active navigation tab (Default landing page is employee dashboard)
  const [currentTab, setCurrentTab] = useState<string>('dashboard');

  // HR Master States
  const [hrEmployees, setHrEmployees] = useState<EmployeeProfile[]>(() => {
    const list = [...ALTERNATE_EMPLOYEES];
    INITIAL_ORG_ASSESSMENTS.forEach((r) => {
      if (!list.some((e) => e.employeeId === r.employee.employeeId)) {
        list.push(r.employee);
      }
    });
    return list;
  });

  const [hrCompetencies, setHrCompetencies] = useState<Competency[]>([
    ...FUNCTIONAL_COMPETENCIES,
    ...BEHAVIORAL_COMPETENCIES
  ]);

  // HR Employee Master Handlers
  const handleAddEmployee = (newEmp: EmployeeProfile) => {
    setHrEmployees((prev) => [newEmp, ...prev]);
    setOrgRecords((prev) => [
      {
        employee: newEmp,
        submission: null,
        status: 'PENDING EMPLOYEE SUBMISSION'
      },
      ...prev
    ]);
  };

  const handleImportEmployees = (imported: EmployeeProfile[]) => {
    setHrEmployees((prev) => {
      const existingIds = new Set(prev.map((e) => e.employeeId));
      const additions = imported.filter((e) => !existingIds.has(e.employeeId));
      return [...additions, ...prev];
    });
    setOrgRecords((prev) => {
      const existingIds = new Set(prev.map((r) => r.employee.employeeId));
      const additions: OrgAssessmentRecord[] = imported
        .filter((e) => !existingIds.has(e.employeeId))
        .map((emp) => ({
          employee: emp,
          submission: null,
          status: 'PENDING EMPLOYEE SUBMISSION'
        }));
      return [...additions, ...prev];
    });
  };

  const handleDeleteEmployee = (empId: string) => {
    setHrEmployees((prev) => prev.filter((e) => e.employeeId !== empId));
    setOrgRecords((prev) => prev.filter((r) => r.employee.employeeId !== empId));
  };

  const handleUpdateEmployee = (updatedEmp: EmployeeProfile) => {
    setHrEmployees((prev) => prev.map((e) => (e.employeeId === updatedEmp.employeeId ? updatedEmp : e)));
    setOrgRecords((prev) =>
      prev.map((r) => (r.employee.employeeId === updatedEmp.employeeId ? { ...r, employee: updatedEmp } : r))
    );
  };

  const handleSyncEmployees = () => {
    console.log('Employee database synchronized successfully with Enterprise HRMS');
  };

  // HR Competency Master Handlers
  const handleAddCompetency = (newComp: Competency) => {
    setHrCompetencies((prev) => [newComp, ...prev]);
  };

  const handleImportCompetencies = (imported: Competency[]) => {
    setHrCompetencies((prev) => {
      const existingIds = new Set(prev.map((c) => c.id));
      const additions = imported.filter((c) => !existingIds.has(c.id));
      return [...additions, ...prev];
    });
  };

  const handleDeleteCompetency = (compId: string) => {
    setHrCompetencies((prev) => prev.filter((c) => c.id !== compId));
  };

  // HR Skills Master Handlers
  const handleAddSkill = (competencyId: string, newSkill: Skill) => {
    setHrCompetencies((prev) =>
      prev.map((c) => {
        if (c.id === competencyId) {
          return {
            ...c,
            skills: [...c.skills, newSkill]
          };
        }
        return c;
      })
    );
  };

  const handleDeleteSkill = (competencyId: string, skillId: string) => {
    setHrCompetencies((prev) =>
      prev.map((c) => {
        if (c.id === competencyId) {
          return {
            ...c,
            skills: c.skills.filter((s) => s.id !== skillId)
          };
        }
        return c;
      })
    );
  };

  // HR Assessment Release Management State
  const [releasedAssessments, setReleasedAssessments] = useState<AssessmentReleaseRecord[]>([
    {
      id: 'REL-2026-001',
      employeeId: 'EMP00123',
      employeeName: 'Ravi Kumar',
      department: 'Operations',
      division: 'Retail',
      location: 'Abu Dhabi HQ / Operations',
      grade: 8,
      position: 'Store Manager',
      cycleType: 'LNA',
      releaseDate: '01/Aug/2026',
      deadlineDate: '31/Aug/2026',
      status: 'In Progress',
      notificationSent: true
    },
    {
      id: 'REL-2026-002',
      employeeId: 'EMP00124',
      employeeName: 'Priya Sharma',
      department: 'Sales',
      division: 'Retail',
      location: 'Dubai Branch Office',
      grade: 7,
      position: 'Sales Manager',
      cycleType: 'LNA',
      releaseDate: '01/Aug/2026',
      deadlineDate: '31/Aug/2026',
      status: 'Approved',
      notificationSent: true
    },
    {
      id: 'REL-2026-003',
      employeeId: 'EMP00125',
      employeeName: 'Mohammed Al Hashmi',
      department: 'IT',
      division: 'Technology',
      location: 'Abu Dhabi HQ / Technology Hub',
      grade: 6,
      position: 'Senior Systems Analyst',
      cycleType: 'LNA',
      releaseDate: '01/Aug/2026',
      deadlineDate: '31/Aug/2026',
      status: 'Submitted',
      notificationSent: true
    },
    {
      id: 'REL-2026-004',
      employeeId: 'EMP00126',
      employeeName: 'Fatima Al Mansoori',
      department: 'Finance',
      division: 'Corporate',
      location: 'Abu Dhabi HQ / Finance Dept',
      grade: 7,
      position: 'Financial Analyst',
      cycleType: 'LNA',
      releaseDate: '01/Aug/2026',
      deadlineDate: '31/Aug/2026',
      status: 'In Progress',
      notificationSent: true
    },
    {
      id: 'REL-2026-005',
      employeeId: 'EMP00127',
      employeeName: 'Ahmed Al Zaabi',
      department: 'HR',
      division: 'Human Capital',
      location: 'Abu Dhabi HQ / HR Dept',
      grade: 8,
      position: 'HR Business Partner',
      cycleType: 'LNA',
      releaseDate: '01/Aug/2026',
      deadlineDate: '31/Aug/2026',
      status: 'Approved',
      notificationSent: true
    }
  ]);

  const [releaseRuns, setReleaseRuns] = useState<AssessmentReleaseRun[]>([
    {
      releaseId: 'REL-2026-005',
      releaseDate: '01/Aug/2026',
      cycleType: 'LNA',
      targetScope: 'All Employees',
      totalEmployees: 14,
      emailsSent: 11,
      deliveredCount: 11,
      skippedCount: 2,
      failedCount: 1,
      deadlineDate: '31/Aug/2026',
      status: 'In Progress',
      employeeIds: ['EMP00123', 'EMP00124', 'EMP00125', 'EMP00126', 'EMP00127', 'EMP00128', 'EMP00129', 'EMP00130', 'EMP00131', 'EMP00132', 'EMP00133', 'EMP00134', 'EMP00135', 'EMP00136'],
      remarks: '11 Delivered, 2 Skipped, 1 Action Required',
      outcomes: [
        { employeeId: 'EMP00123', employeeName: 'Ravi Kumar', department: 'Retail Operations', status: 'Delivered', reason: 'Assessment Portal Activated & Notification Dispatched', details: 'Dispatched to ravi.kumar@gans.aero' },
        { employeeId: 'EMP00124', employeeName: 'Priya Sharma', department: 'Corporate Sales', status: 'Delivered', reason: 'Assessment Portal Activated & Notification Dispatched', details: 'Dispatched to priya.sharma@gans.aero' },
        { employeeId: 'EMP00125', employeeName: 'Arun Kumar', department: 'Finance & Treasury', status: 'Skipped', reason: 'Extended Annual Leave', details: 'Annual leave approved through mid-September 2026' },
        { employeeId: 'EMP00126', employeeName: 'Fatima Al-Mansouri', department: 'Procurement', status: 'Delivered', reason: 'Assessment Portal Activated & Notification Dispatched', details: 'Dispatched to fatima.almansouri@gans.aero' },
        { employeeId: 'EMP00127', employeeName: 'Zayd Al-Hashemi', department: 'Executive Office', status: 'Delivered', reason: 'Assessment Portal Activated & Notification Dispatched', details: 'Dispatched to zayd.alhashemi@gans.aero' },
        { employeeId: 'EMP00128', employeeName: 'Layla Mahmoud', department: 'IT Systems', status: 'Delivered', reason: 'Assessment Portal Activated & Notification Dispatched', details: 'Dispatched to layla.mahmoud@gans.aero' },
        { employeeId: 'EMP00129', employeeName: 'Tariq Bin Saeed', department: 'Air Traffic Operations', status: 'Delivered', reason: 'Assessment Portal Activated & Notification Dispatched', details: 'Dispatched to tariq.saeed@gans.aero' },
        { employeeId: 'EMP00130', employeeName: 'Mariam Al-Zaabi', department: 'Quality & Safety', status: 'Skipped', reason: 'Active Assessment Cycle Already in Progress', details: 'Currently under manager review. Duplicate release bypassed.' },
        { employeeId: 'EMP00131', employeeName: 'Omar Farooq', department: 'Security & Compliance', status: 'Delivered', reason: 'Assessment Portal Activated & Notification Dispatched', details: 'Dispatched to omar.farooq@gans.aero' },
        { employeeId: 'EMP00132', employeeName: 'Reem Al-Dhaheri', department: 'Talent Acquisition', status: 'Delivered', reason: 'Assessment Portal Activated & Notification Dispatched', details: 'Dispatched to reem.dhaheri@gans.aero' },
        { employeeId: 'EMP00133', employeeName: 'Rashid Al-Kindi', department: 'Logistics', status: 'Delivered', reason: 'Assessment Portal Activated & Notification Dispatched', details: 'Dispatched to rashid.kindi@gans.aero' },
        { employeeId: 'EMP00134', employeeName: 'Sara Al-Balooshi', department: 'Facilities', status: 'Delivered', reason: 'Assessment Portal Activated & Notification Dispatched', details: 'Dispatched to sara.balooshi@gans.aero' },
        { employeeId: 'EMP00135', employeeName: 'Khaled Sultan', department: 'Technical Maintenance', status: 'Delivered', reason: 'Assessment Portal Activated & Notification Dispatched', details: 'Dispatched to khaled.sultan@gans.aero' },
        { employeeId: 'EMP00136', employeeName: 'Hana Al-Suwaidi', department: 'Legal & Governance', status: 'Failed', reason: 'Missing Line Manager in HRMS Directory', details: 'Line manager unassigned in directory master' }
      ]
    },
    {
      releaseId: 'REL-2026-004',
      releaseDate: '15/Jul/2026',
      cycleType: 'LNA',
      targetScope: 'Operations & Retail Division',
      totalEmployees: 6,
      emailsSent: 4,
      deliveredCount: 4,
      skippedCount: 1,
      failedCount: 1,
      deadlineDate: '15/Aug/2026',
      status: 'Completed',
      employeeIds: ['EMP00123', 'EMP00124', 'EMP00129', 'EMP00130', 'EMP00135', 'EMP00136'],
      remarks: '4 Delivered, 1 Skipped, 1 Failed',
      outcomes: [
        { employeeId: 'EMP00123', employeeName: 'Ravi Kumar', department: 'Operations', status: 'Delivered', reason: 'Assessment Portal Activated & Notification Dispatched', details: 'Dispatched to ravi.kumar@gans.aero' },
        { employeeId: 'EMP00124', employeeName: 'Priya Sharma', department: 'Operations', status: 'Delivered', reason: 'Assessment Portal Activated & Notification Dispatched', details: 'Dispatched to priya.sharma@gans.aero' },
        { employeeId: 'EMP00129', employeeName: 'Salem Al Nuaimi', department: 'Operations', status: 'Delivered', reason: 'Assessment Portal Activated & Notification Dispatched', details: 'Dispatched to salem.nuaimi@gans.aero' },
        { employeeId: 'EMP00130', employeeName: 'Mariam Al-Zaabi', department: 'Operations', status: 'Skipped', reason: 'Active Assessment Cycle Already in Progress', details: 'Bypassed duplicate release' },
        { employeeId: 'EMP00135', employeeName: 'Khaled Sultan', department: 'Technical Maintenance', status: 'Delivered', reason: 'Assessment Portal Activated & Notification Dispatched', details: 'Dispatched to khaled.sultan@gans.aero' },
        { employeeId: 'EMP00136', employeeName: 'Hana Al-Suwaidi', department: 'Operations', status: 'Failed', reason: 'Missing Line Manager in HRMS Directory', details: 'Line manager unassigned in directory master' }
      ]
    },
    {
      releaseId: 'REL-2026-003',
      releaseDate: '01/Jul/2026',
      cycleType: 'LNA',
      targetScope: 'Technology & Systems Dept',
      totalEmployees: 5,
      emailsSent: 3,
      deliveredCount: 3,
      skippedCount: 1,
      failedCount: 1,
      deadlineDate: '31/Jul/2026',
      status: 'Completed',
      employeeIds: ['EMP00125', 'EMP00128', 'EMP00131', 'EMP00134', 'EMP00136'],
      remarks: '3 Delivered, 1 Skipped, 1 Failed',
      outcomes: [
        { employeeId: 'EMP00125', employeeName: 'Arun Kumar', department: 'IT', status: 'Delivered', reason: 'Assessment Portal Activated & Notification Dispatched', details: 'Dispatched to arun.kumar@gans.aero' },
        { employeeId: 'EMP00128', employeeName: 'Khalid Al Shamsi', department: 'IT', status: 'Delivered', reason: 'Assessment Portal Activated & Notification Dispatched', details: 'Dispatched to khalid.shamsi@gans.aero' },
        { employeeId: 'EMP00131', employeeName: 'Omar Farooq', department: 'IT', status: 'Delivered', reason: 'Assessment Portal Activated & Notification Dispatched', details: 'Dispatched to omar.farooq@gans.aero' },
        { employeeId: 'EMP00134', employeeName: 'Sara Al-Balooshi', department: 'IT', status: 'Skipped', reason: 'Extended Annual Leave', details: 'Approved annual leave until 28/Jul' },
        { employeeId: 'EMP00136', employeeName: 'Hana Al-Suwaidi', department: 'IT', status: 'Failed', reason: 'Missing Line Manager in HRMS Directory', details: 'Reporting manager unassigned' }
      ]
    },
    {
      releaseId: 'REL-2026-002',
      releaseDate: '15/Jun/2026',
      cycleType: 'LNA',
      targetScope: 'Finance & Human Capital Dept',
      totalEmployees: 5,
      emailsSent: 3,
      deliveredCount: 3,
      skippedCount: 1,
      failedCount: 1,
      deadlineDate: '15/Jul/2026',
      status: 'Completed',
      employeeIds: ['EMP00126', 'EMP00127', 'EMP00132', 'EMP00133', 'EMP00136'],
      remarks: '3 Delivered, 1 Skipped, 1 Failed',
      outcomes: [
        { employeeId: 'EMP00126', employeeName: 'Fatima Al Mansoori', department: 'Finance', status: 'Delivered', reason: 'Assessment Portal Activated & Notification Dispatched', details: 'Dispatched to fatima.mansoori@gans.aero' },
        { employeeId: 'EMP00127', employeeName: 'Ahmed Al Zaabi', department: 'Human Capital', status: 'Delivered', reason: 'Assessment Portal Activated & Notification Dispatched', details: 'Dispatched to ahmed.zaabi@gans.aero' },
        { employeeId: 'EMP00132', employeeName: 'Reem Al-Dhaheri', department: 'Human Capital', status: 'Delivered', reason: 'Assessment Portal Activated & Notification Dispatched', details: 'Dispatched to reem.dhaheri@gans.aero' },
        { employeeId: 'EMP00133', employeeName: 'Rashid Al-Kindi', department: 'Finance', status: 'Skipped', reason: 'Deputation / Secondment', details: 'Assigned to external aviation agency' },
        { employeeId: 'EMP00136', employeeName: 'Hana Al-Suwaidi', department: 'Finance', status: 'Failed', reason: 'Missing Line Manager in HRMS Directory', details: 'Unassigned manager in system' }
      ]
    },
    {
      releaseId: 'REL-2026-001',
      releaseDate: '01/Jun/2026',
      cycleType: 'LNA',
      targetScope: 'Senior Management & Leadership Pilot',
      totalEmployees: 4,
      emailsSent: 3,
      deliveredCount: 3,
      skippedCount: 1,
      failedCount: 0,
      deadlineDate: '30/Jun/2026',
      status: 'Completed',
      employeeIds: ['EMP00123', 'EMP00124', 'EMP00127', 'EMP00130'],
      remarks: '3 Delivered, 1 Skipped, 0 Failed',
      outcomes: [
        { employeeId: 'EMP00123', employeeName: 'Ravi Kumar', department: 'Executive', status: 'Delivered', reason: 'Assessment Portal Activated & Notification Dispatched', details: 'Dispatched to ravi.kumar@gans.aero' },
        { employeeId: 'EMP00124', employeeName: 'Priya Sharma', department: 'Executive', status: 'Delivered', reason: 'Assessment Portal Activated & Notification Dispatched', details: 'Dispatched to priya.sharma@gans.aero' },
        { employeeId: 'EMP00127', employeeName: 'Ahmed Al Zaabi', department: 'Executive', status: 'Delivered', reason: 'Assessment Portal Activated & Notification Dispatched', details: 'Dispatched to ahmed.zaabi@gans.aero' },
        { employeeId: 'EMP00130', employeeName: 'Mariam Al-Zaabi', department: 'Executive', status: 'Skipped', reason: 'Sabbatical / Study Leave', details: 'Executive leadership study program' }
      ]
    }
  ]);

  // Track employees skipped / exempted from LNA cycles by HR
  const [skippedEmployees, setSkippedEmployees] = useState<SkippedEmployeeLna[]>([
    {
      employeeId: 'EMP00125',
      releaseId: 'REL-2026-005',
      reason: 'Extended Annual Leave',
      skippedDate: '19/Aug/2026',
      skippedBy: 'HR Admin',
      remarks: 'Annual leave approved through mid-September 2026'
    }
  ]);

  const handleToggleSkipEmployee = (
    employeeId: string,
    releaseId: string,
    skip: boolean,
    reason: string = 'Employee Not Available',
    remarks?: string
  ) => {
    setSkippedEmployees((prev) => {
      if (skip) {
        const exists = prev.some((s) => s.employeeId === employeeId && s.releaseId === releaseId);
        if (exists) {
          return prev.map((s) =>
            s.employeeId === employeeId && s.releaseId === releaseId
              ? {
                  ...s,
                  reason,
                  remarks,
                  skippedDate: new Date()
                    .toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
                    .replace(/ /g, '/')
                }
              : s
          );
        }
        return [
          ...prev,
          {
            employeeId,
            releaseId,
            reason,
            remarks,
            skippedDate: new Date()
              .toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
              .replace(/ /g, '/'),
            skippedBy: 'HR Admin'
          }
        ];
      } else {
        return prev.filter((s) => !(s.employeeId === employeeId && s.releaseId === releaseId));
      }
    });

    // Also synchronize releaseRuns counts and outcome records for this run
    setReleaseRuns((prevRuns) =>
      prevRuns.map((r) => {
        if (r.releaseId === releaseId) {
          const newSkippedCount = skip ? (r.skippedCount || 0) + 1 : Math.max(0, (r.skippedCount || 0) - 1);
          const newDeliveredCount = skip ? Math.max(0, (r.deliveredCount || 0) - 1) : (r.deliveredCount || 0) + 1;
          const updatedOutcomes = r.outcomes?.map((o) => {
            if (o.employeeId === employeeId) {
              return {
                ...o,
                status: skip ? ('Skipped' as const) : ('Delivered' as const),
                reason: skip ? reason : 'Assessment Portal Activated & Email Notification Dispatched'
              };
            }
            return o;
          });
          return {
            ...r,
            skippedCount: newSkippedCount,
            deliveredCount: newDeliveredCount,
            outcomes: updatedOutcomes,
            remarks: `${newDeliveredCount} Delivered, ${newSkippedCount} Skipped, ${r.failedCount || 0} Action Required`
          };
        }
        return r;
      })
    );
  };

  // HR Manager Delegations State (Temporary / Permanent manager review delegation)
  const [delegations, setDelegations] = useState<ManagerDelegation[]>([
    {
      id: 'DEL-001',
      fromEmployeeId: 'EMP00124',
      fromName: 'Madhesh Maasi',
      fromRole: 'Air Traffic Controller',
      fromDepartment: 'Operations',
      toEmployeeId: 'EMP00130',
      toName: 'Mohan Raj',
      toRole: 'Senior ATC Specialist',
      toDepartment: 'Operations',
      type: 'Temporary',
      startDate: '2026-09-01',
      endDate: '2026-09-30',
      status: 'Active',
      remarks: 'Covering during overseas operational training',
      createdAt: '2026-09-01T08:30:00Z',
      createdBy: 'HR Admin'
    },
    {
      id: 'DEL-002',
      fromEmployeeId: 'EMP00124',
      fromName: 'Madhesh Maasi',
      fromRole: 'Air Traffic Controller',
      fromDepartment: 'Operations',
      toEmployeeId: 'EMP00123',
      toName: 'Suresh Nair',
      toRole: 'Operations Director',
      toDepartment: 'Management',
      type: 'Temporary',
      startDate: '2026-09-05',
      endDate: '2026-10-15',
      status: 'Active',
      remarks: 'Project assignment coverage',
      createdAt: '2026-09-05T09:00:00Z',
      createdBy: 'HR Admin'
    },
    {
      id: 'DEL-003',
      fromEmployeeId: 'EMP00129',
      fromName: 'Ram',
      fromRole: 'Systems Lead',
      fromDepartment: 'IT',
      toEmployeeId: 'EMP00123',
      toName: 'Suresh Nair',
      toRole: 'Operations Director',
      toDepartment: 'Management',
      startDate: '2026-08-15',
      endDate: '2026-11-30',
      status: 'Active',
      remarks: 'Systems restructuring coverage',
      createdAt: '2026-08-15T11:00:00Z',
      createdBy: 'HR Admin'
    },
    {
      id: 'DEL-004',
      fromEmployeeId: 'EMP00128',
      fromName: 'Mansoor Al Hammadi',
      fromRole: 'Division Head',
      fromDepartment: 'CEO Office',
      toEmployeeId: 'EMP00127',
      toName: 'Anita Rao',
      toRole: 'HR Director',
      toDepartment: 'Human Capital',
      type: 'Temporary',
      startDate: '2026-09-10',
      endDate: '2026-10-10',
      status: 'Active',
      remarks: 'Executive committee leave coverage',
      createdAt: '2026-09-02T14:20:00Z',
      createdBy: 'HR Admin'
    }
  ]);

  const handleAddDelegation = (newDel: Omit<ManagerDelegation, 'id' | 'createdAt'>) => {
    const item: ManagerDelegation = {
      ...newDel,
      id: `DEL-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setDelegations((prev) => [item, ...prev]);
  };

  const handleUpdateDelegation = (id: string, updated: Partial<ManagerDelegation>) => {
    setDelegations((prev) =>
      prev.map((d) => (d.id === id ? { ...d, ...updated } : d))
    );
  };

  const handleDeleteDelegation = (id: string) => {
    setDelegations((prev) => prev.filter((d) => d.id !== id));
  };

  const handleReleaseAssessments = (
    cycleType: 'LNA' | 'PDP',
    releaseType: 'Release All' | 'Release Selected',
    deadline: string,
    targetEmployeeIds: string[],
    notificationNote?: string
  ): AssessmentReleaseRun => {
    const todayFormatted = new Date()
      .toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      })
      .replace(/ /g, '/');

    let formattedDeadline = deadline;
    try {
      const parts = deadline.split('-');
      if (parts.length === 3) {
        const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
        formattedDeadline = d
          .toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
          })
          .replace(/ /g, '/');
      }
    } catch {
      formattedDeadline = deadline;
    }

    // Evaluate each employee outcome: Delivered, Skipped, or Failed
    const outcomes: ReleaseEmployeeOutcome[] = [];
    const successfullyDeliveredIds: string[] = [];

    targetEmployeeIds.forEach((empId) => {
      let emp = hrEmployees.find((e) => e.employeeId === empId);
      if (!emp) {
        const orgRec = orgRecords.find((r) => r.employee.employeeId === empId);
        if (orgRec) emp = orgRec.employee;
      }
      const empName = emp?.name || `Employee ${empId}`;
      const empDept = emp?.department || 'Operations';

      // 1. Validation Failures (Data gaps in HRMS)
      if (!emp) {
        outcomes.push({
          employeeId: empId,
          employeeName: empName,
          department: empDept,
          status: 'Failed',
          reason: 'Employee Record Not Found in HRMS Directory',
          details: 'Internal sync error: Record missing from directory master'
        });
        return;
      }

      if (!emp.reportingManager || emp.reportingManager.trim() === '' || emp.reportingManager.toLowerCase() === 'unassigned') {
        outcomes.push({
          employeeId: empId,
          employeeName: empName,
          department: empDept,
          status: 'Failed',
          reason: 'Missing Line Manager in HRMS Directory',
          details: 'Assessment cannot route without an assigned line manager'
        });
        return;
      }

      if (!emp.email || !emp.email.includes('@')) {
        outcomes.push({
          employeeId: empId,
          employeeName: empName,
          department: empDept,
          status: 'Failed',
          reason: 'Invalid or Unreachable Corporate Email Address',
          details: 'Notification delivery failed due to missing or invalid mailbox'
        });
        return;
      }

      // 2. Skipped Cases (Exemptions or already in-progress/submitted in active cycle)
      const isExempted = skippedEmployees.some((s) => s.employeeId === empId);
      if (isExempted) {
        const exemption = skippedEmployees.find((s) => s.employeeId === empId);
        outcomes.push({
          employeeId: empId,
          employeeName: empName,
          department: empDept,
          status: 'Skipped',
          reason: exemption?.reason || 'HR Exemption / On Approved Leave',
          details: exemption?.remarks || 'Exemption active in HR records'
        });
        return;
      }

      const existingRecord = orgRecords.find((r) => r.employee.employeeId === empId);
      if (existingRecord && (existingRecord.status === 'MANAGER APPROVED' || existingRecord.status === 'SUBMITTED FOR MANAGER REVIEW')) {
        outcomes.push({
          employeeId: empId,
          employeeName: empName,
          department: empDept,
          status: 'Skipped',
          reason: 'Active Assessment Cycle Already in Progress',
          details: `Current stage: ${existingRecord.status}. Duplicate release bypassed to protect in-flight data.`
        });
        return;
      }

      // 3. Successfully Delivered
      successfullyDeliveredIds.push(empId);
      outcomes.push({
        employeeId: empId,
        employeeName: empName,
        department: empDept,
        status: 'Delivered',
        reason: 'Assessment Portal Activated & Email Notification Dispatched',
        details: `Dispatched to ${emp.email}`
      });
    });

    const deliveredCount = outcomes.filter((o) => o.status === 'Delivered').length;
    const skippedCount = outcomes.filter((o) => o.status === 'Skipped').length;
    const failedCount = outcomes.filter((o) => o.status === 'Failed').length;

    // Create a new release run entry
    const nextRunNum = releaseRuns.length + 1;
    const newReleaseId = `REL-2026-${String(nextRunNum).padStart(3, '0')}`;
    const scopeLabel =
      releaseType === 'Release All' || targetEmployeeIds.length === hrEmployees.length
        ? `All Employees (${targetEmployeeIds.length})`
        : `Selected Employees (${targetEmployeeIds.length})`;

    const newRun: AssessmentReleaseRun = {
      releaseId: newReleaseId,
      releaseDate: todayFormatted,
      cycleType: 'LNA',
      targetScope: scopeLabel,
      totalEmployees: targetEmployeeIds.length,
      emailsSent: deliveredCount,
      deliveredCount,
      skippedCount,
      failedCount,
      deadlineDate: formattedDeadline,
      status: failedCount > 0 && deliveredCount === 0 ? 'In Progress' : 'Delivered',
      employeeIds: [...targetEmployeeIds],
      outcomes,
      remarks: `${deliveredCount} Delivered, ${skippedCount} Skipped, ${failedCount} Action Required`
    };

    setReleaseRuns((prev) => [newRun, ...prev]);

    // Only update released records for employees whose assessment was successfully delivered
    setReleasedAssessments((prev) => {
      const existingMap = new Map(prev.map((r) => [r.employeeId, r]));

      successfullyDeliveredIds.forEach((empId) => {
        const emp = hrEmployees.find((e) => e.employeeId === empId);
        if (emp) {
          const newRecord: AssessmentReleaseRecord = {
            id: newReleaseId,
            employeeId: emp.employeeId,
            employeeName: emp.name,
            department: emp.department,
            division: emp.division,
            location: emp.location || 'Abu Dhabi HQ',
            grade: emp.grade,
            position: emp.position,
            cycleType,
            releaseDate: todayFormatted,
            deadlineDate: formattedDeadline,
            status: 'Released',
            notificationSent: true
          };
          existingMap.set(empId, newRecord);
        }
      });

      return Array.from(existingMap.values());
    });

    return newRun;
  };

  const handleRevokeRelease = (employeeId: string) => {
    setReleasedAssessments((prev) => prev.filter((r) => r.employeeId !== employeeId));
  };

  // Selected employee ID in Manager View Approvals
  const [managerSelectedEmployeeId, setManagerSelectedEmployeeId] = useState<string | null>(null);

  // Selected competencies state: array of { competencyId, selectedSkillId }
  const [selectedCompetencies, setSelectedCompetencies] = useState<SelectedCompetencyState[]>([]);

  // Employee comments
  const [comments, setComments] = useState<string>('');

  // Validation error list
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Shared LNA Assessment Submission state for currently active employee
  const [submission, setSubmission] = useState<LNAAssessmentSubmission | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [showSubmissionModal, setShowSubmissionModal] = useState<boolean>(false);

  // Synchronize active employee's submission with orgRecords
  const syncRecordInOrg = (updatedSubmission: LNAAssessmentSubmission | null, emp: EmployeeProfile = employee) => {
    setOrgRecords((prev) => {
      const idx = prev.findIndex((r) => r.employee.employeeId === emp.employeeId);
      const newStatus = updatedSubmission ? updatedSubmission.status : 'PENDING EMPLOYEE SUBMISSION';
      const updatedRecord: OrgAssessmentRecord = {
        employee: emp,
        submission: updatedSubmission,
        status: newStatus
      };

      if (idx >= 0) {
        const next = [...prev];
        next[idx] = updatedRecord;
        return next;
      } else {
        return [...prev, updatedRecord];
      }
    });
  };

  // Dynamic Competencies based on Employee Division / Department / Grade
  const functionalList = FUNCTIONAL_COMPETENCIES;
  const behavioralList = BEHAVIORAL_COMPETENCIES;

  // Toggle Competency Selection (Checkbox)
  const handleToggleCompetency = (competency: Competency) => {
    // If approved, editing is locked
    if (submission?.status === 'MANAGER APPROVED') return;

    // Clear validation errors when user interacts
    if (validationErrors.length > 0) setValidationErrors([]);

    const exists = selectedCompetencies.find((s) => s.competencyId === competency.id);

    if (exists) {
      // Remove competency
      setSelectedCompetencies(selectedCompetencies.filter((s) => s.competencyId !== competency.id));
    } else {
      // Rule: Exactly 3 total competencies alone (not 3 from each type, totally 3)
      if (selectedCompetencies.length >= 3) {
        setValidationErrors(['You can select a maximum of 3 competencies in total. Please deselect one first.']);
        return;
      }

      // Add competency with default null skill and empty remarks
      setSelectedCompetencies([
        ...selectedCompetencies,
        { competencyId: competency.id, selectedSkillId: null, employeeRemarks: '' }
      ]);
    }
  };

  // Select Skill under a Competency
  const handleSelectSkill = (competencyId: string, skillId: string) => {
    if (submission?.status === 'MANAGER APPROVED') return;
    if (validationErrors.length > 0) setValidationErrors([]);

    setSelectedCompetencies((prev) =>
      prev.map((item) =>
        item.competencyId === competencyId
          ? { ...item, selectedSkillId: skillId || null }
          : item
      )
    );
  };

  // Remove a selected competency from the table
  const handleRemoveCompetency = (competencyId: string) => {
    if (submission?.status === 'MANAGER APPROVED') return;
    if (validationErrors.length > 0) setValidationErrors([]);
    setSelectedCompetencies(selectedCompetencies.filter((s) => s.competencyId !== competencyId));
  };

  // Update employee remarks for a selected competency
  const handleUpdateEmployeeRemarks = (competencyId: string, remarks: string) => {
    if (submission?.status === 'MANAGER APPROVED') return;
    setSelectedCompetencies((prev) =>
      prev.map((item) =>
        item.competencyId === competencyId
          ? { ...item, employeeRemarks: remarks }
          : item
      )
    );
  };

  // Reset Form
  const handleReset = () => {
    if (submission?.status === 'MANAGER APPROVED') return;
    if (window.confirm('Are you sure you want to reset your selections? All chosen competencies will be cleared.')) {
      setSelectedCompetencies([]);
      setComments('');
      setValidationErrors([]);
    }
  };

  // Submit Handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (submission?.status === 'MANAGER APPROVED') {
      return;
    }

    const errors: string[] = [];

    // Rule: Exactly up to 3 total competencies selected
    if (selectedCompetencies.length === 0) {
      errors.push('Please select at least one competency (up to 3 in total) to proceed with your LNA.');
    } else if (selectedCompetencies.length > 3) {
      errors.push(`You can select a maximum of 3 competencies in total. (Currently selected: ${selectedCompetencies.length})`);
    }

    // Rule: Exactly 1 skill selected for each chosen competency
    for (const item of selectedCompetencies) {
      const comp = getCompetencyById(item.competencyId);
      if (!item.selectedSkillId) {
        errors.push(`Please select one skill for competency "${comp?.name || 'Selected Competency'}".`);
      }
    }

    // Rule: Development thoughts must be entered before submitting
    if (!comments.trim()) {
      errors.push('Please enter your Development Thoughts before submitting your LNA.');
    }

    if (errors.length > 0) {
      setValidationErrors(errors);
      // Smooth scroll to validation banner
      window.scrollTo({ top: 120, behavior: 'smooth' });
      return;
    }

    // Construct submission object
    const finalItems = selectedCompetencies.map((item) => {
      const comp = getCompetencyById(item.competencyId)!;
      const skill = comp.skills.find((s) => s.id === item.selectedSkillId)!;
      const idealProficiency = determineIdealProficiency(employee.position, skill);
      const trainingCourse = determineMappedTrainingCourse(skill, idealProficiency, employee.position);

      return {
        competency: comp,
        skill,
        idealProficiency,
        trainingCourse,
        employeeRemarks: item.employeeRemarks || ''
      };
    });

    const currentMsgs = submission?.messages ? [...submission.messages] : [];
    if (comments.trim()) {
      // Record employee development thoughts in conversation thread
      currentMsgs.push({
        id: `msg-emp-${Date.now()}`,
        sender: 'employee',
        senderName: employee.name,
        text: comments.trim(),
        timestamp: new Date().toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        })
      });
    }

    const newSubmission: LNAAssessmentSubmission = {
      referenceNo: submission?.referenceNo || `REF/ESS/LNA/26-${Math.floor(1000 + Math.random() * 9000)}`,
      submissionDate: new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }),
      employee,
      selectedItems: finalItems,
      comments: comments.trim(),
      status: 'SUBMITTED FOR MANAGER REVIEW',
      managerComments: submission?.managerComments,
      messages: currentMsgs
    };

    setSubmission(newSubmission);
    setIsSubmitted(true);
    setShowSubmissionModal(true);
    syncRecordInOrg(newSubmission, employee);
  };

  // Send message in unified chatbox with persistent recording
  const handleSendMessage = (targetEmpId: string, text: string, senderRole: 'employee' | 'manager' = 'manager') => {
    if (!text || !text.trim()) return;

    setOrgRecords((prev) =>
      prev.map((rec) => {
        if (rec.employee.employeeId === targetEmpId) {
          const currentSub = rec.submission || createDefaultPreloadedSubmission(rec.employee);
          let currentMsgs = currentSub.messages && currentSub.messages.length > 0
            ? [...currentSub.messages]
            : [];

          // Preserve employee initial comments in the thread if not already present
          const hasEmployeeMsg = currentMsgs.some((m) => m.sender === 'employee');
          if (!hasEmployeeMsg && currentSub.comments && currentSub.comments.trim()) {
            currentMsgs.unshift({
              id: `msg-emp-init-${rec.employee.employeeId}`,
              sender: 'employee',
              senderName: rec.employee.name,
              text: currentSub.comments.trim(),
              timestamp: currentSub.submissionDate || 'Today'
            });
          }

          const senderName =
            senderRole === 'manager'
              ? (rec.employee.reportingManager || 'Reporting Manager')
              : rec.employee.name;

          const newMessage: LNAChatMessage = {
            id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
            sender: senderRole,
            senderName,
            text: text.trim(),
            timestamp: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) + ' today'
          };

          const updatedSub: LNAAssessmentSubmission = {
            ...currentSub,
            messages: [...currentMsgs, newMessage],
            managerComments: senderRole === 'manager' ? text.trim() : currentSub.managerComments
          };

          return {
            ...rec,
            submission: updatedSub
          };
        }
        return rec;
      })
    );

    if (targetEmpId === employee.employeeId) {
      setSubmission((prev) => {
        const baseSub = prev || createDefaultPreloadedSubmission(employee);
        let currentMsgs = baseSub.messages && baseSub.messages.length > 0
          ? [...baseSub.messages]
          : [];

        const hasEmployeeMsg = currentMsgs.some((m) => m.sender === 'employee');
        const empComment = (baseSub.comments || comments || '').trim();
        if (!hasEmployeeMsg && empComment) {
          currentMsgs.unshift({
            id: `msg-emp-init-${employee.employeeId}`,
            sender: 'employee',
            senderName: employee.name,
            text: empComment,
            timestamp: baseSub.submissionDate || 'Today'
          });
        }

        const senderName =
          senderRole === 'manager'
            ? (employee.reportingManager || 'Reporting Manager')
            : employee.name;

        const newMessage: LNAChatMessage = {
          id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          sender: senderRole,
          senderName,
          text: text.trim(),
          timestamp: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) + ' today'
        };

        return {
          ...baseSub,
          messages: [...currentMsgs, newMessage],
          managerComments: senderRole === 'manager' ? text.trim() : baseSub.managerComments
        };
      });
    }
  };

  // Manager Approve Handler for any employee
  const handleManagerApprove = (
    managerRemarks: string,
    targetEmpId?: string,
    competencyRemarksMap?: Record<string, string>
  ) => {
    const empId = targetEmpId || employee.employeeId;
    setOrgRecords((prev) =>
      prev.map((rec) => {
        if (rec.employee.employeeId === empId) {
          const currentSub = rec.submission || createDefaultPreloadedSubmission(rec.employee);
          const updatedItems = currentSub.selectedItems.map((item) => {
            if (competencyRemarksMap && competencyRemarksMap[item.competency.id]) {
              return { ...item, managerRemarks: competencyRemarksMap[item.competency.id] };
            }
            return item;
          });

          let updatedMsgs = currentSub.messages && currentSub.messages.length > 0
            ? [...currentSub.messages]
            : [];

          if (!updatedMsgs.some((m) => m.sender === 'employee') && currentSub.comments?.trim()) {
            updatedMsgs.unshift({
              id: `msg-emp-init-${rec.employee.employeeId}`,
              sender: 'employee',
              senderName: rec.employee.name,
              text: currentSub.comments.trim(),
              timestamp: currentSub.submissionDate || 'Today'
            });
          }

          if (managerRemarks && managerRemarks.trim()) {
            const lastMsg = updatedMsgs[updatedMsgs.length - 1];
            if (!lastMsg || lastMsg.text !== managerRemarks.trim() || lastMsg.sender !== 'manager') {
              updatedMsgs.push({
                id: `msg-mgr-${Date.now()}`,
                sender: 'manager',
                senderName: rec.employee.reportingManager || 'Reporting Manager',
                text: managerRemarks.trim(),
                timestamp: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) + ' today'
              });
            }
          }

          const updatedSub: LNAAssessmentSubmission = {
            ...currentSub,
            status: 'MANAGER APPROVED',
            selectedItems: updatedItems,
            managerComments: managerRemarks || currentSub.managerComments,
            messages: updatedMsgs,
            managerActionDate: new Date().toLocaleDateString('en-GB', {
              day: '2-digit',
              month: 'short',
              year: 'numeric'
            })
          };
          return {
            ...rec,
            status: 'MANAGER APPROVED',
            submission: updatedSub
          };
        }
        return rec;
      })
    );

    if (empId === employee.employeeId) {
      const current = submission || createDefaultPreloadedSubmission(employee);
      const updatedItems = current.selectedItems.map((item) => {
        if (competencyRemarksMap && competencyRemarksMap[item.competency.id]) {
          return { ...item, managerRemarks: competencyRemarksMap[item.competency.id] };
        }
        return item;
      });

      let updatedMsgs = current.messages && current.messages.length > 0
        ? [...current.messages]
        : [];

      if (!updatedMsgs.some((m) => m.sender === 'employee') && (current.comments?.trim() || comments?.trim())) {
        updatedMsgs.unshift({
          id: `msg-emp-init-${employee.employeeId}`,
          sender: 'employee',
          senderName: employee.name,
          text: (current.comments || comments).trim(),
          timestamp: current.submissionDate || 'Today'
        });
      }

      if (managerRemarks && managerRemarks.trim()) {
        const lastMsg = updatedMsgs[updatedMsgs.length - 1];
        if (!lastMsg || lastMsg.text !== managerRemarks.trim() || lastMsg.sender !== 'manager') {
          updatedMsgs.push({
            id: `msg-mgr-${Date.now()}`,
            sender: 'manager',
            senderName: employee.reportingManager || 'Reporting Manager',
            text: managerRemarks.trim(),
            timestamp: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) + ' today'
          });
        }
      }

      const updated: LNAAssessmentSubmission = {
        ...current,
        status: 'MANAGER APPROVED',
        selectedItems: updatedItems,
        managerComments: managerRemarks || current.managerComments,
        messages: updatedMsgs,
        managerActionDate: new Date().toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        })
      };
      setSubmission(updated);
    }
  };

  // Manager Resend to Employee Handler for any employee
  const handleManagerResend = (
    managerRemarks: string,
    targetEmpId?: string,
    competencyRemarksMap?: Record<string, string>
  ) => {
    const empId = targetEmpId || employee.employeeId;
    setOrgRecords((prev) =>
      prev.map((rec) => {
        if (rec.employee.employeeId === empId) {
          const currentSub = rec.submission || createDefaultPreloadedSubmission(rec.employee);
          const updatedItems = currentSub.selectedItems.map((item) => {
            if (competencyRemarksMap && competencyRemarksMap[item.competency.id]) {
              return { ...item, managerRemarks: competencyRemarksMap[item.competency.id] };
            }
            return item;
          });

          let updatedMsgs = currentSub.messages && currentSub.messages.length > 0
            ? [...currentSub.messages]
            : [];

          if (!updatedMsgs.some((m) => m.sender === 'employee') && currentSub.comments?.trim()) {
            updatedMsgs.unshift({
              id: `msg-emp-init-${rec.employee.employeeId}`,
              sender: 'employee',
              senderName: rec.employee.name,
              text: currentSub.comments.trim(),
              timestamp: currentSub.submissionDate || 'Today'
            });
          }

          if (managerRemarks && managerRemarks.trim()) {
            const lastMsg = updatedMsgs[updatedMsgs.length - 1];
            if (!lastMsg || lastMsg.text !== managerRemarks.trim() || lastMsg.sender !== 'manager') {
              updatedMsgs.push({
                id: `msg-mgr-${Date.now()}`,
                sender: 'manager',
                senderName: rec.employee.reportingManager || 'Reporting Manager',
                text: managerRemarks.trim(),
                timestamp: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) + ' today'
              });
            }
          }

          const updatedSub: LNAAssessmentSubmission = {
            ...currentSub,
            status: 'SENT BACK TO EMPLOYEE',
            selectedItems: updatedItems,
            managerComments: managerRemarks || currentSub.managerComments,
            messages: updatedMsgs,
            managerActionDate: new Date().toLocaleDateString('en-GB', {
              day: '2-digit',
              month: 'short',
              year: 'numeric'
            })
          };
          return {
            ...rec,
            status: 'SENT BACK TO EMPLOYEE',
            submission: updatedSub
          };
        }
        return rec;
      })
    );

    if (empId === employee.employeeId) {
      const current = submission || createDefaultPreloadedSubmission(employee);
      const updatedItems = current.selectedItems.map((item) => {
        if (competencyRemarksMap && competencyRemarksMap[item.competency.id]) {
          return { ...item, managerRemarks: competencyRemarksMap[item.competency.id] };
        }
        return item;
      });

      let updatedMsgs = current.messages && current.messages.length > 0
        ? [...current.messages]
        : [];

      if (!updatedMsgs.some((m) => m.sender === 'employee') && (current.comments?.trim() || comments?.trim())) {
        updatedMsgs.unshift({
          id: `msg-emp-init-${employee.employeeId}`,
          sender: 'employee',
          senderName: employee.name,
          text: (current.comments || comments).trim(),
          timestamp: current.submissionDate || 'Today'
        });
      }

      if (managerRemarks && managerRemarks.trim()) {
        const lastMsg = updatedMsgs[updatedMsgs.length - 1];
        if (!lastMsg || lastMsg.text !== managerRemarks.trim() || lastMsg.sender !== 'manager') {
          updatedMsgs.push({
            id: `msg-mgr-${Date.now()}`,
            sender: 'manager',
            senderName: employee.reportingManager || 'Reporting Manager',
            text: managerRemarks.trim(),
            timestamp: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) + ' today'
          });
        }
      }

      const updated: LNAAssessmentSubmission = {
        ...current,
        status: 'SENT BACK TO EMPLOYEE',
        selectedItems: updatedItems,
        managerComments: managerRemarks || current.managerComments,
        messages: updatedMsgs,
        managerActionDate: new Date().toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        })
      };
      setSubmission(updated);
      setIsSubmitted(false);
      // Populate employee workspace with the 3 competencies and comments for editing
      setSelectedCompetencies(
        current.selectedItems.map((item) => ({
          competencyId: item.competency.id,
          selectedSkillId: item.skill.id
        }))
      );
      setComments(current.comments || '');
    }
  };

  // Helper when employee changes in header
  const handleSwitchEmployee = (newEmp: EmployeeProfile) => {
    setEmployee(newEmp);
    setValidationErrors([]);
    
    // Check if new employee already has a submission record in the system
    const existing = orgRecords.find((r) => r.employee.employeeId === newEmp.employeeId);
    if (existing && existing.submission) {
      setSubmission(existing.submission);
      setIsSubmitted(true);
      setComments(existing.submission.comments || '');
      setSelectedCompetencies(
        existing.submission.selectedItems.map((item) => ({
          competencyId: item.competency.id,
          selectedSkillId: item.skill.id
        }))
      );
    } else {
      setSelectedCompetencies([]);
      setComments('');
      setSubmission(null);
      setIsSubmitted(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#edf2f7] flex flex-col font-sans text-slate-800 antialiased selection:bg-[#0275a8] selection:text-white">
      {/* 1. GANS Top Header */}
      <GansHeader
        employee={employee}
        activeRole={activeRole}
        onSwitchRole={(role) => {
          setActiveRole(role);
          if (role === 'manager') {
            setCurrentTab('dashboard');
            setManagerSelectedEmployeeId(null);
          } else if (role === 'hr') {
            setCurrentTab('hr-dashboard');
          } else {
            setCurrentTab('dashboard');
          }
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onSwitchEmployee={handleSwitchEmployee}
        availableEmployees={ALTERNATE_EMPLOYEES}
      />

      {/* Main Container with Left Sidebar & Content Area */}
      <div className="flex-1 flex flex-col md:flex-row w-full max-w-[1720px] mx-auto">
          {/* 2. Left GANS Navigation Sidebar */}
        <GansSidebar
          activeRole={activeRole}
          currentTab={currentTab}
          pendingApprovalsCount={orgRecords.filter((r) => r.status === 'SUBMITTED FOR MANAGER REVIEW').length}
          onSelectTab={(tab) => {
            if (tab === 'approvals') {
              setManagerSelectedEmployeeId(null);
            }
            setCurrentTab(tab);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />

        {/* 3. Main Workspace Area */}
        <main className="flex-1 p-3 sm:p-5 lg:p-6 overflow-x-hidden">
          
          {/* Check Active Role: HR View vs Approvals vs Employee/Self-Service Views */}
          {activeRole === 'hr' && currentTab.startsWith('hr-') ? (
            currentTab === 'hr-assessment-history' ? (
              <HrAssessmentHistoryView
                releaseRuns={releaseRuns}
                releasedList={releasedAssessments}
                employees={hrEmployees}
                orgRecords={orgRecords}
                skippedEmployees={skippedEmployees}
                onToggleSkipEmployee={handleToggleSkipEmployee}
                onRevokeRelease={handleRevokeRelease}
              />
            ) : currentTab === 'hr-employee-master' ? (
              <HrEmployeeMasterView
                employees={hrEmployees}
                onUpdateEmployee={handleUpdateEmployee}
                onSyncEmployees={handleSyncEmployees}
                onDeleteEmployee={handleDeleteEmployee}
                onReleaseAssessments={handleReleaseAssessments}
                releasedList={releasedAssessments}
                skippedEmployees={skippedEmployees}
                onNavigateToHistory={() => setCurrentTab('hr-assessment-history')}
              />
            ) : currentTab === 'hr-release-assessment' ? (
              <HrReleaseAssessmentView
                employees={hrEmployees}
                orgRecords={orgRecords}
                onReleaseAssessments={handleReleaseAssessments}
                releasedList={releasedAssessments}
                skippedEmployees={skippedEmployees}
                onRevokeRelease={handleRevokeRelease}
                onNavigateToHistory={() => setCurrentTab('hr-assessment-history')}
              />
            ) : currentTab === 'hr-competency-skills-master' || currentTab === 'hr-competency-master' || currentTab === 'hr-skills-master' ? (
              <HrCompetencySkillsMasterView
                competencies={hrCompetencies}
                onAddCompetency={handleAddCompetency}
                onImportCompetencies={handleImportCompetencies}
                onDeleteCompetency={handleDeleteCompetency}
                onAddSkill={handleAddSkill}
                onDeleteSkill={handleDeleteSkill}
              />
            ) : currentTab === 'hr-reports' ? (
              <HrReportsView records={orgRecords} />
            ) : currentTab === 'hr-delegation' ? (
              <HrDelegationView
                delegations={delegations}
                employees={hrEmployees}
                onAddDelegation={handleAddDelegation}
                onUpdateDelegation={handleUpdateDelegation}
                onDeleteDelegation={handleDeleteDelegation}
              />
            ) : currentTab === 'hr-lna-dashboard' ? (
              <EmployeeDashboardView
                employee={employee}
                submission={submission}
                onNavigateToLna={() => {
                  setCurrentTab('my-lna');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            ) : currentTab === 'hr-pdp-dashboard' ? (
              <HrPdpDashboardView records={orgRecords} />
            ) : (
              <HrDashboardView
                records={orgRecords}
                onSwitchRole={setActiveRole}
                onViewEmployeeDetail={(empId) => {
                  setManagerSelectedEmployeeId(empId);
                  setCurrentTab('approvals');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            )
          ) : (activeRole === 'manager' || activeRole === 'hr') && currentTab === 'approvals' ? (
            <ManagerReviewView
              submission={submission}
              employee={employee}
              orgRecords={orgRecords}
              delegations={delegations}
              onApproveEmployee={(empId, remarks, compRemarks) => handleManagerApprove(remarks, empId, compRemarks)}
              onResendEmployee={(empId, remarks, compRemarks) => handleManagerResend(remarks, empId, compRemarks)}
              selectedEmployeeId={managerSelectedEmployeeId}
              onSelectEmployee={(empId) => {
                setManagerSelectedEmployeeId(empId);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onSendMessage={(empId, text, role) => handleSendMessage(empId, text, role || (activeRole === 'hr' ? 'manager' : activeRole))}
              currentTab={currentTab}
              onSelectTab={setCurrentTab}
              activeRole={activeRole}
            />
          ) : currentTab === 'dashboard' ? (
            <EmployeeDashboardView
              employee={employee}
              submission={submission}
              onNavigateToLna={() => {
                setCurrentTab('my-lna');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          ) : currentTab === 'pdp-dashboard' ? (
            <div className="rounded-2xl bg-white/85 backdrop-blur-xl border border-white/80 p-6 sm:p-7 shadow-[0_8px_30px_rgb(26,80,117,0.05)]">
              <div className="flex items-center justify-between border-b border-slate-200/80 pb-4 mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-sky-50 rounded-xl flex items-center justify-center border border-sky-200 shadow-2xs">
                    <LayoutDashboard className="w-5 h-5 text-[#1a5075]" />
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-black text-[#1a5075] tracking-tight">
                      Personal Development Plan (PDP) – Assessment
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Overview of development goals, training milestones, and quarterly reviews.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setCurrentTab('dashboard')}
                  className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer flex items-center gap-1.5 transition-all shadow-2xs active:scale-95"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Go to LNA Dashboard</span>
                </button>
              </div>

              <div className="bg-gradient-to-r from-sky-50/80 to-[#f0f6fa] border border-sky-200/80 p-5 rounded-2xl text-xs text-slate-700 space-y-3 shadow-2xs">
                <div className="font-extrabold text-[#1a5075] text-sm">
                  Personal Development Plan (PDP)
                </div>
                <p className="leading-relaxed">
                  The PDP dashboard will display individual development objectives, target completion timelines, and mapped courses once your 2026 Learning Needs Analysis (LNA) has been approved by your Reporting Manager.
                </p>
                <div className="pt-2 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setCurrentTab('my-lna')}
                    className="px-4 py-2 bg-gradient-to-r from-[#1a5075] to-[#0275a8] hover:from-[#154668] hover:to-[#02628d] text-white text-xs font-extrabold rounded-xl cursor-pointer shadow-md shadow-sky-900/15 transition-all active:scale-95"
                  >
                    Go to My LNA Assessment
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentTab('dashboard')}
                    className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl cursor-pointer transition-all shadow-2xs"
                  >
                    Back to LNA Dashboard
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Employee View Alerts if Manager sent back or approved */}
              {submission?.status === 'SENT BACK TO EMPLOYEE' && (
                <div className="mb-4 bg-amber-50/90 border border-amber-300/80 p-4 sm:p-5 rounded-2xl text-xs text-amber-950 flex items-start gap-3.5 shadow-sm">
                  <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center border border-amber-300 shrink-0 mt-0.5">
                    <RotateCcw className="w-4 h-4 text-amber-700" />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h4 className="font-extrabold text-amber-900 text-sm tracking-tight">
                        Assessment Returned by Manager for Revisions
                      </h4>
                      <span className="bg-amber-200/90 text-amber-950 border border-amber-300 px-2.5 py-0.5 rounded-full font-extrabold text-[10px]">
                        STATUS: SENT BACK TO EMPLOYEE
                      </span>
                    </div>
                    <p className="mt-1 text-amber-900/90 leading-relaxed">
                      Your reporting manager (<strong>{employee.reportingManager}</strong>) reviewed your submission and requested changes before approval. Please update your competency selections or comments below and click <strong>Submit LNA Assessment</strong> again.
                    </p>
                    {submission.managerComments && (
                      <div className="mt-3 p-3 bg-white/95 border border-amber-200/80 rounded-xl text-slate-800 shadow-2xs">
                        <strong className="text-amber-900 block mb-0.5 font-extrabold">Manager Feedback / Remarks:</strong>
                        <p className="whitespace-pre-wrap">{submission.managerComments}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {submission?.status === 'SUBMITTED FOR MANAGER REVIEW' && (
                <div className="mb-4 bg-emerald-50/90 border border-emerald-300/80 p-3.5 sm:p-4 rounded-2xl text-xs text-slate-800 flex items-center justify-between gap-3 shadow-sm">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center border border-emerald-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                    </div>
                    <h4 className="font-extrabold text-emerald-900 text-xs sm:text-sm">
                      LNA Assessment Submitted Successfully
                    </h4>
                  </div>
                  <span className="text-[11px] text-slate-600 font-bold bg-white/80 px-2.5 py-1 rounded-lg border border-slate-200">
                    Ref: {submission.referenceNo}
                  </span>
                </div>
              )}

              {submission?.status === 'MANAGER APPROVED' && (
                <div className="mb-4 bg-emerald-50/90 border border-emerald-300/80 p-4 sm:p-5 rounded-2xl text-xs text-emerald-950 flex items-start gap-3.5 shadow-sm">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center border border-emerald-300 shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h4 className="font-extrabold text-emerald-900 text-sm tracking-tight">
                        Assessment Approved
                      </h4>
                      <span className="bg-emerald-200/90 text-emerald-950 border border-emerald-300 px-2.5 py-0.5 rounded-full font-extrabold text-[10px]">
                        STATUS: APPROVED
                      </span>
                    </div>
                    <p className="mt-1 text-emerald-900/90 leading-relaxed">
                      Your Learning Needs Analysis has been officially approved and endorsed by <strong>{employee.reportingManager}</strong>.
                    </p>
                    {submission.managerComments && (
                      <div className="mt-3 p-3 bg-white/95 border border-emerald-200/80 rounded-xl text-slate-800 shadow-2xs">
                        <strong className="text-emerald-900 block mb-0.5 font-extrabold">Approval Remarks:</strong>
                        <p className="whitespace-pre-wrap">{submission.managerComments}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Non-LNA Tab Fallback Views */}
              {currentTab === 'lna-history' ? (
                <div className="rounded-2xl bg-white/85 backdrop-blur-xl border border-white/80 p-6 sm:p-7 shadow-[0_8px_30px_rgb(26,80,117,0.05)]">
                  <div className="flex items-center justify-between border-b border-slate-200/80 pb-3 mb-4">
                    <h2 className="text-base font-black text-[#1a5075] flex items-center gap-2">
                      <Clock className="w-5 h-5 text-[#0275a8]" />
                      LNA Assessment History
                    </h2>
                    <button
                      type="button"
                      onClick={() => setCurrentTab('dashboard')}
                      className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer flex items-center gap-1.5 transition-all shadow-2xs"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Back to Dashboard</span>
                    </button>
                  </div>
                  <div className="border border-slate-200/80 rounded-xl overflow-hidden shadow-2xs">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#f0f7fb]/90 backdrop-blur-xs text-[#1a5075] border-b border-[#c8d8e5] font-extrabold uppercase tracking-wider text-[11px]">
                        <tr>
                          <th className="p-3 text-center">Year</th>
                          <th className="p-3 text-center">Assessment Title</th>
                          <th className="p-3 text-center">Submission Date</th>
                          <th className="p-3 text-center">Stage</th>
                          <th className="p-3 text-center">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 bg-white/80">
                        <tr className="hover:bg-sky-50/50 transition-colors">
                          <td className="p-3 font-bold text-[#1a5075] text-center">2026</td>
                          <td className="p-3 text-center">
                            <button
                              type="button"
                              onClick={() => setCurrentTab('lna-assessment')}
                              className="text-[#0275a8] hover:underline font-extrabold text-center cursor-pointer"
                            >
                              2026 Annual LNA Assessment
                            </button>
                          </td>
                          <td className="p-3 text-slate-600 font-medium text-center">
                            {submission ? submission.submissionDate : 'In Progress'}
                          </td>
                          <td className="p-3 text-slate-700 font-semibold text-center">
                            {submission ? 'Manager Review' : 'Self-Assessment'}
                          </td>
                          <td className="p-3 text-center">
                            <span
                              className={`px-2.5 py-0.5 rounded-full font-extrabold text-[11px] border ${
                                submission?.status === 'MANAGER APPROVED'
                                  ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                                  : submission?.status === 'SENT BACK TO EMPLOYEE'
                                  ? 'bg-amber-100 text-amber-800 border-amber-200'
                                  : submission?.status === 'SUBMITTED FOR MANAGER REVIEW'
                                  ? 'bg-sky-100 text-sky-800 border-sky-200'
                                  : 'bg-slate-100 text-slate-700 border-slate-200'
                              }`}
                            >
                              {submission?.status || 'In Progress'}
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="mt-5 flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setCurrentTab('my-lna')}
                      className="px-4 py-2 bg-gradient-to-r from-[#1a5075] to-[#0275a8] hover:from-[#154668] hover:to-[#02628d] text-white text-xs font-extrabold rounded-xl cursor-pointer shadow-md shadow-sky-900/15 transition-all"
                    >
                      Go to My LNA Assessment
                    </button>
                    <button
                      type="button"
                      onClick={() => setCurrentTab('dashboard')}
                      className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl cursor-pointer transition-all shadow-2xs"
                    >
                      Return to Dashboard
                    </button>
                  </div>
                </div>
              ) : currentTab !== 'my-lna' ? (
                <div className="rounded-2xl bg-white/85 backdrop-blur-xl border border-white/80 p-8 shadow-[0_8px_30px_rgb(26,80,117,0.05)] text-center py-12">
                  <FileText className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                  <h3 className="text-sm font-extrabold text-slate-700 uppercase">Module Notice</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    You are viewing the Employee Self-Service portal.
                  </p>
                  <div className="mt-4 flex items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => setCurrentTab('dashboard')}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer transition-all"
                    >
                      Go to Dashboard
                    </button>
                    <button
                      type="button"
                      onClick={() => setCurrentTab('my-lna')}
                      className="px-4 py-2 bg-gradient-to-r from-[#1a5075] to-[#0275a8] text-white text-xs font-extrabold rounded-xl cursor-pointer shadow-md transition-all"
                    >
                      Go to My LNA Assessment
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {/* PAGE TITLE & HEADER BAR */}
                  <div className="mb-5 rounded-2xl bg-white/85 backdrop-blur-xl border border-white/80 p-5 sm:p-6 shadow-[0_8px_30px_rgb(26,80,117,0.05)] flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <button
                          type="button"
                          onClick={() => {
                            setCurrentTab('dashboard');
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-[#0275a8] hover:text-[#1a5075] hover:underline cursor-pointer"
                        >
                          <ArrowLeft className="w-3.5 h-3.5" />
                          <span>Back to Dashboard</span>
                        </button>
                        <span className="text-slate-300">•</span>
                        <span className="text-[11px] font-bold text-slate-500">2026 Cycle</span>
                      </div>
                      <h1 className="text-lg sm:text-xl font-black text-[#1a5075] tracking-tight">
                        Learning Needs Analysis (LNA)
                      </h1>
                      <p className="text-xs text-slate-600 mt-0.5">
                        Please complete your LNA to help us understand your learning and development needs.
                      </p>
                    </div>

                    {/* Right Status Banner */}
                    <div className="flex flex-wrap items-center gap-2.5 self-start md:self-auto shrink-0 text-xs">
                      <div className="bg-white/90 border border-slate-200/80 px-3.5 py-1.5 rounded-xl flex items-center gap-2 shadow-2xs">
                        <span className="text-slate-500 font-semibold text-[11px]">LNA Status:</span>
                        {submission ? (
                          submission.status === 'MANAGER APPROVED' ? (
                            <span className="bg-emerald-100 text-emerald-900 border border-emerald-300 font-extrabold px-2.5 py-0.5 rounded-full text-[10px] flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                              MANAGER APPROVED
                            </span>
                          ) : submission.status === 'SENT BACK TO EMPLOYEE' ? (
                            <span className="bg-amber-100 text-amber-900 border border-amber-300 font-extrabold px-2.5 py-0.5 rounded-full text-[10px] flex items-center gap-1">
                              <RotateCcw className="w-3 h-3 text-amber-700" />
                              SENT BACK TO EMPLOYEE
                            </span>
                          ) : (
                            <span className="bg-sky-100 text-[#0275a8] border border-sky-300 font-extrabold px-2.5 py-0.5 rounded-full text-[10px] flex items-center gap-1">
                              <Clock className="w-3 h-3 text-[#0275a8]" />
                              SUBMITTED FOR REVIEW
                            </span>
                          )
                        ) : (
                          <span className="bg-amber-50 text-amber-900 border border-amber-200 font-extrabold px-2.5 py-0.5 rounded-full text-[10px] flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                            In Progress
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* VALIDATION ERRORS BANNER */}
                  <ValidationBanner
                    errors={validationErrors}
                    onDismiss={() => setValidationErrors([])}
                  />

                  {/* FORM CONTAINER */}
                  <div className="space-y-6">
                    
                    {/* SECTION 1 – EMPLOYEE DETAILS */}
                    <EmployeeDetailsSection employee={employee} />

                    {/* SECTION 2 – COMPETENCY SELECTION */}
                    <CompetencySelectionSection
                      functionalCompetencies={functionalList}
                      behavioralCompetencies={behavioralList}
                      selectedCompetencies={selectedCompetencies}
                      onToggleCompetency={handleToggleCompetency}
                    />

                    {/* INTERACTIVE TABLE: SELECTED COMPETENCIES, SKILL SELECTION, IDEAL PROFICIENCY & TRAINING COURSE */}
                    <SelectedCompetenciesTable
                      selectedCompetencies={selectedCompetencies}
                      employee={employee}
                      onSelectSkill={handleSelectSkill}
                      onRemoveCompetency={handleRemoveCompetency}
                      onUpdateEmployeeRemarks={handleUpdateEmployeeRemarks}
                    />

                    {/* SECTION 3 – COMMENTS (UNIFIED CHATBOX) */}
                    <CommentsSection
                      comments={comments}
                      onChangeComments={(val) => {
                        if (submission?.status !== 'MANAGER APPROVED') {
                          setComments(val);
                        }
                      }}
                      messages={submission?.messages || []}
                      onSendMessage={(text, role) => handleSendMessage(employee.employeeId, text, role || 'employee')}
                      employeeName={employee.name}
                      reportingManagerName={employee.reportingManager || 'Reporting Manager'}
                      isReadOnly={submission?.status === 'MANAGER APPROVED'}
                    />
                    {/* SUBMISSION ACTION BAR */}
                    <div className="rounded-2xl bg-white/90 backdrop-blur-xl border border-white/90 p-4 sm:p-5 shadow-[0_-4px_24px_rgba(26,80,117,0.08)] flex flex-col sm:flex-row items-center justify-end gap-3 sticky bottom-4 z-20">
                      <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                        {/* Reset / Cancel Button */}
                        {submission?.status !== 'MANAGER APPROVED' && (
                          <button
                            type="button"
                            onClick={handleReset}
                            className="px-4 py-2.5 border border-slate-200 hover:bg-slate-100/80 text-slate-700 font-bold rounded-xl text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs active:scale-95"
                          >
                            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                            <span>Reset Form</span>
                          </button>
                        )}

                        {/* Submit / Resubmit LNA Assessment Button */}
                        {submission?.status !== 'MANAGER APPROVED' && (
                          <button
                            type="button"
                            onClick={handleSubmit}
                            className="px-6 py-2.5 bg-gradient-to-r from-[#1a5075] to-[#0275a8] hover:from-[#154668] hover:to-[#02628d] text-white font-extrabold rounded-xl text-xs transition-all shadow-md shadow-sky-900/20 flex items-center gap-2 cursor-pointer active:scale-95"
                          >
                            <Send className="w-3.5 h-3.5 text-white" />
                            <span>
                              {submission?.status === 'SENT BACK TO EMPLOYEE'
                                ? 'Resubmit LNA'
                                : 'Submit LNA'}
                            </span>
                          </button>
                        )}
                      </div>
                    </div>

                  </div>
                </>
              )}
            </>
          )}

        </main>
      </div>

      {/* 4. Submission Confirmation Modal */}
      <SubmissionModal
        submission={submission}
        isOpen={showSubmissionModal}
        onClose={() => {
          setShowSubmissionModal(false);
          setCurrentTab('dashboard');
        }}
      />
    </div>
  );
}
