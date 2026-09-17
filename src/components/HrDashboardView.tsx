import React, { useState, useMemo } from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Sector } from 'recharts';
import { OrgAssessmentRecord, getRecordYear } from '../data/orgAssessments';
import { HrEmployeeDetailModal } from './HrEmployeeDetailModal';
import {
  FUNCTIONAL_COMPETENCIES,
  BEHAVIORAL_COMPETENCIES
} from '../data/lnaData';
import {
  Users,
  CheckCircle2,
  Clock,
  RotateCcw,
  AlertCircle,
  Filter,
  Search,
  ChevronRight,
  TrendingUp,
  Award,
  Layers,
  Sparkles,
  BarChart3,
  PieChart as PieChartIcon,
  Eye,
  RefreshCw,
  Building,
  Briefcase,
  Calendar,
  Activity
} from 'lucide-react';

interface HrDashboardViewProps {
  records: OrgAssessmentRecord[];
  onSwitchRole?: (role: 'employee' | 'manager' | 'hr') => void;
  onViewEmployeeDetail?: (employeeId: string) => void;
}

export const HrDashboardView: React.FC<HrDashboardViewProps> = ({
  records,
  onSwitchRole,
  onViewEmployeeDetail
}) => {
  // Filter States
  const [selectedYear, setSelectedYear] = useState<string>('2026');
  const [selectedDivision, setSelectedDivision] = useState<string>('ALL');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('ALL');
  const [selectedPosition, setSelectedPosition] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [searchType, setSearchType] = useState<'employee' | 'manager'>('employee');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Active Slice Highlight States for Graphs
  const [activeStatusIndex, setActiveStatusIndex] = useState<number | null>(null);
  const [activeCategoryIndex, setActiveCategoryIndex] = useState<number | null>(null);
  const [activeDivisionIndex, setActiveDivisionIndex] = useState<number | null>(null);

  // Dynamic filter options extracted from records
  const filterOptions = useMemo(() => {
    const rawYears = Array.from(new Set(records.map((r) => getRecordYear(r).toString())));
    ['2026', '2025', '2024'].forEach((y) => {
      if (!rawYears.includes(y)) rawYears.push(y);
    });
    const years = rawYears.sort((a, b) => Number(b) - Number(a));

    const divisions = Array.from(new Set(records.map((r) => r.employee.division))).sort();
    const departments = Array.from(
      new Set(
        records
          .filter((r) => selectedDivision === 'ALL' || r.employee.division === selectedDivision)
          .map((r) => r.employee.department)
      )
    ).sort();
    const positions = Array.from(new Set(records.map((r) => r.employee.position))).sort();

    return { years, divisions, departments, positions };
  }, [records, selectedDivision]);

  // Filtered Records based on user selections
  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      // Year filter
      if (selectedYear !== 'ALL' && getRecordYear(r).toString() !== selectedYear) return false;

      // Division filter
      if (selectedDivision !== 'ALL' && r.employee.division !== selectedDivision) return false;

      // Department filter
      if (selectedDepartment !== 'ALL' && r.employee.department !== selectedDepartment) return false;

      // Position filter
      if (selectedPosition !== 'ALL' && r.employee.position !== selectedPosition) return false;

      // Status filter
      if (selectedStatus !== 'ALL' && r.status !== selectedStatus) return false;

      // Search query (Search Employee vs Search Manager)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        if (searchType === 'employee') {
          const nameMatch = r.employee.name.toLowerCase().includes(query);
          const idMatch = r.employee.employeeId.toLowerCase().includes(query);
          const emailMatch = (r.employee.email || '').toLowerCase().includes(query);
          if (!nameMatch && !idMatch && !emailMatch) return false;
        } else {
          const managerMatch = (r.employee.reportingManager || '').toLowerCase().includes(query);
          if (!managerMatch) return false;
        }
      }

      return true;
    });
  }, [records, selectedYear, selectedDivision, selectedDepartment, selectedPosition, selectedStatus, searchType, searchQuery]);

  // Key Metrics Calculated Dynamically from filtered data
  const metrics = useMemo(() => {
    const total = filteredRecords.length;
    const pendingEmployee = filteredRecords.filter((r) => r.status === 'PENDING EMPLOYEE SUBMISSION').length;
    const submittedToManager = filteredRecords.filter((r) => r.status === 'SUBMITTED FOR MANAGER REVIEW').length;
    const pendingManagerReview = submittedToManager; // In manager review stage
    const sentBack = filteredRecords.filter((r) => r.status === 'SENT BACK TO EMPLOYEE').length;
    const managerApproved = filteredRecords.filter((r) => r.status === 'MANAGER APPROVED').length;
    const lnaCompleted = managerApproved; // Completed & Approved

    const completionRate = total > 0 ? Math.round((managerApproved / total) * 100) : 0;
    const submissionRate = total > 0 ? Math.round(((total - pendingEmployee) / total) * 100) : 0;

    return {
      total,
      lnaCompleted,
      pendingEmployee,
      submittedToManager,
      pendingManagerReview,
      sentBack,
      managerApproved,
      completionRate,
      submissionRate
    };
  }, [filteredRecords]);

  // Competency Analytics: Aggregating all selections across submissions
  const competencyAnalytics = useMemo(() => {
    const functionalCounts: Record<string, { name: string; code: string; count: number }> = {};
    const behavioralCounts: Record<string, { name: string; code: string; count: number }> = {};

    // Initialize all catalog competencies with 0 count
    FUNCTIONAL_COMPETENCIES.forEach((c) => {
      functionalCounts[c.id] = { name: c.name, code: c.code, count: 0 };
    });
    BEHAVIORAL_COMPETENCIES.forEach((c) => {
      behavioralCounts[c.id] = { name: c.name, code: c.code, count: 0 };
    });

    // Count selections from filtered records with submissions
    filteredRecords.forEach((r) => {
      if (r.submission && r.submission.selectedItems) {
        r.submission.selectedItems.forEach((item) => {
          if (item.competency.category === 'Functional') {
            if (functionalCounts[item.competency.id]) {
              functionalCounts[item.competency.id].count += 1;
            } else {
              functionalCounts[item.competency.id] = {
                name: item.competency.name,
                code: item.competency.code,
                count: 1
              };
            }
          } else {
            if (behavioralCounts[item.competency.id]) {
              behavioralCounts[item.competency.id].count += 1;
            } else {
              behavioralCounts[item.competency.id] = {
                name: item.competency.name,
                code: item.competency.code,
                count: 1
              };
            }
          }
        });
      }
    });

    const functionalList = Object.values(functionalCounts).sort((a, b) => b.count - a.count);
    const behavioralList = Object.values(behavioralCounts).sort((a, b) => b.count - a.count);

    const maxCount = Math.max(
      ...functionalList.map((f) => f.count),
      ...behavioralList.map((b) => b.count),
      1
    );

    return { functionalList, behavioralList, maxCount };
  }, [filteredRecords]);

  // Skill Analytics: Aggregating all skills selected across submissions
  const skillAnalytics = useMemo(() => {
    const skillMap: Record<
      string,
      { id: string; name: string; code: string; category: string; count: number; competencyName: string }
    > = {};

    filteredRecords.forEach((r) => {
      if (r.submission && r.submission.selectedItems) {
        r.submission.selectedItems.forEach((item) => {
          const key = item.skill.id;
          if (!skillMap[key]) {
            skillMap[key] = {
              id: item.skill.id,
              name: item.skill.name,
              code: item.skill.code,
              category: item.competency.category,
              competencyName: item.competency.name,
              count: 0
            };
          }
          skillMap[key].count += 1;
        });
      }
    });

    return Object.values(skillMap).sort((a, b) => b.count - a.count);
  }, [filteredRecords]);

  // Power BI Graph Datasets
  const statusDonutData = useMemo(() => {
    return [
      { name: 'APPROVED', value: metrics.managerApproved, color: '#047857', bg: 'bg-emerald-600', statusKey: 'MANAGER APPROVED' },
      { name: 'PENDING APPROVAL', value: metrics.submittedToManager, color: '#1a5075', bg: 'bg-[#1a5075]', statusKey: 'SUBMITTED FOR MANAGER REVIEW' },
      { name: 'RETURNED', value: metrics.sentBack, color: '#f59e0b', bg: 'bg-amber-500', statusKey: 'SENT BACK TO EMPLOYEE' },
    ];
  }, [metrics]);

  const categoryPieData = useMemo(() => {
    const totalFunc = competencyAnalytics.functionalList.reduce((acc, c) => acc + c.count, 0);
    const totalBeh = competencyAnalytics.behavioralList.reduce((acc, c) => acc + c.count, 0);
    return [
      { name: 'Functional Competencies', value: totalFunc, color: '#0275a8', bg: 'bg-[#0275a8]' },
      { name: 'Behavioral Competencies', value: totalBeh, color: '#10b981', bg: 'bg-emerald-500' }
    ];
  }, [competencyAnalytics]);

  const divisionPieData = useMemo(() => {
    const counts: Record<string, number> = {};
    filteredRecords.forEach((r) => {
      counts[r.employee.division] = (counts[r.employee.division] || 0) + 1;
    });
    const palette = ['#1a5075', '#0275a8', '#0d9488', '#3b82f6', '#8b5cf6', '#f59e0b', '#ec4899'];
    return Object.entries(counts)
      .map(([name, value], idx) => ({
        name,
        value,
        color: palette[idx % palette.length]
      }))
      .sort((a, b) => b.value - a.value);
  }, [filteredRecords]);

  // Reset all filters
  const handleResetFilters = () => {
    setSelectedYear('2026');
    setSelectedDivision('ALL');
    setSelectedDepartment('ALL');
    setSelectedPosition('ALL');
    setSelectedStatus('ALL');
    setSearchType('employee');
    setSearchQuery('');
  };

  const hasActiveFilters =
    selectedYear !== '2026' ||
    selectedDivision !== 'ALL' ||
    selectedDepartment !== 'ALL' ||
    selectedPosition !== 'ALL' ||
    selectedStatus !== 'ALL' ||
    searchQuery.trim() !== '';

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* 1. DASHBOARD HEADER & YEAR FILTER ACTION (GLASSMORPHIC BANNER) */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1a5075] via-[#104060] to-[#0d2f47] p-5 sm:p-6 text-white shadow-[0_12px_36px_-6px_rgba(26,80,117,0.35)] border border-white/20 backdrop-blur-xl">
        {/* Ambient background light orbs */}
        <div className="absolute -right-8 -top-8 w-56 h-56 bg-sky-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 -bottom-10 w-48 h-48 bg-teal-400/15 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white drop-shadow-xs">
              Learning Needs Analysis (LNA) – HR Dashboard
            </h1>
          </div>

          {/* Year Filter Option */}
          <div className="flex items-center gap-2.5 bg-white/15 hover:bg-white/20 transition-colors backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/25 shadow-[0_4px_16px_rgba(0,0,0,0.15)] shrink-0">
            <Calendar className="w-4 h-4 text-sky-300 shrink-0" />
            <label htmlFor="hr-header-year-select" className="text-xs font-bold text-sky-100 whitespace-nowrap">
              Year:
            </label>
            <select
              id="hr-header-year-select"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="bg-[#0b3350] text-white font-bold text-xs rounded-lg px-3 py-1.5 border border-white/30 focus:outline-hidden focus:ring-2 focus:ring-sky-400 cursor-pointer transition-all shadow-inner"
            >
              {filterOptions.years.map((yr) => (
                <option key={yr} value={yr} className="bg-[#104060] text-white font-medium">
                  {yr} {yr === '2026' ? '(Active)' : ''}
                </option>
              ))}
              <option value="ALL" className="bg-[#104060] text-white font-medium">All Years</option>
            </select>
          </div>
        </div>
      </div>

      {/* 2. OVERVIEW METRICS CARDS (4 ULTRA-GLASSMORPHIC ACRYLIC TILES) */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        
        {/* Card 1: TOTAL EMPLOYEES */}
        <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-b from-white/95 via-white/80 to-white/65 backdrop-blur-2xl border border-white/90 p-4 shadow-[0_10px_30px_rgba(26,80,117,0.06),inset_0_1px_1px_rgba(255,255,255,1)] hover:shadow-[0_16px_36px_rgba(26,80,117,0.14)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#1a5075] via-[#0275a8] to-sky-400" />
          <div className="absolute -right-6 -bottom-6 w-20 h-20 bg-sky-500/10 rounded-full blur-xl pointer-events-none group-hover:bg-sky-500/20 transition-all duration-300" />
          
          <div className="flex items-center justify-between relative z-10">
            <span className="text-[10px] sm:text-[11px] font-extrabold text-slate-500 uppercase tracking-tight">
              TOTAL EMPLOYEES
            </span>
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#1a5075]/15 to-[#0275a8]/20 text-[#1a5075] flex items-center justify-center border border-[#1a5075]/20 shadow-[0_2px_8px_rgba(26,80,117,0.12)] group-hover:scale-105 transition-transform">
              <Users className="w-4 h-4" />
            </div>
          </div>
          
          <div className="mt-3.5 relative z-10">
            <div className="text-2xl sm:text-3xl font-black text-[#1a5075] tracking-tight leading-none">
              {metrics.total}
            </div>
          </div>
        </div>
        {/* Card 3: PENDING APPROVAL */}
        <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-b from-white/95 via-white/80 to-white/65 backdrop-blur-2xl border border-white/90 p-4 shadow-[0_10px_30px_rgba(26,80,117,0.08),inset_0_1px_1px_rgba(255,255,255,1)] hover:shadow-[0_16px_36px_rgba(26,80,117,0.16)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#1a5075] via-indigo-500 to-sky-400" />
          <div className="absolute -right-6 -bottom-6 w-20 h-20 bg-indigo-500/10 rounded-full blur-xl pointer-events-none group-hover:bg-indigo-500/20 transition-all duration-300" />
          
          <div className="flex items-center justify-between relative z-10">
            <span className="text-[10px] sm:text-[11px] font-extrabold text-[#1a5075] uppercase tracking-tight">
              PENDING APPROVAL
            </span>
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#1a5075]/20 to-indigo-500/20 text-[#1a5075] flex items-center justify-center border border-[#1a5075]/25 shadow-[0_2px_8px_rgba(26,80,117,0.15)] group-hover:scale-105 transition-transform">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          
          <div className="mt-3.5 relative z-10">
            <div className="text-2xl sm:text-3xl font-black text-[#1a5075] tracking-tight leading-none">
              {metrics.pendingManagerReview}
            </div>
          </div>
        </div>

        {/* Card 4: RETURNED */}
        <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-b from-white/95 via-white/80 to-white/65 backdrop-blur-2xl border border-white/90 p-4 shadow-[0_10px_30px_rgba(245,158,11,0.08),inset_0_1px_1px_rgba(255,255,255,1)] hover:shadow-[0_16px_36px_rgba(245,158,11,0.16)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-orange-400 to-yellow-300" />
          <div className="absolute -right-6 -bottom-6 w-20 h-20 bg-amber-500/10 rounded-full blur-xl pointer-events-none group-hover:bg-amber-500/20 transition-all duration-300" />
          
          <div className="flex items-center justify-between relative z-10">
            <span className="text-[10px] sm:text-[11px] font-extrabold text-amber-900 uppercase tracking-tight">
              RETURNED
            </span>
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 text-amber-700 flex items-center justify-center border border-amber-500/25 shadow-[0_2px_8px_rgba(245,158,11,0.15)] group-hover:scale-105 transition-transform">
              <RotateCcw className="w-4 h-4" />
            </div>
          </div>
          
          <div className="mt-3.5 relative z-10">
            <div className="text-2xl sm:text-3xl font-black text-amber-700 tracking-tight leading-none">
              {metrics.sentBack}
            </div>
          </div>
        </div>

        {/* Card 5: APPROVED */}
        <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-b from-white/95 via-white/80 to-white/65 backdrop-blur-2xl border border-white/90 p-4 shadow-[0_10px_30px_rgba(4,120,87,0.08),inset_0_1px_1px_rgba(255,255,255,1)] hover:shadow-[0_16px_36px_rgba(4,120,87,0.16)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-600 via-green-500 to-teal-400" />
          <div className="absolute -right-6 -bottom-6 w-20 h-20 bg-emerald-600/10 rounded-full blur-xl pointer-events-none group-hover:bg-emerald-600/20 transition-all duration-300" />
          
          <div className="flex items-center justify-between relative z-10">
            <span className="text-[10px] sm:text-[11px] font-extrabold text-emerald-900 uppercase tracking-tight">
              APPROVED
            </span>
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-600/20 to-green-500/20 text-emerald-800 flex items-center justify-center border border-emerald-600/25 shadow-[0_2px_8px_rgba(4,120,87,0.15)] group-hover:scale-105 transition-transform">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          
          <div className="mt-3.5 relative z-10">
            <div className="text-2xl sm:text-3xl font-black text-emerald-800 tracking-tight leading-none">
              {metrics.managerApproved}
            </div>
          </div>
        </div>

      </div>

      {/* ================= EXECUTIVE ROUND VISUALS ================= */}
      <div className="rounded-2xl bg-white/90 backdrop-blur-xl border border-white/90 shadow-[0_10px_36px_rgba(26,80,117,0.08)] p-5 sm:p-6 space-y-5">
        {/* 3 Analytics Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          
          {/* VISUAL 1: LNA WORKFLOW STATUS DONUT */}
          <div className="rounded-xl bg-gradient-to-b from-slate-50/70 to-white p-4 border border-slate-200/80 shadow-xs flex flex-col justify-between hover:border-sky-300 transition-all">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-sm bg-[#047857]" />
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                  LNA Status Distribution
                </h3>
              </div>
            </div>

            {/* Chart Area with Central KPI */}
            <div className="relative h-56 my-1 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const d = payload[0];
                        const total = metrics.total || 1;
                        const percent = ((Number(d.value) / total) * 100).toFixed(1);
                        return (
                          <div className="bg-slate-900/95 text-white backdrop-blur-md px-3.5 py-2 rounded-xl border border-slate-700/80 shadow-2xl text-xs z-50">
                            <div className="flex items-center gap-2 mb-1">
                              <span
                                className="w-2.5 h-2.5 rounded-full shrink-0"
                                style={{ backgroundColor: d.payload.color }}
                              />
                              <span className="font-bold text-slate-200 text-[11px]">{d.name}</span>
                            </div>
                            <div className="flex items-center justify-between gap-4 pt-1 border-t border-slate-700/60 font-mono">
                              <span className="text-slate-400 text-[10px]">Total:</span>
                              <span className="font-bold text-sky-300 text-xs">
                                {d.value} ({percent}%)
                              </span>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Pie
                    data={statusDonutData}
                    cx="50%"
                    cy="50%"
                    innerRadius={58}
                    outerRadius={86}
                    paddingAngle={3}
                    dataKey="value"
                    onMouseEnter={(_, index) => setActiveStatusIndex(index)}
                    onMouseLeave={() => setActiveStatusIndex(null)}
                  >
                    {statusDonutData.map((entry, index) => (
                      <Cell
                        key={`status-cell-${index}`}
                        fill={entry.color}
                        stroke="#ffffff"
                        strokeWidth={2}
                        className="transition-all duration-300 cursor-pointer"
                        opacity={activeStatusIndex === null || activeStatusIndex === index ? 1 : 0.6}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>

              {/* Central KPI Hole Callout */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                  Completion
                </span>
                <span className="text-xl font-black text-[#1a5075] font-mono leading-none my-0.5">
                  {metrics.completionRate}%
                </span>
                <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200/50">
                  {metrics.managerApproved} Approved
                </span>
              </div>
            </div>

            {/* Data Legend Table */}
            <div className="space-y-1.5 pt-2 border-t border-slate-200/60 text-xs">
              {statusDonutData.map((item, idx) => {
                const percent = metrics.total > 0 ? Math.round((item.value / metrics.total) * 100) : 0;
                return (
                  <div
                    key={item.name}
                    onMouseEnter={() => setActiveStatusIndex(idx)}
                    onMouseLeave={() => setActiveStatusIndex(null)}
                    className={`flex items-center justify-between p-1.5 rounded-lg transition-colors cursor-pointer ${
                      activeStatusIndex === idx ? 'bg-sky-50/80 text-[#0275a8]' : 'hover:bg-slate-100/60'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                      <span className="font-semibold text-slate-700 text-[11px] truncate">
                        {item.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 font-mono">
                      <span className="font-bold text-slate-900 text-xs">{item.value}</span>
                      <span className="text-[10px] text-slate-400 w-9 text-right font-medium">
                        {percent}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* VISUAL 2: COMPETENCY CATEGORY SPLIT */}
          <div className="rounded-xl bg-gradient-to-b from-slate-50/70 to-white p-4 border border-slate-200/80 shadow-xs flex flex-col justify-between hover:border-sky-300 transition-all">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-sm bg-[#0275a8]" />
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                  Competency Selections Split
                </h3>
              </div>
            </div>

            {/* Chart Area */}
            <div className="relative h-56 my-1 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const d = payload[0];
                        const total =
                          (categoryPieData[0]?.value || 0) + (categoryPieData[1]?.value || 0) || 1;
                        const percent = ((Number(d.value) / total) * 100).toFixed(1);
                        return (
                          <div className="bg-slate-900/95 text-white backdrop-blur-md px-3.5 py-2 rounded-xl border border-slate-700/80 shadow-2xl text-xs z-50">
                            <div className="flex items-center gap-2 mb-1">
                              <span
                                className="w-2.5 h-2.5 rounded-full shrink-0"
                                style={{ backgroundColor: d.payload.color }}
                              />
                              <span className="font-bold text-slate-200 text-[11px]">{d.name}</span>
                            </div>
                            <div className="flex items-center justify-between gap-4 pt-1 border-t border-slate-700/60 font-mono">
                              <span className="text-slate-400 text-[10px]">Selections:</span>
                              <span className="font-bold text-sky-300 text-xs">
                                {d.value} ({percent}%)
                              </span>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Pie
                    data={categoryPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={58}
                    outerRadius={86}
                    paddingAngle={4}
                    dataKey="value"
                    onMouseEnter={(_, index) => setActiveCategoryIndex(index)}
                    onMouseLeave={() => setActiveCategoryIndex(null)}
                  >
                    {categoryPieData.map((entry, index) => (
                      <Cell
                        key={`cat-cell-${index}`}
                        fill={entry.color}
                        stroke="#ffffff"
                        strokeWidth={2}
                        className="transition-all duration-300 cursor-pointer"
                        opacity={activeCategoryIndex === null || activeCategoryIndex === index ? 1 : 0.6}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>

              {/* Center Callout */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                  Selections
                </span>
                <span className="text-xl font-black text-[#1a5075] font-mono leading-none my-0.5">
                  {(categoryPieData[0]?.value || 0) + (categoryPieData[1]?.value || 0)}
                </span>
                <span className="text-[9px] font-bold text-[#0275a8] bg-sky-50 px-1.5 py-0.2 rounded border border-sky-200/50">
                  Total Logged
                </span>
              </div>
            </div>

            {/* Data Legend Table */}
            <div className="space-y-1.5 pt-2 border-t border-slate-200/60 text-xs">
              {categoryPieData.map((item, idx) => {
                const total =
                  (categoryPieData[0]?.value || 0) + (categoryPieData[1]?.value || 0);
                const percent = total > 0 ? Math.round((item.value / total) * 100) : 0;
                return (
                  <div
                    key={item.name}
                    onMouseEnter={() => setActiveCategoryIndex(idx)}
                    onMouseLeave={() => setActiveCategoryIndex(null)}
                    className={`flex items-center justify-between p-1.5 rounded-lg transition-colors cursor-pointer ${
                      activeCategoryIndex === idx ? 'bg-sky-50/80 text-[#0275a8]' : 'hover:bg-slate-100/60'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                      <span className="font-semibold text-slate-700 text-[11px] truncate">
                        {item.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 font-mono">
                      <span className="font-bold text-slate-900 text-xs">{item.value}</span>
                      <span className="text-[10px] text-slate-400 w-9 text-right font-medium">
                        {percent}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* VISUAL 3: DIVISION PARTICIPATION */}
          <div className="rounded-xl bg-gradient-to-b from-slate-50/70 to-white p-4 border border-slate-200/80 shadow-xs flex flex-col justify-between hover:border-sky-300 transition-all">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-sm bg-sky-600" />
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                  Division Participation
                </h3>
              </div>
            </div>

            {/* Chart Area */}
            <div className="relative h-56 my-1 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const d = payload[0];
                        const total = metrics.total || 1;
                        const percent = ((Number(d.value) / total) * 100).toFixed(1);
                        return (
                          <div className="bg-slate-900/95 text-white backdrop-blur-md px-3.5 py-2 rounded-xl border border-slate-700/80 shadow-2xl text-xs z-50">
                            <div className="flex items-center gap-2 mb-1">
                              <span
                                className="w-2.5 h-2.5 rounded-full shrink-0"
                                style={{ backgroundColor: d.payload.color }}
                              />
                              <span className="font-bold text-slate-200 text-[11px]">{d.name}</span>
                            </div>
                            <div className="flex items-center justify-between gap-4 pt-1 border-t border-slate-700/60 font-mono">
                              <span className="text-slate-400 text-[10px]">Employees:</span>
                              <span className="font-bold text-sky-300 text-xs">
                                {d.value} ({percent}%)
                              </span>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Pie
                    data={divisionPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={58}
                    outerRadius={86}
                    paddingAngle={2}
                    dataKey="value"
                    onMouseEnter={(_, index) => setActiveDivisionIndex(index)}
                    onMouseLeave={() => setActiveDivisionIndex(null)}
                  >
                    {divisionPieData.map((entry, index) => (
                      <Cell
                        key={`div-cell-${index}`}
                        fill={entry.color}
                        stroke="#ffffff"
                        strokeWidth={2}
                        className="transition-all duration-300 cursor-pointer"
                        opacity={activeDivisionIndex === null || activeDivisionIndex === index ? 1 : 0.6}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>

              {/* Center Callout */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                  Employees
                </span>
                <span className="text-xl font-black text-[#1a5075] font-mono leading-none my-0.5">
                  {metrics.total}
                </span>
                <span className="text-[9px] font-bold text-slate-600 bg-slate-100 px-1.5 py-0.2 rounded border border-slate-200">
                  Total Roster
                </span>
              </div>
            </div>

            {/* Data Legend Table (Max 4 with scroll if more) */}
            <div className="space-y-1.5 pt-2 border-t border-slate-200/60 text-xs max-h-28 overflow-y-auto custom-scrollbar">
              {divisionPieData.map((item, idx) => {
                const percent = metrics.total > 0 ? Math.round((item.value / metrics.total) * 100) : 0;
                return (
                  <div
                    key={item.name}
                    onMouseEnter={() => setActiveDivisionIndex(idx)}
                    onMouseLeave={() => setActiveDivisionIndex(null)}
                    className={`flex items-center justify-between p-1.5 rounded-lg transition-colors cursor-pointer ${
                      activeDivisionIndex === idx ? 'bg-sky-50/80 text-[#0275a8]' : 'hover:bg-slate-100/60'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                      <span className="font-semibold text-slate-700 text-[11px] truncate">
                        {item.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 font-mono">
                      <span className="font-bold text-slate-900 text-xs">{item.value}</span>
                      <span className="text-[10px] text-slate-400 w-9 text-right font-medium">
                        {percent}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>

      {/* 3. ORGANIZATIONAL MONITORING FILTERS (GLASSMORPHIC CONSOLE) */}
      <div className="rounded-2xl bg-white/85 backdrop-blur-xl border border-white/80 shadow-[0_8px_30px_rgb(26,80,117,0.05)] p-5">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100/80">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#0275a8]/10 text-[#0275a8] flex items-center justify-center border border-[#0275a8]/15">
              <Filter className="w-3.5 h-3.5" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-extrabold text-[#1a5075] uppercase tracking-wide">
                Organizational Monitoring &amp; Analytical Filters
              </h3>
            </div>
          </div>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="text-xs text-[#0275a8] hover:text-[#096f9c] font-bold flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-50 hover:bg-sky-100/80 border border-sky-200/70 transition-all cursor-pointer shadow-2xs"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5 text-xs">
          
          {/* Division Filter */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1.5">Division</label>
            <select
              value={selectedDivision}
              onChange={(e) => setSelectedDivision(e.target.value)}
              className="w-full border border-slate-200/80 rounded-xl p-2 text-xs bg-white/90 text-slate-800 shadow-2xs focus:outline-hidden focus:ring-2 focus:ring-[#0275a8]/30 focus:border-[#0275a8] transition-all"
            >
              <option value="ALL">All Divisions</option>
              {filterOptions.divisions.map((div) => (
                <option key={div} value={div}>
                  {div}
                </option>
              ))}
            </select>
          </div>

          {/* Department Filter */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1.5">Department</label>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="w-full border border-slate-200/80 rounded-xl p-2 text-xs bg-white/90 text-slate-800 shadow-2xs focus:outline-hidden focus:ring-2 focus:ring-[#0275a8]/30 focus:border-[#0275a8] transition-all"
            >
              <option value="ALL">All Departments</option>
              {filterOptions.departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          {/* Designation / Position Filter */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1.5">Designation / Position</label>
            <select
              value={selectedPosition}
              onChange={(e) => setSelectedPosition(e.target.value)}
              className="w-full border border-slate-200/80 rounded-xl p-2 text-xs bg-white/90 text-slate-800 shadow-2xs focus:outline-hidden focus:ring-2 focus:ring-[#0275a8]/30 focus:border-[#0275a8] transition-all"
            >
              <option value="ALL">All Positions</option>
              {filterOptions.positions.map((pos) => (
                <option key={pos} value={pos}>
                  {pos}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1.5">LNA Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full border border-slate-200/80 rounded-xl p-2 text-xs bg-white/90 text-slate-800 shadow-2xs focus:outline-hidden focus:ring-2 focus:ring-[#0275a8]/30 focus:border-[#0275a8] transition-all"
            >
              <option value="ALL">All Statuses</option>
              <option value="MANAGER APPROVED">Approved</option>
              <option value="SUBMITTED FOR MANAGER REVIEW">Pending Approval</option>
              <option value="SENT BACK TO EMPLOYEE">Returned</option>
            </select>
          </div>

          {/* Target Dropdown Selection: Employee or Manager */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1.5">Search By</label>
            <select
              value={searchType}
              onChange={(e) => setSearchType(e.target.value as 'employee' | 'manager')}
              className="w-full border border-slate-200/80 rounded-xl p-2 text-xs bg-white/90 text-slate-800 shadow-2xs focus:outline-hidden focus:ring-2 focus:ring-[#0275a8]/30 focus:border-[#0275a8] transition-all"
            >
              <option value="employee">Employee</option>
              <option value="manager">Manager</option>
            </select>
          </div>

          {/* Search Box */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1.5">
              {searchType === 'employee' ? 'Search Employee' : 'Search Manager'}
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder={searchType === 'employee' ? 'Search Employee...' : 'Search Manager...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full border border-slate-200/80 rounded-xl p-2 pl-8 text-xs bg-white/90 text-slate-800 shadow-2xs focus:outline-hidden focus:ring-2 focus:ring-[#0275a8]/30 focus:border-[#0275a8] transition-all"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            </div>
          </div>

        </div>
      </div>

      {/* 4. COMPETENCY & SKILL ANALYTICS (3-COLUMN SIDE-BY-SIDE GRID) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">
        
        {/* 4.1 FUNCTIONAL COMPETENCIES */}
        <div className="rounded-2xl bg-white/85 backdrop-blur-xl border border-white/80 shadow-[0_8px_30px_rgb(26,80,117,0.05)] p-5 sm:p-6 flex flex-col lg:h-[460px]">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100/80 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#0275a8]/10 text-[#0275a8] flex items-center justify-center border border-[#0275a8]/15 shadow-2xs">
                <Award className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-extrabold text-[#1a5075] uppercase tracking-wide">
                  FUNCTIONAL COMPETENCIES
                </h3>
              </div>
            </div>
            <span className="text-[10px] font-bold text-[#0275a8] bg-sky-50 px-2 py-0.5 rounded-md border border-sky-200/50">
              Selections
            </span>
          </div>

          <div className="flex-1 overflow-y-auto pr-1.5 space-y-3 text-xs custom-scrollbar">
            {competencyAnalytics.functionalList.map((comp) => (
              <div key={comp.code} className="text-xs group">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-slate-800 font-medium group-hover:text-[#0275a8] transition-colors">
                    {comp.name}
                  </span>
                  <span className="font-bold text-[#0275a8] font-mono bg-sky-50 px-2 py-0.5 rounded border border-sky-200/50">
                    {comp.count}
                  </span>
                </div>
                <div className="w-full bg-slate-100/80 rounded-full h-2 overflow-hidden shadow-inner border border-slate-200/40">
                  <div
                    className="bg-gradient-to-r from-[#0275a8] to-sky-400 h-2 rounded-full transition-all duration-500 shadow-xs"
                    style={{
                      width: `${(comp.count / competencyAnalytics.maxCount) * 100}%`
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4.2 BEHAVIORAL COMPETENCIES */}
        <div className="rounded-2xl bg-white/85 backdrop-blur-xl border border-white/80 shadow-[0_8px_30px_rgb(26,80,117,0.05)] p-5 sm:p-6 flex flex-col lg:h-[460px]">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100/80 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-700 flex items-center justify-center border border-emerald-500/15 shadow-2xs">
                <Award className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-extrabold text-emerald-800 uppercase tracking-wide">
                  BEHAVIORAL COMPETENCIES
                </h3>
              </div>
            </div>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/50">
              Selections
            </span>
          </div>

          <div className="flex-1 overflow-y-auto pr-1.5 space-y-3 text-xs custom-scrollbar">
            {competencyAnalytics.behavioralList.map((comp) => (
              <div key={comp.code} className="text-xs group">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-slate-800 font-medium group-hover:text-emerald-700 transition-colors">
                    {comp.name}
                  </span>
                  <span className="font-bold text-emerald-700 font-mono bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/50">
                    {comp.count}
                  </span>
                </div>
                <div className="w-full bg-slate-100/80 rounded-full h-2 overflow-hidden shadow-inner border border-slate-200/40">
                  <div
                    className="bg-gradient-to-r from-emerald-600 to-teal-400 h-2 rounded-full transition-all duration-500 shadow-xs"
                    style={{
                      width: `${(comp.count / competencyAnalytics.maxCount) * 100}%`
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4.3 SKILL ANALYTICS */}
        <div className="rounded-2xl bg-white/85 backdrop-blur-xl border border-white/80 shadow-[0_8px_30px_rgb(26,80,117,0.05)] p-5 sm:p-6 flex flex-col lg:h-[460px]">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100/80 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#0275a8]/10 text-[#0275a8] flex items-center justify-center border border-[#0275a8]/15 shadow-2xs">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-extrabold text-[#1a5075] uppercase tracking-wide">
                  Overall Skills Selected
                </h3>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto pr-1.5 space-y-2.5 text-xs custom-scrollbar">
            {skillAnalytics.length > 0 ? (
              skillAnalytics.map((skill, idx) => (
                <div
                  key={skill.id}
                  className="p-3 rounded-xl bg-white/70 hover:bg-white border border-slate-200/70 hover:border-sky-300 flex items-center justify-between gap-3 shadow-2xs hover:shadow-sm transition-all group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-6 h-6 rounded-lg bg-gradient-to-br from-slate-100 to-slate-200 text-slate-700 flex items-center justify-center font-black text-[10px] shrink-0 font-mono border border-slate-300/60 shadow-2xs group-hover:from-[#1a5075] group-hover:to-[#0275a8] group-hover:text-white transition-all">
                      {idx + 1}
                    </span>
                    <div className="min-w-0">
                      <div className="font-bold text-slate-800 truncate group-hover:text-[#1a5075] transition-colors">
                        {skill.name}
                      </div>
                      <div className="text-[10px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                        <span className="truncate">{skill.competencyName}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded-md ${
                        skill.category === 'Functional'
                          ? 'bg-sky-50 text-[#0275a8] border border-sky-200/70'
                          : 'bg-emerald-50 text-emerald-800 border border-emerald-200/70'
                      }`}
                    >
                      {skill.category}
                    </span>
                    <span className="bg-gradient-to-br from-[#1a5075] to-[#0275a8] text-white px-2.5 py-1 rounded-lg font-mono font-bold text-xs min-w-[32px] text-center shadow-xs">
                      {skill.count}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-slate-400">
                <AlertCircle className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                <p className="font-medium">No skill selections recorded in the filtered view.</p>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* 5. EMPLOYEE LNA STATUS DETAILS TABLE (GLASSMORPHIC TABLE) */}
      <div className="rounded-2xl bg-white/85 backdrop-blur-xl border border-white/80 shadow-[0_8px_30px_rgb(26,80,117,0.05)] overflow-hidden">
        <div className="bg-gradient-to-r from-[#1a5075] via-[#154668] to-[#0275a8] text-white px-5 py-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-white/15 text-white flex items-center justify-center border border-white/20 shadow-2xs">
              <Users className="w-4 h-4 text-sky-200" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-extrabold tracking-wide uppercase">
                Employee LNA Status Details
              </h3>
            </div>
          </div>
          <span className="text-[11px] bg-white/15 border border-white/20 px-3 py-1 rounded-full text-white font-mono shadow-2xs">
            Year: 2026
          </span>
        </div>

        {/* Table View */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-[#f0f7fb]/80 backdrop-blur-xs text-[#1a5075] border-b border-[#c8d8e5] font-extrabold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="p-3 w-12 text-center border-r border-slate-200/80">#</th>
                <th className="p-3 border-r border-slate-200/80">Employee Name</th>
                <th className="p-3 border-r border-slate-200/80">Employee ID</th>
                <th className="p-3 border-r border-slate-200/80">Division</th>
                <th className="p-3 border-r border-slate-200/80">Department</th>
                <th className="p-3 border-r border-slate-200/80 text-center w-16">Grade</th>
                <th className="p-3 border-r border-slate-200/80">Position</th>
                <th className="p-3 border-r border-slate-200/80">LNA Status</th>
                <th className="p-3 border-r border-slate-200/80 whitespace-nowrap">Date</th>
                <th className="p-3 border-r border-slate-200/80">Manager</th>
                <th className="p-3 text-center w-24">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRecords.length > 0 ? (
                filteredRecords.map((record, index) => {
                  const sub = record.submission;
                  return (
                    <tr
                      key={record.employee.employeeId}
                      className="bg-white/60 hover:bg-sky-50/60 transition-colors"
                    >
                      <td className="p-3 text-center font-mono text-slate-400 border-r border-slate-100">
                        {index + 1}
                      </td>
                      <td className="p-3 font-bold text-[#1a5075] border-r border-slate-100">
                        {record.employee.name}
                      </td>
                      <td className="p-3 font-mono text-slate-600 border-r border-slate-100">
                        {record.employee.employeeId}
                      </td>
                      <td className="p-3 text-slate-700 border-r border-slate-100">
                        {record.employee.division}
                      </td>
                      <td className="p-3 text-slate-700 border-r border-slate-100">
                        {record.employee.department}
                      </td>
                      <td className="p-3 text-center border-r border-slate-100">
                        <span className="bg-slate-100/90 text-slate-800 font-bold px-2 py-0.5 rounded-md text-[10px] border border-slate-200/60">
                          {record.employee.grade}
                        </span>
                      </td>
                      <td className="p-3 text-slate-800 font-medium border-r border-slate-100">
                        {record.employee.position}
                      </td>
                      <td className="p-3 border-r border-slate-100">
                        {record.status === 'MANAGER APPROVED' ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100/80 text-emerald-800 font-bold text-[10px] border border-emerald-300/70 shadow-2xs">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                            APPROVED
                          </span>
                        ) : record.status === 'SUBMITTED FOR MANAGER REVIEW' ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-sky-100/80 text-[#0275a8] font-bold text-[10px] border border-sky-300/70 shadow-2xs">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#0275a8] animate-pulse" />
                            PENDING APPROVAL
                          </span>
                        ) : record.status === 'SENT BACK TO EMPLOYEE' ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-100/80 text-amber-900 font-bold text-[10px] border border-amber-300/70 shadow-2xs">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                            RETURNED
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100/80 text-slate-600 font-semibold text-[10px] border border-slate-200/70 shadow-2xs">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                            PENDING
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-slate-700 border-r border-slate-100 font-medium whitespace-nowrap">
                        {sub?.submissionDate || '15 Jan 2026'}
                      </td>
                      <td className="p-3 text-slate-800 border-r border-slate-100 font-medium">
                        {record.employee.reportingManager}
                      </td>
                      <td className="p-3 text-center">
                        <button
                          type="button"
                          onClick={() => {
                            if (onViewEmployeeDetail) {
                              onViewEmployeeDetail(record.employee.employeeId);
                            }
                          }}
                          className="px-3 py-1.5 bg-gradient-to-r from-[#1a5075] to-[#0275a8] hover:from-[#133d59] hover:to-[#096f9c] text-white font-bold rounded-lg text-[11px] transition-all cursor-pointer flex items-center gap-1 mx-auto shadow-2xs hover:shadow-xs active:scale-95"
                          title="View Employee LNA Detail"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={12} className="p-10 text-center text-slate-400 bg-white/40">
                    <AlertCircle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="font-semibold text-slate-600">No employee records match the selected filters.</p>
                    <button
                      type="button"
                      onClick={handleResetFilters}
                      className="mt-2 text-xs text-[#0275a8] underline font-bold"
                    >
                      Clear Filters
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer Summary */}
        <div className="bg-[#f7fafc]/90 border-t border-slate-100 p-3.5 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            Showing <strong>{filteredRecords.length}</strong> of <strong>{records.length}</strong> total employees
          </span>
        </div>
      </div>

    </div>
  );
};
