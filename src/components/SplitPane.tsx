'use client';
import { useState, useRef, useEffect } from 'react';

interface Props {
  left: React.ReactNode;
  right: React.ReactNode;
  defaultSplit?: number;
  className?: string;
}

export default function SplitPane({ left, right, defaultSplit = 50, className = '' }: Props) {
  const [split, setSplit] = useState(defaultSplit);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  useEffect(() => {
    function onMove(e: MouseEvent) {
      if (!dragging.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      setSplit(Math.max(20, Math.min(80, ((e.clientX - rect.left) / rect.width) * 100)));
    }
    function onUp() { dragging.current = false; }
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
    return () => { document.removeEventListener('mousemove', onMove); document.removeEventListener('mouseup', onUp); };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`flex flex-col md:flex-row ${className}`}
      style={{ '--split': `${split}%` } as React.CSSProperties}
    >
      <div className="split-pane-left min-w-0">{left}</div>
      <div
        className="hidden md:flex w-3 shrink-0 cursor-col-resize items-center justify-center group"
        onMouseDown={(e) => { dragging.current = true; e.preventDefault(); }}
      >
        <div className="w-px self-stretch bg-[#2a2d3a] group-hover:bg-indigo-500 transition" />
      </div>
      <div className="flex-1 min-w-0 mt-4 md:mt-0">{right}</div>
    </div>
  );
}
