import { Competency, EmployeeProfile, ProficiencyLevel, Skill, TrainingCourse, LNAAssessmentSubmission } from '../types';

export const DEFAULT_EMPLOYEE: EmployeeProfile = {
  name: 'Ravi Kumar',
  employeeId: 'EMP00123',
  email: 'ravi.kumar@gans.aero',
  reportingManager: 'Suresh Nair',
  position: 'Store Manager',
  division: 'Retail',
  department: 'Operations',
  grade: 8,
  joinDate: '12/May/2021',
  reviewPeriod: '2026',
  section: 'Retail Operations & Outlets',
  location: 'Abu Dhabi HQ / Operations'
};

export const ALTERNATE_EMPLOYEES: EmployeeProfile[] = [
  DEFAULT_EMPLOYEE,
  {
    name: 'Priya Sharma',
    employeeId: 'EMP00124',
    email: 'priya.sharma@gans.aero',
    reportingManager: 'Anita Rao',
    position: 'Sales Manager',
    division: 'Retail',
    department: 'Sales',
    grade: 7,
    joinDate: '10/Jan/2022',
    reviewPeriod: '2026',
    section: 'Corporate Sales & Channels',
    location: 'Dubai Branch Office'
  },
  {
    name: 'Arun Kumar',
    employeeId: 'EMP00125',
    email: 'arun.kumar@gans.aero',
    reportingManager: 'Suresh Nair',
    position: 'Accountant',
    division: 'Finance',
    department: 'Accounts',
    grade: 6,
    joinDate: '05/Mar/2023',
    reviewPeriod: '2026',
    section: 'Financial Accounting & Treasury',
    location: 'Abu Dhabi HQ'
  },
  {
    name: 'Vivekanandan',
    employeeId: '34233',
    email: 'ashmigandhi.v@gans.aero',
    reportingManager: 'Mansoor Al Hammadi',
    position: 'Specialist - Performance Management',
    division: 'CEO Office',
    department: 'HR & Administration',
    grade: 8,
    joinDate: '14/Apr/2026',
    reviewPeriod: '2026',
    section: 'HR & Administration',
    location: 'GANS Head Office'
  },
  {
    name: 'Tariq Al Hashemi',
    employeeId: '08912',
    email: 'tariq.hashemi@gans.aero',
    reportingManager: 'David O\'Connor',
    position: 'Senior Air Traffic Controller',
    division: 'Air Navigation Services',
    department: 'ATM Operations',
    grade: 9,
    joinDate: '01/Feb/2018',
    reviewPeriod: '2026',
    section: 'Area Control Center',
    location: 'Sheikh Zayed Centre'
  },
  {
    name: 'Fatima Al Zaabi',
    employeeId: 'EMP00188',
    email: 'fatima.alzaabi@gans.aero',
    reportingManager: 'Mansoor Al Hammadi',
    position: 'HR Specialist',
    division: 'Human Resources',
    department: 'Talent Development',
    grade: 7,
    joinDate: '15/Nov/2020',
    reviewPeriod: '2026',
    section: 'Corporate L&D',
    location: 'GANS Head Office'
  },
  {
    name: 'Mohammed Al Mansoori',
    employeeId: 'EMP00201',
    email: 'mohammed.almansoori@gans.aero',
    reportingManager: 'Khaled Al Marzooqi',
    position: 'CNS Systems Engineer',
    division: 'Engineering & Technology',
    department: 'Systems Engineering',
    grade: 8,
    joinDate: '20/Jul/2019',
    reviewPeriod: '2026',
    section: 'Navigation & Surveillance',
    location: 'Al Bateen Airport'
  },
  {
    name: 'Aisha Al Suwaidi',
    employeeId: 'EMP00234',
    email: 'aisha.alsuwaidi@gans.aero',
    reportingManager: 'Hamad Al Nuaimi',
    position: 'Quality Assurance Auditor',
    division: 'Safety & Quality',
    department: 'Quality Management',
    grade: 8,
    joinDate: '11/Aug/2021',
    reviewPeriod: '2026',
    section: 'Aviation Compliance',
    location: 'Abu Dhabi HQ'
  }
];

