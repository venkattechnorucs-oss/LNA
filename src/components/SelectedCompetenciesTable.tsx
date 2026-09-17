import React from 'react';
import {
  Competency,
  EmployeeProfile,
  ProficiencyLevel,
  SelectedCompetencyState,
  TrainingCourse
} from '../types';
import {
  determineIdealProficiency,
  determineMappedTrainingCourse,
  getCompetencyById
} from '../data/lnaData';
import {
  GraduationCap,
  BookOpen,
  ChevronDown,
  MessageSquare
} from 'lucide-react';

interface SelectedCompetenciesTableProps {
  selectedCompetencies: SelectedCompetencyState[];
  employee: EmployeeProfile;
  onSelectSkill: (competencyId: string, skillId: string) => void;
  onRemoveCompetency: (competencyId: string) => void;
  onUpdateEmployeeRemarks?: (competencyId: string, remarks: string) => void;
}

// Badge color helper for Read-Only Ideal Proficiency
const getProficiencyBadgeStyle = (level: ProficiencyLevel) => {
  switch (level) {
    case 'Expert':
      return 'bg-purple-100/90 text-purple-900 border-purple-300 shadow-purple-900/10';
    case 'Proficient':
      return 'bg-sky-100/90 text-[#0275a8] border-sky-300 shadow-sky-900/10';
    case 'Intermediate':
      return 'bg-amber-100/90 text-amber-900 border-amber-300 shadow-amber-900/10';
    case 'Foundation':
      return 'bg-slate-100/90 text-slate-700 border-slate-300 shadow-slate-900/10';
    default:
      return 'bg-slate-100/90 text-slate-700 border-slate-300 shadow-slate-900/10';
  }
};

