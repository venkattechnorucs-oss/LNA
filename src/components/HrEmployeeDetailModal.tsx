import React from 'react';
import { OrgAssessmentRecord } from '../data/orgAssessments';
import {
  X,
  User,
  Building,
  CheckCircle2,
  Clock,
  RotateCcw,
  BookOpen,
  Award,
  Calendar,
  MessageSquare,
  FileText,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

interface HrEmployeeDetailModalProps {
  record: OrgAssessmentRecord | null;
  isOpen: boolean;
  onClose: () => void;
}

export const HrEmployeeDetailModal: React.FC<HrEmployeeDetailModalProps> = ({
  record,
  isOpen,
  onClose
}) => {
  if (!isOpen || !record) return null;

  const { employee, submission, status } = record;

  const getStatusBadge = () => {
    switch (status) {
      case 'MANAGER APPROVED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-100 border border-emerald-300 text-emerald-800 font-bold text-xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            APPROVED
          </span>
        );
      case 'SUBMITTED FOR MANAGER REVIEW':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#211E4E]/10 border border-[#C8A977]/30 text-[#211E4E] font-bold text-xs">
            <Clock className="w-3.5 h-3.5 text-[#211E4E]" />
            PENDING APPROVAL
          </span>
        );
      case 'SENT BACK TO EMPLOYEE':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-amber-100 border border-amber-300 text-amber-900 font-bold text-xs">
            <RotateCcw className="w-3.5 h-3.5 text-amber-600" />
            RETURNED
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-100 border border-slate-300 text-slate-700 font-bold text-xs">
            <AlertCircle className="w-3.5 h-3.5 text-slate-500" />
            PENDING
          </span>
        );
    }
  };

  const getProficiencyColor = (level: string) => {
    switch (level) {
      case 'Expert':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'Proficient':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Intermediate':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'Foundation':
      default:
        return 'bg-slate-100 text-slate-700 border-slate-300';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-150 overflow-hidden">
        
        {/* Modal Header */}
        <div className="bg-[#211E4E] text-[#C8A977] border-b border-[#C8A977]/20 px-5 py-3.5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <FileText className="w-5 h-5 text-[#C8A977]" />
            <div>
              <h2 className="text-sm sm:text-base font-bold leading-tight text-white">
                Employee LNA Record
              </h2>
              <p className="text-[11px] text-[#C8A977]/80">
                GANS Centralized HR Monitoring • 2026
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body - Scrollable */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 text-xs text-slate-700">
          
          {/* Top Status & Info Ribbon */}
          <div className="bg-[#211E4E]/5 border border-[#C8A977]/20 p-3.5 rounded-xl flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-600">LNA Workflow Status:</span>
              {getStatusBadge()}
            </div>

            <div className="flex items-center gap-4 text-[11px] text-slate-600">
              {submission?.referenceNo && (
                <span>Reference: <strong className="text-slate-800">{submission.referenceNo}</strong></span>
              )}
              <span>Submission Date: <strong className="text-slate-800">{submission?.submissionDate || 'Not Submitted'}</strong></span>
            </div>
          </div>

          {/* Employee Details */}
          <div className="rounded-xl overflow-hidden border border-slate-200 shadow-2xs">
            <div className="bg-[#211E4E] text-[#C8A977] text-xs font-bold px-3 py-2 uppercase tracking-wide flex items-center justify-between">
              <span>Employee Information</span>
              <span className="text-[10px] font-normal opacity-90">ID: {employee.employeeId}</span>
            </div>
            <div className="p-3.5 bg-white grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-slate-500 block text-[11px]">Employee Name:</span>
                <strong className="text-slate-900">{employee.name}</strong>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Designation / Position:</span>
                <strong className="text-slate-900">{employee.position}</strong>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Division:</span>
                <strong className="text-slate-900">{employee.division}</strong>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Department/Project:</span>
                <strong className="text-slate-900">{employee.department}</strong>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Grade:</span>
                <span className="inline-block bg-[#211E4E] text-[#C8A977] border border-[#C8A977]/30 font-bold px-2.5 py-0.5 rounded text-[11px]">
                  {employee.grade}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Section:</span>
                <span className="text-slate-700 text-xs">{employee.section || employee.function || employee.department}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Manager:</span>
                <strong className="text-slate-900">{employee.reportingManager}</strong>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Date of Joining:</span>
                <span className="text-slate-900 font-bold text-xs">{employee.joinDate || '12/May/2021'}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Year:</span>
                <span className="text-slate-800 text-xs font-medium">
                  {employee.reviewPeriod || submission?.cycleYear || '2026'}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Location / Section:</span>
                <span className="text-slate-700">{employee.section || employee.location || 'Abu Dhabi HQ'}</span>
              </div>
            </div>
          </div>

          {/* Selected Competencies & Skills */}
          <div className="rounded-xl overflow-hidden border border-slate-200 shadow-2xs">
            <div className="bg-[#211E4E] text-[#C8A977] text-xs font-bold px-3 py-2 uppercase tracking-wide flex items-center justify-between">
              <span>Competency &amp; Skill Selections</span>
              <span className="text-[10px] font-normal opacity-90">
                {submission ? `${submission.selectedItems.length} Competencies Selected` : 'No Selections Yet'}
              </span>
            </div>

            {submission && submission.selectedItems.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-[#211E4E] text-[#C8A977] font-bold border-b border-[#C8A977]/30">
                    <tr>
                      <th className="p-2.5 w-10 text-center border-r border-white/10">#</th>
                      <th className="p-2.5 w-28 border-r border-white/10">Category</th>
                      <th className="p-2.5 border-r border-white/10">Competency &amp; Selected Skill</th>
                      <th className="p-2.5 w-32 border-r border-white/10">Ideal Proficiency</th>
                      <th className="p-2.5 border-r border-white/10">Course</th>
                      <th className="p-2.5 w-48">Course Alternative</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {submission.selectedItems.map((item, idx) => (
                      <tr key={item.competency.id} className="bg-white hover:bg-[#211E4E]/5">
                        <td className="p-2.5 text-center font-bold text-slate-500 border-r border-slate-100">
                          {idx + 1}
                        </td>
                        <td className="p-2.5 border-r border-slate-100">
                          <span
                            className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                              item.competency.category === 'Functional'
                                ? 'bg-[#211E4E]/10 text-[#211E4E] border border-[#C8A977]/30'
                                : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            }`}
                          >
                            {item.competency.category}
                          </span>
                        </td>
                        <td className="p-2.5 border-r border-slate-100">
                          <div className="font-bold text-[#211E4E] text-xs">
                            {item.competency.name}
                          </div>
                          <div className="mt-1 flex items-start gap-1.5 bg-slate-50 p-1.5 rounded border border-slate-200">
                            <span className="font-semibold text-slate-700">Selected Skill:</span>
                            <span className="text-slate-900 font-medium">{item.skill.name}</span>
                          </div>
                        </td>
                        <td className="p-2.5 border-r border-slate-100">
                          <span className={`inline-block px-2.5 py-1 rounded font-bold text-[11px] border ${getProficiencyColor(item.idealProficiency)}`}>
                            {item.idealProficiency}
                          </span>
                          <span className="block text-[10px] text-slate-400 mt-0.5">System Mapped</span>
                        </td>
                        <td className="p-2.5 border-r border-slate-100">
                          <div className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                            <BookOpen className="w-3.5 h-3.5 text-[#211E4E] shrink-0" />
                            <span>{item.trainingCourse.title}</span>
                          </div>
                          <div className="mt-1 flex flex-wrap items-center gap-2 text-[10px] text-slate-500">
                            <span>{item.trainingCourse.duration}</span>
                            <span>•</span>
                            <span className="text-slate-600">{item.trainingCourse.deliveryMethod}</span>
                          </div>
                        </td>
                        <td className="p-2.5">
                          {item.employeeRemarks && item.employeeRemarks.trim() ? (
                            <span className="text-slate-800 text-xs">{item.employeeRemarks}</span>
                          ) : (
                            <span className="text-slate-400 text-xs italic">-</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="border border-t-0 border-slate-200 p-6 text-center bg-white text-slate-500 rounded-b-xl">
                <AlertCircle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="font-semibold text-slate-700">No competency selections submitted yet.</p>
                <p className="text-[11px] text-slate-400 mt-0.5">The employee has not finalized or submitted their 2026 LNA.</p>
              </div>
            )}
          </div>

          {/* Section 3 & 4: Comments & Manager Review Remarks */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Employee Comments */}
            <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs">
              <h4 className="font-bold text-[#211E4E] text-xs flex items-center gap-1.5 mb-2 pb-1.5 border-b border-slate-100">
                <MessageSquare className="w-3.5 h-3.5 text-[#C8A977]" />
                Employee Submitted Comments
              </h4>
              <div className="bg-slate-50/80 p-3 rounded-lg border border-slate-200/80 text-xs min-h-[70px]">
                {submission?.comments ? (
                  <p className="whitespace-pre-wrap text-slate-800 leading-relaxed">{submission.comments}</p>
                ) : (
                  <span className="text-slate-400 italic">No employee comments provided.</span>
                )}
              </div>
            </div>

            {/* Manager Comments / Remarks */}
            <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs">
              <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-slate-100">
                <h4 className="font-bold text-[#211E4E] text-xs flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Manager Remarks &amp; Action
                </h4>
                {submission?.managerActionDate && (
                  <span className="text-[10px] text-slate-500">
                    Action Date: {submission.managerActionDate}
                  </span>
                )}
              </div>
              <div className="bg-slate-50/80 p-3 rounded-lg border border-slate-200/80 text-xs min-h-[70px]">
                {submission?.managerComments ? (
                  <p className="whitespace-pre-wrap text-slate-800 leading-relaxed">{submission.managerComments}</p>
                ) : status === 'MANAGER APPROVED' ? (
                  <span className="text-emerald-700 font-medium">Approved by Manager.</span>
                ) : status === 'SUBMITTED FOR MANAGER REVIEW' ? (
                  <span className="text-amber-700 italic">Awaiting Manager Review ({employee.reportingManager}).</span>
                ) : (
                  <span className="text-slate-400 italic">No manager feedback logged yet.</span>
                )}
              </div>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 border-t border-slate-200/80 px-6 py-3.5 flex items-center justify-end gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-[#211E4E] hover:bg-[#2c2865] text-[#C8A977] border border-[#C8A977]/30 text-xs font-bold rounded-xl cursor-pointer transition-all shadow-sm active:scale-95"
          >
            Close Window
          </button>
        </div>

      </div>
    </div>
  );
};
