import React, { useState, useMemo } from 'react';
import { Competency, Skill } from '../types';
import {
  Sparkles,
  PlusCircle,
  Search,
  BookOpen,
  GraduationCap,
  Award,
  Trash2,
  X,
  CheckCircle2,
  Layers,
  Filter
} from 'lucide-react';

interface SkillRow {
  skillId: string;
  skillName: string;
  definition: string;
  competencyId: string;
  competencyName: string;
  competencyCode: string;
  category: 'Functional' | 'Behavioral';
  defaultProficiency: number;
  defaultCourseCode: string;
  defaultCourseTitle: string;
}

interface HrSkillsMasterViewProps {
  competencies: Competency[];
  onAddSkill: (competencyId: string, skill: Skill, defaultCourse?: { code: string; title: string }) => void;
  onDeleteSkill?: (competencyId: string, skillId: string) => void;
}

export const HrSkillsMasterView: React.FC<HrSkillsMasterViewProps> = ({
  competencies,
  onAddSkill,
  onDeleteSkill
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCompFilter, setSelectedCompFilter] = useState('ALL');
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | 'Functional' | 'Behavioral'>('ALL');
  const [showAddModal, setShowAddModal] = useState(false);
  const [deleteConfirmSkill, setDeleteConfirmSkill] = useState<{ compId: string; skillId: string; name: string } | null>(null);

  const getLevelLabel = (num: number) => {
    switch (num) {
      case 1:
        return 'Foundation';
      case 2:
        return 'Intermediate';
      case 3:
        return 'Proficient';
      default:
        return 'Expert';
    }
  };

  // Flatten skills from competencies
  const allSkills: SkillRow[] = useMemo(() => {
    const rows: SkillRow[] = [];
    competencies.forEach((comp) => {
      comp.skills.forEach((sk, idx) => {
        // Derive course representation
        const courseCode = `CRS-${comp.code.replace('COMP-', '')}-${idx + 101}`;
        const courseTitle = `${sk.name} – Professional Training & Practical Workshop`;

        rows.push({
          skillId: sk.id,
          skillName: sk.name,
          definition: sk.description || '',
          competencyId: comp.id,
          competencyName: comp.name,
          competencyCode: comp.code,
          category: comp.category,
          defaultProficiency: 3 + (idx % 2),
          defaultCourseCode: courseCode,
          defaultCourseTitle: courseTitle
        });
      });
    });
    return rows;
  }, [competencies]);

  // Filter skills
  const filteredSkills = useMemo(() => {
    return allSkills.filter((row) => {
      if (selectedCategory !== 'ALL' && row.category !== selectedCategory) return false;
      if (selectedCompFilter !== 'ALL' && row.competencyId !== selectedCompFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = row.skillName.toLowerCase().includes(q);
        const matchDef = row.definition.toLowerCase().includes(q);
        const matchComp = row.competencyName.toLowerCase().includes(q);
        const matchCourse = row.defaultCourseTitle.toLowerCase().includes(q);
        if (!matchName && !matchDef && !matchComp && !matchCourse) return false;
      }
      return true;
    });
  }, [allSkills, selectedCategory, selectedCompFilter, searchQuery]);

  // New Skill Form State
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillDefinition, setNewSkillDefinition] = useState('');
  const [targetCompId, setTargetCompId] = useState(competencies[0]?.id || '');
  const [newCourseCode, setNewCourseCode] = useState('CRS-GEN-301');
  const [newCourseTitle, setNewCourseTitle] = useState('');
  const [targetProficiency, setTargetProficiency] = useState(3);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const handleSaveSkill = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!newSkillName.trim()) errs.skillName = 'Skill name is required';
    if (!newSkillDefinition.trim()) errs.skillDefinition = 'Skill definition is required';
    if (!targetCompId) errs.targetCompId = 'Parent competency is required';

    if (Object.keys(errs).length > 0) {
      setFormErrors(errs);
      return;
    }

    const targetComp = competencies.find((c) => c.id === targetCompId);
    const newSkill: Skill = {
      id: `sk_custom_${Date.now()}`,
      name: newSkillName.trim(),
      code: `SK-${Math.floor(100 + Math.random() * 900)}`,
      description: newSkillDefinition.trim(),
      category: targetComp?.category || 'Functional',
      competencyId: targetCompId
    };

    onAddSkill(targetCompId, newSkill, {
      code: newCourseCode.trim() || 'CRS-NEW-01',
      title: newCourseTitle.trim() || `${newSkillName.trim()} Training Course`
    });

    setShowAddModal(false);
    setNewSkillName('');
    setNewSkillDefinition('');
    setNewCourseTitle('');
    setFormErrors({});
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      {/* Banner */}
      <div className="bg-gradient-to-r from-[#1a5075] via-[#154668] to-[#0d314a] rounded-xl p-5 text-white shadow-md border border-[#2b658f] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2.5">
            <Sparkles className="w-6 h-6 text-sky-300" />
            <span>Skills Master</span>
          </h1>
        </div>

        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-[#0275a8] hover:bg-[#02628d] text-white font-bold text-xs rounded-lg flex items-center gap-1.5 shadow-sm transition-all cursor-pointer active:scale-95"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>Add Skill</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div className="bg-white p-3.5 rounded-lg border border-[#c8d8e5] shadow-2xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Total Skills</span>
          <div className="text-2xl font-black text-[#1a5075] mt-1">{allSkills.length}</div>
        </div>
        <div className="bg-white p-3.5 rounded-lg border border-[#c8d8e5] shadow-2xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Functional Skills</span>
          <div className="text-2xl font-black text-sky-700 mt-1">
            {allSkills.filter((s) => s.category === 'Functional').length}
          </div>
        </div>
        <div className="bg-white p-3.5 rounded-lg border border-[#c8d8e5] shadow-2xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Behavioral Skills</span>
          <div className="text-2xl font-black text-emerald-700 mt-1">
            {allSkills.filter((s) => s.category === 'Behavioral').length}
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-3.5 rounded-lg border border-[#c8d8e5] shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search skills by title, definition, parent competency..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-md text-xs text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:border-[#0275a8] focus:bg-white transition-all shadow-2xs"
            />
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-xs font-bold text-slate-600 whitespace-nowrap">Category:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as any)}
              className="bg-white border border-slate-300 rounded-md px-2.5 py-1.5 text-xs text-slate-700 font-medium focus:outline-hidden focus:border-[#0275a8]"
            >
              <option value="ALL">All Categories</option>
              <option value="Functional">Functional Only</option>
              <option value="Behavioral">Behavioral Only</option>
            </select>
          </div>

          {/* Parent Competency Filter */}
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-xs font-bold text-slate-600 whitespace-nowrap">Parent Competency:</span>
            <select
              value={selectedCompFilter}
              onChange={(e) => setSelectedCompFilter(e.target.value)}
              className="bg-white border border-slate-300 rounded-md px-2.5 py-1.5 text-xs text-slate-700 font-medium focus:outline-hidden focus:border-[#0275a8] max-w-xs truncate"
            >
              <option value="ALL">All Competencies</option>
              {competencies.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {(searchQuery || selectedCategory !== 'ALL' || selectedCompFilter !== 'ALL') && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('ALL');
                setSelectedCompFilter('ALL');
              }}
              className="text-xs text-[#0275a8] hover:underline font-bold px-2 py-1 cursor-pointer"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Skills Table */}
      <div className="bg-white rounded-lg border border-[#c8d8e5] shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#1a5075] text-white font-bold border-b border-[#144262]">
                <th className="py-2.5 px-3.5 w-12 text-center">#</th>
                <th className="py-2.5 px-4 w-72">Skill Title</th>
                <th className="py-2.5 px-4 w-60">Parent Competency</th>
                <th className="py-2.5 px-4">Definition &amp; Standards</th>
                <th className="py-2.5 px-3 text-center w-32">Ideal Level</th>
                <th className="py-2.5 px-3 text-center w-16">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredSkills.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-slate-500">
                    <p className="font-semibold text-sm">No skills found</p>
                    <p className="text-xs text-slate-400 mt-1">Try adjusting your search query or filters.</p>
                  </td>
                </tr>
              ) : (
                filteredSkills.map((row, idx) => (
                  <tr key={row.skillId} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3.5 text-center text-slate-400 font-mono text-[11px]">
                      {idx + 1}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-800 text-xs">{row.skillName}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span
                          className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded uppercase ${
                            row.category === 'Functional'
                              ? 'bg-sky-100 text-[#0275a8]'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {row.category}
                        </span>
                      </div>
                      <span className="font-semibold text-slate-700 text-[11px] block truncate">
                        {row.competencyName}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-slate-600 leading-relaxed text-[11px]">
                        {row.definition}
                      </p>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className="inline-block bg-[#1a5075] text-white font-bold px-2 py-0.5 rounded text-[11px]">
                        {getLevelLabel(row.defaultProficiency)}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      {onDeleteSkill && (
                        <button
                          type="button"
                          onClick={() => {
                            setDeleteConfirmSkill({ compId: row.competencyId, skillId: row.skillId, name: row.skillName });
                          }}
                          className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD SKILL MODAL POPUP */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-[#1a5075] text-white px-5 py-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-sky-300" />
                <h3 className="font-bold text-sm sm:text-base">Add New Skill</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-white/80 hover:text-white p-1 rounded hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSkill} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Parent Competency <span className="text-red-500">*</span>
                </label>
                <select
                  value={targetCompId}
                  onChange={(e) => setTargetCompId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md text-xs text-slate-800 focus:bg-white focus:outline-hidden focus:border-[#0275a8]"
                >
                  {competencies.map((c) => (
                    <option key={c.id} value={c.id}>
                      [{c.category}] {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Skill Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newSkillName}
                  onChange={(e) => setNewSkillName(e.target.value)}
                  placeholder="e.g. Advanced Sector Conflict Resolution &amp; Recovery"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md text-xs text-slate-800 focus:bg-white focus:outline-hidden focus:border-[#0275a8]"
                />
                {formErrors.skillName && <span className="text-[10px] text-red-500 mt-0.5 block">{formErrors.skillName}</span>}
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Skill Definition / Behavioral Criterion <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={2}
                  value={newSkillDefinition}
                  onChange={(e) => setNewSkillDefinition(e.target.value)}
                  placeholder="Detailed criteria defining proficiency expectations..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md text-xs text-slate-800 focus:bg-white focus:outline-hidden focus:border-[#0275a8]"
                />
                {formErrors.skillDefinition && <span className="text-[10px] text-red-500 mt-0.5 block">{formErrors.skillDefinition}</span>}
              </div>

              <div className="pt-2 border-t border-slate-100">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Default Ideal Proficiency</label>
                  <select
                    value={targetProficiency}
                    onChange={(e) => setTargetProficiency(parseInt(e.target.value, 10))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md text-xs text-slate-800 focus:bg-white focus:outline-hidden focus:border-[#0275a8]"
                  >
                    <option value={1}>Foundation</option>
                    <option value={2}>Intermediate</option>
                    <option value={3}>Proficient</option>
                    <option value={4}>Expert</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0275a8] hover:bg-[#02628d] text-white font-bold rounded-lg shadow-sm transition-all cursor-pointer active:scale-95 flex items-center gap-1.5"
                >
                  <span>Save</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmSkill && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 p-5 space-y-4">
            <p className="text-sm text-slate-700 leading-relaxed font-medium">
              Are you sure you want to delete <strong className="text-slate-900 font-bold">{deleteConfirmSkill.name}</strong>? This action cannot be undone.
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setDeleteConfirmSkill(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-xs transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (onDeleteSkill && deleteConfirmSkill) {
                    onDeleteSkill(deleteConfirmSkill.compId, deleteConfirmSkill.skillId);
                  }
                  setDeleteConfirmSkill(null);
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
    </div>
  );
};
