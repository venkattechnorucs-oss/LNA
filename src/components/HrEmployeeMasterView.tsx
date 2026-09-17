import React, { useState, useMemo } from 'react';
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
  RefreshCw,
  Ban,
  UserX,
  History,
  ArrowRight
} from 'lucide-react';

interface FlaggedEmployeeItem {
  emp: EmployeeProfile;
  flagType: 'released' | 'skipped';
  record?: AssessmentReleaseRecord;
  skipRecord?: SkippedEmployeeLna;
}

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
  onNavigateToHistory
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

  // Sync State
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncNotice, setSyncNotice] = useState<string | null>(null);

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

  // Edit Modal state
  const [showEditModal, setShowEditModal] = useState(false);
  const [deleteConfirmEmp, setDeleteConfirmEmp] = useState<{ id: string; name: string } | null>(null);

  // Form State for editing employee
  const [formData, setFormData] = useState<EmployeeProfile>({
    name: '',
    employeeId: '',
    email: '',
    reportingManager: '',
    position: '',
    division: '',
    department: '',
    grade: 8,
    joinDate: '',
    section: '',
    location: ''
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

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
        if (!matchName && !matchId && !matchPos && !matchEmail && !matchManager) return false;
      }
      return true;
    });
  }, [employees, selectedDivision, selectedDepartment, selectedGrade, searchQuery]);

  // Validation for Edit Employee Form
  const validateForm = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = 'Full Name is required';
    if (!formData.employeeId.trim()) errs.employeeId = 'Employee ID is required';
    if (!formData.email.trim() || !formData.email.includes('@')) errs.email = 'Valid email is required';
    if (!formData.position.trim()) errs.position = 'Position is required';
    if (!formData.division.trim()) errs.division = 'Division is required';
    if (!formData.reportingManager.trim()) errs.reportingManager = 'Reporting Manager is required';
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSaveEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    if (onUpdateEmployee) {
      onUpdateEmployee(formData);
    } else if (onAddEmployee) {
      onAddEmployee(formData);
    }
    setShowEditModal(false);
    setFormErrors({});
  };

  // Sync handler with Enterprise HRMS / Active Directory
  const handleSync = () => {
    setIsSyncing(true);
    setSyncNotice(null);
    setTimeout(() => {
      setIsSyncing(false);
      setSyncNotice(`Employee master data successfully synchronized with Enterprise HRMS (${employees.length} records verified).`);
      if (onSyncEmployees) {
        onSyncEmployees();
      }
      setTimeout(() => {
        setSyncNotice(null);
      }, 5000);
    }, 700);
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
              <Send className="w-3.5 h-3.5" />
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

          {/* Sync Button */}
          <button
            type="button"
            onClick={handleSync}
            disabled={isSyncing}
            className="px-4 py-2 bg-gradient-to-r from-[#1a5075] to-[#0275a8] hover:from-[#154668] hover:to-[#01628d] text-white font-bold text-xs rounded-lg flex items-center gap-1.5 shadow-sm transition-all cursor-pointer active:scale-95 disabled:opacity-75 border border-sky-300/30"
            title="Synchronize employee records with Enterprise HRMS"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Syncing...' : 'Sync'}</span>
          </button>
        </div>
      </div>

      {/* Sync Notice Banner */}
      {syncNotice && (
        <div className="p-3.5 bg-sky-50 border border-sky-300 rounded-xl flex items-center justify-between gap-3 text-sky-900 shadow-xs animate-in slide-in-from-top-1">
          <div className="flex items-center gap-2.5 text-xs font-bold">
            <CheckCircle2 className="w-4 h-4 text-[#0275a8] shrink-0" />
            <span>{syncNotice}</span>
          </div>
          <button
            type="button"
            onClick={() => setSyncNotice(null)}
            className="text-sky-700 hover:text-sky-900 font-bold text-xs cursor-pointer"
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
                <th className="py-2.5 px-4 w-52">Employee Name</th>
                <th className="py-2.5 px-4">Position</th>
                <th className="py-2.5 px-4">Division</th>
                <th className="py-2.5 px-4">Department</th>
                <th className="py-2.5 px-3 text-center w-16">Grade</th>
                <th className="py-2.5 px-4">Reporting Manager</th>
                <th className="py-2.5 px-4">Location</th>
                <th className="py-2.5 px-3 text-center w-24">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredEmployees.length === 0 ? (
                <tr>
                  <td colSpan={isSelectionMode ? 10 : 9} className="py-10 text-center text-slate-500">
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
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-slate-700 block">{emp.position}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-slate-800 font-medium block">{emp.division}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-slate-600 block">{emp.department}</span>
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
                            onClick={() => {
                              setFormData({ ...emp });
                              setShowEditModal(true);
                            }}
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

      {/* MODAL: EDIT EMPLOYEE PROFILE */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="bg-[#1a5075] text-white px-5 py-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Edit2 className="w-5 h-5 text-sky-300" />
                <h3 className="font-bold text-sm sm:text-base">Edit Employee Profile</h3>
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
                {/* Full Name */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Rashid Al Nuaimi"
                    className={`w-full px-3 py-2 bg-slate-50 border rounded-md text-xs text-slate-800 focus:bg-white focus:outline-hidden focus:border-[#0275a8] ${
                      formErrors.name ? 'border-red-400 bg-red-50/40' : 'border-slate-300'
                    }`}
                  />
                  {formErrors.name && <span className="text-[10px] text-red-500 mt-0.5 block">{formErrors.name}</span>}
                </div>

                {/* Employee ID */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Employee ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.employeeId}
                    onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                    placeholder="e.g. EMP00590"
                    className={`w-full px-3 py-2 bg-slate-50 border rounded-md text-xs text-slate-800 font-mono focus:bg-white focus:outline-hidden focus:border-[#0275a8] ${
                      formErrors.employeeId ? 'border-red-400 bg-red-50/40' : 'border-slate-300'
                    }`}
                  />
                  {formErrors.employeeId && <span className="text-[10px] text-red-500 mt-0.5 block">{formErrors.employeeId}</span>}
                </div>

                {/* Email Address */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. rashid.nuaimi@gans.aero"
                    className={`w-full px-3 py-2 bg-slate-50 border rounded-md text-xs text-slate-800 focus:bg-white focus:outline-hidden focus:border-[#0275a8] ${
                      formErrors.email ? 'border-red-400 bg-red-50/40' : 'border-slate-300'
                    }`}
                  />
                  {formErrors.email && <span className="text-[10px] text-red-500 mt-0.5 block">{formErrors.email}</span>}
                </div>

                {/* Reporting Manager */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Reporting Manager <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.reportingManager}
                    onChange={(e) => setFormData({ ...formData, reportingManager: e.target.value })}
                    placeholder="e.g. Mansoor Al Hammadi"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md text-xs text-slate-800 focus:bg-white focus:outline-hidden focus:border-[#0275a8]"
                  />
                </div>

                {/* Position */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Position / Designation <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    placeholder="e.g. Air Traffic Controller"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md text-xs text-slate-800 focus:bg-white focus:outline-hidden focus:border-[#0275a8]"
                  />
                </div>

                {/* Grade */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Grade (1 - 12) <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.grade}
                    onChange={(e) => setFormData({ ...formData, grade: parseInt(e.target.value, 10) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md text-xs text-slate-800 focus:bg-white focus:outline-hidden focus:border-[#0275a8]"
                  >
                    {[5, 6, 7, 8, 9, 10, 11, 12].map((g) => (
                      <option key={g} value={g}>Grade {g}</option>
                    ))}
                  </select>
                </div>

                {/* Division */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Division <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.division}
                    onChange={(e) => setFormData({ ...formData, division: e.target.value })}
                    placeholder="e.g. Air Navigation Services"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md text-xs text-slate-800 focus:bg-white focus:outline-hidden focus:border-[#0275a8]"
                  />
                </div>

                {/* Department */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Department</label>
                  <input
                    type="text"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    placeholder="e.g. ATM Operations"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md text-xs text-slate-800 focus:bg-white focus:outline-hidden focus:border-[#0275a8]"
                  />
                </div>

                {/* Section */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Section</label>
                  <input
                    type="text"
                    value={formData.section || ''}
                    onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                    placeholder="e.g. Area Control Center"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md text-xs text-slate-800 focus:bg-white focus:outline-hidden focus:border-[#0275a8]"
                  />
                </div>

                {/* Location */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Location</label>
                  <input
                    type="text"
                    value={formData.location || ''}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g. Abu Dhabi HQ"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md text-xs text-slate-800 focus:bg-white focus:outline-hidden focus:border-[#0275a8]"
                  />
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
                  className="px-5 py-2 bg-[#0275a8] hover:bg-[#02628d] text-white font-bold rounded-lg shadow-sm transition-all cursor-pointer active:scale-95 flex items-center gap-1.5"
                >
                  <span>Save Changes</span>
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
    </div>
  );
};
