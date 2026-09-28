import React, { useState, useMemo, useEffect } from 'react';
import {
  Building2,
  Plus,
  Pencil,
  Trash2,
  Search,
  X,
  CheckCircle2
} from 'lucide-react';

export type DepartmentEntity = 'GANS' | 'Eshara' | 'YHA';

export interface DepartmentRecord {
  id: string;
  name: string;
  entity: DepartmentEntity;
}

const INITIAL_GANS_DEPARTMENTS: DepartmentRecord[] = [
  { id: 'dept-gans-001', name: 'Air Traffic Management', entity: 'GANS' },
  { id: 'dept-gans-002', name: 'CNS Systems Engineering', entity: 'GANS' },
  { id: 'dept-gans-003', name: 'Aeronautical Meteorology', entity: 'GANS' },
  { id: 'dept-gans-004', name: 'Aviation Safety & Quality', entity: 'GANS' },
  { id: 'dept-gans-005', name: 'Human Resources', entity: 'GANS' },
  { id: 'dept-gans-006', name: 'Finance & Accounts', entity: 'GANS' },
  { id: 'dept-gans-007', name: 'IT Infrastructure', entity: 'GANS' },
  { id: 'dept-gans-008', name: 'Legal & Regulatory', entity: 'GANS' }
];

const INITIAL_ESHARA_DEPARTMENTS: DepartmentRecord[] = [
  { id: 'dept-esh-001', name: 'En-Route Air Traffic Operations', entity: 'Eshara' },
  { id: 'dept-esh-002', name: 'Terminal Control & Aerodromes', entity: 'Eshara' },
  { id: 'dept-esh-003', name: 'Navigation & Surveillance Engineering', entity: 'Eshara' },
  { id: 'dept-esh-004', name: 'Operational Safety Assurance', entity: 'Eshara' },
  { id: 'dept-esh-005', name: 'Training Academy', entity: 'Eshara' }
];

const INITIAL_YHA_DEPARTMENTS: DepartmentRecord[] = [
  { id: 'dept-yha-001', name: 'Aviation Advisory & Strategy', entity: 'YHA' },
  { id: 'dept-yha-002', name: 'Airspace Engineering', entity: 'YHA' },
  { id: 'dept-yha-003', name: 'Regulatory Compliance', entity: 'YHA' },
  { id: 'dept-yha-004', name: 'Sustainability Solutions', entity: 'YHA' }
];

interface HrDepartmentMasterViewProps {
  onNavigateToEmployeeMaster?: () => void;
  onNavigateToCompetencies?: () => void;
}

