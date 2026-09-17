import React, { useState, useRef, useEffect } from 'react';
import { EmployeeProfile } from '../types';
import {
  Search,
  Megaphone,
  MessageSquare,
  Settings,
  HelpCircle,
  Star,
  UserPlus,
  LogOut,
  Check,
  X
} from 'lucide-react';

interface GansHeaderProps {
  employee: EmployeeProfile;
  activeRole: 'employee' | 'manager' | 'hr';
  onSwitchRole: (role: 'employee' | 'manager' | 'hr') => void;
  onSwitchEmployee?: (emp: EmployeeProfile) => void;
  availableEmployees?: EmployeeProfile[];
}

export const GansHeader: React.FC<GansHeaderProps> = ({
  employee,
  activeRole,
  onSwitchRole,
  onSwitchEmployee,
  availableEmployees = []
}) => {
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showWaffle, setShowWaffle] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const userDropdownRef = useRef<HTMLDivElement>(null);
  const waffleRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
        setShowUserDropdown(false);
      }
      if (waffleRef.current && !waffleRef.current.contains(event.target as Node)) {
        setShowWaffle(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const initials = employee?.name
    ? employee.name
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'LW';

  return (
    <header className="w-full select-none sticky top-0 z-40 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.08)]">
      {/* =========================================================================
          TIER 1: MICROSOFT 365 SUITE BAR (Refined Sleek Bar)
          ========================================================================= */}
      <div className="bg-[#0b1015]/95 backdrop-blur-md text-white px-3 sm:px-4 py-0 flex items-center justify-between min-h-[44px] border-b border-white/10">
        {/* Left: 3x3 Waffle Dots & White Microsoft Logo Box */}
        <div className="flex items-center h-full gap-0">
          {/* Waffle 3x3 Dots */}
          <div ref={waffleRef} className="relative">
            <button
              type="button"
              onClick={() => setShowWaffle(!showWaffle)}
              title="App Launcher"
              className="w-9 h-9 rounded-md flex items-center justify-center hover:bg-white/15 transition-colors cursor-pointer text-white"
            >
              <div className="grid grid-cols-3 gap-[3px] p-1">
                <div className="w-[3px] h-[3px] bg-white rounded-[0.5px]" />
                <div className="w-[3px] h-[3px] bg-white rounded-[0.5px]" />
                <div className="w-[3px] h-[3px] bg-white rounded-[0.5px]" />
                <div className="w-[3px] h-[3px] bg-white rounded-[0.5px]" />
                <div className="w-[3px] h-[3px] bg-white rounded-[0.5px]" />
                <div className="w-[3px] h-[3px] bg-white rounded-[0.5px]" />
                <div className="w-[3px] h-[3px] bg-white rounded-[0.5px]" />
                <div className="w-[3px] h-[3px] bg-white rounded-[0.5px]" />
                <div className="w-[3px] h-[3px] bg-white rounded-[0.5px]" />
              </div>
            </button>

            {/* Microsoft 365 Apps Drawer */}
            {showWaffle && (
              <div className="absolute left-0 top-11 w-72 bg-white/95 backdrop-blur-2xl text-slate-800 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.25)] border border-slate-200/80 p-3.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                  <span className="font-bold text-xs text-slate-700 uppercase tracking-wider">
                    Microsoft 365 Apps
                  </span>
                  <span className="text-[10px] text-[#0078d4] font-bold">Portal Hub</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center text-[11px] font-medium">
                  <div
                    onClick={() => setShowWaffle(false)}
                    className="p-2 rounded-lg hover:bg-sky-50 hover:text-[#0078d4] cursor-pointer flex flex-col items-center gap-1 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#038387] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                      S
                    </div>
                    <span>SharePoint</span>
                  </div>
                  <div
                    onClick={() => setShowWaffle(false)}
                    className="p-2 rounded-lg hover:bg-sky-50 hover:text-[#0078d4] cursor-pointer flex flex-col items-center gap-1 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#464eb8] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                      T
                    </div>
                    <span>Teams</span>
                  </div>
                  <div
                    onClick={() => setShowWaffle(false)}
                    className="p-2 rounded-lg hover:bg-sky-50 hover:text-[#0078d4] cursor-pointer flex flex-col items-center gap-1 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#0078d4] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                      O
                    </div>
                    <span>Outlook</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Microsoft Label */}
          <div className="flex items-center gap-2 pl-2">
            <span className="text-white font-semibold text-xs tracking-tight hidden xs:inline">
              Microsoft 365
            </span>
          </div>
        </div>

        {/* Center: SharePoint Global Search Bar */}
        <div className="flex-1 max-w-xs sm:max-w-md md:max-w-lg mx-2 sm:mx-4">
          <div className="relative flex items-center w-full">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search across SharePoint..."
              className="w-full pl-8 pr-7 py-1.5 bg-white/10 hover:bg-white/15 focus:bg-white text-white focus:text-slate-800 placeholder:text-slate-400 text-xs rounded-md border border-transparent focus:border-sky-400 focus:outline-hidden transition-all shadow-inner"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Right: Suite Action Icons + User Name & Avatar */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* Megaphone / Announcements Icon */}
          <button
            type="button"
            onClick={() => setShowNotifications(!showNotifications)}
            title="What's New"
            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/15 transition-colors cursor-pointer text-white"
          >
            <Megaphone className="w-3.5 h-3.5" />
          </button>

          {/* Feedback / Messages Icon */}
          <button
            type="button"
            onClick={() => setShowNotifications(!showNotifications)}
            title="Feedback"
            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/15 transition-colors cursor-pointer text-white"
          >
            <MessageSquare className="w-3.5 h-3.5" />
          </button>

          {/* Settings Gear Icon */}
          <button
            type="button"
            onClick={() => setShowSettings(!showSettings)}
            title="Settings"
            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/15 transition-colors cursor-pointer text-white"
          >
            <Settings className="w-3.5 h-3.5" />
          </button>

          {/* Help Question Mark Icon */}
          <button
            type="button"
            onClick={() => setShowHelp(!showHelp)}
            title="Help"
            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/15 transition-colors cursor-pointer text-white"
          >
            <HelpCircle className="w-3.5 h-3.5" />
          </button>

          {/* User Profile (Name + LW Initials circle) */}
          <div ref={userDropdownRef} className="relative flex items-center gap-2 ml-1">
            <button
              type="button"
              onClick={() => setShowUserDropdown(!showUserDropdown)}
              className="flex items-center gap-2 py-1 px-2 rounded-lg hover:bg-white/15 transition-colors cursor-pointer text-left"
            >
              {/* Only Name, NO Department */}
              <span className="text-white text-xs font-semibold select-none hidden sm:inline">
                {employee.name || 'Leo Wilson'}
              </span>

              {/* Circle avatar badge with initials */}
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-slate-900 to-slate-700 border border-white/40 text-white font-bold text-[11px] flex items-center justify-center shadow-xs">
                {initials}
              </div>
            </button>

            {/* User Account Popover Dropdown */}
            {showUserDropdown && (
              <div className="absolute right-0 top-11 w-64 bg-white/95 backdrop-blur-2xl text-slate-800 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-slate-200/80 p-3.5 z-50 animate-in fade-in duration-100 text-xs">
                <div className="flex items-center gap-2.5 pb-2.5 border-b border-slate-100">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-slate-900 to-slate-700 border border-slate-300 text-white font-bold flex items-center justify-center text-xs shrink-0 shadow-xs">
                    {initials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-slate-900 text-xs truncate">
                      {employee.name || 'Leo Wilson'}
                    </div>
                    <div className="text-[11px] text-slate-500 truncate">
                      {employee.email || `${(employee.name || 'user').toLowerCase().replace(/\s+/g, '.')}@gans.aero`}
                    </div>
                  </div>
                </div>

                <div className="pt-2 space-y-0.5">
                  <button
                    type="button"
                    onClick={() => setShowUserDropdown(false)}
                    className="w-full text-left px-2.5 py-1.5 hover:bg-slate-100/70 rounded-lg flex items-center gap-2 text-slate-700 font-medium cursor-pointer transition-colors"
                  >
                    <Settings className="w-3.5 h-3.5 text-slate-500" />
                    <span>Settings</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowUserDropdown(false)}
                    className="w-full text-left px-2.5 py-1.5 hover:bg-slate-100/70 rounded-lg flex items-center gap-2 text-slate-700 font-medium cursor-pointer transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5 text-slate-500" />
                    <span>Sign out</span>
                  </button>
                </div>

                {/* Persona Switcher for prototype testing */}
                {availableEmployees.length > 0 && (
                  <div className="mt-2.5 pt-2 border-t border-slate-100">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">
                      Switch Active Account
                    </span>
                    <div className="space-y-0.5 max-h-36 overflow-y-auto">
                      {availableEmployees.map((emp) => (
                        <button
                          key={emp.employeeId}
                          type="button"
                          onClick={() => {
                            onSwitchEmployee?.(emp);
                            setShowUserDropdown(false);
                          }}
                          className={`w-full text-left px-2 py-1 rounded-lg text-[11px] flex items-center justify-between cursor-pointer transition-colors ${
                            employee.employeeId === emp.employeeId
                              ? 'bg-sky-50 text-[#0078d4] font-bold'
                              : 'hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <span className="truncate">{emp.name}</span>
                          {employee.employeeId === emp.employeeId && (
                            <Check className="w-3 h-3 text-[#0078d4]" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* =========================================================================
          TIER 2: SITE HEADER BAR (GANS Logo on Left + TALENT MANAGEMENT)
          ========================================================================= */}
      <div className="bg-white/95 backdrop-blur-xl border-b border-slate-200/80 px-4 sm:px-6 py-2.5 flex items-center justify-between transition-all">
        {/* Left: GANS Logo + TALENT MANAGEMENT Title */}
        <div className="flex items-center gap-3 sm:gap-5">
          {/* GANS Company Logo */}
          <div className="flex items-center shrink-0">
            <img
              src="https://www.yasholding.ae/assets/images/logo/company/gans.png"
              alt="GANS"
              referrerPolicy="no-referrer"
              className="h-7 sm:h-8 w-auto object-contain max-w-[140px] drop-shadow-2xs"
            />
          </div>

          <div className="h-5 w-[1px] bg-slate-200" />

          {/* TALENT MANAGEMENT Title */}
          <div className="flex items-center">
            <h1 className="text-sm sm:text-base md:text-lg font-bold tracking-wider text-[#1a5075] uppercase select-none font-sans">
              TALENT MANAGEMENT
            </h1>
          </div>
        </div>

        {/* Right: Role Switcher, Following & Site Access */}
        <div className="flex items-center gap-3">
          {/* Quick Role Switcher Pill (Glass Switcher) */}
          <div className="hidden lg:inline-flex items-center bg-slate-100/90 backdrop-blur-md p-1 rounded-xl border border-slate-200/90 shadow-inner">
            <button
              type="button"
              onClick={() => onSwitchRole('employee')}
              className={`px-3 py-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                activeRole === 'employee'
                  ? 'bg-gradient-to-r from-[#1a5075] to-[#0275a8] text-white shadow-[0_2px_8px_rgba(2,117,168,0.25)]'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Employee
            </button>
            <button
              type="button"
              onClick={() => onSwitchRole('manager')}
              className={`px-3 py-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                activeRole === 'manager'
                  ? 'bg-gradient-to-r from-[#1a5075] to-[#0275a8] text-white shadow-[0_2px_8px_rgba(2,117,168,0.25)]'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Manager
            </button>
            <button
              type="button"
              onClick={() => onSwitchRole('hr')}
              className={`px-3 py-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                activeRole === 'hr'
                  ? 'bg-gradient-to-r from-[#1a5075] to-[#0275a8] text-white shadow-[0_2px_8px_rgba(2,117,168,0.25)]'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              HR Admin
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