// Sample Competency Catalog for Retail / Operations / Grade 8
export const FUNCTIONAL_COMPETENCIES: Competency[] = [
  {
    id: 'comp_func_1',
    code: 'FC-01',
    name: 'Operational Excellence',
    category: 'Functional',
    description: '',
    skills: [
      { id: 'sk_func_1_1', competencyId: 'comp_func_1', category: 'Functional', code: 'SK-OE-101', name: 'Inventory & Stock Optimization', description: 'Streamlining stock levels, reducing carrying costs, and managing turnover.' },
      { id: 'sk_func_1_2', competencyId: 'comp_func_1', category: 'Functional', code: 'SK-OE-102', name: 'Store Workflow Automation', description: 'Implementing automated shift and task scheduling tools.' },
      { id: 'sk_func_1_3', competencyId: 'comp_func_1', category: 'Functional', code: 'SK-OE-103', name: 'SLA & Metrics Performance Tracking', description: 'Monitoring key store operational deliverables and service level adherence.' },
      { id: 'sk_func_1_4', competencyId: 'comp_func_1', category: 'Functional', code: 'SK-OE-104', name: 'Visual Merchandising & Store Standards', description: 'Maintaining immaculate presentation compliance across retail spaces.' },
      { id: 'sk_func_1_5', competencyId: 'comp_func_1', category: 'Functional', code: 'SK-OE-105', name: 'Supply Chain Agility & Replenishment', description: 'Coordinating emergency restocks and supplier turnarounds.' },
      { id: 'sk_func_1_6', competencyId: 'comp_func_1', category: 'Functional', code: 'SK-OE-106', name: 'Shrinkage & Loss Prevention Control', description: 'Auditing high-risk merchandise, securing shrinkage vulnerabilities.' }
    ]
  },
  {
    id: 'comp_func_2',
    code: 'FC-02',
    name: 'Process Management',
    category: 'Functional',
    description: 'Design, execution, measurement, and continuous improvement of core business operational workflows.',
    skills: [
      { id: 'sk_func_2_1', competencyId: 'comp_func_2', category: 'Functional', code: 'SK-PM-201', name: 'Standard Operating Procedures (SOP) Formulation', description: 'Authoring clear, compliant procedures for retail operational workflows.' },
      { id: 'sk_func_2_2', competencyId: 'comp_func_2', category: 'Functional', code: 'SK-PM-202', name: 'Continuous Improvement (Kaizen / Lean)', description: 'Driving incremental process enhancements to eliminate waste.' },
      { id: 'sk_func_2_3', competencyId: 'comp_func_2', category: 'Functional', code: 'SK-PM-203', name: 'Process Audit & Compliance Verification', description: 'Conducting periodic operational health checks against corporate policy.' },
      { id: 'sk_func_2_4', competencyId: 'comp_func_2', category: 'Functional', code: 'SK-PM-204', name: 'Workflow Bottleneck Resolution', description: 'Identifying bottlenecks in checkout, dispatch, and goods intake.' },
      { id: 'sk_func_2_5', competencyId: 'comp_func_2', category: 'Functional', code: 'SK-PM-205', name: 'Service Blueprinting & Process Mapping', description: 'Visualizing touchpoints between front-line employees and back-office.' },
      { id: 'sk_func_2_6', competencyId: 'comp_func_2', category: 'Functional', code: 'SK-PM-206', name: 'Operations Governance & Control', description: 'Enforcing organizational regulatory, health, and security mandates.' }
    ]
  },
  {
    id: 'comp_func_3',
    code: 'FC-03',
    name: 'Technical Knowledge',
    category: 'Functional',
    description: 'Expertise in enterprise retail software, point-of-sale systems, and operational hardware solutions.',
    skills: [
      { id: 'sk_func_3_1', competencyId: 'comp_func_3', category: 'Functional', code: 'SK-TK-301', name: 'ERP & POS Systems Mastery', description: 'Managing POS transaction records, register balance, and ERP reconciliation.' },
      { id: 'sk_func_3_2', competencyId: 'comp_func_3', category: 'Functional', code: 'SK-TK-302', name: 'Retail Data Analytics & Reporting', description: 'Extracting sales, basket size, and customer retention metrics from databases.' },
      { id: 'sk_func_3_3', competencyId: 'comp_func_3', category: 'Functional', code: 'SK-TK-303', name: 'Inventory Management Software Administration', description: 'Administering barcode tracking, serial numbers, and ERP modules.' },
      { id: 'sk_func_3_4', competencyId: 'comp_func_3', category: 'Functional', code: 'SK-TK-304', name: 'Automated Replenishment Systems', description: 'Configuring automated re-order thresholds based on safety stock logic.' },
      { id: 'sk_func_3_5', competencyId: 'comp_func_3', category: 'Functional', code: 'SK-TK-305', name: 'Digital Retail Security & Access Controls', description: 'Ensuring user permissions and payment card security compliance (PCI-DSS).' },
      { id: 'sk_func_3_6', competencyId: 'comp_func_3', category: 'Functional', code: 'SK-TK-306', name: 'Omnichannel Order Fulfillment Integration', description: 'Connecting online orders to store click-and-collect fulfillment.' }
    ]
  },
  {
    id: 'comp_func_4',
    code: 'FC-04',
    name: 'Business Analysis',
    category: 'Functional',
    description: 'Evaluating commercial figures, margin trends, cost centers, and market opportunities to drive profitability.',
    skills: [
      { id: 'sk_func_4_1', competencyId: 'comp_func_4', category: 'Functional', code: 'SK-BA-401', name: 'Store Financial & P&L Statement Analysis', description: 'Reviewing operational profit, gross margins, and cost per square meter.' },
      { id: 'sk_func_4_2', competencyId: 'comp_func_4', category: 'Functional', code: 'SK-BA-402', name: 'Footfall & Conversion Rate Modeling', description: 'Analyzing traffic counts vs actual completed purchases.' },
      { id: 'sk_func_4_3', competencyId: 'comp_func_4', category: 'Functional', code: 'SK-BA-403', name: 'Demand Forecasting & Seasonality Planning', description: 'Projecting sales spikes during national holidays and festive seasons.' },
      { id: 'sk_func_4_4', competencyId: 'comp_func_4', category: 'Functional', code: 'SK-BA-404', name: 'Category & Merchandising Performance Analysis', description: 'Evaluating top performing product categories and dead stock.' },
      { id: 'sk_func_4_5', competencyId: 'comp_func_4', category: 'Functional', code: 'SK-BA-405', name: 'Operational Variance & OPEX Audit', description: 'Pinpointing deviations between allocated budget and actual spend.' },
      { id: 'sk_func_4_6', competencyId: 'comp_func_4', category: 'Functional', code: 'SK-BA-406', name: 'Competitor Price & Promotion Benchmarking', description: 'Analyzing market positioning against regional competitors.' }
    ]
  },
  {
    id: 'comp_func_5',
    code: 'FC-05',
    name: 'Performance Management',
    category: 'Functional',
    description: 'Setting clear departmental targets, supervising employee output, and providing ongoing developmental coaching.',
    skills: [
      { id: 'sk_func_5_1', competencyId: 'comp_func_5', category: 'Functional', code: 'SK-PF-501', name: 'KPI Cascading & Objective Setting', description: 'Translating corporate targets into measurable front-line team goals.' },
      { id: 'sk_func_5_2', competencyId: 'comp_func_5', category: 'Functional', code: 'SK-PF-502', name: 'Shift Productivity & Output Monitoring', description: 'Tracking transaction speeds, cashier uptime, and restocking velocity.' },
      { id: 'sk_func_5_3', competencyId: 'comp_func_5', category: 'Functional', code: 'SK-PF-503', name: 'Constructive Performance Coaching', description: 'Conducting structured 1-on-1 feedback and corrective coaching dialogues.' },
      { id: 'sk_func_5_4', competencyId: 'comp_func_5', category: 'Functional', code: 'SK-PF-504', name: 'Retail Quarterly Operations Review (QOR)', description: 'Presenting store operational achievements to senior division heads.' },
      { id: 'sk_func_5_5', competencyId: 'comp_func_5', category: 'Functional', code: 'SK-PF-505', name: 'Sales Pipeline & Target Realization Tracking', description: 'Forecasting end-of-month target attainment and remedial campaigns.' },
      { id: 'sk_func_5_6', competencyId: 'comp_func_5', category: 'Functional', code: 'SK-PF-506', name: 'Staff Competency Gap Profiling', description: 'Identifying team skills deficits to feed into ongoing development cycles.' }
    ]
  },
  {
    id: 'comp_func_6',
    code: 'FC-06',
    name: 'Quality Management',
    category: 'Functional',
    description: 'Ensuring zero-defect operational compliance, health and safety compliance, and consistent customer satisfaction standards.',
    skills: [
      { id: 'sk_func_6_1', competencyId: 'comp_func_6', category: 'Functional', code: 'SK-QM-601', name: 'Customer Service Standards Audit', description: 'Mystery shopper audits and customer interaction grading.' },
      { id: 'sk_func_6_2', competencyId: 'comp_func_6', category: 'Functional', code: 'SK-QM-602', name: 'Quality Assurance & Physical Store Auditing', description: 'Verifying cleanliness, aisle safety, and pricing tag accuracy.' },
      { id: 'sk_func_6_3', competencyId: 'comp_func_6', category: 'Functional', code: 'SK-QM-603', name: 'Regulatory Safety & Health Compliance (HSE)', description: 'Implementing national occupational safety, fire exit, and hazard protocols.' },
      { id: 'sk_func_6_4', competencyId: 'comp_func_6', category: 'Functional', code: 'SK-QM-604', name: 'Service Recovery Protocols & Escalations', description: 'Resolving severe customer complaints with standardized recovery guidelines.' },
      { id: 'sk_func_6_5', competencyId: 'comp_func_6', category: 'Functional', code: 'SK-QM-605', name: '5S Workplace Organization Standards', description: 'Standardizing Sort, Set in order, Shine, Standardize, and Sustain routines.' },
      { id: 'sk_func_6_6', competencyId: 'comp_func_6', category: 'Functional', code: 'SK-QM-606', name: 'Quality Incident Logging & CAPA Execution', description: 'Managing corrective and preventive actions for recurring defects.' }
    ]
  },
  {
    id: 'comp_func_7',
    code: 'FC-07',
    name: 'Resource Management',
    category: 'Functional',
    description: 'Optimal allocation of personnel schedules, store equipment, consumable assets, and operational budgets.',
    skills: [
      { id: 'sk_func_7_1', competencyId: 'comp_func_7', category: 'Functional', code: 'SK-RM-701', name: 'Labor Shift Scheduling & Rostering', description: 'Creating cost-effective rosters balancing peak rush hours and overtime rules.' },
      { id: 'sk_func_7_2', competencyId: 'comp_func_7', category: 'Functional', code: 'SK-RM-702', name: 'Capital Equipment & Asset Utilization', description: 'Maintaining refrigeration units, scanners, and transport machinery.' },
      { id: 'sk_func_7_3', competencyId: 'comp_func_7', category: 'Functional', code: 'SK-RM-703', name: 'Peak Season Resource & Temp Staffing Plan', description: 'Forecasting and hiring seasonal workforce for peak campaigns.' },
      { id: 'sk_func_7_4', competencyId: 'comp_func_7', category: 'Functional', code: 'SK-RM-704', name: 'Multi-Store Stock Rebalancing', description: 'Authorizing inter-branch stock transfers to balance surplus and deficit locations.' },
      { id: 'sk_func_7_5', competencyId: 'comp_func_7', category: 'Functional', code: 'SK-RM-705', name: 'Vendor & Contractor Resource Oversight', description: 'Supervising third-party maintenance, cleaning, and security personnel.' },
      { id: 'sk_func_7_6', competencyId: 'comp_func_7', category: 'Functional', code: 'SK-RM-706', name: 'Operational Budget Allocation & Expense Control', description: 'Monitoring petty cash and store operational expense disbursements.' }
    ]
  }
];

