const cagedShapes = ['C', 'A', 'G', 'E', 'D'];

export default function InteractiveCAGED({ chord, keySignature }) {
  return (
    <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-950/40 p-6">
      <div>
        <h2 className="text-xl font-semibold">Interactive CAGED</h2>
        <p className="text-xs text-slate-400">Highlighting fretboard regions for {keySignature} major scale.</p>
      </div>
      <div className="grid grid-cols-5 gap-3 text-center text-xs text-slate-300">
        {cagedShapes.map((shape) => (
          <div
            key={shape}
            className={`rounded-lg border p-4 transition ${
              chord?.chord_symbol?.name?.startsWith(shape)
                ? 'border-emerald-400 bg-emerald-500/20 text-emerald-100'
                : 'border-slate-800 bg-slate-900'
            }`}
          >
            <p className="text-lg font-semibold">{shape}</p>
            <p className="text-[10px] uppercase tracking-wide text-slate-500">Shape</p>
          </div>
        ))}
      </div>
      <p className="text-xs text-slate-400">
        The highlighted shape suggests fretboard positions for playing {chord?.chord_symbol?.name ?? 'the chord'} within the
        CAGED system. Use it to visualize the scale nearby.
      </p>
    </div>
  );
}
