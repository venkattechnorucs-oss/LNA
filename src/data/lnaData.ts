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
// Sample Behavioral Competency Catalog (The 7 Curated Behavioral Competencies)
export const BEHAVIORAL_COMPETENCIES: Competency[] = [
  {
    id: 'comp_beh_1',
    code: 'BC-01',
    name: 'Adaptability',
    category: 'Behavioral',
    description: 'Thriving amid rapid organizational change, shifting priorities, ambiguity, and adopting emerging technologies with resilience.',
    skills: [
      { id: 'sk_beh_1_1', competencyId: 'comp_beh_1', category: 'Behavioral', code: 'SK-AD-101', name: 'Change Resilience & Transition Agility', description: 'Embracing organizational restructuring and tech transformation swiftly with composure.' },
      { id: 'sk_beh_1_2', competencyId: 'comp_beh_1', category: 'Behavioral', code: 'SK-AD-102', name: 'Stress Tolerance & Composure Under Pressure', description: 'Maintaining calm focus and high-quality output during critical operational peaks.' },
      { id: 'sk_beh_1_3', competencyId: 'comp_beh_1', category: 'Behavioral', code: 'SK-AD-103', name: 'Rapid Systems & Digital Workflow Adoption', description: 'Mastering new enterprise digital platforms and automated tools with speed.' },
      { id: 'sk_beh_1_4', competencyId: 'comp_beh_1', category: 'Behavioral', code: 'SK-AD-104', name: 'Ambiguity Navigation & Self-Direction', description: 'Operating effectively without explicit day-to-day supervision or full initial data.' },
      { id: 'sk_beh_1_5', competencyId: 'comp_beh_1', category: 'Behavioral', code: 'SK-AD-105', name: 'Crisis Response & Operational Flexibility', description: 'Re-prioritizing tasks dynamically when unexpected operational disruptions occur.' },
      { id: 'sk_beh_1_6', competencyId: 'comp_beh_1', category: 'Behavioral', code: 'SK-AD-106', name: 'Continuous Workplace Evolution & Agility', description: 'Proactively identifying procedural bottlenecks and adapting personal work habits.' }
    ]
  },
  {
    id: 'comp_beh_2',
    code: 'BC-02',
    name: 'Teamwork & Collaboration',
    category: 'Behavioral',
    description: 'Fostering collective synergy, active cross-functional partnerships, mutual trust, and shared accountability to achieve organizational goals.',
    skills: [
      { id: 'sk_beh_2_1', competencyId: 'comp_beh_2', category: 'Behavioral', code: 'SK-TW-201', name: 'Cross-Departmental Collaboration & Synergy', description: 'Partnering seamlessly across siloed divisions (Ops, Finance, HR, Commercial).' },
      { id: 'sk_beh_2_2', competencyId: 'comp_beh_2', category: 'Behavioral', code: 'SK-TW-202', name: 'Inclusive & Culturally Diverse Teamwork', description: 'Leveraging multicultural perspectives within a global aviation and service workforce.' },
      { id: 'sk_beh_2_3', competencyId: 'comp_beh_2', category: 'Behavioral', code: 'SK-TW-203', name: 'Peer Mentorship & Knowledge Sharing', description: 'Sharing practical domain experience and supporting newer team members.' },
      { id: 'sk_beh_2_4', competencyId: 'comp_beh_2', category: 'Behavioral', code: 'SK-TW-204', name: 'Consensus Building & Joint Problem Solving', description: 'Unifying divergent points of view toward harmonious collective solutions.' },
      { id: 'sk_beh_2_5', competencyId: 'comp_beh_2', category: 'Behavioral', code: 'SK-TW-205', name: 'Remote & Distributed Team Coordination', description: 'Maintaining engagement, transparency, and alignment across dispersed stations.' },
      { id: 'sk_beh_2_6', competencyId: 'comp_beh_2', category: 'Behavioral', code: 'SK-TW-206', name: 'Collective Accountability & Team Morale', description: 'Instilling shared responsibility for collective wins and rallying team spirits.' }
    ]
  },
  {
    id: 'comp_beh_3',
    code: 'BC-03',
    name: 'Result Orientation',
    category: 'Behavioral',
    description: 'Driving high-impact performance, setting ambitious targets, overcoming obstacles, and ensuring timely milestone execution.',
    skills: [
      { id: 'sk_beh_3_1', competencyId: 'comp_beh_3', category: 'Behavioral', code: 'SK-RO-301', name: 'Target Attainment & KPI Execution', description: 'Consistently meeting and exceeding strategic operational targets and KPIs.' },
      { id: 'sk_beh_3_2', competencyId: 'comp_beh_3', category: 'Behavioral', code: 'SK-RO-302', name: 'High-Impact Prioritization & Time Management', description: 'Focusing energy on high-leverage activities and managing competing demands.' },
      { id: 'sk_beh_3_3', competencyId: 'comp_beh_3', category: 'Behavioral', code: 'SK-RO-303', name: 'Obstacle Resolution & Perseverance', description: 'Persisting through operational setbacks with proactive alternative tactics.' },
      { id: 'sk_beh_3_4', competencyId: 'comp_beh_3', category: 'Behavioral', code: 'SK-RO-304', name: 'Continuous Operational Improvement (Kaizen)', description: 'Refining day-to-day procedures to boost delivery velocity and cut waste.' },
      { id: 'sk_beh_3_5', competencyId: 'comp_beh_3', category: 'Behavioral', code: 'SK-RO-305', name: 'Performance Metric Monitoring & Velocity', description: 'Tracking throughput, turnaround times, and service metrics rigorously.' },
      { id: 'sk_beh_3_6', competencyId: 'comp_beh_3', category: 'Behavioral', code: 'SK-RO-306', name: 'Resource Optimization & Delivery Focus', description: 'Maximizing output from available team, equipment, and budget assets.' }
    ]
  },
  {
    id: 'comp_beh_4',
    code: 'BC-04',
    name: 'Customer Centricity',
    category: 'Behavioral',
    description: 'Prioritizing internal and external customer satisfaction, anticipating stakeholder needs, and embedding a service-first mindset.',
    skills: [
      { id: 'sk_beh_4_1', competencyId: 'comp_beh_4', category: 'Behavioral', code: 'SK-CC-401', name: 'Stakeholder Need Anticipation & Empathy', description: 'Anticipating traveler and corporate client expectations before complaints arise.' },
      { id: 'sk_beh_4_2', competencyId: 'comp_beh_4', category: 'Behavioral', code: 'SK-CC-402', name: 'Service Excellence & Frictionless Journeys', description: 'Designing and delivering smooth service touchpoints across all stations.' },
      { id: 'sk_beh_4_3', competencyId: 'comp_beh_4', category: 'Behavioral', code: 'SK-CC-403', name: 'Voice of Customer (VoC) Analysis & Action', description: 'Synthesizing customer survey feedback into actionable workflow improvements.' },
      { id: 'sk_beh_4_4', competencyId: 'comp_beh_4', category: 'Behavioral', code: 'SK-CC-404', name: 'Service Recovery & Complaint Resolution', description: 'Transforming dissatisfied stakeholders into long-term organizational advocates.' },
      { id: 'sk_beh_4_5', competencyId: 'comp_beh_4', category: 'Behavioral', code: 'SK-CC-405', name: 'Strategic Client Relationship Building', description: 'Cultivating trusted, durable partnerships with institutional and VIP clients.' },
      { id: 'sk_beh_4_6', competencyId: 'comp_beh_4', category: 'Behavioral', code: 'SK-CC-406', name: 'Customer Experience Championing & Advocacy', description: 'Inspiring peers to maintain customer empathy across internal functions.' }
    ]
  },
  {
    id: 'comp_beh_5',
    code: 'BC-05',
    name: 'Effective Communication',
    category: 'Behavioral',
    description: 'Articulating messages with clarity, practicing active listening, and tailoring messaging persuasively across diverse channels.',
    skills: [
      { id: 'sk_beh_5_1', competencyId: 'comp_beh_5', category: 'Behavioral', code: 'SK-EC-501', name: 'Executive Briefings & High-Impact Presentations', description: 'Delivering concise, compelling briefings to senior boards and executive leads.' },
      { id: 'sk_beh_5_2', competencyId: 'comp_beh_5', category: 'Behavioral', code: 'SK-EC-502', name: 'Active Listening & Empathetic Inquiry', description: 'Capturing explicit requirements and emotional nuances to foster deep trust.' },
      { id: 'sk_beh_5_3', competencyId: 'comp_beh_5', category: 'Behavioral', code: 'SK-EC-503', name: 'Cross-Functional Message Alignment', description: 'Translating technical requirements into clear business and operational directives.' },
      { id: 'sk_beh_5_4', competencyId: 'comp_beh_5', category: 'Behavioral', code: 'SK-EC-504', name: 'Constructive Feedback & Difficult Conversations', description: 'Addressing sensitive performance topics diplomatically with clear action points.' },
      { id: 'sk_beh_5_5', competencyId: 'comp_beh_5', category: 'Behavioral', code: 'SK-EC-505', name: 'Clear Technical & Operational Documentation', description: 'Drafting unambiguous SOP updates, incident logs, and business cases.' },
      { id: 'sk_beh_5_6', competencyId: 'comp_beh_5', category: 'Behavioral', code: 'SK-EC-506', name: 'Negotiation & Persuasive Alignment', description: 'Securing buy-in and consensus from diverse stakeholders on critical initiatives.' }
    ]
  },
  {
    id: 'comp_beh_6',
    code: 'BC-06',
    name: 'Accountability',
    category: 'Behavioral',
    description: 'Taking full ownership of outcomes, adhering to ethical standards, fulfilling commitments, and demonstrating transparent responsibility.',
    skills: [
      { id: 'sk_beh_6_1', competencyId: 'comp_beh_6', category: 'Behavioral', code: 'SK-AC-601', name: 'Personal Ownership & Follow-Through', description: 'Delivering on promises without deflection and following up until closed.' },
      { id: 'sk_beh_6_2', competencyId: 'comp_beh_6', category: 'Behavioral', code: 'SK-AC-602', name: 'Ethical Governance & Compliance Integrity', description: 'Upholding uncompromising integrity in aviation safety and corporate standards.' },
      { id: 'sk_beh_6_3', competencyId: 'comp_beh_6', category: 'Behavioral', code: 'SK-AC-603', name: 'Transparent Reporting & Risk Disclosure', description: 'Highlighting operational roadblocks and performance gaps early and transparently.' },
      { id: 'sk_beh_6_4', competencyId: 'comp_beh_6', category: 'Behavioral', code: 'SK-AC-604', name: 'Reliability in High-Stakes Commitments', description: 'Standing behind commitments even when unexpected complexities arise.' },
      { id: 'sk_beh_6_5', competencyId: 'comp_beh_6', category: 'Behavioral', code: 'SK-AC-605', name: 'Error Acknowledgment & Corrective Action', description: 'Owning mistakes constructively and driving immediate root-cause correction.' },
      { id: 'sk_beh_6_6', competencyId: 'comp_beh_6', category: 'Behavioral', code: 'SK-AC-606', name: 'Peer & Team Accountability Upholding', description: 'Holding collaborators and team members to mutual standards of excellence.' }
    ]
  },
  {
    id: 'comp_beh_7',
    code: 'BC-07',
    name: 'Learning Agility',
    category: 'Behavioral',
    description: 'Actively seeking new knowledge, reflecting on experience, unlearning obsolete habits, and swiftly applying new skills to unfamiliar situations.',
    skills: [
      { id: 'sk_beh_7_1', competencyId: 'comp_beh_7', category: 'Behavioral', code: 'SK-LA-701', name: 'Rapid Skill Acquisition & Self-Directed Learning', description: 'Quickly mastering unfamiliar domains, tools, and regulatory guidelines independently.' },
      { id: 'sk_beh_7_2', competencyId: 'comp_beh_7', category: 'Behavioral', code: 'SK-LA-702', name: 'Growth Mindset & Curiosity Cultivation', description: 'Treating complex operational challenges as opportunities for skill expansion.' },
      { id: 'sk_beh_7_3', competencyId: 'comp_beh_7', category: 'Behavioral', code: 'SK-LA-703', name: 'Reflective Practice & Feedback Incorporation', description: 'Reflecting on past outcomes and actively applying feedback into daily practice.' },
      { id: 'sk_beh_7_4', competencyId: 'comp_beh_7', category: 'Behavioral', code: 'SK-LA-704', name: 'Knowledge Application to Unfamiliar Scenarios', description: 'Translating lessons from past scenarios into novel and unprecedented challenges.' },
      { id: 'sk_beh_7_5', competencyId: 'comp_beh_7', category: 'Behavioral', code: 'SK-LA-705', name: 'Unlearning Outdated Practices & Experimentation', description: 'Letting go of obsolete legacy habits in favor of modern, efficient practices.' },
      { id: 'sk_beh_7_6', competencyId: 'comp_beh_7', category: 'Behavioral', code: 'SK-LA-706', name: 'Future-Ready Competency Self-Development', description: 'Proactively forecasting skill requirements to stay ahead of industry transformations.' }
    ]
  }
];

