import React, { useState, useMemo } from 'react';
import { EmployeeProfile, AssessmentReleaseRecord, SkippedEmployeeLna } from '../types';
import { OrgAssessmentRecord } from '../data/orgAssessments';
import {
  Send,
  Calendar,
  Users,
  CheckCircle2,
  Clock,
  Search,
  Download,
  CheckSquare,
  Square,
  AlertCircle,
  AlertTriangle,
  Bell,
  Check,
  X,
  Ban,
  History,
  ArrowRight
} from 'lucide-react';

interface FlaggedEmployeeItem {
  emp: EmployeeProfile;
  flagType: 'released' | 'skipped';
  record?: AssessmentReleaseRecord;
  skipRecord?: SkippedEmployeeLna;
}

interface HrReleaseAssessmentViewProps {
  employees: EmployeeProfile[];
  orgRecords: OrgAssessmentRecord[];
  onReleaseAssessments: (
    cycleType: 'LNA' | 'PDP',
    releaseType: 'Release All' | 'Release Selected',
    deadline: string,
    targetEmployeeIds: string[],
    note?: string
  ) => void;
  releasedList: AssessmentReleaseRecord[];
  skippedEmployees?: SkippedEmployeeLna[];
  onSendReminder?: (employeeId: string) => void;
  onRevokeRelease?: (employeeId: string) => void;
  onNavigateToHistory?: () => void;
}

