import React, { useState, useMemo, useRef } from 'react';
import { EmployeeProfile, AssessmentReleaseRecord, SkippedEmployeeLna } from '../types';
import {
  Users,
  Search,
  Filter,
  X,
  CheckCircle2,
  Trash2,
  Edit2,
  Building,
  Briefcase,
  MapPin,
  Calendar,
  Mail,
  UserCheck,
  AlertTriangle,
  ChevronDown,
  Send,
  CheckSquare,
  Clock,
  Ban,
  UserX,
  History,
  ArrowRight,
  UserPlus,
  Upload,
  Download,
  FileSpreadsheet
} from 'lucide-react';

interface FlaggedEmployeeItem {
  emp: EmployeeProfile;
  flagType: 'released' | 'skipped';
  record?: AssessmentReleaseRecord;
  skipRecord?: SkippedEmployeeLna;
}

const ENTITY_STRUCTURE_MAP: Record<string, { functional: { name: string; departments: string[] }[]; nonFunctional: { name: string; department: string }[] }> = {
  GANS: {
    functional: [
      { name: 'Air Operations', departments: ['Air Traffic Management', 'Aeronautical Meteorology'] },
      { name: 'Engineering Services', departments: ['CNS Systems Engineering', 'IT Infrastructure'] },
      { name: 'Safety & Quality Assurance', departments: ['Aviation Safety & Quality', 'Airside Compliance'] }
    ],
    nonFunctional: [
      { name: 'Human Resources', department: 'Human Resources' },
      { name: 'Finance & Accounts', department: 'Finance & Accounts' },
      { name: 'Legal & Regulatory', department: 'Legal & Regulatory' }
    ]
  },
  Eshara: {
    functional: [
      { name: 'Air Traffic Management', departments: ['En-Route Air Traffic Operations', 'Terminal Control & Aerodromes', 'Sheikh Zayed Centre', 'ATM Operations'] },
      { name: 'CNS Systems', departments: ['Navigation & Surveillance Engineering', 'Radar Systems & Navaids', 'CNS Operations'] },
      { name: 'Aviation Safety', departments: ['Operational Safety Assurance', 'Air Traffic Investigations', 'Safety & QA'] },
      { name: 'Workforce Development', departments: ['Training Academy', 'Simulator Training & Licensing'] },
      { name: 'Air Navigation Services', departments: ['Tower Control', 'Approach Control', 'Flight Information Center'] }
    ],
    nonFunctional: [
      { name: 'Human Resources', department: 'Human Resources' },
      { name: 'Finance & Administration', department: 'Finance & Administration' },
      { name: 'Procurement & Commercial', department: 'Procurement & Commercial' },
      { name: 'Information Technology', department: 'Information Technology' }
    ]
  },
  YHA: {
    functional: [
      { name: 'Aviation Consulting', departments: ['Aviation Advisory & Strategy', 'Master Planning & Advisory'] },
      { name: 'Airspace Optimization', departments: ['Airspace Engineering', 'Route Optimization'] },
      { name: 'Regulatory & Standards', departments: ['Regulatory Compliance', 'Aviation Safety Standards'] },
      { name: 'Green Aviation', departments: ['Sustainability Solutions', 'Environmental Aviation Standards'] }
    ],
    nonFunctional: [
      { name: 'Corporate Strategy', department: 'Corporate Strategy' },
      { name: 'Finance & Commercial', department: 'Finance & Commercial' },
      { name: 'Client Relations', department: 'Client Relations' }
    ]
  }
};

const getEntityFunctionals = (entity: string): { functional: string[]; nonFunctional: string[] } => {
  const base = ENTITY_STRUCTURE_MAP[entity] || ENTITY_STRUCTURE_MAP['Eshara'] || ENTITY_STRUCTURE_MAP['GANS'];
  const funcList = [...base.functional.map((f) => f.name)];
  const nonFuncList = [...base.nonFunctional.map((f) => f.name)];

  try {
    const savedV2 = localStorage.getItem('functional_master_entity_records_v4') || localStorage.getItem('functional_master_entity_records_v3') || localStorage.getItem('functional_master_entity_records_v2');
    if (savedV2) {
      const list = JSON.parse(savedV2);
      list.forEach((item: { entity: string; functional: string; departments?: string[] }) => {
        if (item.entity === entity && item.functional) {
          if (!funcList.includes(item.functional) && !nonFuncList.includes(item.functional)) {
            if (item.departments && item.departments.length > 1) {
              funcList.push(item.functional);
            } else {
              nonFuncList.push(item.functional);
            }
          }
        }
      });
    }
  } catch (e) {
    console.error(e);
  }

  return { functional: funcList, nonFunctional: nonFuncList };
};

const getDepartmentsForEntityAndFunctional = (entity: string, functional: string): string[] => {
  const deptSet = new Set<string>();
  const base = ENTITY_STRUCTURE_MAP[entity] || ENTITY_STRUCTURE_MAP['GANS'];
  if (base) {
    const fMatch = base.functional.find((f) => f.name === functional);
    if (fMatch) {
      fMatch.departments.forEach((d) => deptSet.add(d));
    }
    const nfMatch = base.nonFunctional.find((f) => f.name === functional);
    if (nfMatch) {
      deptSet.add(nfMatch.department);
    }
  }
  try {
    const saved = localStorage.getItem('functional_master_entity_records_v2');
    if (saved) {
      const records = JSON.parse(saved);
      records.forEach((r: { entity: string; functional: string; departments?: string[] }) => {
        if (r.entity === entity && r.functional === functional && r.departments) {
          r.departments.forEach((d) => deptSet.add(d));
        }
      });
    }
  } catch (e) {
    console.error(e);
  }
  if (deptSet.size === 0 && functional) {
    deptSet.add(functional);
  }
  return Array.from(deptSet).sort();
};

interface HrEmployeeMasterViewProps {
  employees: EmployeeProfile[];
  onAddEmployee?: (emp: EmployeeProfile) => void;
  onImportEmployees?: (emps: EmployeeProfile[]) => void;
  onUpdateEmployee?: (emp: EmployeeProfile) => void;
  onSyncEmployees?: () => void;
  onDeleteEmployee?: (empId: string) => void;
  onReleaseAssessments?: (
    cycleType: 'LNA' | 'PDP',
    releaseType: 'Release All' | 'Release Selected',
    deadline: string,
    targetEmployeeIds: string[]
  ) => void;
  releasedList?: AssessmentReleaseRecord[];
  skippedEmployees?: SkippedEmployeeLna[];
  onNavigateToHistory?: () => void;
  onNavigateToDepartmentMaster?: () => void;
}

