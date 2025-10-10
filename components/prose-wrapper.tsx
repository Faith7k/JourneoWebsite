import { ReactNode } from 'react';

export function ProseWrapper({ children }: { children: ReactNode }) {
  return (
    <div className="prose prose-slate max-w-none
      prose-headings:font-bold prose-headings:tracking-tight
      prose-h1:text-4xl prose-h1:mb-4
      prose-h2:text-3xl prose-h2:mt-8 prose-h2:mb-4
      prose-h3:text-2xl prose-h3:mt-6 prose-h3:mb-3
      prose-p:text-base prose-p:leading-7 prose-p:mb-4
      prose-ul:my-4 prose-ul:list-disc prose-ul:pl-6
      prose-ol:my-4 prose-ol:list-decimal prose-ol:pl-6
      prose-li:mb-2
      prose-strong:font-semibold
      prose-a:text-primary prose-a:underline hover:prose-a:no-underline
      dark:prose-invert
    ">
      {children}
    </div>
  );
}

