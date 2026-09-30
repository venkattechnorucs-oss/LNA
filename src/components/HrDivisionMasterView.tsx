import React, { useState, useMemo, useEffect } from 'react';
import {
  GitBranch,
  Plus,
  Pencil,
  Trash2,
  Search,
  X,
  CheckCircle2
} from 'lucide-react';

export type DivisionEntity = 'GANS' | 'Eshara' | 'YHA';

export interface DivisionRecord {
  id: string;
  name: string;
  entity: DivisionEntity;
}

const INITIAL_GANS_DIVISIONS: DivisionRecord[] = [
  { id: 'div-gans-001', name: 'Air Traffic Management (ATM)', entity: 'GANS' },
  { id: 'div-gans-002', name: 'Technical Services & Engineering', entity: 'GANS' },
  { id: 'div-gans-003', name: 'Safety, Security & Quality Assurance', entity: 'GANS' },
  { id: 'div-gans-004', name: 'Corporate Support & Administration', entity: 'GANS' },
  { id: 'div-gans-005', name: 'Strategy & Commercial Services', entity: 'GANS' }
];

const INITIAL_ESHARA_DIVISIONS: DivisionRecord[] = [
  { id: 'div-esh-001', name: 'Terminal & Aerodrome Operations', entity: 'Eshara' },
  { id: 'div-esh-002', name: 'Aviation Engineering & Navigation', entity: 'Eshara' },
  { id: 'div-esh-003', name: 'Operational Safety & Compliance', entity: 'Eshara' }
];

const INITIAL_YHA_DIVISIONS: DivisionRecord[] = [
  { id: 'div-yha-001', name: 'Aviation Advisory & Strategy', entity: 'YHA' },
  { id: 'div-yha-002', name: 'Airspace Solutions & Innovation', entity: 'YHA' }
];

