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
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-sky-100 border border-sky-300 text-[#0275a8] font-bold text-xs">
            <Clock className="w-3.5 h-3.5 text-[#0275a8]" />
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
      <div className="bg-white border border-[#c8d8e5] rounded-xs shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
        
        {/* Modal Header */}
        <div className="bg-[#1a5075] text-white px-5 py-3.5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <FileText className="w-5 h-5 text-sky-300" />
            <div>
              <h2 className="text-sm sm:text-base font-bold leading-tight">
                Employee LNA Record
              </h2>
              <p className="text-[11px] text-sky-200">
                GANS Centralized HR Monitoring • 2026
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-sky-200 hover:text-white p-1 rounded hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body - Scrollable */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 text-xs text-slate-700">
          
          {/* Top Status & Info Ribbon */}
          <div className="bg-[#f0f7fb] border border-[#bcd7ea] p-3.5 rounded-xs flex flex-wrap items-center justify-between gap-3">
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
          <div>
            <div className="bg-[#8b181b] text-white text-xs font-bold px-3 py-1.5 uppercase tracking-wide flex items-center justify-between">
              <span>Employee Information</span>
              <span className="text-[10px] font-normal opacity-90">ID: {employee.employeeId}</span>
            </div>
            <div className="border border-t-0 border-[#c8d8e5] p-3.5 bg-[#fdfdfd] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
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
                <span className="inline-block bg-[#1a5075] text-white font-bold px-2.5 py-0.5 rounded text-[11px]">
                  {employee.grade}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Function:</span>
                <span className="text-slate-700 text-xs">{employee.function || employee.department}</span>
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
          <div>
            <div className="bg-[#0275a8] text-white text-xs font-bold px-3 py-1.5 uppercase tracking-wide flex items-center justify-between">
              <span>Competency &amp; Skill Selections</span>
              <span className="text-[10px] font-normal opacity-90">
                {submission ? `${submission.selectedItems.length} Competencies Selected` : 'No Selections Yet'}
              </span>
            </div>

            {submission && submission.selectedItems.length > 0 ? (
              <div className="border border-t-0 border-[#c8d8e5] overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-[#096f9c] text-white font-bold">
                    <tr>
                      <th className="p-2.5 w-10 text-center border-r border-[#0275a8]">#</th>
                      <th className="p-2.5 w-28 border-r border-[#0275a8]">Category</th>
                      <th className="p-2.5 border-r border-[#0275a8]">Competency &amp; Selected Skill</th>
                      <th className="p-2.5 w-32 border-r border-[#0275a8]">Ideal Proficiency</th>
                      <th className="p-2.5 border-r border-[#0275a8]">Course</th>
                      <th className="p-2.5 w-48">Course Alternative</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {submission.selectedItems.map((item, idx) => (
                      <tr key={item.competency.id} className="bg-white hover:bg-slate-50">
                        <td className="p-2.5 text-center font-bold text-slate-500 border-r border-slate-200">
                          {idx + 1}
                        </td>
                        <td className="p-2.5 border-r border-slate-200">
                          <span
                            className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                              item.competency.category === 'Functional'
                                ? 'bg-sky-100 text-[#0275a8] border border-sky-200'
                                : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            }`}
                          >
                            {item.competency.category}
                          </span>
                        </td>
                        <td className="p-2.5 border-r border-slate-200">
                          <div className="font-bold text-[#1a5075] text-xs">
                            {item.competency.name}
                          </div>
                          <div className="mt-1 flex items-start gap-1.5 bg-slate-50 p-1.5 rounded border border-slate-200">
                            <span className="font-semibold text-slate-700">Selected Skill:</span>
                            <span className="text-slate-900 font-medium">{item.skill.name}</span>
                          </div>
                        </td>
                        <td className="p-2.5 border-r border-slate-200">
                          <span className={`inline-block px-2.5 py-1 rounded font-bold text-[11px] border ${getProficiencyColor(item.idealProficiency)}`}>
                            {item.idealProficiency}
                          </span>
                          <span className="block text-[10px] text-slate-400 mt-0.5">System Mapped</span>
                        </td>
                        <td className="p-2.5 border-r border-slate-200">
                          <div className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                            <BookOpen className="w-3.5 h-3.5 text-[#0275a8] shrink-0" />
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
              <div className="border border-t-0 border-[#c8d8e5] p-6 text-center bg-white text-slate-500">
                <AlertCircle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="font-semibold">No competency selections submitted yet.</p>
                <p className="text-[11px] text-slate-400 mt-0.5">The employee has not finalized or submitted their 2026 LNA.</p>
              </div>
            )}
          </div>

          {/* Section 3 & 4: Comments & Manager Review Remarks */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Employee Comments */}
            <div className="bg-white border border-[#c8d8e5] rounded-xs p-3.5">
              <h4 className="font-bold text-[#1a5075] text-xs flex items-center gap-1.5 mb-2 pb-1.5 border-b border-slate-100">
                <MessageSquare className="w-3.5 h-3.5 text-[#0275a8]" />
                Employee Submitted Comments
              </h4>
              <div className="bg-slate-50 p-2.5 rounded border border-slate-200 text-xs min-h-[70px]">
                {submission?.comments ? (
                  <p className="whitespace-pre-wrap text-slate-800">{submission.comments}</p>
                ) : (
                  <span className="text-slate-400 italic">No employee comments provided.</span>
                )}
              </div>
            </div>

            {/* Manager Comments / Remarks */}
            <div className="bg-white border border-[#c8d8e5] rounded-xs p-3.5">
              <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-slate-100">
                <h4 className="font-bold text-[#1a5075] text-xs flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Manager Remarks &amp; Action
                </h4>
                {submission?.managerActionDate && (
                  <span className="text-[10px] text-slate-500">
                    Action Date: {submission.managerActionDate}
                  </span>
                )}
              </div>
              <div className="bg-slate-50 p-2.5 rounded border border-slate-200 text-xs min-h-[70px]">
                {submission?.managerComments ? (
                  <p className="whitespace-pre-wrap text-slate-800">{submission.managerComments}</p>
                ) : status === 'MANAGER APPROVED' ? (
                  <span className="text-emerald-700 font-medium">Approved by Manager.</span>
                ) : status === 'SUBMITTED FOR MANAGER REVIEW' ? (
                  <span className="text-sky-700 italic">Awaiting Manager Review ({employee.reportingManager}).</span>
                ) : (
                  <span className="text-slate-400 italic">No manager feedback logged yet.</span>
                )}
              </div>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="bg-slate-100 border-t border-slate-200 px-5 py-3 flex items-center justify-end gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-1.5 bg-[#1a5075] hover:bg-[#133d59] text-white text-xs font-bold rounded-xs cursor-pointer transition-colors shadow-xs"
          >
            Close Window
          </button>
        </div>

      </div>
    </div>
  );
};
