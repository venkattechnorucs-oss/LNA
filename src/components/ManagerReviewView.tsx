import React, { useState, useMemo } from 'react';
import {
  UserCheck,
  GraduationCap,
  CheckCircle2,
  RotateCcw,
  AlertTriangle,
  BookOpen,
  Calendar,
  Clock,
  ShieldCheck,
  Check,
  Search,
  ArrowLeft,
  Users,
  Eye,
  Filter,
  CheckSquare,
  MessageSquare,
  X
} from 'lucide-react';
import {
  EmployeeProfile,
  LNAAssessmentSubmission,
  ProficiencyLevel,
  LNAWorkflowStatus,
  LNAChatMessage,
  ManagerDelegation
} from '../types';
import { OrgAssessmentRecord } from '../data/orgAssessments';
import { createDefaultPreloadedSubmission } from '../data/lnaData';
import { LnaChatbox } from './LnaChatbox';

interface ManagerReviewViewProps {
  submission: LNAAssessmentSubmission | null;
  employee: EmployeeProfile;
  orgRecords: OrgAssessmentRecord[];
  delegations?: ManagerDelegation[];
  onApproveEmployee: (employeeId: string, managerRemarks: string, competencyRemarks?: Record<string, string>) => void;
  onResendEmployee: (employeeId: string, managerRemarks: string, competencyRemarks?: Record<string, string>) => void;
  selectedEmployeeId: string | null;
  onSelectEmployee: (employeeId: string | null) => void;
  onSendMessage?: (employeeId: string, text: string, role?: 'employee' | 'manager') => void;
  currentTab: string;
  onSelectTab: (tab: string) => void;
  activeRole?: 'employee' | 'manager' | 'hr';
}