export const HrEmployeeMasterView: React.FC<HrEmployeeMasterViewProps> = ({
  employees,
  onAddEmployee,
  onImportEmployees,
  onUpdateEmployee,
  onSyncEmployees,
  onDeleteEmployee,
  onReleaseAssessments,
  releasedList = [],
  skippedEmployees = [],
  onNavigateToHistory,
  onNavigateToDepartmentMaster
}) => {
  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDivision, setSelectedDivision] = useState('ALL');
  const [selectedDepartment, setSelectedDepartment] = useState('ALL');
  const [selectedGrade, setSelectedGrade] = useState('ALL');

  // Employee Selection State for Release
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedEmpIds, setSelectedEmpIds] = useState<string[]>([]);
  const [showReleaseDropdown, setShowReleaseDropdown] = useState(false);
  const [releaseDeadline, setReleaseDeadline] = useState('2026-12-31');
  const [releaseNotice, setReleaseNotice] = useState<string | null>(null);
  const [selectionWarning, setSelectionWarning] = useState<string | null>(null);

  // Toast & Modal State
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [showEditModal, setShowEditModal] = useState(false);
  const [deleteConfirmEmp, setDeleteConfirmEmp] = useState<{ id: string; name: string } | null>(null);

  // Form State for adding / editing employee
  const [formData, setFormData] = useState<EmployeeProfile>({
    name: '',
    employeeId: '',
    email: '',
    reportingManager: '',
    position: '',
    function: '',
    division: '',
    department: '',
    grade: 8,
    joinDate: '',
    section: '',
    location: 'Abu Dhabi HQ',
    entity: 'GANS'
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Dynamic list of Divisions
  const availableDivisions = useMemo(() => {
    const list = new Set<string>([
      'Air Navigation Services',
      'Technical Support Services',
      'Corporate Strategy',
      'Safety & Quality Assurance',
      'Aviation Security',
      'Human Resources',
      'Finance & Administration',
      ...employees.map((e) => e.division).filter(Boolean)
    ]);
    return Array.from(list).sort();
  }, [employees]);

  // Dynamic list of Departments
  const availableDepartments = useMemo(() => {
    const list = new Set<string>([
      'ATM Operations',
      'CNS Operations',
      'MET Operations',
      'Safety & QA',
      'Corporate Strategy',
      'Human Resources',
      'Finance & Accounts',
      'Technical Services',
      ...employees.map((e) => e.department).filter(Boolean)
    ]);
    return Array.from(list).sort();
  }, [employees]);

  const currentEntity = formData.entity || 'GANS';
  const entityFunctionals = useMemo(() => {
    return getEntityFunctionals(currentEntity);
  }, [currentEntity]);

  const currentEntityDepartments = useMemo(() => {
    const fromFunc = getDepartmentsForEntityAndFunctional(currentEntity, formData.function || '');
    if (fromFunc.length > 0) return fromFunc;
    return availableDepartments;
  }, [currentEntity, formData.function, availableDepartments]);

  // Dynamic list of Managers
  const availableManagers = useMemo(() => {
    const list = new Set<string>([
      ...employees.map((e) => e.reportingManager).filter(Boolean),
      ...employees.filter((e) => e.grade >= 9).map((e) => e.name)
    ]);
    return Array.from(list).sort();
  }, [employees]);

  // Available Locations
  const availableLocations = [
    'Abu Dhabi HQ',
    'Al Ain International Airport',
    'Al Bateen Executive Airport',
    'Delma Airport',
    'Sir Bani Yas Airport',
    'Sharjah Facility',
    'Dubai Operations'
  ];

  // Map of released employee IDs with their records
  const releasedMap = useMemo(() => {
    const map = new Map<string, AssessmentReleaseRecord>();
    if (releasedList) {
      releasedList.forEach((r) => {
        map.set(r.employeeId, r);
      });
    }
    return map;
  }, [releasedList]);

  // Map of skipped employee IDs with their skip records
  const skippedMap = useMemo(() => {
    const map = new Map<string, SkippedEmployeeLna>();
    if (skippedEmployees) {
      skippedEmployees.forEach((s) => {
        map.set(s.employeeId, s);
      });
    }
    return map;
  }, [skippedEmployees]);

  // Pre-release prompt modal state (differentiating Released vs. Skipped)
  const [alreadyReleasedPrompt, setAlreadyReleasedPrompt] = useState<{
    mode: 'Release All' | 'Release Selected';
    allTargetIds: string[];
    flaggedList: FlaggedEmployeeItem[];
    pendingIds: string[];
  } | null>(null);

  const [modalFilterTab, setModalFilterTab] = useState<'all' | 'released' | 'skipped'>('all');

  // Bulk CSV Import Modal State
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importParsedList, setImportParsedList] = useState<EmployeeProfile[]>([]);
  const [importError, setImportError] = useState<string | null>(null);
  const [importFileName, setImportFileName] = useState<string>('');
  const importFileInputRef = useRef<HTMLInputElement>(null);

  // Dynamic filter dropdown items
  const divisions = useMemo(() => {
    return Array.from(new Set(employees.map((e) => e.division))).filter(Boolean).sort();
  }, [employees]);

  const departments = useMemo(() => {
    const relevant = selectedDivision === 'ALL'
      ? employees
      : employees.filter((e) => e.division === selectedDivision);
    return Array.from(new Set(relevant.map((e) => e.department))).filter(Boolean).sort();
  }, [employees, selectedDivision]);

  const grades = useMemo(() => {
    return Array.from(new Set(employees.map((e) => e.grade))).sort((a, b) => Number(a) - Number(b));
  }, [employees]);

  // Filtered employee list
  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      if (selectedDivision !== 'ALL' && emp.division !== selectedDivision) return false;
      if (selectedDepartment !== 'ALL' && emp.department !== selectedDepartment) return false;
      if (selectedGrade !== 'ALL' && emp.grade.toString() !== selectedGrade) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = emp.name.toLowerCase().includes(q);
        const matchId = emp.employeeId.toLowerCase().includes(q);
        const matchPos = emp.position.toLowerCase().includes(q);
        const matchEmail = emp.email.toLowerCase().includes(q);
        const matchManager = emp.reportingManager.toLowerCase().includes(q);
        const matchFunc = (emp.function || '').toLowerCase().includes(q);
        const matchSec = (emp.section || '').toLowerCase().includes(q);
        if (!matchName && !matchId && !matchPos && !matchEmail && !matchManager && !matchFunc && !matchSec) return false;
      }
      return true;
    });
  }, [employees, selectedDivision, selectedDepartment, selectedGrade, searchQuery]);

  // Open Add Employee Modal
  const handleOpenAddModal = () => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    setModalMode('add');
    const initialEntity = 'Eshara';
    const funcs = getEntityFunctionals(initialEntity);
    const initialFunc = funcs.functional[0] || 'Air Traffic Management';
    const depts = getDepartmentsForEntityAndFunctional(initialEntity, initialFunc);
    const initialDept = depts[0] || availableDepartments[0] || 'ATM Operations';

    setFormData({
      name: '',
      employeeId: `EMP00${randomNum}`,
      email: '',
      reportingManager: availableManagers[0] || 'Mansoor Al Hammadi',
      position: '',
      function: initialFunc,
      section: initialFunc,
      division: availableDivisions[0] || 'Air Navigation Services',
      department: initialDept,
      grade: 8,
      joinDate: new Date().toISOString().split('T')[0],
      location: 'Abu Dhabi HQ',
      entity: initialEntity
    });
    setFormErrors({});
    setShowEditModal(true);
  };

  // Open Edit Employee Modal
  const handleOpenEditModal = (emp: EmployeeProfile) => {
    setModalMode('edit');
    const empEntity = emp.entity || 'GANS';
    const empFunc = emp.function || emp.section || 'Air Traffic Management';
    setFormData({
      ...emp,
      entity: empEntity,
      function: empFunc,
      section: empFunc,
      joinDate: emp.joinDate || new Date().toISOString().split('T')[0],
      location: emp.location || 'Abu Dhabi HQ'
    });
    setFormErrors({});
    setShowEditModal(true);
  };

  // Validation for Add/Edit Employee Form (11 inputs)
  const validateForm = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = 'Employee Name is required';
    if (!formData.position.trim()) errs.position = 'Position/Designation is required';
    if (!formData.employeeId.trim()) errs.employeeId = 'Employee ID is required';
    if (!formData.joinDate?.trim()) errs.joinDate = 'DOJ is required';
    if (!formData.entity?.trim()) errs.entity = 'Entity is required';
    if (!formData.function?.trim()) errs.function = 'Functional is required';
    if (!formData.department.trim()) errs.department = 'Department is required';
    if (!formData.division.trim()) errs.division = 'Division is required';
    if (!formData.grade) errs.grade = 'Grade is required';
    if (!formData.reportingManager.trim()) errs.reportingManager = 'Manager is required';
    if (!formData.location?.trim()) errs.location = 'Location is required';
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSaveEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const trimmedName = formData.name.trim();
    const autoId = formData.employeeId.trim() || `EMP00${Math.floor(1000 + Math.random() * 9000)}`;
    const curEntity = formData.entity || 'GANS';
    const autoEmail = formData.email?.trim() || `${trimmedName.toLowerCase().replace(/[^a-z0-9]/g, '.')}@${curEntity.toLowerCase()}.aero`;
    const chosenFunc = formData.function?.trim() || 'Air Traffic Management';

    const finalEmp: EmployeeProfile = {
      ...formData,
      name: trimmedName,
      employeeId: autoId,
      email: autoEmail,
      entity: curEntity,
      function: chosenFunc,
      section: chosenFunc,
      department: formData.department.trim(),
      division: formData.division.trim(),
      position: formData.position.trim(),
      reportingManager: formData.reportingManager.trim(),
      location: formData.location?.trim() || 'Abu Dhabi HQ',
      grade: Number(formData.grade) || 8,
      joinDate: formData.joinDate || new Date().toISOString().split('T')[0]
    };

    if (modalMode === 'add') {
      if (onAddEmployee) {
        onAddEmployee(finalEmp);
      }
      setSuccessToast(`Employee "${finalEmp.name}" has been added successfully.`);
    } else {
      if (onUpdateEmployee) {
        onUpdateEmployee(finalEmp);
      }
      setSuccessToast(`Employee "${finalEmp.name}" profile has been updated.`);
    }

    setTimeout(() => {
      setSuccessToast(null);
    }, 4000);

    setShowEditModal(false);
    setFormErrors({});
  };

  // Selection Handlers for Assessment Release
  const isAllFilteredSelected = useMemo(() => {
    if (filteredEmployees.length === 0) return false;
    return filteredEmployees.every((e) => selectedEmpIds.includes(e.employeeId));
  }, [filteredEmployees, selectedEmpIds]);

  const handleToggleSelectAll = () => {
    if (isAllFilteredSelected) {
      const filteredIds = new Set(filteredEmployees.map((e) => e.employeeId));
      setSelectedEmpIds(selectedEmpIds.filter((id) => !filteredIds.has(id)));
    } else {
      const newIds = new Set([...selectedEmpIds, ...filteredEmployees.map((e) => e.employeeId)]);
      setSelectedEmpIds(Array.from(newIds));
    }
  };

  const handleToggleSelectEmp = (empId: string) => {
    if (selectedEmpIds.includes(empId)) {
      setSelectedEmpIds(selectedEmpIds.filter((id) => id !== empId));
    } else {
      setSelectedEmpIds([...selectedEmpIds, empId]);
    }
  };

  const handleStartSelectionMode = () => {
    setIsSelectionMode(true);
    setSelectionWarning(null);
  };

  const handleCancelSelectionMode = () => {
    setIsSelectionMode(false);
    setSelectedEmpIds([]);
    setSelectionWarning(null);
  };

  const executeRelease = (mode: 'Release All' | 'Release Selected', targetIds: string[]) => {
    if (targetIds.length === 0) {
      setSelectionWarning('No pending employees to release.');
      setTimeout(() => {
        setSelectionWarning(null);
      }, 4000);
      return;
    }

    setSelectionWarning(null);
    setAlreadyReleasedPrompt(null);

    if (onReleaseAssessments) {
      onReleaseAssessments(
        'LNA',
        mode,
        releaseDeadline,
        targetIds
      );
    }

    setReleaseNotice(
      `LNA has been released. You can check the details in employee history for this run.`
    );
    setSelectedEmpIds([]);
    setIsSelectionMode(false);
    setTimeout(() => {
      setReleaseNotice(null);
    }, 5000);
  };

  const handleDirectRelease = (mode: 'Release All' | 'Release Selected') => {
    const targetIds = mode === 'Release All'
      ? employees.map((e) => e.employeeId)
      : selectedEmpIds;

    if (mode === 'Release Selected' && targetIds.length === 0) {
      setSelectionWarning('Please select at least one employee from the table below using the checkboxes before releasing.');
      setTimeout(() => {
        setSelectionWarning(null);
      }, 4000);
      return;
    }

    // Check which of the target employees have already been released or skipped
    const flaggedList: FlaggedEmployeeItem[] = [];
    targetIds.forEach((id) => {
      const emp = employees.find((e) => e.employeeId === id) || ({ employeeId: id, name: id, department: '', position: '' } as EmployeeProfile);
      if (releasedMap.has(id)) {
        flaggedList.push({
          emp,
          flagType: 'released',
          record: releasedMap.get(id)
        });
      } else if (skippedMap.has(id)) {
        flaggedList.push({
          emp,
          flagType: 'skipped',
          skipRecord: skippedMap.get(id)
        });
      }
    });

    if (flaggedList.length > 0) {
      const pendingIds = targetIds.filter((id) => !releasedMap.has(id) && !skippedMap.has(id));
      setAlreadyReleasedPrompt({
        mode,
        allTargetIds: targetIds,
        flaggedList,
        pendingIds
      });
      setModalFilterTab('all');
      return;
    }

    executeRelease(mode, targetIds);
  };

  // Bulk Import Handlers
  const handleDownloadSampleEmployeeCsv = () => {
    const headers = 'Employee Name,Position,Employee ID,DOJ,Entity,Functional,Department,Division,Grade,Reporting Manager,Location,Email\n';
    const sampleRows = [
      'Ahmed Al Mansoori,Senior Air Traffic Controller,EMP00801,2024-03-15,Eshara,Air Traffic Management,En-Route Air Traffic Operations,ATM Operations,8,Madhesh Maasi,Abu Dhabi HQ,ahmed.almansoori@eshara.aero',
      'Fatima Al Zaabi,CNS Avionics Engineer,EMP00802,2023-11-01,Eshara,CNS Systems,Navigation & Surveillance Engineering,CNS Operations,7,Suresh Nair,Al Ain International Airport,fatima.alzaabi@eshara.aero',
      'Rashid Al Shamsi,Aviation Strategy Analyst,EMP00803,2024-01-10,YHA,Aviation Consulting,Aviation Advisory & Strategy,Corporate Strategy,7,Anita Rao,Dubai Operations,rashid.alshamsi@yha.aero'
    ].join('\n');

    const blob = new Blob([headers + sampleRows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'employee_master_import_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImportFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImportError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    setImportFileName(file.name);
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
          setImportError('No data rows found in the uploaded CSV. Ensure the first line is the header.');
          return;
        }

        const headerCols = lines[0].split(',').map((c) => c.trim().toLowerCase().replace(/[^a-z0-9]/g, ''));
        
        const nameIdx = headerCols.findIndex((c) => c.includes('name'));
        const posIdx = headerCols.findIndex((c) => c.includes('position') || c.includes('designation') || c.includes('title'));
        const idIdx = headerCols.findIndex((c) => c.includes('id') || c.includes('empid') || c.includes('employeeid'));
        const dojIdx = headerCols.findIndex((c) => c.includes('doj') || c.includes('date') || c.includes('join'));
        const entityIdx = headerCols.findIndex((c) => c.includes('entity'));
        const funcIdx = headerCols.findIndex((c) => c.includes('func'));
        const deptIdx = headerCols.findIndex((c) => c.includes('dept') || c.includes('department'));
        const divIdx = headerCols.findIndex((c) => c.includes('div') || c.includes('division'));
        const gradeIdx = headerCols.findIndex((c) => c.includes('grade'));
        const mgrIdx = headerCols.findIndex((c) => c.includes('manager') || c.includes('reporting'));
        const locIdx = headerCols.findIndex((c) => c.includes('location'));
        const emailIdx = headerCols.findIndex((c) => c.includes('email'));

        const parsed: EmployeeProfile[] = [];

        for (let i = 1; i < lines.length; i++) {
          const rawLine = lines[i];
          const parts: string[] = [];
          let current = '';
          let inQuotes = false;
          for (let charIndex = 0; charIndex < rawLine.length; charIndex++) {
            const char = rawLine[charIndex];
            if (char === '"' || char === "'") {
              inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
              parts.push(current.trim());
              current = '';
            } else {
              current += char;
            }
          }
          parts.push(current.trim());

          const name = (nameIdx >= 0 ? parts[nameIdx] : parts[0]) || '';
          if (!name.trim()) continue;

          const position = (posIdx >= 0 ? parts[posIdx] : parts[1]) || 'Specialist';
          let empId = (idIdx >= 0 ? parts[idIdx] : parts[2]) || '';
          if (!empId.trim()) {
            empId = `EMP${String(Math.floor(10000 + Math.random() * 90000))}`;
          }

          const joinDate = (dojIdx >= 0 ? parts[dojIdx] : parts[3]) || new Date().toISOString().split('T')[0];
          let entity = (entityIdx >= 0 ? parts[entityIdx] : parts[4]) || 'Eshara';
          if (entity.toUpperCase().includes('ESHARA')) {
            entity = 'Eshara';
          } else if (entity.toUpperCase().includes('YHA')) {
            entity = 'YHA';
          } else if (entity.toUpperCase().includes('GANS') || entity.toUpperCase() === 'SQL') {
            entity = 'GANS';
          } else {
            entity = 'Eshara';
          }

          const funcVal = (funcIdx >= 0 ? parts[funcIdx] : parts[5]) || 'Air Traffic Management';
          const department = (deptIdx >= 0 ? parts[deptIdx] : parts[6]) || 'Operations';
          const division = (divIdx >= 0 ? parts[divIdx] : parts[7]) || 'Operations';
          const gradeRaw = gradeIdx >= 0 ? parseInt(parts[gradeIdx], 10) : 7;
          const grade = isNaN(gradeRaw) || gradeRaw < 1 || gradeRaw > 12 ? 7 : gradeRaw;
          const reportingManager = (mgrIdx >= 0 ? parts[mgrIdx] : parts[9]) || (employees[0]?.name || 'Management');
          const location = (locIdx >= 0 ? parts[locIdx] : parts[10]) || 'Abu Dhabi HQ';
          const email = (emailIdx >= 0 && parts[emailIdx]) ? parts[emailIdx] : `${name.toLowerCase().replace(/[^a-z0-9]/g, '.')}@${entity.toLowerCase()}.aero`;

          parsed.push({
            name: name.replace(/^["']|["']$/g, ''),
            position: position.replace(/^["']|["']$/g, ''),
            employeeId: empId.replace(/^["']|["']$/g, ''),
            joinDate: joinDate.replace(/^["']|["']$/g, ''),
            entity,
            function: funcVal.replace(/^["']|["']$/g, ''),
            department: department.replace(/^["']|["']$/g, ''),
            division: division.replace(/^["']|["']$/g, ''),
            grade,
            reportingManager: reportingManager.replace(/^["']|["']$/g, ''),
            location: location.replace(/^["']|["']$/g, ''),
            email: email.replace(/^["']|["']$/g, '')
          });
        }

        if (parsed.length === 0) {
          setImportError('No valid employee records could be parsed. Check column formats.');
          return;
        }

        setImportParsedList(parsed);
      } catch (err) {
        setImportError('Failed to parse file: ' + String(err));
      }
    };
    reader.readAsText(file);
  };

  const handleConfirmImport = () => {
    if (importParsedList.length === 0) return;
    if (onImportEmployees) {
      onImportEmployees(importParsedList);
    } else if (onAddEmployee) {
      importParsedList.forEach((emp) => onAddEmployee(emp));
    }
    setSuccessToast(`Successfully imported ${importParsedList.length} employee record${importParsedList.length > 1 ? 's' : ''}.`);
    setTimeout(() => setSuccessToast(null), 4000);
    setIsImportModalOpen(false);
    setImportParsedList([]);
    setImportFileName('');
    setImportError(null);
    if (importFileInputRef.current) {
      importFileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#1a5075] via-[#154668] to-[#0d314a] rounded-xl p-5 text-white shadow-md border border-[#2b658f] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2.5">
            <Users className="w-6 h-6 text-sky-300" />
            <span>Employee Master</span>
          </h1>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          
          {/* Release Dropdown Button */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowReleaseDropdown(!showReleaseDropdown)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg flex items-center gap-1.5 shadow-sm transition-all cursor-pointer active:scale-95 border border-emerald-400/40"
            >
              <span>Release</span>
              <ChevronDown className="w-3.5 h-3.5 ml-0.5" />
            </button>

            {showReleaseDropdown && (
              <>
                <div
                  className="fixed inset-0 z-20"
                  onClick={() => setShowReleaseDropdown(false)}
                />
                <div className="absolute right-0 mt-1.5 w-52 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-30 animate-in fade-in zoom-in-95">
                  <button
                    type="button"
                    onClick={() => {
                      setShowReleaseDropdown(false);
                      handleDirectRelease('Release All');
                    }}
                    className="w-full px-3.5 py-2.5 text-left text-xs font-bold text-slate-700 hover:bg-sky-50 hover:text-[#0275a8] flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <Users className="w-4 h-4 text-[#0275a8]" />
                    <span>Release All ({employees.length})</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setShowReleaseDropdown(false);
                      if (selectedEmpIds.length > 0) {
                        handleDirectRelease('Release Selected');
                      } else {
                        handleStartSelectionMode();
                      }
                    }}
                    className="w-full px-3.5 py-2.5 text-left text-xs font-bold text-slate-700 hover:bg-sky-50 hover:text-[#0275a8] flex items-center justify-between transition-colors cursor-pointer border-t border-slate-100"
                  >
                    <div className="flex items-center gap-2">
                      <CheckSquare className="w-4 h-4 text-emerald-600" />
                      <span>Release Selected</span>
                    </div>
                    {selectedEmpIds.length > 0 && (
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                        {selectedEmpIds.length}
                      </span>
                    )}
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Import Button (Placed between Release and Add Employee) */}
          <button
            id="btn-import-employees"
            type="button"
            onClick={() => {
              setImportError(null);
              setImportParsedList([]);
              setImportFileName('');
              if (importFileInputRef.current) importFileInputRef.current.value = '';
              setIsImportModalOpen(true);
            }}
            className="px-4 py-2 bg-white hover:bg-slate-100 text-[#1a5075] hover:text-[#0275a8] font-bold text-xs rounded-lg flex items-center gap-1.5 shadow-sm transition-all cursor-pointer active:scale-95 border border-slate-200"
            title="Import employee records from CSV file"
          >
            <Upload className="w-3.5 h-3.5 text-[#0275a8]" />
            <span>Import</span>
          </button>

          {/* Add Employee Button */}
          <button
            id="btn-add-employee"
            type="button"
            onClick={handleOpenAddModal}
            className="px-4 py-2 bg-gradient-to-r from-[#1a5075] to-[#0275a8] hover:from-[#154668] hover:to-[#01628d] text-white font-bold text-xs rounded-lg shadow-sm transition-all cursor-pointer active:scale-95 border border-sky-300/30"
            title="Add a new employee record"
          >
            <span>Add Employee</span>
          </button>
        </div>
      </div>

      {/* Success Toast Banner */}
      {successToast && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-xl flex items-center justify-between gap-3 text-emerald-900 shadow-xs animate-in slide-in-from-top-1">
          <div className="flex items-center gap-2.5 text-xs font-bold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successToast}</span>
          </div>
          <button
            type="button"
            onClick={() => setSuccessToast(null)}
            className="text-emerald-700 hover:text-emerald-900 font-bold text-xs cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Release Notice Banner */}
      {releaseNotice && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-xl flex items-center justify-between gap-3 text-emerald-900 shadow-xs animate-in slide-in-from-top-1">
          <div className="flex items-center gap-2.5 text-xs font-bold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{releaseNotice}</span>
          </div>
          <button
            type="button"
            onClick={() => setReleaseNotice(null)}
            className="text-emerald-700 hover:text-emerald-900 font-bold text-xs cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Selection Warning Banner */}
      {selectionWarning && (
        <div className="p-3.5 bg-amber-50 border border-amber-300 rounded-xl flex items-center justify-between gap-3 text-amber-900 shadow-xs animate-in slide-in-from-top-1">
          <div className="flex items-center gap-2.5 text-xs font-bold">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>{selectionWarning}</span>
          </div>
          <button
            type="button"
            onClick={() => setSelectionWarning(null)}
            className="text-amber-700 hover:text-amber-900 font-bold text-xs cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Selection Mode Interactive Action Bar */}
      {isSelectionMode && (
        <div className="bg-gradient-to-r from-sky-50 via-blue-50 to-indigo-50 border-2 border-[#0275a8]/50 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-xs animate-in slide-in-from-top-2">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#0275a8] text-white flex items-center justify-center font-bold shrink-0 shadow-2xs">
              <CheckSquare className="w-4 h-4" />
            </div>
            <div>
              <div className="font-extrabold text-[#1a5075] text-xs flex items-center gap-2 flex-wrap">
                <span>Employee Selection Mode Active</span>
                <span className="bg-[#1a5075] text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                  {selectedEmpIds.length} Selected
                </span>
              </div>
              <div className="text-[11px] text-slate-600 mt-0.5">
                Check the employees below to include them in the assessment release.
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap self-end sm:self-auto">
            <button
              type="button"
              onClick={handleToggleSelectAll}
              className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 font-bold rounded-lg border border-slate-200 shadow-2xs transition-colors cursor-pointer text-xs"
            >
              {isAllFilteredSelected ? 'Deselect All' : 'Select All Filtered'}
            </button>

            {selectedEmpIds.length > 0 && (
              <button
                type="button"
                onClick={() => setSelectedEmpIds([])}
                className="px-2.5 py-1.5 text-slate-500 hover:text-slate-800 font-semibold cursor-pointer text-xs"
              >
                Clear
              </button>
            )}

            <button
              type="button"
              onClick={() => handleDirectRelease('Release Selected')}
              disabled={selectedEmpIds.length === 0}
              className={`px-4 py-1.5 font-bold rounded-lg shadow-xs flex items-center gap-1.5 transition-all text-xs ${
                selectedEmpIds.length > 0
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer active:scale-95'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <Send className="w-3.5 h-3.5" />
              <span>Release Selected ({selectedEmpIds.length})</span>
            </button>

            <button
              type="button"
              onClick={handleCancelSelectionMode}
              className="px-3 py-1.5 bg-slate-200/80 hover:bg-slate-300 text-slate-700 font-bold rounded-lg transition-colors cursor-pointer text-xs"
            >
              Exit
            </button>
          </div>
        </div>
      )}

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div className="bg-white p-3.5 rounded-lg border border-[#c8d8e5] shadow-2xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Total Employees</span>
          <div className="text-2xl font-black text-[#1a5075] mt-1">{employees.length}</div>
        </div>
        <div className="bg-white p-3.5 rounded-lg border border-[#c8d8e5] shadow-2xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Divisions</span>
          <div className="text-2xl font-black text-[#0275a8] mt-1">{divisions.length}</div>
        </div>
        <div className="bg-white p-3.5 rounded-lg border border-[#c8d8e5] shadow-2xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Departments</span>
          <div className="text-2xl font-black text-slate-800 mt-1">
            {Array.from(new Set(employees.map(e => e.department))).length}
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-3.5 rounded-lg border border-[#c8d8e5] shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          {/* Search Input */}
          <div className="flex-1 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Employee Name, ID, Email, Position, Manager..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-md text-xs text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:border-[#0275a8] focus:bg-white transition-all shadow-2xs"
            />
          </div>

          {/* Division Filter */}
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-xs font-bold text-slate-600 whitespace-nowrap">Division:</span>
            <select
              value={selectedDivision}
              onChange={(e) => {
                setSelectedDivision(e.target.value);
                setSelectedDepartment('ALL');
              }}
              className="bg-white border border-slate-300 rounded-md px-2.5 py-1.5 text-xs text-slate-700 font-medium focus:outline-hidden focus:border-[#0275a8]"
            >
              <option value="ALL">All Divisions</option>
              {divisions.map((div) => (
                <option key={div} value={div}>{div}</option>
              ))}
            </select>
          </div>

          {/* Department Filter */}
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-xs font-bold text-slate-600 whitespace-nowrap">Department:</span>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="bg-white border border-slate-300 rounded-md px-2.5 py-1.5 text-xs text-slate-700 font-medium focus:outline-hidden focus:border-[#0275a8]"
            >
              <option value="ALL">All Departments</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>

          {/* Grade Filter */}
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-xs font-bold text-slate-600 whitespace-nowrap">Grade:</span>
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="bg-white border border-slate-300 rounded-md px-2.5 py-1.5 text-xs text-slate-700 font-medium focus:outline-hidden focus:border-[#0275a8]"
            >
              <option value="ALL">All Grades</option>
              {grades.map((gr) => (
                <option key={gr} value={gr.toString()}>Grade {gr}</option>
              ))}
            </select>
          </div>

          {(searchQuery || selectedDivision !== 'ALL' || selectedDepartment !== 'ALL' || selectedGrade !== 'ALL') && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedDivision('ALL');
                setSelectedDepartment('ALL');
                setSelectedGrade('ALL');
              }}
              className="text-xs text-[#0275a8] hover:underline font-bold px-2 py-1 cursor-pointer"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Employee Master Table */}
      <div className="bg-white rounded-lg border border-[#c8d8e5] shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#1a5075] text-white font-bold border-b border-[#144262]">
                {isSelectionMode && (
                  <th className="py-2.5 px-3 w-10 text-center">
                    <input
                      type="checkbox"
                      aria-label="Select all employees"
                      checked={isAllFilteredSelected}
                      onChange={handleToggleSelectAll}
                      className="w-3.5 h-3.5 text-[#0275a8] bg-white border-slate-300 rounded focus:ring-0 cursor-pointer"
                    />
                  </th>
                )}
                <th className="py-2.5 px-3.5 w-12 text-center">#</th>
                <th className="py-2.5 px-4 w-48">Employee Name</th>
                <th className="py-2.5 px-4">Position/Designation</th>
                <th className="py-2.5 px-4">Functional</th>
                <th className="py-2.5 px-4">Department</th>
                <th className="py-2.5 px-4">Division</th>
                <th className="py-2.5 px-3 text-center w-16">Grade</th>
                <th className="py-2.5 px-4">Manager</th>
                <th className="py-2.5 px-4">Location</th>
                <th className="py-2.5 px-3 text-center w-24">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredEmployees.length === 0 ? (
                <tr>
                  <td colSpan={isSelectionMode ? 11 : 10} className="py-10 text-center text-slate-500">
                    <p className="font-semibold text-sm">No employee records found</p>
                    <p className="text-xs text-slate-400 mt-1">Try adjusting your search query or filters.</p>
                  </td>
                </tr>
              ) : (
                filteredEmployees.map((emp, index) => {
                  const initials = emp.name
                    .split(' ')
                    .filter(Boolean)
                    .slice(0, 2)
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase();
                  
                  const isSelected = selectedEmpIds.includes(emp.employeeId);

                  return (
                    <tr
                      key={emp.employeeId}
                      className={`transition-colors ${
                        isSelected
                          ? 'bg-sky-50/70 hover:bg-sky-50'
                          : 'hover:bg-slate-50/80'
                      }`}
                    >
                      {isSelectionMode && (
                        <td className="py-3 px-3 text-center">
                          <input
                            type="checkbox"
                            aria-label={`Select ${emp.name}`}
                            checked={isSelected}
                            onChange={() => handleToggleSelectEmp(emp.employeeId)}
                            className="w-3.5 h-3.5 text-[#0275a8] border-slate-300 rounded focus:ring-0 cursor-pointer"
                          />
                        </td>
                      )}
                      <td className="py-3 px-3.5 text-center text-slate-400 font-mono text-[11px]">
                        {index + 1}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-[#e6f2f9] border border-[#bcd7e8] flex items-center justify-center text-[#1a5075] font-bold text-[11px] shrink-0">
                            {initials}
                          </div>
                          <div>
                            <div className="font-bold text-slate-800 text-xs">{emp.name}</div>
                            {emp.entity && (
                              <span className="text-[10px] text-slate-400 font-semibold">{emp.entity}</span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-slate-700 block">{emp.position}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-medium text-slate-800 block">{emp.function || emp.section || 'Air Traffic Management'}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-slate-600 block">{emp.department}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-slate-600 block">{emp.division}</span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className="inline-block bg-[#e5eff6] text-[#1a5075] font-bold px-2 py-0.5 rounded text-[11px] border border-[#bcd7e8]">
                          {emp.grade}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-medium text-slate-700 block">{emp.reportingManager}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-slate-600 block">{emp.location || 'Abu Dhabi HQ'}</span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            type="button"
                            title="Edit Employee"
                            onClick={() => handleOpenEditModal(emp)}
                            className="p-1 text-slate-500 hover:text-[#0275a8] hover:bg-sky-50 rounded transition-colors cursor-pointer"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          {onDeleteEmployee && (
                            <button
                              type="button"
                              title="Delete Record"
                              onClick={() => {
                                setDeleteConfirmEmp({ id: emp.employeeId, name: emp.name });
                              }}
                              className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: ADD / EDIT EMPLOYEE PROFILE */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="bg-[#1a5075] text-white px-5 py-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {modalMode === 'add' ? (
                  <UserPlus className="w-5 h-5 text-sky-300" />
                ) : (
                  <Edit2 className="w-5 h-5 text-sky-300" />
                )}
                <h3 className="font-bold text-sm sm:text-base">
                  {modalMode === 'add' ? 'Add New Employee' : 'Edit Employee Profile'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="text-white/80 hover:text-white p-1 rounded hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form Body */}
            <form onSubmit={handleSaveEmployee} className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* 1. Employee Name */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Employee Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => {
                      const newName = e.target.value;
                      setFormData({ ...formData, name: newName });
                      if (formErrors.name) setFormErrors((prev) => ({ ...prev, name: '' }));
                    }}
                    placeholder="e.g. Fatima Al Hosani"
                    className={`w-full px-3 py-2 bg-slate-50 border rounded-md text-xs text-slate-800 focus:bg-white focus:outline-hidden focus:border-[#0275a8] ${
                      formErrors.name ? 'border-red-400 bg-red-50/40' : 'border-slate-300'
                    }`}
                  />
                  {formErrors.name && <span className="text-[10px] text-red-500 mt-0.5 block">{formErrors.name}</span>}
                </div>

                {/* 2. Position/Designation */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Position/Designation <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.position}
                    onChange={(e) => {
                      setFormData({ ...formData, position: e.target.value });
                      if (formErrors.position) setFormErrors((prev) => ({ ...prev, position: '' }));
                    }}
                    placeholder="e.g. Senior Air Traffic Controller"
                    className={`w-full px-3 py-2 bg-slate-50 border rounded-md text-xs text-slate-800 focus:bg-white focus:outline-hidden focus:border-[#0275a8] ${
                      formErrors.position ? 'border-red-400 bg-red-50/40' : 'border-slate-300'
                    }`}
                  />
                  {formErrors.position && <span className="text-[10px] text-red-500 mt-0.5 block">{formErrors.position}</span>}
                </div>

                {/* 3. Employee ID */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Employee ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.employeeId}
                    onChange={(e) => {
                      setFormData({ ...formData, employeeId: e.target.value });
                      if (formErrors.employeeId) setFormErrors((prev) => ({ ...prev, employeeId: '' }));
                    }}
                    placeholder="e.g. EMP00590"
                    className={`w-full px-3 py-2 bg-slate-50 border rounded-md text-xs text-slate-800 font-mono focus:bg-white focus:outline-hidden focus:border-[#0275a8] ${
                      formErrors.employeeId ? 'border-red-400 bg-red-50/40' : 'border-slate-300'
                    }`}
                  />
                  {formErrors.employeeId && <span className="text-[10px] text-red-500 mt-0.5 block">{formErrors.employeeId}</span>}
                </div>

                {/* 4. DOJ */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    DOJ <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.joinDate || ''}
                    onChange={(e) => {
                      setFormData({ ...formData, joinDate: e.target.value });
                      if (formErrors.joinDate) setFormErrors((prev) => ({ ...prev, joinDate: '' }));
                    }}
                    className={`w-full px-3 py-2 bg-slate-50 border rounded-md text-xs text-slate-800 focus:bg-white focus:outline-hidden focus:border-[#0275a8] ${
                      formErrors.joinDate ? 'border-red-400 bg-red-50/40' : 'border-slate-300'
                    }`}
                  />
                  {formErrors.joinDate && <span className="text-[10px] text-red-500 mt-0.5 block">{formErrors.joinDate}</span>}
                </div>

                {/* 5. Entity */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Entity <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.entity || 'Eshara'}
                    onChange={(e) => {
                      const newEnt = e.target.value;
                      const funcs = getEntityFunctionals(newEnt);
                      const defFunc = funcs.functional[0] || '';
                      const newDepts = getDepartmentsForEntityAndFunctional(newEnt, defFunc);
                      const defDept = newDepts[0] || '';
                      setFormData({
                        ...formData,
                        entity: newEnt,
                        function: defFunc,
                        section: defFunc,
                        department: defDept
                      });
                      if (formErrors.entity) setFormErrors((prev) => ({ ...prev, entity: '' }));
                    }}
                    className={`w-full px-3 py-2 bg-slate-50 border rounded-md text-xs text-slate-800 font-bold focus:bg-white focus:outline-hidden focus:border-[#0275a8] ${
                      formErrors.entity ? 'border-red-400 bg-red-50/40' : 'border-slate-300'
                    }`}
                  >
                    <option value="Eshara">Eshara</option>
                    <option value="YHA">YHA</option>
                    {formData.entity === 'GANS' && <option value="GANS">GANS (Synced)</option>}
                  </select>
                  {formErrors.entity && <span className="text-[10px] text-red-500 mt-0.5 block">{formErrors.entity}</span>}
                </div>

                {/* 6. Functional */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Functional <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.function || ''}
                    onChange={(e) => {
                      const newFunc = e.target.value;
                      const curEntity = formData.entity || 'GANS';
                      const newDepts = getDepartmentsForEntityAndFunctional(curEntity, newFunc);
                      const defDept = newDepts[0] || formData.department;
                      setFormData({
                        ...formData,
                        function: newFunc,
                        section: newFunc,
                        department: defDept
                      });
                      if (formErrors.function) setFormErrors((prev) => ({ ...prev, function: '' }));
                    }}
                    className={`w-full px-3 py-2 bg-slate-50 border rounded-md text-xs text-slate-800 focus:bg-white focus:outline-hidden focus:border-[#0275a8] ${
                      formErrors.function ? 'border-red-400 bg-red-50/40' : 'border-slate-300'
                    }`}
                  >
                    <option value="">Select Functional</option>
                    {entityFunctionals.functional.length > 0 && (
                      <optgroup label="Functional">
                        {entityFunctionals.functional.map((fn) => (
                          <option key={fn} value={fn}>{fn}</option>
                        ))}
                      </optgroup>
                    )}
                    {entityFunctionals.nonFunctional.length > 0 && (
                      <optgroup label="NON functional">
                        {entityFunctionals.nonFunctional.map((nfn) => (
                          <option key={nfn} value={nfn}>{nfn}</option>
                        ))}
                      </optgroup>
                    )}
                  </select>
                  {formErrors.function && <span className="text-[10px] text-red-500 mt-0.5 block">{formErrors.function}</span>}
                </div>

                {/* 7. Department */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Department <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.department}
                    onChange={(e) => {
                      setFormData({ ...formData, department: e.target.value });
                      if (formErrors.department) setFormErrors((prev) => ({ ...prev, department: '' }));
                    }}
                    className={`w-full px-3 py-2 bg-slate-50 border rounded-md text-xs text-slate-800 focus:bg-white focus:outline-hidden focus:border-[#0275a8] ${
                      formErrors.department ? 'border-red-400 bg-red-50/40' : 'border-slate-300'
                    }`}
                  >
                    <option value="">Select Department</option>
                    {currentEntityDepartments.map((dept) => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                  {formErrors.department && <span className="text-[10px] text-red-500 mt-0.5 block">{formErrors.department}</span>}
                </div>

                {/* 8. Division */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Division <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.division}
                    onChange={(e) => {
                      setFormData({ ...formData, division: e.target.value });
                      if (formErrors.division) setFormErrors((prev) => ({ ...prev, division: '' }));
                    }}
                    className={`w-full px-3 py-2 bg-slate-50 border rounded-md text-xs text-slate-800 focus:bg-white focus:outline-hidden focus:border-[#0275a8] ${
                      formErrors.division ? 'border-red-400 bg-red-50/40' : 'border-slate-300'
                    }`}
                  >
                    <option value="">Select Division</option>
                    {availableDivisions.map((div) => (
                      <option key={div} value={div}>{div}</option>
                    ))}
                  </select>
                  {formErrors.division && <span className="text-[10px] text-red-500 mt-0.5 block">{formErrors.division}</span>}
                </div>

                {/* 9. Grade */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Grade <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.grade}
                    onChange={(e) => {
                      setFormData({ ...formData, grade: parseInt(e.target.value, 10) });
                      if (formErrors.grade) setFormErrors((prev) => ({ ...prev, grade: '' }));
                    }}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md text-xs text-slate-800 focus:bg-white focus:outline-hidden focus:border-[#0275a8]"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((g) => (
                      <option key={g} value={g}>Grade {g}</option>
                    ))}
                  </select>
                  {formErrors.grade && <span className="text-[10px] text-red-500 mt-0.5 block">{formErrors.grade}</span>}
                </div>

                {/* 10. Manager */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Manager <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.reportingManager}
                    onChange={(e) => {
                      setFormData({ ...formData, reportingManager: e.target.value });
                      if (formErrors.reportingManager) setFormErrors((prev) => ({ ...prev, reportingManager: '' }));
                    }}
                    className={`w-full px-3 py-2 bg-slate-50 border rounded-md text-xs text-slate-800 focus:bg-white focus:outline-hidden focus:border-[#0275a8] ${
                      formErrors.reportingManager ? 'border-red-400 bg-red-50/40' : 'border-slate-300'
                    }`}
                  >
                    <option value="">Select Manager</option>
                    {availableManagers.map((mgr) => (
                      <option key={mgr} value={mgr}>{mgr}</option>
                    ))}
                  </select>
                  {formErrors.reportingManager && <span className="text-[10px] text-red-500 mt-0.5 block">{formErrors.reportingManager}</span>}
                </div>

                {/* 11. Location */}
                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">
                    Location <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.location || 'Abu Dhabi HQ'}
                    onChange={(e) => {
                      setFormData({ ...formData, location: e.target.value });
                      if (formErrors.location) setFormErrors((prev) => ({ ...prev, location: '' }));
                    }}
                    className={`w-full px-3 py-2 bg-slate-50 border rounded-md text-xs text-slate-800 focus:bg-white focus:outline-hidden focus:border-[#0275a8] ${
                      formErrors.location ? 'border-red-400 bg-red-50/40' : 'border-slate-300'
                    }`}
                  >
                    {availableLocations.map((loc) => (
                      <option key={loc} value={loc}>{loc}</option>
                    ))}
                  </select>
                  {formErrors.location && <span className="text-[10px] text-red-500 mt-0.5 block">{formErrors.location}</span>}
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-[#1a5075] to-[#0275a8] hover:from-[#154668] hover:to-[#01628d] text-white font-bold text-xs rounded-lg shadow-sm transition-all cursor-pointer active:scale-95 flex items-center justify-center"
                >
                  <span>{modalMode === 'add' ? 'Add Employee' : 'Save Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmEmp && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 p-5 space-y-4">
            <p className="text-sm text-slate-700 leading-relaxed font-medium">
              Are you sure you want to delete <strong className="text-slate-900 font-bold">{deleteConfirmEmp.name}</strong>? This action cannot be undone.
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setDeleteConfirmEmp(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-xs transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (onDeleteEmployee && deleteConfirmEmp) {
                    onDeleteEmployee(deleteConfirmEmp.id);
                  }
                  setDeleteConfirmEmp(null);
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-xs shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PRE-RELEASE WARNING MODAL FOR ALREADY RELEASED / SKIPPED EMPLOYEES */}
      {alreadyReleasedPrompt && (() => {
        const releasedCount = alreadyReleasedPrompt.flaggedList.filter((f) => f.flagType === 'released').length;
        const skippedCount = alreadyReleasedPrompt.flaggedList.filter((f) => f.flagType === 'skipped').length;
        const totalFlagged = alreadyReleasedPrompt.flaggedList.length;
        const isBoth = releasedCount > 0 && skippedCount > 0;
        const isReleasedOnly = releasedCount > 0 && skippedCount === 0;
        const isSkippedOnly = skippedCount > 0 && releasedCount === 0;

        return (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-[#1a5075] to-[#154668] text-white px-5 py-4 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-amber-400/20 text-amber-300 flex items-center justify-center border border-amber-400/30">
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm sm:text-base text-white">LNA Release Status Notice</h3>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setAlreadyReleasedPrompt(null)}
                  className="text-white/70 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-5 space-y-4 text-xs">
                {/* Main Warning Box */}
                <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-amber-950">
                  <div className="text-xs font-semibold flex items-center gap-2.5 text-amber-900 leading-relaxed">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>
                      LNA has already been released for {releasedCount} selected employee{releasedCount > 1 ? 's' : ''} in the active cycle. Do you want to proceed?
                    </span>
                  </div>
                </div>

                {/* Status Breakdown Numbers */}
                <div className="grid grid-cols-3 gap-2 py-1">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-col items-center justify-center text-center">
                    <span className="text-lg font-bold text-slate-800">{alreadyReleasedPrompt.allTargetIds.length}</span>
                    <span className="text-[11px] font-semibold text-slate-600 mt-0.5">Total</span>
                  </div>
                  <div className="p-3 rounded-xl bg-sky-50/70 border border-sky-200 flex flex-col items-center justify-center text-center">
                    <span className="text-lg font-bold text-sky-900">{releasedCount}</span>
                    <span className="text-[11px] font-semibold text-sky-800 mt-0.5">Already released</span>
                  </div>
                  <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 flex flex-col items-center justify-center text-center">
                    <span className="text-lg font-bold text-emerald-900">{alreadyReleasedPrompt.pendingIds.length}</span>
                    <span className="text-[11px] font-semibold text-emerald-800 mt-0.5">Going to release</span>
                  </div>
                </div>

                {/* History Notice Box with Navigation Link */}
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-2.5">
                  <div className="flex items-center gap-2 text-slate-600">
                    <History className="w-4 h-4 text-[#0275a8] shrink-0" />
                    <span className="text-[11px] text-slate-600">
                      See full details in <strong className="text-slate-800">Release History</strong>.
                    </span>
                  </div>
                  {onNavigateToHistory && (
                    <button
                      type="button"
                      onClick={() => {
                        setAlreadyReleasedPrompt(null);
                        onNavigateToHistory();
                      }}
                      className="shrink-0 inline-flex items-center gap-1 text-[11px] font-bold text-[#0275a8] hover:text-[#02628d] hover:underline cursor-pointer"
                    >
                      <span>Release History</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>

              {/* Modal Footer Actions */}
              <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setAlreadyReleasedPrompt(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 bg-white border border-slate-200 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={() => executeRelease(alreadyReleasedPrompt.mode, alreadyReleasedPrompt.allTargetIds)}
                  className="px-5 py-2 text-xs font-bold text-white bg-[#0275a8] hover:bg-[#02628d] rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Release</span>
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* =========================================================================
          BULK IMPORT EMPLOYEES MODAL
          ========================================================================= */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="p-5 bg-gradient-to-r from-[#1a5075] via-[#154668] to-[#0275a8] text-white flex items-center justify-between gap-4 border-b border-white/10 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center text-white backdrop-blur-xs border border-white/20">
                  <Upload className="w-5 h-5 text-sky-200" />
                </div>
                <div>
                  <h2 className="text-base font-black tracking-tight text-white">
                    Bulk Import Employees
                  </h2>
                  <p className="text-[11px] text-sky-100">
                    Upload a CSV file to batch onboard employee records
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsImportModalOpen(false);
                  setImportParsedList([]);
                  setImportError(null);
                }}
                className="p-1.5 rounded-xl hover:bg-white/20 text-white/80 hover:text-white transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 overflow-y-auto text-xs">
              
              {/* Template Download Section */}
              <div className="p-4 bg-sky-50/70 border border-sky-200/80 rounded-2xl flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-sky-100 text-[#0275a8] flex items-center justify-center shrink-0">
                    <FileSpreadsheet className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-xs">Download CSV Template</h4>
                    <p className="text-[11px] text-slate-500">
                      Standard format with pre-configured headers for Eshara &amp; YHA
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleDownloadSampleEmployeeCsv}
                  className="px-3.5 py-1.5 bg-white hover:bg-sky-50 text-[#0275a8] hover:text-[#1a5075] font-bold text-xs rounded-xl border border-sky-300 shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Sample</span>
                </button>
              </div>

              {/* Hidden File Input */}
              <input
                ref={importFileInputRef}
                type="file"
                accept=".csv"
                onChange={handleImportFileChange}
                className="hidden"
              />

              {/* Upload Zone */}
              <div
                onClick={() => importFileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                  importParsedList.length > 0
                    ? 'border-emerald-300 bg-emerald-50/40 hover:bg-emerald-50/60'
                    : 'border-slate-300 hover:border-[#0275a8] bg-slate-50 hover:bg-white'
                }`}
              >
                <div className="w-12 h-12 rounded-2xl bg-white shadow-xs border border-slate-200 flex items-center justify-center mx-auto mb-2 text-[#0275a8]">
                  <Upload className="w-6 h-6" />
                </div>
                {importFileName ? (
                  <div>
                    <p className="font-bold text-slate-800 text-xs">{importFileName}</p>
                    <p className="text-[11px] text-emerald-700 font-bold mt-1">
                      ✓ {importParsedList.length} employee record{importParsedList.length !== 1 ? 's' : ''} ready to import
                    </p>
                    <span className="text-[10px] text-slate-400 mt-1 inline-block underline">
                      Click to choose another CSV file
                    </span>
                  </div>
                ) : (
                  <div>
                    <p className="font-bold text-slate-700 text-xs">
                      Click to choose a CSV file
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Supports comma-separated values (.csv)
                    </p>
                  </div>
                )}
              </div>

              {/* Error Notice */}
              {importError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-[11px] flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
                  <span>{importError}</span>
                </div>
              )}

              {/* Records Preview Table */}
              {importParsedList.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-500 font-semibold px-1">
                    <span>Parsed Preview ({importParsedList.length} records)</span>
                    <span className="text-emerald-700 font-bold">Ready</span>
                  </div>
                  <div className="border border-slate-200 rounded-xl overflow-hidden max-h-48 overflow-y-auto">
                    <table className="w-full text-left text-[11px]">
                      <thead className="bg-slate-100 text-slate-600 font-bold border-b border-slate-200">
                        <tr>
                          <th className="py-2 px-3">Name</th>
                          <th className="py-2 px-3">Emp ID</th>
                          <th className="py-2 px-3">Entity</th>
                          <th className="py-2 px-3">Designation</th>
                          <th className="py-2 px-3">Department</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {importParsedList.slice(0, 6).map((emp, idx) => (
                          <tr key={idx} className="hover:bg-slate-50">
                            <td className="py-2 px-3 font-semibold text-slate-800">{emp.name}</td>
                            <td className="py-2 px-3 font-mono text-slate-500">{emp.employeeId}</td>
                            <td className="py-2 px-3">
                              <span className="px-1.5 py-0.5 rounded bg-sky-50 text-sky-800 font-bold text-[10px]">
                                {emp.entity || 'GANS'}
                              </span>
                            </td>
                            <td className="py-2 px-3 text-slate-600 truncate max-w-[120px]">{emp.position}</td>
                            <td className="py-2 px-3 text-slate-600 truncate max-w-[120px]">{emp.department}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {importParsedList.length > 6 && (
                    <p className="text-[10px] text-center text-slate-400 italic">
                      + {importParsedList.length - 6} more employee records included
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2.5 shrink-0">
              <button
                type="button"
                onClick={() => {
                  setIsImportModalOpen(false);
                  setImportParsedList([]);
                  setImportError(null);
                }}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 bg-white border border-slate-200 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={importParsedList.length === 0}
                onClick={handleConfirmImport}
                className="px-5 py-2 text-xs font-bold text-white bg-gradient-to-r from-[#1a5075] to-[#0275a8] hover:from-[#154668] hover:to-[#01628d] disabled:opacity-50 disabled:pointer-events-none rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Import {importParsedList.length > 0 ? `${importParsedList.length} Employees` : 'Employees'}</span>
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
