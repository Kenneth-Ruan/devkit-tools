'use client';
import { useState, useRef } from 'react';

export default function ImageToBase64() {
  const [dataUri, setDataUri] = useState('');
  const [info, setInfo] = useState<{ name: string; size: string; type: string } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFile(file: File) {
    setInfo({ name: file.name, size: (file.size / 1024).toFixed(1) + ' KB', type: file.type });
    const reader = new FileReader();
    reader.onload = (e) => setDataUri(e.target?.result as string);
    reader.readAsDataURL(file);
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file?.type.startsWith('image/')) handleFile(file);
  }

  function onInput(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }

  return (
    <div className="space-y-4">
      <div
        onDrop={onDrop} onDragOver={(e) => e.preventDefault()}
        onClick={() => inputRef.current?.click()}
        className="border-2 border-dashed border-[#2a2d3a] rounded-xl p-10 text-center cursor-pointer hover:border-indigo-500 transition">
        <input ref={inputRef} type="file" accept="image/*" onChange={onInput} className="hidden" />
        <p className="text-slate-400 text-sm">Drop an image here or <span className="text-indigo-400">click to browse</span></p>
        <p className="text-slate-600 text-xs mt-1">PNG, JPG, GIF, SVG, WebP supported</p>
      </div>

      {info && (
        <div className="flex gap-4 text-xs text-slate-500">
          <span>{info.name}</span>
          <span>{info.type}</span>
          <span>{info.size}</span>
        </div>
      )}

      {dataUri && (
        <>
          <div className="flex gap-2 flex-wrap">
            <button onClick={() => navigator.clipboard.writeText(dataUri)} className="btn-primary">
              Copy Data URI
            </button>
            <button onClick={() => navigator.clipboard.writeText(dataUri.split(',')[1])} className="btn-secondary">
              Copy Base64 only
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Preview</label>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={dataUri} alt="preview" className="rounded-lg border border-[#2a2d3a] max-h-64 object-contain bg-[#1a1d27] w-full" />
            </div>
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Data URI</label>
              <textarea readOnly value={dataUri} rows={8} className="tool-textarea opacity-80 text-xs break-all" />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
