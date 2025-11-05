import { clsx } from 'clsx';

export default function TablatureDisplay({ timeline, currentTime, onSeek }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Timeline</h2>
        <p className="text-xs text-slate-400">Click any chord to jump.</p>
      </div>
      <div className="mt-4 space-y-2">
        {timeline.map((event) => {
          const isActive = currentTime >= event.startSec && currentTime < event.endSec;
          return (
            <button
              key={event.id}
              type="button"
              onClick={() => onSeek(event.startSec)}
              className={clsx(
                'flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left text-sm transition',
                isActive
                  ? 'border-emerald-400 bg-emerald-500/20 text-emerald-100'
                  : 'border-slate-800 bg-slate-900/60 text-slate-300 hover:border-emerald-300'
              )}
            >
              <span className="font-semibold">{event.chord_symbol?.name}</span>
              <span className="text-xs text-slate-400">{event.startSec.toFixed(1)}s – {event.endSec.toFixed(1)}s</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