// Helper to look up Competency by ID (Behavioral first, Functional second)
export function getCompetencyById(id: string): Competency | undefined {
  return [...BEHAVIORAL_COMPETENCIES, ...FUNCTIONAL_COMPETENCIES].find(c => c.id === id);
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

  // Behavioral Competency 1: Adaptability (BC-01)
  'sk_beh_1_1': {
    courseCode: 'GANS-LND-AD-101',
    title: 'Organizational Change Resilience & Transition Agility',
    provider: 'GANS Leadership & Culture Academy',
    duration: '2 Days (16 Hours)',
    deliveryMethod: 'Workshop',
    description: 'Mastering personal adaptation strategies, emotional composure during restructuring, and championing agile workplace transitions.'
  },
  'sk_beh_1_2': {
    courseCode: 'GANS-LND-AD-102',
    title: 'Stress Tolerance, Resilience & Composure Under High-Pressure Operations',
    provider: 'GANS People Development',
    duration: '14 Hours',
    deliveryMethod: 'Blended',
    description: 'Techniques for maintaining cognitive focus, emotional balance, and peak decision-making performance during severe peak rushes.'
  },
  'sk_beh_1_3': {
    courseCode: 'GANS-LND-AD-103',
    title: 'Rapid Digital Systems & Enterprise Workflow Adoption',
    provider: 'GANS Digital Transformation Academy',
    duration: '16 Hours',
    deliveryMethod: 'Classroom',
    description: 'Fast-track mastering of new digital tools, automated operations platforms, and paperless operational procedures.'
  },
  'sk_beh_1_4': {
    courseCode: 'GANS-LND-AD-104',
    title: 'Navigating Ambiguity, Uncertainty & Self-Directed Problem Solving',
    provider: 'GANS Management Center',
    duration: '2 Days (16 Hours)',
    deliveryMethod: 'Classroom',
    description: 'Formulating structured solutions in unstructured environments with incomplete data and minimum supervision.'
  },
  'sk_beh_1_5': {
    courseCode: 'GANS-LND-AD-105',
    title: 'Crisis Response Flexibility & Operational Contingency Execution',
    provider: 'GANS Operations Command Center',
    duration: '2 Days (16 Hours)',
    deliveryMethod: 'Classroom',
    description: 'Dynamic re-prioritization of operational tasks and deploying rapid backup workflows during unexpected airport disruptions.'
  },
  'sk_beh_1_6': {
    courseCode: 'GANS-LND-AD-106',
    title: 'Continuous Workplace Agility & Habit Evolution Masterclass',
    provider: 'GANS Talent Institute',
    duration: '14 Hours',
    deliveryMethod: 'Blended',
    description: 'Proactively identifying operational bottlenecks, overcoming inertia, and cultivating personal learning routines.'
  },

  // Behavioral Competency 2: Teamwork & Collaboration (BC-02)
  'sk_beh_2_1': {
    courseCode: 'GANS-LND-TW-201',
    title: 'Cross-Departmental Collaboration & Multi-Disciplinary Synergy',
    provider: 'GANS Corporate Academy',
    duration: '2 Days (16 Hours)',
    deliveryMethod: 'Workshop',
    description: 'Eliminating organizational silos, aligning shared KPIs across departments, and building lasting inter-team partnerships.'
  },
  'sk_beh_2_2': {
    courseCode: 'GANS-LND-TW-202',
    title: 'Inclusive Teamwork & Culturally Diverse Workforce Leadership',
    provider: 'GANS People & Culture Hub',
    duration: '14 Hours',
    deliveryMethod: 'Classroom',
    description: 'Harnessing multicultural workforce strengths in aviation operations, promoting psychological safety and open dialogue.'
  },
  'sk_beh_2_3': {
    courseCode: 'GANS-LND-TW-203',
    title: 'Peer Mentorship, Knowledge Transfer & Collaborative Growth',
    provider: 'GANS Talent Institute',
    duration: '2 Days (14 Hours)',
    deliveryMethod: 'Workshop',
    description: 'Structuring formal and informal peer coaching, transferring tacit operational know-how, and onboarding successors.'
  },
  'sk_beh_2_4': {
    courseCode: 'GANS-LND-TW-204',
    title: 'Consensus Building, Negotiation & Joint Problem Solving',
    provider: 'GANS Management Center',
    duration: '2 Days (16 Hours)',
    deliveryMethod: 'Workshop',
    description: 'Navigating differing agendas, resolving team disagreements constructively, and reaching durable consensus.'
  },
  'sk_beh_2_5': {
    courseCode: 'GANS-LND-TW-205',
    title: 'Remote, Hybrid & Distributed Team Coordination',
    provider: 'GANS Digital Workplace Center',
    duration: '14 Hours',
    deliveryMethod: 'Blended',
    description: 'Maintaining seamless operational coordination, clear documentation, and mutual trust across remote and dispersed stations.'
  },
  'sk_beh_2_6': {
    courseCode: 'GANS-LND-TW-206',
    title: 'Collective Accountability, Team Morale & High-Performing Culture',
    provider: 'GANS Leadership Academy',
    duration: '2 Days (16 Hours)',
    deliveryMethod: 'Classroom',
    description: 'Fostering shared pride in collective delivery, building peer-to-peer accountability, and maintaining morale under strain.'
  },

  // Behavioral Competency 3: Result Orientation (BC-03)
  'sk_beh_3_1': {
    courseCode: 'GANS-LND-RO-301',
    title: 'Target Attainment, KPI Mastery & Strategic Execution',
    provider: 'GANS Performance Institute',
    duration: '2 Days (16 Hours)',
    deliveryMethod: 'Classroom',
    description: 'Deconstructing strategic goals into actionable weekly milestones and driving uncompromising target realization.'
  },
  'sk_beh_3_2': {
    courseCode: 'GANS-LND-RO-302',
    title: 'High-Impact Prioritization & Time Management for Operations',
    provider: 'GANS Productivity Center',
    duration: '14 Hours',
    deliveryMethod: 'Workshop',
    description: 'Applying Eisenhower and MoSCoW matrices, eliminating time wasters, and focusing energy on high-value business outcomes.'
  },
  'sk_beh_3_3': {
    courseCode: 'GANS-LND-RO-303',
    title: 'Obstacle Resolution, Grit & Operational Perseverance',
    provider: 'GANS Talent Development',
    duration: '16 Hours',
    deliveryMethod: 'Blended',
    description: 'Navigating project setbacks, developing backup execution routes, and delivering results despite severe operational roadblocks.'
  },
  'sk_beh_3_4': {
    courseCode: 'GANS-LND-RO-304',
    title: 'Continuous Operational Improvement & Kaizen Delivery',
    provider: 'GANS Operational Excellence Hub',
    duration: '2 Days (16 Hours)',
    deliveryMethod: 'Workshop',
    description: 'Applying Lean Six Sigma and Kaizen cycles to eliminate operational waste, accelerate cycle times, and optimize outcomes.'
  },
  'sk_beh_3_5': {
    courseCode: 'GANS-LND-RO-305',
    title: 'Performance Metric Tracking, SLA Governance & Velocity Audits',
    provider: 'GANS Analytics Academy',
    duration: '16 Hours',
    deliveryMethod: 'Classroom',
    description: 'Establishing operational dashboards, real-time throughput metrics, and early warning indicators for delivery lag.'
  },
  'sk_beh_3_6': {
    courseCode: 'GANS-LND-RO-306',
    title: 'Resource Optimization & Delivery-Focused Asset Allocation',
    provider: 'GANS Operations Command',
    duration: '2 Days (14 Hours)',
    deliveryMethod: 'Classroom',
    description: 'Maximizing delivery velocity through disciplined shift planning, asset balancing, and focused operational budgets.'
  },

  // Behavioral Competency 4: Customer Centricity (BC-04)
  'sk_beh_4_1': {
    courseCode: 'GANS-LND-CC-401',
    title: 'Stakeholder Need Anticipation & Customer Empathy in Aviation',
    provider: 'GANS Service Academy',
    duration: '2 Days (16 Hours)',
    deliveryMethod: 'Workshop',
    description: 'Understanding traveler journeys, anticipating client and regulatory expectations, and designing empathetic service solutions.'
  },
  'sk_beh_4_2': {
    courseCode: 'GANS-LND-CC-402',
    title: 'Service Excellence & Frictionless Customer Experience Design',
    provider: 'GANS Hospitality & Retail Academy',
    duration: '2 Days (16 Hours)',
    deliveryMethod: 'Classroom',
    description: 'Eliminating friction points in passenger and tenant touchpoints, setting 5-star service benchmarks and quality assurance.'
  },
  'sk_beh_4_3': {
    courseCode: 'GANS-LND-CC-403',
    title: 'Voice of Customer (VoC) Insights Synthesis & Actionable Metrics',
    provider: 'GANS Customer Intelligence Hub',
    duration: '14 Hours',
    deliveryMethod: 'Classroom',
    description: 'Transforming CSAT and NPS feedback into prioritized service redesigns and tangible operational fixes.'
  },
  'sk_beh_4_4': {
    courseCode: 'GANS-LND-CC-404',
    title: 'Advanced Service Recovery, De-escalation & Retention Protocols',
    provider: 'GANS Service Excellence Bureau',
    duration: '16 Hours',
    deliveryMethod: 'Workshop',
    description: 'Resolving severe passenger and corporate disputes constructively and turning negative experiences into long-term customer trust.'
  },
  'sk_beh_4_5': {
    courseCode: 'GANS-LND-CC-405',
    title: 'Strategic Client Relationship Building & Key Stakeholder Management',
    provider: 'GANS Commercial Leadership Academy',
    duration: '2 Days (16 Hours)',
    deliveryMethod: 'Classroom',
    description: 'Cultivating enduring commercial relationships with airlines, airport authorities, and institutional concessionaires.'
  },
  'sk_beh_4_6': {
    courseCode: 'GANS-LND-CC-406',
    title: 'Customer-Centric Culture Championing & Frontline Advocacy',
    provider: 'GANS People & Culture Directorate',
    duration: '14 Hours',
    deliveryMethod: 'Blended',
    description: 'Embedding a customer-first philosophy across non-customer facing back-office departments and technical support teams.'
  },

  // Behavioral Competency 5: Effective Communication (BC-05)
  'sk_beh_5_1': {
    courseCode: 'GANS-LND-EC-501',
    title: 'Executive Briefings, Boardroom Storytelling & High-Impact Presentations',
    provider: 'GANS Executive Communications Center',
    duration: '2 Days (16 Hours)',
    deliveryMethod: 'Workshop',
    description: 'Delivering succinct briefings to C-level executives, structuring logic trees, and commanding boardroom authority.'
  },
  'sk_beh_5_2': {
    courseCode: 'GANS-LND-EC-502',
    title: 'Active Listening Mastery, Empathic Inquiry & Non-Verbal Decoding',
    provider: 'GANS Communications Hub',
    duration: '14 Hours',
    deliveryMethod: 'Workshop',
    description: 'Listening for unspoken requirements, decoding body language, and asking reflective questions to unlock authentic understanding.'
  },
  'sk_beh_5_3': {
    courseCode: 'GANS-LND-EC-503',
    title: 'Cross-Functional Message Alignment & Technical-to-Business Translation',
    provider: 'GANS Management Center',
    duration: '16 Hours',
    deliveryMethod: 'Classroom',
    description: 'Translating complex aviation and IT technical details into clear commercial insights for diverse organizational audiences.'
  },
  'sk_beh_5_4': {
    courseCode: 'GANS-LND-EC-504',
    title: 'Constructive Feedback, Mediation & Navigating Difficult Conversations',
    provider: 'GANS People & Culture Academy',
    duration: '2 Days (16 Hours)',
    deliveryMethod: 'Workshop',
    description: 'Conducting constructive performance feedback sessions, defusing defensiveness, and setting clear behavioral boundaries.'
  },
  'sk_beh_5_5': {
    courseCode: 'GANS-LND-EC-505',
    title: 'Clear Technical Documentation, SOP Writing & Formal Executive Memos',
    provider: 'GANS Corporate Communications',
    duration: '14 Hours',
    deliveryMethod: 'E-Learning',
    description: 'Drafting precise operational documentation, incident memos, and formal policy directives with clarity and zero ambiguity.'
  },
  'sk_beh_5_6': {
    courseCode: 'GANS-LND-EC-506',
    title: 'Negotiation Mastery, Persuasive Alignment & Stakeholder Buy-In',
    provider: 'GANS Leadership Academy',
    duration: '2 Days (16 Hours)',
    deliveryMethod: 'Workshop',
    description: 'Securing alignment from reluctant internal departments, principled negotiation techniques, and win-win outcome design.'
  },

  // Behavioral Competency 6: Accountability (BC-06)
  'sk_beh_6_1': {
    courseCode: 'GANS-LND-AC-601',
    title: 'Personal Ownership, Professional Integrity & Follow-Through',
    provider: 'GANS Professional Standards Directorate',
    duration: '14 Hours',
    deliveryMethod: 'Classroom',
    description: 'Taking uncompromising responsibility for task execution, eliminating blame culture, and seeing commitments through to completion.'
  },
  'sk_beh_6_2': {
    courseCode: 'GANS-LND-AC-602',
    title: 'Ethical Governance, Compliance Rigor & Aviation Regulatory Integrity',
    provider: 'GANS Legal & Governance Bureau',
    duration: '16 Hours',
    deliveryMethod: 'Classroom',
    description: 'Upholding strict compliance with aviation safety protocols, ethics guidelines, anti-corruption rules, and statutory laws.'
  },
  'sk_beh_6_3': {
    courseCode: 'GANS-LND-AC-603',
    title: 'Transparent Reporting, Risk Disclosure & Operational Accountability',
    provider: 'GANS Risk & Audit Directorate',
    duration: '2 Days (14 Hours)',
    deliveryMethod: 'Workshop',
    description: 'Early identification and open reporting of operational vulnerabilities, maintaining transparent status tracking and audits.'
  },
  'sk_beh_6_4': {
    courseCode: 'GANS-LND-AC-604',
    title: 'Reliability & Delivery in High-Stakes Operational Commitments',
    provider: 'GANS Operations Academy',
    duration: '16 Hours',
    deliveryMethod: 'Classroom',
    description: 'Honoring commitments during critical deadlines, managing contingency reserves, and earning trusted operational credibility.'
  },
  'sk_beh_6_5': {
    courseCode: 'GANS-LND-AC-605',
    title: 'Blameless Error Analysis, Corrective Action Planning & Recovery',
    provider: 'GANS Quality & Safety Management',
    duration: '2 Days (16 Hours)',
    deliveryMethod: 'Classroom',
    description: 'Fostering psychological safety, conducting blameless post-mortems, owning missteps constructively, and executing corrective CAPA.'
  },
  'sk_beh_6_6': {
    courseCode: 'GANS-LND-AC-606',
    title: 'Upholding Peer & Subordinate Mutual Accountability in Teams',
    provider: 'GANS Management Center',
    duration: '2 Days (14 Hours)',
    deliveryMethod: 'Workshop',
    description: 'Establishing shared team standards, conducting mutual check-ins, and lovingly holding colleagues accountable for excellence.'
  },

  // Behavioral Competency 7: Learning Agility (BC-07)
  'sk_beh_7_1': {
    courseCode: 'GANS-LND-LA-701',
    title: 'Rapid Skill Acquisition, Self-Directed Learning & Research Mastery',
    provider: 'GANS Learning & Talent Institute',
    duration: '2 Days (16 Hours)',
    deliveryMethod: 'Blended',
    description: 'Mastering techniques for rapidly absorbing unfamiliar domain knowledge, extracting key principles, and practicing self-study.'
  },
  'sk_beh_7_2': {
    courseCode: 'GANS-LND-LA-702',
    title: 'Growth Mindset, Curiosity Cultivation & Innovation Readiness',
    provider: 'GANS Innovation & Culture Center',
    duration: '14 Hours',
    deliveryMethod: 'Workshop',
    description: 'Transforming fixed mindsets, embracing complex workplace puzzles as learning grounds, and testing experimental approaches.'
  },
  'sk_beh_7_3': {
    courseCode: 'GANS-LND-LA-703',
    title: 'Reflective Practice, Feedback Integration & Continuous Adaptation',
    provider: 'GANS Professional Growth Academy',
    duration: '14 Hours',
    deliveryMethod: 'Workshop',
    description: 'Conducting structured self-reflection after operational cycles, actively soliciting 360-degree feedback, and modifying habits.'
  },
  'sk_beh_7_4': {
    courseCode: 'GANS-LND-LA-704',
    title: 'Cross-Domain Knowledge Transfer to Novel Operational Scenarios',
    provider: 'GANS Strategic Capability Center',
    duration: '2 Days (16 Hours)',
    deliveryMethod: 'Classroom',
    description: 'Applying insights from aviation, logistics, and retail to novel, unprecedented challenges in unfamiliar operating environments.'
  },
  'sk_beh_7_5': {
    courseCode: 'GANS-LND-LA-705',
    title: 'Unlearning Obsolete Legacy Practices & Agile Experimentation',
    provider: 'GANS Operational Transformation Hub',
    duration: '16 Hours',
    deliveryMethod: 'Workshop',
    description: 'Letting go of outdated manual workarounds and adopting modern automated protocols through structured safe-to-fail trials.'
  },
  'sk_beh_7_6': {
    courseCode: 'GANS-LND-LA-706',
    title: 'Future-Proofing Competencies & Strategic Self-Development Planning',
    provider: 'GANS Executive Talent Directorate',
    duration: '2 Days (16 Hours)',
    deliveryMethod: 'Workshop',
    description: 'Forecasting evolving industry skills requirements, drafting proactive 3-year individual development roadmaps, and lifelong learning.'
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
