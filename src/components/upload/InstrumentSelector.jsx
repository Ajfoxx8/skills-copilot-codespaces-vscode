const instruments = [
  { id: 'acoustic', label: 'Acoustic Guitar' },
  { id: 'electric', label: 'Electric Guitar' },
  { id: 'bass', label: 'Bass Guitar' }
];

export default function InstrumentSelector({ value, onChange }) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-slate-300">Focus instrument</p>
      <div className="flex gap-3">
        {instruments.map((instrument) => (
          <button
            key={instrument.id}
            type="button"
            onClick={() => onChange(instrument.id)}
            className={`rounded-md border px-4 py-2 text-sm transition ${
              value === instrument.id
                ? 'border-emerald-400 bg-emerald-500/20 text-emerald-200'
                : 'border-slate-700 text-slate-300 hover:border-emerald-400'
            }`}
          >
            {instrument.label}
          </button>
        ))}
      </div>
    </div>
  );
}
