'use client';
import { useState } from 'react';

type FormatDef = {
  id: string;
  label: string;
  group: string;
  placeholder: string;
  editable: boolean;
  parse: ((s: string) => Date | null) | null;
  format: (d: Date) => string;
};

function tryParse(s: string): Date | null {
  if (!s.trim()) return null;
  const d = new Date(s.trim());
  return isNaN(d.getTime()) ? null : d;
}

function isoWeek(d: Date): number {
  const date = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  date.setUTCDate(date.getUTCDate() + 4 - (date.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  return Math.ceil(((date.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

function relative(d: Date): string {
  const diff = Date.now() - d.getTime();
  const abs = Math.abs(diff);
  const suf = diff < 0 ? 'from now' : 'ago';
  if (abs < 45_000) return 'just now';
  const mins = Math.round(abs / 60_000);
  if (abs < 3_600_000) return `${mins} minute${mins !== 1 ? 's' : ''} ${suf}`;
  const hrs = Math.round(abs / 3_600_000);
  if (abs < 86_400_000) return `${hrs} hour${hrs !== 1 ? 's' : ''} ${suf}`;
  const days = Math.round(abs / 86_400_000);
  if (abs < 2_592_000_000) return `${days} day${days !== 1 ? 's' : ''} ${suf}`;
  const months = Math.round(abs / 2_592_000_000);
  if (abs < 31_536_000_000) return `${months} month${months !== 1 ? 's' : ''} ${suf}`;
  const years = Math.round(abs / 31_536_000_000);
  return `${years} year${years !== 1 ? 's' : ''} ${suf}`;
}

const FORMATS: FormatDef[] = [
  // ── Epoch ─────────────────────────────────────────────────────────────
  {
    id: 'unix_s', label: 'Unix (seconds)', group: 'Epoch',
    placeholder: '1700000000', editable: true,
    parse: (s) => { const n = Number(s.trim()); return isNaN(n) || !s.trim() ? null : new Date(n * 1000); },
    format: (d) => String(Math.floor(d.getTime() / 1000)),
  },
  {
    id: 'unix_ms', label: 'Unix (milliseconds)', group: 'Epoch',
    placeholder: '1700000000000', editable: true,
    parse: (s) => { const n = Number(s.trim()); return isNaN(n) || !s.trim() ? null : new Date(n); },
    format: (d) => String(d.getTime()),
  },

  // ── ISO / Standard ────────────────────────────────────────────────────
  {
    id: 'iso8601', label: 'ISO 8601', group: 'ISO / Standard',
    placeholder: '2023-11-14T22:13:20.000Z', editable: true,
    parse: tryParse,
    format: (d) => d.toISOString(),
  },
  {
    id: 'utc_string', label: 'UTC String', group: 'ISO / Standard',
    placeholder: 'Tue, 14 Nov 2023 22:13:20 GMT', editable: true,
    parse: tryParse,
    format: (d) => d.toUTCString(),
  },
  {
    id: 'rfc2822', label: 'RFC 2822', group: 'ISO / Standard',
    placeholder: 'Tue, 14 Nov 2023 22:13:20 +0000', editable: true,
    parse: tryParse,
    format: (d) => d.toUTCString().replace('GMT', '+0000'),
  },

  // ── Date formats ──────────────────────────────────────────────────────
  {
    id: 'iso_date', label: 'Date only (YYYY-MM-DD)', group: 'Date Formats',
    placeholder: '2023-11-14', editable: true,
    parse: (s) => /^\d{4}-\d{2}-\d{2}$/.test(s.trim()) ? tryParse(s.trim() + 'T00:00:00Z') : null,
    format: (d) => d.toISOString().slice(0, 10),
  },
  {
    id: 'us_date', label: 'US (MM/DD/YYYY)', group: 'Date Formats',
    placeholder: '11/14/2023', editable: true,
    parse: (s) => {
      const m = s.trim().match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
      if (!m) return null;
      return tryParse(`${m[3]}-${m[1].padStart(2, '0')}-${m[2].padStart(2, '0')}T00:00:00Z`);
    },
    format: (d) => {
      const [y, mo, day] = d.toISOString().slice(0, 10).split('-');
      return `${parseInt(mo)}/${parseInt(day)}/${y}`;
    },
  },
  {
    id: 'eu_date', label: 'EU (DD/MM/YYYY)', group: 'Date Formats',
    placeholder: '14/11/2023', editable: true,
    parse: (s) => {
      const m = s.trim().match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
      if (!m) return null;
      return tryParse(`${m[3]}-${m[2].padStart(2, '0')}-${m[1].padStart(2, '0')}T00:00:00Z`);
    },
    format: (d) => {
      const [y, mo, day] = d.toISOString().slice(0, 10).split('-');
      return `${parseInt(day)}/${parseInt(mo)}/${y}`;
    },
  },
  {
    id: 'dotted', label: 'DD.MM.YYYY', group: 'Date Formats',
    placeholder: '14.11.2023', editable: true,
    parse: (s) => {
      const m = s.trim().match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/);
      if (!m) return null;
      return tryParse(`${m[3]}-${m[2].padStart(2, '0')}-${m[1].padStart(2, '0')}T00:00:00Z`);
    },
    format: (d) => {
      const [y, mo, day] = d.toISOString().slice(0, 10).split('-');
      return `${day}.${mo}.${y}`;
    },
  },
  {
    id: 'time_utc', label: 'Time (UTC HH:MM:SS)', group: 'Date Formats',
    placeholder: '22:13:20', editable: false,
    parse: null,
    format: (d) => d.toISOString().slice(11, 19),
  },

  // ── Database / Spreadsheet ────────────────────────────────────────────
  {
    id: 'sql', label: 'SQL DATETIME (UTC)', group: 'Database',
    placeholder: '2023-11-14 22:13:20', editable: true,
    parse: (s) => tryParse(s.trim().replace(' ', 'T') + 'Z'),
    format: (d) => d.toISOString().replace('T', ' ').slice(0, 19),
  },
  {
    id: 'excel', label: 'Excel Serial Number', group: 'Database',
    placeholder: '45244', editable: true,
    parse: (s) => { const n = Number(s.trim()); return isNaN(n) ? null : new Date((n - 25569) * 86400000); },
    format: (d) => String(Math.round(d.getTime() / 86400000 + 25569)),
  },
  {
    id: 'julian', label: 'Julian Day Number', group: 'Database',
    placeholder: '2460262.42569', editable: true,
    parse: (s) => { const n = parseFloat(s); return isNaN(n) ? null : new Date((n - 2440587.5) * 86400000); },
    format: (d) => (d.getTime() / 86400000 + 2440587.5).toFixed(5),
  },

  // ── Human readable ────────────────────────────────────────────────────
  {
    id: 'local', label: 'Local (browser)', group: 'Human',
    placeholder: '', editable: false,
    parse: null,
    format: (d) => d.toLocaleString(),
  },
  {
    id: 'long', label: 'Long format', group: 'Human',
    placeholder: '', editable: false,
    parse: null,
    format: (d) => d.toLocaleString('en-US', {
      weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
      hour: 'numeric', minute: '2-digit', second: '2-digit', timeZoneName: 'short',
    }),
  },
  {
    id: 'relative', label: 'Relative', group: 'Human',
    placeholder: '', editable: false,
    parse: null,
    format: relative,
  },

  // ── Derived info ──────────────────────────────────────────────────────
  {
    id: 'day_of_week', label: 'Day of week', group: 'Derived',
    placeholder: '', editable: false,
    parse: null,
    format: (d) => d.toLocaleDateString('en-US', { weekday: 'long' }),
  },
  {
    id: 'week_num', label: 'ISO week number', group: 'Derived',
    placeholder: '', editable: false,
    parse: null,
    format: (d) => `Week ${isoWeek(d)} of ${d.getUTCFullYear()}`,
  },
  {
    id: 'quarter', label: 'Quarter', group: 'Derived',
    placeholder: '', editable: false,
    parse: null,
    format: (d) => `Q${Math.floor(d.getUTCMonth() / 3) + 1} ${d.getUTCFullYear()}`,
  },
  {
    id: 'tz', label: 'Local timezone', group: 'Derived',
    placeholder: '', editable: false,
    parse: null,
    format: (d) => {
      const off = -d.getTimezoneOffset();
      const sign = off >= 0 ? '+' : '-';
      const h = String(Math.floor(Math.abs(off) / 60)).padStart(2, '0');
      const m = String(Math.abs(off) % 60).padStart(2, '0');
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      return `UTC ${sign}${h}:${m} (${tz})`;
    },
  },
  {
    id: 'leap', label: 'Leap year', group: 'Derived',
    placeholder: '', editable: false,
    parse: null,
    format: (d) => {
      const y = d.getUTCFullYear();
      const isLeap = (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
      return isLeap ? `Yes — ${y} is a leap year` : `No — ${y} is not a leap year`;
    },
  },
];

const GROUPS = [...new Set(FORMATS.map((f) => f.group))];

function allEmpty(): Record<string, string> {
  return Object.fromEntries(FORMATS.map((f) => [f.id, '']));
}

function valuesFromDate(d: Date, keepId?: string, keepVal?: string): Record<string, string> {
  return Object.fromEntries(
    FORMATS.map((f) => [f.id, f.id === keepId ? (keepVal ?? '') : f.format(d)])
  );
}

export default function TimestampConverter() {
  const [date, setDate] = useState<Date | null>(null);
  const [values, setValues] = useState<Record<string, string>>(allEmpty);

  function handleChange(id: string, raw: string) {
    const fmt = FORMATS.find((f) => f.id === id);
    if (!fmt?.parse) return;

    // Always update the active field's raw value immediately
    setValues((prev) => ({ ...prev, [id]: raw }));

    const parsed = fmt.parse(raw);
    if (parsed) {
      setDate(parsed);
      setValues(valuesFromDate(parsed, id, raw));
    }
  }

  function now() {
    const d = new Date();
    setDate(d);
    setValues(valuesFromDate(d));
  }

  function clear() {
    setDate(null);
    setValues(allEmpty());
  }

  return (
    <div className="space-y-5">
      <div className="flex gap-2 items-center">
        <button onClick={now} className="btn-primary">Now</button>
        {date && <button onClick={clear} className="btn-secondary">Clear</button>}
        <span className="text-xs text-slate-500 ml-2">Edit any field — all others update instantly.</span>
      </div>

      {GROUPS.map((group) => {
        const groupFmts = FORMATS.filter((f) => f.group === group);
        return (
          <div key={group}>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">{group}</p>
            <div className="bg-[#1a1d27] border border-[#2a2d3a] rounded-xl overflow-hidden divide-y divide-[#2a2d3a]">
              {groupFmts.map((fmt) => (
                <div key={fmt.id} className="flex items-center px-4 py-2.5 gap-3 group hover:bg-[#2a2d3a]/30 transition">
                  <span className="text-xs text-slate-500 shrink-0 w-44">{fmt.label}</span>
                  <input
                    value={values[fmt.id]}
                    onChange={fmt.editable ? (e) => handleChange(fmt.id, e.target.value) : undefined}
                    readOnly={!fmt.editable}
                    placeholder={fmt.placeholder || (date ? '' : '—')}
                    className={`flex-1 bg-transparent outline-none text-sm font-mono min-w-0 placeholder-slate-700 ${
                      fmt.editable
                        ? 'text-slate-200 focus:text-white'
                        : 'text-slate-400 cursor-default select-all'
                    }`}
                  />
                  {values[fmt.id] && (
                    <button
                      onClick={() => navigator.clipboard.writeText(values[fmt.id])}
                      className="opacity-0 group-hover:opacity-100 text-[11px] text-indigo-400 hover:text-indigo-300 transition shrink-0"
                    >
                      Copy
                    </button>
                  )}
                  {fmt.editable && (
                    <span className="opacity-0 group-hover:opacity-30 text-[10px] text-slate-400 shrink-0 select-none">editable</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
