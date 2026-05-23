'use client';
import { useState, useMemo } from 'react';
import { b64decode } from '@/lib/transforms';

export default function JwtDecoder() {
  const [token, setToken] = useState('');

  type JwtPayload = Record<string, unknown> & { exp?: number; iat?: number; sub?: string };

  const decoded = useMemo(() => {
    const parts = token.trim().split('.');
    if (parts.length !== 3) return null;
    const header = b64decode(parts[0]) as Record<string, unknown>;
    const payload = b64decode(parts[1]) as JwtPayload;
    if (!header || !payload) return null;
    return { header, payload, signature: parts[2] };
  }, [token]);

  const isExpired = decoded?.payload?.exp
    ? decoded.payload.exp * 1000 < Date.now()
    : null;

  return (
    <div className="space-y-4">
      <div>
        <label className="text-xs text-slate-500 mb-1 block">JWT Token</label>
        <textarea value={token} onChange={(e) => setToken(e.target.value)} rows={5}
          className="tool-textarea" placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." />
      </div>

      {token && !decoded && (
        <div className="bg-red-900/20 border border-red-700 rounded-lg p-3 text-red-400 text-sm">
          Invalid JWT — must have 3 dot-separated base64url parts.
        </div>
      )}

      {decoded && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-slate-500 mb-1 block text-purple-400">Header</label>
            <pre className="bg-[#0f1117] border border-purple-900/40 rounded-lg p-3 text-sm text-purple-300 overflow-auto">
              {JSON.stringify(decoded.header, null, 2)}
            </pre>
          </div>
          <div>
            <label className="text-xs text-slate-500 mb-1 block text-blue-400">Payload</label>
            <pre className="bg-[#0f1117] border border-blue-900/40 rounded-lg p-3 text-sm text-blue-300 overflow-auto">
              {JSON.stringify(decoded.payload, null, 2)}
            </pre>
          </div>
        </div>
      )}

      {decoded && (
        <div className="bg-[#1a1d27] border border-[#2a2d3a] rounded-xl overflow-hidden">
          {decoded.payload.iat && (
            <div className="flex justify-between px-4 py-2.5 border-b border-[#2a2d3a]">
              <span className="text-xs text-slate-500">Issued At</span>
              <span className="text-sm font-mono text-slate-300">{new Date(decoded.payload.iat * 1000).toLocaleString()}</span>
            </div>
          )}
          {decoded.payload.exp && (
            <div className="flex justify-between px-4 py-2.5 border-b border-[#2a2d3a]">
              <span className="text-xs text-slate-500">Expires</span>
              <span className={`text-sm font-mono ${isExpired ? 'text-red-400' : 'text-green-400'}`}>
                {new Date(decoded.payload.exp * 1000).toLocaleString()} {isExpired ? '(expired)' : '(valid)'}
              </span>
            </div>
          )}
          {decoded.payload.sub && (
            <div className="flex justify-between px-4 py-2.5 border-b border-[#2a2d3a]">
              <span className="text-xs text-slate-500">Subject</span>
              <span className="text-sm font-mono text-slate-300">{decoded.payload.sub}</span>
            </div>
          )}
          <div className="flex justify-between px-4 py-2.5">
            <span className="text-xs text-slate-500">Signature</span>
            <span className="text-xs font-mono text-slate-500 truncate max-w-xs">{decoded.signature}</span>
          </div>
        </div>
      )}
    </div>
  );
}
