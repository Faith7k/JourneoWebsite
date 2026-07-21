import { type ReactNode } from 'react';
import { FileText } from 'lucide-react';

type Props = {
  title: string;
  lastUpdated: string;
  children: ReactNode;
};

export function LegalLayout({ title, lastUpdated, children }: Props) {
  return (
    <div className="relative overflow-hidden bg-slate-950 py-24">
      <div className="absolute inset-0 bg-grid-pattern opacity-30" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-950" />
      <div className="container-modern relative">
        <div className="mx-auto max-w-3xl">
          <div className="mb-12 text-center">
            <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 shadow-glow">
              <FileText className="h-7 w-7 text-white" />
            </div>
            <h1 className="heading-modern bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
              {title}
            </h1>
            <p className="mt-3 text-sm text-slate-400">
              Last updated: <span className="text-slate-300">{lastUpdated}</span>
            </p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-8 backdrop-blur-sm md:p-12">
            <div className="legal-prose text-slate-300 space-y-6 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-slate-100 [&_h2]:mt-8 [&_h2]:mb-4 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-slate-200 [&_h3]:mt-6 [&_h3]:mb-3 [&_p]:leading-relaxed [&_p]:text-slate-300 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 [&_ul]:text-slate-300 [&_li]:text-slate-300 [&_strong]:text-slate-100">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}