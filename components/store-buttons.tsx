'use client';

import React from 'react';

export function AppleLogo({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.85c.62-.75 1.04-1.8 0.92-2.85-.9.04-2 .6-2.63 1.34-.56.65-.97 1.7-.84 2.73 1.01.08 2.03-.5 2.55-1.22z" />
    </svg>
  );
}

export function GooglePlayLogo({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734c0-.38.217-.724.61-.92z" />
      <path d="M14.909 13.114l2.443 2.443-11.458 6.615 9.015-9.058z" />
      <path d="M14.909 10.886L5.894 1.828l11.458 6.615-2.443 2.443z" />
      <path d="M16.323 12.3l3.14-1.813c.71-.41.71-1.078 0-1.488l-3.14-1.813-2.17 2.17 2.17 2.17z" />
    </svg>
  );
}

interface StoreButtonsProps {
  appStoreUrl?: string;
  playStoreUrl?: string;
  className?: string;
}

export function StoreButtons({ appStoreUrl, playStoreUrl, className = '' }: StoreButtonsProps) {
  const buttonStyle =
    "inline-flex items-center justify-center gap-3.5 px-7 py-3.5 bg-[#14151f] hover:bg-[#1c1e2b] border border-[#2a2c3a] hover:border-white/25 rounded-[20px] shadow-lg shadow-black/20 text-white transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] cursor-pointer group select-none min-w-[200px]";

  const disabledStyle =
    "inline-flex items-center justify-center gap-3.5 px-7 py-3.5 bg-[#14151f]/80 border border-[#2a2c3a]/80 rounded-[20px] shadow-md text-white/50 cursor-not-allowed select-none min-w-[200px]";

  return (
    <div className={`flex flex-col sm:flex-row items-center justify-center gap-4 ${className}`}>
      {/* App Store Button */}
      {appStoreUrl ? (
        <a
          href={appStoreUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={buttonStyle}
        >
          <AppleLogo className="w-7 h-7 text-white fill-current shrink-0 group-hover:scale-105 transition-transform" />
          <span className="text-white font-bold text-lg tracking-tight">App Store</span>
        </a>
      ) : (
        <div className={disabledStyle}>
          <AppleLogo className="w-7 h-7 text-white/50 fill-current shrink-0" />
          <span className="text-white/50 font-bold text-lg tracking-tight">App Store</span>
        </div>
      )}

      {/* Google Play Button */}
      {playStoreUrl ? (
        <a
          href={playStoreUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={buttonStyle}
        >
          <GooglePlayLogo className="w-7 h-7 text-white fill-current shrink-0 group-hover:scale-105 transition-transform" />
          <span className="text-white font-bold text-lg tracking-tight">Google Play</span>
        </a>
      ) : (
        <div className={disabledStyle}>
          <GooglePlayLogo className="w-7 h-7 text-white/50 fill-current shrink-0" />
          <span className="text-white/50 font-bold text-lg tracking-tight">Google Play</span>
        </div>
      )}
    </div>
  );
}
