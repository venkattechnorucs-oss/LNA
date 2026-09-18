import React, { useState, useMemo, useEffect } from 'react';
import {
  Building2,
  Network,
  Plus,
  X,
  CheckCircle2,
  Search
} from 'lucide-react';
import { FunctionalDefinition, FUNCTIONAL_STRUCTURE_CATALOG } from './HrCompetencySkillsMasterView';

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

  // Listen for storage events across components
  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const saved = localStorage.getItem('gans_custom_functionals_catalog');
        if (saved) {
          setCustomCatalog(JSON.parse(saved));
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
  const [newDeptInput, setNewDeptInput] = useState('');
  const [addedDepartmentsList, setAddedDepartmentsList] = useState<string[]>([]);
  const [functionalDeptErrors, setFunctionalDeptErrors] = useState<Record<string, string>>({});
  const [actionToast, setActionToast] = useState<{ message: string; type: 'success' | 'info' } | null>(null);

  // Table search state
  const [searchQuery, setSearchQuery] = useState('');

  // Merged catalog of standard catalog + custom catalog
  const mergedCatalog = useMemo<Record<string, FunctionalDefinition>>(() => {
    return {
      ...FUNCTIONAL_STRUCTURE_CATALOG,
      ...customCatalog
    };
  }, [customCatalog]);

  const allFunctionalKeys = useMemo(() => Object.keys(mergedCatalog), [mergedCatalog]);

  const resetForm = () => {
    setNewFunctionalName('');
    setNewDeptInput('');
    setAddedDepartmentsList([]);
    setFunctionalDeptErrors({});
  };

  const handleAddDepartmentItem = () => {
    const trimmed = newDeptInput.trim();
    if (!trimmed) return;
    if (addedDepartmentsList.some((d) => d.toLowerCase() === trimmed.toLowerCase())) {
      setFunctionalDeptErrors((prev) => ({ ...prev, department: 'Department already added in list' }));
      return;
    }
    setAddedDepartmentsList((prev) => [...prev, trimmed]);
    setNewDeptInput('');
    setFunctionalDeptErrors((prev) => ({ ...prev, department: '' }));
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

    let finalDepts = [...addedDepartmentsList];
    const pendingDept = newDeptInput.trim();
    if (pendingDept && !finalDepts.some((d) => d.toLowerCase() === pendingDept.toLowerCase())) {
      finalDepts.push(pendingDept);
    }

    if (finalDepts.length === 0) {
      errs.department = 'Please add at least one department';
    }

    if (Object.keys(errs).length > 0) {
      setFunctionalDeptErrors(errs);
      return;
    }

    // Save to customCatalog and localStorage
    const updatedCatalog: Record<string, FunctionalDefinition> = {
      ...customCatalog,
      [trimmedFn]: {
        name: trimmedFn,
        departments: finalDepts,
        competencies: [
          `${trimmedFn} Core Competency`,
          'Operational Excellence',
          'Technical Knowledge',
          'Compliance & Standards'
        ]
      }
    };

    setCustomCatalog(updatedCatalog);
    try {
      localStorage.setItem('gans_custom_functionals_catalog', JSON.stringify(updatedCatalog));
      window.dispatchEvent(new Event('gans_catalog_updated'));
    } catch (e) {
      console.error('Failed to save custom functionals catalog', e);
    }

    setActionToast({
      message: `Functional "${trimmedFn}" with ${finalDepts.length} department(s) saved successfully.`,
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
            <span>Department Master</span>
          </h1>
          <p className="text-xs text-sky-100/90 mt-1 font-medium max-w-xl">
            Configure functional divisions and their associated departments across the organization.
          </p>
        </div>
      </div>

      {/* ADD FUNCTIONAL & DEPARTMENT ENTRY CARD */}
      <div className="rounded-2xl bg-white/90 backdrop-blur-xl border border-white/80 p-6 shadow-[0_8px_30px_rgb(26,80,117,0.06)] space-y-6">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-200/80">
          <div className="p-1.5 rounded-lg bg-[#0275a8]/10 text-[#0275a8]">
            <Network className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-extrabold text-slate-800">Add Functional &amp; Department</h2>
          </div>
        </div>

        {/* TWO BOXES SIDE BY SIDE */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* BOX 1: FUNCTIONAL */}
          <div
            id="box-functional"
            className="bg-slate-50/80 p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3"
          >
            <div>
              <label className="block font-extrabold text-slate-800 flex items-center gap-1.5 text-xs">
                <Network className="w-4 h-4 text-[#0275a8]" />
                <span>Functional</span> <span className="text-red-500">*</span>
              </label>
            </div>
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
              placeholder="Type functional name (e.g. Ground Operations & Logistics)..."
              className="w-full min-h-[44px] px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 placeholder:text-slate-400 placeholder:font-normal shadow-inner focus:outline-hidden focus:ring-2 focus:ring-[#0275a8]/20 focus:border-[#0275a8]"
            />
            {functionalDeptErrors.functional && (
              <p className="text-[11px] text-red-600 font-semibold">{functionalDeptErrors.functional}</p>
            )}
          </div>

          {/* BOX 2: DEPARTMENT */}
          <div
            id="box-department"
            className="bg-slate-50/80 p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3"
          >
            <div>
              <label className="block font-extrabold text-slate-800 flex items-center gap-1.5 text-xs">
                <Building2 className="w-4 h-4 text-[#0275a8]" />
                <span>Department</span> <span className="text-red-500">*</span>
              </label>
            </div>

            <div className="flex items-center gap-2">
              <input
                id="input-department-name"
                type="text"
                value={newDeptInput}
                onChange={(e) => {
                  setNewDeptInput(e.target.value);
                  if (functionalDeptErrors.department) {
                    setFunctionalDeptErrors((prev) => ({ ...prev, department: '' }));
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddDepartmentItem();
                  }
                }}
                placeholder="Type department name..."
                className="flex-1 min-h-[44px] px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 placeholder:text-slate-400 placeholder:font-normal shadow-inner focus:outline-hidden focus:ring-2 focus:ring-[#0275a8]/20 focus:border-[#0275a8]"
              />
              <button
                id="btn-add-department-item"
                type="button"
                onClick={handleAddDepartmentItem}
                className="px-4 py-2.5 bg-[#0275a8] hover:bg-[#02628d] text-white text-xs font-extrabold rounded-xl transition-all cursor-pointer shrink-0 flex items-center gap-1.5 active:scale-95 shadow-2xs"
              >
                <Plus className="w-4 h-4" />
                <span>Add</span>
              </button>
            </div>
            {functionalDeptErrors.department && (
              <p className="text-[11px] text-red-600 font-semibold">{functionalDeptErrors.department}</p>
            )}

            {/* Added Departments Display Container */}
            <div className="pt-1">
              {addedDepartmentsList.length > 0 && (
                <div className="p-2.5 bg-white border border-slate-200 rounded-xl space-y-2 max-h-48 overflow-y-auto">
                  <div className="flex items-center justify-between text-[11px] font-extrabold text-slate-600 px-1 border-b border-slate-100 pb-1">
                    <span className="flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-[#0275a8]" />
                      <span>Added Departments ({addedDepartmentsList.length})</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setAddedDepartmentsList([])}
                      className="text-red-500 hover:text-red-700 font-bold hover:underline cursor-pointer text-[10px]"
                    >
                      Clear all
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {addedDepartmentsList.map((dept, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#e6f4fa] text-[#0275a8] border border-[#b2ddf0] text-xs font-bold shadow-2xs"
                      >
                        <span>{dept}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveDepartmentItem(dept)}
                          className="text-[#0275a8] hover:text-red-600 hover:bg-red-50 rounded-xs p-0.5 transition-colors cursor-pointer"
                          title={`Remove ${dept}`}
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
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
            className="px-6 py-2.5 bg-gradient-to-r from-[#1a5075] to-[#0275a8] hover:from-[#154668] hover:to-[#02628d] text-white font-extrabold rounded-xl shadow-md transition-all cursor-pointer active:scale-95 text-xs"
          >
            Save
          </button>
        </div>
      </div>

      {/* MASTER DATA VIEW: ADDED DETAILS DOWN THERE */}
      <div className="rounded-2xl bg-white/85 backdrop-blur-xl border border-white/80 shadow-[0_8px_30px_rgb(26,80,117,0.05)] overflow-hidden">
        {/* Table Toolbar */}
        <div className="p-4 bg-slate-50/70 border-b border-slate-200/80 flex items-center justify-between gap-3">
          <div className="relative w-full max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by functional or configured department name..."
              className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 shadow-inner focus:outline-hidden focus:ring-2 focus:ring-[#0275a8]/20 focus:border-[#0275a8]"
            />
          </div>
        </div>

        {/* Master Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-100/80 text-slate-600 font-extrabold border-b border-slate-200 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-4 w-[35%]">Functional</th>
                <th className="py-3.5 px-4 w-[65%]">Configured Departments</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredFunctionals.length === 0 ? (
                <tr>
                  <td colSpan={2} className="py-12 text-center text-slate-400">
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
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
