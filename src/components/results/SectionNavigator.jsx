export default function SectionNavigator({ sections, currentTime, onJump }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-6">
      <h2 className="text-xl font-semibold">Sections</h2>
      <div className="mt-4 space-y-2">
        {sections.map((section) => {
          const isActive = currentTime >= section.start_sec && currentTime < section.end_sec;
          return (
            <button
              key={section.id}
              type="button"
              onClick={() => onJump(section)}
              className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left text-sm transition ${
                isActive
                  ? 'border-emerald-400 bg-emerald-500/20 text-emerald-100'
                  : 'border-slate-800 bg-slate-900/60 text-slate-300 hover:border-emerald-300'
              }`}
            >
              <div>
                <p className="font-semibold capitalize">{section.label}</p>
                <p className="text-xs text-slate-500">
                  {section.start_sec.toFixed(1)}s – {section.end_sec.toFixed(1)}s
                </p>
              </div>
              <span className="text-xs uppercase tracking-wide text-slate-500">Jump</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