export const SelectedCompetenciesTable: React.FC<SelectedCompetenciesTableProps> = ({
  selectedCompetencies,
  employee,
  onSelectSkill,
  onRemoveCompetency,
  onUpdateEmployeeRemarks
}) => {
  return (
    <section className="rounded-2xl bg-white/85 backdrop-blur-xl border border-white/80 shadow-[0_8px_30px_rgb(26,80,117,0.05)] overflow-hidden">
      {/* Table Section Header */}
      <div className="bg-gradient-to-r from-[#1a5075] via-[#154668] to-[#0275a8] text-white px-5 py-3.5 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-white/15 text-white flex items-center justify-center border border-white/20">
            <GraduationCap className="w-4 h-4 text-sky-200" />
          </div>
          <h2 className="font-bold text-xs sm:text-sm tracking-wide">
            Selected Competencies & Mapped Courses
          </h2>
        </div>
      </div>

      {/* Table Area */}
      <div className="p-4 sm:p-5">
        <div className="border border-slate-200/80 rounded-xl overflow-hidden bg-white/70 shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#f0f7fb]/90 backdrop-blur-xs text-[#1a5075] border-b border-[#c8d8e5] font-extrabold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-3 text-center w-10 border-r border-slate-200/80">#</th>
                  <th className="py-3 px-4 w-1/5 border-r border-slate-200/80 text-center">Competency</th>
                  <th className="py-3 px-4 w-1/5 border-r border-slate-200/80 text-center">Selected Skill (1 Required)</th>
                  <th className="py-3 px-3 w-32 text-center border-r border-slate-200/80">Ideal Proficiency</th>
                  <th className="py-3 px-4 w-1/4 border-r border-slate-200/80 text-center">Mapped Course</th>
                  <th className="py-3 px-4 w-1/4 text-center">Course Alternative</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {selectedCompetencies.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400 text-xs italic bg-white/50">
                      No competencies selected yet. Choose up to 3 competencies from above to configure your focus skills.
                    </td>
                  </tr>
                ) : (
                  selectedCompetencies.map((item, index) => {
                    const comp = getCompetencyById(item.competencyId);
                    if (!comp) return null;

                    const selectedSkill = comp.skills.find((s) => s.id === item.selectedSkillId);
                    const idealProficiency: ProficiencyLevel | null = selectedSkill
                      ? determineIdealProficiency(employee.position, selectedSkill)
                      : null;

                    const mappedCourse: TrainingCourse | null = (selectedSkill && idealProficiency)
                      ? determineMappedTrainingCourse(selectedSkill, idealProficiency, employee.position)
                      : null;

                    return (
                      <tr
                        key={comp.id}
                        className={`transition-colors ${
                          index % 2 === 0 ? 'bg-white/70' : 'bg-[#f8fbfe]/60'
                        } hover:bg-sky-50/50`}
                      >
                        {/* Column 1: Index */}
                        <td className="py-3.5 px-3 text-center font-bold text-slate-600 border-r border-slate-100 align-top pt-4">
                          <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 inline-flex items-center justify-center text-xs font-bold">
                            {index + 1}
                          </span>
                        </td>

                        {/* Column 2: Competency */}
                        <td className="py-3.5 px-4 border-r border-slate-100 align-top pt-3">
                          <div className="flex flex-col">
                            <div className="flex items-center mb-1">
                              <span
                                className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                                  comp.category === 'Functional'
                                    ? 'bg-sky-100 text-[#0275a8] border border-sky-200'
                                    : 'bg-indigo-100 text-indigo-700 border border-indigo-200'
                                }`}
                              >
                                {comp.category}
                              </span>
                            </div>
                            <span className="font-extrabold text-[#1a5075] text-xs">
                              {comp.name}
                            </span>
                          </div>
                        </td>

                        {/* Column 3: Skill Dropdown (1 Skill Required) */}
                        <td className="py-3.5 px-4 border-r border-slate-100 align-top pt-3">
                          <div className="space-y-1.5">
                            <label
                              htmlFor={`skill-select-${comp.id}`}
                              className="text-[10px] font-bold text-slate-600 flex items-center gap-1"
                            >
                              <span>Select Focus Skill:</span>
                              <span className="text-[#0275a8] font-bold">*</span>
                            </label>

                            <div className="relative">
                              <select
                                id={`skill-select-${comp.id}`}
                                value={item.selectedSkillId || ''}
                                onChange={(e) => onSelectSkill(comp.id, e.target.value)}
                                className={`w-full text-xs py-2 px-3 pr-8 border rounded-xl font-medium transition-all appearance-none cursor-pointer shadow-2xs ${
                                  item.selectedSkillId
                                    ? 'bg-white/95 border-[#0275a8] text-slate-900 focus:ring-2 focus:ring-[#0275a8]/30 focus:outline-hidden'
                                    : 'bg-amber-50/80 border-amber-300 text-amber-900 focus:ring-2 focus:ring-amber-400/30 focus:outline-hidden'
                                }`}
                              >
                                <option value="">-- Select One Skill --</option>
                                {comp.skills.map((skill) => (
                                  <option key={skill.id} value={skill.id}>
                                    {skill.name}
                                  </option>
                                ))}
                              </select>
                              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
                                <ChevronDown className="w-3.5 h-3.5" />
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Column 4: Ideal Proficiency (System-Determined, Read-Only) */}
                        <td className="py-3.5 px-3 border-r border-slate-100 text-center align-top pt-4">
                          {idealProficiency ? (
                            <div className="inline-flex flex-col items-center">
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-black border shadow-xs ${getProficiencyBadgeStyle(
                                  idealProficiency
                                )}`}
                              >
                                {idealProficiency}
                              </span>
                            </div>
                          ) : (
                            <span className="text-[11px] text-slate-400 italic block">
                              Awaiting Skill Selection
                            </span>
                          )}
                        </td>

                        {/* Column 5: Recommended Training Course (System-Mapped, Read-Only) */}
                        <td className="py-3.5 px-4 border-r border-slate-100 align-top pt-3">
                          {mappedCourse ? (
                            <div className="bg-gradient-to-br from-[#f0f7fb] to-[#e6f1f8] p-3 rounded-xl border border-[#cfe1ed] shadow-2xs">
                              <span className="font-extrabold text-[#1a5075] text-xs leading-snug flex items-center gap-2">
                                <div className="w-6 h-6 rounded-md bg-[#0275a8]/15 flex items-center justify-center shrink-0">
                                  <BookOpen className="w-3.5 h-3.5 text-[#0275a8]" />
                                </div>
                                {mappedCourse.title}
                              </span>
                            </div>
                          ) : (
                            <div className="py-3 text-center text-slate-400 text-[11px] italic">
                              <span>Select a skill to view mapped training course</span>
                            </div>
                          )}
                        </td>

                        {/* Column 6: Comments */}
                        <td className="py-3.5 px-4 align-top pt-3">
                          <textarea
                            rows={2}
                            value={item.employeeRemarks || ''}
                            onChange={(e) =>
                              onUpdateEmployeeRemarks &&
                              onUpdateEmployeeRemarks(comp.id, e.target.value)
                            }
                            className="w-full text-xs p-2.5 border border-slate-200 rounded-xl bg-white/95 text-slate-800 focus:border-[#0275a8] focus:ring-2 focus:ring-[#0275a8]/20 outline-hidden font-normal leading-relaxed resize-y shadow-2xs"
                          />
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
    </section>
  );
};
