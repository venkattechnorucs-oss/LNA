import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  Building2,
  Network,
  X,
  CheckCircle2,
  Search,
  Pencil,
  Trash2,
  ChevronDown,
  Check
} from 'lucide-react';

export type FunctionalEntity = 'GANS' | 'Eshara' | 'YHA';

export interface FunctionalRecord {
  id: string;
  entity: FunctionalEntity;
  departments: string[];
  functional: string;
}

const INITIAL_FUNCTIONAL_RECORDS: FunctionalRecord[] = [
  // GANS (Central Database Entity)
  {
    id: 'fn-gans-1',
    entity: 'GANS',
    departments: ['Air Traffic Management', 'Aeronautical Meteorology'],
    functional: 'Air Operations'
  },
  {
    id: 'fn-gans-2',
    entity: 'GANS',
    departments: ['CNS Systems Engineering', 'IT Infrastructure'],
    functional: 'Engineering Services'
  },
  {
    id: 'fn-gans-3',
    entity: 'GANS',
    departments: ['Aviation Safety & Quality'],
    functional: 'Safety & Quality Assurance'
  },
  {
    id: 'fn-gans-4',
    entity: 'GANS',
    departments: ['Human Resources', 'Finance & Accounts', 'Legal & Regulatory'],
    functional: 'Corporate Administration'
  },

  // Eshara
  {
    id: 'fn-esh-1',
    entity: 'Eshara',
    departments: ['En-Route Air Traffic Operations', 'Terminal Control & Aerodromes'],
    functional: 'Air Traffic Management'
  },
  {
    id: 'fn-esh-2',
    entity: 'Eshara',
    departments: ['Navigation & Surveillance Engineering'],
    functional: 'CNS Systems'
  },
  {
    id: 'fn-esh-3',
    entity: 'Eshara',
    departments: ['Operational Safety Assurance'],
    functional: 'Aviation Safety'
  },
  {
    id: 'fn-esh-4',
    entity: 'Eshara',
    departments: ['Training Academy'],
    functional: 'Workforce Development'
  },

  // YHA
  {
    id: 'fn-yha-1',
    entity: 'YHA',
    departments: ['Aviation Advisory & Strategy'],
    functional: 'Aviation Consulting'
  },
  {
    id: 'fn-yha-2',
    entity: 'YHA',
    departments: ['Airspace Engineering'],
    functional: 'Airspace Optimization'
  },
  {
    id: 'fn-yha-3',
    entity: 'YHA',
    departments: ['Regulatory Compliance', 'Safety Oversight & Standards'],
    functional: 'Regulatory & Standards'
  },
  {
    id: 'fn-yha-4',
    entity: 'YHA',
    departments: ['Sustainability Solutions', 'Environmental Performance Management'],
    functional: 'Green Aviation'
  }
];

interface HrFunctionalMasterViewProps {
  onNavigateToCompetencies?: () => void;
}

