// ─── Case Converter ───────────────────────────────────────────────────────────

export function toCamel(s: string): string {
  return s.toLowerCase().replace(/[_\-\s]+(.)/g, (_, c) => c.toUpperCase());
}
export function toPascal(s: string): string {
  const c = toCamel(s);
  return c.charAt(0).toUpperCase() + c.slice(1);
}
export function toSnake(s: string): string {
  return s.replace(/([A-Z])/g, '_$1').replace(/[-\s]+/g, '_').toLowerCase().replace(/^_/, '');
}
export function toKebab(s: string): string {
  return toSnake(s).replace(/_/g, '-');
}
export function toScream(s: string): string {
  return toSnake(s).toUpperCase();
}
export function toTitle(s: string): string {
  return s.toLowerCase().replace(/(^|\s)\S/g, (l) => l.toUpperCase());
}
export function toSentence(s: string): string {
  const t = s.toLowerCase();
  return t.charAt(0).toUpperCase() + t.slice(1);
}
export function toDot(s: string): string {
  return toSnake(s).replace(/_/g, '.');
}
export function toFlat(s: string): string {
  return toSnake(s).replace(/_/g, '');
}

// ─── Color Converter ──────────────────────────────────────────────────────────

export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return { r, g, b };
}

export function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

export function rgbToHsv(r: number, g: number, b: number): { h: number; s: number; v: number } {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const v = max;
  const d = max - min;
  const s = max === 0 ? 0 : d / max;
  let h = 0;
  if (max !== min) {
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), v: Math.round(v * 100) };
}

