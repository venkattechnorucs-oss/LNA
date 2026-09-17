import React from 'react';
import { AlertTriangle, XCircle, X } from 'lucide-react';

interface ValidationBannerProps {
  errors: string[];
  onDismiss?: () => void;
}

export const ValidationBanner: React.FC<ValidationBannerProps> = ({ errors, onDismiss }) => {
  if (errors.length === 0) return null;

  return (
    <div className="mb-6 p-4.5 bg-red-50/90 backdrop-blur-xl border border-red-200/90 rounded-2xl shadow-[0_8px_30px_rgb(220,38,38,0.06)] text-xs text-red-950">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-red-100/80 border border-red-300 flex items-center justify-center shrink-0 mt-0.5 text-red-700 shadow-2xs">
            <XCircle className="w-5 h-5 text-red-700" />
          </div>
          <div>
            <h3 className="font-extrabold text-xs sm:text-sm text-red-900 mb-1">
              Submission Validation Error(s)
            </h3>
            <p className="text-[11px] text-red-800 mb-2">
              Please resolve the following requirements before submitting your Learning Needs Analysis:
            </p>
            <ul className="list-disc list-inside space-y-1 text-xs text-red-900 font-medium pl-1">
              {errors.map((err, idx) => (
                <li key={idx} className="leading-snug">
                  {err}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            className="text-red-600 hover:text-red-900 p-1.5 rounded-lg hover:bg-red-100/60 transition-colors text-xs font-bold cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
