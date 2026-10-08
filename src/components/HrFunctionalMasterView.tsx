import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  Building2,
  FolderTree,
  Network,
  X,
  CheckCircle2,
  Search,
  Pencil,
  Trash2,
  ChevronDown,
  Check,
  Briefcase
} from 'lucide-react';

export type FunctionalEntity = 'GANS' | 'Eshara' | 'YHA';

export interface FunctionalRecord {
  id: string;
  entity: FunctionalEntity;
  positions?: string[];
  departments: string[];
  functional: string;
}

export const STANDARD_POSITIONS: string[] = [
  'Senior NWP Meteorologist',
  'ATS Instructor',
  'Head of Training Center',
  'Deputy Manager ATS',
  'Head of ATS',
  'Air Traffic Control Officer - Approach',
  'Air Traffic Control Officer - Tower',
  'Air Traffic Control Assistant',
  'ICTS Operations Team Lead',
  'ATSEP Training Officer',
  'Manager ATS',
  'ATSEP Technical Supervisor',
  'ATSEP Technician',
  'Aerodrome Flight Information Services Officer',
  'ATC Supervisor',
  'Manager HR Operations & Performance',
  'Administrative Assistant',
  'ICT & Simulator Administrator',
  'Senior AIS Officer',
  'Deputy Meteorology Manager',
  'Logistic Support Relation Officer',
  'Senior Research Meteorologist',
  'Senior Technical Officer',
  'Manager Operational Training',
  'ANS Risk & Compliance Manager',
  'Deputy Head of ATS',
  'Senior Radar and AWOS Technician',
  'Software & Application Developer',
  'Radar and AWOS Technician',
  'Pseudo Pilot',
  'AGL Supervisor',
  'Deputy Airfield Operations Manager',
  'Senior Accountant',
  'Cyber Security Specialist',
  'Air Traffic Control Officer (Examiner)',
  'Team Leader Pseudo Pilot',
  'Driver',
  'AGL Technician',
  'Warehouse Officer',
  'Barrier Technician',
  'Airfield Operations Controller',
  'ANS SMS Specialist',
  'Weather Forecaster',
  'Weather Observer',
  'Data Verification Officer',
  'Talent Development Officer',
  'ATS Training Specialist',
  'Procurement Coordinator',
  'English Instructor',
  'Network Specialist',
  'ATM Adaptation & Traffic Analyst',
  'Head ANS Engineering Services',
  'ATSEP Engineering Specialist - NAV/Comms',
  'ATSEP Engineer',
  'Senior Air Traffic Control Assistant',
  'Security Officer',
  'Logistics Coordinator',
  'Technical Support Officer',
  'Logistics Officer',
  'Operations Specialist APS',
  'Head of Safety & Compliance',
  'HR Business Partner',
  'Airside Driver',
  'Logistic Support Officer',
  'Air Traffic Control Assistant (Examiner)',
  'Assistant Weather Forecaster',
  'Senior Weather Forecaster',
  'Training Administration Officer',
  'Senior HR Operations Officer',
  'Liaison Officer (Engg. & AOPS)',
  'Service Delivery Officer',
  'Customer Liaison Officer',
  'ICT System Support Administrator',
  'Senior Accountant - Accounts Payable',
  'ATC Supervisor (Delma)',
  'Senior Security Officer',
  'Chief ATS Instructor',
  'Employee Relation Officer',
  'Assistant Weather Observer',
  'ANS Risk & Compliance Officer',
  'Operations Specialist ADC',
  'Director - Civil',
  'Air Traffic Control Officer - Tower (Delma)',
  'AIS Officer',
  'AIS Assistant',
  'ATSEP Senior Engineering Specialist',
  'ATSEP Engineering Specialist - Radar',
  'Briefing Assistant',
  'ANS SMS Manager',
  'ANS IMS Technical Systems Officer',
  'ATS Licensing Officer',
  'Team Leader - ATM Adaptation & Traffic Analysis',
  'Chief Designer',
  'HSE Officer',
  'Finance Director',
  'Generator AC Technician',
  'ANS Quality Officer',
  'Barrier Supervisor',
  'Head of ANS Projects',
  'ATSEP Engineering Specialist - Network',
  'Engineering Training Manager',
  'Technical Supervisor - AC & Hydraulic',
  'Auto CAD Officer'
];

