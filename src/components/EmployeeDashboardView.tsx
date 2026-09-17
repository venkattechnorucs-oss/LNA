import React from 'react';
import {
  GraduationCap,
  CheckCircle2,
  RotateCcw,
  Clock,
  ArrowUpRight,
  Calendar,
  Sparkles,
  Award
} from 'lucide-react';
import { EmployeeProfile, LNAAssessmentSubmission } from '../types';

interface EmployeeDashboardViewProps {
  employee: EmployeeProfile;
  submission: LNAAssessmentSubmission | null;
  onNavigateToLna: () => void;
}

export const EmployeeDashboardView: React.FC<EmployeeDashboardViewProps> = ({
  employee,
  submission,
  onNavigateToLna
}) => {
  // Historical training cycles + current 2026 cycle
  const previousAssessments = [
    {
      cycleYear: '2025',
      referenceNo: 'REF/ESS/25-0412',
      completionDate: '15 Nov 2025',
      reportingManager: employee.reportingManager,
      status: 'Completed'
    },
    {
      cycleYear: '2024',
      referenceNo: 'REF/ESS/24-0981',
      completionDate: '18 Nov 2024',
      reportingManager: employee.reportingManager,
      status: 'Completed'
    }
  ];

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      {/* Welcome & Overview Glass Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1a5075] via-[#104060] to-[#0d2f47] p-5 sm:p-6 text-white shadow-[0_12px_36px_-6px_rgba(26,80,117,0.35)] border border-white/20 backdrop-blur-xl">
        <div className="absolute -right-8 -top-8 w-56 h-56 bg-sky-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 -bottom-10 w-48 h-48 bg-teal-400/15 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white drop-shadow-xs">
              Welcome, {employee.name}
            </h1>
          </div>
        </div>
      </div>

      {/* ================================================== */}
      {/* Learning Needs Analysis (LNA) LIST (CURRENT & PREVIOUS)     */}
      {/* ================================================== */}
      <section className="rounded-2xl bg-white/85 backdrop-blur-xl border border-white/80 shadow-[0_8px_30px_rgb(26,80,117,0.05)] overflow-hidden">
        <div className="bg-gradient-to-r from-[#1a5075] via-[#154668] to-[#0275a8] text-white px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5 font-bold text-xs sm:text-sm">
            <div className="w-7 h-7 rounded-lg bg-white/15 text-white flex items-center justify-center border border-white/20">
              <GraduationCap className="w-4 h-4 text-sky-200" />
            </div>
            <span>Learning Needs Analysis (LNA)</span>
          </div>
        </div>

        <div className="p-4 sm:p-5">
          <div className="border border-slate-200/80 rounded-xl overflow-hidden bg-white/70 shadow-2xs">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-[#f0f7fb]/90 backdrop-blur-xs text-[#1a5075] border-b border-[#c8d8e5] font-extrabold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="p-3 border-r border-slate-200/80 text-center">Year</th>
                  <th className="p-3 border-r border-slate-200/80 text-center">Action</th>
                  <th className="p-3 border-r border-slate-200/80 text-center whitespace-nowrap">Date</th>
                  <th className="p-3 border-r border-slate-200/80 text-center">Manager</th>
                  <th className="p-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {/* 2026 Annual Cycle (New / Current Submission) */}
                <tr className="bg-sky-50/50 hover:bg-sky-100/60 transition-colors">
                  <td className="p-3 font-bold text-[#1a5075] border-r border-slate-100 text-center">
                    <span className="bg-[#1a5075]/10 text-[#1a5075] px-2.5 py-0.5 rounded-md font-bold text-xs inline-block">
                      2026
                    </span>
                  </td>
                  <td className="p-3 border-r border-slate-100 text-center">
                    <button
                      type="button"
                      onClick={onNavigateToLna}
                      className="text-[#0275a8] hover:text-[#014d70] hover:underline font-bold text-center cursor-pointer inline-flex items-center justify-center group"
                    >
                      <span className="font-extrabold">
                        {submission?.status === 'MANAGER APPROVED' || submission?.status === 'SUBMITTED FOR MANAGER REVIEW'
                          ? 'View'
                          : submission?.status === 'SENT BACK TO EMPLOYEE'
                          ? 'Edit'
                          : 'Start'}
                      </span>
                    </button>
                  </td>
                  <td className="p-3 text-slate-700 font-medium border-r border-slate-100 whitespace-nowrap text-center">
                    {submission?.submissionDate || '15 Jan 2026'}
                  </td>
                  <td className="p-3 text-slate-800 font-medium border-r border-slate-100 text-center">
                    {employee.reportingManager || 'Suresh Nair'}
                  </td>
                  <td className="p-3 text-center">
                    {submission?.status === 'MANAGER APPROVED' ? (
                      <span className="inline-flex items-center gap-1.5 bg-emerald-100/80 text-emerald-800 border border-emerald-300/70 px-2.5 py-1 rounded-full font-bold text-[10px] shadow-2xs">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        Completed
                      </span>
                    ) : submission?.status === 'SENT BACK TO EMPLOYEE' ? (
                      <span className="inline-flex items-center gap-1.5 bg-amber-100/80 text-amber-900 border border-amber-300/70 px-2.5 py-1 rounded-full font-bold text-[10px] shadow-2xs">
                        <RotateCcw className="w-3 h-3 text-amber-600" />
                        Returned
                      </span>
                    ) : submission?.status === 'SUBMITTED FOR MANAGER REVIEW' ? (
                      <span className="inline-flex items-center gap-1.5 bg-sky-100/80 text-[#0275a8] border border-sky-300/70 px-2.5 py-1 rounded-full font-bold text-[10px] shadow-2xs">
                        <Clock className="w-3 h-3 text-[#0275a8]" />
                        Pending Approval
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 bg-blue-100/80 text-blue-900 border border-blue-300/70 px-2.5 py-1 rounded-full font-bold text-[10px] shadow-2xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                        Not Started
                      </span>
                    )}
                  </td>
                </tr>

                {/* Previous Cycles (Completed) */}
                {previousAssessments.map((prev) => (
                  <tr key={prev.cycleYear} className="bg-white/60 hover:bg-slate-50/70 transition-colors">
                    <td className="p-3 font-bold text-slate-700 border-r border-slate-100 text-center">
                      {prev.cycleYear}
                    </td>
                    <td className="p-3 text-slate-700 font-medium border-r border-slate-100 text-center">
                      <button
                        type="button"
                        onClick={onNavigateToLna}
                        className="text-[#0275a8] hover:text-[#014d70] hover:underline font-bold text-center cursor-pointer inline-flex items-center justify-center gap-1"
                      >
                        <span>View</span>
                      </button>
                    </td>
                    <td className="p-3 text-slate-600 border-r border-slate-100 whitespace-nowrap text-center">
                      {prev.completionDate}
                    </td>
                    <td className="p-3 text-slate-700 border-r border-slate-100 text-center">
                      {prev.reportingManager || 'Suresh Nair'}
                    </td>
                    <td className="p-3 text-center">
                      <span className="inline-flex items-center gap-1.5 bg-emerald-100/80 text-emerald-800 border border-emerald-300/70 px-2.5 py-1 rounded-full font-bold text-[10px] shadow-2xs">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        {prev.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
};
