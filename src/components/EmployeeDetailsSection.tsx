import React from 'react';
import { EmployeeProfile } from '../types';
import { UserCheck } from 'lucide-react';

interface EmployeeDetailsSectionProps {
  employee: EmployeeProfile;
}

export const EmployeeDetailsSection: React.FC<EmployeeDetailsSectionProps> = ({ employee }) => {
  return (
    <section className="rounded-2xl bg-white/85 backdrop-blur-xl border border-white/80 shadow-[0_8px_30px_rgb(26,80,117,0.05)] overflow-hidden">
      <div className="bg-gradient-to-r from-[#1a5075] via-[#154668] to-[#0275a8] text-white px-5 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5 font-bold text-xs sm:text-sm tracking-wide">
          <div className="w-7 h-7 rounded-lg bg-white/15 text-white flex items-center justify-center border border-white/20">
            <UserCheck className="w-4 h-4 text-sky-200" />
          </div>
          <span>Employee Details</span>
        </div>
      </div>

      {/* Structured Enterprise Form Table Layout with Glassmorphic Cells */}
      <div className="p-4 sm:p-5">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-slate-200/80 border border-slate-200/90 rounded-xl overflow-hidden text-xs shadow-2xs">
          
          {/* Row 1: Name & ID */}
          <div className="bg-[#f2f7fa]/90 p-3 font-extrabold text-slate-700 flex items-center justify-between">
            <span>Employee Name</span>
          </div>
          <div className="bg-white/95 p-3 text-xs font-semibold text-slate-800 flex items-center">
            <span>{employee.name}</span>
          </div>

          <div className="bg-[#f2f7fa]/90 p-3 font-extrabold text-slate-700 flex items-center justify-between">
            <span>Employee ID</span>
          </div>
          <div className="bg-white/95 p-3 text-xs font-semibold text-slate-800 flex items-center">
            <span>{employee.employeeId}</span>
          </div>

          {/* Row 2: Position & Grade */}
          <div className="bg-[#f2f7fa]/90 p-3 font-extrabold text-slate-700 flex items-center">
            <span>Position / Designation</span>
          </div>
          <div className="bg-white/95 p-3 text-xs font-semibold text-slate-800 flex items-center">
            <span>{employee.position}</span>
          </div>

          <div className="bg-[#f2f7fa]/90 p-3 font-extrabold text-slate-700 flex items-center">
            <span>Grade</span>
          </div>
          <div className="bg-white/95 p-3 text-xs font-semibold text-slate-800 flex items-center">
            <span>Grade {employee.grade}</span>
          </div>

          {/* Row 3: Division & Department/Project */}
          <div className="bg-[#f2f7fa]/90 p-3 font-extrabold text-slate-700 flex items-center">
            <span>Division</span>
          </div>
          <div className="bg-white/95 p-3 text-xs font-semibold text-slate-800 flex items-center">
            <span>{employee.division}</span>
          </div>

          <div className="bg-[#f2f7fa]/90 p-3 font-extrabold text-slate-700 flex items-center">
            <span>Department/Project</span>
          </div>
          <div className="bg-white/95 p-3 text-xs font-semibold text-slate-800 flex items-center">
            <span>{employee.department}</span>
          </div>

          {/* Row 4: Function & Manager */}
          <div className="bg-[#f2f7fa]/90 p-3 font-extrabold text-slate-700 flex items-center">
            <span>Function</span>
          </div>
          <div className="bg-white/95 p-3 text-xs font-semibold text-slate-800 flex items-center">
            <span>{employee.function || employee.department}</span>
          </div>

          <div className="bg-[#f2f7fa]/90 p-3 font-extrabold text-slate-700 flex items-center">
            <span>Manager</span>
          </div>
          <div className="bg-white/95 p-3 text-xs font-semibold text-slate-800 flex items-center">
            <span>{employee.reportingManager}</span>
          </div>

          {/* Row 5: Date of Joining & Year */}
          <div className="bg-[#f2f7fa]/90 p-3 font-extrabold text-slate-700 flex items-center">
            <span>Date of Joining</span>
          </div>
          <div className="bg-white/95 p-3 text-xs font-semibold text-slate-800 flex items-center">
            <span>{employee.joinDate || '12/May/2021'}</span>
          </div>

          <div className="bg-[#f2f7fa]/90 p-3 font-extrabold text-slate-700 flex items-center">
            <span>Year</span>
          </div>
          <div className="bg-white/95 p-3 text-xs font-semibold text-slate-800 flex items-center">
            <span>{employee.reviewPeriod || '2026'}</span>
          </div>

        </div>
      </div>
    </section>
  );
};
