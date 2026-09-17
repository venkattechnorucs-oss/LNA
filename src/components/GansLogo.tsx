import React, { useState } from 'react';

export const GansLogo: React.FC<{ className?: string; width?: number; height?: number }> = ({
  className = '',
  height = 40
}) => {
  const [imgError, setImgError] = useState(false);

  if (imgError) {
    // Fallback vector representation if network image is blocked
    return (
      <div className={`inline-flex items-center gap-2 select-none ${className}`}>
        <svg
          width={height * 1.05}
          height={height * 1.05}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="shrink-0"
        >
          <path d="M18 24 L18 60 C18 60 22 36 60 36 C60 36 28 32 18 24 Z" fill="#c5a368" />
          <path d="M82 76 L82 40 C82 40 78 64 40 64 C40 64 72 68 82 76 Z" fill="#c5a368" />
          <polygon points="14,80 84,18 78,16 10,76" fill="#caa673" />
        </svg>
        <span
          className="font-black tracking-widest text-[#2f3136] leading-none text-xl"
          style={{ fontFamily: 'system-ui, sans-serif' }}
        >
          GANS
        </span>
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center select-none ${className}`}>
      <img
        src="https://www.yasholding.ae/assets/images/logo/company/gans.png"
        alt="GANS - Global Air Navigation Services"
        referrerPolicy="no-referrer"
        onError={() => setImgError(true)}
        className="object-contain"
        style={{
          height: `${height}px`,
          maxHeight: `${height}px`,
          width: 'auto'
        }}
      />
    </div>
  );
};

export const HrWeyakLogo: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`inline-flex items-center gap-1.5 select-none ${className}`}>
      <div className="flex flex-col items-end text-right">
        <div className="flex items-center gap-1">
          <span className="text-[#096f9c] font-extrabold text-[15px] tracking-tight leading-none">
            HR
          </span>
          <span className="text-[#1a5075] font-serif text-[18px] italic leading-none font-bold text-sky-800">
            ويّاك
          </span>
        </div>
        <span className="text-[9px] text-[#0275a8] font-medium tracking-tighter leading-none -mt-0.5">
          weyak
        </span>
      </div>
    </div>
  );
};