// Sample Behavioral Competency Catalog
export const BEHAVIORAL_COMPETENCIES: Competency[] = [
  {
    id: 'comp_beh_1',
    code: 'BC-01',
    name: 'Leadership',
    category: 'Behavioral',
    description: 'Inspiring and guiding team members, driving vision, holding accountability, and fostering a high-performance culture.',
    skills: [
      { id: 'sk_beh_1_1', competencyId: 'comp_beh_1', category: 'Behavioral', code: 'SK-LDR-101', name: 'Team Leadership & Direction', description: 'Providing clear vision, purpose, and unified direction to diverse teams.' },
      { id: 'sk_beh_1_2', competencyId: 'comp_beh_1', category: 'Behavioral', code: 'SK-LDR-102', name: 'Executive & Peer Coaching', description: 'Guiding individuals to unlock their potential through reflective inquiry.' },
      { id: 'sk_beh_1_3', competencyId: 'comp_beh_1', category: 'Behavioral', code: 'SK-LDR-103', name: 'Effective Delegation & Empowerment', description: 'Assigning responsibility with appropriate autonomy and authority.' },
      { id: 'sk_beh_1_4', competencyId: 'comp_beh_1', category: 'Behavioral', code: 'SK-LDR-104', name: 'High-Impact Decision Making', description: 'Making timely, sound decisions in complex or ambiguous situations.' },
      { id: 'sk_beh_1_5', competencyId: 'comp_beh_1', category: 'Behavioral', code: 'SK-LDR-105', name: 'Conflict Management & Mediation', description: 'De-escalating tensions and resolving interpersonal frictions constructively.' },
      { id: 'sk_beh_1_6', competencyId: 'comp_beh_1', category: 'Behavioral', code: 'SK-LDR-106', name: 'Team Inspiration & Engagement Motivation', description: 'Energizing and boosting morale during demanding operational phases.' }
    ]
  },
  {
    id: 'comp_beh_2',
    code: 'BC-02',
    name: 'Communication',
    category: 'Behavioral',
    description: 'Expressing ideas with clarity, actively listening, and tailoring messages across organizational levels and cultures.',
    skills: [
      { id: 'sk_beh_2_1', competencyId: 'comp_beh_2', category: 'Behavioral', code: 'SK-COM-201', name: 'Executive & Management Presentations', description: 'Delivering compelling, succinct briefings to senior executive boards.' },
      { id: 'sk_beh_2_2', competencyId: 'comp_beh_2', category: 'Behavioral', code: 'SK-COM-202', name: 'Cross-Functional Stakeholder Engagement', description: 'Bridging technical, commercial, and operational communication gaps.' },
      { id: 'sk_beh_2_3', competencyId: 'comp_beh_2', category: 'Behavioral', code: 'SK-COM-203', name: 'Active Listening & Empathic Dialogue', description: 'Understanding spoken and non-verbal cues to build authentic rapport.' },
      { id: 'sk_beh_2_4', competencyId: 'comp_beh_2', category: 'Behavioral', code: 'SK-COM-204', name: 'Crisis Communication & Broadcast Briefings', description: 'Communicating urgent instructions with composure and clarity during crises.' },
      { id: 'sk_beh_2_5', competencyId: 'comp_beh_2', category: 'Behavioral', code: 'SK-COM-205', name: 'Professional Written Documentation & Reports', description: 'Writing precise, structured business cases and operational memos.' },
      { id: 'sk_beh_2_6', competencyId: 'comp_beh_2', category: 'Behavioral', code: 'SK-COM-206', name: 'Negotiation & Persuasive Alignment', description: 'Securing buy-in and agreement from reluctant internal and external parties.' }
    ]
  },
  {
    id: 'comp_beh_3',
    code: 'BC-03',
    name: 'Customer Focus',
    category: 'Behavioral',
    description: 'Prioritizing customer satisfaction, championing user needs, and embedding a service-first mindset in daily operations.',
    skills: [
      { id: 'sk_beh_3_1', competencyId: 'comp_beh_3', category: 'Behavioral', code: 'SK-CF-301', name: 'Customer Experience (CX) Strategy & Excellence', description: 'Designing frictionless end-to-end user journeys and service touchpoints.' },
      { id: 'sk_beh_3_2', competencyId: 'comp_beh_3', category: 'Behavioral', code: 'SK-CF-302', name: 'Voice of Customer (VoC) Insights Synthesis', description: 'Transforming customer feedback and NPS data into actionable service fixes.' },
      { id: 'sk_beh_3_3', competencyId: 'comp_beh_3', category: 'Behavioral', code: 'SK-CF-303', name: 'Advanced Service Recovery & Retention', description: 'Turning dissatisfied customers into long-term organizational advocates.' },
      { id: 'sk_beh_3_4', competencyId: 'comp_beh_3', category: 'Behavioral', code: 'SK-CF-304', name: 'Strategic Client Relationship Building', description: 'Cultivating trusted partnerships with institutional and VIP accounts.' },
      { id: 'sk_beh_3_5', competencyId: 'comp_beh_3', category: 'Behavioral', code: 'SK-CF-305', name: 'Customer-Centric Culture Championing', description: 'Instilling customer empathy across internal support departments.' },
      { id: 'sk_beh_3_6', competencyId: 'comp_beh_3', category: 'Behavioral', code: 'SK-CF-306', name: 'Proactive Need Anticipation & Personalization', description: 'Anticipating client requirements before explicit requests are made.' }
    ]
  },
  {
    id: 'comp_beh_4',
    code: 'BC-04',
    name: 'Problem Solving',
    category: 'Behavioral',
    description: 'Applying analytical rigor, identifying root causes, and implementing sustainable, innovative solutions.',
    skills: [
      { id: 'sk_beh_4_1', competencyId: 'comp_beh_4', category: 'Behavioral', code: 'SK-PS-401', name: 'Root Cause Analysis (5-Whys / Fishbone)', description: 'Diagnosing underlying system breakdowns rather than treating surface symptoms.' },
      { id: 'sk_beh_4_2', competencyId: 'comp_beh_4', category: 'Behavioral', code: 'SK-PS-402', name: 'Structured Troubleshooting & Logic Modeling', description: 'Applying methodical decision trees to resolve operational anomalies.' },
      { id: 'sk_beh_4_3', competencyId: 'comp_beh_4', category: 'Behavioral', code: 'SK-PS-403', name: 'Strategic Thinking & Scenario Planning', description: 'Evaluating long-term implications and alternative future scenarios.' },
      { id: 'sk_beh_4_4', competencyId: 'comp_beh_4', category: 'Behavioral', code: 'SK-PS-404', name: 'Creative & Out-of-the-Box Solutioning', description: 'Generating non-conventional methods to overcome systemic barriers.' },
      { id: 'sk_beh_4_5', competencyId: 'comp_beh_4', category: 'Behavioral', code: 'SK-PS-405', name: 'Incident Post-Mortem & Preventative Design', description: 'Conducting blame-free post-incident reviews to fortify operations.' },
      { id: 'sk_beh_4_6', competencyId: 'comp_beh_4', category: 'Behavioral', code: 'SK-PS-406', name: 'Operational Risk Mitigation & Contingency', description: 'Formulating backup protocols for high-consequence failure modes.' }
    ]
  },
  {
    id: 'comp_beh_5',
    code: 'BC-05',
    name: 'Teamwork',
    category: 'Behavioral',
    description: 'Collaborating respectfully, leveraging diverse perspectives, and supporting team goals above individual agendas.',
    skills: [
      { id: 'sk_beh_5_1', competencyId: 'comp_beh_5', category: 'Behavioral', code: 'SK-TW-501', name: 'Collaborative Team Synergy & Alignment', description: 'Fostering collective ownership and high psychological safety.' },
      { id: 'sk_beh_5_2', competencyId: 'comp_beh_5', category: 'Behavioral', code: 'SK-TW-502', name: 'Cross-Departmental Collaboration', description: 'Partnering effectively across siloed functions (HR, Finance, Ops, IT).' },
      { id: 'sk_beh_5_3', competencyId: 'comp_beh_5', category: 'Behavioral', code: 'SK-TW-503', name: 'Inclusive & Culturally Diverse Teamwork', description: 'Leveraging multicultural strengths within a global aviation/retail workforce.' },
      { id: 'sk_beh_5_4', competencyId: 'comp_beh_5', category: 'Behavioral', code: 'SK-TW-504', name: 'Peer Mentorship & Knowledge Transfer', description: 'Sharing tacit expertise to elevate junior colleagues.' },
      { id: 'sk_beh_5_5', competencyId: 'comp_beh_5', category: 'Behavioral', code: 'SK-TW-505', name: 'Consensus Building & Joint Problem Solving', description: 'Navigating differing viewpoints to achieve unified agreement.' },
      { id: 'sk_beh_5_6', competencyId: 'comp_beh_5', category: 'Behavioral', code: 'SK-TW-506', name: 'Remote & Distributed Team Synergy', description: 'Maintaining team cohesion across dispersed branch networks.' }
    ]
  },
  {
    id: 'comp_beh_6',
    code: 'BC-06',
    name: 'Adaptability',
    category: 'Behavioral',
    description: 'Thriving amid rapid organizational change, shifting priorities, and emerging technologies.',
    skills: [
      { id: 'sk_beh_6_1', competencyId: 'comp_beh_6', category: 'Behavioral', code: 'SK-AD-601', name: 'Change Management & Transition Agility', description: 'Embracing organizational restructuring and tech transformation swiftly.' },
      { id: 'sk_beh_6_2', competencyId: 'comp_beh_6', category: 'Behavioral', code: 'SK-AD-602', name: 'Resilience Under Pressure & High Stress', description: 'Maintaining composure and peak performance during high-stakes rushes.' },
      { id: 'sk_beh_6_3', competencyId: 'comp_beh_6', category: 'Behavioral', code: 'SK-AD-603', name: 'Rapid Workflow & System Adoption', description: 'Mastering new enterprise digital tools and protocols with speed.' },
      { id: 'sk_beh_6_4', competencyId: 'comp_beh_6', category: 'Behavioral', code: 'SK-AD-604', name: 'Ambiguity Navigation & Self-Direction', description: 'Operating effectively without explicit day-to-day supervision.' },
      { id: 'sk_beh_6_5', competencyId: 'comp_beh_6', category: 'Behavioral', code: 'SK-AD-605', name: 'Continuous Growth Mindset & Self-Learning', description: 'Proactively acquiring new competencies to future-proof one\'s career.' },
      { id: 'sk_beh_6_6', competencyId: 'comp_beh_6', category: 'Behavioral', code: 'SK-AD-606', name: 'Crisis Response Flexibility', description: 'Re-prioritizing tasks dynamically when unexpected emergencies arise.' }
    ]
  },
  {
    id: 'comp_beh_7',
    code: 'BC-07',
    name: 'Decision Making',
    category: 'Behavioral',
    description: 'Synthesizing evidence, weighing risks, and executing confident decisions aligned with corporate values.',
    skills: [
      { id: 'sk_beh_7_1', competencyId: 'comp_beh_7', category: 'Behavioral', code: 'SK-DM-701', name: 'Data-Driven Decision Frameworks', description: 'Backing critical operational choices with quantitative data points.' },
      { id: 'sk_beh_7_2', competencyId: 'comp_beh_7', category: 'Behavioral', code: 'SK-DM-702', name: 'High-Impact Prioritization & Triage', description: 'Focusing resources on vital high-leverage activities.' },
      { id: 'sk_beh_7_3', competencyId: 'comp_beh_7', category: 'Behavioral', code: 'SK-DM-703', name: 'Ethical & Compliance-Centric Judgment', description: 'Upholding uncompromising integrity in business dealings and employee care.' },
      { id: 'sk_beh_7_4', competencyId: 'comp_beh_7', category: 'Behavioral', code: 'SK-DM-704', name: 'Risk-Reward Evaluation & Scenario Analysis', description: 'Calculating downside exposure against anticipated business yield.' },
      { id: 'sk_beh_7_5', competencyId: 'comp_beh_7', category: 'Behavioral', code: 'SK-DM-705', name: 'Time-Critical & Real-Time Operational Execution', description: 'Executing decisive calls on the retail floor under tight time constraints.' },
      { id: 'sk_beh_7_6', competencyId: 'comp_beh_7', category: 'Behavioral', code: 'SK-DM-706', name: 'Strategic Trade-off Analysis & Accountability', description: 'Balancing cost constraints against quality and speed requirements.' }
    ]
  }
];

