'use client';
import { useState, useMemo } from 'react';
import { parseCurl } from '@/lib/transforms';
import SplitPane from '@/components/SplitPane';

export default function CurlToFetch() {
  const [input, setInput] = useState('');

  const output = useMemo(() => (input.trim() ? parseCurl(input) : ''), [input]);

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        {output && <button onClick={() => navigator.clipboard.writeText(output)} className="btn-secondary">Copy</button>}
      </div>
      <SplitPane
        left={
          <div>
            <label className="text-xs text-slate-500 mb-1 block">cURL Command</label>
            <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={14}
              placeholder={"curl -X POST 'https://api.example.com/data' \\\n  -H 'Authorization: Bearer token' \\\n  -H 'Content-Type: application/json' \\\n  -d '{\"key\": \"value\"}'"}
              className="tool-textarea" />
          </div>
        }
        right={
          <div>
            <label className="text-xs text-slate-500 mb-1 block">JavaScript fetch()</label>
            <textarea readOnly value={output} rows={14} className="tool-textarea opacity-80" />
          </div>
        }
      />
    </div>
  );
}
