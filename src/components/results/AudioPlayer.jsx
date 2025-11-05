import { forwardRef, useImperativeHandle, useRef, useState } from 'react';

const playbackRates = [0.75, 1, 1.25];

const AudioPlayer = forwardRef(function AudioPlayer({ song }, ref) {
  const audioRef = useRef(null);
  const [playbackRate, setPlaybackRate] = useState(1);

  useImperativeHandle(ref, () => audioRef.current);

  const handleRateChange = (rate) => {
    setPlaybackRate(rate);
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
    }
  };

  return (
    <div className="space-y-3 rounded-2xl border border-slate-800 bg-slate-950/40 p-4">
      <audio ref={audioRef} src={song.stems?.[0]?.audio_url ?? ''} controls className="w-full" preload="auto" />
      <div className="flex items-center gap-2 text-xs text-slate-300">
        Speed:
        {playbackRates.map((rate) => (
          <button
            key={rate}
            type="button"
            onClick={() => handleRateChange(rate)}
            className={`rounded-full border px-2 py-1 transition ${
              playbackRate === rate
                ? 'border-emerald-400 bg-emerald-500/20 text-emerald-200'
                : 'border-slate-700 hover:border-emerald-300'
            }`}
          >
            {rate.toFixed(2)}x
          </button>
        ))}
      </div>
    </div>
  );
});

export default AudioPlayer;