export const ManagerReviewView: React.FC<ManagerReviewViewProps> = ({
  submission,
  employee,
  orgRecords,
  delegations,
  onApproveEmployee,
  onResendEmployee,
  selectedEmployeeId,
  onSelectEmployee,
  onSendMessage,
  currentTab: _currentTab,
  onSelectTab,
  activeRole = 'manager'
}) => {
  // Search & Filter state for Approvals table
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | LNAWorkflowStatus | 'DELEGATION'>('ALL');

  // Currently inspected employee record
  const activeRecord = useMemo(() => {
    if (!selectedEmployeeId) return null;
    const found = orgRecords.find((r) => r.employee.employeeId === selectedEmployeeId);
    if (found) return found;
    // Fallback to active employee
    if (employee.employeeId === selectedEmployeeId) {
      return {
        employee,
        submission: submission || createDefaultPreloadedSubmission(employee),
        status: submission?.status || 'SUBMITTED FOR MANAGER REVIEW'
      };
    }
    return null;
  }, [selectedEmployeeId, orgRecords, employee, submission]);

  // Determine effective submission with guaranteed 3 items for manager review
  const effectiveSubmission: LNAAssessmentSubmission | null = useMemo(() => {
    if (!activeRecord) return null;
    if (
      activeRecord.submission &&
      activeRecord.submission.selectedItems &&
      activeRecord.submission.selectedItems.length === 3
    ) {
      return activeRecord.submission;
    }
    return createDefaultPreloadedSubmission(activeRecord.employee);
  }, [activeRecord]);

  const [managerRemarks, setManagerRemarks] = useState<string>(
    effectiveSubmission?.managerComments || ''
  );
  
  // Per-competency remarks state dictionary [competencyId -> remarks string]
  const [competencyRemarksMap, setCompetencyRemarksMap] = useState<Record<string, string>>({});

  const [errorMessage, setErrorMessage] = useState<string>('');
  const [showConfirmModal, setShowConfirmModal] = useState<'approve' | 'resend' | null>(null);
  const [showApprovalSuccessPopup, setShowApprovalSuccessPopup] = useState<boolean>(false);

  // Auto-dismiss manager approval success modal after 2.5 seconds and return to list
  React.useEffect(() => {
    if (showApprovalSuccessPopup) {
      const timer = setTimeout(() => {
        setShowApprovalSuccessPopup(false);
        onSelectEmployee(null);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [showApprovalSuccessPopup, onSelectEmployee]);

  // Sync manager comments & competency remarks when active record changes
  React.useEffect(() => {
    if (effectiveSubmission?.managerComments !== undefined) {
      setManagerRemarks(effectiveSubmission.managerComments);
    } else {
      setManagerRemarks('');
    }

    if (effectiveSubmission?.selectedItems) {
      const initialMap: Record<string, string> = {};
      effectiveSubmission.selectedItems.forEach((item) => {
        if (item.managerRemarks) {
          initialMap[item.competency.id] = item.managerRemarks;
        }
      });
      setCompetencyRemarksMap(initialMap);
    } else {
      setCompetencyRemarksMap({});
    }

    setErrorMessage('');
  }, [effectiveSubmission?.managerComments, effectiveSubmission?.selectedItems, selectedEmployeeId]);

  // Handle per-competency remarks change
  const handleCompetencyRemarkChange = (competencyId: string, text: string) => {
    setCompetencyRemarksMap((prev) => ({
      ...prev,
      [competencyId]: text
    }));
  };

  // Chat message helper - always retains both employee comments and manager comments
  const chatMessages: LNAChatMessage[] = useMemo(() => {
    if (!effectiveSubmission) return [];
    
    // Start with all existing thread messages
    const msgs: LNAChatMessage[] = effectiveSubmission.messages && effectiveSubmission.messages.length > 0
      ? [...effectiveSubmission.messages]
      : [];

    // Ensure employee initial comments are included if not already present in the thread
    const hasEmployeeMsg = msgs.some((m) => m.sender === 'employee' || m.id === 'msg-initial-employee');
    if (!hasEmployeeMsg && effectiveSubmission.comments && effectiveSubmission.comments.trim()) {
      msgs.unshift({
        id: 'msg-initial-employee',
        sender: 'employee',
        senderName: effectiveSubmission.employee.name,
        text: effectiveSubmission.comments.trim(),
        timestamp: effectiveSubmission.submissionDate || '19/Aug/2026'
      });
    }

    // Ensure manager comments are included if not already present in the thread
    const hasManagerMsg = msgs.some((m) => m.sender === 'manager' || m.id === 'msg-initial-manager');
    if (!hasManagerMsg && effectiveSubmission.managerComments && effectiveSubmission.managerComments.trim()) {
      msgs.push({
        id: 'msg-initial-manager',
        sender: 'manager',
        senderName: effectiveSubmission.employee.reportingManager || 'Manager',
        text: effectiveSubmission.managerComments.trim(),
        timestamp: effectiveSubmission.managerActionDate || '20/Aug/2026'
      });
    }

    return msgs;
  }, [effectiveSubmission]);

  // Statistics calculation for the Approvals roster
  const stats = useMemo(() => {
    const total = orgRecords.length;
    const submitted = orgRecords.filter(
      (r) => r.status === 'SUBMITTED FOR MANAGER REVIEW' || (r.employee.employeeId === employee.employeeId && submission?.status === 'SUBMITTED FOR MANAGER REVIEW')
    ).length;
    const resent = orgRecords.filter(
      (r) => r.status === 'SENT BACK TO EMPLOYEE' || (r.employee.employeeId === employee.employeeId && submission?.status === 'SENT BACK TO EMPLOYEE')
    ).length;
    const approved = orgRecords.filter(
      (r) => r.status === 'MANAGER APPROVED' || (r.employee.employeeId === employee.employeeId && submission?.status === 'MANAGER APPROVED')
    ).length;

    return { total, submitted, resent, approved };
  }, [orgRecords, employee.employeeId, submission]);

  // Check if a record is under manager delegation
  const isRecordDelegated = (record: OrgAssessmentRecord) => {
    if (record.isDelegated) return true;
    if (record.delegatedFrom) return true;
    if (
      delegations &&
      delegations.some(
        (d) =>
          d.status === 'Active' &&
          (d.fromName.toLowerCase() === (record.employee.reportingManager || '').toLowerCase() ||
           d.fromEmployeeId === record.employee.employeeId)
      )
    ) {
      return true;
    }
    return false;
  };

  // Filtered employees list (only show submitted, resent, or approved for manager review)
  const filteredRecords = useMemo(() => {
    return orgRecords.filter((record) => {
      // Determine effective status
      const currentStatus =
        record.employee.employeeId === employee.employeeId && submission
          ? submission.status
          : record.status;

      // Exclude pending/draft unless submitted, sent back, or approved
      if (
        currentStatus !== 'SUBMITTED FOR MANAGER REVIEW' &&
        currentStatus !== 'SENT BACK TO EMPLOYEE' &&
        currentStatus !== 'MANAGER APPROVED'
      ) {
        return false;
      }

      if (statusFilter === 'DELEGATION') {
        if (!isRecordDelegated(record)) {
          return false;
        }
      } else if (statusFilter !== 'ALL' && currentStatus !== statusFilter) {
        return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = record.employee.name.toLowerCase().includes(q);
        const matchId = record.employee.employeeId.toLowerCase().includes(q);
        const matchPos = record.employee.position.toLowerCase().includes(q);
        const matchDept = record.employee.department.toLowerCase().includes(q);
        const matchDiv = record.employee.division.toLowerCase().includes(q);
        return matchName || matchId || matchPos || matchDept || matchDiv;
      }

      return true;
    });
  }, [orgRecords, employee.employeeId, submission, statusFilter, searchQuery, delegations]);

  const getProficiencyBadgeStyle = (level: ProficiencyLevel) => {
    switch (level) {
      case 'Expert':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'Proficient':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'Intermediate':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Foundation':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-300';
    }
  };

  const getStatusBadge = (status: LNAWorkflowStatus) => {
    switch (status) {
      case 'MANAGER APPROVED':
        return (
          <span className="bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold px-2 py-0.5 rounded text-[11px] inline-flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-700" />
            APPROVED
          </span>
        );
      case 'SENT BACK TO EMPLOYEE':
        return (
          <span className="bg-amber-100 text-amber-900 border border-amber-300 font-bold px-2 py-0.5 rounded text-[11px] inline-flex items-center gap-1">
            <RotateCcw className="w-3 h-3 text-amber-700" />
            RETURNED
          </span>
        );
      case 'SUBMITTED FOR MANAGER REVIEW':
        return (
          <span className="bg-sky-100 text-[#0275a8] border border-sky-300 font-bold px-2 py-0.5 rounded text-[11px] inline-flex items-center gap-1">
            <Clock className="w-3 h-3 text-[#0275a8]" />
            PENDING APPROVAL
          </span>
        );
      default:
        return (
          <span className="bg-slate-100 text-slate-700 border border-slate-300 font-medium px-2 py-0.5 rounded text-[11px] inline-flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
            PENDING SUBMISSION
          </span>
        );
    }
  };

  // Helper to determine combined comments/feedback
  const getCombinedRemarks = () => {
    if (managerRemarks && managerRemarks.trim()) return managerRemarks.trim();
    
    // Check per-competency remarks from table
    const compRemarks = Object.entries(competencyRemarksMap)
      .filter(([_, txt]) => typeof txt === 'string' && txt.trim().length > 0)
      .map(([id, txt]) => {
        const textStr = String(txt).trim();
        const item = effectiveSubmission?.selectedItems.find((i) => i.competency.id === id);
        return item ? `${item.competency.name}: ${textStr}` : textStr;
      });
    if (compRemarks.length > 0) {
      return compRemarks.join(' | ');
    }

    // Check chat messages from manager
    const managerChat = [...chatMessages].reverse().find((m) => m.sender === 'manager' && m.text && m.text.trim());
    if (managerChat && managerChat.text.trim()) {
      return managerChat.text.trim();
    }

    // Check any chat message
    const anyChat = [...chatMessages].reverse().find((m) => m.text && m.text.trim());
    if (anyChat && anyChat.text.trim()) {
      return anyChat.text.trim();
    }

    return '';
  };

  const handleActionClick = (action: 'approve' | 'resend') => {
    setErrorMessage('');
    if (!activeRecord) return;
    const combinedRemarks = getCombinedRemarks();

    if (!combinedRemarks || !combinedRemarks.trim()) {
      setErrorMessage('Please enter Comments before taking action.');
      const commentInput = document.getElementById('lna-comment-input');
      if (commentInput) {
        commentInput.focus();
        commentInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setShowConfirmModal(action);
  };

  const handleConfirmAction = () => {
    if (!activeRecord) return;
    const empId = activeRecord.employee.employeeId;
    const combinedRemarks = getCombinedRemarks();

    if (showConfirmModal === 'approve') {
      onApproveEmployee(empId, combinedRemarks, competencyRemarksMap);
      setShowApprovalSuccessPopup(true);
    } else if (showConfirmModal === 'resend') {
      onResendEmployee(empId, combinedRemarks, competencyRemarksMap);
      onSelectEmployee(null);
    }
    setShowConfirmModal(null);
  };

  // ==========================================
  // VIEW 1: APPROVALS LIST / EMPLOYEES ROSTER
  // ==========================================
  if (!selectedEmployeeId || !activeRecord || !effectiveSubmission) {
    return (
      <div className="space-y-6">
        {/* Top Header Card */}
        <div className="rounded-2xl bg-white/85 backdrop-blur-xl border border-white/80 p-5 sm:p-6 shadow-[0_8px_30px_rgb(26,80,117,0.05)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-[#1a5075] tracking-tight">
              Learning Needs Analysis (LNA) – Approvals
            </h1>
          </div>
        </div>

        {/* Metric Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          {/* Pending Approval */}
          <div
            onClick={() => setStatusFilter(statusFilter === 'SUBMITTED FOR MANAGER REVIEW' ? 'ALL' : 'SUBMITTED FOR MANAGER REVIEW')}
            className={`p-5 rounded-2xl border transition-all cursor-pointer shadow-sm relative overflow-hidden backdrop-blur-xl ${
              statusFilter === 'SUBMITTED FOR MANAGER REVIEW'
                ? 'bg-gradient-to-br from-sky-500/15 to-sky-600/10 border-sky-400 ring-2 ring-sky-500/20'
                : 'bg-white/85 border-white/80 hover:border-sky-300 hover:shadow-md'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-slate-600 font-bold uppercase text-[11px] tracking-wider">Pending Approval</span>
              <div className="w-8 h-8 rounded-xl bg-sky-100 text-[#0275a8] flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-[#0275a8] mt-2">
              {stats.submitted}
            </div>
          </div>

          {/* Resent / Returned */}
          <div
            onClick={() => setStatusFilter(statusFilter === 'SENT BACK TO EMPLOYEE' ? 'ALL' : 'SENT BACK TO EMPLOYEE')}
            className={`p-5 rounded-2xl border transition-all cursor-pointer shadow-sm relative overflow-hidden backdrop-blur-xl ${
              statusFilter === 'SENT BACK TO EMPLOYEE'
                ? 'bg-gradient-to-br from-amber-500/15 to-amber-600/10 border-amber-400 ring-2 ring-amber-500/20'
                : 'bg-white/85 border-white/80 hover:border-amber-300 hover:shadow-md'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-slate-600 font-bold uppercase text-[11px] tracking-wider">Returned</span>
              <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                <RotateCcw className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-amber-700 mt-2">
              {stats.resent}
            </div>
          </div>

          {/* Approved */}
          <div
            onClick={() => setStatusFilter(statusFilter === 'MANAGER APPROVED' ? 'ALL' : 'MANAGER APPROVED')}
            className={`p-5 rounded-2xl border transition-all cursor-pointer shadow-sm relative overflow-hidden backdrop-blur-xl ${
              statusFilter === 'MANAGER APPROVED'
                ? 'bg-gradient-to-br from-emerald-500/15 to-emerald-600/10 border-emerald-400 ring-2 ring-emerald-500/20'
                : 'bg-white/85 border-white/80 hover:border-emerald-300 hover:shadow-md'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-slate-600 font-bold uppercase text-[11px] tracking-wider">Approved</span>
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-emerald-700 mt-2">
              {stats.approved}
            </div>
          </div>
        </div>

        {/* Filter / Search Bar */}
        <div className="rounded-2xl bg-white/85 backdrop-blur-xl border border-white/80 p-4 shadow-[0_8px_30px_rgb(26,80,117,0.05)] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          {/* Search Box */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search team members by name, position..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50/80 text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:border-[#0275a8] focus:bg-white focus:ring-2 focus:ring-[#0275a8]/20 text-xs transition-all shadow-inner"
            />
          </div>

          {/* Quick Filter Chips */}
          <div className="flex flex-wrap items-center gap-1.5 self-start sm:self-auto">
            <span className="text-slate-500 font-bold mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-slate-400" /> Filter:
            </span>
            {(['ALL', 'SUBMITTED FOR MANAGER REVIEW', 'SENT BACK TO EMPLOYEE', 'MANAGER APPROVED', 'DELEGATION'] as const).map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-full font-bold text-[11px] transition-all cursor-pointer ${
                  statusFilter === st
                    ? 'bg-[#1a5075] text-white shadow-xs'
                    : 'bg-white/90 text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {st === 'ALL'
                  ? 'All Submissions'
                  : st === 'SUBMITTED FOR MANAGER REVIEW'
                  ? 'Pending'
                  : st === 'SENT BACK TO EMPLOYEE'
                  ? 'Returned'
                  : st === 'MANAGER APPROVED'
                  ? 'Approved'
                  : 'Delegation'}
              </button>
            ))}
          </div>
        </div>

        {/* Team Members Roster Table */}
        <div className="rounded-2xl bg-white/85 backdrop-blur-xl border border-white/80 shadow-[0_8px_30px_rgb(26,80,117,0.05)] overflow-hidden">
          <div className="bg-gradient-to-r from-[#1a5075] via-[#154668] to-[#0275a8] text-white px-5 py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-white/15 text-white flex items-center justify-center border border-white/20">
                <Users className="w-4 h-4 text-sky-200" />
              </div>
              <h2 className="font-bold text-xs sm:text-sm tracking-wide">
                Employee LNA Submissions
              </h2>
            </div>
          </div>

          <div className="p-4 sm:p-5">
            <div className="border border-slate-200/80 rounded-xl overflow-hidden bg-white/70 shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#f0f7fb]/90 backdrop-blur-xs text-[#1a5075] border-b border-[#c8d8e5] font-extrabold uppercase tracking-wider text-[11px]">
                      <th className="py-3 px-3 border-r border-slate-200/80 text-center w-10">#</th>
                      <th className="py-3 px-4 border-r border-slate-200/80">Employee Name</th>
                      <th className="py-3 px-4 border-r border-slate-200/80">Position</th>
                      <th className="py-3 px-4 border-r border-slate-200/80">Department</th>
                      <th className="py-3 px-3 border-r border-slate-200/80 text-center">Grade</th>
                      <th className="py-3 px-3 border-r border-slate-200/80 font-semibold whitespace-nowrap">Date</th>
                      <th className="py-3 px-4 border-r border-slate-200/80 text-center">Status</th>
                      <th className="py-3 px-4 text-center w-36">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredRecords.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-8 text-center text-slate-400 italic bg-white/50">
                          No employees match your search or filter criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredRecords.map((record, index) => {
                        const currentStatus =
                          record.employee.employeeId === employee.employeeId && submission
                            ? submission.status
                            : record.status;
                        const sub = record.submission;

                        return (
                          <tr
                            key={record.employee.employeeId}
                            className={`hover:bg-sky-50/50 transition-colors ${
                              index % 2 === 0 ? 'bg-white/70' : 'bg-[#f8fbfe]/60'
                            }`}
                          >
                            {/* Index */}
                            <td className="py-3.5 px-3 border-r border-slate-100 text-center font-bold text-slate-500">
                              <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 inline-flex items-center justify-center text-xs font-bold">
                                {index + 1}
                              </span>
                            </td>

                            {/* Employee Details */}
                            <td className="py-3.5 px-4 border-r border-slate-100">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="font-extrabold text-[#1a5075] text-xs">
                                  {record.employee.name}
                                </span>
                                {isRecordDelegated(record) && (
                                  <span
                                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800 border border-purple-200 shadow-2xs"
                                    title={record.delegatedFrom ? `Delegated from ${record.delegatedFrom}` : 'Delegation'}
                                  >
                                    <UserCheck className="w-2.5 h-2.5 text-purple-600" />
                                    <span>Delegation</span>
                                  </span>
                                )}
                              </div>
                            </td>

                            {/* Position */}
                            <td className="py-3.5 px-4 border-r border-slate-100 text-slate-800 font-medium">
                              {record.employee.position}
                            </td>

                            {/* Department */}
                            <td className="py-3.5 px-4 border-r border-slate-100 text-slate-700">
                              <div className="font-semibold">{record.employee.department}</div>
                            </td>

                            {/* Grade */}
                            <td className="py-3.5 px-3 border-r border-slate-100 text-center">
                              <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md font-bold text-[11px]">
                                {record.employee.grade}
                              </span>
                            </td>

                            {/* Date */}
                            <td className="py-3.5 px-3 border-r border-slate-100 text-slate-700 font-medium whitespace-nowrap">
                              {sub?.submissionDate || '15 Jan 2026'}
                            </td>

                            {/* Status */}
                            <td className="py-3.5 px-4 border-r border-slate-100 text-center">
                              {getStatusBadge(currentStatus)}
                            </td>

                            {/* Action */}
                            <td className="py-3.5 px-4 text-center">
                              <button
                                type="button"
                                onClick={() => {
                                  onSelectEmployee(record.employee.employeeId);
                                  window.scrollTo({ top: 0, behavior: 'smooth' });
                                }}
                                className={`px-3.5 py-2 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 w-full cursor-pointer transition-all shadow-xs ${
                                  currentStatus === 'SUBMITTED FOR MANAGER REVIEW'
                                    ? 'bg-gradient-to-r from-[#1a5075] to-[#0275a8] hover:from-[#154261] hover:to-[#01628d] text-white shadow-sky-900/10'
                                    : currentStatus === 'MANAGER APPROVED'
                                    ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200'
                                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                                }`}
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>
                                  {currentStatus === 'SUBMITTED FOR MANAGER REVIEW'
                                    ? 'Review LNA'
                                    : 'View Details'}
                                </span>
                              </button>
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
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW 2: SINGLE EMPLOYEE LNA REVIEW SCREEN
  // ==========================================
  const isAlreadyApproved = activeRecord.status === 'MANAGER APPROVED';
  const isSentBack = activeRecord.status === 'SENT BACK TO EMPLOYEE';

  return (
    <div className="space-y-6">
      {/* Top Navigation & Status Bar */}
      <div className="rounded-2xl bg-white/85 backdrop-blur-xl border border-white/80 p-4 shadow-[0_8px_30px_rgb(26,80,117,0.05)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => {
            onSelectEmployee(null);
            if (activeRole === 'hr') {
              onSelectTab('hr-dashboard');
            }
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100/90 hover:bg-slate-200/90 text-[#1a5075] border border-slate-200 rounded-xl font-bold text-xs cursor-pointer transition-all self-start shadow-2xs"
        >
          <ArrowLeft className="w-4 h-4 text-[#0275a8]" />
          <span>{activeRole === 'hr' ? 'Back to HR Dashboard' : 'Back to Approvals List'}</span>
        </button>

        {/* Status Indicators in top bar */}
        <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-auto text-xs">
          <div className="bg-sky-50/80 border border-sky-200/80 px-3.5 py-1.5 rounded-xl flex items-center gap-2 shadow-2xs">
            <span className="text-slate-600 font-bold">Status:</span>
            {getStatusBadge(activeRecord.status)}
          </div>
        </div>
      </div>

      {/* Header Banner for Manager Review */}
      <div className="rounded-2xl bg-white/85 backdrop-blur-xl border border-white/80 p-5 sm:p-6 shadow-[0_8px_30px_rgb(26,80,117,0.05)] flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#1a5075] tracking-tight">
            Learning Needs Analysis (LNA) – Review
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <>
        {/* Status Message Alerts */}
        {isAlreadyApproved && (
          <div className="bg-emerald-50/90 backdrop-blur-xl border border-emerald-300 p-5 rounded-2xl text-xs text-emerald-950 flex items-start gap-3.5 shadow-sm">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-700" />
            </div>
            <div>
              <h4 className="font-extrabold text-emerald-950 text-sm">LNA Approved</h4>
              <p className="mt-0.5 text-emerald-800">
                This submission has been <strong>APPROVED</strong> and forwarded to <strong>HR Department</strong>.
              </p>
              {effectiveSubmission.managerComments && (
                <div className="mt-2.5 p-3 bg-white/90 border border-emerald-200 rounded-xl text-slate-800 shadow-2xs">
                  <strong className="text-emerald-900 block mb-0.5 font-bold">Manager Approval Remarks:</strong> {effectiveSubmission.managerComments}
                </div>
              )}
            </div>
          </div>
        )}

        {isSentBack && (
          <div className="bg-amber-50/90 backdrop-blur-xl border border-amber-300 p-5 rounded-2xl text-xs text-amber-950 flex items-start gap-3.5 shadow-sm">
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
              <RotateCcw className="w-5 h-5 text-amber-700" />
            </div>
            <div>
              <h4 className="font-extrabold text-amber-950 text-sm">LNA Returned to Employee</h4>
              <p className="mt-0.5 text-amber-800">
                Status is now <strong>SENT BACK TO EMPLOYEE</strong>. The employee can now modify their competency and skill selections in the Employee View and resubmit.
              </p>
              {effectiveSubmission.managerComments && (
                <div className="mt-2.5 p-3 bg-white/90 border border-amber-200 rounded-xl text-slate-800 shadow-2xs">
                  <strong className="text-amber-900 block mb-0.5 font-bold">Manager Requested Adjustments:</strong> {effectiveSubmission.managerComments}
                </div>
              )}
            </div>
          </div>
        )}

        {/* SECTION 1: EMPLOYEE INFORMATION */}
        <section className="rounded-2xl bg-white/85 backdrop-blur-xl border border-white/80 shadow-[0_8px_30px_rgb(26,80,117,0.05)] overflow-hidden">
          <div className="bg-gradient-to-r from-[#1a5075] via-[#154668] to-[#0275a8] text-white px-5 py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5 font-bold text-xs sm:text-sm tracking-wide">
              <div className="w-7 h-7 rounded-lg bg-white/15 text-white flex items-center justify-center border border-white/20">
                <UserCheck className="w-4 h-4 text-sky-200" />
              </div>
              <span>Employee Information</span>
            </div>
            <span className="text-[11px] text-sky-100 font-medium bg-white/10 px-2.5 py-0.5 rounded-full border border-white/20">
              Submitted: {effectiveSubmission.submissionDate}
            </span>
          </div>

          <div className="p-4 sm:p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-slate-200/80 border border-slate-200/90 rounded-xl overflow-hidden text-xs shadow-2xs">
              
              {/* Row 1: Name & ID */}
              <div className="bg-[#f2f7fa]/90 p-3 font-extrabold text-slate-700 flex items-center justify-between">
                <span>Employee Name</span>
              </div>
              <div className="bg-white/95 p-3 text-xs font-semibold text-slate-800 flex items-center">
                <span>{effectiveSubmission.employee.name}</span>
              </div>

              <div className="bg-[#f2f7fa]/90 p-3 font-extrabold text-slate-700 flex items-center justify-between">
                <span>Employee ID</span>
              </div>
              <div className="bg-white/95 p-3 text-xs font-semibold text-slate-800 flex items-center">
                <span>{effectiveSubmission.employee.employeeId}</span>
              </div>

              {/* Row 2: Position & Grade */}
              <div className="bg-[#f2f7fa]/90 p-3 font-extrabold text-slate-700 flex items-center">
                <span>Position / Designation</span>
              </div>
              <div className="bg-white/95 p-3 text-xs font-semibold text-slate-800 flex items-center">
                <span>{effectiveSubmission.employee.position}</span>
              </div>

              <div className="bg-[#f2f7fa]/90 p-3 font-extrabold text-slate-700 flex items-center">
                <span>Grade</span>
              </div>
              <div className="bg-white/95 p-3 text-xs font-semibold text-slate-800 flex items-center">
                <span>Grade {effectiveSubmission.employee.grade}</span>
              </div>

              {/* Row 3: Division & Department/Project */}
              <div className="bg-[#f2f7fa]/90 p-3 font-extrabold text-slate-700 flex items-center">
                <span>Division</span>
              </div>
              <div className="bg-white/95 p-3 text-xs font-semibold text-slate-800 flex items-center">
                <span>{effectiveSubmission.employee.division}</span>
              </div>

              <div className="bg-[#f2f7fa]/90 p-3 font-extrabold text-slate-700 flex items-center">
                <span>Department/Project</span>
              </div>
              <div className="bg-white/95 p-3 text-xs font-semibold text-slate-800 flex items-center">
                <span>{effectiveSubmission.employee.department}</span>
              </div>

              {/* Row 4: Function & Manager */}
              <div className="bg-[#f2f7fa]/90 p-3 font-extrabold text-slate-700 flex items-center">
                <span>Function</span>
              </div>
              <div className="bg-white/95 p-3 text-xs font-semibold text-slate-800 flex items-center">
                <span>{effectiveSubmission.employee.function || effectiveSubmission.employee.department}</span>
              </div>

              <div className="bg-[#f2f7fa]/90 p-3 font-extrabold text-slate-700 flex items-center">
                <span>Manager</span>
              </div>
              <div className="bg-white/95 p-3 text-xs font-semibold text-slate-800 flex items-center">
                <span>{effectiveSubmission.employee.reportingManager}</span>
              </div>

              {/* Row 5: Date of Joining & Year */}
              <div className="bg-[#f2f7fa]/90 p-3 font-extrabold text-slate-700 flex items-center">
                <span>Date of Joining</span>
              </div>
              <div className="bg-white/95 p-3 text-xs font-semibold text-slate-800 flex items-center">
                <span>{effectiveSubmission.employee.joinDate || '12/May/2021'}</span>
              </div>

              <div className="bg-[#f2f7fa]/90 p-3 font-extrabold text-slate-700 flex items-center">
                <span>Year</span>
              </div>
              <div className="bg-white/95 p-3 text-xs font-semibold text-slate-800 flex items-center">
                <span>
                  {effectiveSubmission.employee.reviewPeriod || effectiveSubmission.cycleYear || '2026'}
                </span>
              </div>

            </div>
          </div>
        </section>

        {/* SECTION 2: SUBMITTED COMPETENCIES & SKILLS */}
        <section className="rounded-2xl bg-white/85 backdrop-blur-xl border border-white/80 shadow-[0_8px_30px_rgb(26,80,117,0.05)] overflow-hidden">
          <div className="bg-gradient-to-r from-[#1a5075] via-[#154668] to-[#0275a8] text-white px-5 py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-white/15 text-white flex items-center justify-center border border-white/20">
                <GraduationCap className="w-4 h-4 text-sky-200" />
              </div>
              <h2 className="font-bold text-xs sm:text-sm tracking-wide">
                Submitted Competencies &amp; Skills Selection
              </h2>
            </div>
          </div>

          <div className="p-4 sm:p-5">
            <div className="border border-slate-200/80 rounded-xl overflow-hidden bg-white/70 shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#f0f7fb]/90 backdrop-blur-xs text-[#1a5075] border-b border-[#c8d8e5] font-extrabold uppercase tracking-wider text-[11px]">
                      <th className="py-3 px-3 border-r border-slate-200/80 text-center w-10">#</th>
                      <th className="py-3 px-3 border-r border-slate-200/80 w-24 text-center">Type</th>
                      <th className="py-3 px-4 border-r border-slate-200/80 w-1/5 text-center">Competency Name</th>
                      <th className="py-3 px-4 border-r border-slate-200/80 w-1/5 text-center">Selected Skill</th>
                      <th className="py-3 px-3 border-r border-slate-200/80 text-center w-28">Ideal Proficiency</th>
                      <th className="py-3 px-4 border-r border-slate-200/80 w-1/4 text-center">Mapped Course</th>
                      <th className="py-3 px-4 w-1/4 text-center">Course Alternative</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {effectiveSubmission.selectedItems.map((item, index) => (
                      <tr
                        key={item.competency.id}
                        className={`transition-colors ${
                          index % 2 === 0 ? 'bg-white/70' : 'bg-[#f8fbfe]/60'
                        } hover:bg-sky-50/50`}
                      >
                        {/* # */}
                        <td className="py-3.5 px-3 border-r border-slate-100 text-center font-bold text-slate-500">
                          <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 inline-flex items-center justify-center text-xs font-bold">
                            {index + 1}
                          </span>
                        </td>

                        {/* Competency Type */}
                        <td className="py-3.5 px-3 border-r border-slate-100 text-center">
                          <span
                            className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                              item.competency.category === 'Functional'
                                ? 'bg-sky-100 text-[#0275a8] border border-sky-200'
                                : 'bg-indigo-100 text-indigo-700 border border-indigo-200'
                            }`}
                          >
                            {item.competency.category}
                          </span>
                        </td>

                        {/* Competency Name */}
                        <td className="py-3.5 px-4 border-r border-slate-100">
                          <span className="font-extrabold text-[#1a5075] text-xs">
                            {item.competency.name}
                          </span>
                        </td>

                        {/* Selected Skill */}
                        <td className="py-3.5 px-4 border-r border-slate-100">
                          <div className="p-2.5 bg-slate-50/90 rounded-xl border border-slate-200 shadow-2xs">
                            <div className="font-bold text-slate-900 text-xs">
                              {item.skill.name}
                            </div>
                          </div>
                        </td>

                        {/* Ideal Proficiency */}
                        <td className="py-3.5 px-3 border-r border-slate-100 text-center align-middle">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-black border shadow-xs ${getProficiencyBadgeStyle(
                              item.idealProficiency
                            )}`}
                          >
                            {item.idealProficiency}
                          </span>
                        </td>

                        {/* System-Generated Training Course */}
                        <td className="py-3.5 px-4 border-r border-slate-100 align-middle">
                          <div className="bg-gradient-to-br from-[#f0f7fb] to-[#e6f1f8] p-3 rounded-xl border border-[#cfe1ed] shadow-2xs">
                            <span className="font-extrabold text-[#1a5075] text-xs leading-snug flex items-center gap-2">
                              <div className="w-6 h-6 rounded-md bg-[#0275a8]/15 flex items-center justify-center shrink-0">
                                <BookOpen className="w-3.5 h-3.5 text-[#0275a8]" />
                              </div>
                              {item.trainingCourse.title}
                            </span>
                          </div>
                        </td>

                        {/* Course Alternative per Competency */}
                        <td className="py-3.5 px-4 align-middle bg-white/40">
                          {item.employeeRemarks && item.employeeRemarks.trim() ? (
                            <div className="p-2.5 bg-sky-50/80 border border-sky-200/80 rounded-xl text-xs text-slate-800 font-normal leading-relaxed shadow-2xs">
                              <span className="whitespace-pre-wrap">{item.employeeRemarks}</span>
                            </div>
                          ) : (
                            <span className="text-slate-400 text-xs italic">No course alternative provided</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION: UNIFIED DISCUSSION & COLLABORATION CHATBOX */}
        <section className="space-y-2">
          <LnaChatbox
            messages={chatMessages}
            onSendMessage={(text, role) => {
              if (onSendMessage) {
                onSendMessage(activeRecord.employee.employeeId, text, role);
              }
            }}
            currentUserRole="manager"
            currentUserName={activeRecord.employee.reportingManager || 'Manager'}
            reportingManagerName={activeRecord.employee.reportingManager || 'Manager'}
            employeeName={activeRecord.employee.name}
            isReadOnly={isAlreadyApproved}
            value={managerRemarks}
            onChangeText={(val) => setManagerRemarks(val)}
          />
        </section>

        {/* SECTION 4: MANAGER ACTIONS BAR */}
        <section className="rounded-2xl bg-white/85 backdrop-blur-xl border border-white/80 shadow-[0_8px_30px_rgb(26,80,117,0.05)] p-5 sm:p-6">
          {errorMessage && (
            <div className="mb-4 p-3.5 bg-red-50/90 border border-red-200 rounded-xl text-xs text-red-900 flex items-center gap-2.5 shadow-2xs animate-in fade-in duration-200">
              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* ACTION BUTTONS (RETURN TO EMPLOYEE or APPROVE LNA) */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-xs text-slate-500">
              {isAlreadyApproved && (
                <span className="text-emerald-700 font-bold flex items-center gap-1.5 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
                  <Check className="w-4 h-4" /> LNA is officially approved for this cycle.
                </span>
              )}
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              {/* RETURN TO EMPLOYEE BUTTON */}
              <button
                type="button"
                onClick={() => handleActionClick('resend')}
                disabled={isAlreadyApproved}
                className="px-5 py-2.5 border border-amber-400 bg-white/90 hover:bg-amber-50 text-amber-800 font-extrabold rounded-xl text-xs transition-all flex items-center gap-2 cursor-pointer shadow-xs disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
              >
                <RotateCcw className="w-3.5 h-3.5 text-amber-700" />
                <span>Return to Employee</span>
              </button>

              {/* APPROVE LNA BUTTON */}
              <button
                type="button"
                onClick={() => handleActionClick('approve')}
                disabled={isAlreadyApproved}
                className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-extrabold rounded-xl text-xs transition-all shadow-md shadow-emerald-700/20 flex items-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <CheckCircle2 className="w-4 h-4 text-white" />
                <span>Approve LNA</span>
              </button>
            </div>
          </div>
        </section>
      </>

      {/* CONFIRMATION DIALOG MODAL */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white/95 backdrop-blur-2xl rounded-3xl border border-white/80 shadow-[0_20px_50px_rgba(0,0,0,0.25)] max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div
              className={`p-5 text-white flex items-center justify-between ${
                showConfirmModal === 'approve'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-700'
                  : 'bg-gradient-to-r from-amber-600 to-orange-700'
              }`}
            >
              <h3 className="font-extrabold text-sm flex items-center gap-2">
                {showConfirmModal === 'approve' ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-white" />
                    <span>Approve this LNA?</span>
                  </>
                ) : (
                  <>
                    <RotateCcw className="w-4 h-4 text-white" />
                    <span>Return LNA to Employee?</span>
                  </>
                )}
              </h3>
            </div>

            <div className="p-6 text-xs text-slate-700 space-y-3 leading-relaxed">
              {showConfirmModal === 'approve' ? (
                <p>
                  Approve the Learning Needs Analysis (LNA) for{' '}
                  <strong className="text-slate-900 font-bold">{effectiveSubmission.employee.name}</strong>?
                  <br />
                  This will change the status to <strong className="text-emerald-700 font-bold">APPROVED</strong> and forward the record to the HR Department.
                </p>
              ) : (
                <p>
                  Returning this LNA to <strong className="text-slate-900 font-bold">{effectiveSubmission.employee.name}</strong> will change the status to <strong className="text-amber-700 font-bold">RETURNED TO EMPLOYEE</strong> and allow them to update competency selections and resubmit.
                </p>
              )}
            </div>

            <div className="p-4 bg-slate-50/80 border-t border-slate-200/80 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowConfirmModal(null)}
                className="px-4 py-2 border border-slate-300 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs cursor-pointer transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmAction}
                className={`px-5 py-2 text-white font-extrabold rounded-xl text-xs cursor-pointer shadow-md transition-all active:scale-95 ${
                  showConfirmModal === 'approve'
                    ? 'bg-emerald-700 hover:bg-emerald-800 shadow-emerald-700/20'
                    : 'bg-amber-700 hover:bg-amber-800 shadow-amber-700/20'
                }`}
              >
                {showConfirmModal === 'approve' ? 'Yes, Approve LNA' : 'Yes, Return to Employee'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MANAGER APPROVAL SUCCESS POPUP MODAL */}
      {showApprovalSuccessPopup && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => {
            setShowApprovalSuccessPopup(false);
            onSelectEmployee(null);
          }}
        >
          <div
            className="bg-white/95 backdrop-blur-2xl border border-white/80 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.25)] w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200 p-6 text-center relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => {
                setShowApprovalSuccessPopup(false);
                onSelectEmployee(null);
              }}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100/80 transition-colors cursor-pointer"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Green Tick Mark Icon */}
            <div className="relative w-20 h-20 mx-auto mb-4 flex items-center justify-center">
              <div className="absolute inset-0 bg-emerald-400/20 rounded-full blur-xl animate-pulse" />
              <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center shadow-lg shadow-emerald-600/30 border border-white/40">
                <CheckCircle2 className="w-9 h-9 text-white" />
              </div>
            </div>

            {/* Title */}
            <h3 className="text-lg font-black text-slate-900 tracking-tight">
              LNA Approved
            </h3>
            <p className="text-xs text-slate-600 mt-2 font-medium leading-relaxed">
              This submission has been <strong className="text-emerald-700 font-bold">APPROVED</strong> and forwarded to <strong className="text-slate-800 font-bold">HR Department</strong>.
            </p>
            <div className="mt-5 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  setShowApprovalSuccessPopup(false);
                  onSelectEmployee(null);
                }}
                className="w-full py-2.5 bg-gradient-to-r from-[#1a5075] to-[#0275a8] hover:from-[#154261] hover:to-[#01628d] text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-md active:scale-95"
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
