import React, { useState, useMemo } from 'react';
import { OrgAssessmentRecord, getRecordYear } from '../data/orgAssessments';
import {
  Compass,
  CheckCircle2,
  Clock,
  Calendar,
  Search,
  Filter,
  Award,
  TrendingUp,
  Target,
  BookOpen,
  ChevronRight,
  UserCheck,
  AlertCircle
} from 'lucide-react';

interface HrPdpDashboardViewProps {
  records: OrgAssessmentRecord[];
}

export const HrPdpDashboardView: React.FC<HrPdpDashboardViewProps> = ({ records }) => {
  const [selectedYear, setSelectedYear] = useState<string>('2026');
  const [selectedDivision, setSelectedDivision] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Available Years
  const years = useMemo(() => {
    const raw = Array.from(new Set(records.map((r) => getRecordYear(r).toString())));
    ['2026', '2025', '2024'].forEach((y) => {
      if (!raw.includes(y)) raw.push(y);
    });
    return raw.sort((a, b) => Number(b) - Number(a));
  }, [records]);

  // Divisions
  const divisions = useMemo(() => {
    return Array.from(new Set(records.map((r) => r.employee.division))).sort();
  }, [records]);

  // Filtered approved / active PDP records
  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      if (selectedYear !== 'ALL' && getRecordYear(r).toString() !== selectedYear) return false;
      if (selectedDivision !== 'ALL' && r.employee.division !== selectedDivision) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const nameMatch = r.employee.name.toLowerCase().includes(q);
        const idMatch = r.employee.employeeId.toLowerCase().includes(q);
        const posMatch = r.employee.position.toLowerCase().includes(q);
        if (!nameMatch && !idMatch && !posMatch) return false;
      }
      return true;
    });
  }, [records, selectedYear, selectedDivision, searchQuery]);

  // PDP Items synthesized from approved/submitted LNA items
  const pdpItems = useMemo(() => {
    const list: Array<{
      id: string;
      employee: OrgAssessmentRecord['employee'];
      competencyName: string;
      skillName: string;
      courseCode: string;
      courseTitle: string;
      targetQuarter: string;
      progress: number;
      status: 'Completed' | 'In Progress' | 'Scheduled' | 'Pending Approval';
    }> = [];

    filteredRecords.forEach((r, rIdx) => {
      const items = r.submission?.selectedItems || [];
      items.forEach((item, itemIdx) => {
        // Deterministic progress for realistic demo simulation
        let progress = 0;
        let status: 'Completed' | 'In Progress' | 'Scheduled' | 'Pending Approval' = 'In Progress';
        const quarters = ['Q1 2026', 'Q2 2026', 'Q3 2026', 'Q4 2026'];
        const quarter = quarters[(rIdx + itemIdx) % quarters.length];

        if (r.status === 'MANAGER APPROVED') {
          if (itemIdx === 0) {
            progress = 100;
            status = 'Completed';
          } else if (itemIdx === 1) {
            progress = 65;
            status = 'In Progress';
          } else {
            progress = 25;
            status = 'Scheduled';
          }
        } else {
          progress = 0;
          status = 'Pending Approval';
        }

        list.push({
          id: `pdp_${r.employee.employeeId}_${itemIdx}`,
          employee: r.employee,
          competencyName: item.competency.name,
          skillName: item.skill.name,
          courseCode: item.trainingCourse.courseCode,
          courseTitle: item.trainingCourse.title,
          targetQuarter: quarter,
          progress,
          status
        });
      });
    });

    if (selectedStatus === 'ALL') return list;
    return list.filter((p) => p.status === selectedStatus);
  }, [filteredRecords, selectedStatus]);

  // Metrics
  const totalPdps = pdpItems.length;
  const completedPdps = pdpItems.filter((p) => p.status === 'Completed').length;
  const inProgressPdps = pdpItems.filter((p) => p.status === 'In Progress').length;
  const avgCompletion = totalPdps > 0
    ? Math.round(pdpItems.reduce((acc, p) => acc + p.progress, 0) / totalPdps)
    : 0;

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      
      {/* Banner */}
      <div className="bg-gradient-to-r from-[#1a5075] via-[#154668] to-[#0d314a] rounded-xl p-5 text-white shadow-md border border-[#2b658f] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-white/20 text-white text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full backdrop-blur-xs">
              Performance &amp; Talent Growth
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2.5">
            <Compass className="w-6 h-6 text-sky-300" />
            <span>Personal Development Plan (PDP) – HR Assessment</span>
          </h1>
          <p className="text-xs text-sky-100/90 mt-0.5 font-light">
            Monitor organizational development milestones, competency progression, and goal fulfillment
          </p>
        </div>

        {/* Year Filter */}
        <div className="flex items-center gap-2.5 bg-white/15 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/25 shadow-xs shrink-0">
          <Calendar className="w-4 h-4 text-sky-300 shrink-0" />
          <label htmlFor="pdp-year-select" className="text-xs font-bold text-sky-100 whitespace-nowrap">
            Cycle Year:
          </label>
          <select
            id="pdp-year-select"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="bg-[#0b3350] text-white font-bold text-xs rounded-lg px-3 py-1.5 border border-white/30 focus:outline-hidden focus:ring-2 focus:ring-sky-400 cursor-pointer transition-all shadow-inner"
          >
            {years.map((yr) => (
              <option key={yr} value={yr} className="bg-[#104060] text-white font-medium">
                {yr} {yr === '2026' ? '(Active)' : ''}
              </option>
            ))}
            <option value="ALL" className="bg-[#104060] text-white font-medium">All Years</option>
          </select>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-white p-3.5 rounded-lg border border-[#c8d8e5] shadow-2xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Total Active PDPs</span>
          <div className="text-2xl font-black text-[#1a5075] mt-1">{totalPdps}</div>
          <span className="text-[10px] text-slate-400 mt-0.5 block">Development objectives</span>
        </div>
        <div className="bg-white p-3.5 rounded-lg border border-[#c8d8e5] shadow-2xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">In Progress Goals</span>
          <div className="text-2xl font-black text-[#0275a8] mt-1">{inProgressPdps}</div>
          <span className="text-[10px] text-slate-400 mt-0.5 block">Under active training</span>
        </div>
        <div className="bg-white p-3.5 rounded-lg border border-[#c8d8e5] shadow-2xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Completed Goals</span>
          <div className="text-2xl font-black text-emerald-700 mt-1">{completedPdps}</div>
          <span className="text-[10px] text-slate-400 mt-0.5 block">Milestones fulfilled</span>
        </div>
        <div className="bg-white p-3.5 rounded-lg border border-[#c8d8e5] shadow-2xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Avg Organization Completion</span>
          <div className="text-2xl font-black text-slate-800 mt-1">{avgCompletion}%</div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
            <div className="bg-[#0275a8] h-full rounded-full" style={{ width: `${avgCompletion}%` }} />
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-3.5 rounded-lg border border-[#c8d8e5] shadow-2xs flex flex-col md:flex-row items-stretch md:items-center gap-3">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search PDPs by employee name, ID, position..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-md text-xs text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:border-[#0275a8] focus:bg-white transition-all shadow-2xs"
          />
        </div>

        {/* Division Filter */}
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-xs font-bold text-slate-600 whitespace-nowrap">Division:</span>
          <select
            value={selectedDivision}
            onChange={(e) => setSelectedDivision(e.target.value)}
            className="bg-white border border-slate-300 rounded-md px-2.5 py-1.5 text-xs text-slate-700 font-medium focus:outline-hidden focus:border-[#0275a8]"
          >
            <option value="ALL">All Divisions</option>
            {divisions.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-xs font-bold text-slate-600 whitespace-nowrap">PDP Status:</span>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-white border border-slate-300 rounded-md px-2.5 py-1.5 text-xs text-slate-700 font-medium focus:outline-hidden focus:border-[#0275a8]"
          >
            <option value="ALL">All Statuses</option>
            <option value="Completed">Completed</option>
            <option value="In Progress">In Progress</option>
            <option value="Scheduled">Scheduled</option>
            <option value="Pending Approval">Pending Approval</option>
          </select>
        </div>
      </div>

      {/* PDP Action Plans Table */}
      <div className="bg-white rounded-lg border border-[#c8d8e5] shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#1a5075] text-white font-bold border-b border-[#144262]">
                <th className="py-2.5 px-3.5 w-12 text-center">#</th>
                <th className="py-2.5 px-4 w-52">Employee Details</th>
                <th className="py-2.5 px-4 w-52">Target Competency &amp; Skill</th>
                <th className="py-2.5 px-4">Prescribed Training Course</th>
                <th className="py-2.5 px-3 text-center w-28">Target Quarter</th>
                <th className="py-2.5 px-4 w-40">Progress</th>
                <th className="py-2.5 px-3 text-center w-28">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {pdpItems.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-500">
                    <p className="font-semibold text-sm">No PDP action records found</p>
                    <p className="text-xs text-slate-400 mt-1">Try selecting a different year or filter.</p>
                  </td>
                </tr>
              ) : (
                pdpItems.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3.5 text-center text-slate-400 font-mono text-[11px]">
                      {idx + 1}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-800 text-xs">{item.employee.name}</div>
                      <div className="text-[11px] text-slate-500">{item.employee.position}</div>
                      <div className="text-[10px] text-slate-400">{item.employee.department} • Grade {item.employee.grade}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-slate-800 text-xs block">{item.competencyName}</span>
                      <span className="text-[11px] text-slate-500 block truncate">{item.skillName}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="bg-[#f0f6fa] p-2 rounded border border-[#c8d8e5]">
                        <span className="font-mono text-[10px] font-bold text-[#0275a8] block">{item.courseCode}</span>
                        <span className="font-medium text-slate-800 text-[11px] block line-clamp-1">{item.courseTitle}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className="inline-block font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded text-[11px] border border-slate-200">
                        {item.targetQuarter}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              item.progress === 100
                                ? 'bg-emerald-600'
                                : item.progress > 40
                                ? 'bg-[#0275a8]'
                                : 'bg-amber-500'
                            }`}
                            style={{ width: `${item.progress}%` }}
                          />
                        </div>
                        <span className="font-mono font-bold text-[11px] text-slate-700 w-8 text-right">
                          {item.progress}%
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                          item.status === 'Completed'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : item.status === 'In Progress'
                            ? 'bg-sky-100 text-[#0275a8] border border-sky-200'
                            : item.status === 'Scheduled'
                            ? 'bg-purple-100 text-purple-800 border border-purple-200'
                            : 'bg-amber-100 text-amber-800 border border-amber-200'
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
