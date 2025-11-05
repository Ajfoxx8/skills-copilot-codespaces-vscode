import { motion, AnimatePresence } from 'framer-motion';

export default function ProcessingModal({ open, filename }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900 p-6 text-center shadow-xl"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <p className="text-lg font-semibold">Analyzing {filename || 'song'}...</p>
            <p className="mt-2 text-sm text-slate-400">
              Generating chord progression, fretboard positions, and timing map.
            </p>
            <div className="mt-6 flex justify-center">
              <div className="h-12 w-12 animate-spin rounded-full border-2 border-emerald-400 border-t-transparent" />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
