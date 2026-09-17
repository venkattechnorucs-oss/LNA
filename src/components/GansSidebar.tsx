import React from 'react';
import {
  GraduationCap,
  Clock,
  BookOpen,
  Compass,
  CheckSquare,
  LayoutDashboard,
  Users,
  Layers,
  Sparkles,
  FileSpreadsheet,
  FileText,
  ShieldCheck,
  Send,
  History,
  UserCheck
} from 'lucide-react';

interface GansSidebarProps {
  activeRole: 'employee' | 'manager' | 'hr';
  currentTab: string;
  onSelectTab: (tab: string) => void;
  pendingApprovalsCount?: number;
}

export const GansSidebar: React.FC<GansSidebarProps> = ({
  activeRole = 'employee',
  currentTab = 'my-lna',
  onSelectTab,
  pendingApprovalsCount = 0
}) => {
  return (
    <aside className="w-60 bg-white/70 backdrop-blur-xl border-r border-slate-200/80 flex shrink-0 min-h-[calc(100vh-100px)] shadow-[2px_0_12px_rgba(0,0,0,0.02)]">
      {/* Structured Navigation Menu */}
      <div className="flex-1 flex flex-col py-4 px-3 text-xs space-y-4">
        
        {/* 1. MANAGER VIEW NAVIGATION */}
        {activeRole === 'manager' && (
          <div className="space-y-4">
            {/* LNA Module (Self-Service & Team Approvals) */}
            <div>
              <div className="px-3 py-1.5 text-[11px] font-bold tracking-wider text-[#1a5075] uppercase flex items-center justify-between border-b border-slate-200/80 pb-1.5 mb-1.5">
                <span className="flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-[#0275a8]" />
                  LNA
                </span>
              </div>

              <div className="space-y-1">
                {/* 1. My LNA */}
                <button
                  type="button"
                  onClick={() => onSelectTab('dashboard')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl font-semibold text-left transition-all cursor-pointer ${
                    currentTab === 'dashboard' || currentTab === 'my-lna'
                      ? 'bg-gradient-to-r from-[#1a5075] to-[#0275a8] text-white shadow-[0_4px_12px_rgba(2,117,168,0.25)] font-bold'
                      : 'text-slate-700 hover:bg-white/80 hover:text-[#0275a8]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <LayoutDashboard className={`w-4 h-4 ${currentTab === 'dashboard' || currentTab === 'my-lna' ? 'text-white' : 'text-[#0275a8]'}`} />
                    <span>My LNA</span>
                  </div>
                </button>

                {/* 2. My Approvals */}
                <button
                  type="button"
                  onClick={() => onSelectTab('approvals')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl font-semibold text-left transition-all cursor-pointer ${
                    currentTab === 'approvals'
                      ? 'bg-gradient-to-r from-[#1a5075] to-[#0275a8] text-white shadow-[0_4px_12px_rgba(2,117,168,0.25)] font-bold'
                      : 'text-slate-700 hover:bg-white/80 hover:text-[#0275a8]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <CheckSquare className={`w-4 h-4 ${currentTab === 'approvals' ? 'text-white' : 'text-emerald-600'}`} />
                    <span>My Approvals</span>
                  </div>
                  {pendingApprovalsCount > 0 && (
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shadow-2xs ${
                      currentTab === 'approvals' ? 'bg-white text-[#1a5075]' : 'bg-red-500 text-white'
                    }`}>
                      {pendingApprovalsCount}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* PDP Module (Self-Service) */}
            <div>
              <div className="px-3 py-1.5 text-[11px] font-bold tracking-wider text-slate-600 uppercase flex items-center gap-1.5 border-b border-slate-200/80 pb-1.5 mb-1.5">
                <Compass className="w-3.5 h-3.5 text-slate-500" />
                <span>PDP</span>
              </div>

              <div className="space-y-1">
                <button
                  type="button"
                  onClick={() => onSelectTab('pdp-dashboard')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl font-semibold text-left transition-all cursor-pointer ${
                    currentTab === 'pdp-dashboard'
                      ? 'bg-gradient-to-r from-[#1a5075] to-[#0275a8] text-white shadow-[0_4px_12px_rgba(2,117,168,0.25)] font-bold'
                      : 'text-slate-600 hover:bg-white/80 hover:text-[#0275a8]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <LayoutDashboard className={`w-4 h-4 ${currentTab === 'pdp-dashboard' ? 'text-white' : 'text-slate-400'}`} />
                    <span>My PDP</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 2. EMPLOYEE VIEW NAVIGATION */}
        {activeRole === 'employee' && (
          <div className="space-y-4">
            {/* LNA Module */}
            <div>
              <div className="px-3 py-1.5 text-[11px] font-bold tracking-wider text-[#1a5075] uppercase flex items-center justify-between border-b border-slate-200/80 pb-1.5 mb-1.5">
                <span className="flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-[#0275a8]" />
                  LNA
                </span>
              </div>

              <div className="space-y-1">
                <button
                  type="button"
                  onClick={() => onSelectTab('dashboard')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl font-semibold text-left transition-all cursor-pointer ${
                    currentTab === 'dashboard'
                      ? 'bg-gradient-to-r from-[#1a5075] to-[#0275a8] text-white shadow-[0_4px_12px_rgba(2,117,168,0.25)] font-bold'
                      : 'text-slate-700 hover:bg-white/80 hover:text-[#0275a8]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <LayoutDashboard className={`w-4 h-4 ${currentTab === 'dashboard' ? 'text-white' : 'text-[#0275a8]'}`} />
                    <span>My LNA</span>
                  </div>
                </button>
              </div>
            </div>

            {/* PDP Module */}
            <div>
              <div className="px-3 py-1.5 text-[11px] font-bold tracking-wider text-slate-600 uppercase flex items-center gap-1.5 border-b border-slate-200/80 pb-1.5 mb-1.5">
                <Compass className="w-3.5 h-3.5 text-slate-500" />
                <span>PDP</span>
              </div>

              <div className="space-y-1">
                <button
                  type="button"
                  onClick={() => onSelectTab('pdp-dashboard')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl font-semibold text-left transition-all cursor-pointer ${
                    currentTab === 'pdp-dashboard'
                      ? 'bg-gradient-to-r from-[#1a5075] to-[#0275a8] text-white shadow-[0_4px_12px_rgba(2,117,168,0.25)] font-bold'
                      : 'text-slate-600 hover:bg-white/80 hover:text-[#0275a8]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <LayoutDashboard className={`w-4 h-4 ${currentTab === 'pdp-dashboard' ? 'text-white' : 'text-slate-400'}`} />
                    <span>My PDP</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 3. HR VIEW NAVIGATION */}
        {activeRole === 'hr' && (
          <div className="space-y-4">
            
            {/* 3.1 Administration (Contains Dashboard, Masters & Reports) */}
            <div>
              <div className="px-3 py-1.5 text-[11px] font-bold tracking-wider text-[#1a5075] uppercase flex items-center gap-1.5 border-b border-slate-200/80 pb-1.5 mb-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#0275a8]" />
                <span>Administration</span>
              </div>

              <div className="space-y-1">
                {/* Organizational Dashboard inside Administration */}
                <button
                  type="button"
                  onClick={() => onSelectTab('hr-dashboard')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl font-semibold text-left transition-all cursor-pointer ${
                    currentTab === 'hr-dashboard'
                      ? 'bg-gradient-to-r from-[#1a5075] to-[#0275a8] text-white shadow-[0_4px_12px_rgba(2,117,168,0.25)] font-bold'
                      : 'text-slate-700 hover:bg-white/80 hover:text-[#0275a8]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <LayoutDashboard className={`w-4 h-4 ${currentTab === 'hr-dashboard' ? 'text-white' : 'text-[#0275a8]'}`} />
                    <span>LNA Dashboard</span>
                  </div>
                </button>

                {/* Employee Master */}
                <button
                  type="button"
                  onClick={() => onSelectTab('hr-employee-master')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl font-semibold text-left transition-all cursor-pointer ${
                    currentTab === 'hr-employee-master'
                      ? 'bg-gradient-to-r from-[#1a5075] to-[#0275a8] text-white shadow-[0_4px_12px_rgba(2,117,168,0.25)] font-bold'
                      : 'text-slate-700 hover:bg-white/80 hover:text-[#0275a8]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Users className={`w-4 h-4 ${currentTab === 'hr-employee-master' ? 'text-white' : 'text-[#0275a8]'}`} />
                    <span>Employee Master</span>
                  </div>
                </button>

                {/* Release History */}
                <button
                  type="button"
                  onClick={() => onSelectTab('hr-assessment-history')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl font-semibold text-left transition-all cursor-pointer ${
                    currentTab === 'hr-assessment-history'
                      ? 'bg-gradient-to-r from-[#1a5075] to-[#0275a8] text-white shadow-[0_4px_12px_rgba(2,117,168,0.25)] font-bold'
                      : 'text-slate-700 hover:bg-white/80 hover:text-[#0275a8]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <History className={`w-4 h-4 ${currentTab === 'hr-assessment-history' ? 'text-white' : 'text-[#0275a8]'}`} />
                    <span>Release History</span>
                  </div>
                </button>

                {/* Competency & Skills Master */}
                <button
                  type="button"
                  onClick={() => onSelectTab('hr-competency-skills-master')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl font-semibold text-left transition-all cursor-pointer ${
                    currentTab === 'hr-competency-skills-master' || currentTab === 'hr-competency-master' || currentTab === 'hr-skills-master'
                      ? 'bg-gradient-to-r from-[#1a5075] to-[#0275a8] text-white shadow-[0_4px_12px_rgba(2,117,168,0.25)] font-bold'
                      : 'text-slate-700 hover:bg-white/80 hover:text-[#0275a8]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Layers className={`w-4 h-4 ${currentTab === 'hr-competency-skills-master' || currentTab === 'hr-competency-master' || currentTab === 'hr-skills-master' ? 'text-white' : 'text-[#0275a8]'}`} />
                    <span>Competency &amp; Skills Master</span>
                  </div>
                </button>

                {/* Reports (inside Administration) */}
                <button
                  type="button"
                  onClick={() => onSelectTab('hr-reports')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl font-semibold text-left transition-all cursor-pointer ${
                    currentTab === 'hr-reports'
                      ? 'bg-gradient-to-r from-[#1a5075] to-[#0275a8] text-white shadow-[0_4px_12px_rgba(2,117,168,0.25)] font-bold'
                      : 'text-slate-700 hover:bg-white/80 hover:text-[#0275a8]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <FileText className={`w-4 h-4 ${currentTab === 'hr-reports' ? 'text-white' : 'text-[#0275a8]'}`} />
                    <span>Reports</span>
                  </div>
                </button>

                {/* Delegation (under Competency and Reports) */}
                <button
                  type="button"
                  onClick={() => onSelectTab('hr-delegation')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl font-semibold text-left transition-all cursor-pointer ${
                    currentTab === 'hr-delegation'
                      ? 'bg-gradient-to-r from-[#1a5075] to-[#0275a8] text-white shadow-[0_4px_12px_rgba(2,117,168,0.25)] font-bold'
                      : 'text-slate-700 hover:bg-white/80 hover:text-[#0275a8]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <UserCheck className={`w-4 h-4 ${currentTab === 'hr-delegation' ? 'text-white' : 'text-[#0275a8]'}`} />
                    <span>Delegation</span>
                  </div>
                </button>
              </div>
            </div>

            {/* 3.2 LNA */}
            <div>
              <div className="px-3 py-1.5 text-[11px] font-bold tracking-wider text-[#1a5075] uppercase flex items-center gap-1.5 border-b border-slate-200/80 pb-1.5 mb-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-[#0275a8]" />
                <span>LNA</span>
              </div>

              <div className="space-y-1">
                <button
                  type="button"
                  onClick={() => onSelectTab('hr-lna-dashboard')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl font-semibold text-left transition-all cursor-pointer ${
                    currentTab === 'hr-lna-dashboard'
                      ? 'bg-gradient-to-r from-[#1a5075] to-[#0275a8] text-white shadow-[0_4px_12px_rgba(2,117,168,0.25)] font-bold'
                      : 'text-slate-700 hover:bg-white/80 hover:text-[#0275a8]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <LayoutDashboard className={`w-4 h-4 ${currentTab === 'hr-lna-dashboard' ? 'text-white' : 'text-[#0275a8]'}`} />
                    <span>My LNA</span>
                  </div>
                </button>
              </div>
            </div>

            {/* 3.3 PDP */}
            <div>
              <div className="px-3 py-1.5 text-[11px] font-bold tracking-wider text-[#1a5075] uppercase flex items-center gap-1.5 border-b border-slate-200/80 pb-1.5 mb-1.5">
                <Compass className="w-3.5 h-3.5 text-[#0275a8]" />
                <span>PDP</span>
              </div>

              <div className="space-y-1">
                <button
                  type="button"
                  onClick={() => onSelectTab('hr-pdp-dashboard')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl font-semibold text-left transition-all cursor-pointer ${
                    currentTab === 'hr-pdp-dashboard'
                      ? 'bg-gradient-to-r from-[#1a5075] to-[#0275a8] text-white shadow-[0_4px_12px_rgba(2,117,168,0.25)] font-bold'
                      : 'text-slate-700 hover:bg-white/80 hover:text-[#0275a8]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <LayoutDashboard className={`w-4 h-4 ${currentTab === 'hr-pdp-dashboard' ? 'text-white' : 'text-[#0275a8]'}`} />
                    <span>My PDP</span>
                  </div>
                </button>
              </div>
            </div>

          </div>
        )}

      </div>
    </aside>
  );
};

