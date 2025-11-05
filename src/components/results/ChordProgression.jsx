export default function ChordProgression({ timeline, currentTime }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-6">
      <h2 className="text-xl font-semibold">Chord Progression</h2>
      <div className="mt-4 grid grid-cols-4 gap-3 text-center text-sm text-slate-300">
        {timeline.map((event) => {
          const isActive = currentTime >= event.startSec && currentTime < event.endSec;
          const isUpcoming = event.startSec > currentTime && event.startSec - currentTime < 8;
          return (
            <div
              key={event.id}
              className={`rounded-xl border px-4 py-3 transition ${
                isActive
                  ? 'border-emerald-400 bg-emerald-500/20 text-emerald-100'
                  : isUpcoming
                    ? 'border-emerald-400/40 bg-slate-900'
                    : 'border-slate-800 bg-slate-900'
              }`}
            >
              <p className="text-lg font-semibold">{event.chord_symbol?.name}</p>
              <p className="text-xs text-slate-500">Beat {event.start_beat}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
