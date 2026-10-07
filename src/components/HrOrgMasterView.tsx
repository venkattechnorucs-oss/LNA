import React, { useState, useMemo, useEffect } from 'react';
import {
  Landmark,
  Plus,
  Search,
  X,
  CheckCircle2
} from 'lucide-react';

export interface OrgRecord {
  id: string;
  name: string;
  code: string;
  isDefault?: boolean;
}

const INITIAL_ORGS: OrgRecord[] = [
  { id: 'org-gans', name: 'GANS', code: 'GANS', isDefault: true },
  { id: 'org-eshara', name: 'Eshara', code: 'ESH', isDefault: true },
  { id: 'org-yha', name: 'YHA', code: 'YHA', isDefault: true }
];

export const HrOrgMasterView: React.FC = () => {
  // Organizations State
  const [organizations, setOrganizations] = useState<OrgRecord[]>(() => {
    try {
      const saved = localStorage.getItem('gans_org_master_simple_v2');
      return saved ? JSON.parse(saved) : INITIAL_ORGS;
    } catch {
      return INITIAL_ORGS;
    }
  });

  // Search
  const [searchQuery, setSearchQuery] = useState('');

  // Notification Toast
  const [actionToast, setActionToast] = useState<{ message: string; type: 'success' | 'info' } | null>(null);

  // Persist changes
  useEffect(() => {
    try {
      localStorage.setItem('gans_org_master_simple_v2', JSON.stringify(organizations));
    } catch (e) {
      console.error(e);
    }
  }, [organizations]);

  // Modal State (Add Org)
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);

  // Form Fields: Org Name & Code
  const [formName, setFormName] = useState('');
  const [formCode, setFormCode] = useState('');
  const [formErrors, setFormErrors] = useState<{ name?: string; code?: string }>({});

  // Filtered organizations
  const filteredOrganizations = useMemo(() => {
    return organizations.filter((org) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      return org.name.toLowerCase().includes(q) || org.code.toLowerCase().includes(q);
    });
  }, [organizations, searchQuery]);

  // Open Add
  const handleOpenAdd = () => {
    setFormName('');
    setFormCode('');
    setFormErrors({});
    setIsFormModalOpen(true);
  };

  // Save Add
  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: { name?: string; code?: string } = {};

    if (!formName.trim()) {
      errors.name = 'Org Name is required';
    }
    if (!formCode.trim()) {
      errors.code = 'Code is required';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const newOrg: OrgRecord = {
      id: `org-${Date.now()}`,
      name: formName.trim(),
      code: formCode.trim().toUpperCase(),
      isDefault: false
    };

    setOrganizations((prev) => [...prev, newOrg]);
    setActionToast({ message: 'Organization added successfully.', type: 'success' });

    setTimeout(() => setActionToast(null), 3000);
    setIsFormModalOpen(false);
  };

  return (
    <div id="org-master-container" className="space-y-6 pb-16 animate-in fade-in duration-200">
      {/* Toast Notification */}
      {actionToast && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg bg-[#211E4E] text-white border border-[#C8A977]/30 text-xs font-bold animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-[#C8A977]" />
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
      <div className="bg-[#211E4E] rounded-xl p-5 text-white shadow-md border border-[#C8A977]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2.5">
            <Landmark className="w-6 h-6 text-[#C8A977]" />
            <span>Organisation Master</span>
          </h1>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="px-4 py-2 bg-[#C8A977] hover:bg-[#b89763] text-[#211E4E] font-extrabold text-xs rounded-lg flex items-center gap-1.5 shadow-sm transition-all cursor-pointer active:scale-95"
        >
          <Plus className="w-4 h-4 text-[#211E4E]" />
          <span>Add</span>
        </button>
      </div>

      {/* Search */}
      <div className="flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by org name or code..."
            className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-[#C8A977]/30 focus:border-[#C8A977]"
          />
        </div>
      </div>

      {/* Org Table: Org Name | Code (Action column removed) */}
      <div className="rounded-xl bg-white border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-[#211E4E] text-[#C8A977] font-extrabold border-b border-[#C8A977]/30 uppercase text-[11px]">
              <tr>
                <th className="py-3 px-4">Org Name</th>
                <th className="py-3 px-4 w-48">Code</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredOrganizations.length === 0 ? (
                <tr>
                  <td colSpan={2} className="py-12 text-center text-slate-400">
                    No organizations found
                  </td>
                </tr>
              ) : (
                filteredOrganizations.map((org) => (
                  <tr key={org.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900">{org.name}</td>
                    <td className="py-3 px-4 font-mono font-bold text-[#211E4E]">{org.code}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
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
                Add
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
                  Org Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => {
                    setFormName(e.target.value);
                    if (formErrors.name) setFormErrors((prev) => ({ ...prev, name: '' }));
                  }}
                  placeholder="e.g., GANS, Eshara, YHA..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-[#C8A977]/30 focus:border-[#C8A977]"
                  autoFocus
                />
                {formErrors.name && <p className="text-[11px] text-red-600 mt-1 font-semibold">{formErrors.name}</p>}
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formCode}
                  onChange={(e) => {
                    setFormCode(e.target.value);
                    if (formErrors.code) setFormErrors((prev) => ({ ...prev, code: '' }));
                  }}
                  placeholder="e.g., GANS, ESH, YHA..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-[#C8A977]/30 focus:border-[#C8A977]"
                />
                {formErrors.code && <p className="text-[11px] text-red-600 mt-1 font-semibold">{formErrors.code}</p>}
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
                  className="px-5 py-2 bg-[#211E4E] hover:bg-[#2c2865] text-[#C8A977] border border-[#C8A977]/40 font-bold rounded-xl cursor-pointer transition-colors shadow-sm"
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
