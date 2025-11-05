import { motion, AnimatePresence } from 'framer-motion';

const stringNames = ['E', 'B', 'G', 'D', 'A', 'E'];

export default function GuitarHeroTab({ activeChord }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-emerald-400/40 bg-gradient-to-br from-emerald-500/10 via-slate-900 to-slate-950 p-6 shadow-lg">
      <div className="space-y-3">
        <p className="text-sm uppercase tracking-wide text-emerald-200">Now Playing</p>
        <div className="h-28 overflow-hidden rounded-xl bg-slate-950/80">
          <AnimatePresence mode="wait">
            {activeChord ? (
              <motion.div
                key={activeChord.id}
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -40, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 120, damping: 18 }}
                className="flex h-full flex-col items-center justify-center gap-2"
              >
                <motion.span className="text-4xl font-black text-emerald-200 drop-shadow-lg" layout>
                  {activeChord.chord_symbol?.name ?? '--'}
                </motion.span>
                <p className="text-xs uppercase tracking-widest text-slate-400">Beat {activeChord.start_beat}</p>
              </motion.div>
            ) : (
              <motion.div className="flex h-full items-center justify-center text-slate-500" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                Waiting for playback...
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <div className="mt-6 grid grid-cols-6 gap-2 text-center text-xs text-slate-400">
        {stringNames.map((string, index) => {
          const stringNumber = 6 - index;
          const fret = activeChord?.tab?.positions?.find((pos) => pos.string === stringNumber)?.fret ?? '-';
          return (
            <div key={stringNumber} className="rounded-lg border border-slate-800 bg-slate-900/70 p-2">
              <p className="text-[10px] uppercase tracking-wide text-slate-500">{string}</p>
              <p className="text-lg font-semibold text-emerald-200">{fret}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
