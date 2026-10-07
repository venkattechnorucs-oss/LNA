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
  UserCheck,
  Building2,
  Landmark,
  GitBranch,
  FolderPlus,
  FolderTree,
  Network,
  Award
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
    <aside className="w-60 bg-white/85 backdrop-blur-xl border-r border-[#C8A977]/20 flex shrink-0 min-h-[calc(100vh-100px)] shadow-[2px_0_12px_rgba(33,30,78,0.03)]">
      {/* Structured Navigation Menu */}
      <div className="flex-1 flex flex-col py-4 px-3 text-xs space-y-4">
        
        {/* 1. MANAGER VIEW NAVIGATION */}
        {activeRole === 'manager' && (
          <div className="space-y-4">
            {/* LNA Module (Self-Service & Team Approvals) */}
            <div>
              <div className="px-3 py-1.5 text-[11px] font-bold tracking-wider text-[#211E4E] uppercase flex items-center justify-between border-b border-[#C8A977]/25 pb-1.5 mb-1.5">
                <span className="flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-[#C8A977]" />
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
                      ? 'bg-[#211E4E] text-[#FFFFFF] shadow-[0_4px_12px_rgba(33,30,78,0.22)] font-bold border-l-4 border-[#C8A977]'
                      : 'text-slate-700 hover:bg-[#211E4E]/5 hover:text-[#211E4E]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <LayoutDashboard className={`w-4 h-4 ${currentTab === 'dashboard' || currentTab === 'my-lna' ? 'text-[#C8A977]' : 'text-[#211E4E]/60'}`} />
                    <span>My LNA</span>
                  </div>
                </button>

                {/* 2. My Approvals */}
                <button
                  type="button"
                  onClick={() => onSelectTab('approvals')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl font-semibold text-left transition-all cursor-pointer ${
                    currentTab === 'approvals'
                      ? 'bg-[#211E4E] text-[#FFFFFF] shadow-[0_4px_12px_rgba(33,30,78,0.22)] font-bold border-l-4 border-[#C8A977]'
                      : 'text-slate-700 hover:bg-[#211E4E]/5 hover:text-[#211E4E]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <CheckSquare className={`w-4 h-4 ${currentTab === 'approvals' ? 'text-[#C8A977]' : 'text-[#211E4E]/60'}`} />
                    <span>My Approvals</span>
                  </div>
                  {pendingApprovalsCount > 0 && (
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shadow-2xs ${
                      currentTab === 'approvals' ? 'bg-[#C8A977] text-[#211E4E]' : 'bg-red-500 text-white'
                    }`}>
                      {pendingApprovalsCount}
                    </span>
                  )}
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
              <div className="px-3 py-1.5 text-[11px] font-bold tracking-wider text-[#211E4E] uppercase flex items-center justify-between border-b border-[#C8A977]/25 pb-1.5 mb-1.5">
                <span className="flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-[#C8A977]" />
                  LNA
                </span>
              </div>

              <div className="space-y-1">
                <button
                  type="button"
                  onClick={() => onSelectTab('dashboard')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl font-semibold text-left transition-all cursor-pointer ${
                    currentTab === 'dashboard'
                      ? 'bg-[#211E4E] text-[#FFFFFF] shadow-[0_4px_12px_rgba(33,30,78,0.22)] font-bold border-l-4 border-[#C8A977]'
                      : 'text-slate-700 hover:bg-[#211E4E]/5 hover:text-[#211E4E]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <LayoutDashboard className={`w-4 h-4 ${currentTab === 'dashboard' ? 'text-[#C8A977]' : 'text-[#211E4E]/60'}`} />
                    <span>My LNA</span>
                  </div>
                </button>
              </div>
            </div>


          </div>
        )}

        {/* 3. HR VIEW NAVIGATION */}
        {activeRole === 'hr' && (
          <div className="space-y-4">
            
            {/* 3.1 HR Dashboard (Contains Dashboard, Masters & Reports) */}
            <div>
              <div className="px-3 py-1.5 text-[11px] font-bold tracking-wider text-[#211E4E] uppercase flex items-center gap-1.5 border-b border-[#C8A977]/25 pb-1.5 mb-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#C8A977]" />
                <span>HR Dashboard</span>
              </div>

              <div className="space-y-1">
                {/* Organizational Dashboard inside Administration */}
                <button
                  type="button"
                  onClick={() => onSelectTab('hr-dashboard')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl font-semibold text-left transition-all cursor-pointer ${
                    currentTab === 'hr-dashboard'
                      ? 'bg-[#211E4E] text-[#FFFFFF] shadow-[0_4px_12px_rgba(33,30,78,0.22)] font-bold border-l-4 border-[#C8A977]'
                      : 'text-slate-700 hover:bg-[#211E4E]/5 hover:text-[#211E4E]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <LayoutDashboard className={`w-4 h-4 ${currentTab === 'hr-dashboard' ? 'text-[#C8A977]' : 'text-[#211E4E]/60'}`} />
                    <span>LNA Dashboard</span>
                  </div>
                </button>

                {/* Employee Master */}
                <button
                  type="button"
                  onClick={() => onSelectTab('hr-employee-master')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl font-semibold text-left transition-all cursor-pointer ${
                    currentTab === 'hr-employee-master'
                      ? 'bg-[#211E4E] text-[#FFFFFF] shadow-[0_4px_12px_rgba(33,30,78,0.22)] font-bold border-l-4 border-[#C8A977]'
                      : 'text-slate-700 hover:bg-[#211E4E]/5 hover:text-[#211E4E]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Users className={`w-4 h-4 ${currentTab === 'hr-employee-master' ? 'text-[#C8A977]' : 'text-[#211E4E]/60'}`} />
                    <span>Employee Master</span>
                  </div>
                </button>

                {/* Release History (under Employee Master) */}
                <button
                  type="button"
                  onClick={() => onSelectTab('hr-assessment-history')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl font-semibold text-left transition-all cursor-pointer ${
                    currentTab === 'hr-assessment-history'
                      ? 'bg-[#211E4E] text-[#FFFFFF] shadow-[0_4px_12px_rgba(33,30,78,0.22)] font-bold border-l-4 border-[#C8A977]'
                      : 'text-slate-700 hover:bg-[#211E4E]/5 hover:text-[#211E4E]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <History className={`w-4 h-4 ${currentTab === 'hr-assessment-history' ? 'text-[#C8A977]' : 'text-[#211E4E]/60'}`} />
                    <span>Release History</span>
                  </div>
                </button>

                {/* Org Master (Organization Master) */}
                <button
                  type="button"
                  onClick={() => onSelectTab('hr-org-master')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl font-semibold text-left transition-all cursor-pointer ${
                    currentTab === 'hr-org-master'
                      ? 'bg-[#211E4E] text-[#FFFFFF] shadow-[0_4px_12px_rgba(33,30,78,0.22)] font-bold border-l-4 border-[#C8A977]'
                      : 'text-slate-700 hover:bg-[#211E4E]/5 hover:text-[#211E4E]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Landmark className={`w-4 h-4 ${currentTab === 'hr-org-master' ? 'text-[#C8A977]' : 'text-[#211E4E]/60'}`} />
                    <span>Org Master</span>
                  </div>
                </button>

                {/* Department Master */}
                <button
                  type="button"
                  onClick={() => onSelectTab('hr-department-master')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl font-semibold text-left transition-all cursor-pointer ${
                    currentTab === 'hr-department-master'
                      ? 'bg-[#211E4E] text-[#FFFFFF] shadow-[0_4px_12px_rgba(33,30,78,0.22)] font-bold border-l-4 border-[#C8A977]'
                      : 'text-slate-700 hover:bg-[#211E4E]/5 hover:text-[#211E4E]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Building2 className={`w-4 h-4 ${currentTab === 'hr-department-master' ? 'text-[#C8A977]' : 'text-[#211E4E]/60'}`} />
                    <span>Department Master</span>
                  </div>
                </button>

                {/* Division Master */}
                <button
                  type="button"
                  onClick={() => onSelectTab('hr-division-master')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl font-semibold text-left transition-all cursor-pointer ${
                    currentTab === 'hr-division-master'
                      ? 'bg-[#211E4E] text-[#FFFFFF] shadow-[0_4px_12px_rgba(33,30,78,0.22)] font-bold border-l-4 border-[#C8A977]'
                      : 'text-slate-700 hover:bg-[#211E4E]/5 hover:text-[#211E4E]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <GitBranch className={`w-4 h-4 ${currentTab === 'hr-division-master' ? 'text-[#C8A977]' : 'text-[#211E4E]/60'}`} />
                    <span>Division Master</span>
                  </div>
                </button>

                {/* Grade Master */}
                <button
                  type="button"
                  onClick={() => onSelectTab('hr-grade-master')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl font-semibold text-left transition-all cursor-pointer ${
                    currentTab === 'hr-grade-master'
                      ? 'bg-[#211E4E] text-[#FFFFFF] shadow-[0_4px_12px_rgba(33,30,78,0.22)] font-bold border-l-4 border-[#C8A977]'
                      : 'text-slate-700 hover:bg-[#211E4E]/5 hover:text-[#211E4E]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Award className={`w-4 h-4 ${currentTab === 'hr-grade-master' ? 'text-[#C8A977]' : 'text-[#211E4E]/60'}`} />
                    <span>Grade Master</span>
                  </div>
                </button>

                {/* Functional Master */}
                <button
                  type="button"
                  onClick={() => onSelectTab('hr-functional-master')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl font-semibold text-left transition-all cursor-pointer ${
                    currentTab === 'hr-functional-master' || currentTab === 'hr-add-functional-department'
                      ? 'bg-[#211E4E] text-[#FFFFFF] shadow-[0_4px_12px_rgba(33,30,78,0.22)] font-bold border-l-4 border-[#C8A977]'
                      : 'text-slate-700 hover:bg-[#211E4E]/5 hover:text-[#211E4E]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <FolderTree className={`w-4 h-4 ${currentTab === 'hr-functional-master' || currentTab === 'hr-add-functional-department' ? 'text-[#C8A977]' : 'text-[#211E4E]/60'}`} />
                    <span>Functional Master</span>
                  </div>
                </button>

                {/* Competency & Skills Master */}
                <button
                  type="button"
                  onClick={() => onSelectTab('hr-competency-skills-master')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl font-semibold text-left transition-all cursor-pointer ${
                    currentTab === 'hr-competency-skills-master' || currentTab === 'hr-competency-master' || currentTab === 'hr-skills-master'
                      ? 'bg-[#211E4E] text-[#FFFFFF] shadow-[0_4px_12px_rgba(33,30,78,0.22)] font-bold border-l-4 border-[#C8A977]'
                      : 'text-slate-700 hover:bg-[#211E4E]/5 hover:text-[#211E4E]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Layers className={`w-4 h-4 ${currentTab === 'hr-competency-skills-master' || currentTab === 'hr-competency-master' || currentTab === 'hr-skills-master' ? 'text-[#C8A977]' : 'text-[#211E4E]/60'}`} />
                    <span>Competency &amp; Skills Master</span>
                  </div>
                </button>

                {/* Delegation (above Reports) */}
                <button
                  type="button"
                  onClick={() => onSelectTab('hr-delegation')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl font-semibold text-left transition-all cursor-pointer ${
                    currentTab === 'hr-delegation'
                      ? 'bg-[#211E4E] text-[#FFFFFF] shadow-[0_4px_12px_rgba(33,30,78,0.22)] font-bold border-l-4 border-[#C8A977]'
                      : 'text-slate-700 hover:bg-[#211E4E]/5 hover:text-[#211E4E]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <UserCheck className={`w-4 h-4 ${currentTab === 'hr-delegation' ? 'text-[#C8A977]' : 'text-[#211E4E]/60'}`} />
                    <span>Delegation</span>
                  </div>
                </button>

                {/* Reports (inside Administration) */}
                <button
                  type="button"
                  onClick={() => onSelectTab('hr-reports')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl font-semibold text-left transition-all cursor-pointer ${
                    currentTab === 'hr-reports'
                      ? 'bg-[#211E4E] text-[#FFFFFF] shadow-[0_4px_12px_rgba(33,30,78,0.22)] font-bold border-l-4 border-[#C8A977]'
                      : 'text-slate-700 hover:bg-[#211E4E]/5 hover:text-[#211E4E]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <FileText className={`w-4 h-4 ${currentTab === 'hr-reports' ? 'text-[#C8A977]' : 'text-[#211E4E]/60'}`} />
                    <span>Reports</span>
                  </div>
                </button>
              </div>
            </div>

            {/* 3.2 LNA */}
            <div>
              <div className="px-3 py-1.5 text-[11px] font-bold tracking-wider text-[#211E4E] uppercase flex items-center gap-1.5 border-b border-[#C8A977]/25 pb-1.5 mb-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-[#C8A977]" />
                <span>LNA</span>
              </div>

              <div className="space-y-1">
                <button
                  type="button"
                  onClick={() => onSelectTab('hr-lna-dashboard')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl font-semibold text-left transition-all cursor-pointer ${
                    currentTab === 'hr-lna-dashboard'
                      ? 'bg-[#211E4E] text-[#FFFFFF] shadow-[0_4px_12px_rgba(33,30,78,0.22)] font-bold border-l-4 border-[#C8A977]'
                      : 'text-slate-700 hover:bg-[#211E4E]/5 hover:text-[#211E4E]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <LayoutDashboard className={`w-4 h-4 ${currentTab === 'hr-lna-dashboard' ? 'text-[#C8A977]' : 'text-[#211E4E]/60'}`} />
                    <span>My LNA</span>
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

