// Non-invasive sponsor placeholder banner.
//
// TO GO LIVE: Once you create an ad slot on TinySponsor, replace this
// component's contents with the embed script from your slot dashboard:
//
//   <div className="flex justify-center py-5 px-4">
//     <script src="https://tinysponsor.com/api/slot/<YOUR_SLOT_ID>.js" async />
//   </div>
//
// The script auto-switches between showing the active sponsor ad
// and the "Advertise here" CTA — no other changes needed.

export default function SponsorBanner() {
  return (
    <div className="w-full py-5 px-4 flex justify-center">
      <a
        href="https://tinysponsor.com"
        target="_blank"
        rel="noopener noreferrer sponsored"
        aria-label="Sponsor Dev Tooling Online"
        className="group flex items-center gap-3 border border-dashed border-[#2a2d3a] hover:border-indigo-500/50 rounded-xl px-8 py-3 transition-colors"
      >
        <span className="text-[10px] text-slate-600 uppercase tracking-widest font-semibold">
          Sponsor
        </span>
        <span className="w-px h-3 bg-[#2a2d3a]" />
        <span className="text-xs text-slate-500 group-hover:text-slate-300 transition-colors">
          Your product here · Reach developers · Advertise on this site
        </span>
        <span className="text-xs text-slate-600 group-hover:text-indigo-400 transition-colors">
          →
        </span>
      </a>
    </div>
  );
}
