import React from 'react';
import { Competency, SelectedCompetencyState } from '../types';
import {
  CheckCircle2,
  AlertTriangle,
  Check,
  Layers
} from 'lucide-react';

interface CompetencySelectionSectionProps {
  functionalCompetencies: Competency[];
  behavioralCompetencies: Competency[];
  selectedCompetencies: SelectedCompetencyState[];
  onToggleCompetency: (competency: Competency) => void;
}

export const CompetencySelectionSection: React.FC<CompetencySelectionSectionProps> = ({
  functionalCompetencies,
  behavioralCompetencies,
  selectedCompetencies,
  onToggleCompetency
}) => {
  const selectedIds = new Set(selectedCompetencies.map((s) => s.competencyId));
  const totalSelected = selectedIds.size;
  const isComplete = totalSelected === 3;

  return (
    <section className="rounded-2xl bg-white/85 backdrop-blur-xl border border-white/80 shadow-[0_8px_30px_rgb(26,80,117,0.05)] overflow-hidden">
      {/* Section Header: GANS Enterprise Blue Theme with Glass Gradient */}
      <div className="bg-gradient-to-r from-[#1a5075] via-[#154668] to-[#0275a8] text-white px-5 py-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-white/15 text-white flex items-center justify-center border border-white/20">
            <Layers className="w-4 h-4 text-sky-200" />
          </div>
          <div>
            <h2 className="font-bold text-xs sm:text-sm tracking-wide">
              Competency Selection
            </h2>
            <p className="text-[11px] text-sky-100/90 font-medium">
              Select up to 3 competencies from the sections below
            </p>
          </div>
        </div>

        {/* Real-time Total Selection Counter Pill */}
        <div className="flex items-center gap-2">
          <div
            className={`px-3 py-1 rounded-full text-xs font-black flex items-center gap-1.5 transition-all shadow-xs ${
              isComplete
                ? 'bg-emerald-500 text-white ring-2 ring-emerald-300/60 shadow-emerald-900/20'
                : 'bg-black/20 text-sky-100 border border-white/20'
            }`}
          >
            {isComplete && <CheckCircle2 className="w-3.5 h-3.5" />}
            <span>Selected: {totalSelected} / 3</span>
          </div>
        </div>
      </div>

      {/* Subsections Layout: 2 Columns for Functional & Behavioral */}
      <div className="p-4 sm:p-5 grid grid-cols-1 lg:grid-cols-2 gap-5">
        
        {/* Subsection: Functional Competencies */}
        <div className="rounded-xl border border-slate-200/80 bg-white/70 shadow-2xs overflow-hidden flex flex-col">
          <div className="bg-[#f0f7fb]/90 backdrop-blur-xs px-4 py-2.5 border-b border-[#cde0ed] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#0275a8]" />
              <h3 className="font-extrabold text-xs sm:text-[13px] text-[#1a5075]">
                Functional Competencies
              </h3>
            </div>
          </div>

          <div className="p-3 space-y-2 flex-1">
            {functionalCompetencies.map((comp) => {
              const isSelected = selectedIds.has(comp.id);
              const isDisabled = !isSelected && totalSelected >= 3;

              return (
                <label
                  key={comp.id}
                  className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer select-none text-xs ${
                    isSelected
                      ? 'bg-gradient-to-r from-sky-50/90 to-blue-50/70 border-[#0275a8] ring-1 ring-[#0275a8]/30 shadow-xs'
                      : isDisabled
                      ? 'bg-slate-50/70 border-slate-200/60 text-slate-400 opacity-60 cursor-not-allowed'
                      : 'bg-white/80 border-slate-200 hover:border-sky-400 hover:bg-sky-50/40 text-slate-700 hover:shadow-2xs'
                  }`}
                >
                  <input
                    type="checkbox"
                    id={`comp-${comp.id}`}
                    checked={isSelected}
                    disabled={isDisabled}
                    onChange={() => onToggleCompetency(comp)}
                    className="w-4 h-4 text-[#0275a8] border-slate-300 rounded focus:ring-[#0275a8] cursor-pointer disabled:cursor-not-allowed shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    <span className={`font-extrabold text-xs ${isSelected ? 'text-[#0275a8]' : 'text-slate-800'}`}>
                      {comp.name}
                    </span>
                  </div>

                  {isSelected && (
                    <div className="shrink-0">
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-[#0275a8] text-white px-2.5 py-0.5 rounded-full shadow-xs">
                        <Check className="w-2.5 h-2.5" />
                        Selected
                      </span>
                    </div>
                  )}
                </label>
              );
            })}
          </div>
        </div>

        {/* Subsection: Behavioral Competencies */}
        <div className="rounded-xl border border-slate-200/80 bg-white/70 shadow-2xs overflow-hidden flex flex-col">
          <div className="bg-[#f0f7fb]/90 backdrop-blur-xs px-4 py-2.5 border-b border-[#cde0ed] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#1a5075]" />
              <h3 className="font-extrabold text-xs sm:text-[13px] text-[#1a5075]">
                Behavioral Competencies
              </h3>
            </div>
          </div>

          <div className="p-3 space-y-2 flex-1">
            {behavioralCompetencies.map((comp) => {
              const isSelected = selectedIds.has(comp.id);
              const isDisabled = !isSelected && totalSelected >= 3;

              return (
                <label
                  key={comp.id}
                  className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer select-none text-xs ${
                    isSelected
                      ? 'bg-gradient-to-r from-sky-50/90 to-blue-50/70 border-[#0275a8] ring-1 ring-[#0275a8]/30 shadow-xs'
                      : isDisabled
                      ? 'bg-slate-50/70 border-slate-200/60 text-slate-400 opacity-60 cursor-not-allowed'
                      : 'bg-white/80 border-slate-200 hover:border-sky-400 hover:bg-sky-50/40 text-slate-700 hover:shadow-2xs'
                  }`}
                >
                  <input
                    type="checkbox"
                    id={`comp-${comp.id}`}
                    checked={isSelected}
                    disabled={isDisabled}
                    onChange={() => onToggleCompetency(comp)}
                    className="w-4 h-4 text-[#0275a8] border-slate-300 rounded focus:ring-[#0275a8] cursor-pointer disabled:cursor-not-allowed shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    <span className={`font-extrabold text-xs ${isSelected ? 'text-[#0275a8]' : 'text-slate-800'}`}>
                      {comp.name}
                    </span>
                  </div>

                  {isSelected && (
                    <div className="shrink-0">
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-[#0275a8] text-white px-2.5 py-0.5 rounded-full shadow-xs">
                        <Check className="w-2.5 h-2.5" />
                        Selected
                      </span>
                    </div>
                  )}
                </label>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};