// Helper to look up Competency by ID
export function getCompetencyById(id: string): Competency | undefined {
  return [...FUNCTIONAL_COMPETENCIES, ...BEHAVIORAL_COMPETENCIES].find(c => c.id === id);
}

// System Rule: Automatically calculate Ideal Proficiency based on Position and Skill
export function determineIdealProficiency(position: string, skill: Skill): ProficiencyLevel {
  const normPosition = position.toLowerCase();
  const skillName = skill.name.toLowerCase();

  // Rules based on position seniority / function
  if (normPosition.includes('manager') || normPosition.includes('head') || normPosition.includes('director')) {
    if (
      skillName.includes('leadership') ||
      skillName.includes('strategy') ||
      skillName.includes('financial') ||
      skillName.includes('p&l') ||
      skillName.includes('performance') ||
      skillName.includes('coaching') ||
      skillName.includes('operational excellence') ||
      skillName.includes('inventory')
    ) {
      return 'Expert';
    }
    if (
      skillName.includes('troubleshooting') ||
      skillName.includes('analysis') ||
      skillName.includes('experience') ||
      skillName.includes('customer') ||
      skillName.includes('sop') ||
      skillName.includes('governance')
    ) {
      return 'Proficient';
    }
    return 'Proficient';
  }

  if (normPosition.includes('specialist') || normPosition.includes('senior') || normPosition.includes('controller')) {
    if (
      skillName.includes('analysis') ||
      skillName.includes('system') ||
      skillName.includes('root cause') ||
      skillName.includes('performance') ||
      skillName.includes('technical')
    ) {
      return 'Expert';
    }
    return 'Proficient';
  }

  if (normPosition.includes('supervisor') || normPosition.includes('lead')) {
    if (skillName.includes('shift') || skillName.includes('coaching') || skillName.includes('service')) {
      return 'Proficient';
    }
    return 'Intermediate';
  }

  // Default baseline for officers / coordinators
  return 'Intermediate';
}

