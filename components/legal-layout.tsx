import { type ReactNode } from 'react';
import { FileText } from 'lucide-react';

type Props = {
  title: string;
  lastUpdated: string;
  children: ReactNode;
};

export function LegalLayout({ title, lastUpdated, children }: Props) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#FAF7F2] py-24">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[#FAF7F2]" />
      <div className="absolute inset-0 bg-map-grid opacity-100" />
      
      {/* Topographic Contours SVGs */}
      <svg className="absolute -left-10 top-10 w-[500px] h-[500px] text-amber-900/[0.035] pointer-events-none" viewBox="0 0 100 100" fill="none">
        <path className="map-contour" d="M-20,10 C15,-5 25,25 35,50 C45,75 75,85 120,90" />
        <path className="map-contour" d="M-20,25 C20,10 30,40 40,65 C50,90 85,100 130,105" />
      </svg>
      <svg className="absolute -right-20 bottom-10 w-[500px] h-[500px] text-amber-900/[0.035] pointer-events-none" viewBox="0 0 100 100" fill="none">
        <path className="map-contour" d="M30,120 C40,90 70,80 85,55 C100,30 80,10 120,-20" />
        <path className="map-contour" d="M15,120 C25,80 60,70 75,45 C90,20 70,0 110,-30" />
      </svg>

      <div className="container-modern relative z-10">
        <div className="mx-auto max-w-3xl">
          <div className="mb-12 text-center">
            <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-md shadow-amber-600/20">
              <FileText className="h-7 w-7 text-white" />
            </div>
            <h1 className="heading-modern text-gradient">
              {title}
            </h1>
            <p className="mt-3 text-sm text-stone-500">
              Last updated: <span className="text-stone-700 font-medium">{lastUpdated}</span>
            </p>
          </div>
          <div className="rounded-2xl border border-amber-900/10 bg-white/85 p-8 backdrop-blur-sm shadow-xl md:p-12">
            <div className="legal-prose text-stone-700 space-y-6 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-stone-900 [&_h2]:mt-8 [&_h2]:mb-4 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-stone-800 [&_h3]:mt-6 [&_h3]:mb-3 [&_p]:leading-relaxed [&_p]:text-stone-700 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 [&_ul]:text-stone-700 [&_li]:text-stone-700 [&_strong]:text-stone-900">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}