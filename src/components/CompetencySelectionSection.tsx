import React from 'react';
import { Competency, SelectedCompetencyState } from '../types';
import {
  CheckCircle2,
  AlertTriangle,
  Check,
  Layers
} from 'lucide-react';

interface CompetencySelectionSectionProps {
  behavioralCompetencies: Competency[];
  functionalCompetencies: Competency[];
  selectedCompetencies: SelectedCompetencyState[];
  onToggleCompetency: (competency: Competency) => void;
}

export const CompetencySelectionSection: React.FC<CompetencySelectionSectionProps> = ({
  behavioralCompetencies,
  functionalCompetencies,
  selectedCompetencies,
  onToggleCompetency
}) => {
  const selectedIds = new Set(selectedCompetencies.map((s) => s.competencyId));
  const totalSelected = selectedIds.size;
  const isComplete = totalSelected === 3;

  return (
    <section className="rounded-2xl bg-white/90 backdrop-blur-xl border border-[#C8A977]/25 shadow-[0_8px_30px_rgb(33,30,78,0.06)] overflow-hidden">
      {/* Section Header: Client Brand Colors (Night #211E4E + Gold #C8A977 + Cloud #FFFFFF) */}
      <div className="bg-[#211E4E] text-white px-5 py-3 flex flex-wrap items-center justify-between gap-2 border-b border-[#C8A977]/25">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-white/10 text-white flex items-center justify-center border border-[#C8A977]/30">
            <Layers className="w-4 h-4 text-[#C8A977]" />
          </div>
          <div>
            <h2 className="font-bold text-xs sm:text-sm tracking-wide text-white">
              Competency Selection
            </h2>
            <p className="text-[11px] text-[#dfcaa8] font-medium">
              Select up to 3 competencies from the sections below
            </p>
          </div>
        </div>

        {/* Real-time Total Selection Counter Pill */}
        <div className="flex items-center gap-2">
          <div
            className={`px-3 py-1 rounded-full text-xs font-black flex items-center gap-1.5 transition-all shadow-xs ${
              isComplete
                ? 'bg-[#C8A977] text-[#211E4E] ring-2 ring-[#C8A977]/60'
                : 'bg-black/30 text-white border border-[#C8A977]/30'
            }`}
          >
            {isComplete && <CheckCircle2 className="w-3.5 h-3.5" />}
            <span>Selected: {totalSelected} / 3</span>
          </div>
        </div>
      </div>

      {/* Subsections Layout: 2 Columns for Behavioral (First) & Functional (Second) */}
      <div className="p-4 sm:p-5 grid grid-cols-1 lg:grid-cols-2 gap-5">
        
        {/* Subsection: Behavioral Competencies (FIRST) */}
        <div className="rounded-xl border border-slate-200/90 bg-white shadow-2xs overflow-hidden flex flex-col">
          <div className="bg-[#fcfaf7] px-4 py-2.5 border-b border-[#C8A977]/25 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#211E4E]" />
              <h3 className="font-extrabold text-xs sm:text-[13px] text-[#211E4E]">
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
                      ? 'bg-[#211E4E]/5 border-[#C8A977] ring-1 ring-[#C8A977]/40 shadow-xs'
                      : isDisabled
                      ? 'bg-slate-50/70 border-slate-200/60 text-slate-400 opacity-60 cursor-not-allowed'
                      : 'bg-white border-slate-200 hover:border-[#C8A977]/60 hover:bg-[#C8A977]/5 text-slate-700 hover:shadow-2xs'
                  }`}
                >
                  <input
                    type="checkbox"
                    id={`comp-${comp.id}`}
                    checked={isSelected}
                    disabled={isDisabled}
                    onChange={() => onToggleCompetency(comp)}
                    className="w-4 h-4 text-[#211E4E] border-slate-300 rounded focus:ring-[#211E4E] cursor-pointer disabled:cursor-not-allowed shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    <span className={`font-extrabold text-xs ${isSelected ? 'text-[#211E4E]' : 'text-slate-800'}`}>
                      {comp.name}
                    </span>
                  </div>

                  {isSelected && (
                    <div className="shrink-0">
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-[#211E4E] text-[#C8A977] border border-[#C8A977]/30 px-2.5 py-0.5 rounded-full shadow-xs">
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

        {/* Subsection: Functional Competencies (SECOND) */}
        <div className="rounded-xl border border-slate-200/90 bg-white shadow-2xs overflow-hidden flex flex-col">
          <div className="bg-[#fcfaf7] px-4 py-2.5 border-b border-[#C8A977]/25 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#C8A977]" />
              <h3 className="font-extrabold text-xs sm:text-[13px] text-[#211E4E]">
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
                      ? 'bg-[#211E4E]/5 border-[#C8A977] ring-1 ring-[#C8A977]/40 shadow-xs'
                      : isDisabled
                      ? 'bg-slate-50/70 border-slate-200/60 text-slate-400 opacity-60 cursor-not-allowed'
                      : 'bg-white border-slate-200 hover:border-[#C8A977]/60 hover:bg-[#C8A977]/5 text-slate-700 hover:shadow-2xs'
                  }`}
                >
                  <input
                    type="checkbox"
                    id={`comp-${comp.id}`}
                    checked={isSelected}
                    disabled={isDisabled}
                    onChange={() => onToggleCompetency(comp)}
                    className="w-4 h-4 text-[#211E4E] border-slate-300 rounded focus:ring-[#211E4E] cursor-pointer disabled:cursor-not-allowed shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    <span className={`font-extrabold text-xs ${isSelected ? 'text-[#211E4E]' : 'text-slate-800'}`}>
                      {comp.name}
                    </span>
                  </div>

                  {isSelected && (
                    <div className="shrink-0">
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-[#211E4E] text-[#C8A977] border border-[#C8A977]/30 px-2.5 py-0.5 rounded-full shadow-xs">
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