export const HrDivisionMasterView: React.FC = () => {
  // Entity filter on the right side
  const [entityFilter, setEntityFilter] = useState<'All' | DivisionEntity>('All');

  // Search
  const [searchQuery, setSearchQuery] = useState('');

  // Notification Toast
  const [actionToast, setActionToast] = useState<{ message: string; type: 'success' | 'info' } | null>(null);

  // Divisions State
  const [divisions, setDivisions] = useState<DivisionRecord[]>(() => {
    try {
      const saved = localStorage.getItem('gans_divisions_master_v1');
      return saved
        ? JSON.parse(saved)
        : [...INITIAL_GANS_DIVISIONS, ...INITIAL_ESHARA_DIVISIONS, ...INITIAL_YHA_DIVISIONS];
    } catch {
      return [...INITIAL_GANS_DIVISIONS, ...INITIAL_ESHARA_DIVISIONS, ...INITIAL_YHA_DIVISIONS];
    }
  });

  // Persist changes
  useEffect(() => {
    try {
      localStorage.setItem('gans_divisions_master_v1', JSON.stringify(divisions));
    } catch (e) {
      console.error(e);
    }
  }, [divisions]);

  // Filtered divisions
  const filteredDivisions = useMemo(() => {
    return divisions.filter((div) => {
      const matchesEntity = entityFilter === 'All' || div.entity === entityFilter;
      const matchesSearch =
        !searchQuery.trim() ||
        div.name.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
        div.entity.toLowerCase().includes(searchQuery.toLowerCase().trim());

      return matchesEntity && matchesSearch;
    });
  }, [divisions, entityFilter, searchQuery]);

  // Modal State (Add / Edit)
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [formMode, setFormMode] = useState<'add' | 'edit'>('add');
  const [editingDivId, setEditingDivId] = useState<string | null>(null);

  // Form Fields
  const [formName, setFormName] = useState('');
  const [formEntity, setFormEntity] = useState<DivisionEntity>('GANS');
  const [formError, setFormError] = useState('');

  // Delete Confirmation State
  const [deleteConfirmDiv, setDeleteConfirmDiv] = useState<DivisionRecord | null>(null);

  // Open Add
  const handleOpenAdd = () => {
    setFormMode('add');
    setEditingDivId(null);
    setFormName('');
    setFormEntity(entityFilter === 'All' ? 'GANS' : entityFilter);
    setFormError('');
    setIsFormModalOpen(true);
  };

  // Open Edit
  const handleOpenEdit = (div: DivisionRecord) => {
    setFormMode('edit');
    setEditingDivId(div.id);
    setFormName(div.name);
    setFormEntity(div.entity);
    setFormError('');
    setIsFormModalOpen(true);
  };

  // Save Add / Edit
  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formName.trim()) {
      setFormError('Division name is required');
      return;
    }

    if (formMode === 'add') {
      const newDiv: DivisionRecord = {
        id: `div-${formEntity.toLowerCase()}-${Date.now()}`,
        name: formName.trim(),
        entity: formEntity
      };

      setDivisions((prev) => [...prev, newDiv]);
      setActionToast({ message: `Division added successfully to ${formEntity}.`, type: 'success' });
    } else {
      setDivisions((prev) =>
        prev.map((d) =>
          d.id === editingDivId ? { ...d, name: formName.trim(), entity: formEntity } : d
        )
      );
      setActionToast({ message: 'Division updated successfully.', type: 'success' });
    }

    setTimeout(() => setActionToast(null), 3000);
    setIsFormModalOpen(false);
  };

  // Confirm Delete
  const handleConfirmDelete = () => {
    if (!deleteConfirmDiv) return;
    setDivisions((prev) => prev.filter((d) => d.id !== deleteConfirmDiv.id));
    setActionToast({ message: 'Division removed successfully.', type: 'info' });
    setTimeout(() => setActionToast(null), 3000);
    setDeleteConfirmDiv(null);
  };

  return (
    <div id="division-master-container" className="space-y-6 pb-16 animate-in fade-in duration-200">
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
            <GitBranch className="w-6 h-6 text-sky-300" />
            <span>Division Master</span>
          </h1>
        </div>

        {/* Right side controls: Entity Filter + Add Division Button */}
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

          {/* Add Division Button */}
          <button
            type="button"
            onClick={handleOpenAdd}
            className="px-4 py-2 bg-gradient-to-r from-[#0275a8] to-sky-600 hover:from-[#02628d] hover:to-sky-500 text-white font-bold text-xs rounded-lg flex items-center gap-1.5 shadow-sm transition-all cursor-pointer active:scale-95 border border-sky-400/40"
          >
            <Plus className="w-4 h-4" />
            <span>Add</span>
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
            placeholder="Search divisions..."
            className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-[#0275a8]/20 focus:border-[#0275a8]"
          />
        </div>
      </div>

      {/* Divisions Table: Division Name | Entity | Action */}
      <div className="rounded-xl bg-white border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-700 font-extrabold border-b border-slate-200 uppercase text-[11px]">
              <tr>
                <th className="py-3 px-4">Division Name</th>
                <th className="py-3 px-4 w-36">Entity</th>
                <th className="py-3 px-4 text-center w-28">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredDivisions.length === 0 ? (
                <tr>
                  <td colSpan={3} className="py-12 text-center text-slate-400">
                    No divisions found
                  </td>
                </tr>
              ) : (
                filteredDivisions.map((div) => (
                  <tr key={div.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900">{div.name}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`text-[10px] font-black px-2.5 py-0.5 rounded-full inline-block ${
                          div.entity === 'GANS'
                            ? 'bg-sky-50 text-[#0275a8] border border-sky-200'
                            : div.entity === 'Eshara'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : 'bg-amber-50 text-amber-800 border border-amber-200'
                        }`}
                      >
                        {div.entity}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(div)}
                          className="p-1.5 text-slate-500 hover:text-[#0275a8] hover:bg-sky-50 rounded-lg cursor-pointer"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteConfirmDiv(div)}
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
                {formMode === 'add' ? 'Add' : 'Edit Division'}
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
                  Division Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => {
                    setFormName(e.target.value);
                    if (formError) setFormError('');
                  }}
                  placeholder="Enter division name..."
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
                  {formMode === 'add' ? 'Add' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmDiv && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4 backdrop-blur-xs"
          onClick={() => setDeleteConfirmDiv(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-slate-200 space-y-4 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-1">
              <h3 className="font-bold text-slate-900 text-sm">Remove Division</h3>
              <p className="text-xs text-slate-600">
                Are you sure you want to remove <strong>{deleteConfirmDiv.name}</strong> ({deleteConfirmDiv.entity})?
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmDiv(null)}
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
