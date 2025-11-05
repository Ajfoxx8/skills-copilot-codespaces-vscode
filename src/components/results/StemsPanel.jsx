export default function StemsPanel({ stems }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-6">
      <h2 className="text-xl font-semibold">Stems</h2>
      <p className="mt-2 text-xs text-slate-400">Stem isolation is planned. For now, all stems route to the same mix.</p>
      <div className="mt-4 space-y-3">
        {stems?.map((stem) => (
          <div key={stem.id} className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
            <p className="text-sm font-semibold text-slate-200">{stem.label}</p>
            <p className="text-xs text-slate-500">Role: {stem.role}</p>
            <p className="text-xs text-slate-500">Confidence: {(stem.confidence * 100).toFixed(0)}%</p>
          </div>
        ))}
      </div>
    </div>
  );
}
