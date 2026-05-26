'use client';
import { useState, useCallback } from 'react';

type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

interface NodeProps {
  value: JsonValue;
  keyName?: string;
  depth: number;
  isLast: boolean;
  expandAll: boolean;
}

const TYPE_COLOR: Record<string, string> = {
  string:  'text-green-400',
  number:  'text-yellow-400',
  boolean: 'text-blue-400',
  null:    'text-slate-500',
};

function valuePreview(v: JsonValue): string {
  if (Array.isArray(v)) return `[${v.length}]`;
  if (v !== null && typeof v === 'object') return `{${Object.keys(v).length}}`;
  return '';
}

function JsonNode({ value, keyName, depth, isLast, expandAll }: NodeProps) {
  const [open, setOpen] = useState(depth < 2);

  const isObject = value !== null && typeof value === 'object';
  const entries = isObject
    ? Array.isArray(value)
      ? value.map((v, i) => [String(i), v] as [string, JsonValue])
      : Object.entries(value as Record<string, JsonValue>)
    : [];

  const comma = isLast ? '' : ',';
  const indent = depth * 14;

  if (!isObject) {
    const type = value === null ? 'null' : typeof value;
    const display = type === 'string' ? JSON.stringify(value) : String(value);
    return (
      <div className="flex items-baseline" style={{ paddingLeft: indent }}>
        {keyName !== undefined && (
          <span className="text-indigo-300 mr-1">
            &quot;{keyName}&quot;<span className="text-slate-500">: </span>
          </span>
        )}
        <span className={TYPE_COLOR[type]}>{display}</span>
        <span className="text-slate-600">{comma}</span>
      </div>
    );
  }

  const isArr = Array.isArray(value);
  const open_ = expandAll ? true : open;
  const [openL, openR] = isArr ? ['[', ']'] : ['{', '}'];

  return (
    <div style={{ paddingLeft: keyName !== undefined ? indent : 0 }}>
      <div
        className="flex items-baseline cursor-pointer select-none hover:bg-white/[0.03] rounded px-1 -mx-1"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="text-slate-600 w-3 shrink-0 text-xs">{open_ ? '▾' : '▸'}</span>
        {keyName !== undefined && (
          <span className="text-indigo-300 mr-1">
            &quot;{keyName}&quot;<span className="text-slate-500">: </span>
          </span>
        )}
        <span className="text-slate-400">{openL}</span>
        {!open_ && (
          <span className="text-slate-500 mx-1 text-xs italic">
            {valuePreview(value)}
          </span>
        )}
        {!open_ && <span className="text-slate-400">{openR}</span>}
        {!open_ && <span className="text-slate-600">{comma}</span>}
      </div>

      {open_ && (
        <>
          <div style={{ paddingLeft: 14 }}>
            {entries.map(([k, v], i) => (
              <JsonNode
                key={k}
                keyName={isArr ? undefined : k}
                value={v}
                depth={0}
                isLast={i === entries.length - 1}
                expandAll={expandAll}
              />
            ))}
          </div>
          <div className="flex items-baseline" style={{ paddingLeft: 0 }}>
            <span className="w-3 shrink-0" />
            <span className="text-slate-400">{openR}</span>
            <span className="text-slate-600">{comma}</span>
          </div>
        </>
      )}
    </div>
  );
}

export default function JsonTree({ json }: { json: string }) {
  const [expandAll, setExpandAll] = useState(false);

  const parsed = useCallback(() => {
    try { return { value: JSON.parse(json) as JsonValue, error: null }; }
    catch (e) { return { value: null, error: (e as Error).message }; }
  }, [json])();

  if (parsed.error) {
    return (
      <div className="bg-red-900/20 border border-red-700 rounded-lg p-3 text-red-400 text-sm">
        {parsed.error}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex gap-2 mb-2">
        <button onClick={() => setExpandAll(false)} className={!expandAll ? 'btn-primary' : 'btn-secondary'} style={{ fontSize: 11, padding: '2px 8px' }}>
          Auto
        </button>
        <button onClick={() => setExpandAll(true)} className={expandAll ? 'btn-primary' : 'btn-secondary'} style={{ fontSize: 11, padding: '2px 8px' }}>
          Expand All
        </button>
      </div>
      <div className="flex-1 overflow-auto bg-[#0f1117] border border-[#2a2d3a] rounded-lg p-3 text-sm font-mono leading-relaxed">
        <JsonNode value={parsed.value} depth={0} isLast expandAll={expandAll} />
      </div>
    </div>
  );
}
