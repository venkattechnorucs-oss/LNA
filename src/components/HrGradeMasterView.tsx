import React, { useState, useMemo, useEffect } from 'react';
import {
  Award,
  Plus,
  Pencil,
  Trash2,
  Search,
  X,
  CheckCircle2
} from 'lucide-react';

export type GradeEntity = 'GANS' | 'Eshara' | 'YHA';

export interface GradeRecord {
  id: string;
  name: string;
  entity: GradeEntity;
}

const INITIAL_GANS_GRADES: GradeRecord[] = [
  { id: 'grd-gans-001', name: 'Grade 1 - Executive Leadership', entity: 'GANS' },
  { id: 'grd-gans-002', name: 'Grade 2 - Senior Management', entity: 'GANS' },
  { id: 'grd-gans-003', name: 'Grade 3 - Management / Lead Specialist', entity: 'GANS' },
  { id: 'grd-gans-004', name: 'Grade 4 - Senior Professional / Supervisor', entity: 'GANS' },
  { id: 'grd-gans-005', name: 'Grade 5 - Professional / Specialist', entity: 'GANS' },
  { id: 'grd-gans-006', name: 'Grade 6 - Associate / Officer', entity: 'GANS' },
  { id: 'grd-gans-007', name: 'Grade 7 - Entry Level / Junior', entity: 'GANS' }
];

const INITIAL_ESHARA_GRADES: GradeRecord[] = [
  { id: 'grd-esh-001', name: 'Grade E-1 - Director', entity: 'Eshara' },
  { id: 'grd-esh-002', name: 'Grade E-2 - Operations Manager', entity: 'Eshara' },
  { id: 'grd-esh-003', name: 'Grade E-3 - Senior Specialist', entity: 'Eshara' },
  { id: 'grd-esh-004', name: 'Grade E-4 - Specialist', entity: 'Eshara' },
  { id: 'grd-esh-005', name: 'Grade E-5 - Assistant Officer', entity: 'Eshara' }
];

const INITIAL_YHA_GRADES: GradeRecord[] = [
  { id: 'grd-yha-001', name: 'Grade Y-1 - Executive Partner', entity: 'YHA' },
  { id: 'grd-yha-002', name: 'Grade Y-2 - Senior Consultant', entity: 'YHA' },
  { id: 'grd-yha-003', name: 'Grade Y-3 - Consultant', entity: 'YHA' },
  { id: 'grd-yha-004', name: 'Grade Y-4 - Analyst', entity: 'YHA' }
];

