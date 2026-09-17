import React, { useEffect } from 'react';
import { LNAAssessmentSubmission } from '../types';
import { CheckCircle2, X, Sparkles } from 'lucide-react';

interface SubmissionModalProps {
  submission: LNAAssessmentSubmission | null;
  isOpen: boolean;
  onClose: () => void;
}

export const SubmissionModal: React.FC<SubmissionModalProps> = ({
  submission,
  isOpen,
  onClose
}) => {
  // Auto-dismiss after 2.5 seconds
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  if (!isOpen || !submission) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white/95 backdrop-blur-2xl border border-white/80 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.25)] w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200 p-6 text-center relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100/80 transition-colors cursor-pointer"
          title="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Green Tick Mark Icon with Glass Glow */}
        <div className="relative w-20 h-20 mx-auto mb-4 flex items-center justify-center">
          <div className="absolute inset-0 bg-emerald-400/20 rounded-full blur-xl animate-pulse" />
          <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center shadow-lg shadow-emerald-600/30 border border-white/40">
            <CheckCircle2 className="w-9 h-9 text-white" />
          </div>
        </div>

        {/* Title */}
        <h3 className="text-lg font-black text-slate-900 tracking-tight">
          LNA Submitted Successfully
        </h3>
        <p className="text-xs text-slate-500 mt-1 font-medium">
          Your submission has been forwarded to your Manager for review.
        </p>
      </div>
    </div>
  );
};
