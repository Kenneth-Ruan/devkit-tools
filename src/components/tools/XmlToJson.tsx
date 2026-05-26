'use client';
import { useState, useMemo } from 'react';
import SplitPane from '@/components/SplitPane';

const SAMPLE = `<?xml version="1.0" encoding="UTF-8"?>
<catalog>
  <book id="1">
    <title>Clean Code</title>
    <author>Robert Martin</author>
    <year>2008</year>
  </book>
  <book id="2">
    <title>The Pragmatic Programmer</title>
    <author>Dave Thomas</author>
    <year>1999</year>
  </book>
</catalog>`;

function xmlNodeToJson(node: Element): unknown {
  const children = Array.from(node.children);
  const attrs = Array.from(node.attributes);

  if (children.length === 0 && attrs.length === 0) {
    return node.textContent?.trim() ?? null;
  }

  const obj: Record<string, unknown> = {};

  for (const attr of attrs) {
    obj[`@${attr.name}`] = attr.value;
  }

  if (children.length === 0) {
    const text = node.textContent?.trim();
    if (text) obj['#text'] = text;
    return obj;
  }

  for (const child of children) {
    const key = child.tagName;
    const val = xmlNodeToJson(child);
    if (key in obj) {
      if (!Array.isArray(obj[key])) obj[key] = [obj[key]];
      (obj[key] as unknown[]).push(val);
    } else {
      obj[key] = val;
    }
  }
  return obj;
}

function convertXmlToJson(xml: string): string {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xml, 'application/xml');
  const err = doc.querySelector('parsererror');
  if (err) throw new Error(err.textContent?.trim() ?? 'Invalid XML');
  const root = doc.documentElement;
  return JSON.stringify({ [root.tagName]: xmlNodeToJson(root) }, null, 2);
}

export default function XmlToJson() {
  const [input, setInput] = useState(SAMPLE);

  const { output, error } = useMemo(() => {
    if (!input.trim()) return { output: '', error: '' };
    try {
      return { output: convertXmlToJson(input), error: '' };
    } catch (e) {
      return { output: '', error: (e as Error).message };
    }
  }, [input]);

  return (
    <div className="space-y-3">
      <div className="flex gap-2 items-center">
        {output && <button onClick={() => navigator.clipboard.writeText(output)} className="btn-secondary ml-auto">Copy JSON</button>}
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
            <label className="text-xs text-slate-500 mb-1 block">JSON Output</label>
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