const INITIAL_FUNCTIONAL_RECORDS: FunctionalRecord[] = [
  // GANS (Central Database Entity)
  {
    id: 'fn-gans-1',
    entity: 'GANS',
    positions: ['Air Traffic Control Officer - Tower', 'Air Traffic Control Officer - Approach', 'Senior NWP Meteorologist'],
    departments: ['Air Traffic Management', 'Aeronautical Meteorology'],
    functional: 'Air Operations'
  },
  {
    id: 'fn-gans-2',
    entity: 'GANS',
    positions: ['ATSEP Engineer', 'ATSEP Technical Supervisor', 'Radar and AWOS Technician'],
    departments: ['CNS Systems Engineering', 'IT Infrastructure'],
    functional: 'Engineering Services'
  },
  {
    id: 'fn-gans-3',
    entity: 'GANS',
    positions: ['Head of Safety & Compliance', 'ANS Risk & Compliance Manager', 'ANS Quality Officer'],
    departments: ['Aviation Safety & Quality'],
    functional: 'Safety & Quality Assurance'
  },
  {
    id: 'fn-gans-4',
    entity: 'GANS',
    positions: ['HR Business Partner', 'Senior HR Operations Officer', 'Senior Accountant'],
    departments: ['Human Resources', 'Finance & Accounts', 'Legal & Regulatory'],
    functional: 'Corporate Administration'
  },

  // Eshara
  {
    id: 'fn-esh-1',
    entity: 'Eshara',
    positions: ['Air Traffic Control Assistant', 'ATS Instructor', 'Airfield Operations Controller'],
    departments: ['En-Route Air Traffic Operations', 'Terminal Control & Aerodromes'],
    functional: 'Air Traffic Management'
  },
  {
    id: 'fn-esh-2',
    entity: 'Eshara',
    positions: ['ATSEP Technician', 'Senior Radar and AWOS Technician'],
    departments: ['Navigation & Surveillance Engineering'],
    functional: 'CNS Systems'
  },
  {
    id: 'fn-esh-3',
    entity: 'Eshara',
    positions: ['ANS SMS Specialist', 'HSE Officer'],
    departments: ['Operational Safety Assurance'],
    functional: 'Aviation Safety'
  },
  {
    id: 'fn-esh-4',
    entity: 'Eshara',
    positions: ['ATS Training Specialist', 'English Instructor', 'Training Administration Officer'],
    departments: ['Training Academy'],
    functional: 'Workforce Development'
  },

  // YHA
  {
    id: 'fn-yha-1',
    entity: 'YHA',
    positions: ['Director - Civil', 'Customer Liaison Officer'],
    departments: ['Aviation Advisory & Strategy'],
    functional: 'Aviation Consulting'
  },
  {
    id: 'fn-yha-2',
    entity: 'YHA',
    positions: ['ATM Adaptation & Traffic Analyst', 'Chief Designer'],
    departments: ['Airspace Engineering'],
    functional: 'Airspace Optimization'
  },
  {
    id: 'fn-yha-3',
    entity: 'YHA',
    positions: ['ANS Risk & Compliance Officer', 'ATS Licensing Officer'],
    departments: ['Regulatory Compliance', 'Safety Oversight & Standards'],
    functional: 'Regulatory & Standards'
  },
  {
    id: 'fn-yha-4',
    entity: 'YHA',
    positions: ['Senior Research Meteorologist', 'Weather Forecaster'],
    departments: ['Sustainability Solutions', 'Environmental Performance Management'],
    functional: 'Green Aviation'
  }
];

interface HrFunctionalMasterViewProps {
  onNavigateToCompetencies?: () => void;
}

