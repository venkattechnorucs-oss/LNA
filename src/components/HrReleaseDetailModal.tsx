import React, { useState, useMemo } from 'react';
import {
  X,
  Search,
  Users,
  CheckCircle2,
  Clock,
  RotateCcw,
  AlertCircle,
  Check,
  AlertTriangle
} from 'lucide-react';
import {
  AssessmentReleaseRun,
  EmployeeProfile,
  SkippedEmployeeLna
} from '../types';
import { OrgAssessmentRecord } from '../data/orgAssessments';

interface HrReleaseDetailModalProps {
  releaseRun: AssessmentReleaseRun | null;
  isOpen: boolean;
  onClose: () => void;
  employees: EmployeeProfile[];
  orgRecords: OrgAssessmentRecord[];
  skippedEmployees: SkippedEmployeeLna[];
  onToggleSkipEmployee?: (
    employeeId: string,
    releaseId: string,
    skip: boolean,
    reason?: string,
    remarks?: string
  ) => void;
}

// Pre-defined fallback directory to ensure all release employee IDs have rich profile details
const KNOWN_EMPLOYEE_DIRECTORY: Record<string, Partial<EmployeeProfile>> = {
  EMP00123: { name: 'Ravi Kumar', position: 'Store Manager', department: 'Operations', division: 'Retail', reportingManager: 'Suresh Nair', location: 'Abu Dhabi HQ' },
  EMP00124: { name: 'Priya Sharma', position: 'Sales Manager', department: 'Sales', division: 'Retail', reportingManager: 'Anita Rao', location: 'Dubai Branch' },
  EMP00125: { name: 'Arun Kumar', position: 'Accountant', department: 'Accounts', division: 'Finance', reportingManager: 'Suresh Nair', location: 'Abu Dhabi HQ' },
  EMP00126: { name: 'Fatima Al Mansoori', position: 'Financial Analyst', department: 'Finance', division: 'Corporate', reportingManager: 'Suresh Nair', location: 'Abu Dhabi HQ' },
  EMP00127: { name: 'Ahmed Al Zaabi', position: 'HR Business Partner', department: 'HR', division: 'Human Capital', reportingManager: 'Mansoor Al Hammadi', location: 'Abu Dhabi HQ' },
  EMP00128: { name: 'Khalid Al Shamsi', position: 'IT Systems Specialist', department: 'IT', division: 'Technology', reportingManager: 'Farah Qureshi', location: 'Abu Dhabi HQ' },
  EMP00129: { name: 'Salem Al Nuaimi', position: 'Retail Operations Specialist', department: 'Operations', division: 'Retail', reportingManager: 'Suresh Nair', location: 'Abu Dhabi HQ' },
  EMP00130: { name: 'Reem Al Marzooqi', position: 'Corporate Sales Lead', department: 'Sales', division: 'Retail', reportingManager: 'Anita Rao', location: 'Dubai Branch' },
  EMP00131: { name: 'Saeed Al Dhaheri', position: 'Network Administrator', department: 'IT', division: 'Technology', reportingManager: 'Farah Qureshi', location: 'Abu Dhabi HQ' },
  EMP00132: { name: 'Mona Al Mazrouei', position: 'Treasury Officer', department: 'Accounts', division: 'Finance', reportingManager: 'Suresh Nair', location: 'Abu Dhabi HQ' },
  EMP00133: { name: 'Zainab Al Ali', position: 'Recruitment Specialist', department: 'HR', division: 'Talent Acquisition', reportingManager: 'Mansoor Al Hammadi', location: 'Abu Dhabi HQ' },
  EMP00134: { name: 'Omar Al Tenaiji', position: 'Database Administrator', department: 'IT', division: 'Technology', reportingManager: 'Farah Qureshi', location: 'Abu Dhabi HQ' },
  EMP00135: { name: 'Humaid Al Suwaidi', position: 'Logistics Supervisor', department: 'Operations', division: 'Retail', reportingManager: 'Suresh Nair', location: 'Abu Dhabi HQ' },
  EMP00136: { name: 'Noura Al Kaabi', position: 'Customer Relations Lead', department: 'Sales', division: 'Retail', reportingManager: 'Anita Rao', location: 'Dubai Branch' },
  '34233': { name: 'Vivekanandan', position: 'Specialist - Performance Management', department: 'HR & Administration', division: 'CEO Office', reportingManager: 'Mansoor Al Hammadi', location: 'GANS Head Office' },
  '08912': { name: 'Tariq Al Hashemi', position: 'Senior Air Traffic Controller', department: 'ATM Operations', division: 'Air Navigation Services', reportingManager: "David O'Connor", location: 'Sheikh Zayed Centre' },
  EMP00188: { name: 'Fatima Al Zaabi', position: 'HR Specialist', department: 'Talent Development', division: 'Human Resources', reportingManager: 'Mansoor Al Hammadi', location: 'GANS Head Office' },
  EMP00201: { name: 'Mohammed Al Mansoori', position: 'CNS Systems Engineer', department: 'Systems Engineering', division: 'Engineering & Technology', reportingManager: 'Khaled Al Marzooqi', location: 'Al Bateen Airport' },
  EMP00234: { name: 'Aisha Al Suwaidi', position: 'Quality Assurance Auditor', department: 'Quality Management', division: 'Safety & Quality', reportingManager: 'Hamad Al Nuaimi', location: 'Abu Dhabi HQ' },
  EMP00312: { name: 'John Smith', position: 'Procurement Specialist', department: 'Operations', division: 'Retail', reportingManager: 'Anita Rao', location: 'Abu Dhabi HQ' },
  EMP00345: { name: 'Mariam Al Hosani', position: 'Training Coordinator', department: 'Talent Development', division: 'Human Resources', reportingManager: 'Mansoor Al Hammadi', location: 'GANS Head Office' },
  EMP00418: { name: 'Sultan Al Dhaheri', position: 'Air Traffic Controller', department: 'ATM Operations', division: 'Air Navigation Services', reportingManager: "David O'Connor", location: 'Al Ain International' },
  EMP00450: { name: 'Layla Al Kaabi', position: 'Financial Analyst', department: 'Accounts', division: 'Finance', reportingManager: 'Suresh Nair', location: 'Abu Dhabi HQ' }
};