export const HrReleaseAssessmentView: React.FC<HrReleaseAssessmentViewProps> = ({
  employees,
  onReleaseAssessments,
  releasedList,
  skippedEmployees = [],
  onSendReminder,
  onNavigateToHistory
}) => {
  // Form Configuration States
  const [declarationType, setDeclarationType] = useState<'LNA' | 'PDP'>('LNA');
  const [releaseType, setReleaseType] = useState<'Release All' | 'Release Selected'>('Release All');
  const [deadlineDate, setDeadlineDate] = useState<string>(() => {
    // Default deadline: 30 days from today
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d.toISOString().split('T')[0];
  });
  const [notificationNote, setNotificationNote] = useState<string>('');

  // Selected Employee IDs for 'Release Selected' mode
  const [selectedEmpIds, setSelectedEmpIds] = useState<string[]>([]);

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDeptFilter, setSelectedDeptFilter] = useState<string>('ALL');

  // Success Feedback Modal State
  const [showSuccessModal, setShowSuccessModal] = useState<{
    count: number;
    cycleType: string;
    deadline: string;
  } | null>(null);

  const [reminderToast, setReminderToast] = useState<string | null>(null);

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

  // Pre-release warning confirmation modal state
  const [alreadyReleasedPrompt, setAlreadyReleasedPrompt] = useState<{
    targetIds: string[];
    flaggedList: FlaggedEmployeeItem[];
    pendingIds: string[];
  } | null>(null);

  const [modalFilterTab, setModalFilterTab] = useState<'all' | 'released' | 'skipped'>('all');

  // Set of released employee IDs for quick lookup
  const releasedEmpIdSet = useMemo(() => {
    return new Set(releasedList.map((r) => r.employeeId));
  }, [releasedList]);

  // Unique departments for filtering
  const departments = useMemo(() => {
    const deptSet = new Set<string>();
    employees.forEach((e) => {
      if (e.department) deptSet.add(e.department);
    });
    return Array.from(deptSet).sort();
  }, [employees]);

  // Filtered Employee List
  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      if (selectedDeptFilter !== 'ALL' && emp.department !== selectedDeptFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = emp.name.toLowerCase().includes(q);
        const matchId = emp.employeeId.toLowerCase().includes(q);
        const matchDept = emp.department.toLowerCase().includes(q);
        const matchPos = emp.position.toLowerCase().includes(q);
        const matchLoc = (emp.location || '').toLowerCase().includes(q);
        if (!matchName && !matchId && !matchDept && !matchPos && !matchLoc) return false;
      }
      return true;
    });
  }, [employees, selectedDeptFilter, searchQuery]);

  // Toggle selection for a single employee
  const handleToggleSelectEmployee = (empId: string) => {
    setSelectedEmpIds((prev) =>
      prev.includes(empId) ? prev.filter((id) => id !== empId) : [...prev, empId]
    );
  };

  // Toggle Select All
  const handleSelectAllVisible = () => {
    const visibleIds = filteredEmployees.map((e) => e.employeeId);
    const allSelected = visibleIds.every((id) => selectedEmpIds.includes(id));
    if (allSelected) {
      setSelectedEmpIds((prev) => prev.filter((id) => !visibleIds.includes(id)));
    } else {
      setSelectedEmpIds((prev) => Array.from(new Set([...prev, ...visibleIds])));
    }
  };

  // Execute Final Release
  const executeFinalRelease = (targetIds: string[]) => {
    if (targetIds.length === 0) return;
    setAlreadyReleasedPrompt(null);

    onReleaseAssessments(
      declarationType,
      releaseType,
      deadlineDate,
      targetIds,
      notificationNote
    );

    setShowSuccessModal({
      count: targetIds.length,
      cycleType: declarationType,
      deadline: deadlineDate
    });

    setSelectedEmpIds([]);
  };

  // Handle Form Submission / Release Action
  const handleRelease = () => {
    if (!deadlineDate) {
      alert('Please select a valid deadline date.');
      return;
    }

    let targetIds: string[] = [];
    if (releaseType === 'Release All') {
      targetIds = employees.map((e) => e.employeeId);
    } else {
      if (selectedEmpIds.length === 0) {
        alert('Please select at least one employee from the list to release the assessment to.');
        return;
      }
      targetIds = selectedEmpIds;
    }

    // Check if any target employees have already received release or were marked as skipped
    const flaggedList: FlaggedEmployeeItem[] = [];
    targetIds.forEach((id) => {
      const emp = employees.find((e) => e.employeeId === id) || ({ employeeId: id, name: id, department: '', position: '' } as EmployeeProfile);
      if (releasedEmpIdSet.has(id)) {
        flaggedList.push({
          emp,
          flagType: 'released',
          record: releasedList.find((r) => r.employeeId === id)
        });
      } else if (declarationType === 'LNA' && skippedMap.has(id)) {
        flaggedList.push({
          emp,
          flagType: 'skipped',
          skipRecord: skippedMap.get(id)
        });
      }
    });

    if (flaggedList.length > 0) {
      const pendingIds = targetIds.filter(
        (id) => !releasedEmpIdSet.has(id) && !(declarationType === 'LNA' && skippedMap.has(id))
      );
      setAlreadyReleasedPrompt({
        targetIds,
        flaggedList,
        pendingIds
      });
      setModalFilterTab('all');
      return;
    }

    executeFinalRelease(targetIds);
  };

  // Export List as CSV
  const handleExportCSV = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'Employee ID,Employee Name,Department,Position,Location,Assessment Status\n';
    filteredEmployees.forEach((emp) => {
      const isRel = releasedEmpIdSet.has(emp.employeeId) ? 'Released' : 'Pending Release';
      csvContent += `"${emp.employeeId}","${emp.name}","${emp.department}","${emp.position}","${emp.location || 'Abu Dhabi HQ'}","${isRel}"\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `gans_release_employee_list_${new Date().toISOString().split('T')[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSendSingleReminder = (empId: string, name: string) => {
    onSendReminder?.(empId);
    setReminderToast(`Notification reminder successfully dispatched to ${name}.`);
    setTimeout(() => setReminderToast(null), 3500);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12">
      
      {/* Toast Notification Banner */}
      {reminderToast && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#1a5075]/95 backdrop-blur-xl text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-sky-400/30 animate-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-semibold">{reminderToast}</span>
        </div>
      )}

      {/* ================= 1. HEADER ================= */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1a5075] via-[#104060] to-[#0d2f47] p-5 sm:p-6 text-white shadow-[0_12px_36px_-6px_rgba(26,80,117,0.35)] border border-white/20 backdrop-blur-xl">
        <div className="absolute -right-8 -top-8 w-56 h-56 bg-sky-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 -bottom-10 w-48 h-48 bg-teal-400/15 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex items-center justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2.5 drop-shadow-xs">
              <Send className="w-6 h-6 text-sky-300" />
              <span>Release Assessment</span>
            </h1>
          </div>
        </div>
      </div>

      {/* ================= 2. RELEASE CONFIGURATION FORM CARD ================= */}
      <div className="rounded-2xl bg-white/85 backdrop-blur-xl border border-white/80 shadow-[0_8px_30px_rgb(26,80,117,0.05)] overflow-hidden">
        <div className="p-5 sm:p-6 space-y-6">
          
          {/* Row 1: Assessment Type & Release Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            
            {/* Assessment Type (LNA / PDP) */}
            <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-200 shadow-2xs">
              <label className="block text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-2.5">
                Assessment Type <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-6">
                <label className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer select-none">
                  <input
                    type="radio"
                    name="declarationType"
                    value="LNA"
                    checked={declarationType === 'LNA'}
                    onChange={() => setDeclarationType('LNA')}
                    className="w-4 h-4 text-[#0275a8] focus:ring-[#0275a8] cursor-pointer"
                  />
                  <span>LNA</span>
                </label>
                <label className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer select-none">
                  <input
                    type="radio"
                    name="declarationType"
                    value="PDP"
                    checked={declarationType === 'PDP'}
                    onChange={() => setDeclarationType('PDP')}
                    className="w-4 h-4 text-[#0275a8] focus:ring-[#0275a8] cursor-pointer"
                  />
                  <span>PDP</span>
                </label>
              </div>
            </div>

            {/* Release Type */}
            <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-200 shadow-2xs">
              <label className="block text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-2.5">
                Release Type <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-6">
                <label className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer select-none">
                  <input
                    type="radio"
                    name="releaseType"
                    value="Release All"
                    checked={releaseType === 'Release All'}
                    onChange={() => setReleaseType('Release All')}
                    className="w-4 h-4 text-[#0275a8] focus:ring-[#0275a8] cursor-pointer"
                  />
                  <span>Release All</span>
                </label>
                <label className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer select-none">
                  <input
                    type="radio"
                    name="releaseType"
                    value="Release Selected"
                    checked={releaseType === 'Release Selected'}
                    onChange={() => {
                      setReleaseType('Release Selected');
                    }}
                    className="w-4 h-4 text-[#0275a8] focus:ring-[#0275a8] cursor-pointer"
                  />
                  <span>Release Selected</span>
                </label>
              </div>
            </div>

          </div>

          {/* Row 2: Deadline / On or Before & Remarks */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            
            {/* On or Before Date Picker */}
            <div>
              <label className="block text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-1.5">
                On or Before <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Calendar className="w-4 h-4 text-[#0275a8]" />
                </div>
                <input
                  type="date"
                  value={deadlineDate}
                  onChange={(e) => setDeadlineDate(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-xs font-bold bg-white border border-slate-200 rounded-xl text-slate-800 shadow-inner focus:ring-2 focus:ring-[#0275a8]/20 focus:border-[#0275a8] transition-all cursor-pointer"
                />
              </div>
            </div>

            {/* Remarks Input */}
            <div>
              <label className="block text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-1.5">
                Remarks
              </label>
              <input
                type="text"
                value={notificationNote}
                onChange={(e) => setNotificationNote(e.target.value)}
                placeholder="Enter remarks..."
                className="w-full px-3.5 py-2.5 text-xs font-normal bg-white border border-slate-200 rounded-xl text-slate-800 shadow-inner focus:ring-2 focus:ring-[#0275a8]/20 focus:border-[#0275a8] transition-all placeholder:text-slate-400"
              />
            </div>

          </div>

          {/* Row 3: Release Action Button */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleRelease}
              className="w-full sm:w-auto min-w-[200px] px-8 py-3 bg-gradient-to-r from-[#1a5075] to-[#0275a8] hover:from-[#154261] hover:to-[#01628d] text-white font-extrabold text-xs rounded-xl shadow-md shadow-sky-950/15 transition-all flex items-center justify-center cursor-pointer active:scale-95"
            >
              <span>Release</span>
            </button>
            {releaseType === 'Release Selected' && selectedEmpIds.length === 0 && (
              <p className="text-xs text-amber-600 font-semibold mt-2 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Please select one or more employees in the table below to enable release.</span>
              </p>
            )}
          </div>

        </div>
      </div>

      {/* ================= 3. EMPLOYEE LIST TABLE ================= */}
      <div className="rounded-2xl bg-white/85 backdrop-blur-xl border border-white/80 shadow-[0_8px_30px_rgb(26,80,117,0.05)] overflow-hidden">
        
        {/* Table Top Controls Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200/80 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/60">
          
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-[#0275a8]" />
            <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
              Employee List
            </h3>
          </div>

          {/* Search, Filters & Export Buttons */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {/* Search Box */}
            <div className="relative min-w-[220px]">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search employees..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl shadow-inner focus:ring-2 focus:ring-[#0275a8]/20 focus:border-[#0275a8] transition-all"
              />
            </div>

            {/* Department Filter */}
            <select
              value={selectedDeptFilter}
              onChange={(e) => setSelectedDeptFilter(e.target.value)}
              className="text-xs font-bold bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-slate-700 focus:ring-2 focus:ring-[#0275a8]/20 cursor-pointer shadow-2xs"
            >
              <option value="ALL">All Departments</option>
              {departments.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>

            {/* Export Button */}
            <button
              type="button"
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition-all shadow-2xs cursor-pointer active:scale-95"
            >
              <Download className="w-3.5 h-3.5 text-[#0275a8]" />
              <span>Export</span>
            </button>
          </div>

        </div>

        {/* Selection summary bar when in 'Release Selected' mode */}
        {releaseType === 'Release Selected' && (
          <div className="bg-sky-50/90 px-5 py-2.5 border-b border-sky-200/80 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-[#0275a8]">
                {selectedEmpIds.length} of {filteredEmployees.length} employees selected
              </span>
              <span className="text-slate-400">|</span>
              <button
                type="button"
                onClick={handleSelectAllVisible}
                className="text-[#004e8c] font-bold hover:underline cursor-pointer"
              >
                {filteredEmployees.every((e) => selectedEmpIds.includes(e.employeeId))
                  ? 'Deselect All'
                  : 'Select All Visible'}
              </button>
            </div>
            {selectedEmpIds.length > 0 && (
              <button
                type="button"
                onClick={() => setSelectedEmpIds([])}
                className="text-slate-500 hover:text-slate-800 font-bold cursor-pointer"
              >
                Clear Selection
              </button>
            )}
          </div>
        )}

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#f0f7fb]/90 backdrop-blur-xs text-[#1a5075] border-b border-[#c8d8e5] font-extrabold uppercase tracking-wider text-[11px]">
                {releaseType === 'Release Selected' && (
                  <th className="p-3 w-10 text-center">
                    <button
                      type="button"
                      onClick={handleSelectAllVisible}
                      className="cursor-pointer text-[#1a5075] hover:text-[#0275a8]"
                    >
                      {filteredEmployees.length > 0 &&
                      filteredEmployees.every((e) => selectedEmpIds.includes(e.employeeId)) ? (
                        <CheckSquare className="w-4 h-4 text-[#0275a8]" />
                      ) : (
                        <Square className="w-4 h-4" />
                      )}
                    </button>
                  </th>
                )}
                <th className="py-3.5 px-4 border-r border-slate-200/80">Employee ID</th>
                <th className="py-3.5 px-4 border-r border-slate-200/80">Employee Name</th>
                <th className="py-3.5 px-4 border-r border-slate-200/80">Department</th>
                <th className="py-3.5 px-4 border-r border-slate-200/80">Location</th>
                <th className="py-3.5 px-4 border-r border-slate-200/80">Position</th>
                <th className="py-3.5 px-4 border-r border-slate-200/80">Assessment Status</th>
                <th className="py-3.5 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredEmployees.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-500 bg-white/50 italic">
                    No employees match the search and filter criteria.
                  </td>
                </tr>
              ) : (
                filteredEmployees.map((emp, index) => {
                  const isSelected = selectedEmpIds.includes(emp.employeeId);
                  const isReleased = releasedEmpIdSet.has(emp.employeeId);

                  return (
                    <tr
                      key={emp.employeeId}
                      onClick={() => {
                        if (releaseType === 'Release Selected') {
                          handleToggleSelectEmployee(emp.employeeId);
                        }
                      }}
                      className={`hover:bg-sky-50/50 transition-colors ${
                        index % 2 === 0 ? 'bg-white/70' : 'bg-[#f8fbfe]/60'
                      } ${isSelected ? '!bg-sky-100/70' : ''} ${
                        releaseType === 'Release Selected' ? 'cursor-pointer' : ''
                      }`}
                    >
                      {releaseType === 'Release Selected' && (
                        <td className="p-3 text-center" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleToggleSelectEmployee(emp.employeeId)}
                            className="w-4 h-4 text-[#0275a8] rounded border-slate-300 focus:ring-[#0275a8] cursor-pointer"
                          />
                        </td>
                      )}
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-800 border-r border-slate-100">
                        {emp.employeeId}
                      </td>
                      <td className="py-3.5 px-4 border-r border-slate-100">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-[#1a5075]/10 text-[#1a5075] font-extrabold text-[10px] flex items-center justify-center shrink-0 border border-[#1a5075]/20">
                            {emp.name
                              .split(' ')
                              .map((n) => n[0])
                              .slice(0, 2)
                              .join('')}
                          </div>
                          <span className="font-extrabold text-slate-900">{emp.name}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-700 font-semibold border-r border-slate-100">
                        {emp.department}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 font-medium border-r border-slate-100">
                        {emp.location || 'Abu Dhabi HQ'}
                      </td>
                      <td className="py-3.5 px-4 text-slate-700 font-medium border-r border-slate-100">
                        {emp.position}
                      </td>
                      <td className="py-3.5 px-4 border-r border-slate-100">
                        {isReleased ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full font-extrabold text-[10px]">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Released</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 text-slate-600 border border-slate-200 rounded-full font-bold text-[10px]">
                            <Clock className="w-3 h-3 text-slate-400" />
                            <span>Pending Release</span>
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                        {!isReleased ? (
                          <button
                            type="button"
                            onClick={() => {
                              onReleaseAssessments(
                                declarationType,
                                'Release Selected',
                                deadlineDate,
                                [emp.employeeId],
                                notificationNote
                              );
                              setShowSuccessModal({
                                count: 1,
                                cycleType: declarationType,
                                deadline: deadlineDate
                              });
                            }}
                            className="px-3.5 py-1.5 bg-gradient-to-r from-[#1a5075] to-[#0275a8] hover:from-[#154261] hover:to-[#01628d] text-white rounded-xl text-[11px] font-extrabold shadow-xs transition-all cursor-pointer active:scale-95"
                          >
                            Release
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleSendSingleReminder(emp.employeeId, emp.name)}
                            title="Send Reminder"
                            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 rounded-xl text-[11px] font-bold transition-all cursor-pointer inline-flex items-center gap-1 shadow-2xs"
                          >
                            <Bell className="w-3 h-3 text-[#0275a8]" />
                            <span>Remind</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

      </div>

      {/* ================= ALREADY RELEASED / SKIPPED CONFIRMATION PROMPT MODAL ================= */}
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
                    <h3 className="font-bold text-sm sm:text-base text-white">
                      {declarationType} Release Status Notice
                    </h3>
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
                    <span className="text-lg font-bold text-slate-800">{alreadyReleasedPrompt.targetIds.length}</span>
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

              {/* Modal Footer Actions - strictly two buttons: Cancel and Release */}
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
                  onClick={() => executeFinalRelease(alreadyReleasedPrompt.targetIds)}
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

      {/* ================= SUCCESS CONFIRMATION MODAL ================= */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white/95 backdrop-blur-2xl rounded-3xl max-w-md w-full p-6 shadow-[0_20px_50px_rgba(0,0,0,0.25)] border border-white/80 text-center space-y-4 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-emerald-600/30 border border-white/40">
              <Check className="w-8 h-8 stroke-[3]" />
            </div>
            
            <div className="space-y-1.5">
              <h3 className="text-lg font-black text-slate-900">
                {showSuccessModal.cycleType} Released Successfully
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                {showSuccessModal.cycleType} has been released. You can check the details in employee history for this run.
              </p>
            </div>

            <div className="bg-slate-50/80 p-3.5 rounded-2xl border border-slate-200 text-left text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Recipients:</span>
                <span className="font-bold text-slate-800">{showSuccessModal.count} Employee(s)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Submission Deadline:</span>
                <span className="font-bold text-emerald-700">{showSuccessModal.deadline}</span>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-2.5">
              {onNavigateToHistory && (
                <button
                  type="button"
                  onClick={() => {
                    setShowSuccessModal(null);
                    onNavigateToHistory();
                  }}
                  className="flex-1 py-2.5 bg-gradient-to-r from-[#1a5075] to-[#0275a8] hover:from-[#154261] hover:to-[#01628d] text-white font-extrabold text-xs rounded-xl shadow-md transition-all cursor-pointer active:scale-95"
                >
                  View in History
                </button>
              )}
              <button
                type="button"
                onClick={() => setShowSuccessModal(null)}
                className={`py-2.5 px-5 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-extrabold text-xs rounded-xl shadow-2xs transition-all cursor-pointer active:scale-95 ${
                  onNavigateToHistory ? '' : 'w-full bg-gradient-to-r from-[#1a5075] to-[#0275a8] text-white'
                }`}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