export const HrFunctionalMasterView: React.FC<HrFunctionalMasterViewProps> = () => {
  // Option in the top to select the entities: GANS, Eshara, YHA
  const [activeEntity, setActiveEntity] = useState<FunctionalEntity>('GANS');

  // Master records state (persisted in localStorage)
  const [records, setRecords] = useState<FunctionalRecord[]>(() => {
    try {
      const saved = localStorage.getItem('functional_master_entity_records_v4');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((r: FunctionalRecord) => ({
            ...r,
            positions: r.positions || []
          }));
        }
      }
      return INITIAL_FUNCTIONAL_RECORDS;
    } catch {
      return INITIAL_FUNCTIONAL_RECORDS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('functional_master_entity_records_v4', JSON.stringify(records));
    } catch (e) {
      console.error(e);
    }
  }, [records]);

  // Form input state: Entity -> Position -> Department -> Function
  const [selectedPositions, setSelectedPositions] = useState<string[]>([]);
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [functionalInput, setFunctionalInput] = useState('');
  const [editingRecordId, setEditingRecordId] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [actionToast, setActionToast] = useState<{ message: string; type: 'success' | 'info' } | null>(null);

  // Position dropdown state
  const [isPositionDropdownOpen, setIsPositionDropdownOpen] = useState(false);
  const [positionSearchQuery, setPositionSearchQuery] = useState('');
  const positionDropdownRef = useRef<HTMLDivElement>(null);

  // Department dropdown state
  const [isDeptDropdownOpen, setIsDeptDropdownOpen] = useState(false);
  const [deptSearchQuery, setDeptSearchQuery] = useState('');
  const deptDropdownRef = useRef<HTMLDivElement>(null);

  // Search & filter state for table
  const [searchQuery, setSearchQuery] = useState('');
  const [tableEntityFilter, setTableEntityFilter] = useState<'ALL' | FunctionalEntity>('ALL');
  const [tableDeptFilter, setTableDeptFilter] = useState<string>('ALL');
  const [tablePositionFilter, setTablePositionFilter] = useState<string>('ALL');

  // Delete confirmation state
  const [deleteConfirmRecord, setDeleteConfirmRecord] = useState<FunctionalRecord | null>(null);

  // Close dropdowns when clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (deptDropdownRef.current && !deptDropdownRef.current.contains(event.target as Node)) {
        setIsDeptDropdownOpen(false);
      }
      if (positionDropdownRef.current && !positionDropdownRef.current.contains(event.target as Node)) {
        setIsPositionDropdownOpen(false);
      }
    };
    if (isDeptDropdownOpen || isPositionDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDeptDropdownOpen, isPositionDropdownOpen]);

  // Filter records by selected entity
  const entityRecords = useMemo(() => {
    return records.filter((r) => r.entity === activeEntity);
  }, [records, activeEntity]);

  // All known departments across all records
  const allKnownDepartments = useMemo(() => {
    const deptSet = new Set<string>();
    records.forEach((r) => {
      r.departments.forEach((d) => deptSet.add(d));
    });
    return Array.from(deptSet).sort((a, b) => a.localeCompare(b));
  }, [records]);

  // Available departments for the selected entity (from records + Department Master)
  const availableDepartments = useMemo(() => {
    const deptSet = new Set<string>();

    // Current records for this entity
    entityRecords.forEach((r) => {
      r.departments.forEach((d) => deptSet.add(d));
    });

    // Departments from Department Master if saved in localStorage
    try {
      if (activeEntity === 'Eshara') {
        const saved = localStorage.getItem('eshara_departments_master_v1');
        if (saved) {
          const list = JSON.parse(saved);
          list.forEach((d: { name: string }) => {
            if (d.name) deptSet.add(d.name);
          });
        }
      } else if (activeEntity === 'YHA') {
        const saved = localStorage.getItem('yha_departments_master_v1');
        if (saved) {
          const list = JSON.parse(saved);
          list.forEach((d: { name: string }) => {
            if (d.name) deptSet.add(d.name);
          });
        }
      } else if (activeEntity === 'GANS') {
        deptSet.add('Air Traffic Management');
        deptSet.add('CNS Systems Engineering');
        deptSet.add('Aeronautical Meteorology');
        deptSet.add('Aviation Safety & Quality');
        deptSet.add('Human Resources');
        deptSet.add('Finance & Accounts');
        deptSet.add('IT Infrastructure');
        deptSet.add('Legal & Regulatory');
      }
    } catch (e) {
      console.error(e);
    }

    selectedDepartments.forEach((d) => deptSet.add(d));

    return Array.from(deptSet).sort((a, b) => a.localeCompare(b));
  }, [entityRecords, activeEntity, selectedDepartments]);

  // Toggle position in multiselect
  const handleTogglePosition = (pos: string) => {
    setSelectedPositions((prev) => {
      const exists = prev.includes(pos);
      const next = exists ? prev.filter((p) => p !== pos) : [...prev, pos];
      if (errors.position && next.length > 0) {
        setErrors((errs) => ({ ...errs, position: '' }));
      }
      return next;
    });
  };

  // Toggle department in multiselect
  const handleToggleDepartment = (dept: string) => {
    setSelectedDepartments((prev) => {
      const exists = prev.includes(dept);
      const next = exists ? prev.filter((d) => d !== dept) : [...prev, dept];
      if (errors.department && next.length > 0) {
        setErrors((errs) => ({ ...errs, department: '' }));
      }
      return next;
    });
  };

  // Filtered positions based on position search box
  const filteredPositions = useMemo(() => {
    if (!positionSearchQuery.trim()) return STANDARD_POSITIONS;
    const q = positionSearchQuery.toLowerCase();
    return STANDARD_POSITIONS.filter((p) => p.toLowerCase().includes(q));
  }, [positionSearchQuery]);

  // Filtered departments based on department search box
  const filteredAvailableDepartments = useMemo(() => {
    if (!deptSearchQuery.trim()) return availableDepartments;
    const q = deptSearchQuery.toLowerCase();
    return availableDepartments.filter((d) => d.toLowerCase().includes(q));
  }, [availableDepartments, deptSearchQuery]);

  // Filtered records based on entity, department, position, and search
  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      // 1. Entity filter
      if (tableEntityFilter !== 'ALL' && r.entity !== tableEntityFilter) {
        return false;
      }
      // 2. Department filter
      if (tableDeptFilter !== 'ALL') {
        const hasDept = r.departments && r.departments.includes(tableDeptFilter);
        if (!hasDept) return false;
      }
      // 3. Position filter
      if (tablePositionFilter !== 'ALL') {
        const hasPos = r.positions && r.positions.includes(tablePositionFilter);
        if (!hasPos) return false;
      }
      // 4. Function / general search
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      const matchFn = r.functional.toLowerCase().includes(q);
      const matchDept = r.departments.some((d) => d.toLowerCase().includes(q));
      const matchPos = r.positions && r.positions.some((p) => p.toLowerCase().includes(q));
      const matchEntity = r.entity.toLowerCase().includes(q);
      return matchFn || matchDept || matchPos || matchEntity;
    });
  }, [records, tableEntityFilter, tableDeptFilter, tablePositionFilter, searchQuery]);

  const resetForm = () => {
    setSelectedPositions([]);
    setSelectedDepartments([]);
    setFunctionalInput('');
    setPositionSearchQuery('');
    setDeptSearchQuery('');
    setEditingRecordId(null);
    setErrors({});
    setIsPositionDropdownOpen(false);
    setIsDeptDropdownOpen(false);
  };

  const handleEditRecord = (record: FunctionalRecord) => {
    setEditingRecordId(record.id);
    setActiveEntity(record.entity);
    setSelectedPositions([...(record.positions || [])]);
    setSelectedDepartments([...record.departments]);
    setFunctionalInput(record.functional);
    setErrors({});
    setIsPositionDropdownOpen(false);
    setIsDeptDropdownOpen(false);

    const formCard = document.getElementById('functional-entry-form');
    if (formCard) {
      formCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleSave = () => {
    const newErrors: Record<string, string> = {};
    if (selectedDepartments.length === 0) {
      newErrors.department = 'At least one department is required';
    }
    if (selectedPositions.length === 0) {
      newErrors.position = 'At least one position is required';
    }
    if (!functionalInput.trim()) {
      newErrors.functional = 'Function is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const trimmedFn = functionalInput.trim();

    if (editingRecordId) {
      setRecords((prev) =>
        prev.map((r) =>
          r.id === editingRecordId
            ? {
                ...r,
                entity: activeEntity,
                positions: [...selectedPositions],
                departments: [...selectedDepartments],
                functional: trimmedFn
              }
            : r
        )
      );
      setActionToast({ message: 'Record updated successfully.', type: 'success' });
    } else {
      const newRecord: FunctionalRecord = {
        id: `fn-${activeEntity.toLowerCase()}-${Date.now()}`,
        entity: activeEntity,
        positions: [...selectedPositions],
        departments: [...selectedDepartments],
        functional: trimmedFn
      };
      setRecords((prev) => [...prev, newRecord]);
      setActionToast({ message: 'Record saved successfully.', type: 'success' });
    }

    setTimeout(() => setActionToast(null), 3000);
    resetForm();
  };

  const handleConfirmDelete = () => {
    if (!deleteConfirmRecord) return;
    const toDelete = deleteConfirmRecord;
    setRecords((prev) => prev.filter((r) => r.id !== toDelete.id));
    setActionToast({ message: 'Record removed successfully.', type: 'info' });
    setTimeout(() => setActionToast(null), 3000);
    setDeleteConfirmRecord(null);
    if (editingRecordId === toDelete.id) {
      resetForm();
    }
  };

  return (
    <div id="functional-master-container" className="space-y-6 pb-16">
      {/* Toast Notification */}
      {actionToast && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg bg-[#211E4E] text-white border border-[#C8A977]/30 text-xs font-bold">
          <CheckCircle2 className="w-4 h-4 text-[#C8A977]" />
          <span>{actionToast.message}</span>
          <button
            type="button"
            onClick={() => setActionToast(null)}
            className="ml-2 hover:bg-white/20 p-1 rounded cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-[#211E4E] rounded-xl p-5 text-white shadow-md border border-[#C8A977]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2.5">
            <FolderTree className="w-6 h-6 text-[#C8A977]" />
            <span>Functional Master</span>
          </h1>
        </div>
      </div>

      {/* Entry Form: Entity -> Department -> Position -> Function */}
      <div
        id="functional-entry-form"
        className="rounded-xl bg-white border border-slate-200 p-6 shadow-xs space-y-5"
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h2 className="text-sm font-extrabold text-slate-800">
            {editingRecordId
              ? 'Edit Entity, Department, Position & Function'
              : 'Enter Entity, Department, Position & Function'}
          </h2>
          {editingRecordId && (
            <button
              type="button"
              onClick={resetForm}
              className="text-xs text-[#211E4E] hover:text-[#C8A977] hover:underline cursor-pointer transition-colors"
            >
              Cancel Edit
            </button>
          )}
        </div>

        {/* FOUR COLUMNS IN ORDER: 1. ENTITY -> 2. DEPARTMENT -> 3. POSITION -> 4. FUNCTION */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
          {/* 1. ENTITY */}
          <div id="box-entity" className="space-y-1.5">
            <label className="block font-bold text-slate-800 text-xs">
              Entity <span className="text-red-500">*</span>
            </label>
            <select
              id="select-entity"
              value={activeEntity}
              onChange={(e) => {
                const newEnt = e.target.value as FunctionalEntity;
                setActiveEntity(newEnt);
                setSelectedDepartments([]);
              }}
              className="w-full min-h-[42px] px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-[#C8A977]/30 focus:border-[#C8A977] cursor-pointer"
            >
              <option value="GANS">GANS</option>
              <option value="Eshara">Eshara</option>
              <option value="YHA">YHA</option>
            </select>
          </div>

          {/* 2. DEPARTMENT (MULTISELECT DROPDOWN WITH SEARCH ON TOP) */}
          <div id="box-department" className="space-y-1.5" ref={deptDropdownRef}>
            <div className="flex items-center justify-between">
              <label className="block font-bold text-slate-800 text-xs">
                Department <span className="text-red-500">*</span>
              </label>
              {selectedDepartments.length > 0 && (
                <span className="text-[11px] text-[#211E4E] font-semibold">
                  {selectedDepartments.length} selected
                </span>
              )}
            </div>

            {/* Department Multiselect Dropdown Trigger */}
            <div className="relative">
              <div
                id="btn-dept-multiselect"
                onClick={() => setIsDeptDropdownOpen(!isDeptDropdownOpen)}
                className={`w-full min-h-[42px] px-3.5 py-2 bg-slate-50 border rounded-xl text-xs font-bold cursor-pointer transition-all flex items-center justify-between gap-2 ${
                  isDeptDropdownOpen
                    ? 'border-[#C8A977] ring-2 ring-[#C8A977]/30 bg-white'
                    : errors.department
                    ? 'border-red-400 bg-red-50/20'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex flex-wrap gap-1.5 items-center flex-1 max-w-[90%]">
                  {selectedDepartments.length === 0 ? (
                    <span className="text-slate-400 font-normal">Select departments...</span>
                  ) : (
                    selectedDepartments.map((dept) => (
                      <span
                        key={dept}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#211E4E]/10 text-[#211E4E] text-[11px] font-bold"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleDepartment(dept);
                        }}
                      >
                        <span className="truncate max-w-[130px]">{dept}</span>
                        <X className="w-3 h-3 hover:text-red-600 shrink-0" />
                      </span>
                    ))
                  )}
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${
                    isDeptDropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </div>

              {/* Multiselect Popover with Search on Top */}
              {isDeptDropdownOpen && (
                <div className="absolute z-30 left-0 top-12 w-full min-w-[280px] bg-white border border-slate-200 rounded-xl shadow-xl p-2.5 text-xs space-y-2 animate-in fade-in zoom-in-95 duration-100">
                  {/* Search on top */}
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={deptSearchQuery}
                      onChange={(e) => setDeptSearchQuery(e.target.value)}
                      placeholder="Search department..."
                      className="w-full pl-8 pr-7 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:outline-hidden focus:border-[#C8A977] focus:bg-white"
                      autoFocus
                    />
                    {deptSearchQuery && (
                      <button
                        type="button"
                        onClick={() => setDeptSearchQuery('')}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>

                  {selectedDepartments.length > 0 && (
                    <div className="flex items-center justify-end px-1 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                      <button
                        type="button"
                        onClick={() => setSelectedDepartments([])}
                        className="text-[#211E4E] hover:underline cursor-pointer"
                      >
                        Clear All
                      </button>
                    </div>
                  )}

                  {/* Department Checkbox List */}
                  <div className="max-h-56 overflow-y-auto space-y-1 pr-1">
                    {filteredAvailableDepartments.length === 0 ? (
                      <p className="text-slate-400 text-center py-3 text-[11px]">
                        No departments match "{deptSearchQuery}"
                      </p>
                    ) : (
                      filteredAvailableDepartments.map((dept) => {
                        const isSelected = selectedDepartments.includes(dept);
                        return (
                          <label
                            key={dept}
                            className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg cursor-pointer transition-colors ${
                              isSelected
                                ? 'bg-[#211E4E]/5 text-[#211E4E] font-bold'
                                : 'hover:bg-slate-50 text-slate-700 font-medium'
                            }`}
                          >
                            <div
                              className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                                isSelected
                                  ? 'bg-[#211E4E] border-[#211E4E] text-[#C8A977]'
                                  : 'border-slate-300 bg-white'
                              }`}
                            >
                              {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                            </div>
                            <span className="text-xs truncate">{dept}</span>
                          </label>
                        );
                      })
                    )}
                  </div>
                </div>
              )}
            </div>

            {errors.department && (
              <p className="text-[11px] text-red-600 font-semibold">{errors.department}</p>
            )}
          </div>

          {/* 3. POSITION (MANDATORY MULTISELECT DROPDOWN WITH SEARCH ON TOP) */}
          <div id="box-position" className="space-y-1.5" ref={positionDropdownRef}>
            <div className="flex items-center justify-between">
              <label className="block font-bold text-slate-800 text-xs">
                Position <span className="text-red-500">*</span>
              </label>
              {selectedPositions.length > 0 && (
                <span className="text-[11px] text-[#211E4E] font-semibold">
                  {selectedPositions.length} selected
                </span>
              )}
            </div>

            {/* Position Dropdown Trigger */}
            <div className="relative">
              <div
                id="btn-position-multiselect"
                onClick={() => setIsPositionDropdownOpen(!isPositionDropdownOpen)}
                className={`w-full min-h-[42px] px-3.5 py-2 bg-slate-50 border rounded-xl text-xs font-bold cursor-pointer transition-all flex items-center justify-between gap-2 ${
                  isPositionDropdownOpen
                    ? 'border-[#C8A977] ring-2 ring-[#C8A977]/30 bg-white'
                    : errors.position
                    ? 'border-red-400 bg-red-50/20'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex flex-wrap gap-1.5 items-center flex-1 max-w-[90%]">
                  {selectedPositions.length === 0 ? (
                    <span className="text-slate-400 font-normal">Select positions...</span>
                  ) : (
                    selectedPositions.map((pos) => (
                      <span
                        key={pos}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#211E4E]/10 text-[#211E4E] text-[11px] font-bold"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTogglePosition(pos);
                        }}
                      >
                        <span className="truncate max-w-[130px]">{pos}</span>
                        <X className="w-3 h-3 hover:text-red-600 shrink-0" />
                      </span>
                    ))
                  )}
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${
                    isPositionDropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </div>

              {/* Position Multiselect Popover with Search on Top */}
              {isPositionDropdownOpen && (
                <div className="absolute z-30 left-0 top-12 w-full min-w-[280px] bg-white border border-slate-200 rounded-xl shadow-xl p-2.5 text-xs space-y-2 animate-in fade-in zoom-in-95 duration-100">
                  {/* Search on top */}
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={positionSearchQuery}
                      onChange={(e) => setPositionSearchQuery(e.target.value)}
                      placeholder="Search position..."
                      className="w-full pl-8 pr-7 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:outline-hidden focus:border-[#C8A977] focus:bg-white"
                      autoFocus
                    />
                    {positionSearchQuery && (
                      <button
                        type="button"
                        onClick={() => setPositionSearchQuery('')}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>

                  {selectedPositions.length > 0 && (
                    <div className="flex items-center justify-end px-1 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                      <button
                        type="button"
                        onClick={() => setSelectedPositions([])}
                        className="text-[#211E4E] hover:underline cursor-pointer"
                      >
                        Clear All
                      </button>
                    </div>
                  )}

                  {/* Position list */}
                  <div className="max-h-56 overflow-y-auto space-y-1 pr-1">
                    {filteredPositions.length === 0 ? (
                      <p className="text-slate-400 text-center py-3 text-[11px]">
                        No positions match "{positionSearchQuery}"
                      </p>
                    ) : (
                      filteredPositions.map((pos) => {
                        const isSelected = selectedPositions.includes(pos);
                        return (
                          <label
                            key={pos}
                            className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg cursor-pointer transition-colors ${
                              isSelected
                                ? 'bg-[#211E4E]/5 text-[#211E4E] font-bold'
                                : 'hover:bg-slate-50 text-slate-700 font-medium'
                            }`}
                          >
                            <div
                              className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                                isSelected
                                  ? 'bg-[#211E4E] border-[#211E4E] text-[#C8A977]'
                                  : 'border-slate-300 bg-white'
                              }`}
                            >
                              {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                            </div>
                            <span className="text-xs truncate">{pos}</span>
                          </label>
                        );
                      })
                    )}
                  </div>
                </div>
              )}
            </div>

            {errors.position && (
              <p className="text-[11px] text-red-600 font-semibold">{errors.position}</p>
            )}
          </div>

          {/* 4. FUNCTION */}
          <div id="box-functional" className="space-y-1.5">
            <label className="block font-bold text-slate-800 text-xs">
              Function <span className="text-red-500">*</span>
            </label>

            <input
              id="input-functional-name"
              type="text"
              value={functionalInput}
              onChange={(e) => {
                setFunctionalInput(e.target.value);
                if (errors.functional) setErrors((prev) => ({ ...prev, functional: '' }));
              }}
              placeholder="Enter function..."
              className="w-full min-h-[42px] px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-[#C8A977]/30 focus:border-[#C8A977]"
            />

            {errors.functional && (
              <p className="text-[11px] text-red-600 font-semibold">{errors.functional}</p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={resetForm}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2 bg-[#211E4E] hover:bg-[#2c2865] text-[#C8A977] border border-[#C8A977]/40 font-bold rounded-xl text-xs cursor-pointer transition-colors shadow-sm"
          >
            {editingRecordId ? 'Update' : 'Save'}
          </button>
        </div>
      </div>

      {/* Downside Table: Entity, Department, Position, Function, Action */}
      <div className="rounded-xl bg-white border border-slate-200 shadow-xs overflow-hidden">
        {/* Search & Filter Toolbar in row: Entity, Department, Position, Function */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2.5 flex-1">
            {/* Filter 1: Entity */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-slate-600 whitespace-nowrap">Entity:</span>
              <select
                value={tableEntityFilter}
                onChange={(e) => setTableEntityFilter(e.target.value as 'ALL' | FunctionalEntity)}
                className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-700 focus:outline-hidden focus:border-[#C8A977] cursor-pointer"
              >
                <option value="ALL">All Entities</option>
                <option value="GANS">GANS</option>
                <option value="Eshara">Eshara</option>
                <option value="YHA">YHA</option>
              </select>
            </div>

            {/* Filter 2: Department */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-slate-600 whitespace-nowrap">Department:</span>
              <select
                value={tableDeptFilter}
                onChange={(e) => setTableDeptFilter(e.target.value)}
                className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-700 focus:outline-hidden focus:border-[#C8A977] max-w-[180px] truncate cursor-pointer"
              >
                <option value="ALL">All Departments</option>
                {allKnownDepartments.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            {/* Filter 3: Position */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-slate-600 whitespace-nowrap">Position:</span>
              <select
                value={tablePositionFilter}
                onChange={(e) => setTablePositionFilter(e.target.value)}
                className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-700 focus:outline-hidden focus:border-[#C8A977] max-w-[200px] truncate cursor-pointer"
              >
                <option value="ALL">All Positions</option>
                {STANDARD_POSITIONS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Filter 4: Function Search */}
          <div className="relative w-full lg:w-72 shrink-0">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search function name..."
              className="w-full pl-9 pr-7 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-[#C8A977]/30 focus:border-[#C8A977]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Master Table: Entity First, Department Second, Position Third, Function Fourth */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-[#211E4E] text-[#C8A977] font-extrabold border-b border-[#C8A977]/30 uppercase text-[11px]">
              <tr>
                <th className="py-3 px-4 w-[12%]">Entity</th>
                <th className="py-3 px-4 w-[28%]">Department</th>
                <th className="py-3 px-4 w-[30%]">Position</th>
                <th className="py-3 px-4 w-[20%]">Function</th>
                <th className="py-3 px-4 w-[10%] text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    No records found
                  </td>
                </tr>
              ) : (
                filteredRecords.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* 1. Entity */}
                    <td className="py-3 px-4 font-bold text-slate-900 align-middle">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-[#211E4E] text-[#C8A977] border border-[#C8A977]/30 shadow-2xs">
                        {r.entity}
                      </span>
                    </td>

                    {/* 2. Department */}
                    <td className="py-3 px-4 align-middle">
                      <div className="flex flex-wrap gap-1.5 items-center">
                        {r.departments.map((dept) => (
                          <span
                            key={dept}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-[#211E4E]/5 text-[#211E4E] border border-[#211E4E]/15"
                          >
                            <Building2 className="w-3 h-3 text-[#211E4E] shrink-0" />
                            <span>{dept}</span>
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* 3. Position */}
                    <td className="py-3 px-4 align-middle">
                      <div className="flex flex-wrap gap-1.5 items-center">
                        {r.positions && r.positions.length > 0 ? (
                          r.positions.map((pos) => (
                            <span
                              key={pos}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#C8A977]/15 text-[#211E4E] border border-[#C8A977]/30"
                            >
                              <Briefcase className="w-3 h-3 text-[#C8A977] shrink-0" />
                              <span>{pos}</span>
                            </span>
                          ))
                        ) : (
                          <span className="text-slate-400 italic text-[11px]">—</span>
                        )}
                      </div>
                    </td>

                    {/* 4. Function */}
                    <td className="py-3 px-4 font-bold text-slate-900 align-middle">
                      <div className="flex items-center gap-2">
                        <Network className="w-4 h-4 text-[#211E4E] shrink-0" />
                        <span>{r.functional}</span>
                      </div>
                    </td>

                    {/* 5. Actions: Edit & Delete */}
                    <td className="py-3 px-4 text-center align-middle">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleEditRecord(r)}
                          className="p-1.5 text-slate-500 hover:text-[#211E4E] hover:bg-[#C8A977]/15 rounded-lg cursor-pointer transition-colors"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteConfirmRecord(r)}
                          className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmRecord && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4"
          onClick={() => setDeleteConfirmRecord(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-slate-200 space-y-4 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-1">
              <h3 className="font-bold text-slate-900 text-sm">Remove Record</h3>
              <p className="text-xs text-slate-600">
                Are you sure you want to remove <strong>{deleteConfirmRecord.functional}</strong>?
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmRecord(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
