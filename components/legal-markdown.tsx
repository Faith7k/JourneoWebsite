import { type ReactNode } from 'react';

/**
 * Minimal markdown → React for legal pages (no extra dependency).
 * Supports: # ## ### headings, paragraphs, -/* lists, **bold**, tables (simple),
 * horizontal rules, and bare links already written as https://…
 */
export function LegalMarkdown({ source }: { source: string }) {
  const blocks = splitBlocks(source.replace(/\r\n/g, '\n').trim());
  return <>{blocks.map((block, i) => renderBlock(block, i))}</>;
}

function splitBlocks(src: string): string[] {
  return src.split(/\n{2,}/).map((b) => b.trim()).filter(Boolean);
}

function renderBlock(block: string, key: number): ReactNode {
  if (block.startsWith('# ')) {
    return (
      <h1 key={key} className="text-3xl font-bold text-slate-100 mt-2 mb-4">
        {inline(block.slice(2))}
      </h1>
    );
  }
  if (block.startsWith('## ')) {
    return <h2 key={key}>{inline(block.slice(3))}</h2>;
  }
  if (block.startsWith('### ')) {
    return <h3 key={key}>{inline(block.slice(4))}</h3>;
  }
  if (/^---+$/.test(block)) {
    return <hr key={key} className="border-slate-700 my-6" />;
  }
  if (block.startsWith('> ')) {
    return (
      <p key={key} className="border-l-2 border-cyan-500/50 pl-4 italic text-slate-400">
        {inline(block.replace(/^>\s?/gm, ''))}
      </p>
    );
  }
  if (block.includes('|') && block.includes('\n') && block.split('\n')[0].includes('|')) {
    return renderTable(block, key);
  }
  if (/^[-*]\s/m.test(block)) {
    const items = block.split('\n').filter((l) => /^[-*]\s/.test(l));
    return (
      <ul key={key}>
        {items.map((item, i) => (
          <li key={i}>{inline(item.replace(/^[-*]\s+/, ''))}</li>
        ))}
      </ul>
    );
  }
  if (/^\d+\.\s/m.test(block)) {
    const items = block.split('\n').filter((l) => /^\d+\.\s/.test(l));
    return (
      <ol key={key} className="list-decimal pl-6 space-y-2">
        {items.map((item, i) => (
          <li key={i}>{inline(item.replace(/^\d+\.\s+/, ''))}</li>
        ))}
      </ol>
    );
  }
  // Strip a leading title line duplicate if present as plain "*italic footer*"
  return <p key={key}>{inline(block.replace(/\n/g, ' '))}</p>;
}

function renderTable(block: string, key: number): ReactNode {
  const rows = block
    .split('\n')
    .map((r) => r.trim())
    .filter((r) => r.startsWith('|') && !/^\|?\s*-+/.test(r));
  if (rows.length < 2) return <p key={key}>{inline(block)}</p>;
  const cells = rows.map((r) =>
    r
      .replace(/^\||\|$/g, '')
      .split('|')
      .map((c) => c.trim()),
  );
  const [header, ...body] = cells;
  return (
    <div key={key} className="overflow-x-auto my-4">
      <table className="w-full text-left text-sm border-collapse">
        <thead>
          <tr>
            {header.map((h, i) => (
              <th key={i} className="border-b border-slate-700 pb-2 pr-3 text-slate-200">
                {inline(h)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {body.map((row, ri) => (
            <tr key={ri}>
              {row.map((c, ci) => (
                <td key={ci} className="border-b border-slate-800 py-2 pr-3 align-top">
                  {inline(c)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function inline(text: string): ReactNode {
  // **bold**, then auto-link https://
  const parts: ReactNode[] = [];
  const re = /(\*\*[^*]+\*\*|https?:\/\/[^\s)]+)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    const token = m[0];
    if (token.startsWith('**')) {
      parts.push(<strong key={i++}>{token.slice(2, -2)}</strong>);
    } else {
      parts.push(
        <a
          key={i++}
          href={token}
          className="text-cyan-400 underline underline-offset-2 hover:text-cyan-300"
          target="_blank"
          rel="noopener noreferrer"
        >
          {token}
        </a>,
      );
    }
    last = m.index + token.length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return <>{parts}</>;
}
