'use client';
import { useState } from 'react';

async function sha(algo: string, text: string): Promise<string> {
  const enc = new TextEncoder().encode(text);
  const buf = await crypto.subtle.digest(algo, enc);
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join('');
}

// MD5 — pure JS (no subtle crypto support)
function md5(str: string): string {
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

export default function HashGenerator() {
  const [input, setInput] = useState('');
  const [results, setResults] = useState<Record<string, string>>({});

  async function generate() {
    if (!input) return;
    const [sha1, sha256, sha512] = await Promise.all([
      sha('SHA-1', input), sha('SHA-256', input), sha('SHA-512', input),
    ]);
    setResults({ MD5: md5(input), 'SHA-1': sha1, 'SHA-256': sha256, 'SHA-512': sha512 });
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="text-xs text-slate-500 mb-1 block">Input Text</label>
        <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={4}
          className="tool-textarea" placeholder="Enter text to hash..." />
      </div>
      <div className="flex gap-2">
        <button onClick={generate} className="btn-primary">Generate Hashes</button>
      </div>
      {Object.keys(results).length > 0 && (
        <div className="bg-[#1a1d27] border border-[#2a2d3a] rounded-xl overflow-hidden">
          {Object.entries(results).map(([k, v]) => (
            <div key={k} className="px-4 py-3 border-b border-[#2a2d3a] last:border-0 hover:bg-[#2a2d3a]/40 group">
              <div className="flex justify-between mb-1">
                <span className="text-xs text-slate-500">{k}</span>
                <button onClick={() => navigator.clipboard.writeText(v)}
                  className="opacity-0 group-hover:opacity-100 text-xs text-indigo-400 hover:text-indigo-300 transition">
                  Copy
                </button>
              </div>
              <span className="text-xs font-mono text-slate-300 break-all">{v}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
