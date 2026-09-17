import React, { useState, useMemo } from 'react';
import {
  History,
  Search,
  Calendar,
  X,
  CheckCircle2,
  Clock,
  Send,
  Users,
  UserX,
  AlertTriangle,
  Eye,
  Check,
  ChevronRight,
  Filter
} from 'lucide-react';
import {
  AssessmentReleaseRun,
  EmployeeProfile,
  SkippedEmployeeLna
} from '../types';
import { OrgAssessmentRecord } from '../data/orgAssessments';
import { HrReleaseDetailModal } from './HrReleaseDetailModal';

interface HrAssessmentHistoryViewProps {
  releaseRuns?: AssessmentReleaseRun[];
  releasedList?: any[];
  employees?: EmployeeProfile[];
  orgRecords?: OrgAssessmentRecord[];
  skippedEmployees?: SkippedEmployeeLna[];
  onToggleSkipEmployee?: (
    employeeId: string,
    releaseId: string,
    skip: boolean,
    reason?: string,
    remarks?: string
  ) => void;
  onRevokeRelease?: (employeeId: string) => void;
  onViewEmployeeDetail?: (employeeId: string) => void;
}

export const HrAssessmentHistoryView: React.FC<HrAssessmentHistoryViewProps> = ({
  releaseRuns = [],
  employees = [],
  orgRecords = [],
  skippedEmployees = [],
  onToggleSkipEmployee = () => {}
}) => {
  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'date' | 'deadline' | 'recipients' | 'failed' | 'skipped'>('newest');

  // Modal State for Selected Release Run
  const [selectedReleaseRun, setSelectedReleaseRun] = useState<AssessmentReleaseRun | null>(null);

  // Helper to extract breakdown counts for any run
  const getRunMetrics = (run: AssessmentReleaseRun) => {
    const delivered =
      run.deliveredCount !== undefined
        ? run.deliveredCount
        : run.outcomes
        ? run.outcomes.filter((o) => o.status === 'Delivered').length
        : run.emailsSent || run.totalEmployees;

    const skipped =
      run.skippedCount !== undefined
        ? run.skippedCount
        : run.outcomes
        ? run.outcomes.filter((o) => o.status === 'Skipped').length
        : 0;

    const failed =
      run.failedCount !== undefined
        ? run.failedCount
        : run.outcomes
        ? run.outcomes.filter((o) => o.status === 'Failed').length
        : 0;

    const total = run.totalEmployees || delivered + skipped + failed;

    return { total, delivered, skipped, failed };
  };

  // Global aggregate metrics across all runs
  const globalMetrics = useMemo(() => {
    let totalRuns = releaseRuns.length;
    let totalTargeted = 0;
    let totalDelivered = 0;
    let totalSkipped = 0;
    let totalFailed = 0;

    releaseRuns.forEach((run) => {
      const { total, delivered, skipped, failed } = getRunMetrics(run);
      totalTargeted += total;
      totalDelivered += delivered;
      totalSkipped += skipped;
      totalFailed += failed;
    });

    return {
      totalRuns,
      totalTargeted,
      totalDelivered,
      totalSkipped,
      totalFailed
    };
  }, [releaseRuns]);

  // Filter and Sort release runs
  const filteredRuns = useMemo(() => {
    return releaseRuns
      .filter((run) => {
        const { skipped, failed } = getRunMetrics(run);

        // 1. Search Query (Release ID or Target Scope)
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesId = run.releaseId.toLowerCase().includes(q);
          const matchesScope = (run.targetScope || '').toLowerCase().includes(q);
          const matchesRemarks = (run.remarks || '').toLowerCase().includes(q);
          if (!matchesId && !matchesScope && !matchesRemarks) {
            return false;
          }
        }

        // 2. Status / Category Filter
        if (statusFilter === 'HAS_FAILED') {
          return failed > 0;
        }
        if (statusFilter === 'HAS_SKIPPED') {
          return skipped > 0;
        }
        if (statusFilter !== 'ALL' && run.status !== statusFilter) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        const metricsA = getRunMetrics(a);
        const metricsB = getRunMetrics(b);

        if (sortBy === 'oldest') {
          return a.releaseId.localeCompare(b.releaseId);
        }
        if (sortBy === 'date') {
          return b.releaseDate.localeCompare(a.releaseDate);
        }
        if (sortBy === 'deadline') {
          return (b.deadlineDate || '').localeCompare(a.deadlineDate || '');
        }
        if (sortBy === 'recipients') {
          return metricsB.total - metricsA.total;
        }
        if (sortBy === 'failed') {
          return metricsB.failed - metricsA.failed;
        }
        if (sortBy === 'skipped') {
          return metricsB.skipped - metricsA.skipped;
        }
        // default: newest release ID
        return b.releaseId.localeCompare(a.releaseId);
      });
  }, [releaseRuns, searchQuery, statusFilter, sortBy]);

  const hasActiveFilters = searchQuery || statusFilter !== 'ALL';

  return (
    <div className="space-y-5 animate-in fade-in duration-300">

      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-[#1a5075] to-[#154668] rounded-xl p-5 text-white shadow-md border border-[#2b658f]">
        <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2.5">
          <History className="w-6 h-6 text-sky-300" />
          <span>Release History</span>
        </h1>
        <p className="text-xs text-sky-200 mt-1">
          Historical log of release runs and deadlines. Click any run to inspect its detailed delivery manifest.
        </p>
      </div>

      {/* 2. Search & Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Release ID, Cohort Scope, or remarks..."
              className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:border-[#0275a8] focus:bg-white focus:ring-1 focus:ring-[#0275a8]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2 flex-wrap text-xs">
            
            {/* Status Dropdown */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:outline-hidden focus:border-[#0275a8] cursor-pointer"
            >
              <option value="ALL">All Runs</option>
              <option value="In Progress">Status: In Progress</option>
              <option value="Delivered">Status: Delivered</option>
              <option value="Completed">Status: Completed</option>
              <option value="HAS_FAILED">Runs with Failed Records</option>
              <option value="HAS_SKIPPED">Runs with Skipped Records</option>
            </select>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:outline-hidden focus:border-[#0275a8] cursor-pointer"
            >
              <option value="newest">Sort: Release ID (Newest)</option>
              <option value="oldest">Sort: Release ID (Oldest)</option>
              <option value="date">Sort: Release Date</option>
              <option value="deadline">Sort: Deadline</option>
              <option value="recipients">Sort: Most Recipients</option>
              <option value="failed">Sort: Most Failed</option>
              <option value="skipped">Sort: Most Skipped</option>
            </select>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('ALL');
                }}
                className="px-3 py-2 text-xs text-[#0275a8] hover:bg-sky-50 rounded-lg font-bold transition-colors cursor-pointer border border-transparent hover:border-sky-200"
              >
                Reset
              </button>
            )}

          </div>
        </div>
      </div>

      {/* 3. Assessment Release Runs Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-[#1a5075] text-white font-bold border-b border-[#144262]">
                <th className="py-3 px-4 min-w-[130px] text-center">Release ID</th>
                <th className="py-3 px-4 min-w-[120px] text-center">Release Date</th>
                <th className="py-3 px-4 min-w-[110px] text-center">Deadline</th>
                <th className="py-3 px-4 min-w-[120px] text-center">Release Count</th>
                <th className="py-3 px-4 min-w-[110px] text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredRuns.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-500">
                    <History className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                    <p className="font-bold text-sm text-slate-700">No release runs found</p>
                    <p className="text-xs text-slate-400 mt-1">
                      {hasActiveFilters
                        ? 'Try adjusting your search terms or status filter.'
                        : 'Release from Employee Master to log new release runs.'}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredRuns.map((run) => {
                  const isCompleted = run.status === 'Completed';
                  const isInProgress = run.status === 'In Progress';
                  const isDelivered = run.status === 'Delivered' || run.status === 'Sent';

                  return (
                    <tr
                      key={run.releaseId}
                      onClick={() => setSelectedReleaseRun(run)}
                      className="hover:bg-sky-50/70 transition-colors cursor-pointer group"
                    >
                      {/* Release ID */}
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className="font-mono font-extrabold text-[#0275a8] group-hover:text-[#014d70] group-hover:underline text-xs transition-colors inline-flex items-center gap-1"
                          title="Click to view details for this run"
                        >
                          <span>{run.releaseId}</span>
                        </span>
                      </td>

                      {/* Release Date */}
                      <td className="py-3.5 px-4 text-slate-700 font-medium text-xs text-center">
                        <div className="inline-flex items-center justify-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{run.releaseDate}</span>
                        </div>
                      </td>

                      {/* Deadline */}
                      <td className="py-3.5 px-4 text-slate-700 font-medium text-xs text-center">
                        <div className="inline-flex items-center justify-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                          <span>{run.deadlineDate || '-'}</span>
                        </div>
                      </td>

                      {/* Release Count */}
                      <td className="py-3.5 px-4 text-center">
                        <span className="font-bold text-slate-800 text-xs">
                          {run.totalEmployees} Employees
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                            isCompleted
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : isInProgress
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : isDelivered
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : 'bg-slate-100 text-slate-700 border border-slate-200'
                          }`}
                        >
                          {isCompleted ? (
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          ) : isInProgress ? (
                            <Clock className="w-3 h-3 text-amber-600" />
                          ) : (
                            <Send className="w-3 h-3 text-blue-600" />
                          )}
                          <span>{run.status}</span>
                        </span>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Release Detail Modal (Shows when clicking each run) */}
      <HrReleaseDetailModal
        releaseRun={selectedReleaseRun}
        isOpen={!!selectedReleaseRun}
        onClose={() => setSelectedReleaseRun(null)}
        employees={employees}
        orgRecords={orgRecords}
        skippedEmployees={skippedEmployees}
        onToggleSkipEmployee={onToggleSkipEmployee}
      />

    </div>
  );
};