export const HrFunctionalMasterView: React.FC<HrFunctionalMasterViewProps> = () => {
  // Option in the top to select the entities: GANS, Eshara, YHA
  const [activeEntity, setActiveEntity] = useState<FunctionalEntity>('GANS');

  // Master records state (persisted in localStorage)
  const [records, setRecords] = useState<FunctionalRecord[]>(() => {
    try {
      const saved = localStorage.getItem('functional_master_entity_records_v4');
      if (saved) return JSON.parse(saved);

      return INITIAL_FUNCTIONAL_RECORDS;
    } catch {
      return INITIAL_FUNCTIONAL_RECORDS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('functional_master_entity_records_v4', JSON.stringify(records));
    } catch (e) {
      console.error(e);
    }
  }, [records]);

  // Form input state: Department on left, Functional on right
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [functionalInput, setFunctionalInput] = useState('');
  const [editingRecordId, setEditingRecordId] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [actionToast, setActionToast] = useState<{ message: string; type: 'success' | 'info' } | null>(null);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');

  // Department multiselect dropdown open state
  const [isDeptDropdownOpen, setIsDeptDropdownOpen] = useState(false);
  const deptDropdownRef = useRef<HTMLDivElement>(null);

  // Delete confirmation state
  const [deleteConfirmRecord, setDeleteConfirmRecord] = useState<FunctionalRecord | null>(null);

  // Close dropdown when clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (deptDropdownRef.current && !deptDropdownRef.current.contains(event.target as Node)) {
        setIsDeptDropdownOpen(false);
      }
    };
    if (isDeptDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDeptDropdownOpen]);

  // Filter records by selected entity
  const entityRecords = useMemo(() => {
    return records.filter((r) => r.entity === activeEntity);
  }, [records, activeEntity]);

  // Available departments for the selected entity (from records + Department Master)
  const availableDepartments = useMemo(() => {
    const deptSet = new Set<string>();

    // Current records for this entity
    entityRecords.forEach((r) => {
      r.departments.forEach((d) => deptSet.add(d));
    });

    // Departments from Department Master if saved in localStorage
    try {
      if (activeEntity === 'Eshara') {
        const saved = localStorage.getItem('eshara_departments_master_v1');
        if (saved) {
          const list = JSON.parse(saved);
          list.forEach((d: { name: string }) => {
            if (d.name) deptSet.add(d.name);
          });
        }
      } else if (activeEntity === 'YHA') {
        const saved = localStorage.getItem('yha_departments_master_v1');
        if (saved) {
          const list = JSON.parse(saved);
          list.forEach((d: { name: string }) => {
            if (d.name) deptSet.add(d.name);
          });
        }
      } else if (activeEntity === 'GANS') {
        deptSet.add('Air Traffic Management');
        deptSet.add('CNS Systems Engineering');
        deptSet.add('Aeronautical Meteorology');
        deptSet.add('Aviation Safety & Quality');
        deptSet.add('Human Resources');
        deptSet.add('Finance & Accounts');
        deptSet.add('IT Infrastructure');
        deptSet.add('Legal & Regulatory');
      }
    } catch (e) {
      console.error(e);
    }

    selectedDepartments.forEach((d) => deptSet.add(d));

    return Array.from(deptSet).sort((a, b) => a.localeCompare(b));
  }, [entityRecords, activeEntity, selectedDepartments]);

  // Toggle department in multiselect
  const handleToggleDepartment = (dept: string) => {
    setSelectedDepartments((prev) => {
      const exists = prev.includes(dept);
      const next = exists ? prev.filter((d) => d !== dept) : [...prev, dept];
      if (errors.department && next.length > 0) {
        setErrors((errs) => ({ ...errs, department: '' }));
      }
      return next;
    });
  };

  // Filtered records based on search
  const filteredRecords = useMemo(() => {
    return entityRecords.filter((r) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      const matchFn = r.functional.toLowerCase().includes(q);
      const matchDept = r.departments.some((d) => d.toLowerCase().includes(q));
      return matchFn || matchDept;
    });
  }, [entityRecords, searchQuery]);

  const resetForm = () => {
    setSelectedDepartments([]);
    setFunctionalInput('');
    setEditingRecordId(null);
    setErrors({});
    setIsDeptDropdownOpen(false);
  };

  const handleEditRecord = (record: FunctionalRecord) => {
    setEditingRecordId(record.id);
    setSelectedDepartments([...record.departments]);
    setFunctionalInput(record.functional);
    setErrors({});
    setIsDeptDropdownOpen(false);

    const formCard = document.getElementById('functional-entry-form');
    if (formCard) {
      formCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleSave = () => {
    const newErrors: Record<string, string> = {};
    if (selectedDepartments.length === 0) {
      newErrors.department = 'At least one department is required';
    }
    if (!functionalInput.trim()) {
      newErrors.functional = 'Functional is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const trimmedFn = functionalInput.trim();

    if (editingRecordId) {
      setRecords((prev) =>
        prev.map((r) =>
          r.id === editingRecordId
            ? { ...r, departments: [...selectedDepartments], functional: trimmedFn }
            : r
        )
      );
      setActionToast({ message: 'Record updated successfully.', type: 'success' });
    } else {
      const newRecord: FunctionalRecord = {
        id: `fn-${activeEntity.toLowerCase()}-${Date.now()}`,
        entity: activeEntity,
        departments: [...selectedDepartments],
        functional: trimmedFn
      };
      setRecords((prev) => [...prev, newRecord]);
      setActionToast({ message: 'Record saved successfully.', type: 'success' });
    }

    setTimeout(() => setActionToast(null), 3000);
    resetForm();
  };

  const handleConfirmDelete = () => {
    if (!deleteConfirmRecord) return;
    const toDelete = deleteConfirmRecord;
    setRecords((prev) => prev.filter((r) => r.id !== toDelete.id));
    setActionToast({ message: 'Record removed successfully.', type: 'info' });
    setTimeout(() => setActionToast(null), 3000);
    setDeleteConfirmRecord(null);
    if (editingRecordId === toDelete.id) {
      resetForm();
    }
  };

  return (
    <div id="functional-master-container" className="space-y-6 pb-16">
      {/* Toast Notification */}
      {actionToast && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg bg-[#1a5075] text-white text-xs font-bold">
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

      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-[#1a5075] text-white">
            <Network className="w-5 h-5" />
          </div>
          <span>Functional Master</span>
        </h1>
      </div>

      {/* Top option to select the entities: GANS, Eshara, YHA */}
      <div className="flex border-b border-slate-200">
        {(['GANS', 'Eshara', 'YHA'] as FunctionalEntity[]).map((entity) => (
          <button
            key={entity}
            type="button"
            onClick={() => {
              setActiveEntity(entity);
              resetForm();
            }}
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

      {/* Entry Form: Keep Department Left and Functional Right */}
      <div
        id="functional-entry-form"
        className="rounded-xl bg-white border border-slate-200 p-6 shadow-xs space-y-5"
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h2 className="text-sm font-extrabold text-slate-800">
            {editingRecordId ? 'Edit Functional & Department' : 'Enter Functional & Department'}
          </h2>
          {editingRecordId && (
            <button
              type="button"
              onClick={resetForm}
              className="text-xs text-[#0275a8] hover:underline cursor-pointer"
            >
              Cancel Edit
            </button>
          )}
        </div>

        {/* TWO BOXES: DEPARTMENT ON LEFT, FUNCTIONAL ON RIGHT */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
          {/* LEFT BOX: DEPARTMENT (MULTISELECT DROPDOWN - CLEAN WITHOUT SEARCH, CLEAR, OR CUSTOM ADD) */}
          <div id="box-department" className="space-y-2" ref={deptDropdownRef}>
            <div className="flex items-center justify-between">
              <label className="block font-bold text-slate-800 text-xs">
                Department <span className="text-red-500">*</span>
              </label>
              {selectedDepartments.length > 0 && (
                <span className="text-[11px] text-[#0275a8] font-semibold">
                  {selectedDepartments.length} selected
                </span>
              )}
            </div>

            {/* Department Multiselect Dropdown Trigger */}
            <div className="relative">
              <div
                id="btn-dept-multiselect"
                onClick={() => setIsDeptDropdownOpen(!isDeptDropdownOpen)}
                className={`w-full min-h-[42px] px-3.5 py-2 bg-slate-50 border rounded-xl text-xs font-bold cursor-pointer transition-all flex items-center justify-between gap-2 ${
                  isDeptDropdownOpen
                    ? 'border-[#0275a8] ring-2 ring-[#0275a8]/20 bg-white'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex flex-wrap gap-1.5 items-center flex-1 max-w-[90%]">
                  {selectedDepartments.length === 0 ? (
                    <span className="text-slate-400 font-normal">Select departments...</span>
                  ) : (
                    selectedDepartments.map((dept) => (
                      <span
                        key={dept}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#0275a8]/10 text-[#0275a8] text-[11px] font-bold"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleDepartment(dept);
                        }}
                      >
                        <span>{dept}</span>
                        <X className="w-3 h-3 hover:text-red-600" />
                      </span>
                    ))
                  )}
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${
                    isDeptDropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </div>

              {/* Multiselect Popover: Clean checklist of departments only */}
              {isDeptDropdownOpen && (
                <div className="absolute z-30 left-0 top-12 w-full bg-white border border-slate-200 rounded-xl shadow-xl p-2 text-xs space-y-1 animate-in fade-in zoom-in-95 duration-100">
                  {/* Department Checkbox List */}
                  <div className="max-h-56 overflow-y-auto space-y-1 pr-1">
                    {availableDepartments.length === 0 ? (
                      <p className="text-slate-400 text-center py-3 text-[11px]">No departments available</p>
                    ) : (
                      availableDepartments.map((dept) => {
                        const isSelected = selectedDepartments.includes(dept);
                        return (
                          <label
                            key={dept}
                            className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg cursor-pointer transition-colors ${
                              isSelected
                                ? 'bg-sky-50 text-[#0275a8] font-bold'
                                : 'hover:bg-slate-50 text-slate-700 font-medium'
                            }`}
                          >
                            <div
                              className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                                isSelected
                                  ? 'bg-[#0275a8] border-[#0275a8] text-white'
                                  : 'border-slate-300 bg-white'
                              }`}
                            >
                              {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                            </div>
                            <span className="text-xs truncate">{dept}</span>
                          </label>
                        );
                      })
                    )}
                  </div>
                </div>
              )}
            </div>

            {errors.department && (
              <p className="text-[11px] text-red-600 font-semibold">{errors.department}</p>
            )}
          </div>

          {/* RIGHT BOX: FUNCTIONAL */}
          <div id="box-functional" className="space-y-2">
            <label className="block font-bold text-slate-800 text-xs">
              Functional <span className="text-red-500">*</span>
            </label>

            <input
              id="input-functional-name"
              type="text"
              value={functionalInput}
              onChange={(e) => {
                setFunctionalInput(e.target.value);
                if (errors.functional) setErrors((prev) => ({ ...prev, functional: '' }));
              }}
              placeholder="Enter functional..."
              className="w-full min-h-[42px] px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-[#0275a8]/20 focus:border-[#0275a8]"
            />

            {errors.functional && (
              <p className="text-[11px] text-red-600 font-semibold">{errors.functional}</p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={resetForm}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2 bg-gradient-to-r from-[#1a5075] to-[#0275a8] text-white font-bold rounded-xl text-xs cursor-pointer"
          >
            {editingRecordId ? 'Update' : 'Save'}
          </button>
        </div>
      </div>

      {/* Downside Table: Functional first and Department second */}
      <div className="rounded-xl bg-white border border-slate-200 shadow-xs overflow-hidden">
        {/* Search */}
        <div className="p-4 bg-slate-50 border-b border-slate-200">
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

        {/* Master Table: Functional First, Department Second */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-700 font-extrabold border-b border-slate-200 uppercase text-[11px]">
              <tr>
                <th className="py-3 px-4 w-[35%]">Functional</th>
                <th className="py-3 px-4 w-[55%]">Department</th>
                <th className="py-3 px-4 w-[10%] text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={3} className="py-12 text-center text-slate-400">
                    No records found
                  </td>
                </tr>
              ) : (
                filteredRecords.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Functional first */}
                    <td className="py-3 px-4 font-bold text-slate-900 align-middle">
                      <div className="flex items-center gap-2">
                        <Network className="w-4 h-4 text-[#0275a8] shrink-0" />
                        <span>{r.functional}</span>
                      </div>
                    </td>

                    {/* Department second (showing multiple departments under that function) */}
                    <td className="py-3 px-4 align-middle">
                      <div className="flex flex-wrap gap-1.5 items-center">
                        {r.departments.map((dept) => (
                          <span
                            key={dept}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-sky-50 text-sky-900 border border-sky-200"
                          >
                            <Building2 className="w-3 h-3 text-[#0275a8] shrink-0" />
                            <span>{dept}</span>
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Actions: Edit & Delete */}
                    <td className="py-3 px-4 text-center align-middle">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleEditRecord(r)}
                          className="p-1.5 text-slate-500 hover:text-[#0275a8] hover:bg-sky-50 rounded-lg cursor-pointer"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteConfirmRecord(r)}
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

      {/* Delete Confirmation Modal */}
      {deleteConfirmRecord && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4"
          onClick={() => setDeleteConfirmRecord(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-slate-200 space-y-4 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-1">
              <h3 className="font-bold text-slate-900 text-sm">Remove Record</h3>
              <p className="text-xs text-slate-600">
                Are you sure you want to remove <strong>{deleteConfirmRecord.functional}</strong>?
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmRecord(null)}
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
