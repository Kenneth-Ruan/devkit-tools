'use client';
import { useState, useMemo } from 'react';
import SplitPane from '@/components/SplitPane';
import { dumpYaml } from '@/lib/transforms';

const SAMPLE = `<?xml version="1.0" encoding="UTF-8"?>
<config>
  <database>
    <host>localhost</host>
    <port>5432</port>
    <name>mydb</name>
  </database>
  <server>
    <port>3000</port>
    <debug>true</debug>
  </server>
</config>`;

function xmlNodeToObj(node: Element): unknown {
  const children = Array.from(node.children);
  if (children.length === 0) {
    const text = node.textContent?.trim() ?? '';
    if (text === 'true') return true;
    if (text === 'false') return false;
    const num = Number(text);
    if (text !== '' && !isNaN(num)) return num;
    return text || null;
  }
  const obj: Record<string, unknown> = {};
  for (const child of children) {
    const key = child.tagName;
    const val = xmlNodeToObj(child);
    if (key in obj) {
      if (!Array.isArray(obj[key])) obj[key] = [obj[key]];
      (obj[key] as unknown[]).push(val);
    } else {
      obj[key] = val;
    }
  }
  return obj;
}

function convertXmlToYaml(xml: string): string {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xml, 'application/xml');
  const err = doc.querySelector('parsererror');
  if (err) throw new Error(err.textContent?.trim() ?? 'Invalid XML');
  const root = doc.documentElement;
  return dumpYaml({ [root.tagName]: xmlNodeToObj(root) });
}

export default function XmlToYaml() {
  const [input, setInput] = useState(SAMPLE);

  const { output, error } = useMemo(() => {
    if (!input.trim()) return { output: '', error: '' };
    try {
      return { output: convertXmlToYaml(input), error: '' };
    } catch (e) {
      return { output: '', error: (e as Error).message };
    }
  }, [input]);

  return (
    <div className="space-y-3">
      <div className="flex gap-2 items-center">
        {output && <button onClick={() => navigator.clipboard.writeText(output)} className="btn-secondary ml-auto">Copy YAML</button>}
      </div>
      <SplitPane
        left={
          <div>
            <label className="text-xs text-slate-500 mb-1 block">XML Input</label>
            <textarea value={input} onChange={(e) => setInput(e.target.value)}
              rows={18} className={`tool-textarea ${error ? 'border-red-700' : ''}`} placeholder="<root>...</root>" />
          </div>
        }
        right={
          <div className="flex flex-col h-full">
            <label className="text-xs text-slate-500 mb-1 block">YAML Output</label>
            {error ? (
              <div className="bg-red-900/20 border border-red-700 rounded-lg p-3 text-red-400 text-sm">{error}</div>
            ) : (
              <textarea readOnly value={output} rows={18} className="tool-textarea opacity-80" />
            )}
          </div>
        }
      />
    </div>
  );
}
