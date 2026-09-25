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
  // Three tabs at the top: GANS (synced from DB, read-only), Eshara, YHA
  const [activeEntity, setActiveEntity] = useState<DepartmentEntity>('GANS');

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

  // Modal State (Add / Edit) - only for Eshara & YHA
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [formMode, setFormMode] = useState<'add' | 'edit'>('add');
  const [editingDeptId, setEditingDeptId] = useState<string | null>(null);

  // Form Field: Department Name
  const [formName, setFormName] = useState('');
  const [formError, setFormError] = useState('');

  // Delete Confirmation State
  const [deleteConfirmDept, setDeleteConfirmDept] = useState<DepartmentRecord | null>(null);

  // Current entity departments
  const currentEntityDepartments = useMemo(() => {
    if (activeEntity === 'GANS') return gansDepartments;
    if (activeEntity === 'Eshara') return esharaDepartments;
    return yhaDepartments;
  }, [activeEntity, gansDepartments, esharaDepartments, yhaDepartments]);

  // Filtered departments
  const filteredDepartments = useMemo(() => {
    return currentEntityDepartments.filter((dept) => {
      if (!searchQuery.trim()) return true;
      return dept.name.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [currentEntityDepartments, searchQuery]);

  // Open Add
  const handleOpenAdd = () => {
    if (activeEntity === 'GANS') return;

    setFormMode('add');
    setEditingDeptId(null);
    setFormName('');
    setFormError('');
    setIsFormModalOpen(true);
  };

  // Open Edit
  const handleOpenEdit = (dept: DepartmentRecord) => {
    if (activeEntity === 'GANS') return;

    setFormMode('edit');
    setEditingDeptId(dept.id);
    setFormName(dept.name);
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
        id: `dept-${activeEntity.toLowerCase()}-${Date.now()}`,
        name: formName.trim(),
        entity: activeEntity
      };

      if (activeEntity === 'Eshara') {
        setEsharaDepartments((prev) => [...prev, newDept]);
      } else {
        setYhaDepartments((prev) => [...prev, newDept]);
      }

      setActionToast({ message: 'Department added successfully.', type: 'success' });
    } else {
      const updater = (prev: DepartmentRecord[]) =>
        prev.map((d) =>
          d.id === editingDeptId
            ? { ...d, name: formName.trim() }
            : d
        );

      if (activeEntity === 'Eshara') {
        setEsharaDepartments(updater);
      } else {
        setYhaDepartments(updater);
      }

      setActionToast({ message: 'Department updated successfully.', type: 'success' });
    }

    setTimeout(() => setActionToast(null), 3000);
    setIsFormModalOpen(false);
  };

  // Confirm Delete
  const handleConfirmDelete = () => {
    if (!deleteConfirmDept) return;
    const deptToDelete = deleteConfirmDept;

    if (activeEntity === 'Eshara') {
      setEsharaDepartments((prev) => prev.filter((d) => d.id !== deptToDelete.id));
    } else if (activeEntity === 'YHA') {
      setYhaDepartments((prev) => prev.filter((d) => d.id !== deptToDelete.id));
    }

    setActionToast({ message: 'Department removed successfully.', type: 'info' });
    setTimeout(() => setActionToast(null), 3000);
    setDeleteConfirmDept(null);
  };

  return (
    <div id="department-master-container" className="space-y-6 pb-16">
      {/* Toast Notification */}
      {actionToast && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg bg-[#1a5075] text-white text-xs font-bold">
          <CheckCircle2 className="w-4 h-4 text-sky-300" />
          <span>{actionToast.message}</span>
          <button type="button" onClick={() => setActionToast(null)} className="ml-2 hover:bg-white/20 p-1 rounded cursor-pointer">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-[#1a5075] text-white">
            <Building2 className="w-5 h-5" />
          </div>
          <span>Department Master</span>
        </h1>

        {/* Add Department button for Eshara and YHA */}
        {activeEntity !== 'GANS' && (
          <button
            type="button"
            onClick={handleOpenAdd}
            className="px-4 py-2.5 bg-gradient-to-r from-[#1a5075] to-[#0275a8] hover:from-[#154668] hover:to-[#02628d] text-white text-xs font-bold rounded-xl shadow-sm flex items-center gap-2 cursor-pointer transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add Department</span>
          </button>
        )}
      </div>

      {/* Three tabs at the top representing the three entities: GANS, Eshara, and YHA */}
      <div className="flex border-b border-slate-200">
        {(['GANS', 'Eshara', 'YHA'] as DepartmentEntity[]).map((entity) => (
          <button
            key={entity}
            type="button"
            onClick={() => setActiveEntity(entity)}
            className={`px-6 py-3 font-bold text-sm cursor-pointer transition-colors border-b-2 -mb-px ${
              activeEntity === entity
                ? 'border-[#0275a8] text-[#0275a8]'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            {entity}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search..."
            className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-[#0275a8]/20 focus:border-[#0275a8]"
          />
        </div>
      </div>

      {/* Departments Table:
          For GANS: Only the Department name should be shown (no other columns needed, synced from DB)
          For others (Eshara and YHA): Only Department Name and Action (in that also just Edit and Delete) */}
      <div className="rounded-xl bg-white border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-700 font-extrabold border-b border-slate-200 uppercase text-[11px]">
              <tr>
                <th className="py-3 px-4">Department Name</th>
                {activeEntity !== 'GANS' && (
                  <th className="py-3 px-4 text-center w-28">Action</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredDepartments.length === 0 ? (
                <tr>
                  <td
                    colSpan={activeEntity === 'GANS' ? 1 : 2}
                    className="py-12 text-center text-slate-400"
                  >
                    No departments found
                  </td>
                </tr>
              ) : (
                filteredDepartments.map((dept) => (
                  <tr key={dept.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900">{dept.name}</td>
                    {activeEntity !== 'GANS' && (
                      <td className="py-3 px-4 text-center">
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
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal (for Eshara and YHA) */}
      {isFormModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4"
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
          className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4"
          onClick={() => setDeleteConfirmDept(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-slate-200 space-y-4 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-1">
              <h3 className="font-bold text-slate-900 text-sm">Remove Department</h3>
              <p className="text-xs text-slate-600">
                Are you sure you want to remove <strong>{deleteConfirmDept.name}</strong>?
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
