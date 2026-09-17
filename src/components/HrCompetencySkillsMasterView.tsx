import React, { useState, useMemo, useEffect } from 'react';
import { Competency, CompetencyCategory, Skill, ProficiencyLevel } from '../types';
import {
  Layers,
  PlusCircle,
  Search,
  Trash2,
  X,
  Tag,
  Briefcase,
  Building2,
  GraduationCap,
  Sparkles,
  BookOpen,
  Award,
  Network,
  BadgeCheck,
  ChevronDown,
  Upload,
  Download,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

const DEPARTMENT_LIST = [
  'Operations',
  'ATM Operations',
  'Sales',
  'Accounts',
  'HR & Administration',
  'Talent Development',
  'Systems Engineering',
  'Quality Management',
  'IT Infrastructure',
  'Safety & Compliance',
  'Engineering'
];

const DIVISION_LIST = [
  'Air Traffic Management (ATM)',
  'Technical Services & Engineering',
  'Airport & Retail Operations',
  'Logistics & Supply Chain',
  'People & Organization Development',
  'Finance, Accounts & Commercial',
  'Quality & Operational Excellence',
  'IT Infrastructure & Cyber Systems',
  'Aviation Safety & Regulatory Compliance',
  'Corporate Strategy & Governance'
];

const GRADE_LIST = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

const ROLE_LIST = [
  'Air Traffic Controller',
  'Senior Air Traffic Controller',
  'ATM Shift Supervisor',
  'Operations Executive',
  'Store Manager',
  'Retail Team Leader',
  'Sales Manager',
  'Accountant',
  'Systems Engineer',
  'Quality Assurance Specialist',
  'HR Specialist',
  'Specialist - Performance Management',
  'Talent Development Lead',
  'Training Coordinator',
  'Finance & Accounts Analyst',
  'Safety & Compliance Officer'
];

// Curated competencies for Functional
const FUNCTIONAL_COMPETENCY_SUGGESTIONS = [
  'Operational Excellence',
  'Process Management',
  'Technical Knowledge',
  'Business Analysis',
  'Performance Management',
  'Quality Management',
  'Airspace & ATM Operations',
  'Aviation Safety & Risk Compliance',
  'CNS Systems & Radar Engineering',
  'Logistics & Retail Operations'
];

// Curated competencies for Behavioral
const BEHAVIORAL_COMPETENCY_SUGGESTIONS = [
  'Leadership',
  'Communication',
  'Customer Focus',
  'Problem Solving',
  'Teamwork',
  'Adaptability & Resilience',
  'Strategic Thinking & Visioning',
  'Stakeholder Engagement & Influence',
  'Critical Decision Making & Integrity'
];

// Exactly 7 curated skills for Functional
const FUNCTIONAL_SKILL_SUGGESTIONS = [
  'Inventory & Stock Optimization',
  'Store Workflow Automation',
  'SLA & Metrics Performance Tracking',
  'Supply Chain Agility & Replenishment',
  'Process Audit & Compliance Verification',
  'Airspace Surveillance & Conflict Management',
  'Safety Management System (SMS) Compliance'
];

// Exactly 7 curated skills for Behavioral
const BEHAVIORAL_SKILL_SUGGESTIONS = [
  'Strategic Thinking & Visioning',
  'Stakeholder Influence & Negotiation',
  'High-Performance Team Leadership',
  'Cross-Functional Collaboration',
  'Critical Incident Decision Making',
  'Emotional Intelligence & Resilient Leadership',
  'Change Management & Transformation'
];

const SKILL_COURSE_MAPPING: Record<string, string> = {
  'Inventory & Stock Optimization': 'Advanced Inventory Optimization & Shrinkage Prevention',
  'Store Workflow Automation': 'Store Workflow Automation & Digital Task Orchestration',
  'SLA & Metrics Performance Tracking': 'Operational SLA Governance & Performance Tracking',
  'Supply Chain Agility & Replenishment': 'Supply Chain Agility, Logistics & Fast-Track Replenishment',
  'Process Audit & Compliance Verification': 'Operational Process Audit & Compliance Standards',
  'Airspace Surveillance & Conflict Management': 'Advanced Radar Airspace Surveillance & Conflict Resolution',
  'Safety Management System (SMS) Compliance': 'Aviation Safety Management Systems (SMS) Masterclass',
  'Strategic Thinking & Visioning': 'Executive Strategic Visioning & Horizon Planning',
  'Stakeholder Influence & Negotiation': 'High-Stakes Stakeholder Influence & Negotiation Workshop',
  'High-Performance Team Leadership': 'Leading High-Reliability Teams in Critical Operations',
  'Cross-Functional Collaboration': 'Cross-Departmental Synergy & Collaborative Problem Solving',
  'Critical Incident Decision Making': 'High-Pressure Tactical Decision Making in Live Environments',
  'Emotional Intelligence & Resilient Leadership': 'Emotional Agility & Resilient Leadership Under Stress',
  'Change Management & Transformation': 'Operational Change Management & Agile Transformation'
};

const getCourseByLevelAndSkill = (skill: string, level: ProficiencyLevel): string => {
  const base = skill.trim() || 'Core Capability';
  switch (level) {
    case 'Foundation':
      return `Foundation in ${base} & Standard Operating Procedures`;
    case 'Intermediate':
      return `Applied ${base} & Practical Workflow Management`;
    case 'Proficient':
      return SKILL_COURSE_MAPPING[base] || `Advanced ${base} & Execution Masterclass`;
    case 'Expert':
      return `Strategic ${base} Mastery & Organizational Leadership`;
    default:
      return `${base} Certification`;
  }
};

const PROFICIENCY_LEVELS: ProficiencyLevel[] = ['Foundation', 'Intermediate', 'Proficient', 'Expert'];

const SAMPLE_IMPORT_BATCH: Competency[] = [
  {
    id: 'comp_imp_001',
    code: 'COMP-SAF-001',
    name: 'Aviation Safety & Crisis Management',
    category: 'Functional',
    department: 'Safety & Compliance',
    division: 'Aviation Safety & Regulatory Compliance',
    grade: '8',
    role: 'Safety & Compliance Officer',
    proficiency: 'Proficient',
    recommendedCourse: 'High-Risk Incident & Crisis Management Protocol Masterclass',
    description: 'Framework for managing aviation airside safety risks, regulatory compliance, and incident response.',
    skills: [
      {
        id: 'sk_imp_001_1',
        code: 'COMP-SAF-001-SK01',
        name: 'Safety Management Systems (SMS) Audit Fundamentals',
        description: 'Proficiency: Foundation. Role(s): Safety & Compliance Officer. Safety & Compliance | Grade 8.',
        category: 'Functional',
        competencyId: 'comp_imp_001'
      },
      {
        id: 'sk_imp_001_2',
        code: 'COMP-SAF-001-SK02',
        name: 'Operational Risk Assessment & Ramp Safety Inspection',
        description: 'Proficiency: Intermediate. Role(s): Safety & Compliance Officer. Safety & Compliance | Grade 8.',
        category: 'Functional',
        competencyId: 'comp_imp_001'
      },
      {
        id: 'sk_imp_001_3',
        code: 'COMP-SAF-001-SK03',
        name: 'Crisis Command & Emergency Response Management',
        description: 'Proficiency: Proficient. Role(s): Safety & Compliance Officer. Course: High-Risk Incident & Crisis Management Protocol Masterclass. Safety & Compliance | Grade 8.',
        category: 'Functional',
        competencyId: 'comp_imp_001'
      },
      {
        id: 'sk_imp_001_4',
        code: 'COMP-SAF-001-SK04',
        name: 'Aviation Safety Strategic Oversight & Regulatory Defense',
        description: 'Proficiency: Expert. Role(s): Safety & Compliance Officer. Safety & Compliance | Grade 8.',
        category: 'Functional',
        competencyId: 'comp_imp_001'
      }
    ]
  },
  {
    id: 'comp_imp_002',
    code: 'COMP-RET-002',
    name: 'Merchandise Planning & Inventory Optimization',
    category: 'Functional',
    department: 'Sales',
    division: 'Airport & Retail Operations',
    grade: '6',
    role: 'Store Manager',
    proficiency: 'Proficient',
    recommendedCourse: 'Advanced Retail Demand Planning & SKU Replenishment',
    description: 'Commercial inventory optimization, stock replenishment algorithms, and store merchandising.',
    skills: [
      {
        id: 'sk_imp_002_1',
        code: 'COMP-RET-002-SK01',
        name: 'Store Stock Auditing & SKU Replenishment',
        description: 'Proficiency: Foundation. Role(s): Store Manager. Sales | Grade 6.',
        category: 'Functional',
        competencyId: 'comp_imp_002'
      },
      {
        id: 'sk_imp_002_2',
        code: 'COMP-RET-002-SK02',
        name: 'Visual Merchandising & Demand Forecasting',
        description: 'Proficiency: Intermediate. Role(s): Store Manager. Sales | Grade 6.',
        category: 'Functional',
        competencyId: 'comp_imp_002'
      },
      {
        id: 'sk_imp_002_3',
        code: 'COMP-RET-002-SK03',
        name: 'Assortment Strategy & Inventory Turn Optimization',
        description: 'Proficiency: Proficient. Role(s): Store Manager. Course: Advanced Retail Demand Planning & SKU Replenishment. Sales | Grade 6.',
        category: 'Functional',
        competencyId: 'comp_imp_002'
      },
      {
        id: 'sk_imp_002_4',
        code: 'COMP-RET-002-SK04',
        name: 'Multi-Store Retail Commercial P&L Mastery',
        description: 'Proficiency: Expert. Role(s): Store Manager. Sales | Grade 6.',
        category: 'Functional',
        competencyId: 'comp_imp_002'
      }
    ]
  },
  {
    id: 'comp_imp_003',
    code: 'COMP-BEH-003',
    name: 'Stakeholder Collaboration & Influence',
    category: 'Behavioral',
    department: 'HR & Administration',
    division: 'Corporate Strategy & Governance',
    grade: '7',
    role: 'Specialist - Performance Management',
    proficiency: 'Proficient',
    recommendedCourse: 'Strategic Stakeholder Alignment & Executive Influence Masterclass',
    description: 'Multi-department stakeholder management, cross-functional consensus building, and executive alignment.',
    skills: [
      {
        id: 'sk_imp_003_1',
        code: 'COMP-BEH-003-SK01',
        name: 'Cross-Functional Workplace Communication',
        description: 'Proficiency: Foundation. Role(s): Specialist - Performance Management. HR & Administration | Grade 7.',
        category: 'Behavioral',
        competencyId: 'comp_imp_003'
      },
      {
        id: 'sk_imp_003_2',
        code: 'COMP-BEH-003-SK02',
        name: 'Negotiation & Constructive Conflict Resolution',
        description: 'Proficiency: Intermediate. Role(s): Specialist - Performance Management. HR & Administration | Grade 7.',
        category: 'Behavioral',
        competencyId: 'comp_imp_003'
      },
      {
        id: 'sk_imp_003_3',
        code: 'COMP-BEH-003-SK03',
        name: 'Executive Influence & Multi-Department Alignment',
        description: 'Proficiency: Proficient. Role(s): Specialist - Performance Management. Course: Strategic Stakeholder Alignment & Executive Influence Masterclass. HR & Administration | Grade 7.',
        category: 'Behavioral',
        competencyId: 'comp_imp_003'
      },
      {
        id: 'sk_imp_003_4',
        code: 'COMP-BEH-003-SK04',
        name: 'Strategic Coalition Building & Cultural Transformation',
        description: 'Proficiency: Expert. Role(s): Specialist - Performance Management. HR & Administration | Grade 7.',
        category: 'Behavioral',
        competencyId: 'comp_imp_003'
      }
    ]
  }
];

interface HrCompetencySkillsMasterViewProps {
  competencies: Competency[];
  onAddCompetency: (comp: Competency) => void;
  onImportCompetencies?: (comps: Competency[]) => void;
  onDeleteCompetency?: (compId: string) => void;
  onAddSkill?: (competencyId: string, skillId: Skill) => void;
  onDeleteSkill?: (competencyId: string, skillId: string) => void;
}

interface ProficiencyMappingRow {
  proficiency: ProficiencyLevel;
  roles: string[];
  recommendedCourse: string;
}

interface UnifiedTableRow {
  id: string;
  competencyId: string;
  skillId?: string;
  department: string;
  division: string;
  grade: string;
  category: CompetencyCategory;
  competencyName: string;
  skillName: string;
  proficiency: ProficiencyLevel;
  role: string;
  recommendedCourse: string;
  description: string;
}

export const HrCompetencySkillsMasterView: React.FC<HrCompetencySkillsMasterViewProps> = ({
  competencies,
  onAddCompetency,
  onImportCompetencies,
  onDeleteCompetency,
  onDeleteSkill
}) => {
  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | CompetencyCategory>('ALL');
  const [selectedDeptFilter, setSelectedDeptFilter] = useState<string>('ALL');
  const [selectedDivFilter, setSelectedDivFilter] = useState<string>('ALL');

  // Modals / Dialogs
  const [showAddModal, setShowAddModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importFeedback, setImportFeedback] = useState<string | null>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const [stagedCompetencies, setStagedCompetencies] = useState<Competency[]>(SAMPLE_IMPORT_BATCH);

  const [openRoleRowIndex, setOpenRoleRowIndex] = useState<number | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ compId: string; skillId?: string; name: string } | null>(null);

  // Form State Layout:
  // Row 1: Department | Division
  // Row 2: Grade      | Category
  // Row 3: Competency | Skill
  const [department, setDepartment] = useState('Operations');
  const [division, setDivision] = useState(DIVISION_LIST[0]);
  const [grade, setGrade] = useState(GRADE_LIST[0]);
  const [category, setCategory] = useState<CompetencyCategory>('Functional');
  const [competencySelection, setCompetencySelection] = useState<string>(FUNCTIONAL_COMPETENCY_SUGGESTIONS[0]);
  const [customCompetency, setCustomCompetency] = useState('');
  const [skillSelection, setSkillSelection] = useState<string>(FUNCTIONAL_SKILL_SUGGESTIONS[0]);
  const [customSkill, setCustomSkill] = useState('');
  const [description, setDescription] = useState('');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // 4 Fixed Proficiency Rows: Foundation, Intermediate, Proficient, Expert (recommendedCourse left blank)
  const [proficiencyMappings, setProficiencyMappings] = useState<ProficiencyMappingRow[]>([
    {
      proficiency: 'Foundation',
      roles: [],
      recommendedCourse: ''
    },
    {
      proficiency: 'Intermediate',
      roles: [],
      recommendedCourse: ''
    },
    {
      proficiency: 'Proficient',
      roles: [],
      recommendedCourse: ''
    },
    {
      proficiency: 'Expert',
      roles: [],
      recommendedCourse: ''
    }
  ]);

  // Curated competencies per category
  const availableCompetencies = useMemo(() => {
    return category === 'Functional' ? FUNCTIONAL_COMPETENCY_SUGGESTIONS : BEHAVIORAL_COMPETENCY_SUGGESTIONS;
  }, [category]);

  // Curated skills per category and selected competency
  const availableSkills = useMemo(() => {
    const selectedCompName =
      competencySelection === '__CUSTOM__' ? customCompetency.trim() : competencySelection;

    const existingComp = competencies.find(
      (c) => c.name.toLowerCase() === selectedCompName.toLowerCase()
    );

    const fromComp = existingComp ? existingComp.skills.map((s) => s.name) : [];
    const baseSuggestions =
      category === 'Functional' ? FUNCTIONAL_SKILL_SUGGESTIONS : BEHAVIORAL_SKILL_SUGGESTIONS;

    return Array.from(new Set([...fromComp, ...baseSuggestions]));
  }, [category, competencySelection, customCompetency, competencies]);

  // Automatically close open role dropdown when clicking outside or pressing Escape
  useEffect(() => {
    if (openRoleRowIndex === null) return;

    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      const target = event.target as HTMLElement | null;
      if (target && !target.closest('[data-role-dropdown-container]')) {
        setOpenRoleRowIndex(null);
      }
    };

    const handleFocusIn = (event: FocusEvent) => {
      const target = event.target as HTMLElement | null;
      if (target && !target.closest('[data-role-dropdown-container]')) {
        setOpenRoleRowIndex(null);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpenRoleRowIndex(null);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('touchstart', handlePointerDown);
    document.addEventListener('focusin', handleFocusIn);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('touchstart', handlePointerDown);
      document.removeEventListener('focusin', handleFocusIn);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [openRoleRowIndex]);

  const handleToggleRole = (rowIndex: number, roleName: string) => {
    setProficiencyMappings((prev) =>
      prev.map((row, i) => {
        if (i !== rowIndex) return row;
        const exists = row.roles.includes(roleName);
        const nextRoles = exists
          ? row.roles.filter((r) => r !== roleName)
          : [...row.roles, roleName];
        return { ...row, roles: nextRoles };
      })
    );
  };

  const handleUpdateCourse = (index: number, value: string) => {
    setProficiencyMappings((prev) =>
      prev.map((row, i) => (i === index ? { ...row, recommendedCourse: value } : row))
    );
  };

  // Transform competencies into unified table rows
  const tableRows = useMemo<UnifiedTableRow[]>(() => {
    const rows: UnifiedTableRow[] = [];

    competencies.forEach((comp) => {
      const compDept = comp.department || 'Operations';
      const compDiv = comp.division || 'Air Traffic Management (ATM)';
      const compGrade = comp.grade && comp.grade !== 'All Grades (Cross-Band)' ? comp.grade : '';
      const compRole = comp.role || 'All Roles / Cross-Functional';

      if (!comp.skills || comp.skills.length === 0) {
        rows.push({
          id: comp.id,
          competencyId: comp.id,
          department: compDept,
          division: compDiv,
          grade: compGrade,
          category: comp.category,
          competencyName: comp.name,
          skillName: 'General Competency Standard',
          proficiency: 'Proficient',
          role: compRole,
          recommendedCourse: comp.recommendedCourse || getCourseByLevelAndSkill(comp.name, 'Proficient'),
          description: comp.description
        });
      } else {
        comp.skills.forEach((sk) => {
          let prof: ProficiencyLevel = 'Proficient';
          if (sk.description?.includes('Expert')) prof = 'Expert';
          else if (sk.description?.includes('Foundation')) prof = 'Foundation';
          else if (sk.description?.includes('Intermediate')) prof = 'Intermediate';

          let courseName = getCourseByLevelAndSkill(sk.name, prof);
          if (sk.description && sk.description.includes('Course:')) {
            const match = sk.description.match(/Course:\s*([^.]+)/);
            if (match && match[1]) courseName = match[1].trim();
          }

          rows.push({
            id: `${comp.id}_${sk.id}`,
            competencyId: comp.id,
            skillId: sk.id,
            department: compDept,
            division: compDiv,
            grade: compGrade,
            category: comp.category,
            competencyName: comp.name,
            skillName: sk.name,
            proficiency: prof,
            role: compRole,
            recommendedCourse: courseName,
            description: sk.description || comp.description
          });
        });
      }
    });

    return rows;
  }, [competencies]);

  // Filtered rows for the single table
  const filteredRows = useMemo(() => {
    return tableRows.filter((row) => {
      if (selectedCategory !== 'ALL' && row.category !== selectedCategory) return false;
      if (selectedDeptFilter !== 'ALL' && row.department !== selectedDeptFilter) return false;
      if (selectedDivFilter !== 'ALL' && row.division !== selectedDivFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchComp = row.competencyName.toLowerCase().includes(q);
        const matchSkill = row.skillName.toLowerCase().includes(q);
        const matchDept = row.department.toLowerCase().includes(q);
        const matchDiv = row.division.toLowerCase().includes(q);
        const matchRole = row.role.toLowerCase().includes(q);
        const matchCourse = row.recommendedCourse.toLowerCase().includes(q);
        if (!matchComp && !matchSkill && !matchDept && !matchDiv && !matchRole && !matchCourse) return false;
      }
      return true;
    });
  }, [tableRows, selectedCategory, selectedDeptFilter, selectedDivFilter, searchQuery]);

  // Statistics
  const totalCompetenciesCount = competencies.length;
  const functionalCount = competencies.filter((c) => c.category === 'Functional').length;
  const behavioralCount = competencies.filter((c) => c.category === 'Behavioral').length;

  // Handle Save
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!department.trim()) errs.department = 'Department is required';
    if (!division.trim()) errs.division = 'Division is required';
    if (!grade.trim()) errs.grade = 'Grade is required';

    const finalCompName =
      competencySelection === '__CUSTOM__' ? customCompetency.trim() : (competencySelection || '').trim();
    if (!finalCompName) {
      errs.competency = 'Competency is required';
    }

    const finalSkillName =
      skillSelection === '__CUSTOM__' ? customSkill.trim() : (skillSelection || '').trim();

    if (!finalSkillName) {
      errs.skill = 'Skill name is required';
    }

    if (Object.keys(errs).length > 0) {
      setFormErrors(errs);
      return;
    }

    const compPrefix = category === 'Functional' ? 'FC' : 'BC';
    const autoCode = `${compPrefix}-${Math.floor(10 + Math.random() * 90)}`;
    const newId = `comp_${Date.now()}`;

    // Build skills array from all 4 proficiency mapping rows
    const newSkills: Skill[] = proficiencyMappings.map((mrow, idx) => ({
      id: `sk_${newId}_${idx + 1}`,
      code: `${autoCode}-SK0${idx + 1}`,
      name: finalSkillName,
      description: `Proficiency: ${mrow.proficiency}.${mrow.roles.length > 0 ? ` Role(s): ${mrow.roles.join(', ')}.` : ''}${mrow.recommendedCourse.trim() ? ` Course: ${mrow.recommendedCourse.trim()}.` : ''} ${department} | ${division} | Grade ${grade}.`,
      category,
      competencyId: newId
    }));

    const designatedRole =
      proficiencyMappings[2]?.roles.join(', ') ||
      proficiencyMappings.find((m) => m.roles.length > 0)?.roles.join(', ') ||
      'General';

    const newComp: Competency = {
      id: newId,
      code: autoCode,
      name: finalCompName,
      category,
      department,
      division,
      grade,
      role: designatedRole,
      proficiency: 'Proficient',
      recommendedCourse: proficiencyMappings[2]?.recommendedCourse || '',
      description: description.trim() || `${finalCompName} mapped across proficiencies for ${division} (${department}).`,
      skills: newSkills
    };

    onAddCompetency(newComp);
    setShowAddModal(false);

    // Reset Form
    setDepartment('Operations');
    setDivision(DIVISION_LIST[0]);
    setGrade(GRADE_LIST[0]);
    setCategory('Functional');
    setCompetencySelection(FUNCTIONAL_COMPETENCY_SUGGESTIONS[0]);
    setCustomCompetency('');
    setSkillSelection(FUNCTIONAL_SKILL_SUGGESTIONS[0]);
    setCustomSkill('');
    setDescription('');
    setProficiencyMappings([
      { proficiency: 'Foundation', roles: [], recommendedCourse: '' },
      { proficiency: 'Intermediate', roles: [], recommendedCourse: '' },
      { proficiency: 'Proficient', roles: [], recommendedCourse: '' },
      { proficiency: 'Expert', roles: [], recommendedCourse: '' }
    ]);
    setFormErrors({});
    setOpenRoleRowIndex(null);
  };

  // Bulk Import Handlers
  const handleDownloadSampleTemplate = () => {
    const headers = 'Category,Competency Code,Competency Name,Department,Division,Grade,Role,Proficiency,Recommended Course,Description,Skill 1,Skill 2,Skill 3,Skill 4\n';
    const sampleRows = [
      'Functional,COMP-SAF-001,Aviation Safety & Crisis Management,Safety & Compliance,Aviation Safety & Regulatory Compliance,8,Safety & Compliance Officer,Proficient,High-Risk Incident & Crisis Management Protocol Masterclass,Framework for managing aviation airside safety risks.,Safety Management Systems (SMS) Audit Fundamentals,Operational Risk Assessment & Ramp Safety Inspection,Crisis Command & Emergency Response Management,Aviation Safety Strategic Oversight & Regulatory Defense',
      'Functional,COMP-RET-002,Merchandise Planning & Inventory Optimization,Sales,Airport & Retail Operations,6,Store Manager,Proficient,Advanced Retail Demand Planning & SKU Replenishment,Commercial inventory optimization.,Store Stock Auditing & SKU Replenishment,Visual Merchandising & Demand Forecasting,Assortment Strategy & Inventory Turn Optimization,Multi-Store Retail Commercial P&L Mastery',
      'Behavioral,COMP-BEH-003,Stakeholder Collaboration & Influence,HR & Administration,Corporate Strategy & Governance,7,Specialist - Performance Management,Proficient,Strategic Stakeholder Alignment & Executive Influence Masterclass,Multi-department stakeholder management.,Cross-Functional Workplace Communication,Negotiation & Constructive Conflict Resolution,Executive Influence & Multi-Department Alignment,Strategic Coalition Building & Cultural Transformation'
    ].join('\n');

    const blob = new Blob([headers + sampleRows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'competency_skills_import_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImportError(null);
    setImportFeedback(null);
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const text = evt.target?.result as string;
        if (!text) {
          setImportError('Uploaded file appears empty or unreadable.');
          return;
        }

        const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
        if (lines.length <= 1) {
          setImportError('No data rows found in the uploaded file.');
          return;
        }

        const parsed: Competency[] = [];
        for (let i = 1; i < lines.length; i++) {
          const cols = lines[i].split(',').map((c) => c.trim());
          if (cols.length < 3 || !cols[2]) continue;

          const cat = (cols[0] === 'Behavioral' ? 'Behavioral' : 'Functional') as CompetencyCategory;
          const code = cols[1] || `COMP-IMP-${100 + i}`;
          const name = cols[2];
          const dept = cols[3] || 'Operations';
          const div = cols[4] || DIVISION_LIST[0];
          const grd = cols[5] || '1';
          const rle = cols[6] || 'All Roles / Cross-Functional';
          const prof = (cols[7] as ProficiencyLevel) || 'Proficient';
          const crse = cols[8] || '';
          const desc = cols[9] || `${name} imported framework.`;

          const compId = `comp_csv_${Date.now()}_${i}`;
          const skillNames = [cols[10], cols[11], cols[12], cols[13]].filter(Boolean);
          const rawSkills = skillNames.length > 0 ? skillNames : [`Core ${name} Skill`];

          const skillsList: Skill[] = rawSkills.map((skName, sIdx) => ({
            id: `sk_csv_${compId}_${sIdx + 1}`,
            code: `${code}-SK0${sIdx + 1}`,
            name: skName || `${name} Level ${sIdx + 1}`,
            description: `Proficiency: ${PROFICIENCY_LEVELS[sIdx % 4]}. Role: ${rle}. ${dept} | Grade ${grd}.`,
            category: cat,
            competencyId: compId
          }));

          parsed.push({
            id: compId,
            code,
            name,
            category: cat,
            department: dept,
            division: div,
            grade: grd,
            role: rle,
            proficiency: prof,
            recommendedCourse: crse,
            description: desc,
            skills: skillsList
          });
        }

        if (parsed.length === 0) {
          setImportError('Could not extract valid competency records. Please check the CSV format.');
          return;
        }

        setStagedCompetencies(parsed);
        setImportFeedback(`Parsed ${parsed.length} competencies (${parsed.reduce((acc, c) => acc + c.skills.length, 0)} mapped skills) from CSV.`);
      } catch (err) {
        setImportError('Failed to parse CSV file. Please check formatting.');
      }
    };
    reader.readAsText(file);
  };

  const handleConfirmImport = () => {
    if (stagedCompetencies.length === 0) {
      setImportError('No staged records to import.');
      return;
    }

    if (onImportCompetencies) {
      onImportCompetencies(stagedCompetencies);
    } else {
      stagedCompetencies.forEach((c) => onAddCompetency(c));
    }

    setImportFeedback(`Successfully imported ${stagedCompetencies.length} competencies into the master catalog!`);
    setTimeout(() => {
      setShowImportModal(false);
      setImportFeedback(null);
      setImportError(null);
      setStagedCompetencies(SAMPLE_IMPORT_BATCH);
    }, 1200);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12">
      {/* Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1a5075] via-[#104060] to-[#0d2f47] p-5 sm:p-6 text-white shadow-[0_12px_36px_-6px_rgba(26,80,117,0.35)] border border-white/20 backdrop-blur-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="absolute -right-8 -top-8 w-56 h-56 bg-sky-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 -bottom-10 w-48 h-48 bg-teal-400/15 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10">
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2.5 drop-shadow-xs">
            <div className="p-2 rounded-xl bg-white/15 border border-white/20 shadow-inner">
              <Layers className="w-5 h-5 text-sky-300" />
            </div>
            <span>Competency &amp; Skills Master</span>
          </h1>
        </div>

        <div className="flex items-center gap-2.5 relative z-10 shrink-0">
          <button
            type="button"
            onClick={() => {
              setImportFeedback(null);
              setImportError(null);
              setStagedCompetencies(SAMPLE_IMPORT_BATCH);
              setShowImportModal(true);
            }}
            className="px-4 py-2.5 bg-white/15 hover:bg-white/25 text-white font-extrabold text-xs rounded-xl flex items-center gap-2 border border-white/20 transition-all cursor-pointer active:scale-95 shadow-2xs backdrop-blur-xs"
          >
            <Upload className="w-4 h-4 text-sky-300" />
            <span>Import</span>
          </button>

          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="px-5 py-2.5 bg-gradient-to-r from-[#0275a8] to-sky-600 hover:from-[#02628d] hover:to-sky-500 text-white font-extrabold text-xs rounded-xl flex items-center gap-2 shadow-md shadow-sky-950/20 transition-all cursor-pointer active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Competency &amp; Skill</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl bg-white/85 backdrop-blur-xl border border-white/80 p-4.5 shadow-[0_8px_30px_rgb(26,80,117,0.05)] hover:shadow-md transition-all">
          <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-tight block">
            Total Competencies
          </span>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 tracking-tight">{totalCompetenciesCount}</div>
        </div>
        <div className="rounded-2xl bg-white/85 backdrop-blur-xl border border-white/80 p-4.5 shadow-[0_8px_30px_rgb(26,80,117,0.05)] hover:shadow-md transition-all">
          <span className="text-[10px] font-extrabold text-sky-700 uppercase tracking-tight block">
            Functional Competencies
          </span>
          <div className="text-2xl sm:text-3xl font-black text-sky-700 mt-1 tracking-tight">{functionalCount}</div>
        </div>
        <div className="rounded-2xl bg-white/85 backdrop-blur-xl border border-white/80 p-4.5 shadow-[0_8px_30px_rgb(26,80,117,0.05)] hover:shadow-md transition-all">
          <span className="text-[10px] font-extrabold text-emerald-700 uppercase tracking-tight block">
            Behavioral Competencies
          </span>
          <div className="text-2xl sm:text-3xl font-black text-emerald-700 mt-1 tracking-tight">{behavioralCount}</div>
        </div>
      </div>

      {/* SINGLE UNIFIED TABLE CONTAINER */}
      <div className="rounded-2xl bg-white/85 backdrop-blur-xl border border-white/80 shadow-[0_8px_30px_rgb(26,80,117,0.05)] overflow-hidden">
        {/* Table Filter & Search Toolbar */}
        <div className="p-4 bg-slate-50/70 border-b border-slate-200/80 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by competency, skill, department, division, role or course..."
              className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 shadow-inner focus:outline-hidden focus:ring-2 focus:ring-[#0275a8]/20 focus:border-[#0275a8]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Category Filter */}
            <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 shadow-2xs">
              <button
                type="button"
                onClick={() => setSelectedCategory('ALL')}
                className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                  selectedCategory === 'ALL'
                    ? 'bg-[#1a5075] text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setSelectedCategory('Functional')}
                className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                  selectedCategory === 'Functional'
                    ? 'bg-sky-700 text-white shadow-xs'
                    : 'text-sky-800 hover:bg-sky-50'
                }`}
              >
                Functional
              </button>
              <button
                type="button"
                onClick={() => setSelectedCategory('Behavioral')}
                className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                  selectedCategory === 'Behavioral'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'text-emerald-800 hover:bg-emerald-50'
                }`}
              >
                Behavioral
              </button>
            </div>

            {/* Department Dropdown Filter */}
            <select
              value={selectedDeptFilter}
              onChange={(e) => setSelectedDeptFilter(e.target.value)}
              className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-700 font-bold focus:outline-hidden focus:ring-2 focus:ring-[#0275a8]/20 shadow-2xs cursor-pointer"
            >
              <option value="ALL">All Departments</option>
              {DEPARTMENT_LIST.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>

            {/* Division Dropdown Filter */}
            <select
              value={selectedDivFilter}
              onChange={(e) => setSelectedDivFilter(e.target.value)}
              className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-700 font-bold focus:outline-hidden focus:ring-2 focus:ring-[#0275a8]/20 shadow-2xs cursor-pointer"
            >
              <option value="ALL">All Divisions</option>
              {DIVISION_LIST.map((dv) => (
                <option key={dv} value={dv}>
                  {dv}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Unified Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f0f7fb]/90 backdrop-blur-xs text-[#1a5075] border-b border-[#c8d8e5] text-[11px] font-extrabold uppercase tracking-wider">
                <th className="py-3.5 px-3 w-10 text-center border-r border-slate-200/80">#</th>
                <th className="py-3.5 px-3 min-w-[130px] border-r border-slate-200/80">Department</th>
                <th className="py-3.5 px-3 min-w-[140px] border-r border-slate-200/80">Division</th>
                <th className="py-3.5 px-3 min-w-[90px] border-r border-slate-200/80">Category</th>
                <th className="py-3.5 px-3 min-w-[180px] border-r border-slate-200/80">Competency</th>
                <th className="py-3.5 px-3 min-w-[180px] border-r border-slate-200/80">Skill</th>
                <th className="py-3.5 px-3 min-w-[100px] border-r border-slate-200/80">Proficiency</th>
                <th className="py-3.5 px-3 min-w-[150px] border-r border-slate-200/80">Role</th>
                <th className="py-3.5 px-3 min-w-[210px] border-r border-slate-200/80">Recommended Course</th>
                <th className="py-3.5 px-3 w-14 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {filteredRows.length === 0 ? (
                <tr>
                  <td colSpan={10} className="text-center py-12 text-slate-400 bg-white/50">
                    <Layers className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="font-bold text-slate-600">No competency or skill records found</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Click "Add Competency &amp; Skill" above to add new records.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredRows.map((row, idx) => {
                  const isFunctional = row.category === 'Functional';
                  return (
                    <tr
                      key={row.id}
                      className={`hover:bg-sky-50/50 transition-colors group ${
                        idx % 2 === 0 ? 'bg-white/70' : 'bg-[#f8fbfe]/60'
                      }`}
                    >
                      <td className="py-3 px-3 text-center font-bold text-slate-400 border-r border-slate-100">
                        {idx + 1}
                      </td>
                      <td className="py-3 px-3 font-semibold text-slate-800 border-r border-slate-100">
                        <div className="flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{row.department}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3 border-r border-slate-100">
                        <div className="flex flex-col gap-0.5 text-slate-600">
                          <span className="font-medium text-slate-800 truncate max-w-[160px]" title={row.division}>
                            {row.division}
                          </span>
                          {row.grade && row.grade !== 'All Grades (Cross-Band)' && (
                            <span className="text-[10px] text-slate-400 font-medium">
                              {row.grade.startsWith('Grade') ? row.grade : `Grade ${row.grade}`}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-3 border-r border-slate-100">
                        <span
                          className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full inline-block ${
                            isFunctional
                              ? 'bg-sky-100 text-sky-800 border border-sky-300/60'
                              : 'bg-emerald-100 text-emerald-800 border border-emerald-300/60'
                          }`}
                        >
                          {row.category}
                        </span>
                      </td>
                      <td className="py-3 px-3 border-r border-slate-100">
                        <span className="font-extrabold text-slate-900 block leading-snug">
                          {row.competencyName}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-bold text-[#0275a8] border-r border-slate-100">
                        <div className="flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{row.skillName}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3 border-r border-slate-100">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-md inline-block ${
                            row.proficiency === 'Expert'
                              ? 'bg-purple-100 text-purple-800 border border-purple-200'
                              : row.proficiency === 'Proficient'
                              ? 'bg-sky-100 text-sky-800 border border-sky-200'
                              : row.proficiency === 'Intermediate'
                              ? 'bg-amber-100 text-amber-800 border border-amber-200'
                              : 'bg-slate-100 text-slate-700 border border-slate-200'
                          }`}
                        >
                          {row.proficiency}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-600 font-medium border-r border-slate-100">
                        <div className="flex items-center gap-1.5">
                          <Briefcase className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate max-w-[150px]" title={row.role}>
                            {row.role}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-3 border-r border-slate-100">
                        <div className="flex items-center gap-1.5 text-slate-800 font-medium">
                          <BookOpen className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                          <span className="truncate max-w-[210px]" title={row.recommendedCourse}>
                            {row.recommendedCourse}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <button
                          type="button"
                          onClick={() =>
                            setDeleteConfirm({
                              compId: row.competencyId,
                              skillId: row.skillId,
                              name: row.skillName || row.competencyName
                            })
                          }
                          className="p-1.5 text-slate-300 hover:text-red-600 rounded-lg transition-colors cursor-pointer"
                          title="Delete Record"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Summary */}
        <div className="p-3.5 bg-slate-50/80 border-t border-slate-200/80 text-xs text-slate-500 flex items-center justify-between">
          <span>
            Showing <strong>{filteredRows.length}</strong> of <strong>{tableRows.length}</strong> total records
          </span>
          <span className="text-[11px] text-slate-400 font-medium">
            Unified Competency &amp; Skill Registry
          </span>
        </div>
      </div>

      {/* ================= MODAL: ADD NEW COMPETENCY & SKILL ================= */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white/95 backdrop-blur-2xl rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.25)] border border-white/80 w-full max-w-3xl max-h-[92vh] overflow-y-auto animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#1a5075] via-[#154668] to-[#0275a8] text-white px-6 py-4 flex items-center justify-between sticky top-0 z-10">
              <div className="flex items-center gap-2.5">
                <PlusCircle className="w-5 h-5 text-sky-300" />
                <h3 className="font-extrabold text-sm sm:text-base tracking-tight">Add New Competency &amp; Skill</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-white/80 hover:text-white transition-colors cursor-pointer p-1 rounded-lg hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSave} className="p-6 space-y-4.5 text-xs">
              {/* ROW 1: DIVISION | DEPARTMENT */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Division */}
                <div>
                  <label className="block font-extrabold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <Network className="w-3.5 h-3.5 text-[#0275a8]" />
                    <span>Division</span> <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={division}
                    onChange={(e) => setDivision(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 shadow-inner focus:bg-white focus:ring-2 focus:ring-[#0275a8]/20 focus:border-[#0275a8]"
                  >
                    {DIVISION_LIST.map((divItem) => (
                      <option key={divItem} value={divItem}>
                        {divItem}
                      </option>
                    ))}
                  </select>
                  {formErrors.division && (
                    <p className="text-[10px] text-red-600 mt-1">{formErrors.division}</p>
                  )}
                </div>

                {/* Department */}
                <div>
                  <label className="block font-extrabold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-[#0275a8]" />
                    <span>Department</span> <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 shadow-inner focus:bg-white focus:ring-2 focus:ring-[#0275a8]/20 focus:border-[#0275a8]"
                  >
                    {DEPARTMENT_LIST.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                  {formErrors.department && (
                    <p className="text-[10px] text-red-600 mt-1">{formErrors.department}</p>
                  )}
                </div>
              </div>

              {/* ROW 2: GRADE | CATEGORY */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Grade */}
                <div>
                  <label className="block font-extrabold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5 text-[#0275a8]" />
                    <span>Grade</span> <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 shadow-inner focus:bg-white focus:ring-2 focus:ring-[#0275a8]/20 focus:border-[#0275a8]"
                  >
                    {GRADE_LIST.map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </select>
                  {formErrors.grade && (
                    <p className="text-[10px] text-red-600 mt-1">{formErrors.grade}</p>
                  )}
                </div>

                {/* Category */}
                <div>
                  <label className="block font-extrabold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-[#0275a8]" />
                    <span>Category</span> <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={category}
                    onChange={(e) => {
                       const cat = e.target.value as CompetencyCategory;
                       setCategory(cat);
                       const compSuggestions = cat === 'Functional' ? FUNCTIONAL_COMPETENCY_SUGGESTIONS : BEHAVIORAL_COMPETENCY_SUGGESTIONS;
                       setCompetencySelection(compSuggestions[0]);
                       setCustomCompetency('');
                       const skillSuggestions = cat === 'Functional' ? FUNCTIONAL_SKILL_SUGGESTIONS : BEHAVIORAL_SKILL_SUGGESTIONS;
                       setSkillSelection(skillSuggestions[0]);
                       setCustomSkill('');
                    }}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 shadow-inner focus:bg-white focus:ring-2 focus:ring-[#0275a8]/20 focus:border-[#0275a8]"
                  >
                    <option value="Functional">Functional</option>
                    <option value="Behavioral">Behavioral</option>
                  </select>
                </div>
              </div>

              {/* ROW 3: COMPETENCY | SKILL */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Competency Dropdown */}
                <div>
                  <label className="block font-extrabold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-[#0275a8]" />
                    <span>Competency</span> <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={competencySelection}
                    onChange={(e) => {
                      const val = e.target.value;
                      setCompetencySelection(val);
                      if (val !== '__CUSTOM__') {
                        setCustomCompetency('');
                        const found = competencies.find((c) => c.name.toLowerCase() === val.toLowerCase());
                        if (found && found.skills.length > 0) {
                          setSkillSelection(found.skills[0].name);
                          setCustomSkill('');
                        }
                      }
                      if (formErrors.competency) {
                        setFormErrors((prev) => ({ ...prev, competency: '' }));
                      }
                    }}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 shadow-inner focus:bg-white focus:ring-2 focus:ring-[#0275a8]/20 focus:border-[#0275a8]"
                  >
                    {availableCompetencies.map((comp) => (
                      <option key={comp} value={comp}>
                        {comp}
                      </option>
                    ))}
                    <option value="__CUSTOM__">+ Enter Custom Competency Name...</option>
                  </select>

                  {competencySelection === '__CUSTOM__' && (
                    <input
                      type="text"
                      value={customCompetency}
                      onChange={(e) => {
                        setCustomCompetency(e.target.value);
                        if (formErrors.competency) {
                          setFormErrors((prev) => ({ ...prev, competency: '' }));
                        }
                      }}
                      placeholder="Type custom competency name..."
                      className="mt-2 w-full px-3 py-2 text-xs bg-white border border-sky-400 rounded-xl shadow-inner focus:outline-hidden focus:ring-2 focus:ring-sky-500/20"
                      autoFocus
                    />
                  )}
                  {formErrors.competency && (
                    <p className="text-[10px] text-red-600 mt-1">{formErrors.competency}</p>
                  )}
                </div>

                {/* Skill Dropdown */}
                <div>
                  <label className="block font-extrabold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Skill</span> <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={skillSelection}
                    onChange={(e) => {
                      const val = e.target.value;
                      setSkillSelection(val);
                      if (val !== '__CUSTOM__') {
                        setCustomSkill('');
                      }
                      if (formErrors.skill) {
                        setFormErrors((prev) => ({ ...prev, skill: '' }));
                      }
                    }}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 shadow-inner focus:bg-white focus:ring-2 focus:ring-[#0275a8]/20 focus:border-[#0275a8]"
                  >
                    {availableSkills.map((sk) => (
                      <option key={sk} value={sk}>
                        {sk}
                      </option>
                    ))}
                    <option value="__CUSTOM__">+ Enter Custom Skill Name...</option>
                  </select>

                  {skillSelection === '__CUSTOM__' && (
                    <input
                      type="text"
                      value={customSkill}
                      onChange={(e) => {
                        setCustomSkill(e.target.value);
                        if (formErrors.skill) {
                          setFormErrors((prev) => ({ ...prev, skill: '' }));
                        }
                      }}
                      placeholder="Type custom skill name..."
                      className="mt-2 w-full px-3 py-2 text-xs bg-white border border-sky-400 rounded-xl shadow-inner focus:outline-hidden focus:ring-2 focus:ring-sky-500/20"
                      autoFocus
                    />
                  )}
                  {formErrors.skill && (
                    <p className="text-[10px] text-red-600 mt-1">{formErrors.skill}</p>
                  )}
                </div>
              </div>

              {/* ================= PROFICIENCY, ROLE & COURSE MAPPING TABLE (4 FIXED ROWS) ================= */}
              <div className="pt-2 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-[#0275a8]" />
                    <span className="text-xs font-extrabold text-slate-800">
                      Proficiency, Role &amp; Course Mapping
                    </span>
                  </div>
                </div>

                <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-100/90 text-slate-700 text-[11px] font-extrabold border-b border-slate-200">
                        <th className="py-2.5 px-3 w-36 border-r border-slate-200">
                          Proficiency <span className="text-red-500">*</span>
                        </th>
                        <th className="py-2.5 px-3 min-w-[200px] border-r border-slate-200">
                          Roles <span className="text-red-500">*</span>
                        </th>
                        <th className="py-2.5 px-3 min-w-[220px]">
                          Recommended Course <span className="text-red-500">*</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 bg-white">
                      {proficiencyMappings.map((mrow, rIdx) => {
                        const isFoundation = mrow.proficiency === 'Foundation';
                        const isIntermediate = mrow.proficiency === 'Intermediate';
                        const isProficient = mrow.proficiency === 'Proficient';
                        const isExpert = mrow.proficiency === 'Expert';

                        const badgeStyle = isFoundation
                          ? 'bg-slate-100 text-slate-700 border-slate-300'
                          : isIntermediate
                          ? 'bg-amber-50 text-amber-800 border-amber-300'
                          : isProficient
                          ? 'bg-sky-50 text-sky-800 border-sky-300 font-bold'
                          : 'bg-purple-50 text-purple-800 border-purple-300 font-bold';

                        return (
                          <tr key={mrow.proficiency} className="hover:bg-slate-50/70">
                            {/* 1. Fixed Proficiency Level */}
                            <td className="p-2.5 align-middle border-r border-slate-100">
                              <div className="flex items-center gap-2">
                                <span
                                  className={`text-[11px] px-2.5 py-1 rounded-lg border font-bold inline-block ${badgeStyle}`}
                                >
                                  {mrow.proficiency}
                                </span>
                              </div>
                            </td>

                            {/* 2. Role (Multi-Select for each row) */}
                            <td className="p-2.5 align-middle relative border-r border-slate-100" data-role-dropdown-container="true">
                              <button
                                type="button"
                                onClick={() => setOpenRoleRowIndex(openRoleRowIndex === rIdx ? null : rIdx)}
                                className={`w-full flex items-center justify-between px-3 py-2 border rounded-xl text-xs font-bold cursor-pointer text-left shadow-2xs transition-all ${
                                  openRoleRowIndex === rIdx
                                    ? 'bg-white border-[#0275a8] ring-2 ring-[#0275a8]/20 text-slate-900'
                                    : mrow.roles.length > 0
                                    ? 'bg-sky-50/70 border-sky-200 text-sky-900'
                                    : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-white'
                                }`}
                              >
                                <span className="truncate max-w-[180px]">
                                  {mrow.roles.length === 0
                                    ? 'Select Roles...'
                                    : mrow.roles.length === 1
                                    ? mrow.roles[0]
                                    : mrow.roles.length === ROLE_LIST.length
                                    ? `All Roles (${ROLE_LIST.length})`
                                    : `${mrow.roles.length} Roles (${mrow.roles[0]}...)`}
                                </span>
                                <ChevronDown className="w-3.5 h-3.5 text-slate-500 shrink-0 ml-1" />
                              </button>

                              {openRoleRowIndex === rIdx && (
                                <div className="absolute z-50 left-2.5 top-12 w-72 max-h-64 overflow-y-auto bg-white/95 backdrop-blur-xl border border-slate-200 rounded-2xl shadow-xl p-2 text-xs animate-in zoom-in-95 duration-150">
                                  <div className="space-y-1">
                                    {ROLE_LIST.map((r) => {
                                      const isSelected = mrow.roles.includes(r);
                                      return (
                                        <label
                                          key={r}
                                          className={`flex items-center gap-2 p-1.5 rounded-lg cursor-pointer text-[11px] transition-colors ${
                                            isSelected ? 'bg-sky-50 text-[#0275a8] font-bold' : 'hover:bg-slate-50 text-slate-700 font-medium'
                                          }`}
                                        >
                                          <input
                                            type="checkbox"
                                            checked={isSelected}
                                            onChange={() => handleToggleRole(rIdx, r)}
                                            className="rounded border-slate-300 text-[#0275a8] focus:ring-[#0275a8]"
                                          />
                                          <span>{r}</span>
                                        </label>
                                      );
                                    })}
                                  </div>
                                  <div className="pt-2 mt-1.5 border-t border-slate-100 text-right">
                                    <button
                                      type="button"
                                      onClick={() => setOpenRoleRowIndex(null)}
                                      className="px-3 py-1 bg-[#1a5075] hover:bg-[#0275a8] text-white rounded-lg text-[10px] font-bold cursor-pointer"
                                    >
                                      Done
                                    </button>
                                  </div>
                                </div>
                              )}
                            </td>

                            {/* 3. Recommended Course (Editable Input for all 4 rows - blank by default) */}
                            <td className="p-2.5 align-middle">
                              <input
                                type="text"
                                value={mrow.recommendedCourse}
                                onChange={(e) =>
                                  handleUpdateCourse(rIdx, e.target.value)
                                }
                                placeholder="Enter recommended course..."
                                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 placeholder:text-slate-400 shadow-inner focus:bg-white focus:ring-2 focus:ring-[#0275a8]/20 focus:border-[#0275a8]"
                              />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Optional Description */}
              <div>
                <label className="block font-extrabold text-slate-700 mb-1.5">
                  Description <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe operational benchmarks, indicators, or scope..."
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl shadow-inner focus:bg-white focus:ring-2 focus:ring-[#0275a8]/20 focus:border-[#0275a8]"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200/80">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-gradient-to-r from-[#1a5075] to-[#0275a8] hover:from-[#154261] hover:to-[#01628d] text-white text-xs font-extrabold rounded-xl shadow-md transition-all cursor-pointer active:scale-95"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: BULK IMPORT COMPETENCY & SKILLS FRAMEWORK */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden animate-in zoom-in-95 duration-200 my-8">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#1a5075] to-[#0275a8] text-white px-5 py-4 flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-white/15 border border-white/20">
                  <Upload className="w-5 h-5 text-sky-300" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm sm:text-base tracking-tight">Bulk Import Competency &amp; Skills</h3>
                  <p className="text-[11px] text-sky-100/90">Upload or stage structured competency mappings and courses</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowImportModal(false);
                  setImportFeedback(null);
                  setImportError(null);
                }}
                className="text-white/80 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 sm:p-6 space-y-4 text-xs">
              {/* Instructions & Download Template */}
              <div className="bg-gradient-to-r from-sky-50 to-[#f0f6fa] border border-sky-200/70 p-4 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
                <div>
                  <h4 className="font-extrabold text-[#1a5075] text-xs flex items-center gap-1.5">
                    <FileSpreadsheet className="w-4 h-4 text-[#0275a8]" />
                    <span>Standard CSV / Excel Import Format</span>
                  </h4>
                  <p className="text-[11px] text-slate-600 mt-0.5">
                    Include Category, Code, Competency Name, Department, Division, Grade, Role, and up to 4 Skills with Courses.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleDownloadSampleTemplate}
                  className="px-3.5 py-2 bg-white border border-[#1a5075] text-[#1a5075] hover:bg-sky-50 font-extrabold rounded-xl text-[11px] flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer shadow-2xs active:scale-95"
                >
                  <Download className="w-3.5 h-3.5 text-[#0275a8]" />
                  <span>Download Template CSV</span>
                </button>
              </div>

              {/* Upload Dropzone */}
              <div className="border-2 border-dashed border-sky-200 hover:border-[#0275a8] bg-sky-50/30 rounded-2xl p-5 sm:p-6 text-center transition-colors relative">
                <FileSpreadsheet className="w-10 h-10 text-[#0275a8] mx-auto mb-2 opacity-85" />
                <p className="font-extrabold text-slate-800 text-xs">Select or Drop CSV File</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Supports UTF-8 CSV with comma delimiters</p>

                <div className="mt-3.5 flex flex-wrap items-center justify-center gap-2.5">
                  <label className="px-4 py-2 bg-[#0275a8] hover:bg-[#02628d] text-white font-extrabold rounded-xl text-xs cursor-pointer inline-flex items-center gap-1.5 shadow-sm transition-all active:scale-95">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Browse CSV File</span>
                    <input
                      type="file"
                      accept=".csv,text/csv"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setStagedCompetencies(SAMPLE_IMPORT_BATCH);
                      setImportFeedback(`Loaded sample batch of ${SAMPLE_IMPORT_BATCH.length} competencies (${SAMPLE_IMPORT_BATCH.reduce((a, c) => a + c.skills.length, 0)} skills).`);
                      setImportError(null);
                    }}
                    className="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold rounded-xl text-xs cursor-pointer inline-flex items-center gap-1.5 shadow-2xs transition-all"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>Load Sample Staging Batch (3 Records)</span>
                  </button>
                </div>
              </div>

              {/* Staged Data Preview */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h5 className="font-extrabold text-slate-700 text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-[#0275a8]" />
                    <span>Staging Preview ({stagedCompetencies.length} Competencies / {stagedCompetencies.reduce((a, c) => a + c.skills.length, 0)} Skills):</span>
                  </h5>
                  <span className="text-[11px] font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md border border-sky-200">
                    Ready to Merge
                  </span>
                </div>

                <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50/50 max-h-56 overflow-y-auto">
                  <table className="w-full text-left text-[11px]">
                    <thead className="bg-slate-100 text-slate-700 font-extrabold sticky top-0 border-b border-slate-200">
                      <tr>
                        <th className="p-2.5">Code</th>
                        <th className="p-2.5">Category</th>
                        <th className="p-2.5">Competency &amp; Role</th>
                        <th className="p-2.5">Department / Division</th>
                        <th className="p-2.5 text-center">Grade</th>
                        <th className="p-2.5 text-center">Skills</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 bg-white">
                      {stagedCompetencies.map((comp) => (
                        <tr key={comp.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="p-2.5 font-mono font-bold text-[#1a5075] text-[10px]">{comp.code || comp.id}</td>
                          <td className="p-2.5">
                            <span className={`inline-flex px-2 py-0.5 rounded-md text-[10px] font-extrabold ${
                              comp.category === 'Functional'
                                ? 'bg-sky-50 text-sky-800 border border-sky-200'
                                : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            }`}>
                              {comp.category}
                            </span>
                          </td>
                          <td className="p-2.5">
                            <div className="font-bold text-slate-900">{comp.name}</div>
                            <div className="text-[10px] text-slate-500 font-medium">{comp.role || 'All Roles'}</div>
                          </td>
                          <td className="p-2.5 text-slate-600 text-[10px]">
                            <div className="font-bold text-slate-700">{comp.department}</div>
                            <div className="text-slate-500 truncate max-w-[160px]">{comp.division}</div>
                          </td>
                          <td className="p-2.5 text-center font-extrabold text-[#1a5075]">
                            {comp.grade || '—'}
                          </td>
                          <td className="p-2.5 text-center">
                            <span className="inline-flex px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-extrabold text-[10px] border border-slate-200">
                              {comp.skills?.length || 0} skills
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Error Message */}
              {importError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-800 text-xs font-bold flex items-center gap-2 shadow-2xs">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{importError}</span>
                </div>
              )}

              {/* Success Feedback */}
              {importFeedback && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-bold flex items-center gap-2 shadow-2xs animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{importFeedback}</span>
                </div>
              )}

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowImportModal(false);
                    setImportFeedback(null);
                    setImportError(null);
                  }}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors cursor-pointer text-xs"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmImport}
                  className="px-6 py-2.5 bg-gradient-to-r from-emerald-700 to-teal-700 hover:from-emerald-800 hover:to-teal-800 text-white font-extrabold rounded-xl shadow-md transition-all cursor-pointer active:scale-95 flex items-center gap-2 text-xs"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirm Import &amp; Merge ({stagedCompetencies.length} Records)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/80 w-full max-w-sm p-6 text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto shadow-inner">
              <Trash2 className="w-7 h-7" />
            </div>
            <h3 className="text-sm font-extrabold text-slate-900">Delete Record?</h3>
            <p className="text-xs text-slate-600">
              Are you sure you want to remove <strong>{deleteConfirm.name}</strong>?
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (deleteConfirm.skillId && onDeleteSkill) {
                    onDeleteSkill(deleteConfirm.compId, deleteConfirm.skillId);
                  } else if (onDeleteCompetency) {
                    onDeleteCompetency(deleteConfirm.compId);
                  }
                  setDeleteConfirm(null);
                }}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-extrabold rounded-xl shadow-md cursor-pointer active:scale-95"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
