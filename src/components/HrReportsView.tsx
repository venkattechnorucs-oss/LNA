import React, { useState, useMemo } from 'react';
import { OrgAssessmentRecord, getRecordYear } from '../data/orgAssessments';
import {
  FileSpreadsheet,
  Download,
  Calendar,
  CheckCircle2,
  FileText,
  Building2
} from 'lucide-react';

interface HrReportsViewProps {
  records: OrgAssessmentRecord[];
}

export const HrReportsView: React.FC<HrReportsViewProps> = ({ records }) => {
  const [selectedYear, setSelectedYear] = useState<string>('2026');
  const [selectedEntity, setSelectedEntity] = useState<string>('ALL');
  const [selectedDivision, setSelectedDivision] = useState<string>('ALL');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  // Available Years
  const years = useMemo(() => {
    const raw = Array.from(new Set(records.map((r) => getRecordYear(r).toString())));
    ['2026', '2025', '2024'].forEach((y) => {
      if (!raw.includes(y)) raw.push(y);
    });
    return raw.sort((a, b) => Number(b) - Number(a));
  }, [records]);

  // Divisions & Departments
  const divisions = useMemo(() => {
    return Array.from(new Set(records.map((r) => r.employee.division))).sort();
  }, [records]);

  const departments = useMemo(() => {
    const rel = selectedDivision === 'ALL'
      ? records
      : records.filter((r) => r.employee.division === selectedDivision);
    return Array.from(new Set(rel.map((r) => r.employee.department))).sort();
  }, [records, selectedDivision]);

  // Filtered records for reports
  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      if (selectedYear !== 'ALL' && getRecordYear(r).toString() !== selectedYear) return false;
      if (selectedEntity !== 'ALL') {
        const empEntity = r.employee.entity || 'GANS';
        if (empEntity !== selectedEntity) return false;
      }
      if (selectedDivision !== 'ALL' && r.employee.division !== selectedDivision) return false;
      if (selectedDepartment !== 'ALL' && r.employee.department !== selectedDepartment) return false;
      if (selectedStatus !== 'ALL' && r.status !== selectedStatus) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const nameMatch = r.employee.name.toLowerCase().includes(q);
        const idMatch = r.employee.employeeId.toLowerCase().includes(q);
        const posMatch = r.employee.position.toLowerCase().includes(q);
        if (!nameMatch && !idMatch && !posMatch) return false;
      }
      return true;
    });
  }, [records, selectedYear, selectedEntity, selectedDivision, selectedDepartment, selectedStatus, searchQuery]);

  // Trigger CSV Export of Employee Details & LNA Assessments
  const handleExportLnaReport = () => {
    const headers = [
      'Year',
      'Entity',
      'Employee Name',
      'Employee ID',
      'Email Address',
      'Division',
      'Department',
      'Grade',
      'Designation / Position',
      'Reporting Manager',
      'LNA Status',
      'Submission Date',
      'Competency 1',
      'Selected Skill 1',
      'Ideal Level 1',
      'Mapped Course 1',
      'Competency 2',
      'Selected Skill 2',
      'Ideal Level 2',
      'Mapped Course 2',
      'Competency 3',
      'Selected Skill 3',
      'Ideal Level 3',
      'Mapped Course 3',
      'Employee Comments',
      'Manager Comments',
      'Manager Action Date'
    ];

    const rows = filteredRecords.map((r) => {
      const sub = r.submission;
      const item1 = sub?.selectedItems?.[0];
      const item2 = sub?.selectedItems?.[1];
      const item3 = sub?.selectedItems?.[2];

      return [
        getRecordYear(r),
        r.employee.entity || 'GANS',
        r.employee.name,
        r.employee.employeeId,
        r.employee.email,
        r.employee.division,
        r.employee.department,
        r.employee.grade,
        r.employee.position,
        r.employee.reportingManager,
        r.status,
        sub?.submissionDate || '—',
        item1 ? item1.competency.name : '—',
        item1 ? item1.skill.name : '—',
        item1 ? item1.idealProficiency : '—',
        item1 ? item1.trainingCourse.title : '—',
        item2 ? item2.competency.name : '—',
        item2 ? item2.skill.name : '—',
        item2 ? item2.idealProficiency : '—',
        item2 ? item2.trainingCourse.title : '—',
        item3 ? item3.competency.name : '—',
        item3 ? item3.skill.name : '—',
        item3 ? item3.idealProficiency : '—',
        item3 ? item3.trainingCourse.title : '—',
        sub?.comments ? `"${sub.comments.replace(/"/g, '""')}"` : '—',
        sub?.managerComments ? `"${sub.managerComments.replace(/"/g, '""')}"` : '—',
        sub?.managerActionDate || '—'
      ];
    });

    const csvContent =
      '\uFEFF' +
      [
        headers.map((h) => `"${h.replace(/"/g, '""')}"`).join(','),
        ...rows.map((row) =>
          row.map((val) => `"${String(val || '').replace(/"/g, '""')}"`).join(',')
        )
      ].join('\r\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const yearLabel = selectedYear === 'ALL' ? 'All_Years' : selectedYear;
    link.download = `GANS_LNA_Master_Report_${yearLabel}_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadSuccess(`Generated and downloaded GANS LNA Master Report (${filteredRecords.length} records).`);
    setTimeout(() => setDownloadSuccess(null), 4000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-[#211E4E] p-5 sm:p-6 text-white shadow-[0_12px_36px_-6px_rgba(33,30,78,0.25)] border border-[#C8A977]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="relative z-10">
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2.5 drop-shadow-xs">
            <FileSpreadsheet className="w-6 h-6 text-[#C8A977]" />
            <span>Reports</span>
          </h1>
        </div>

        {/* Entity & Year Selectors in Banner */}
        <div className="relative z-10 flex flex-wrap items-center gap-3">
          {/* Entity Selector in Banner */}
          <div className="flex items-center gap-2 bg-white/10 hover:bg-white/15 transition-colors backdrop-blur-md px-3 py-2 rounded-xl border border-[#C8A977]/30 shadow-xs shrink-0">
            <Building2 className="w-4 h-4 text-[#C8A977] shrink-0" />
            <label htmlFor="report-entity-select" className="text-xs font-bold text-[#dfcaa8] whitespace-nowrap">
              Entity:
            </label>
            <select
              id="report-entity-select"
              value={selectedEntity}
              onChange={(e) => setSelectedEntity(e.target.value)}
              className="bg-[#19163d] text-white font-bold text-xs rounded-lg px-2.5 py-1.5 border border-[#C8A977]/40 focus:outline-hidden focus:ring-2 focus:ring-[#C8A977] cursor-pointer transition-all shadow-inner"
            >
              <option value="ALL" className="bg-[#211E4E] text-white font-medium">All Entities</option>
              <option value="GANS" className="bg-[#211E4E] text-white font-medium">GANS</option>
              <option value="Eshara" className="bg-[#211E4E] text-white font-medium">Eshara</option>
              <option value="YHA" className="bg-[#211E4E] text-white font-medium">YHA</option>
            </select>
          </div>

          {/* Year Selector in Banner */}
          <div className="flex items-center gap-2 bg-white/10 hover:bg-white/15 transition-colors backdrop-blur-md px-3 py-2 rounded-xl border border-[#C8A977]/30 shadow-xs shrink-0">
            <Calendar className="w-4 h-4 text-[#C8A977] shrink-0" />
            <label htmlFor="report-year-select" className="text-xs font-bold text-[#dfcaa8] whitespace-nowrap">
              Report Year:
            </label>
            <select
              id="report-year-select"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="bg-[#19163d] text-white font-bold text-xs rounded-lg px-2.5 py-1.5 border border-[#C8A977]/40 focus:outline-hidden focus:ring-2 focus:ring-[#C8A977] cursor-pointer transition-all shadow-inner"
            >
              {years.map((yr) => (
                <option key={yr} value={yr} className="bg-[#211E4E] text-white font-medium">
                  {yr} {yr === '2026' ? '(Active)' : ''}
                </option>
              ))}
              <option value="ALL" className="bg-[#211E4E] text-white font-medium">All Years</option>
            </select>
          </div>
        </div>
      </div>

      {/* Export Action Center Card */}
      <div className="max-w-xl">
        {/* Card: Comprehensive Employee LNA Report */}
        <div className="rounded-2xl bg-white border border-[#C8A977]/25 p-6 shadow-[0_8px_30px_rgb(33,30,78,0.05)] hover:shadow-lg transition-all duration-300 flex flex-col justify-between group">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#211E4E]/10 text-[#211E4E] flex items-center justify-center font-bold border border-[#C8A977]/30 shadow-2xs group-hover:scale-105 transition-transform">
                <FileText className="w-5 h-5 text-[#211E4E]" />
              </div>
              <div>
                <h3 className="font-extrabold text-[#211E4E] text-sm tracking-tight">LNA Master Report</h3>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleExportLnaReport}
            className="mt-6 w-full py-3 px-4 bg-[#211E4E] hover:bg-[#2c2865] text-[#C8A977] border border-[#C8A977]/40 font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer active:scale-98"
          >
            <Download className="w-4 h-4 text-[#C8A977]" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Success Notification Banner */}
      {downloadSuccess && (
        <div className="p-4 bg-emerald-50/90 backdrop-blur-xl border border-emerald-300 rounded-2xl text-emerald-900 text-xs font-bold flex items-center gap-3 shadow-sm animate-in slide-in-from-top-2">
          <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
          </div>
          <span>{downloadSuccess}</span>
        </div>
      )}
    </div>
  );
};