export const HrDepartmentMasterView: React.FC<HrDepartmentMasterViewProps> = () => {
  // Entity filter on the right side (replacing the tab design)
  const [entityFilter, setEntityFilter] = useState<'All' | DepartmentEntity>('All');

  // Search
  const [searchQuery, setSearchQuery] = useState('');

  // Notification Toast
  const [actionToast, setActionToast] = useState<{ message: string; type: 'success' | 'info' } | null>(null);

  // Departments State
  const [esharaDepartments, setEsharaDepartments] = useState<DepartmentRecord[]>(() => {
    try {
      const saved = localStorage.getItem('eshara_departments_master_v1');
      return saved ? JSON.parse(saved) : INITIAL_ESHARA_DEPARTMENTS;
    } catch {
      return INITIAL_ESHARA_DEPARTMENTS;
    }
  });

  const [yhaDepartments, setYhaDepartments] = useState<DepartmentRecord[]>(() => {
    try {
      const saved = localStorage.getItem('yha_departments_master_v1');
      return saved ? JSON.parse(saved) : INITIAL_YHA_DEPARTMENTS;
    } catch {
      return INITIAL_YHA_DEPARTMENTS;
    }
  });

  const gansDepartments = INITIAL_GANS_DEPARTMENTS;

  // Persist changes
  useEffect(() => {
    try {
      localStorage.setItem('eshara_departments_master_v1', JSON.stringify(esharaDepartments));
    } catch (e) {
      console.error(e);
    }
  }, [esharaDepartments]);

  useEffect(() => {
    try {
      localStorage.setItem('yha_departments_master_v1', JSON.stringify(yhaDepartments));
    } catch (e) {
      console.error(e);
    }
  }, [yhaDepartments]);

  // Combined departments based on filter
  const allDepartments = useMemo(() => {
    return [...gansDepartments, ...esharaDepartments, ...yhaDepartments];
  }, [gansDepartments, esharaDepartments, yhaDepartments]);

  // Filtered departments
  const filteredDepartments = useMemo(() => {
    return allDepartments.filter((dept) => {
      const matchesEntity = entityFilter === 'All' || dept.entity === entityFilter;
      const matchesSearch =
        !searchQuery.trim() ||
        dept.name.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
        dept.entity.toLowerCase().includes(searchQuery.toLowerCase().trim());

      return matchesEntity && matchesSearch;
    });
  }, [allDepartments, entityFilter, searchQuery]);

  // Modal State (Add / Edit) - GANS is read-only
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [formMode, setFormMode] = useState<'add' | 'edit'>('add');
  const [editingDeptId, setEditingDeptId] = useState<string | null>(null);

  // Form Fields
  const [formName, setFormName] = useState('');
  const [formEntity, setFormEntity] = useState<'Eshara' | 'YHA'>('Eshara');
  const [formError, setFormError] = useState('');

  // Delete Confirmation State
  const [deleteConfirmDept, setDeleteConfirmDept] = useState<DepartmentRecord | null>(null);

  // Open Add
  const handleOpenAdd = () => {
    setFormMode('add');
    setEditingDeptId(null);
    setFormName('');
    setFormEntity(entityFilter === 'YHA' ? 'YHA' : 'Eshara');
    setFormError('');
    setIsFormModalOpen(true);
  };

  // Open Edit
  const handleOpenEdit = (dept: DepartmentRecord) => {
    if (dept.entity === 'GANS') return; // GANS is not editable

    setFormMode('edit');
    setEditingDeptId(dept.id);
    setFormName(dept.name);
    setFormEntity(dept.entity === 'YHA' ? 'YHA' : 'Eshara');
    setFormError('');
    setIsFormModalOpen(true);
  };

  // Save Add / Edit
  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formName.trim()) {
      setFormError('Department name is required');
      return;
    }

    if (formMode === 'add') {
      const newDept: DepartmentRecord = {
        id: `dept-${formEntity.toLowerCase()}-${Date.now()}`,
        name: formName.trim(),
        entity: formEntity
      };

      if (formEntity === 'Eshara') {
        setEsharaDepartments((prev) => [...prev, newDept]);
      } else {
        setYhaDepartments((prev) => [...prev, newDept]);
      }

      setActionToast({ message: `Department added successfully to ${formEntity}.`, type: 'success' });
    } else {
      // Editing existing department
      if (formEntity === 'Eshara') {
        // If originally in YHA, move to Eshara
        setYhaDepartments((prev) => prev.filter((d) => d.id !== editingDeptId));
        setEsharaDepartments((prev) => {
          const exists = prev.some((d) => d.id === editingDeptId);
          if (exists) {
            return prev.map((d) => (d.id === editingDeptId ? { ...d, name: formName.trim() } : d));
          } else {
            return [...prev, { id: editingDeptId!, name: formName.trim(), entity: 'Eshara' }];
          }
        });
      } else {
        // If originally in Eshara, move to YHA
        setEsharaDepartments((prev) => prev.filter((d) => d.id !== editingDeptId));
        setYhaDepartments((prev) => {
          const exists = prev.some((d) => d.id === editingDeptId);
          if (exists) {
            return prev.map((d) => (d.id === editingDeptId ? { ...d, name: formName.trim() } : d));
          } else {
            return [...prev, { id: editingDeptId!, name: formName.trim(), entity: 'YHA' }];
          }
        });
      }

      setActionToast({ message: 'Department updated successfully.', type: 'success' });
    }

    setTimeout(() => setActionToast(null), 3000);
    setIsFormModalOpen(false);
  };

  // Confirm Delete
  const handleConfirmDelete = () => {
    if (!deleteConfirmDept || deleteConfirmDept.entity === 'GANS') return;
    const deptToDelete = deleteConfirmDept;

    if (deptToDelete.entity === 'Eshara') {
      setEsharaDepartments((prev) => prev.filter((d) => d.id !== deptToDelete.id));
    } else if (deptToDelete.entity === 'YHA') {
      setYhaDepartments((prev) => prev.filter((d) => d.id !== deptToDelete.id));
    }

    setActionToast({ message: 'Department removed successfully.', type: 'info' });
    setTimeout(() => setActionToast(null), 3000);
    setDeleteConfirmDept(null);
  };

  return (
    <div id="department-master-container" className="space-y-6 pb-16 animate-in fade-in duration-200">
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
            <Building2 className="w-6 h-6 text-sky-300" />
            <span>Department Master</span>
          </h1>
        </div>

        {/* Right side controls: Entity Filter + Add Department Button */}
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

          {/* Add Department Button */}
          <button
            type="button"
            onClick={handleOpenAdd}
            className="px-4 py-2 bg-gradient-to-r from-[#0275a8] to-sky-600 hover:from-[#02628d] hover:to-sky-500 text-white font-bold text-xs rounded-lg flex items-center gap-1.5 shadow-sm transition-all cursor-pointer active:scale-95 border border-sky-400/40"
          >
            <Plus className="w-4 h-4" />
            <span>Add Department</span>
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
            placeholder="Search departments..."
            className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-[#0275a8]/20 focus:border-[#0275a8]"
          />
        </div>
      </div>

      {/* Departments Table: Department Name | Entity | Action */}
      <div className="rounded-xl bg-white border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-700 font-extrabold border-b border-slate-200 uppercase text-[11px]">
              <tr>
                <th className="py-3 px-4">Department Name</th>
                <th className="py-3 px-4 w-36">Entity</th>
                <th className="py-3 px-4 text-center w-28">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredDepartments.length === 0 ? (
                <tr>
                  <td colSpan={3} className="py-12 text-center text-slate-400">
                    No departments found
                  </td>
                </tr>
              ) : (
                filteredDepartments.map((dept) => {
                  const isGans = dept.entity === 'GANS';

                  return (
                    <tr key={dept.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-bold text-slate-900">{dept.name}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`text-[10px] font-black px-2.5 py-0.5 rounded-full inline-block ${
                            dept.entity === 'GANS'
                              ? 'bg-sky-50 text-[#0275a8] border border-sky-200'
                              : dept.entity === 'Eshara'
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : 'bg-amber-50 text-amber-800 border border-amber-200'
                          }`}
                        >
                          {dept.entity}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        {isGans ? (
                          <span
                            className="text-slate-300 text-xs font-bold select-none cursor-default"
                            title="GANS departments are system synced and not editable"
                          >
                            —
                          </span>
                        ) : (
                          <div className="flex items-center justify-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleOpenEdit(dept)}
                              className="p-1.5 text-slate-500 hover:text-[#0275a8] hover:bg-sky-50 rounded-lg cursor-pointer"
                              title="Edit"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeleteConfirmDept(dept)}
                              className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal (for Eshara and YHA) */}
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
                {formMode === 'add' ? 'Add Department' : 'Edit Department'}
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
                  <option value="Eshara">Eshara</option>
                  <option value="YHA">YHA</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Department Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => {
                    setFormName(e.target.value);
                    if (formError) setFormError('');
                  }}
                  placeholder="Enter department name..."
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
                  {formMode === 'add' ? 'Add Department' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmDept && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4 backdrop-blur-xs"
          onClick={() => setDeleteConfirmDept(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-slate-200 space-y-4 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-1">
              <h3 className="font-bold text-slate-900 text-sm">Remove Department</h3>
              <p className="text-xs text-slate-600">
                Are you sure you want to remove <strong>{deleteConfirmDept.name}</strong> ({deleteConfirmDept.entity})?
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmDept(null)}
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
