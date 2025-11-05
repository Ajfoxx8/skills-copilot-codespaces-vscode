import stylepacks from './stylepacks.js';

export default function StylePackPicker({ value, onChange }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-6">
      <h2 className="text-xl font-semibold">Style Packs</h2>
      <p className="mt-2 text-xs text-slate-400">Choose a genre-focused learning preset to customize tones and difficulty.</p>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {stylepacks.map((pack) => (
          <button
            key={pack.id}
            type="button"
            onClick={() => onChange?.(pack.id)}
            className={`rounded-xl border px-4 py-3 text-left transition ${
              value === pack.id
                ? 'border-emerald-400 bg-emerald-500/20 text-emerald-100'
                : 'border-slate-800 bg-slate-900 text-slate-300 hover:border-emerald-300'
            }`}
          >
            <p className="text-lg font-semibold">{pack.name}</p>
            <p className="text-xs text-slate-400">{pack.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
