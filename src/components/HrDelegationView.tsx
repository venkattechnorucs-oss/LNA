import React, { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  Calendar,
  X,
  Send,
  Trash2,
  Edit2,
  UserCheck,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  AlertCircle,
  User,
  Building2
} from 'lucide-react';
import { ManagerDelegation, EmployeeProfile } from '../types';

export type DelegationEntity = 'GANS' | 'Eshara' | 'YHA';

interface HrDelegationViewProps {
  delegations: ManagerDelegation[];
  employees: EmployeeProfile[];
  onAddDelegation: (delegation: Omit<ManagerDelegation, 'id' | 'createdAt'>) => void;
  onUpdateDelegation: (id: string, updated: Partial<ManagerDelegation>) => void;
  onDeleteDelegation: (id: string) => void;
}

export const HrDelegationView: React.FC<HrDelegationViewProps> = ({
  delegations,
  employees,
  onAddDelegation,
  onUpdateDelegation,
  onDeleteDelegation
}) => {
  // Entity state for the popup modal
  const [selectedEntity, setSelectedEntity] = useState<DelegationEntity>('GANS');

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDelegation, setEditingDelegation] = useState<ManagerDelegation | null>(null);

  // Form Fields
  const [fromEmpId, setFromEmpId] = useState('');
  const [toEmpId, setToEmpId] = useState('');
  const [startDate, setStartDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [endDate, setEndDate] = useState(
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [remarks, setRemarks] = useState('');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Relevant employees for the modal based on selected entity
  const modalEmployees = useMemo(() => {
    const list = employees.filter((e) => (e.entity || 'GANS') === selectedEntity);
    return list.length > 0 ? list : employees;
  }, [employees, selectedEntity]);

  // Reset or initialize form
  const handleOpenNewModal = () => {
    setEditingDelegation(null);
    setSelectedEntity('GANS');
    const pool = employees.filter((e) => (e.entity || 'GANS') === 'GANS');
    const candidateList = pool.length >= 2 ? pool : employees;
    setFromEmpId(candidateList[0]?.employeeId || '');
    setToEmpId(candidateList[1]?.employeeId || '');
    setStartDate(new Date().toISOString().split('T')[0]);
    setEndDate(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
    setRemarks('');
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (del: ManagerDelegation) => {
    setEditingDelegation(del);
    const delEntity = (del.entity as DelegationEntity) || 'GANS';
    setSelectedEntity(delEntity);
    setFromEmpId(del.fromEmployeeId);
    setToEmpId(del.toEmployeeId);
    setStartDate(del.startDate);
    setEndDate(del.endDate || new Date().toISOString().split('T')[0]);
    setRemarks(del.remarks || '');
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingDelegation(null);
    setFormErrors({});
  };

  // Form Validation and Submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};

    if (!fromEmpId) {
      errors.fromEmpId = 'Please select the delegating manager/employee (From)';
    }
    if (!toEmpId) {
      errors.toEmpId = 'Please select the delegate manager (To)';
    }
    if (fromEmpId && toEmpId && fromEmpId === toEmpId) {
      errors.toEmpId = 'The delegate manager must be different from the delegating manager';
    }
    if (!startDate) {
      errors.startDate = 'Please select a valid start date';
    }
    if (!endDate) {
      errors.endDate = 'Please select a valid end date';
    } else if (startDate && new Date(endDate) < new Date(startDate)) {
      errors.endDate = 'End date must be on or after start date';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const fromProfile = employees.find((e) => e.employeeId === fromEmpId);
    const toProfile = employees.find((e) => e.employeeId === toEmpId);

    const fromName = fromProfile ? fromProfile.name : fromEmpId;
    const fromRole = fromProfile ? fromProfile.position : 'Manager';
    const fromDepartment = fromProfile ? fromProfile.department : undefined;

    const toName = toProfile ? toProfile.name : toEmpId;
    const toRole = toProfile ? toProfile.position : 'Manager';
    const toDepartment = toProfile ? toProfile.department : undefined;

    if (editingDelegation) {
      onUpdateDelegation(editingDelegation.id, {
        fromEmployeeId: fromEmpId,
        fromName,
        fromRole,
        fromDepartment,
        toEmployeeId: toEmpId,
        toName,
        toRole,
        toDepartment,
        startDate,
        endDate,
        remarks: remarks.trim() || undefined,
        entity: selectedEntity
      });
    } else {
      onAddDelegation({
        fromEmployeeId: fromEmpId,
        fromName,
        fromRole,
        fromDepartment,
        toEmployeeId: toEmpId,
        toName,
        toRole,
        toDepartment,
        startDate,
        endDate,
        status: 'Active',
        remarks: remarks.trim() || undefined,
        createdBy: 'HR Admin',
        entity: selectedEntity
      });
    }

    handleCloseModal();
  };

  // Filter and search records
  const filteredDelegations = useMemo(() => {
    return delegations.filter((item) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchFrom = item.fromName.toLowerCase().includes(q) || item.fromEmployeeId.toLowerCase().includes(q);
        const matchTo = item.toName.toLowerCase().includes(q) || item.toEmployeeId.toLowerCase().includes(q);
        const matchRemarks = (item.remarks || '').toLowerCase().includes(q);
        if (!matchFrom && !matchTo && !matchRemarks) return false;
      }
      return true;
    });
  }, [delegations, searchQuery]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredDelegations.length / itemsPerPage));
  const paginatedDelegations = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredDelegations.slice(start, start + itemsPerPage);
  }, [filteredDelegations, currentPage, itemsPerPage]);

  const getInitials = (name: string) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  // Avatar background colors aligned with GANS brand palette (Navy, Teal, Ocean, Sky, Slate)
  const getAvatarBg = (name: string, isFrom = true) => {
    const colors = isFrom
      ? [
          'bg-[#1a5075] text-white',
          'bg-[#154668] text-white',
          'bg-[#0f344d] text-white',
          'bg-slate-700 text-white'
        ]
      : [
          'bg-[#0275a8] text-white',
          'bg-[#01628d] text-white',
          'bg-[#0388c4] text-white',
          'bg-[#0e7490] text-white'
        ];
    const index = Math.abs(name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)) % colors.length;
    return colors[index];
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-150">
      
      {/* =========================================================================
          TOP ACTION BAR (Matches GANS Header styling)
          ========================================================================= */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        
        {/* Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-50 text-[#0275a8] flex items-center justify-center border border-sky-200 shadow-2xs">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                Delegation
              </h1>
              <span className="bg-sky-50 text-[#1a5075] text-xs font-black px-2.5 py-0.5 rounded-full border border-sky-200">
                {delegations.length} Records
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Assign manager review authority and line of reporting.
            </p>
          </div>
        </div>

        {/* Right Controls: Search Box + Add Button */}
        <div className="flex items-center gap-2.5">
          {/* Search Box */}
          <div className="relative min-w-[200px] sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search delegation..."
              className="w-full pl-8 pr-7 py-2 text-xs bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:border-[#0275a8] focus:ring-2 focus:ring-[#0275a8]/20 transition-all text-slate-800"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Primary "+ Add Delegation" Button */}
          <button
            type="button"
            onClick={handleOpenNewModal}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-[#1a5075] to-[#0275a8] hover:from-[#154668] hover:to-[#01628d] text-white text-xs font-bold rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer active:scale-95 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add Delegation</span>
          </button>
        </div>

      </div>

      {/* =========================================================================
          DELEGATION TABLE (Matches GANS Master Tables Header Theme)
          ========================================================================= */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col">
        <div className="overflow-x-auto min-h-[340px]">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#f0f7fb] text-[#1a5075] border-b border-[#c8d8e5] font-extrabold uppercase tracking-wider text-[11px] shadow-2xs">
                <th className="py-3.5 px-5 min-w-[220px] border-r border-slate-200/80">From</th>
                <th className="py-3.5 px-5 min-w-[220px] border-r border-slate-200/80">To</th>
                <th className="py-3.5 px-4 min-w-[140px] text-center border-r border-slate-200/80">Start Date</th>
                <th className="py-3.5 px-4 min-w-[140px] text-center border-r border-slate-200/80">End Date</th>
                <th className="py-3.5 px-4 min-w-[110px] text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedDelegations.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-14 text-center text-slate-500 bg-white">
                    <UserCheck className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                    <p className="font-bold text-slate-700 text-sm">No delegations found</p>
                    <p className="text-xs text-slate-400 mt-1">
                      {searchQuery
                        ? 'Try clearing the search query.'
                        : 'Click "+ Add Delegation" to configure a manager delegation.'}
                    </p>
                    {!searchQuery && (
                      <button
                        type="button"
                        onClick={handleOpenNewModal}
                        className="mt-3.5 inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-[#1a5075] to-[#0275a8] text-white text-xs font-bold rounded-xl shadow-xs hover:from-[#154668] hover:to-[#01628d] cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Create First Delegation</span>
                      </button>
                    )}
                  </td>
                </tr>
              ) : (
                paginatedDelegations.map((item, idx) => {
                  return (
                    <tr
                      key={item.id}
                      className={`hover:bg-[#f0f7fb]/50 transition-colors ${
                        idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/40'
                      }`}
                    >
                      {/* From Column (Avatar + Name only) */}
                      <td className="py-3.5 px-5 border-r border-slate-100">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs shadow-2xs shrink-0 ${getAvatarBg(
                              item.fromName,
                              true
                            )}`}
                          >
                            {getInitials(item.fromName)}
                          </div>
                          <div className="min-w-0">
                            <span className="font-bold text-slate-900 text-xs truncate">
                              {item.fromName}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* To Column (Avatar + Name only) */}
                      <td className="py-3.5 px-5 border-r border-slate-100">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs shadow-2xs shrink-0 ${getAvatarBg(
                              item.toName,
                              false
                            )}`}
                          >
                            {getInitials(item.toName)}
                          </div>
                          <div className="min-w-0">
                            <span className="font-bold text-slate-900 text-xs truncate">
                              {item.toName}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Start Date */}
                      <td className="py-3.5 px-4 text-center font-semibold text-slate-700 border-r border-slate-100">
                        {item.startDate}
                      </td>

                      {/* End Date */}
                      <td className="py-3.5 px-4 text-center font-semibold text-slate-700 border-r border-slate-100">
                        {item.endDate || '-'}
                      </td>

                      {/* Action Column (Edit and Delete only) */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="inline-flex items-center justify-center gap-2">
                          {/* Edit Button */}
                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(item)}
                            className="p-1.5 rounded-lg bg-slate-50 hover:bg-sky-50 text-slate-600 hover:text-[#0275a8] border border-slate-200 hover:border-sky-300 transition-colors cursor-pointer"
                            title="Edit Delegation"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete Button */}
                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm(`Are you sure you want to delete the delegation from "${item.fromName}" to "${item.toName}"?`)) {
                                onDeleteDelegation(item.id);
                              }
                            }}
                            className="p-1.5 rounded-lg bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-600 border border-slate-200 hover:border-red-200 transition-colors cursor-pointer"
                            title="Delete Delegation"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
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

        {/* =========================================================================
            PAGINATION CONTROLS (Aligned with GANS Theme)
            ========================================================================= */}
        <div className="p-3.5 bg-white border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <div>
            Showing <strong className="text-slate-800">{filteredDelegations.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}</strong> to{' '}
            <strong className="text-slate-800">
              {Math.min(currentPage * itemsPerPage, filteredDelegations.length)}
            </strong>{' '}
            of <strong className="text-slate-800">{filteredDelegations.length}</strong> delegations
          </div>

          <div className="flex items-center gap-1 font-bold">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(1)}
              className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
              title="First Page"
            >
              <ChevronsLeft className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
              title="Previous Page"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>

            {Array.from({ length: totalPages }).map((_, i) => {
              const pageNum = i + 1;
              return (
                <button
                  key={pageNum}
                  type="button"
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-7 h-7 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    currentPage === pageNum
                      ? 'bg-gradient-to-r from-[#1a5075] to-[#0275a8] text-white shadow-xs'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
              title="Next Page"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(totalPages)}
              className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
              title="Last Page"
            >
              <ChevronsRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

      {/* =========================================================================
          NEW / EDIT DELEGATION MODAL (Matching GANS Modal Palette)
          ========================================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150 flex flex-col">
            
            {/* Modal Header */}
            <div className="p-5 bg-gradient-to-r from-[#1a5075] via-[#154668] to-[#0275a8] text-white flex items-center justify-between gap-4 border-b border-white/10 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-white/15 flex items-center justify-center text-white backdrop-blur-xs">
                  <UserCheck className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-black tracking-tight text-white">
                    {editingDelegation ? 'Edit Delegation' : 'New Delegation'}
                  </h2>
                  <p className="text-[11px] text-sky-100">
                    Configure manager review authority and assignment dates
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleCloseModal}
                className="p-1.5 rounded-xl hover:bg-white/20 text-white/80 hover:text-white transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form Content */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
              
              {/* Field 0: Entity * */}
              <div className="space-y-1.5">
                <label className="block font-bold text-slate-700 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-[#0275a8]" />
                  <span>Entity</span> <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedEntity}
                  onChange={(e) => {
                    const nextEnt = e.target.value as DelegationEntity;
                    setSelectedEntity(nextEnt);
                    const entEmps = employees.filter((emp) => (emp.entity || 'GANS') === nextEnt);
                    const candidatePool = entEmps.length >= 2 ? entEmps : employees;
                    setFromEmpId(candidatePool[0]?.employeeId || '');
                    setToEmpId(candidatePool[1]?.employeeId || '');
                  }}
                  className="w-full px-3.5 py-2.5 bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 shadow-2xs focus:outline-hidden focus:border-[#0275a8] focus:ring-2 focus:ring-[#0275a8]/20 transition-all cursor-pointer"
                >
                  <option value="GANS">GANS</option>
                  <option value="Eshara">Eshara</option>
                  <option value="YHA">YHA</option>
                </select>
              </div>

              {/* Field 1: From * */}
              <div className="space-y-1.5">
                <label className="block font-bold text-slate-700 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#0275a8]" />
                  <span>From</span> <span className="text-red-500">*</span>
                </label>
                <select
                  value={fromEmpId}
                  onChange={(e) => {
                    setFromEmpId(e.target.value);
                    if (formErrors.fromEmpId) {
                      setFormErrors((prev) => ({ ...prev, fromEmpId: '' }));
                    }
                  }}
                  className={`w-full px-3.5 py-2.5 bg-slate-50 hover:bg-white focus:bg-white border rounded-xl text-xs font-semibold text-slate-800 shadow-2xs focus:outline-hidden focus:border-[#0275a8] focus:ring-2 focus:ring-[#0275a8]/20 transition-all ${
                    formErrors.fromEmpId ? 'border-red-400 bg-red-50/20' : 'border-slate-200'
                  }`}
                >
                  <option value="" disabled>Select From</option>
                  {modalEmployees.map((emp) => (
                    <option key={emp.employeeId} value={emp.employeeId}>
                      {emp.name} ({emp.position || 'Staff'} • {emp.department || 'General'})
                    </option>
                  ))}
                </select>
                {formErrors.fromEmpId && (
                  <p className="text-[11px] text-red-600 font-medium flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{formErrors.fromEmpId}</span>
                  </p>
                )}
              </div>

              {/* Field 2: To * */}
              <div className="space-y-1.5">
                <label className="block font-bold text-slate-700 flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-[#0275a8]" />
                  <span>To</span> <span className="text-red-500">*</span>
                </label>
                <select
                  value={toEmpId}
                  onChange={(e) => {
                    setToEmpId(e.target.value);
                    if (formErrors.toEmpId) {
                      setFormErrors((prev) => ({ ...prev, toEmpId: '' }));
                    }
                  }}
                  className={`w-full px-3.5 py-2.5 bg-slate-50 hover:bg-white focus:bg-white border rounded-xl text-xs font-semibold text-slate-800 shadow-2xs focus:outline-hidden focus:border-[#0275a8] focus:ring-2 focus:ring-[#0275a8]/20 transition-all ${
                    formErrors.toEmpId ? 'border-red-400 bg-red-50/20' : 'border-slate-200'
                  }`}
                >
                  <option value="" disabled>Select To</option>
                  {modalEmployees
                    .filter((emp) => emp.employeeId !== fromEmpId)
                    .map((emp) => (
                      <option key={emp.employeeId} value={emp.employeeId}>
                        {emp.name} ({emp.position || 'Staff'} • {emp.department || 'General'})
                      </option>
                    ))}
                </select>
                {formErrors.toEmpId && (
                  <p className="text-[11px] text-red-600 font-medium flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{formErrors.toEmpId}</span>
                  </p>
                )}
              </div>

              {/* Field 3: Start Date * */}
              <div className="space-y-1.5">
                <label className="block font-bold text-slate-700 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#0275a8]" />
                  <span>Start Date</span> <span className="text-red-500">*</span>
                </label>
                <div className="relative flex items-center">
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => {
                      setStartDate(e.target.value);
                      if (formErrors.startDate) {
                        setFormErrors((prev) => ({ ...prev, startDate: '' }));
                      }
                    }}
                    className={`w-full px-3.5 py-2.5 bg-slate-50 hover:bg-white focus:bg-white border rounded-xl text-xs font-semibold text-slate-800 shadow-2xs focus:outline-hidden focus:border-[#0275a8] focus:ring-2 focus:ring-[#0275a8]/20 transition-all ${
                      formErrors.startDate ? 'border-red-400 bg-red-50/20' : 'border-slate-200'
                    }`}
                  />
                  <div className="absolute right-2.5 top-1/2 -translate-y-1/2 bg-[#0275a8] text-white p-1.5 rounded-lg pointer-events-none">
                    <Calendar className="w-3.5 h-3.5" />
                  </div>
                </div>
                {formErrors.startDate && (
                  <p className="text-[11px] text-red-600 font-medium flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{formErrors.startDate}</span>
                  </p>
                )}
              </div>

              {/* Field 4: End Date * */}
              <div className="space-y-1.5">
                <label className="block font-bold text-slate-700 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#0275a8]" />
                  <span>End Date</span> <span className="text-red-500">*</span>
                </label>
                <div className="relative flex items-center">
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => {
                      setEndDate(e.target.value);
                      if (formErrors.endDate) {
                        setFormErrors((prev) => ({ ...prev, endDate: '' }));
                      }
                    }}
                    className={`w-full px-3.5 py-2.5 bg-slate-50 hover:bg-white focus:bg-white border rounded-xl text-xs font-semibold text-slate-800 shadow-2xs focus:outline-hidden focus:border-[#0275a8] focus:ring-2 focus:ring-[#0275a8]/20 transition-all ${
                      formErrors.endDate ? 'border-red-400 bg-red-50/20' : 'border-slate-200'
                    }`}
                  />
                  <div className="absolute right-2.5 top-1/2 -translate-y-1/2 bg-[#0275a8] text-white p-1.5 rounded-lg pointer-events-none">
                    <Calendar className="w-3.5 h-3.5" />
                  </div>
                </div>
                {formErrors.endDate && (
                  <p className="text-[11px] text-red-600 font-medium flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{formErrors.endDate}</span>
                  </p>
                )}
              </div>

              {/* Optional Remarks */}
              <div className="space-y-1.5">
                <label className="block font-bold text-slate-700">
                  Remarks / Purpose <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="e.g. Leave Coverage, Interim Line Manager..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:border-[#0275a8] focus:ring-2 focus:ring-[#0275a8]/20 transition-all placeholder:text-slate-400"
                />
              </div>

              {/* Footer Actions: Cancel + Save */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 text-xs font-bold rounded-xl shadow-2xs transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Cancel</span>
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-gradient-to-r from-[#1a5075] to-[#0275a8] hover:from-[#154668] hover:to-[#01628d] text-white text-xs font-bold rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Save</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