export function parseColorInput(raw: string): string | null {
  const s = raw.trim();
  if (/^#?[0-9a-fA-F]{6}$/.test(s)) return s.startsWith('#') ? s : '#' + s;
  if (/^#?[0-9a-fA-F]{3}$/.test(s)) {
    const hex = s.startsWith('#') ? s.slice(1) : s;
    return '#' + hex.split('').map((c) => c + c).join('');
  }
  const rgb = s.match(/^rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i);
  if (rgb) {
    return '#' + [rgb[1], rgb[2], rgb[3]].map((n) => parseInt(n).toString(16).padStart(2, '0')).join('');
  }
  return null;
}

// ─── Cron Parser ──────────────────────────────────────────────────────────────

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

export function explainField(val: string, type: 'minute'|'hour'|'dom'|'month'|'dow'): string {
  if (val === '*') return 'every ' + type;
  if (val.startsWith('*/')) return `every ${val.slice(2)} ${type}s`;
  const range = val.match(/^(\d+)-(\d+)$/);
  if (range) {
    if (type === 'month') return `${MONTHS[+range[1]-1]}–${MONTHS[+range[2]-1]}`;
    if (type === 'dow') return `${DAYS[+range[1]]}–${DAYS[+range[2]]}`;
    return `${type} ${range[1]} to ${range[2]}`;
  }
  const list = val.split(',');
  if (list.length > 1) {
    if (type === 'month') return list.map((m) => MONTHS[+m-1]).join(', ');
    if (type === 'dow') return list.map((d) => DAYS[+d]).join(', ');
    return `${type}s ${list.join(', ')}`;
  }
  if (type === 'month') return MONTHS[+val - 1] ?? val;
  if (type === 'dow') return DAYS[+val] ?? val;
  return val;
}

export function parseCron(expr: string): { description: string } | { error: string } {
  const parts = expr.trim().split(/\s+/);
  if (parts.length !== 5) return { error: 'Expected 5 fields: minute hour day-of-month month day-of-week' };
  const [min, hr, dom, mon, dow] = parts;
  try {
    const desc = [
      `At ${explainField(min, 'minute')} of ${explainField(hr, 'hour')}`,
      dom !== '*' ? `, on day ${explainField(dom, 'dom')} of the month` : '',
      mon !== '*' ? `, in ${explainField(mon, 'month')}` : '',
      dow !== '*' ? `, on ${explainField(dow, 'dow')}` : '',
    ].join('').trim().replace(/^At every minute of every hour$/, 'Every minute') + '.';
    return { description: desc };
  } catch {
    return { error: 'Could not parse expression.' };
  }
}

// ─── cURL → Fetch ─────────────────────────────────────────────────────────────

export function parseCurl(curl: string): string {
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

// ─── .env Parser ──────────────────────────────────────────────────────────────

export interface EnvVar { key: string; value: string; comment?: string }

export function parseEnv(raw: string): EnvVar[] {
  return raw.split('\n').flatMap((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return [];
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx < 0) return [];
    const key = trimmed.slice(0, eqIdx).trim();
    let value = trimmed.slice(eqIdx + 1).trim();
    const commentIdx = value.search(/\s+#/);
    let comment: string | undefined;
    if (!value.startsWith('"') && !value.startsWith("'") && commentIdx > 0) {
      comment = value.slice(commentIdx + 1).replace(/^#\s*/, '');
      value = value.slice(0, commentIdx).trim();
    }
    value = value.replace(/^(['"])(.*)\1$/, '$2');
    return [{ key, value, comment }];
  });
}

// ─── HTML Entities ────────────────────────────────────────────────────────────

export function encodeEntities(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/`/g, '&#96;');
}

export function decodeEntities(text: string): string {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#96;/g, '`');
}

// ─── HTML Formatter ───────────────────────────────────────────────────────────

export function minifyHtml(html: string): string {
  return html.replace(/\s+/g, ' ').replace(/>\s+</g, '><').trim();
}

// ─── JWT Decoder ──────────────────────────────────────────────────────────────

export function b64decode(str: string): unknown {
  const padded = str.replace(/-/g, '+').replace(/_/g, '/');
  const pad = padded.length % 4;
  const s = pad ? padded + '='.repeat(4 - pad) : padded;
  try { return JSON.parse(atob(s)); } catch { return null; }
}

// ─── JSON ↔ CSV ───────────────────────────────────────────────────────────────

export function jsonToCsv(json: string): string {
  const data = JSON.parse(json);
  const arr = Array.isArray(data) ? data : [data];
  if (arr.length === 0) return '';
  const keys = Object.keys(arr[0]);
  const esc = (v: unknown) => {
    const s = String(v ?? '');
    return s.includes(',') || s.includes('"') || s.includes('\n') ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return [keys.join(','), ...arr.map((row) => keys.map((k) => esc(row[k])).join(','))].join('\n');
}

export function csvToJson(csv: string): string {
  const lines = csv.trim().split('\n');
  const headers = lines[0].split(',').map((h) => h.trim());
  const rows = lines.slice(1).map((line) => {
    const vals = line.split(',');
    return Object.fromEntries(headers.map((h, i) => [h, vals[i]?.trim() ?? '']));
  });
  return JSON.stringify(rows, null, 2);
}

// ─── JSON Schema ──────────────────────────────────────────────────────────────

export function inferType(val: unknown): object {
  if (val === null) return { type: 'null' };
  if (typeof val === 'boolean') return { type: 'boolean' };
  if (typeof val === 'number') return Number.isInteger(val) ? { type: 'integer' } : { type: 'number' };
  if (typeof val === 'string') return { type: 'string' };
  if (Array.isArray(val)) {
    if (val.length === 0) return { type: 'array', items: {} };
    return { type: 'array', items: inferType(val[0]) };
  }
  if (typeof val === 'object') {
    const props: Record<string, object> = {};
    for (const [k, v] of Object.entries(val as Record<string, unknown>)) {
      props[k] = inferType(v);
    }
    return { type: 'object', properties: props, required: Object.keys(val as object) };
  }
  return {};
}

// ─── Number Base ──────────────────────────────────────────────────────────────

export function convertNumberBase(input: string, fromBase: number): {
  decimal: string; hex: string; hexPrefixed: string;
  binary: string; binaryPrefixed: string; octal: string; octalPrefixed: string;
} | null {
  const raw = input.trim().replace(/^0[xXbBoO]/, '');
  if (!raw) return null;
  try {
    const n = parseInt(raw, fromBase);
    if (isNaN(n)) return null;
    return {
      decimal: n.toString(10),
      hex: n.toString(16).toUpperCase(),
      hexPrefixed: '0x' + n.toString(16).toUpperCase(),
      binary: n.toString(2),
      binaryPrefixed: '0b' + n.toString(2),
      octal: n.toString(8),
      octalPrefixed: '0o' + n.toString(8),
    };
  } catch { return null; }
}

// ─── SQL Formatter ────────────────────────────────────────────────────────────

const SQL_KEYWORDS = ['SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'NOT', 'IN', 'BETWEEN', 'LIKE', 'IS', 'NULL',
  'ORDER BY', 'GROUP BY', 'HAVING', 'LIMIT', 'OFFSET', 'JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN',
  'OUTER JOIN', 'FULL JOIN', 'CROSS JOIN', 'ON', 'AS', 'INSERT INTO', 'VALUES', 'UPDATE', 'SET',
  'DELETE FROM', 'CREATE TABLE', 'ALTER TABLE', 'DROP TABLE', 'INDEX', 'UNIQUE', 'PRIMARY KEY',
  'FOREIGN KEY', 'REFERENCES', 'CONSTRAINT', 'WITH', 'UNION', 'ALL', 'DISTINCT', 'CASE', 'WHEN',
  'THEN', 'ELSE', 'END', 'EXISTS', 'ASC', 'DESC', 'RETURNING'];

export function formatSql(sql: string, indent: number): string {
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
    const kw = SQL_KEYWORDS.find((k) => upper.startsWith(k));
    if (!kw || i === 0) return line;
    const isTopLevel = ['SELECT', 'FROM', 'WHERE', 'ORDER BY', 'GROUP BY', 'HAVING', 'LIMIT', 'OFFSET', 'JOIN',
      'LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN', 'OUTER JOIN', 'FULL JOIN', 'CROSS JOIN', 'UNION', 'RETURNING'].includes(kw);
    return isTopLevel ? line : INDENT + line;
  }).join('\n');
}

// ─── Text Diff ────────────────────────────────────────────────────────────────

export type DiffLine = { type: 'same' | 'add' | 'remove'; text: string; lineA?: number; lineB?: number };

export function diff(a: string, b: string): DiffLine[] {
  const aLines = a.split('\n');
  const bLines = b.split('\n');
  const m = aLines.length, n = bLines.length;

  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = m - 1; i >= 0; i--) {
    for (let j = n - 1; j >= 0; j--) {
      dp[i][j] = aLines[i] === bLines[j]
        ? dp[i + 1][j + 1] + 1
        : Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
  }

  const result: DiffLine[] = [];
  let i = 0, j = 0, la = 1, lb = 1;
  while (i < m || j < n) {
    if (i < m && j < n && aLines[i] === bLines[j]) {
      result.push({ type: 'same', text: aLines[i], lineA: la++, lineB: lb++ });
      i++; j++;
    } else if (j < n && (i >= m || dp[i][j + 1] >= dp[i + 1][j])) {
      result.push({ type: 'add', text: bLines[j], lineB: lb++ });
      j++;
    } else {
      result.push({ type: 'remove', text: aLines[i], lineA: la++ });
      i++;
    }
  }
  return result;
}

// ─── Token Estimator ──────────────────────────────────────────────────────────

export function estimateTokens(text: string): number {
  if (!text) return 0;
  return Math.ceil(text.length / 4);
}

// ─── Word Counter ─────────────────────────────────────────────────────────────

export function countStats(text: string) {
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const chars = text.length;
  const charsNoSpace = text.replace(/\s/g, '').length;
  const lines = text ? text.split('\n').length : 0;
  const sentences = text.trim() ? (text.match(/[.!?]+/g) ?? []).length : 0;
  const paragraphs = text.trim() ? text.split(/\n\s*\n/).filter(Boolean).length : 0;
  const readingMinutes = Math.max(1, Math.ceil(words / 200));
  return { words, chars, charsNoSpace, lines, sentences, paragraphs, readingMinutes };
}

// ─── MD5 Hash ─────────────────────────────────────────────────────────────────

export function md5(str: string): string {
  function cmn(q: number, a: number, b: number, x: number, s: number, t: number) {
    a = ((a + q + x + t) | 0) & 0xffffffff;
    return (((a << s) | (a >>> (32 - s))) + b) | 0;
  }
  function ff(a: number, b: number, c: number, d: number, x: number, s: number, t: number) { return cmn((b & c) | (~b & d), a, b, x, s, t); }
  function gg(a: number, b: number, c: number, d: number, x: number, s: number, t: number) { return cmn((b & d) | (c & ~d), a, b, x, s, t); }
  function hh(a: number, b: number, c: number, d: number, x: number, s: number, t: number) { return cmn(b ^ c ^ d, a, b, x, s, t); }
  function ii(a: number, b: number, c: number, d: number, x: number, s: number, t: number) { return cmn(c ^ (b | ~d), a, b, x, s, t); }

  const bytes = new TextEncoder().encode(str);
  const orig = bytes.length * 8;
  const padded = new Uint8Array(Math.ceil((bytes.length + 9) / 64) * 64);
  padded.set(bytes);
  padded[bytes.length] = 0x80;
  new DataView(padded.buffer).setUint32(padded.length - 8, orig >>> 0, true);
  new DataView(padded.buffer).setUint32(padded.length - 4, 0, true);

  let a = 0x67452301, b = 0xefcdab89, c = 0x98badcfe, d = 0x10325476;
  const view = new DataView(padded.buffer);
  for (let i = 0; i < padded.length; i += 64) {
    const X = Array.from({ length: 16 }, (_, j) => view.getUint32(i + j * 4, true));
    const [aa, bb, cc, dd] = [a, b, c, d];
    a = ff(a,b,c,d, X[0],  7, -680876936);  d = ff(d,a,b,c, X[1], 12, -389564586);
    c = ff(c,d,a,b, X[2], 17,  606105819);  b = ff(b,c,d,a, X[3], 22, -1044525330);
    a = ff(a,b,c,d, X[4],  7, -176418897);  d = ff(d,a,b,c, X[5], 12,  1200080426);
    c = ff(c,d,a,b, X[6], 17, -1473231341); b = ff(b,c,d,a, X[7], 22, -45705983);
    a = ff(a,b,c,d, X[8],  7,  1770035416); d = ff(d,a,b,c, X[9], 12, -1958414417);
    c = ff(c,d,a,b, X[10],17, -42063);      b = ff(b,c,d,a, X[11],22, -1990404162);
    a = ff(a,b,c,d, X[12], 7,  1804603682); d = ff(d,a,b,c, X[13],12, -40341101);
    c = ff(c,d,a,b, X[14],17, -1502002290); b = ff(b,c,d,a, X[15],22,  1236535329);
    a = gg(a,b,c,d, X[1],  5, -165796510);  d = gg(d,a,b,c, X[6],  9, -1069501632);
    c = gg(c,d,a,b, X[11],14,  643717713);  b = gg(b,c,d,a, X[0], 20, -373897302);
    a = gg(a,b,c,d, X[5],  5, -701558691);  d = gg(d,a,b,c, X[10], 9,  38016083);
    c = gg(c,d,a,b, X[15],14, -660478335);  b = gg(b,c,d,a, X[4], 20, -405537848);
    a = gg(a,b,c,d, X[9],  5,  568446438);  d = gg(d,a,b,c, X[14], 9, -1019803690);
    c = gg(c,d,a,b, X[3], 14, -187363961);  b = gg(b,c,d,a, X[8], 20,  1163531501);
    a = gg(a,b,c,d, X[13], 5, -1444681467); d = gg(d,a,b,c, X[2],  9, -51403784);
    c = gg(c,d,a,b, X[7], 14,  1735328473); b = gg(b,c,d,a, X[12],20, -1926607734);
    a = hh(a,b,c,d, X[5],  4, -378558);     d = hh(d,a,b,c, X[8], 11, -2022574463);
    c = hh(c,d,a,b, X[11],16,  1839030562); b = hh(b,c,d,a, X[14],23, -35309556);
    a = hh(a,b,c,d, X[1],  4, -1530992060); d = hh(d,a,b,c, X[4], 11,  1272893353);
    c = hh(c,d,a,b, X[7], 16, -155497632);  b = hh(b,c,d,a, X[10],23, -1094730640);
    a = hh(a,b,c,d, X[13], 4,  681279174);  d = hh(d,a,b,c, X[0], 11, -358537222);
    c = hh(c,d,a,b, X[3], 16, -722521979);  b = hh(b,c,d,a, X[6], 23,  76029189);
    a = hh(a,b,c,d, X[9],  4, -640364487);  d = hh(d,a,b,c, X[12],11, -421815835);
    c = hh(c,d,a,b, X[15],16,  530742520);  b = hh(b,c,d,a, X[2], 23, -995338651);
    a = ii(a,b,c,d, X[0],  6, -198630844);  d = ii(d,a,b,c, X[7], 10,  1126891415);
    c = ii(c,d,a,b, X[14],15, -1416354905); b = ii(b,c,d,a, X[5], 21, -57434055);
    a = ii(a,b,c,d, X[12], 6,  1700485571); d = ii(d,a,b,c, X[3], 10, -1894986606);
    c = ii(c,d,a,b, X[10],15, -1051523);    b = ii(b,c,d,a, X[1], 21, -2054922799);
    a = ii(a,b,c,d, X[8],  6,  1873313359); d = ii(d,a,b,c, X[15],10, -30611744);
    c = ii(c,d,a,b, X[6], 15, -1560198380); b = ii(b,c,d,a, X[13],21,  1309151649);
    a = ii(a,b,c,d, X[4],  6, -145523070);  d = ii(d,a,b,c, X[11],10, -1120210379);
    c = ii(c,d,a,b, X[2], 15,  718787259);  b = ii(b,c,d,a, X[9], 21, -343485551);
    a = (a + aa) | 0; b = (b + bb) | 0; c = (c + cc) | 0; d = (d + dd) | 0;
  }
  return [a, b, c, d].map((v) => {
    const u = new Uint8Array(4);
    new DataView(u.buffer).setUint32(0, v >>> 0, true);
    return Array.from(u).map((x) => x.toString(16).padStart(2, '0')).join('');
  }).join('');
}

// ─── UUID Generator ───────────────────────────────────────────────────────────

export function generateV4(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (crypto.getRandomValues(new Uint8Array(1))[0] & 0x0f) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