// Comprehensive Per-Skill Training Course Catalog for GANS HR
export const SKILL_TRAINING_CATALOG: Record<string, {
  courseCode: string;
  title: string;
  provider: string;
  duration: string;
  deliveryMethod: 'Classroom' | 'Blended' | 'E-Learning' | 'Workshop';
  description: string;
}> = {
  // Functional Competency 1: Operational Excellence (FC-01)
  'sk_func_1_1': {
    courseCode: 'GANS-LND-INV-101',
    title: 'Advanced Inventory Optimization, Cycle Counting & Shrinkage Prevention',
    provider: 'GANS Operations Excellence Hub',
    duration: '3 Days (24 Hours)',
    deliveryMethod: 'Classroom',
    description: 'Mastering safety stock calculations, automated stock reordering, high-accuracy cycle counting, and carrying cost minimization.'
  },
  'sk_func_1_2': {
    courseCode: 'GANS-LND-WFL-102',
    title: 'Store Workflow Automation & Digital Task Orchestration',
    provider: 'GANS Operational Systems Academy',
    duration: '2 Days (16 Hours)',
    deliveryMethod: 'Blended',
    description: 'Deploying digital shift planners, streamlining store handover routines, and automating daily task checklists.'
  },
  'sk_func_1_3': {
    courseCode: 'GANS-LND-SLA-103',
    title: 'Operational SLA Governance & Retail Metrics Performance Tracking',
    provider: 'GANS Quality & Standards Hub',
    duration: '2 Days (14 Hours)',
    deliveryMethod: 'Workshop',
    description: 'Establishing operational SLA scorecards, tracking queue wait-times, transaction benchmarks, and floor compliance.'
  },
  'sk_func_1_4': {
    courseCode: 'GANS-LND-VMD-104',
    title: 'Visual Merchandising Mastery, Planogram Execution & Store Aesthetics',
    provider: 'Retail Design & Merchandising Institute',
    duration: '2 Days (16 Hours)',
    deliveryMethod: 'Workshop',
    description: 'Applying commercial visual merchandising standards, focal point design, lighting strategies, and planogram auditing.'
  },
  'sk_func_1_5': {
    courseCode: 'GANS-LND-SCM-105',
    title: 'Supply Chain Agility, Logistics Coordination & Fast-Track Replenishment',
    provider: 'GANS Supply Chain Division',
    duration: '3 Days (20 Hours)',
    deliveryMethod: 'Blended',
    description: 'Managing upstream logistics lead times, coordinating fast-track restocks, and mitigating regional supply chain disruptions.'
  },
  'sk_func_1_6': {
    courseCode: 'GANS-LND-SHR-106',
    title: 'Retail Loss Prevention, Asset Protection & Physical Shrinkage Audits',
    provider: 'GANS Security & Asset Protection',
    duration: '2 Days (16 Hours)',
    deliveryMethod: 'Classroom',
    description: 'High-risk product tagging, internal fraud deterrence, security camera auditing, and stock loss investigative protocols.'
  },

  // Functional Competency 2: Process Management (FC-02)
  'sk_func_2_1': {
    courseCode: 'GANS-LND-SOP-201',
    title: 'Standard Operating Procedures (SOP) Formulation & Documentation Architecture',
    provider: 'GANS Corporate Standards Academy',
    duration: '2 Days (16 Hours)',
    deliveryMethod: 'Workshop',
    description: 'Authoring airtight, compliant standard operating procedures, revision controls, and frontline training manuals.'
  },
  'sk_func_2_2': {
    courseCode: 'GANS-LND-KZN-202',
    title: 'Lean Six Sigma & Kaizen Continuous Operational Improvement',
    provider: 'Lean Continuous Improvement Institute',
    duration: '3 Days (24 Hours)',
    deliveryMethod: 'Blended',
    description: 'Eliminating the 8 operational wastes (Muda), conducting value stream mapping, and launching frontline Kaizen projects.'
  },
  'sk_func_2_3': {
    courseCode: 'GANS-LND-AUD-203',
    title: 'Internal Process Auditing & Regulatory Compliance Verification',
    provider: 'GANS Governance & Audit Division',
    duration: '2 Days (16 Hours)',
    deliveryMethod: 'Classroom',
    description: 'Designing compliance checklists, performing internal spot audits, and managing corrective and preventive action (CAPA) logs.'
  },
  'sk_func_2_4': {
    courseCode: 'GANS-LND-BNK-204',
    title: 'Workflow Bottleneck Diagnostics & Throughput Maximization',
    provider: 'GANS Process Innovation Hub',
    duration: '16 Hours',
    deliveryMethod: 'Blended',
    description: 'Diagnosing intake delays, cashier queue congestion, and dispatch friction through Theory of Constraints (TOC).'
  },
  'sk_func_2_5': {
    courseCode: 'GANS-LND-BLU-205',
    title: 'Service Blueprinting, Customer Journey & Cross-Department Process Mapping',
    provider: 'GANS Operations Academy',
    duration: '2 Days (14 Hours)',
    deliveryMethod: 'Workshop',
    description: 'Creating end-to-end service blueprints illustrating frontline onstage actions, backstage tasks, and support processes.'
  },
  'sk_func_2_6': {
    courseCode: 'GANS-LND-GOV-206',
    title: 'Operations Governance, Regulatory Risk & Corporate Control Frameworks',
    provider: 'GANS Corporate Compliance',
    duration: '2 Days (16 Hours)',
    deliveryMethod: 'Classroom',
    description: 'Embedding organizational risk controls, regulatory aviation/retail standards, and departmental accountability structures.'
  },

  // Functional Competency 3: Technical Knowledge (FC-03)
  'sk_func_3_1': {
    courseCode: 'GANS-LND-POS-301',
    title: 'Enterprise POS & ERP Retail System Administration & Data Reconciliation',
    provider: 'GANS Digital Systems Division',
    duration: '16 Hours',
    deliveryMethod: 'E-Learning',
    description: 'Advanced transaction reconciliation, register balancing, offline fallback protocols, and ERP master data management.'
  },
  'sk_func_3_2': {
    courseCode: 'GANS-LND-DTA-302',
    title: 'Retail Data Analytics, Basket Size Modeling & Commercial Reporting',
    provider: 'GANS Business Intelligence Academy',
    duration: '3 Days (20 Hours)',
    deliveryMethod: 'Blended',
    description: 'Extracting actionable insights from customer purchase history, average basket sizes, and peak shopping hour trends.'
  },
  'sk_func_3_3': {
    courseCode: 'GANS-LND-BAR-303',
    title: 'Automated Barcode, RFID & Enterprise Inventory Software Administration',
    provider: 'GANS IT Infrastructure Group',
    duration: '2 Days (14 Hours)',
    deliveryMethod: 'Blended',
    description: 'Configuring handheld terminal scanners, RFID tracking gates, serial asset management, and ERP inventory syncing.'
  },
  'sk_func_3_4': {
    courseCode: 'GANS-LND-RPL-304',
    title: 'Automated Replenishment Algorithms & Dynamic Safety Stock Tuning',
    provider: 'GANS Logistics Analytics Lab',
    duration: '2 Days (16 Hours)',
    deliveryMethod: 'Workshop',
    description: 'Setting statistical minimum/maximum reorder points, lead time variability buffers, and automated purchase orders.'
  },
  'sk_func_3_5': {
    courseCode: 'GANS-LND-CYB-305',
    title: 'Retail Cyber Security, Payment Data Protection & PCI-DSS Compliance',
    provider: 'GANS Cyber Security Team',
    duration: '12 Hours',
    deliveryMethod: 'E-Learning',
    description: 'Cardholder data environment protection, terminal tamper detection, user credential segregation, and cyber hygiene.'
  },
  'sk_func_3_6': {
    courseCode: 'GANS-LND-OMN-306',
    title: 'Omnichannel Order Management, Click-and-Collect & Unified Commerce',
    provider: 'GANS Digital Commerce Hub',
    duration: '2 Days (16 Hours)',
    deliveryMethod: 'Classroom',
    description: 'Integrating digital storefronts with branch inventory, ship-from-store protocols, and rapid order staging workflows.'
  },

  // Functional Competency 4: Business Analysis (FC-04)
  'sk_func_4_1': {
    courseCode: 'GANS-LND-PNL-401',
    title: 'Store Financial Mastery: P&L Statement Analysis, Gross Margin & EBITDA',
    provider: 'GANS Commercial Finance Academy',
    duration: '3 Days (24 Hours)',
    deliveryMethod: 'Classroom',
    description: 'Deconstructing revenue lines, cost of goods sold (COGS), gross margin return on investment (GMROI), and OPEX controls.'
  },
  'sk_func_4_2': {
    courseCode: 'GANS-LND-FTF-402',
    title: 'Footfall Traffic Analytics, Conversion Optimization & Yield Modeling',
    provider: 'Retail Performance Institute',
    duration: '2 Days (16 Hours)',
    deliveryMethod: 'Blended',
    description: 'Heatmapping in-store shopper dwell times, optimizing traffic conversion rates, and benchmarking hourly yield.'
  },
  'sk_func_4_3': {
    courseCode: 'GANS-LND-FST-403',
    title: 'Commercial Demand Forecasting, Holiday Seasonality & Revenue Planning',
    provider: 'GANS Strategic Planning Division',
    duration: '2 Days (16 Hours)',
    deliveryMethod: 'Workshop',
    description: 'Applying time-series forecasting, historical demand trend regression, and event-based demand surge planning.'
  },
  'sk_func_4_4': {
    courseCode: 'GANS-LND-CAT-404',
    title: 'Category Management, Space Productivity & Dead-Stock Liquidation',
    provider: 'GANS Merchandising Excellence Academy',
    duration: '2 Days (14 Hours)',
    deliveryMethod: 'Blended',
    description: 'Category portfolio matrix analysis, revenue per square meter optimization, and obsolete stock exit strategies.'
  },
  'sk_func_4_5': {
    courseCode: 'GANS-LND-OPX-405',
    title: 'Operational Budget Variance Analysis & Cost Reduction Strategies',
    provider: 'GANS Financial Planning Hub',
    duration: '16 Hours',
    deliveryMethod: 'Classroom',
    description: 'Tracking monthly OPEX variances, identifying cost creep in utility/packaging/overtime, and driving savings.'
  },
  'sk_func_4_6': {
    courseCode: 'GANS-LND-PRC-406',
    title: 'Dynamic Pricing Strategy, Competitive Benchmarking & Margin Protection',
    provider: 'GANS Commercial Strategy Team',
    duration: '2 Days (16 Hours)',
    deliveryMethod: 'Workshop',
    description: 'Monitoring competitor pricing matrices, price elasticity models, and promotional ROI calculations.'
  },

  // Functional Competency 5: Performance Management (FC-05)
  'sk_func_5_1': {
    courseCode: 'GANS-LND-KPI-501',
    title: 'KPI Cascading, Objective & Key Results (OKR) Alignment for Retail Ops',
    provider: 'GANS HR & Talent Development',
    duration: '2 Days (16 Hours)',
    deliveryMethod: 'Workshop',
    description: 'Translating high-level corporate strategies into clear, measurable front-line operational targets.'
  },
  'sk_func_5_2': {
    courseCode: 'GANS-LND-PRD-502',
    title: 'Shift Productivity Metrics, Real-Time Throughput & Staff Utilization',
    provider: 'GANS Operations Academy',
    duration: '14 Hours',
    deliveryMethod: 'Blended',
    description: 'Measuring transactions per labor hour (TPLH), checkout scanning speeds, and restocking throughput.'
  },
  'sk_func_5_3': {
    courseCode: 'GANS-LND-CCH-503',
    title: 'Constructive Performance Coaching & High-Impact Feedback Conversations',
    provider: 'GANS Leadership & People Development',
    duration: '2 Days (16 Hours)',
    deliveryMethod: 'Workshop',
    description: 'Conducting structured GROW coaching dialogues, delivering developmental feedback, and performance improvement plans.'
  },
  'sk_func_5_4': {
    courseCode: 'GANS-LND-QOR-504',
    title: 'Executive Quarterly Operations Review (QOR) Preparation & Delivery',
    provider: 'GANS Corporate Learning',
    duration: '2 Days (12 Hours)',
    deliveryMethod: 'Classroom',
    description: 'Assembling executive dashboards, articulating operational wins/challenges, and presenting corrective roadmaps.'
  },
  'sk_func_5_5': {
    courseCode: 'GANS-LND-TRG-505',
    title: 'Target Realization Tracking, Sales Remediation & Incentive Management',
    provider: 'GANS Commercial Operations',
    duration: '16 Hours',
    deliveryMethod: 'Blended',
    description: 'Mid-month sales tracking, sprint campaign mobilization, and aligning commission incentives with business KPIs.'
  },
  'sk_func_5_6': {
    courseCode: 'GANS-LND-GAP-506',
    title: 'Team Competency Gap Profiling & Structured Training Need Assessments',
    provider: 'GANS Talent & Learning Academy',
    duration: '14 Hours',
    deliveryMethod: 'Workshop',
    description: 'Conducting 180/360 competency gap evaluations, skill matrix charting, and drafting tailored staff development plans.'
  },

  // Functional Competency 6: Quality Management (FC-06)
  'sk_func_6_1': {
    courseCode: 'GANS-LND-CSS-601',
    title: 'Customer Service Standards Auditing & Mystery Shopper Evaluation Systems',
    provider: 'Quality Excellence Institute',
    duration: '2 Days (14 Hours)',
    deliveryMethod: 'Workshop',
    description: 'Setting frontline greeting/attire/assistance benchmarks and analyzing mystery shopping reports for targeted interventions.'
  },
  'sk_func_6_2': {
    courseCode: 'GANS-LND-QAA-602',
    title: 'Store Physical Quality Assurance & Comprehensive Facility Audits',
    provider: 'GANS Quality Assurance Division',
    duration: '2 Days (16 Hours)',
    deliveryMethod: 'Classroom',
    description: 'Executing comprehensive hygiene, aisle safety, pricing tag accuracy, and visual compliance inspections.'
  },
  'sk_func_6_3': {
    courseCode: 'GANS-LND-HSE-603',
    title: 'Occupational Health, Safety & Environmental (HSE) Compliance in Operations',
    provider: 'GANS HSE & Regulatory Center',
    duration: '3 Days (20 Hours)',
    deliveryMethod: 'Classroom',
    description: 'Emergency evacuation procedures, chemical handling, fire safety regulations, and OSHA/local government compliance.'
  },
  'sk_func_6_4': {
    courseCode: 'GANS-LND-REC-604',
    title: 'High-Stakes Service Recovery Protocols & Customer Complaint De-escalation',
    provider: 'GANS Service Excellence Academy',
    duration: '2 Days (16 Hours)',
    deliveryMethod: 'Workshop',
    description: 'Empowered frontline service recovery, compensation frameworks, and converting aggrieved patrons into loyal brand advocates.'
  },
  'sk_func_6_5': {
    courseCode: 'GANS-LND-5SS-605',
    title: '5S Workplace Organization & Visual Factory Standards Implementation',
    provider: 'Lean Operations Institute',
    duration: '2 Days (14 Hours)',
    deliveryMethod: 'Blended',
    description: 'Implementing Sort, Set in order, Shine, Standardize, and Sustain across storage stockrooms and shop floors.'
  },
  'sk_func_6_6': {
    courseCode: 'GANS-LND-CAP-606',
    title: 'Quality Incident Logging, 8D Problem Solving & CAPA Execution',
    provider: 'GANS QMS Division',
    duration: '2 Days (16 Hours)',
    deliveryMethod: 'Classroom',
    description: 'Root cause analysis of recurring service failures, 8D methodology, and executing corrective/preventive action logs.'
  },

  // Functional Competency 7: Resource Management (FC-07)
  'sk_func_7_1': {
    courseCode: 'GANS-LND-RST-701',
    title: 'Workforce Shift Optimization, Predictive Rostering & Labor Cost Control',
    provider: 'GANS Workforce Management Academy',
    duration: '2 Days (16 Hours)',
    deliveryMethod: 'Workshop',
    description: 'Building traffic-demand-aligned staff rosters, complying with labor laws, and optimizing overtime expenditure.'
  },
  'sk_func_7_2': {
    courseCode: 'GANS-LND-AST-702',
    title: 'Capital Equipment Lifecycle Management, Maintenance & Asset Utilization',
    provider: 'GANS Asset Engineering Division',
    duration: '2 Days (14 Hours)',
    deliveryMethod: 'Blended',
    description: 'Preventive maintenance scheduling for scanning hardware, refrigeration, HVAC systems, and transport assets.'
  },
  'sk_func_7_3': {
    courseCode: 'GANS-LND-TMP-703',
    title: 'Peak Season Temp Staffing, Rapid Onboarding & Resource Scaling',
    provider: 'GANS Talent Acquisition & HR',
    duration: '14 Hours',
    deliveryMethod: 'Classroom',
    description: 'Projecting seasonal staffing requirements, executing rapid onboarding bootcamps, and supervisor shift pairing.'
  },
  'sk_func_7_4': {
    courseCode: 'GANS-LND-REB-704',
    title: 'Multi-Store Stock Rebalancing, Regional Logistics & Surplus Relocation',
    provider: 'GANS Logistics & Distribution Hub',
    duration: '2 Days (16 Hours)',
    deliveryMethod: 'Blended',
    description: 'Analyzing inter-branch inventory velocity, organizing cross-dock transfers, and eliminating dead stock concentrations.'
  },
  'sk_func_7_5': {
    courseCode: 'GANS-LND-VND-705',
    title: 'Third-Party Contractor Supervision, SLA Enforcement & Vendor Oversight',
    provider: 'GANS Procurement & Vendor Hub',
    duration: '2 Days (14 Hours)',
    deliveryMethod: 'Workshop',
    description: 'Managing facilities maintenance, cleaning and security contractors, conducting SLA milestone reviews, and billing audits.'
  },
  'sk_func_7_6': {
    courseCode: 'GANS-LND-BDG-706',
    title: 'Store Operational Budget Allocation, Petty Cash Governance & Cost Audits',
    provider: 'GANS Financial Operations',
    duration: '16 Hours',
    deliveryMethod: 'Classroom',
    description: 'Disbursing operational budgets, auditing petty cash ledgers, approving consumable expenses, and fiscal compliance.'
  },

  // Behavioral Competency 1: Leadership (BC-01)
  'sk_beh_1_1': {
    courseCode: 'GANS-LND-LDR-101',
    title: 'Strategic Vision Alignment, Inspirational Leadership & Culture Building',
    provider: 'GANS Leadership Academy',
    duration: '3 Days (24 Hours)',
    deliveryMethod: 'Classroom',
    description: 'Articulating compelling strategic goals, unifying diverse teams, and building a high-trust, mission-driven team culture.'
  },
  'sk_beh_1_2': {
    courseCode: 'GANS-LND-LDR-102',
    title: 'Executive Mentoring, Reflective Inquiry & Transformational Coaching',
    provider: 'GANS Talent Institute',
    duration: '2 Days (16 Hours)',
    deliveryMethod: 'Workshop',
    description: 'Applying ICF coaching principles, active inquiry techniques, and empowering team members to solve operational hurdles.'
  },
  'sk_beh_1_3': {
    courseCode: 'GANS-LND-LDR-103',
    title: 'Empowered Delegation, Task Autonomy & Accountability Architecture',
    provider: 'GANS Management Center',
    duration: '2 Days (14 Hours)',
    deliveryMethod: 'Blended',
    description: 'Mastering delegation matrices, setting clear boundary conditions, and holding subordinates accountable for outcomes.'
  },
  'sk_beh_1_4': {
    courseCode: 'GANS-LND-LDR-104',
    title: 'High-Impact Decisive Leadership Under Ambiguity & Pressure',
    provider: 'GANS Executive Academy',
    duration: '2 Days (16 Hours)',
    deliveryMethod: 'Classroom',
    description: 'Navigating complex business trade-offs, calculating downside risks, and executing confident decisions in uncertain environments.'
  },
  'sk_beh_1_5': {
    courseCode: 'GANS-LND-LDR-105',
    title: 'Constructive Conflict Resolution, Mediation & Difficult Conversations',
    provider: 'GANS People & Culture Hub',
    duration: '2 Days (16 Hours)',
    deliveryMethod: 'Workshop',
    description: 'Resolving entrenched interpersonal disagreements, defusing workplace toxicity, and conducting difficult dialogue.'
  },
  'sk_beh_1_6': {
    courseCode: 'GANS-LND-LDR-106',
    title: 'Frontline Motivation, Employee Engagement & Morale Sustenance',
    provider: 'GANS People Development',
    duration: '14 Hours',
    deliveryMethod: 'Blended',
    description: 'Sustaining high energy during grueling peak shifts, recognizing unsung contributions, and mitigating burnout.'
  },

  // Behavioral Competency 2: Communication (BC-02)
  'sk_beh_2_1': {
    courseCode: 'GANS-LND-COM-201',
    title: 'Executive Briefings, High-Impact Presentations & Boardroom Storytelling',
    provider: 'GANS Communications Hub',
    duration: '2 Days (16 Hours)',
    deliveryMethod: 'Workshop',
    description: 'Structuring persuasive slide decks, distilling operational complexities for C-suite leaders, and mastering vocal delivery.'
  },
  'sk_beh_2_2': {
    courseCode: 'GANS-LND-COM-202',
    title: 'Cross-Functional Stakeholder Influence & Multi-Department Alignment',
    provider: 'GANS Corporate Academy',
    duration: '2 Days (16 Hours)',
    deliveryMethod: 'Workshop',
    description: 'Influencing without direct authority, bridging operational and IT/Finance jargon, and securing cross-departmental buy-in.'
  },
  'sk_beh_2_3': {
    courseCode: 'GANS-LND-COM-203',
    title: 'Active Listening Mastery, Non-Verbal Decoding & Empathic Communication',
    provider: 'GANS Talent Management',
    duration: '14 Hours',
    deliveryMethod: 'Blended',
    description: 'Recognizing hidden emotional cues, practicing reflective restatement, and building psychological safety in conversations.'
  },
  'sk_beh_2_4': {
    courseCode: 'GANS-LND-COM-204',
    title: 'Crisis Communications, Emergency Broadcasts & Incident Reporting',
    provider: 'GANS Media & Crisis Bureau',
    duration: '2 Days (16 Hours)',
    deliveryMethod: 'Classroom',
    description: 'Communicating urgent directives with composure during emergencies, preventing rumors, and drafting incident releases.'
  },
  'sk_beh_2_5': {
    courseCode: 'GANS-LND-COM-205',
    title: 'Business Writing Excellence: Executive Memos, Proposals & Formal Reports',
    provider: 'GANS Corporate Writing Center',
    duration: '16 Hours',
    deliveryMethod: 'E-Learning',
    description: 'Formulating structured business proposals, concise operational emails, and polished formal reports with pyramid logic.'
  },
  'sk_beh_2_6': {
    courseCode: 'GANS-LND-COM-206',
    title: 'Principled Negotiation, Mutual-Gains Bargaining & Commercial Influence',
    provider: 'GANS Commercial Institute',
    duration: '2 Days (16 Hours)',
    deliveryMethod: 'Workshop',
    description: 'Applying Harvard Negotiation Project techniques (BATNA), expanding the pie, and closing win-win operational contracts.'
  },

  // Behavioral Competency 3: Customer Focus (BC-03)
  'sk_beh_3_1': {
    courseCode: 'GANS-LND-CX-301',
    title: 'Customer Experience (CX) Architecture, Journey Mapping & Touchpoint Design',
    provider: 'Global Customer Experience Institute',
    duration: '2 Days (16 Hours)',
    deliveryMethod: 'Workshop',
    description: 'Analyzing end-to-end customer emotional curves, removing customer friction points, and crafting memorable brand moments.'
  },
  'sk_beh_3_2': {
    courseCode: 'GANS-LND-VOC-302',
    title: 'Voice of Customer (VoC) Analytics, NPS Synthesis & Feedback Loops',
    provider: 'GANS CX & Insights Lab',
    duration: '2 Days (14 Hours)',
    deliveryMethod: 'Blended',
    description: 'Synthesizing Net Promoter Scores, Google/social reviews, and survey feedback into targeted frontline operational fixes.'
  },
  'sk_beh_3_3': {
    courseCode: 'GANS-LND-REC-303',
    title: 'Service Recovery Mastery: Turning Service Failures into Brand Loyalty',
    provider: 'GANS Service Excellence Hub',
    duration: '2 Days (16 Hours)',
    deliveryMethod: 'Workshop',
    description: 'Mastering the Service Recovery Paradox, empathic listening techniques, and rapid issue resolution algorithms.'
  },
  'sk_beh_3_4': {
    courseCode: 'GANS-LND-VIP-304',
    title: 'Strategic VIP & Corporate Client Account Management in Aviation/Retail',
    provider: 'GANS Client Relationship Academy',
    duration: '2 Days (16 Hours)',
    deliveryMethod: 'Classroom',
    description: 'Managing VIP protocol standards, relationship mapping, tailored service plans, and long-term customer retention.'
  },
  'sk_beh_3_5': {
    courseCode: 'GANS-LND-CUS-305',
    title: 'Embedding a Customer-Centric Culture in Back-Office and Frontline Teams',
    provider: 'GANS Corporate Culture Academy',
    duration: '14 Hours',
    deliveryMethod: 'Blended',
    description: 'Connecting back-office logistics and IT roles to end-customer happiness, eliminating bureaucratic obstacles to good service.'
  },
  'sk_beh_3_6': {
    courseCode: 'GANS-LND-ANT-306',
    title: 'Proactive Customer Need Anticipation, Personalization & Signature Service',
    provider: 'Hospitality & Aviation Standards Hub',
    duration: '2 Days (14 Hours)',
    deliveryMethod: 'Workshop',
    description: 'Anticipating unspoken customer requirements, applying personalization techniques, and exceeding expectations consistently.'
  },

  // Behavioral Competency 4: Problem Solving (BC-04)
  'sk_beh_4_1': {
    courseCode: 'GANS-LND-RCA-401',
    title: 'Advanced Root Cause Analysis: 5-Whys, Ishikawa Fishbone & Fault-Tree Logic',
    provider: 'Kepner-Tregoe / GANS Academy',
    duration: '3 Days (20 Hours)',
    deliveryMethod: 'Classroom',
    description: 'Distinguishing symptom from cause, constructing systematic causal diagrams, and verifying permanent corrective remedies.'
  },
  'sk_beh_4_2': {
    courseCode: 'GANS-LND-TRS-402',
    title: 'Methodical Operational Troubleshooting & Rapid Fault Isolation',
    provider: 'GANS Technical Training Center',
    duration: '2 Days (16 Hours)',
    deliveryMethod: 'Blended',
    description: 'Applying binary search algorithms, isolating software/hardware defects, and restoring disrupted operations swiftly.'
  },
  'sk_beh_4_3': {
    courseCode: 'GANS-LND-STH-403',
    title: 'Strategic Systems Thinking, Dynamic Feedback Loops & Second-Order Effects',
    provider: 'MIT Sloan Executive Program Affiliate',
    duration: '2 Days (16 Hours)',
    deliveryMethod: 'Workshop',
    description: 'Understanding complex interconnected systems, forecasting unintended consequences, and finding high-leverage intervention points.'
  },
  'sk_beh_4_4': {
    courseCode: 'GANS-LND-CRE-404',
    title: 'Creative Problem Solving, Lateral Thinking & Design Thinking Sprints',
    provider: 'Innovation & Design Institute',
    duration: '2 Days (16 Hours)',
    deliveryMethod: 'Workshop',
    description: 'Applying SCAMPER, TRIZ principles, rapid prototyping, and lateral brainstorming to solve persistent business gridlocks.'
  },
  'sk_beh_4_5': {
    courseCode: 'GANS-LND-POS-405',
    title: 'Blame-Free Post-Mortems, Failure Taxonomy & Resilient System Design',
    provider: 'GANS Safety & Quality Directorate',
    duration: '16 Hours',
    deliveryMethod: 'Classroom',
    description: 'Facilitating objective, psychological safety-oriented post-incident reviews, identifying latent hazards, and updating defense layers.'
  },
  'sk_beh_4_6': {
    courseCode: 'GANS-LND-RSK-406',
    title: 'Operational Risk Assessment, FMEA Matrix & Contingency Action Planning',
    provider: 'GANS Risk Management Academy',
    duration: '2 Days (16 Hours)',
    deliveryMethod: 'Workshop',
    description: 'Calculating Risk Priority Numbers (RPN) via Failure Mode and Effects Analysis (FMEA) and drafting operational fallback plans.'
  },

  // Behavioral Competency 5: Teamwork (BC-05)
  'sk_beh_5_1': {
    courseCode: 'GANS-LND-TM-501',
    title: 'High-Performing Team Dynamics, Psychological Safety & Collective Drive',
    provider: 'GANS People & Culture Directorate',
    duration: '2 Days (16 Hours)',
    deliveryMethod: 'Workshop',
    description: 'Implementing Google Project Aristotle findings, building high vulnerability trust, and establishing clear team norms.'
  },
  'sk_beh_5_2': {
    courseCode: 'GANS-LND-TM-502',
    title: 'Cross-Departmental Collaboration & Eliminating Organizational Silos',
    provider: 'GANS Corporate Institute',
    duration: '2 Days (14 Hours)',
    deliveryMethod: 'Workshop',
    description: 'Fostering seamless partnerships across operations, HR, procurement, and commercial divisions.'
  },
  'sk_beh_5_3': {
    courseCode: 'GANS-LND-DIV-503',
    title: 'Inclusive Leadership & Multicultural Team Synergy in Global Enterprises',
    provider: 'GANS Diversity & Inclusion Hub',
    duration: '14 Hours',
    deliveryMethod: 'Blended',
    description: 'Leveraging cultural cognitive diversity, navigating cross-cultural communication norms, and building an inclusive environment.'
  },
  'sk_beh_5_4': {
    courseCode: 'GANS-LND-KNO-504',
    title: 'Peer Mentorship, Knowledge Harvesting & Tacit Skill Transfer',
    provider: 'GANS Knowledge Management Center',
    duration: '16 Hours',
    deliveryMethod: 'Workshop',
    description: 'Structuring formal peer buddy programs, documenting critical operational know-how, and preventing brain-drain.'
  },
  'sk_beh_5_5': {
    courseCode: 'GANS-LND-CNS-505',
    title: 'Consensus Building, Collaborative Deliberation & Joint Problem Solving',
    provider: 'GANS Management Hub',
    duration: '14 Hours',
    deliveryMethod: 'Workshop',
    description: 'Facilitating multi-stakeholder workshops, avoiding groupthink, and driving alignment on complex contentious initiatives.'
  },
  'sk_beh_5_6': {
    courseCode: 'GANS-LND-REM-506',
    title: 'Hybrid & Dispersed Workforce Collaboration: Tools, Rhythm & Alignment',
    provider: 'GANS Digital Workplace Team',
    duration: '12 Hours',
    deliveryMethod: 'E-Learning',
    description: 'Establishing asynchronous communication norms, virtual standup cadences, and maintaining team camaraderie across branches.'
  },

  // Behavioral Competency 6: Adaptability (BC-06)
  'sk_beh_6_1': {
    courseCode: 'GANS-LND-CHG-601',
    title: 'Change Agility & Leading Teams Through Organizational Transformation',
    provider: 'Prosci / GANS Change Academy',
    duration: '2 Days (16 Hours)',
    deliveryMethod: 'Workshop',
    description: 'Applying ADKAR change methodology, neutralizing employee resistance to change, and accelerating new process adoption.'
  },
  'sk_beh_6_2': {
    courseCode: 'GANS-LND-STR-602',
    title: 'Executive Stress Resilience, Emotional Regulation & Peak Composure',
    provider: 'GANS Wellness & Performance Center',
    duration: '14 Hours',
    deliveryMethod: 'Workshop',
    description: 'Cognitive reframing techniques, physiological stress response regulation, and sustaining high clarity under intense workloads.'
  },
  'sk_beh_6_3': {
    courseCode: 'GANS-LND-DIG-603',
    title: 'Digital Fluency & Rapid Adoption of Enterprise AI and Automation Tools',
    provider: 'GANS Digital Transformation Academy',
    duration: '16 Hours',
    deliveryMethod: 'E-Learning',
    description: 'Overcoming tech apprehension, accelerating tool onboarding, and leveraging digital dashboards for rapid decision making.'
  },
  'sk_beh_6_4': {
    courseCode: 'GANS-LND-AMB-604',
    title: 'Navigating Ambiguity, Autonomous Initiative & Self-Directed Execution',
    provider: 'GANS Leadership Hub',
    duration: '2 Days (14 Hours)',
    deliveryMethod: 'Blended',
    description: 'Formulating structured action plans when instructions are vague, prioritizing independently, and taking calculated initiative.'
  },
  'sk_beh_6_5': {
    courseCode: 'GANS-LND-GRW-605',
    title: 'Continuous Growth Mindset, Future-Proofing & Continuous Upskilling',
    provider: 'GANS Talent Institute',
    duration: '12 Hours',
    deliveryMethod: 'E-Learning',
    description: 'Cultivating proactive curiosity, seeking developmental feedback actively, and maintaining an agile personal learning plan.'
  },
  'sk_beh_6_6': {
    courseCode: 'GANS-LND-CRF-606',
    title: 'Operational Agility, Crisis Reprioritization & Rapid Pivot Protocols',
    provider: 'GANS Operations Command Center',
    duration: '2 Days (16 Hours)',
    deliveryMethod: 'Classroom',
    description: 'Executing sudden operational pivots during system outages, weather emergencies, or sudden surges with poise.'
  },

  // Behavioral Competency 7: Decision Making (BC-07)
  'sk_beh_7_1': {
    courseCode: 'GANS-LND-DMD-701',
    title: 'Data-Driven Decision Making: Quantitative Frameworks & Statistical Logic',
    provider: 'GANS Business Analytics Academy',
    duration: '2 Days (16 Hours)',
    deliveryMethod: 'Classroom',
    description: 'Eliminating intuition bias, utilizing statistical sample sizes, confidence intervals, and decision tree payoff matrices.'
  },
  'sk_beh_7_2': {
    courseCode: 'GANS-LND-PRI-702',
    title: 'High-Impact Prioritization: Eisenhower Matrix, MoSCoW & Operational Triage',
    provider: 'GANS Productivity Center',
    duration: '14 Hours',
    deliveryMethod: 'Workshop',
    description: 'Classifying competing demands, ruthlessly eliminating non-essential tasks, and focusing resources on 20% high-yield drivers.'
  },
  'sk_beh_7_3': {
    courseCode: 'GANS-LND-ETH-703',
    title: 'Corporate Ethics, Compliance Judgment & Uncompromising Integrity',
    provider: 'GANS Ethics & Legal Directorate',
    duration: '16 Hours',
    deliveryMethod: 'Classroom',
    description: 'Navigating ethical gray zones, conflict of interest mitigation, whistleblower protection, and regulatory governance.'
  },
  'sk_beh_7_4': {
    courseCode: 'GANS-LND-RSK-704',
    title: 'Risk-Reward Evaluation, Probabilistic Thinking & Scenario Modeling',
    provider: 'Harvard Business Publishing Affiliate',
    duration: '2 Days (16 Hours)',
    deliveryMethod: 'Blended',
    description: 'Evaluating best/worst case scenarios, calculating expected monetary value (EMV), and safeguarding against black swan events.'
  },
  'sk_beh_7_5': {
    courseCode: 'GANS-LND-RTC-705',
    title: 'Time-Critical Decision Execution in Real-Time Operations',
    provider: 'GANS Aviation & Operations Directorate',
    duration: '2 Days (16 Hours)',
    deliveryMethod: 'Classroom',
    description: 'Applying OODA loop principles (Observe, Orient, Decide, Act) under tight time-pressure in live operational theaters.'
  },
  'sk_beh_7_6': {
    courseCode: 'GANS-LND-TRD-706',
    title: 'Strategic Trade-off Analysis, Resource Cost Balancing & Accountability',
    provider: 'GANS Executive Management Academy',
    duration: '2 Days (16 Hours)',
    deliveryMethod: 'Workshop',
    description: 'Balancing cost constraints vs speed vs quality, documenting trade-off rationales, and owning executive outcomes.'
  }
};

