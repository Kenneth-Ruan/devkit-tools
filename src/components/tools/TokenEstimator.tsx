'use client';
import { useState, useMemo } from 'react';

function estimateTokens(text: string) {
  if (!text) return 0;
  // ~4 chars per token (OpenAI/Anthropic rough average)
  return Math.ceil(text.length / 4);
}

const PRICING: { model: string; input: number; output: number }[] = [
  { model: 'GPT-4o',             input: 0.0025, output: 0.01 },
  { model: 'GPT-4o mini',        input: 0.00015, output: 0.0006 },
  { model: 'Claude Opus 4',      input: 0.015, output: 0.075 },
  { model: 'Claude Sonnet 4',    input: 0.003, output: 0.015 },
  { model: 'Claude Haiku 4',     input: 0.00025, output: 0.00125 },
  { model: 'Gemini 1.5 Pro',     input: 0.00125, output: 0.005 },
  { model: 'Gemini 1.5 Flash',   input: 0.000075, output: 0.0003 },
];

export default function TokenEstimator() {
  const [text, setText] = useState('');

  const tokens = useMemo(() => estimateTokens(text), [text]);
  const words = useMemo(() => text.trim() ? text.trim().split(/\s+/).length : 0, [text]);
  const chars = text.length;

  return (
    <div className="space-y-4">
      <div>
        <label className="text-xs text-slate-500 mb-1 block">Text</label>
        <textarea value={text} onChange={(e) => setText(e.target.value)} rows={10}
          className="tool-textarea" placeholder="Paste your text here to estimate token count..." />
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Characters', value: chars.toLocaleString() },
          { label: 'Words', value: words.toLocaleString() },
          { label: 'Est. Tokens', value: tokens.toLocaleString() },
        ].map(({ label, value }) => (
          <div key={label} className="bg-[#1a1d27] border border-[#2a2d3a] rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-indigo-400">{value}</div>
            <div className="text-xs text-slate-500 mt-1">{label}</div>
          </div>
        ))}
      </div>

      <p className="text-xs text-slate-600">Token count is estimated using ~4 chars/token. Actual counts vary by model and tokenizer.</p>

      {tokens > 0 && (
        <div className="bg-[#1a1d27] border border-[#2a2d3a] rounded-xl overflow-hidden">
          <div className="px-4 py-2 border-b border-[#2a2d3a] text-xs text-slate-500">Estimated cost (input + output)</div>
          {PRICING.map(({ model, input, output }) => (
            <div key={model} className="flex justify-between items-center px-4 py-2.5 border-b border-[#2a2d3a] last:border-0 hover:bg-[#2a2d3a]/40">
              <span className="text-sm text-slate-300">{model}</span>
              <div className="text-right">
                <span className="text-xs font-mono text-slate-400">
                  in: ${(tokens / 1000 * input).toFixed(4)} / out: ${(tokens / 1000 * output).toFixed(4)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
