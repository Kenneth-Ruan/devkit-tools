'use client';
import { useState } from 'react';

function parseCurl(curl: string): string {
  let s = curl.trim().replace(/\\\n/g, ' ').replace(/\s+/g, ' ');
  if (!s.startsWith('curl ')) return '// Could not parse curl command';

  let url = '';
  let method = 'GET';
  const headers: Record<string, string> = {};
  let body: string | null = null;

  const tokens = s.slice(5).match(/(?:[^\s'"]+|'[^']*'|"[^"]*")+/g) ?? [];

  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i];
    const unquote = (x: string) => x.replace(/^['"]|['"]$/g, '');

    if (t === '-X' || t === '--request') {
      method = tokens[++i]?.toUpperCase() ?? 'GET';
    } else if (t === '-H' || t === '--header') {
      const hdr = unquote(tokens[++i] ?? '');
      const idx = hdr.indexOf(':');
      if (idx > 0) headers[hdr.slice(0, idx).trim()] = hdr.slice(idx + 1).trim();
    } else if (t === '-d' || t === '--data' || t === '--data-raw' || t === '--data-binary') {
      body = unquote(tokens[++i] ?? '');
      if (method === 'GET') method = 'POST';
    } else if (t === '--json') {
      body = unquote(tokens[++i] ?? '');
      method = method === 'GET' ? 'POST' : method;
      headers['Content-Type'] = 'application/json';
    } else if (!t.startsWith('-')) {
      url = unquote(t);
    }
  }

  const opts: string[] = [];
  if (method !== 'GET') opts.push(`  method: '${method}'`);
  if (Object.keys(headers).length) {
    const hLines = Object.entries(headers).map(([k, v]) => `    '${k}': '${v}'`).join(',\n');
    opts.push(`  headers: {\n${hLines}\n  }`);
  }
  if (body) {
    const escaped = body.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\${/g, '\\${');
    opts.push(`  body: \`${escaped}\``);
  }

  const optsStr = opts.length ? `, {\n${opts.join(',\n')}\n}` : '';
  return `const response = await fetch('${url}'${optsStr});\nconst data = await response.json();\nconsole.log(data);`;
}

export default function CurlToFetch() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  function convert() {
    setOutput(parseCurl(input));
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button onClick={convert} className="btn-primary">Convert</button>
        {output && <button onClick={() => navigator.clipboard.writeText(output)} className="btn-secondary ml-auto">Copy</button>}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-slate-500 mb-1 block">cURL Command</label>
          <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={14}
            placeholder={"curl -X POST 'https://api.example.com/data' \\\n  -H 'Authorization: Bearer token' \\\n  -H 'Content-Type: application/json' \\\n  -d '{\"key\": \"value\"}'"}
            className="tool-textarea" />
        </div>
        <div>
          <label className="text-xs text-slate-500 mb-1 block">JavaScript fetch()</label>
          <textarea readOnly value={output} rows={14} className="tool-textarea opacity-80" />
        </div>
      </div>
    </div>
  );
}