// System Rule: Automatically map Recommended Training Course based on Selected Skill + Ideal Proficiency + Position
export function determineMappedTrainingCourse(
  skill: Skill,
  idealProficiency: ProficiencyLevel,
  position: string
): TrainingCourse {
  // 1. Check direct 1-to-1 Skill catalog lookup
  const catalogEntry = SKILL_TRAINING_CATALOG[skill.id];

  if (catalogEntry) {
    // Dynamic adjustment for high proficiency levels
    let courseTitle = catalogEntry.title;
    if (idealProficiency === 'Expert' && !courseTitle.includes('Advanced') && !courseTitle.includes('Mastery')) {
      courseTitle = `Advanced ${courseTitle}`;
    }

    return {
      id: `tc_${skill.id}`,
      courseCode: catalogEntry.courseCode,
      title: courseTitle,
      provider: catalogEntry.provider,
      duration: catalogEntry.duration,
      deliveryMethod: catalogEntry.deliveryMethod,
      description: catalogEntry.description
    };
  }

  // Fallback programmatic generator guarantee
  return {
    id: `tc_${skill.id}`,
    courseCode: `GANS-LND-${skill.code.replace('SK-', '')}-01`,
    title: `${skill.name} Masterclass & Operational Application`,
    provider: 'GANS Corporate Talent Management',
    duration: idealProficiency === 'Expert' ? '3 Days (24 Hours)' : '2 Days (16 Hours)',
    deliveryMethod: 'Blended',
    description: `Specialized corporate development program focused on mastering ${skill.name} for ${position} personnel.`
  };
}

