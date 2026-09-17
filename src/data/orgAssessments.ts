import {
  EmployeeProfile,
  LNAAssessmentSubmission,
  LNAAssessmentItem,
  LNAWorkflowStatus
} from '../types';
import {
  FUNCTIONAL_COMPETENCIES,
  BEHAVIORAL_COMPETENCIES,
  getCompetencyById,
  determineIdealProficiency,
  determineMappedTrainingCourse
} from './lnaData';

// Helper to construct a validated item
function buildItem(compKey: string, skillKey: string, position: string, employeeRemarks?: string): LNAAssessmentItem {
  const comp = getCompetencyById(compKey)!;
  const skill = comp.skills.find((s) => s.id === skillKey)!;
  const idealProficiency = determineIdealProficiency(position, skill);
  const trainingCourse = determineMappedTrainingCourse(skill, idealProficiency, position);
  return {
    competency: comp,
    skill,
    idealProficiency,
    trainingCourse,
    employeeRemarks: employeeRemarks || ''
  };
}

// Initial Employee Pool with varying LNA statuses representing an enterprise organization
export interface OrgAssessmentRecord {
  employee: EmployeeProfile;
  submission: LNAAssessmentSubmission | null;
  status: LNAWorkflowStatus;
  year?: number;
  isDelegated?: boolean;
  delegatedFrom?: string;
}

export function getRecordYear(record: OrgAssessmentRecord): number {
  if (record.year) return record.year;
  if (record.submission?.submissionDate) {
    const match = record.submission.submissionDate.match(/20\d{2}/);
    if (match) return parseInt(match[0], 10);
  }
  return 2026;
}