export const HrReleaseDetailModal: React.FC<HrReleaseDetailModalProps> = ({
  releaseRun,
  isOpen,
  onClose,
  employees,
  orgRecords,
  skippedEmployees,
  onToggleSkipEmployee
}) => {
  // Modal internal state
  const [searchQuery, setSearchQuery] = useState('');

  // Build employee list for this release
  const recipientEmployees = useMemo(() => {
    if (!releaseRun) return [];

    // Union of employeeIds and any employee IDs in outcomes
    const allEmpIds = Array.from(
      new Set([
        ...releaseRun.employeeIds,
        ...(releaseRun.outcomes ? releaseRun.outcomes.map((o) => o.employeeId) : [])
      ])
    );

    return allEmpIds.map((empId) => {
      // 1. Check in passed employees
      let profile = employees.find((e) => e.employeeId === empId);

      // 2. Check in orgRecords
      if (!profile) {
        const rec = orgRecords.find((r) => r.employee.employeeId === empId);
        if (rec) profile = rec.employee;
      }

      // 3. Check fallback directory
      if (!profile && KNOWN_EMPLOYEE_DIRECTORY[empId]) {
        const fallback = KNOWN_EMPLOYEE_DIRECTORY[empId];
        profile = {
          employeeId: empId,
          name: fallback.name || `Employee ${empId}`,
          position: fallback.position || 'Staff',
          department: fallback.department || 'Operations',
          division: fallback.division || 'Corporate',
          reportingManager: fallback.reportingManager !== undefined ? fallback.reportingManager : 'Suresh Nair',
          email: `${empId.toLowerCase()}@gans.aero`,
          grade: 7,
          location: fallback.location || 'Abu Dhabi HQ'
        };
      }

      // 4. Default placeholder / outcome override
      if (!profile) {
        const recordedOutcome = releaseRun.outcomes?.find((o) => o.employeeId === empId);
        profile = {
          employeeId: empId,
          name: recordedOutcome?.employeeName || `Employee ${empId}`,
          position: 'Staff Member',
          department: recordedOutcome?.department || 'Operations',
          division: 'General',
          reportingManager: 'Manager',
          email: `${empId.toLowerCase()}@gans.aero`,
          grade: 7,
          location: 'Abu Dhabi HQ'
        };
      } else if (profile.name.startsWith('Employee EMP')) {
        const recordedOutcome = releaseRun.outcomes?.find((o) => o.employeeId === empId);
        if (recordedOutcome?.employeeName) {
          profile = {
            ...profile,
            name: recordedOutcome.employeeName,
            department: recordedOutcome.department || profile.department
          };
        }
      }

      // Check LNA submission status in orgRecords
      const orgRec = orgRecords.find((r) => r.employee.employeeId === empId);
      let lnaStatus: 'Not Started' | 'Pending Approval' | 'Returned' | 'Approved' = 'Not Started';
      if (orgRec) {
        if (orgRec.status === 'MANAGER APPROVED') {
          lnaStatus = 'Approved';
        } else if (orgRec.status === 'SUBMITTED FOR MANAGER REVIEW') {
          lnaStatus = 'Pending Approval';
        } else if (orgRec.status === 'SENT BACK TO EMPLOYEE') {
          lnaStatus = 'Returned';
        } else if (orgRec.status === 'PENDING EMPLOYEE SUBMISSION') {
          lnaStatus = 'Not Started';
        }
      }

      // Check if in skippedEmployees
      const isSkipped = skippedEmployees.some(
        (s) => s.employeeId === empId && (s.releaseId === releaseRun.releaseId || s.releaseId === 'ALL')
      );

      return {
        profile,
        lnaStatus,
        isSkipped
      };
    });
  }, [releaseRun, employees, orgRecords, skippedEmployees]);

  // Filtered list based on search query
  const filteredList = useMemo(() => {
    return recipientEmployees.filter((item) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = item.profile.name.toLowerCase().includes(q);
        const matchMgr = (item.profile.reportingManager || '').toLowerCase().includes(q);
        const matchStatus = item.lnaStatus.toLowerCase().includes(q);
        if (!matchName && !matchMgr && !matchStatus) return false;
      }
      return true;
    });
  }, [recipientEmployees, searchQuery]);

  if (!isOpen || !releaseRun) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-5xl w-full max-h-[92vh] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] border border-slate-200/80 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* ================= 1. MODAL HEADER ================= */}
        <div className="p-5 bg-[#211E4E] text-[#C8A977] flex items-center justify-between gap-4 border-b border-[#C8A977]/20 shrink-0">
          <div>
            <h2 className="text-lg font-black tracking-tight text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-[#C8A977]" />
              <span>Release Distribution</span>
            </h2>
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300 mt-1">
              <span className="font-mono font-bold bg-white/10 px-2 py-0.5 rounded text-[#C8A977] border border-[#C8A977]/30">{releaseRun.releaseId}</span>
              <span>•</span>
              <span>Released: <strong className="text-white">{releaseRun.releaseDate}</strong></span>
              <span>•</span>
              <span>Deadline: <strong className="text-white">{releaseRun.deadlineDate || '-'}</strong></span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer shrink-0 border border-white/20"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ================= 2. SEARCH TOOLBAR ================= */}
        <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-3 shrink-0">
          <div className="relative w-full max-w-sm">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search employee, manager, or status..."
              className="w-full pl-8 pr-7 py-1.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:border-[#211E4E] focus:ring-1 focus:ring-[#C8A977]/40 transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* ================= 3. RELEASED EMPLOYEES TABLE ================= */}
        <div className="flex-1 overflow-y-auto overflow-x-auto min-h-[260px]">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="sticky top-0 z-10">
              <tr className="bg-[#fcfaf7] text-[#211E4E] border-b border-[#C8A977]/25 font-extrabold uppercase tracking-wider text-[11px] shadow-2xs">
                <th className="py-3 px-3 text-center w-14 border-r border-slate-200/80">S.No</th>
                <th className="py-3 px-4 border-r border-slate-200/80 text-left min-w-[200px]">Employee</th>
                <th className="py-3 px-4 border-r border-slate-200/80 text-center min-w-[160px]">Reporting Manager</th>
                <th className="py-3 px-4 border-r border-slate-200/80 text-center min-w-[150px]">Status</th>
                <th className="py-3 px-4 text-center min-w-[110px]">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredList.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-500 bg-white italic">
                    <Users className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="font-bold text-slate-700">No records found</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Try adjusting the search query.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredList.map((item, index) => {
                  const { profile, lnaStatus, isSkipped } = item;
                  const hasMissingManager = !profile.reportingManager || profile.reportingManager.trim() === '' || profile.reportingManager.toLowerCase() === 'unassigned';

                  return (
                    <tr
                      key={profile.employeeId}
                      className={`hover:bg-[#211E4E]/5 transition-colors ${
                        index % 2 === 0 ? 'bg-white' : 'bg-slate-50/40'
                      }`}
                    >
                      {/* S.No */}
                      <td className="py-3 px-3 text-center text-slate-400 font-bold border-r border-slate-100">
                        {index + 1}
                      </td>

                      {/* Employee Name Only */}
                      <td className="py-3 px-4 border-r border-slate-100 font-bold text-slate-900">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full font-black text-[10px] flex items-center justify-center shrink-0 border bg-[#211E4E]/10 text-[#211E4E] border-[#C8A977]/30">
                            {profile.name
                              .split(' ')
                              .map((n) => n[0])
                              .slice(0, 2)
                              .join('')}
                          </div>
                          <span className="text-slate-900 font-bold text-xs">{profile.name}</span>
                        </div>
                      </td>

                      {/* Reporting Manager */}
                      <td className="py-3 px-4 text-center text-slate-700 font-medium border-r border-slate-100">
                        {hasMissingManager ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                            <AlertTriangle className="w-3 h-3 text-amber-700" />
                            <span>Unassigned / Missing</span>
                          </span>
                        ) : (
                          <span className="text-xs font-semibold text-slate-800">{profile.reportingManager}</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4 text-center border-r border-slate-100">
                        {lnaStatus === 'Approved' ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-full font-bold text-[11px] shadow-2xs">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Approved</span>
                          </span>
                        ) : lnaStatus === 'Pending Approval' ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-800 border border-amber-300 rounded-full font-bold text-[11px] shadow-2xs">
                            <Clock className="w-3.5 h-3.5 text-amber-600" />
                            <span>Pending Approval</span>
                          </span>
                        ) : lnaStatus === 'Returned' ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-50 text-rose-800 border border-rose-300 rounded-full font-bold text-[11px] shadow-2xs">
                            <RotateCcw className="w-3.5 h-3.5 text-rose-600" />
                            <span>Returned</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-700 border border-slate-300 rounded-full font-bold text-[11px] shadow-2xs">
                            <AlertCircle className="w-3.5 h-3.5 text-slate-500" />
                            <span>Not Started</span>
                          </span>
                        )}
                      </td>

                      {/* Action: Skip option enabled except in Approved status */}
                      <td className="py-3 px-4 text-center">
                        {lnaStatus === 'Approved' ? (
                          <button
                            type="button"
                            disabled
                            className="px-3 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200"
                            title="Approved records cannot be skipped"
                          >
                            Skip
                          </button>
                        ) : isSkipped ? (
                          <button
                            type="button"
                            onClick={() => onToggleSkipEmployee?.(profile.employeeId, releaseRun.releaseId, false)}
                            className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white transition-all cursor-pointer shadow-2xs"
                            title="Click to unskip / restore"
                          >
                            <Check className="w-3 h-3 stroke-[3]" />
                            <span>Skipped</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() =>
                              onToggleSkipEmployee?.(
                                profile.employeeId,
                                releaseRun.releaseId,
                                true,
                                'Exempted by HR',
                                'Skipped from Release Distribution'
                              )
                            }
                            className="px-3.5 py-1 rounded-lg text-xs font-bold bg-[#211E4E] text-[#C8A977] hover:bg-[#2c2865] border border-[#C8A977]/40 transition-all cursor-pointer shadow-2xs active:scale-95"
                            title="Skip this employee"
                          >
                            Skip
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
    </div>
  );
};
