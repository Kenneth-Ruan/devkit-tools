'use client';
import { useState } from 'react';

const KEYWORDS = ['SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'NOT', 'IN', 'BETWEEN', 'LIKE', 'IS', 'NULL',
  'ORDER BY', 'GROUP BY', 'HAVING', 'LIMIT', 'OFFSET', 'JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN',
  'OUTER JOIN', 'FULL JOIN', 'CROSS JOIN', 'ON', 'AS', 'INSERT INTO', 'VALUES', 'UPDATE', 'SET',
  'DELETE FROM', 'CREATE TABLE', 'ALTER TABLE', 'DROP TABLE', 'INDEX', 'UNIQUE', 'PRIMARY KEY',
  'FOREIGN KEY', 'REFERENCES', 'CONSTRAINT', 'WITH', 'UNION', 'ALL', 'DISTINCT', 'CASE', 'WHEN',
  'THEN', 'ELSE', 'END', 'EXISTS', 'ASC', 'DESC', 'RETURNING'];

function formatSql(sql: string, indent: number): string {
  let s = sql.trim();
  const INDENT = ' '.repeat(indent);
  const breakBefore = ['SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'ORDER BY', 'GROUP BY', 'HAVING',
    'LIMIT', 'OFFSET', 'JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN', 'OUTER JOIN', 'FULL JOIN',
    'CROSS JOIN', 'ON', 'UNION', 'RETURNING'];

  const pattern = new RegExp(`\\b(${breakBefore.join('|')})\\b`, 'gi');
  s = s.replace(pattern, '\n$1');
  const lines = s.split('\n').map((l) => l.trim()).filter(Boolean);

  return lines.map((line, i) => {
    const upper = line.toUpperCase();
    const kw = KEYWORDS.find((k) => upper.startsWith(k));
    if (!kw || i === 0) return line;
    const isTopLevel = ['SELECT', 'FROM', 'WHERE', 'ORDER BY', 'GROUP BY', 'HAVING', 'LIMIT', 'OFFSET', 'JOIN',
      'LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN', 'OUTER JOIN', 'FULL JOIN', 'CROSS JOIN', 'UNION', 'RETURNING'].includes(kw);
    return isTopLevel ? line : INDENT + line;
  }).join('\n');
}

export default function SqlFormatter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [indent, setIndent] = useState(2);

  function format() {
    setOutput(formatSql(input, indent));
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap items-center">
        <button onClick={format} className="btn-primary">Format SQL</button>
        <div className="flex items-center gap-2 ml-2">
          <label className="text-xs text-slate-500">Indent:</label>
          {[2, 4].map((n) => (
            <button key={n} onClick={() => setIndent(n)}
              className={`px-3 py-1 rounded text-sm ${indent === n ? 'btn-primary' : 'btn-secondary'}`}>{n}</button>
          ))}
        </div>
        {output && <button onClick={() => navigator.clipboard.writeText(output)} className="btn-secondary ml-auto">Copy</button>}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-slate-500 mb-1 block">Input SQL</label>
          <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={18}
            placeholder={'SELECT * FROM users WHERE id = 1 AND active = true ORDER BY created_at DESC;'}
            className="tool-textarea" />
        </div>
        <div>
          <label className="text-xs text-slate-500 mb-1 block">Output</label>
          <textarea readOnly value={output} rows={18} className="tool-textarea opacity-80" />
        </div>
      </div>
    </div>
  );
}
