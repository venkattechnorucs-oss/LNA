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
      <div className="relative overflow-hidden rounded-2xl bg-[#211E4E] p-5 sm:p-6 text-[#C8A977] shadow-[0_12px_36px_-6px_rgba(33,30,78,0.25)] border border-[#C8A977]/30 backdrop-blur-xl">
        <div className="absolute -right-8 -top-8 w-56 h-56 bg-[#C8A977]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 -bottom-10 w-48 h-48 bg-[#C8A977]/5 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white drop-shadow-xs">
              Welcome, {employee.name}
            </h1>
            <p className="text-xs text-[#C8A977]/80 mt-1 font-medium">
              Employee Learning Needs Analysis Portal • Professional Competency & Growth
            </p>
          </div>
        </div>
      </div>

      {/* ================================================== */}
      {/* Learning Needs Analysis (LNA) LIST (CURRENT & PREVIOUS)     */}
      {/* ================================================== */}
      <section className="rounded-2xl bg-white/85 backdrop-blur-xl border border-white/80 shadow-[0_8px_30px_rgb(33,30,78,0.05)] overflow-hidden">
        <div className="bg-[#211E4E] text-[#C8A977] border-b border-[#C8A977]/20 px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5 font-bold text-xs sm:text-sm">
            <div className="w-7 h-7 rounded-lg bg-[#C8A977]/20 text-[#C8A977] flex items-center justify-center border border-[#C8A977]/30">
              <GraduationCap className="w-4 h-4 text-[#C8A977]" />
            </div>
            <span className="text-white">Learning Needs Analysis (LNA)</span>
          </div>
        </div>

        <div className="p-4 sm:p-5">
          <div className="border border-slate-200/80 rounded-xl overflow-hidden bg-white/70 shadow-2xs">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-[#211E4E] text-[#C8A977] border-b border-[#C8A977]/30 font-extrabold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="p-3 border-r border-white/10 text-center">Year</th>
                  <th className="p-3 border-r border-white/10 text-center whitespace-nowrap">Date</th>
                  <th className="p-3 border-r border-white/10 text-center">Manager</th>
                  <th className="p-3 border-r border-white/10 text-center">Status</th>
                  <th className="p-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {/* 2026 Annual Cycle (New / Current Submission) */}
                <tr className="bg-[#211E4E]/5 hover:bg-[#211E4E]/10 transition-colors">
                  <td className="p-3 font-bold text-[#211E4E] border-r border-slate-100 text-center">
                    <span className="bg-[#211E4E] text-[#C8A977] border border-[#C8A977]/30 px-2.5 py-0.5 rounded-md font-bold text-xs inline-block">
                      2026
                    </span>
                  </td>
                  <td className="p-3 text-slate-700 font-medium border-r border-slate-100 whitespace-nowrap text-center">
                    {submission?.submissionDate || '15 Jan 2026'}
                  </td>
                  <td className="p-3 text-slate-800 font-medium border-r border-slate-100 text-center">
                    {employee.reportingManager || 'Suresh Nair'}
                  </td>
                  <td className="p-3 border-r border-slate-100 text-center">
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
                      <span className="inline-flex items-center gap-1.5 bg-[#211E4E]/10 text-[#211E4E] border border-[#C8A977]/30 px-2.5 py-1 rounded-full font-bold text-[10px] shadow-2xs">
                        <Clock className="w-3 h-3 text-[#211E4E]" />
                        Pending Approval
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-700 border border-slate-200 px-2.5 py-1 rounded-full font-bold text-[10px] shadow-2xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                        Not Started
                      </span>
                    )}
                  </td>
                  <td className="p-3 text-center">
                    <button
                      type="button"
                      onClick={onNavigateToLna}
                      className="text-[#211E4E] hover:underline font-bold text-center cursor-pointer inline-flex items-center justify-center group"
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
                </tr>

                {/* Previous Cycles (Completed) */}
                {previousAssessments.map((prev) => (
                  <tr key={prev.cycleYear} className="bg-white/60 hover:bg-slate-50/70 transition-colors">
                    <td className="p-3 font-bold text-slate-700 border-r border-slate-100 text-center">
                      {prev.cycleYear}
                    </td>
                    <td className="p-3 text-slate-600 border-r border-slate-100 whitespace-nowrap text-center">
                      {prev.completionDate}
                    </td>
                    <td className="p-3 text-slate-700 border-r border-slate-100 text-center">
                      {prev.reportingManager || 'Suresh Nair'}
                    </td>
                    <td className="p-3 border-r border-slate-100 text-center">
                      <span className="inline-flex items-center gap-1.5 bg-emerald-100/80 text-emerald-800 border border-emerald-300/70 px-2.5 py-1 rounded-full font-bold text-[10px] shadow-2xs">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        {prev.status}
                      </span>
                    </td>
                    <td className="p-3 text-slate-700 font-medium text-center">
                      <button
                        type="button"
                        onClick={onNavigateToLna}
                        className="text-[#211E4E] hover:underline font-bold text-center cursor-pointer inline-flex items-center justify-center gap-1"
                      >
                        <span>View</span>
                      </button>
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
