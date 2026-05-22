'use client';
import { useState, useMemo } from 'react';

const STATUSES: { code: number; text: string; desc: string; category: string }[] = [
  // 1xx
  { code: 100, text: 'Continue', desc: 'Server received request headers; client should proceed to send body.', category: '1xx' },
  { code: 101, text: 'Switching Protocols', desc: 'Server is switching protocols as requested by the client (e.g., WebSocket upgrade).', category: '1xx' },
  // 2xx
  { code: 200, text: 'OK', desc: 'Request succeeded. Response body contains result.', category: '2xx' },
  { code: 201, text: 'Created', desc: 'Request succeeded and a new resource was created.', category: '2xx' },
  { code: 202, text: 'Accepted', desc: 'Request accepted but processing not yet complete.', category: '2xx' },
  { code: 204, text: 'No Content', desc: 'Request succeeded but no content to return.', category: '2xx' },
  { code: 206, text: 'Partial Content', desc: 'Server is delivering only part of the resource (range request).', category: '2xx' },
  // 3xx
  { code: 301, text: 'Moved Permanently', desc: 'Resource moved permanently. Update your bookmarks.', category: '3xx' },
  { code: 302, text: 'Found', desc: 'Resource temporarily at a different URI.', category: '3xx' },
  { code: 303, text: 'See Other', desc: 'Redirect to another URI using GET.', category: '3xx' },
  { code: 304, text: 'Not Modified', desc: 'Resource not modified since last request; use cached version.', category: '3xx' },
  { code: 307, text: 'Temporary Redirect', desc: 'Temporary redirect; preserve request method.', category: '3xx' },
  { code: 308, text: 'Permanent Redirect', desc: 'Permanent redirect; preserve request method.', category: '3xx' },
  // 4xx
  { code: 400, text: 'Bad Request', desc: 'Server cannot process request due to client error (malformed syntax, etc).', category: '4xx' },
  { code: 401, text: 'Unauthorized', desc: 'Authentication required and has failed or not been provided.', category: '4xx' },
  { code: 403, text: 'Forbidden', desc: 'Server understands request but refuses to authorize it.', category: '4xx' },
  { code: 404, text: 'Not Found', desc: 'Requested resource could not be found.', category: '4xx' },
  { code: 405, text: 'Method Not Allowed', desc: 'HTTP method not supported for this endpoint.', category: '4xx' },
  { code: 408, text: 'Request Timeout', desc: 'Server timed out waiting for the request.', category: '4xx' },
  { code: 409, text: 'Conflict', desc: 'Request conflicts with current state of the server.', category: '4xx' },
  { code: 410, text: 'Gone', desc: 'Resource permanently removed from the server.', category: '4xx' },
  { code: 413, text: 'Content Too Large', desc: 'Request body exceeds server limits.', category: '4xx' },
  { code: 415, text: 'Unsupported Media Type', desc: 'Server does not support the media type in the request.', category: '4xx' },
  { code: 422, text: 'Unprocessable Content', desc: 'Well-formed request but semantic errors prevent processing.', category: '4xx' },
  { code: 429, text: 'Too Many Requests', desc: 'Rate limit exceeded. Slow down your requests.', category: '4xx' },
  // 5xx
  { code: 500, text: 'Internal Server Error', desc: 'Generic server-side error.', category: '5xx' },
  { code: 501, text: 'Not Implemented', desc: 'Server does not support the functionality required.', category: '5xx' },
  { code: 502, text: 'Bad Gateway', desc: 'Upstream server returned an invalid response.', category: '5xx' },
  { code: 503, text: 'Service Unavailable', desc: 'Server temporarily unavailable (overloaded or down for maintenance).', category: '5xx' },
  { code: 504, text: 'Gateway Timeout', desc: 'Upstream server failed to respond in time.', category: '5xx' },
];

const COLOR: Record<string, string> = {
  '1xx': 'text-blue-400 bg-blue-900/20 border-blue-800/30',
  '2xx': 'text-green-400 bg-green-900/20 border-green-800/30',
  '3xx': 'text-yellow-400 bg-yellow-900/20 border-yellow-800/30',
  '4xx': 'text-orange-400 bg-orange-900/20 border-orange-800/30',
  '5xx': 'text-red-400 bg-red-900/20 border-red-800/30',
};

export default function HttpStatus() {
  const [search, setSearch] = useState('');
  const [cat, setCat] = useState('All');

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return STATUSES.filter((s) =>
      (cat === 'All' || s.category === cat) &&
      (!q || String(s.code).includes(q) || s.text.toLowerCase().includes(q) || s.desc.toLowerCase().includes(q))
    );
  }, [search, cat]);

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        <input value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by code or keyword..."
          className="tool-textarea flex-1" style={{ resize: 'none', height: 40 }} />
      </div>
      <div className="flex gap-2 flex-wrap">
        {['All', '1xx', '2xx', '3xx', '4xx', '5xx'].map((c) => (
          <button key={c} onClick={() => setCat(c)}
            className={`px-3 py-1 rounded text-sm ${cat === c ? 'btn-primary' : 'btn-secondary'}`}>{c}</button>
        ))}
      </div>
      <div className="space-y-2">
        {filtered.map((s) => (
          <div key={s.code} className={`flex gap-4 items-start p-3 rounded-xl border ${COLOR[s.category]}`}>
            <span className="text-xl font-bold font-mono w-14 shrink-0">{s.code}</span>
            <div>
              <div className="font-semibold text-sm">{s.text}</div>
              <div className="text-xs opacity-80 mt-0.5">{s.desc}</div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <p className="text-slate-500 text-sm text-center py-8">No results for "{search}"</p>}
      </div>
    </div>
  );
}
