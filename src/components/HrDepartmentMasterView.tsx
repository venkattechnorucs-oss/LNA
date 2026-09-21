import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  Building2,
  Network,
  X,
  CheckCircle2,
  Search,
  ChevronDown,
  Pencil,
  Trash2
} from 'lucide-react';
import {
  FunctionalDefinition,
  FUNCTIONAL_STRUCTURE_CATALOG,
  DEPARTMENT_LIST
} from './HrCompetencySkillsMasterView';

interface HrDepartmentMasterViewProps {
  onNavigateToCompetencies?: () => void;
}

export const HrDepartmentMasterView: React.FC<HrDepartmentMasterViewProps> = () => {
  // Custom Functionals & Departments Catalog (persisted in localStorage)
  const [customCatalog, setCustomCatalog] = useState<Record<string, FunctionalDefinition>>(() => {
    try {
      const saved = localStorage.getItem('gans_custom_functionals_catalog');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Track deleted functional keys (persisted in localStorage)
  const [deletedFunctionals, setDeletedFunctionals] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('gans_deleted_functionals');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Edit and Delete Confirmation State
  const [editingOriginalKey, setEditingOriginalKey] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ fnKey: string; name: string } | null>(null);

  // Listen for storage events across components
  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const saved = localStorage.getItem('gans_custom_functionals_catalog');
        if (saved) {
          setCustomCatalog(JSON.parse(saved));
        }
        const savedDeleted = localStorage.getItem('gans_deleted_functionals');
        if (savedDeleted) {
          setDeletedFunctionals(JSON.parse(savedDeleted));
        }
      } catch (err) {
        console.error(err);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('gans_catalog_updated', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('gans_catalog_updated', handleStorageChange);
    };
  }, []);

  // Form input state
  const [newFunctionalName, setNewFunctionalName] = useState('');
  const [addedDepartmentsList, setAddedDepartmentsList] = useState<string[]>([]);
  const [functionalDeptErrors, setFunctionalDeptErrors] = useState<Record<string, string>>({});
  const [actionToast, setActionToast] = useState<{ message: string; type: 'success' | 'info' } | null>(null);

  // Department Dropdown Multiselect state
  const [isDeptDropdownOpen, setIsDeptDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Automatically close open department dropdown when clicking outside or pressing Escape
  useEffect(() => {
    if (!isDeptDropdownOpen) return;

    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      const target = event.target as HTMLElement | null;
      if (target && !target.closest('[data-department-dropdown-container]')) {
        setIsDeptDropdownOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsDeptDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('touchstart', handlePointerDown);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('touchstart', handlePointerDown);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isDeptDropdownOpen]);

  // Table search state
  const [searchQuery, setSearchQuery] = useState('');

  // Merged catalog of standard catalog + custom catalog, excluding deleted functionals
  const mergedCatalog = useMemo<Record<string, FunctionalDefinition>>(() => {
    const res: Record<string, FunctionalDefinition> = {
      ...FUNCTIONAL_STRUCTURE_CATALOG,
      ...customCatalog
    };
    deletedFunctionals.forEach((k) => {
      delete res[k];
    });
    return res;
  }, [customCatalog, deletedFunctionals]);

  const allFunctionalKeys = useMemo(() => Object.keys(mergedCatalog), [mergedCatalog]);

  // Comprehensive master list of available departments across all functionals & defaults
  const availableDepartments = useMemo(() => {
    const deptSet = new Set<string>();

    DEPARTMENT_LIST.forEach((d) => deptSet.add(d));

    (Object.values(FUNCTIONAL_STRUCTURE_CATALOG) as FunctionalDefinition[]).forEach((fn) => {
      fn.departments?.forEach((d) => deptSet.add(d));
    });

    (Object.values(customCatalog) as FunctionalDefinition[]).forEach((fn) => {
      fn.departments?.forEach((d) => deptSet.add(d));
    });

    addedDepartmentsList.forEach((d) => deptSet.add(d));

    return Array.from(deptSet).sort((a, b) => a.localeCompare(b));
  }, [customCatalog, addedDepartmentsList]);

  const resetForm = () => {
    setNewFunctionalName('');
    setAddedDepartmentsList([]);
    setFunctionalDeptErrors({});
    setIsDeptDropdownOpen(false);
    setEditingOriginalKey(null);
  };

  // Populate form with row data to edit
  const handleEditFunctional = (fnKey: string) => {
    const fn = mergedCatalog[fnKey];
    if (!fn) return;
    setEditingOriginalKey(fnKey);
    setNewFunctionalName(fn.name);
    setAddedDepartmentsList(fn.departments ? [...fn.departments] : []);
    setFunctionalDeptErrors({});
    setIsDeptDropdownOpen(false);

    // Smoothly scroll to the form card above
    const formCard = document.getElementById('add-functional-form-card');
    if (formCard) {
      formCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Confirm and execute removal of functional
  const handleConfirmDelete = () => {
    if (!deleteConfirm) return;
    const { fnKey, name } = deleteConfirm;

    const updatedCatalog = { ...customCatalog };
    delete updatedCatalog[fnKey];
    delete updatedCatalog[name];

    let updatedDeleted = [...deletedFunctionals];
    if (!updatedDeleted.includes(fnKey)) {
      updatedDeleted.push(fnKey);
    }
    if (!updatedDeleted.includes(name)) {
      updatedDeleted.push(name);
    }

    setCustomCatalog(updatedCatalog);
    setDeletedFunctionals(updatedDeleted);

    try {
      localStorage.setItem('gans_custom_functionals_catalog', JSON.stringify(updatedCatalog));
      localStorage.setItem('gans_deleted_functionals', JSON.stringify(updatedDeleted));
      window.dispatchEvent(new Event('gans_catalog_updated'));
    } catch (e) {
      console.error('Failed to delete functional', e);
    }

    if (editingOriginalKey === fnKey || editingOriginalKey === name) {
      resetForm();
    }

    setActionToast({
      message: `Functional "${name}" removed successfully.`,
      type: 'info'
    });
    setTimeout(() => setActionToast(null), 4000);

    setDeleteConfirm(null);
  };

  // Toggle department selection in multiselect (like roles in competency skills master)
  const handleToggleDepartment = (dept: string) => {
    setAddedDepartmentsList((prev) => {
      const exists = prev.includes(dept);
      if (exists) {
        return prev.filter((d) => d !== dept);
      } else {
        return [...prev, dept];
      }
    });
    if (functionalDeptErrors.department) {
      setFunctionalDeptErrors((prev) => ({ ...prev, department: '' }));
    }
  };

  const handleRemoveDepartmentItem = (deptToRemove: string) => {
    setAddedDepartmentsList((prev) => prev.filter((d) => d !== deptToRemove));
  };

  const handleSave = () => {
    const errs: Record<string, string> = {};
    const trimmedFn = newFunctionalName.trim();
    if (!trimmedFn) {
      errs.functional = 'Functional name is required';
    }

    if (addedDepartmentsList.length === 0) {
      errs.department = 'Department is required';
    }

    if (Object.keys(errs).length > 0) {
      setFunctionalDeptErrors(errs);
      return;
    }

    const finalDepts = [...addedDepartmentsList];

    // If editing and renamed, clean up old key
    let updatedCatalog: Record<string, FunctionalDefinition> = { ...customCatalog };
    let updatedDeleted = [...deletedFunctionals];

    if (editingOriginalKey && editingOriginalKey !== trimmedFn) {
      delete updatedCatalog[editingOriginalKey];
      if (!updatedDeleted.includes(editingOriginalKey)) {
        updatedDeleted.push(editingOriginalKey);
      }
    }

    // Ensure the new name is not marked as deleted
    updatedDeleted = updatedDeleted.filter((k) => k !== trimmedFn);

    updatedCatalog[trimmedFn] = {
      name: trimmedFn,
      departments: finalDepts,
      competencies: mergedCatalog[editingOriginalKey || trimmedFn]?.competencies || [
        `${trimmedFn} Core Competency`,
        'Operational Excellence',
        'Technical Knowledge',
        'Compliance & Standards'
      ]
    };

    setCustomCatalog(updatedCatalog);
    setDeletedFunctionals(updatedDeleted);

    try {
      localStorage.setItem('gans_custom_functionals_catalog', JSON.stringify(updatedCatalog));
      localStorage.setItem('gans_deleted_functionals', JSON.stringify(updatedDeleted));
      window.dispatchEvent(new Event('gans_catalog_updated'));
    } catch (e) {
      console.error('Failed to save custom functionals catalog', e);
    }

    setActionToast({
      message: editingOriginalKey
        ? `Functional "${trimmedFn}" updated successfully.`
        : `Functional "${trimmedFn}" saved successfully.`,
      type: 'success'
    });
    setTimeout(() => setActionToast(null), 4000);

    resetForm();
  };

  // Filtered rows for the Master Table
  const filteredFunctionals = useMemo(() => {
    return allFunctionalKeys.filter((fnKey) => {
      const fn = mergedCatalog[fnKey];
      if (!fn) return false;

      if (!searchQuery.trim()) return true;

      const query = searchQuery.toLowerCase();
      const nameMatch = fn.name.toLowerCase().includes(query);
      const deptMatch = fn.departments?.some((dept) => dept.toLowerCase().includes(query));

      return nameMatch || deptMatch;
    });
  }, [allFunctionalKeys, mergedCatalog, searchQuery]);

  return (
    <div id="department-master-container" className="space-y-6 animate-in fade-in duration-300 pb-16">
      {/* Toast Notification */}
      {actionToast && (
        <div
          id="action-toast"
          className="fixed top-20 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-xl border bg-[#1a5075] border-[#0275a8] text-white animate-in slide-in-from-top-4 duration-300"
        >
          <CheckCircle2 className="w-5 h-5 text-sky-300 shrink-0" />
          <span className="text-xs font-bold">{actionToast.message}</span>
          <button
            type="button"
            onClick={() => setActionToast(null)}
            className="ml-2 hover:bg-white/20 p-1 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Page Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1a5075] via-[#104060] to-[#0d2f47] p-5 sm:p-6 text-white shadow-[0_12px_36px_-6px_rgba(26,80,117,0.35)] border border-white/20 backdrop-blur-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="absolute -right-8 -top-8 w-56 h-56 bg-sky-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 -bottom-10 w-48 h-48 bg-teal-400/15 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10">
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2.5 drop-shadow-xs">
            <div className="p-2 rounded-xl bg-white/15 border border-white/20 shadow-inner">
              <Building2 className="w-5 h-5 text-sky-300" />
            </div>
            <span>Functional Master</span>
          </h1>
          <p className="text-xs text-sky-100/90 mt-1 font-medium max-w-xl">
            Configure functional divisions and their associated departments across the organization.
          </p>
        </div>
      </div>

      {/* ADD FUNCTIONAL & DEPARTMENT ENTRY CARD */}
      <div
        id="add-functional-form-card"
        className="rounded-2xl bg-white/90 backdrop-blur-xl border border-white/80 p-6 shadow-[0_8px_30px_rgb(26,80,117,0.06)] space-y-6"
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-200/80">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-[#0275a8]/10 text-[#0275a8]">
              <Network className="w-4 h-4" />
            </div>
            <h2 className="text-sm font-extrabold text-slate-800 flex items-center gap-2">
              <span>{editingOriginalKey ? 'Edit Functional & Department' : 'Add Functional & Department'}</span>
              {editingOriginalKey && (
                <span className="text-[10px] font-bold bg-sky-100 text-[#0275a8] border border-sky-300/70 px-2 py-0.5 rounded-full">
                  Editing: {editingOriginalKey}
                </span>
              )}
            </h2>
          </div>
        </div>

        {/* TWO BOXES SIDE BY SIDE */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
          {/* BOX 1: FUNCTIONAL (TEXT BOX) */}
          <div
            id="box-functional"
            className="bg-slate-50/80 p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3"
          >
            <label className="block font-extrabold text-slate-800 flex items-center gap-1.5 text-xs">
              <Network className="w-4 h-4 text-[#0275a8]" />
              <span>Functional</span> <span className="text-red-500">*</span>
            </label>

            <input
              id="input-functional-name"
              type="text"
              value={newFunctionalName}
              onChange={(e) => {
                setNewFunctionalName(e.target.value);
                if (functionalDeptErrors.functional) {
                  setFunctionalDeptErrors((prev) => ({ ...prev, functional: '' }));
                }
              }}
              placeholder="Type functional name..."
              className="w-full min-h-[44px] px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 placeholder:text-slate-400 placeholder:font-normal shadow-inner focus:outline-hidden focus:ring-2 focus:ring-[#0275a8]/20 focus:border-[#0275a8]"
            />

            {functionalDeptErrors.functional && (
              <p className="text-[11px] text-red-600 font-semibold">{functionalDeptErrors.functional}</p>
            )}
          </div>

          {/* BOX 2: DEPARTMENT (DROPDOWN & MULTISELECT LIKE ROLES) */}
          <div
            id="box-department"
            className="bg-slate-50/80 p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3"
          >
            <label className="block font-extrabold text-slate-800 flex items-center gap-1.5 text-xs">
              <Building2 className="w-4 h-4 text-[#0275a8]" />
              <span>Department</span> <span className="text-red-500">*</span>
            </label>

            {/* Dropdown Container */}
            <div className="relative" data-department-dropdown-container="true" ref={dropdownRef}>
              <button
                id="btn-department-dropdown"
                type="button"
                onClick={() => setIsDeptDropdownOpen(!isDeptDropdownOpen)}
                className={`w-full flex items-center justify-between px-3 py-2 border rounded-xl text-xs font-bold cursor-pointer text-left shadow-2xs transition-all min-h-[44px] ${
                  isDeptDropdownOpen
                    ? 'bg-white border-[#0275a8] ring-2 ring-[#0275a8]/20 text-slate-900'
                    : addedDepartmentsList.length > 0
                    ? 'bg-sky-50/70 border-sky-200 text-sky-900'
                    : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                }`}
              >
                <span className="truncate max-w-[280px]">
                  {addedDepartmentsList.length === 0
                    ? 'Select Departments...'
                    : addedDepartmentsList.length === 1
                    ? addedDepartmentsList[0]
                    : addedDepartmentsList.length === availableDepartments.length
                    ? `All Departments (${availableDepartments.length})`
                    : `${addedDepartmentsList.length} Departments (${addedDepartmentsList[0]}...)`}
                </span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-500 shrink-0 ml-1 transition-transform duration-200 ${isDeptDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isDeptDropdownOpen && (
                <div className="absolute z-50 left-0 top-12 w-full max-h-64 overflow-y-auto bg-white/95 backdrop-blur-xl border border-slate-200 rounded-2xl shadow-xl p-2 text-xs animate-in zoom-in-95 duration-150">
                  <div className="space-y-1">
                    {availableDepartments.map((dept) => {
                      const isSelected = addedDepartmentsList.includes(dept);
                      return (
                        <label
                          key={dept}
                          className={`flex items-center gap-2 p-1.5 rounded-lg cursor-pointer text-[11px] transition-colors ${
                            isSelected ? 'bg-sky-50 text-[#0275a8] font-bold' : 'hover:bg-slate-50 text-slate-700 font-medium'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleToggleDepartment(dept)}
                            className="rounded border-slate-300 text-[#0275a8] focus:ring-[#0275a8]"
                          />
                          <span>{dept}</span>
                        </label>
                      );
                    })}
                  </div>
                  <div className="pt-2 mt-1.5 border-t border-slate-100 text-right">
                    <button
                      type="button"
                      onClick={() => setIsDeptDropdownOpen(false)}
                      className="px-3 py-1 bg-[#1a5075] hover:bg-[#0275a8] text-white rounded-lg text-[10px] font-bold cursor-pointer"
                    >
                      Done
                    </button>
                  </div>
                </div>
              )}
            </div>

            {functionalDeptErrors.department && (
              <p className="text-[11px] text-red-600 font-semibold">{functionalDeptErrors.department}</p>
            )}

            {addedDepartmentsList.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {addedDepartmentsList.map((dept, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-sky-50 text-sky-900 border border-sky-200 text-xs font-bold"
                  >
                    <span>{dept}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveDepartmentItem(dept)}
                      className="text-sky-600 hover:text-red-500 rounded p-0.5 transition-colors cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons: Cancel and Save */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200/80">
          <button
            id="btn-cancel-functional-dept"
            type="button"
            onClick={resetForm}
            className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors cursor-pointer text-xs"
          >
            Cancel
          </button>
          <button
            id="btn-save-functional-dept"
            type="button"
            onClick={handleSave}
            className="px-6 py-2.5 bg-gradient-to-r from-[#1a5075] to-[#0275a8] hover:from-[#154668] hover:to-[#02628d] text-white font-extrabold rounded-xl shadow-md transition-all cursor-pointer active:scale-95 text-xs text-center"
          >
            <span>{editingOriginalKey ? 'Update' : 'Save'}</span>
          </button>
        </div>
      </div>

      {/* MASTER DATA VIEW: ADDED DETAILS DOWN THERE */}
      <div className="rounded-2xl bg-white/85 backdrop-blur-xl border border-white/80 shadow-[0_8px_30px_rgb(26,80,117,0.05)] overflow-hidden">
        {/* Table Toolbar */}
        <div className="p-4 bg-slate-50/70 border-b border-slate-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="relative w-full max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 shadow-inner focus:outline-hidden focus:ring-2 focus:ring-[#0275a8]/20 focus:border-[#0275a8]"
            />
          </div>
        </div>

        {/* Master Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-100/80 text-slate-600 font-extrabold border-b border-slate-200 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-4 w-[30%]">Functional</th>
                <th className="py-3.5 px-4 w-[55%]">Department</th>
                <th className="py-3.5 px-3 w-[15%] text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredFunctionals.length === 0 ? (
                <tr>
                  <td colSpan={3} className="py-12 text-center text-slate-400">
                    <Building2 className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="text-xs font-bold text-slate-600">No functional units or departments found</p>
                    <p className="text-[11px] text-slate-400 mt-1">Try adjusting your search query or add a new one above</p>
                  </td>
                </tr>
              ) : (
                filteredFunctionals.map((fnKey) => {
                  const fn = mergedCatalog[fnKey];
                  const depts = fn.departments || [];

                  return (
                    <tr
                      key={fnKey}
                      className="hover:bg-sky-50/40 transition-colors"
                    >
                      {/* Functional Name */}
                      <td className="py-3.5 px-4 align-middle">
                        <div className="font-extrabold text-slate-900 flex items-center gap-2 text-xs">
                          <Network className="w-3.5 h-3.5 text-[#0275a8] shrink-0" />
                          <span>{fn.name}</span>
                        </div>
                      </td>

                      {/* Configured Departments */}
                      <td className="py-3.5 px-4 align-middle">
                        <div className="flex flex-wrap gap-1.5 items-center">
                          {depts.map((dept, dIdx) => (
                            <span
                              key={dIdx}
                              className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-50 text-slate-800 border border-slate-200 shadow-2xs hover:border-slate-300 transition-colors"
                            >
                              <Building2 className="w-3 h-3 text-[#0275a8] mr-1.5 shrink-0" />
                              <span>{dept}</span>
                            </span>
                          ))}
                        </div>
                      </td>

                      {/* Action Column with Edit and Remove Symbols */}
                      <td className="py-3.5 px-3 text-center align-middle">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleEditFunctional(fnKey)}
                            className="p-1.5 text-slate-400 hover:text-[#0275a8] hover:bg-sky-50 rounded-lg transition-colors cursor-pointer"
                            title="Edit Functional"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteConfirm({ fnKey, name: fn.name })}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            title="Remove Functional"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setDeleteConfirm(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 space-y-4 text-center animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-extrabold text-slate-800 text-sm">Remove Functional</h3>
              <p className="text-xs text-slate-500">
                Are you sure you want to remove <strong>{deleteConfirm.name}</strong> and its department mappings?
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-extrabold rounded-xl shadow-md cursor-pointer active:scale-95 transition-all"
              >
                Yes, Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const HrFunctionalMasterView = HrDepartmentMasterView;