export const HrGradeMasterView: React.FC = () => {
  // Entity filter on the right side
  const [entityFilter, setEntityFilter] = useState<'All' | GradeEntity>('All');

  // Search
  const [searchQuery, setSearchQuery] = useState('');

  // Notification Toast
  const [actionToast, setActionToast] = useState<{ message: string; type: 'success' | 'info' } | null>(null);

  // Grades State
  const [grades, setGrades] = useState<GradeRecord[]>(() => {
    try {
      const saved = localStorage.getItem('gans_grades_master_v1');
      return saved
        ? JSON.parse(saved)
        : [...INITIAL_GANS_GRADES, ...INITIAL_ESHARA_GRADES, ...INITIAL_YHA_GRADES];
    } catch {
      return [...INITIAL_GANS_GRADES, ...INITIAL_ESHARA_GRADES, ...INITIAL_YHA_GRADES];
    }
  });

  // Persist changes
  useEffect(() => {
    try {
      localStorage.setItem('gans_grades_master_v1', JSON.stringify(grades));
    } catch (e) {
      console.error(e);
    }
  }, [grades]);

  // Filtered grades
  const filteredGrades = useMemo(() => {
    return grades.filter((grd) => {
      const matchesEntity = entityFilter === 'All' || grd.entity === entityFilter;
      const matchesSearch =
        !searchQuery.trim() ||
        grd.name.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
        grd.entity.toLowerCase().includes(searchQuery.toLowerCase().trim());

      return matchesEntity && matchesSearch;
    });
  }, [grades, entityFilter, searchQuery]);

  // Modal State (Add / Edit)
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [formMode, setFormMode] = useState<'add' | 'edit'>('add');
  const [editingGradeId, setEditingGradeId] = useState<string | null>(null);

  // Form Fields
  const [formName, setFormName] = useState('');
  const [formEntity, setFormEntity] = useState<GradeEntity>('GANS');
  const [formError, setFormError] = useState('');

  // Delete Confirmation State
  const [deleteConfirmGrade, setDeleteConfirmGrade] = useState<GradeRecord | null>(null);

  // Open Add
  const handleOpenAdd = () => {
    setFormMode('add');
    setEditingGradeId(null);
    setFormName('');
    setFormEntity(entityFilter === 'All' ? 'GANS' : entityFilter);
    setFormError('');
    setIsFormModalOpen(true);
  };

  // Open Edit
  const handleOpenEdit = (grd: GradeRecord) => {
    setFormMode('edit');
    setEditingGradeId(grd.id);
    setFormName(grd.name);
    setFormEntity(grd.entity);
    setFormError('');
    setIsFormModalOpen(true);
  };

  // Save Add / Edit
  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formName.trim()) {
      setFormError('Grade name is required');
      return;
    }

    if (formMode === 'add') {
      const newGrade: GradeRecord = {
        id: `grd-${formEntity.toLowerCase()}-${Date.now()}`,
        name: formName.trim(),
        entity: formEntity
      };

      setGrades((prev) => [...prev, newGrade]);
      setActionToast({ message: `Grade added successfully to ${formEntity}.`, type: 'success' });
    } else {
      setGrades((prev) =>
        prev.map((g) =>
          g.id === editingGradeId ? { ...g, name: formName.trim(), entity: formEntity } : g
        )
      );
      setActionToast({ message: 'Grade updated successfully.', type: 'success' });
    }

    setTimeout(() => setActionToast(null), 3000);
    setIsFormModalOpen(false);
  };

  // Confirm Delete
  const handleConfirmDelete = () => {
    if (!deleteConfirmGrade) return;
    setGrades((prev) => prev.filter((g) => g.id !== deleteConfirmGrade.id));
    setActionToast({ message: 'Grade removed successfully.', type: 'info' });
    setTimeout(() => setActionToast(null), 3000);
    setDeleteConfirmGrade(null);
  };

  return (
    <div id="grade-master-container" className="space-y-6 pb-16 animate-in fade-in duration-200">
      {/* Toast Notification */}
      {actionToast && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg bg-[#1a5075] text-white text-xs font-bold animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-sky-300" />
          <span>{actionToast.message}</span>
          <button
            type="button"
            onClick={() => setActionToast(null)}
            className="ml-2 hover:bg-white/20 p-1 rounded cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#1a5075] via-[#154668] to-[#0d314a] rounded-xl p-5 text-white shadow-md border border-[#2b658f] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2.5">
            <Award className="w-6 h-6 text-sky-300" />
            <span>Grade Master</span>
          </h1>
        </div>

        {/* Right side controls: Entity Filter + Add Grade Button */}
        <div className="flex items-center gap-3 self-end sm:self-auto flex-wrap">
          {/* Entity Filter Dropdown */}
          <div className="flex items-center gap-2 bg-white/15 px-3 py-1.5 border border-white/20 rounded-xl shadow-2xs backdrop-blur-xs">
            <span className="text-xs font-bold text-sky-200">Entity:</span>
            <select
              value={entityFilter}
              onChange={(e) => setEntityFilter(e.target.value as any)}
              className="text-xs font-extrabold text-white bg-transparent focus:outline-hidden cursor-pointer"
            >
              <option value="All" className="text-slate-800">All Entities</option>
              <option value="GANS" className="text-slate-800">GANS</option>
              <option value="Eshara" className="text-slate-800">Eshara</option>
              <option value="YHA" className="text-slate-800">YHA</option>
            </select>
          </div>

          {/* Add Grade Button */}
          <button
            type="button"
            onClick={handleOpenAdd}
            className="px-4 py-2 bg-gradient-to-r from-[#0275a8] to-sky-600 hover:from-[#02628d] hover:to-sky-500 text-white font-bold text-xs rounded-lg flex items-center gap-1.5 shadow-sm transition-all cursor-pointer active:scale-95 border border-sky-400/40"
          >
            <Plus className="w-4 h-4" />
            <span>Add Grade</span>
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search grades..."
            className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-[#0275a8]/20 focus:border-[#0275a8]"
          />
        </div>
      </div>

      {/* Grades Table: Grade Name | Entity | Action */}
      <div className="rounded-xl bg-white border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-700 font-extrabold border-b border-slate-200 uppercase text-[11px]">
              <tr>
                <th className="py-3 px-4">Grade Name</th>
                <th className="py-3 px-4 w-36">Entity</th>
                <th className="py-3 px-4 text-center w-28">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredGrades.length === 0 ? (
                <tr>
                  <td colSpan={3} className="py-12 text-center text-slate-400">
                    No grades found
                  </td>
                </tr>
              ) : (
                filteredGrades.map((grd) => (
                  <tr key={grd.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900">{grd.name}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`text-[10px] font-black px-2.5 py-0.5 rounded-full inline-block ${
                          grd.entity === 'GANS'
                            ? 'bg-sky-50 text-[#0275a8] border border-sky-200'
                            : grd.entity === 'Eshara'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : 'bg-amber-50 text-amber-800 border border-amber-200'
                        }`}
                      >
                        {grd.entity}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(grd)}
                          className="p-1.5 text-slate-500 hover:text-[#0275a8] hover:bg-sky-50 rounded-lg cursor-pointer"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteConfirmGrade(grd)}
                          className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {isFormModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in"
          onClick={() => setIsFormModalOpen(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-black text-slate-900 text-base">
                {formMode === 'add' ? 'Add Grade' : 'Edit Grade'}
              </h3>
              <button
                type="button"
                onClick={() => setIsFormModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Entity <span className="text-red-500">*</span>
                </label>
                <select
                  value={formEntity}
                  onChange={(e) => setFormEntity(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-[#0275a8]/20 focus:border-[#0275a8]"
                >
                  <option value="GANS">GANS</option>
                  <option value="Eshara">Eshara</option>
                  <option value="YHA">YHA</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Grade Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => {
                    setFormName(e.target.value);
                    if (formError) setFormError('');
                  }}
                  placeholder="Enter grade name..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-[#0275a8]/20 focus:border-[#0275a8]"
                  autoFocus
                />
                {formError && <p className="text-[11px] text-red-600 mt-1 font-semibold">{formError}</p>}
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsFormModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-[#1a5075] to-[#0275a8] text-white font-bold rounded-xl cursor-pointer"
                >
                  {formMode === 'add' ? 'Add Grade' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmGrade && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4 backdrop-blur-xs"
          onClick={() => setDeleteConfirmGrade(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-slate-200 space-y-4 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-1">
              <h3 className="font-bold text-slate-900 text-sm">Remove Grade</h3>
              <p className="text-xs text-slate-600">
                Are you sure you want to remove <strong>{deleteConfirmGrade.name}</strong> ({deleteConfirmGrade.entity})?
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmGrade(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