export const INITIAL_ORG_ASSESSMENTS: OrgAssessmentRecord[] = [
  // 1. Ravi Kumar (Primary Default Employee - Grade 8 Retail Operations)
  {
    employee: {
      name: 'Ravi Kumar',
      employeeId: 'EMP00123',
      email: 'ravi.kumar@gans.aero',
      reportingManager: 'Suresh Nair',
      position: 'Store Manager',
      division: 'Retail',
      department: 'Operations',
      grade: 8,
      joinDate: '12/May/2021',
      section: 'Retail Operations & Outlets',
      location: 'Abu Dhabi HQ / Operations'
    },
    submission: null, // Will be dynamically synced with active user session
    status: 'MANAGER APPROVED'
  },
  // 2. Priya Sharma (Grade 7 Sales Manager - Retail Sales) - Manager Approved
  {
    employee: {
      name: 'Priya Sharma',
      employeeId: 'EMP00124',
      email: 'priya.sharma@gans.aero',
      reportingManager: 'Anita Rao',
      position: 'Sales Manager',
      division: 'Retail',
      department: 'Sales',
      grade: 7,
      joinDate: '10/Jan/2022',
      section: 'Corporate Sales & Channels',
      location: 'Dubai Branch Office'
    },
    submission: {
      referenceNo: 'REF/ESS/LNA/26-0814',
      submissionDate: '18/Aug/2026',
      employee: {
        name: 'Priya Sharma',
        employeeId: 'EMP00124',
        email: 'priya.sharma@gans.aero',
        reportingManager: 'Anita Rao',
        position: 'Sales Manager',
        division: 'Retail',
        department: 'Sales',
        grade: 7,
        joinDate: '10/Jan/2022',
        section: 'Corporate Sales & Channels',
        location: 'Dubai Branch Office'
      },
      selectedItems: [
        buildItem('comp_func_4', 'sk_func_4_1', 'Sales Manager'),
        buildItem('comp_func_5', 'sk_func_5_5', 'Sales Manager'),
        buildItem('comp_beh_3', 'sk_beh_3_1', 'Sales Manager')
      ],
      comments: 'Targeting higher conversion rates and B2B corporate client acquisition in Q3/Q4.',
      status: 'MANAGER APPROVED',
      managerComments: 'Approved. The recommended courses align with our commercial sales objectives for the upcoming cycle.',
      managerActionDate: '19/Aug/2026'
    },
    status: 'MANAGER APPROVED'
  },
  // 3. Arun Kumar (Grade 6 Accountant - Finance Accounts) - Pending Employee Submission
  {
    employee: {
      name: 'Arun Kumar',
      employeeId: 'EMP00125',
      email: 'arun.kumar@gans.aero',
      reportingManager: 'Suresh Nair',
      position: 'Accountant',
      division: 'Finance',
      department: 'Accounts',
      grade: 6,
      joinDate: '05/Mar/2023',
      section: 'Financial Accounting & Treasury',
      location: 'Abu Dhabi HQ'
    },
    submission: null,
    status:"MANAGER APPROVED" 
  },
  // 4. Vivekanandan (Grade 8 Specialist - Performance Management) - Submitted for Manager Review
  {
    employee: {
      name: 'Vivekanandan',
      employeeId: '34233',
      email: 'ashmigandhi.v@gans.aero',
      reportingManager: 'Mansoor Al Hammadi',
      position: 'Specialist - Performance Management',
      division: 'CEO Office',
      department: 'HR & Administration',
      grade: 8,
      joinDate: '14/Apr/2026',
      section: 'HR & Administration',
      location: 'GANS Head Office'
    },
    submission: {
      referenceNo: 'REF/ESS/LNA/26-0891',
      submissionDate: '19/Aug/2026',
      employee: {
        name: 'Vivekanandan',
        employeeId: '34233',
        email: 'ashmigandhi.v@gans.aero',
        reportingManager: 'Mansoor Al Hammadi',
        position: 'Specialist - Performance Management',
        division: 'CEO Office',
        department: 'HR & Administration',
        grade: 8,
        joinDate: '14/Apr/2026',
        section: 'HR & Administration',
        location: 'GANS Head Office'
      },
      selectedItems: [
        buildItem('comp_func_2', 'sk_func_2_2', 'Specialist - Performance Management'),
        buildItem('comp_func_5', 'sk_func_5_1', 'Specialist - Performance Management'),
        buildItem('comp_beh_1', 'sk_beh_1_1', 'Specialist - Performance Management')
      ],
      comments: 'Focusing on driving enterprise performance KPIs and Kaizen operational excellence across corporate units.',
      status: 'SUBMITTED FOR MANAGER REVIEW'
    },
    status: 'SUBMITTED FOR MANAGER REVIEW',
    isDelegated: true,
    delegatedFrom: 'Mansoor Al Hammadi'
  },
  // 5. Tariq Al Hashemi (Grade 9 Senior Air Traffic Controller) - Manager Approved
  {
    employee: {
      name: 'Tariq Al Hashemi',
      employeeId: '08912',
      email: 'tariq.hashemi@gans.aero',
      reportingManager: 'David O\'Connor',
      position: 'Senior Air Traffic Controller',
      division: 'Air Navigation Services',
      department: 'ATM Operations',
      grade: 9,
      joinDate: '01/Feb/2018',
      section: 'Area Control Center',
      location: 'Sheikh Zayed Centre'
    },
    submission: {
      referenceNo: 'REF/ESS/LNA/26-0744',
      submissionDate: '16/Aug/2026',
      employee: {
        name: 'Tariq Al Hashemi',
        employeeId: '08912',
        email: 'tariq.hashemi@gans.aero',
        reportingManager: 'David O\'Connor',
        position: 'Senior Air Traffic Controller',
        division: 'Air Navigation Services',
        department: 'ATM Operations',
        grade: 9,
        joinDate: '01/Feb/2018',
        section: 'Area Control Center',
        location: 'Sheikh Zayed Centre'
      },
      selectedItems: [
        buildItem('comp_func_1', 'sk_func_1_3', 'Senior Air Traffic Controller'),
        buildItem('comp_func_6', 'sk_func_6_3', 'Senior Air Traffic Controller'),
        buildItem('comp_beh_7', 'sk_beh_7_5', 'Senior Air Traffic Controller')
      ],
      comments: 'Encountering heightened high-density sector traffic; strengthening safety risk mitigation and time-critical decision execution.',
      status: 'MANAGER APPROVED',
      managerComments: 'Approved without reservation. Critical development paths for senior operational ATC leadership.',
      managerActionDate: '17/Aug/2026'
    },
    status: 'MANAGER APPROVED',
    isDelegated: true,
    delegatedFrom: 'David O\'Connor'
  },
  // 6. Fatima Al Zaabi (Grade 7 HR Specialist - HR & Administration) - Sent Back to Employee
  {
    employee: {
      name: 'Fatima Al Zaabi',
      employeeId: 'EMP00188',
      email: 'fatima.alzaabi@gans.aero',
      reportingManager: 'Mansoor Al Hammadi',
      position: 'HR Specialist',
      division: 'Human Resources',
      department: 'Talent Development',
      grade: 7,
      joinDate: '15/Nov/2020',
      section: 'Corporate L&D',
      location: 'GANS Head Office'
    },
    submission: {
      referenceNo: 'REF/ESS/LNA/26-0692',
      submissionDate: '17/Aug/2026',
      employee: {
        name: 'Fatima Al Zaabi',
        employeeId: 'EMP00188',
        email: 'fatima.alzaabi@gans.aero',
        reportingManager: 'Mansoor Al Hammadi',
        position: 'HR Specialist',
        division: 'Human Resources',
        department: 'Talent Development',
        grade: 7,
        joinDate: '15/Nov/2020',
        section: 'Corporate L&D',
        location: 'GANS Head Office'
      },
      selectedItems: [
        buildItem('comp_func_5', 'sk_func_5_3', 'HR Specialist'),
        buildItem('comp_beh_2', 'sk_beh_2_2', 'HR Specialist'),
        buildItem('comp_beh_6', 'sk_beh_6_1', 'HR Specialist')
      ],
      comments: 'Looking forward to coaching and change management courses.',
      status: 'SENT BACK TO EMPLOYEE',
      managerComments: 'Please replace one of the behavioral competencies with a functional Process Management skill (e.g., SOP formulation or process audit) to support the upcoming LMS audit.',
      managerActionDate: '18/Aug/2026'
    },
    status: 'SENT BACK TO EMPLOYEE',
    isDelegated: true,
    delegatedFrom: 'Mansoor Al Hammadi'
  },
  // 7. Mohammed Al Mansoori (Grade 8 CNS Engineer - Engineering & Technology) - Manager Approved
  {
    employee: {
      name: 'Mohammed Al Mansoori',
      employeeId: 'EMP00201',
      email: 'mohammed.almansoori@gans.aero',
      reportingManager: 'Khaled Al Marzooqi',
      position: 'CNS Systems Engineer',
      division: 'Engineering & Technology',
      department: 'Systems Engineering',
      grade: 8,
      joinDate: '20/Jul/2019',
      section: 'Navigation & Surveillance',
      location: 'Al Bateen Airport'
    },
    submission: {
      referenceNo: 'REF/ESS/LNA/26-0531',
      submissionDate: '15/Aug/2026',
      employee: {
        name: 'Mohammed Al Mansoori',
        employeeId: 'EMP00201',
        email: 'mohammed.almansoori@gans.aero',
        reportingManager: 'Khaled Al Marzooqi',
        position: 'CNS Systems Engineer',
        division: 'Engineering & Technology',
        department: 'Systems Engineering',
        grade: 8,
        joinDate: '20/Jul/2019',
        section: 'Navigation & Surveillance',
        location: 'Al Bateen Airport'
      },
      selectedItems: [
        buildItem('comp_func_2', 'sk_func_2_3', 'CNS Systems Engineer'),
        buildItem('comp_func_3', 'sk_func_3_5', 'CNS Systems Engineer'),
        buildItem('comp_beh_4', 'sk_beh_4_1', 'CNS Systems Engineer')
      ],
      comments: 'Radar and surveillance telemetry maintenance requires root cause diagnostic and digital security hardening.',
      status: 'MANAGER APPROVED',
      managerComments: 'Strong selections aligned directly with our radar modernization timeline.',
      managerActionDate: '16/Aug/2026'
    },
    status: 'MANAGER APPROVED'
  },
  // 8. Aisha Al Suwaidi (Grade 8 QA Auditor - Safety & Quality) - Submitted for Manager Review
  {
    employee: {
      name: 'Aisha Al Suwaidi',
      employeeId: 'EMP00234',
      email: 'aisha.alsuwaidi@gans.aero',
      reportingManager: 'Hamad Al Nuaimi',
      position: 'Quality Assurance Auditor',
      division: 'Safety & Quality',
      department: 'Quality Management',
      grade: 8,
      joinDate: '11/Aug/2021',
      section: 'Aviation Compliance',
      location: 'Abu Dhabi HQ'
    },
    submission: {
      referenceNo: 'REF/ESS/LNA/26-0799',
      submissionDate: '19/Aug/2026',
      employee: {
        name: 'Aisha Al Suwaidi',
        employeeId: 'EMP00234',
        email: 'aisha.alsuwaidi@gans.aero',
        reportingManager: 'Hamad Al Nuaimi',
        position: 'Quality Assurance Auditor',
        division: 'Safety & Quality',
        department: 'Quality Management',
        grade: 8,
        joinDate: '11/Aug/2021',
        section: 'Aviation Compliance',
        location: 'Abu Dhabi HQ'
      },
      selectedItems: [
        buildItem('comp_func_6', 'sk_func_6_2', 'Quality Assurance Auditor'),
        buildItem('comp_func_2', 'sk_func_2_3', 'Quality Assurance Auditor'),
        buildItem('comp_beh_2', 'sk_beh_2_5', 'Quality Assurance Auditor')
      ],
      comments: 'Preparing for GCAA statutory quality audits across northern sector aerodromes.',
      status: 'SUBMITTED FOR MANAGER REVIEW'
    },
    status: 'SUBMITTED FOR MANAGER REVIEW'
  },
  // 9. John Smith (Grade 7 Procurement Specialist - Commercial & Contracts) - Pending Employee Submission
  {
    employee: {
      name: 'John Smith',
      employeeId: 'EMP00312',
      email: 'john.smith@gans.aero',
      reportingManager: 'Anita Rao',
      position: 'Procurement Specialist',
      division: 'Retail',
      department: 'Operations',
      grade: 7,
      joinDate: '18/Feb/2024',
      section: 'Vendor Relations',
      location: 'Abu Dhabi HQ'
    },
    submission: null,
    status: 'SUBMITTED FOR MANAGER REVIEW'
  },
  // 10. Mariam Al Hosani (Grade 6 Training Coordinator - HR) - Manager Approved
  {
    employee: {
      name: 'Mariam Al Hosani',
      employeeId: 'EMP00345',
      email: 'mariam.alhosani@gans.aero',
      reportingManager: 'Mansoor Al Hammadi',
      position: 'Training Coordinator',
      division: 'Human Resources',
      department: 'Talent Development',
      grade: 6,
      joinDate: '01/Sep/2022',
      section: 'Corporate L&D',
      location: 'GANS Head Office'
    },
    submission: {
      referenceNo: 'REF/ESS/LNA/26-0410',
      submissionDate: '12/Aug/2026',
      employee: {
        name: 'Mariam Al Hosani',
        employeeId: 'EMP00345',
        email: 'mariam.alhosani@gans.aero',
        reportingManager: 'Mansoor Al Hammadi',
        position: 'Training Coordinator',
        division: 'Human Resources',
        department: 'Talent Development',
        grade: 6,
        joinDate: '01/Sep/2022',
        section: 'Corporate L&D',
        location: 'GANS Head Office'
      },
      selectedItems: [
        buildItem('comp_func_7', 'sk_func_7_1', 'Training Coordinator'),
        buildItem('comp_beh_3', 'sk_beh_3_1', 'Training Coordinator'),
        buildItem('comp_beh_5', 'sk_beh_5_1', 'Training Coordinator')
      ],
      comments: 'Aiming to streamline training roster scheduling and participant support logistics.',
      status: 'MANAGER APPROVED',
      managerComments: 'Approved. Great focus on coordinating logistics and customer-first employee support.',
      managerActionDate: '14/Aug/2026'
    },
    status: 'MANAGER APPROVED'
  },
  // 11. Sultan Al Dhaheri (Grade 8 Air Traffic Controller - ANS) - Submitted for Manager Review
  {
    employee: {
      name: 'Sultan Al Dhaheri',
      employeeId: 'EMP00418',
      email: 'sultan.dhaheri@gans.aero',
      reportingManager: 'David O\'Connor',
      position: 'Air Traffic Controller',
      division: 'Air Navigation Services',
      department: 'ATM Operations',
      grade: 8,
      joinDate: '15/May/2020',
      section: 'Tower Control Unit',
      location: 'Al Ain International'
    },
    submission: {
      referenceNo: 'REF/ESS/LNA/26-0922',
      submissionDate: '19/Aug/2026',
      employee: {
        name: 'Sultan Al Dhaheri',
        employeeId: 'EMP00418',
        email: 'sultan.dhaheri@gans.aero',
        reportingManager: 'David O\'Connor',
        position: 'Air Traffic Controller',
        division: 'Air Navigation Services',
        department: 'ATM Operations',
        grade: 8,
        joinDate: '15/May/2020',
        section: 'Tower Control Unit',
        location: 'Al Ain International'
      },
      selectedItems: [
        buildItem('comp_func_1', 'sk_func_1_3', 'Air Traffic Controller'),
        buildItem('comp_func_6', 'sk_func_6_3', 'Air Traffic Controller'),
        buildItem('comp_beh_4', 'sk_beh_4_2', 'Air Traffic Controller')
      ],
      comments: 'Seeking advanced tower flow control and emergency contingency protocols.',
      status: 'SUBMITTED FOR MANAGER REVIEW'
    },
    status: 'SUBMITTED FOR MANAGER REVIEW'
  },
  // 12. Layla Al Kaabi (Grade 7 Financial Analyst - Finance) - Manager Approved
  {
    employee: {
      name: 'Layla Al Kaabi',
      employeeId: 'EMP00450',
      email: 'layla.alkaabi@gans.aero',
      reportingManager: 'Suresh Nair',
      position: 'Financial Analyst',
      division: 'Finance',
      department: 'Accounts',
      grade: 7,
      joinDate: '10/Mar/2022',
      section: 'Budgeting & Planning',
      location: 'Abu Dhabi HQ'
    },
    submission: {
      referenceNo: 'REF/ESS/LNA/26-0619',
      submissionDate: '14/Aug/2026',
      employee: {
        name: 'Layla Al Kaabi',
        employeeId: 'EMP00450',
        email: 'layla.alkaabi@gans.aero',
        reportingManager: 'Suresh Nair',
        position: 'Financial Analyst',
        division: 'Finance',
        department: 'Accounts',
        grade: 7,
        joinDate: '10/Mar/2022',
        section: 'Budgeting & Planning',
        location: 'Abu Dhabi HQ'
      },
      selectedItems: [
        buildItem('comp_func_4', 'sk_func_4_1', 'Financial Analyst'),
        buildItem('comp_func_4', 'sk_func_4_5', 'Financial Analyst'),
        buildItem('comp_beh_7', 'sk_beh_7_1', 'Financial Analyst')
      ],
      comments: 'Financial modeling and OPEX variance auditing to assist corporate budgeting cycles.',
      status: 'MANAGER APPROVED',
      managerComments: 'Approved. Perfect selection for upcoming corporate budget forecasting and OPEX audits.',
      managerActionDate: '15/Aug/2026'
    },
    status: 'MANAGER APPROVED',
    year: 2026
  },
  // 13. Tariq Mansoor (Grade 9 IT Security Architect - Technology) - 2025 Cycle (Manager Approved)
  {
    employee: {
      name: 'Tariq Mansoor',
      employeeId: 'EMP00510',
      email: 'tariq.mansoor@gans.aero',
      reportingManager: 'Farah Qureshi',
      position: 'IT Systems Specialist',
      division: 'Technology & Innovation',
      department: 'IT Infrastructure',
      grade: 9,
      joinDate: '11/Jul/2020',
      section: 'Cyber & Enterprise Infrastructure',
      location: 'Abu Dhabi HQ'
    },
    submission: {
      referenceNo: 'REF/ESS/LNA/25-0104',
      submissionDate: '12/Sep/2025',
      employee: {
        name: 'Tariq Mansoor',
        employeeId: 'EMP00510',
        email: 'tariq.mansoor@gans.aero',
        reportingManager: 'Farah Qureshi',
        position: 'IT Systems Specialist',
        division: 'Technology & Innovation',
        department: 'IT Infrastructure',
        grade: 9,
        joinDate: '11/Jul/2020',
        section: 'Cyber & Enterprise Infrastructure',
        location: 'Abu Dhabi HQ'
      },
      selectedItems: [
        buildItem('comp_func_2', 'sk_func_2_1', 'IT Systems Specialist'),
        buildItem('comp_func_3', 'sk_func_3_2', 'IT Systems Specialist'),
        buildItem('comp_beh_1', 'sk_beh_1_1', 'IT Systems Specialist')
      ],
      comments: 'Targeting cloud security architecture and zero-trust authentication upgrades.',
      status: 'MANAGER APPROVED',
      managerComments: 'Approved in 2025 annual cycle. Vital for cloud migration security standard.',
      managerActionDate: '15/Sep/2025'
    },
    status: 'MANAGER APPROVED',
    year: 2025
  },
  // 14. Meera Al Nuaimi (Grade 8 Air Traffic Controller) - 2025 Cycle (Manager Approved)
  {
    employee: {
      name: 'Meera Al Nuaimi',
      employeeId: 'EMP00522',
      email: 'meera.nuaimi@gans.aero',
      reportingManager: 'David O\'Connor',
      position: 'Air Traffic Controller',
      division: 'Air Navigation Services',
      department: 'ATM Operations',
      grade: 8,
      joinDate: '01/Feb/2021',
      section: 'Area Control Center',
      location: 'Abu Dhabi Area Control'
    },
    submission: {
      referenceNo: 'REF/ESS/LNA/25-0211',
      submissionDate: '20/Aug/2025',
      employee: {
        name: 'Meera Al Nuaimi',
        employeeId: 'EMP00522',
        email: 'meera.nuaimi@gans.aero',
        reportingManager: 'David O\'Connor',
        position: 'Air Traffic Controller',
        division: 'Air Navigation Services',
        department: 'ATM Operations',
        grade: 8,
        joinDate: '01/Feb/2021',
        section: 'Area Control Center',
        location: 'Abu Dhabi Area Control'
      },
      selectedItems: [
        buildItem('comp_func_1', 'sk_func_1_1', 'Air Traffic Controller'),
        buildItem('comp_func_1', 'sk_func_1_2', 'Air Traffic Controller'),
        buildItem('comp_beh_4', 'sk_beh_4_1', 'Air Traffic Controller')
      ],
      comments: 'Radar vectoring and sector handover proficiency refresh.',
      status: 'MANAGER APPROVED',
      managerComments: 'Approved in 2025 cycle.',
      managerActionDate: '24/Aug/2025'
    },
    status: 'MANAGER APPROVED',
    year: 2025
  },
  // 15. Faisal Al Zaabi (Grade 7 Sales Manager) - 2025 Cycle (Manager Approved)
  {
    employee: {
      name: 'Faisal Al Zaabi',
      employeeId: 'EMP00533',
      email: 'faisal.zaabi@gans.aero',
      reportingManager: 'Anita Rao',
      position: 'Sales Manager',
      division: 'Retail',
      department: 'Sales',
      grade: 7,
      joinDate: '15/Aug/2021',
      section: 'Regional Sales',
      location: 'Dubai Branch Office'
    },
    submission: {
      referenceNo: 'REF/ESS/LNA/25-0340',
      submissionDate: '05/Sep/2025',
      employee: {
        name: 'Faisal Al Zaabi',
        employeeId: 'EMP00533',
        email: 'faisal.zaabi@gans.aero',
        reportingManager: 'Anita Rao',
        position: 'Sales Manager',
        division: 'Retail',
        department: 'Sales',
        grade: 7,
        joinDate: '15/Aug/2021',
        section: 'Regional Sales',
        location: 'Dubai Branch Office'
      },
      selectedItems: [
        buildItem('comp_func_4', 'sk_func_4_2', 'Sales Manager'),
        buildItem('comp_func_5', 'sk_func_5_3', 'Sales Manager'),
        buildItem('comp_beh_3', 'sk_beh_3_1', 'Sales Manager')
      ],
      comments: 'Commercial contract negotiation and distribution partner scaling.',
      status: 'MANAGER APPROVED',
      managerComments: 'Endorsed and approved.',
      managerActionDate: '09/Sep/2025'
    },
    status: 'MANAGER APPROVED',
    year: 2025
  },
  // 16. Hamad Al Shehhi (Grade 8 Store Manager) - 2024 Cycle (Manager Approved)
  {
    employee: {
      name: 'Hamad Al Shehhi',
      employeeId: 'EMP00560',
      email: 'hamad.shehhi@gans.aero',
      reportingManager: 'Suresh Nair',
      position: 'Store Manager',
      division: 'Retail',
      department: 'Operations',
      grade: 8,
      joinDate: '01/Jun/2019',
      section: 'Retail Operations',
      location: 'Sharjah Outlets'
    },
    submission: {
      referenceNo: 'REF/ESS/LNA/24-0082',
      submissionDate: '15/Aug/2024',
      employee: {
        name: 'Hamad Al Shehhi',
        employeeId: 'EMP00560',
        email: 'hamad.shehhi@gans.aero',
        reportingManager: 'Suresh Nair',
        position: 'Store Manager',
        division: 'Retail',
        department: 'Operations',
        grade: 8,
        joinDate: '01/Jun/2019',
        section: 'Retail Operations',
        location: 'Sharjah Outlets'
      },
      selectedItems: [
        buildItem('comp_func_5', 'sk_func_5_1', 'Store Manager'),
        buildItem('comp_func_6', 'sk_func_6_1', 'Store Manager'),
        buildItem('comp_beh_2', 'sk_beh_2_1', 'Store Manager')
      ],
      comments: 'Omnichannel inventory tracking and supply replenishment training.',
      status: 'MANAGER APPROVED',
      managerComments: 'Completed and approved for 2024 annual cycle.',
      managerActionDate: '18/Aug/2024'
    },
    status: 'MANAGER APPROVED',
    year: 2024
  }
];