// Preloaded 3 Competencies + 3 Skills + 3 Mapped Training Courses for Manager Review
export function createDefaultPreloadedSubmission(emp: EmployeeProfile): LNAAssessmentSubmission {
  const comp1 = getCompetencyById('comp_func_1') || FUNCTIONAL_COMPETENCIES[0];
  const skill1 = comp1.skills[0]; // 'sk_func_1_1': Inventory & Stock Optimization
  const prof1 = determineIdealProficiency(emp.position, skill1);
  const course1 = determineMappedTrainingCourse(skill1, prof1, emp.position);

  const comp2 = getCompetencyById('comp_func_2') || FUNCTIONAL_COMPETENCIES[1];
  const skill2 = comp2.skills[0]; // 'sk_func_2_1': Standard Operating Procedures (SOP) Formulation
  const prof2 = determineIdealProficiency(emp.position, skill2);
  const course2 = determineMappedTrainingCourse(skill2, prof2, emp.position);

  const comp3 = getCompetencyById('comp_beh_1') || BEHAVIORAL_COMPETENCIES[0];
  const skill3 = comp3.skills[0]; // 'sk_beh_1_1': Team Leadership & Direction
  const prof3 = determineIdealProficiency(emp.position, skill3);
  const course3 = determineMappedTrainingCourse(skill3, prof3, emp.position);

  return {
    referenceNo: 'REF/ESS/LNA/26-0089',
    submissionDate: new Date().toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }),
    employee: emp,
    selectedItems: [
      {
        competency: comp1,
        skill: skill1,
        idealProficiency: prof1,
        trainingCourse: course1,
        employeeRemarks: 'Aiming to streamline warehouse replenishment and optimize safety stock levels.'
      },
      {
        competency: comp2,
        skill: skill2,
        idealProficiency: prof2,
        trainingCourse: course2,
        employeeRemarks: 'Required for updating team standard operating procedures across regional store shifts.'
      },
      {
        competency: comp3,
        skill: skill3,
        idealProficiency: prof3,
        trainingCourse: course3,
        employeeRemarks: 'To build leadership competencies for managing larger frontline teams.'
      }
    ],
    comments: '',
    status: 'SUBMITTED FOR MANAGER REVIEW'
  };
}
