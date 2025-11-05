import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import AudioUploadZone from '../components/upload/AudioUploadZone.jsx';
import InstrumentSelector from '../components/upload/InstrumentSelector.jsx';
import ProcessingModal from '../components/upload/ProcessingModal.jsx';
import { detectBpm, detectKey, inferDuration } from '../components/utils/songAnalysis.js';
import { createMockSong } from '../components/utils/mockSong.js';
import { upsertSong } from '../api/songService.js';

const defaultValues = {
  title: '',
  artist: '',
  focusInstrument: 'acoustic'
};

const readFileAsDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });

export default function Upload() {
  const navigate = useNavigate();
  const { register, handleSubmit, setValue, watch } = useForm({ defaultValues });
  const [file, setFile] = useState(null);
  const [isProcessing, setProcessing] = useState(false);
  const focusInstrument = watch('focusInstrument');

  const handleFileChange = (selectedFile) => {
    setFile(selectedFile);
    if (!watch('title')) {
      const fallbackTitle = selectedFile.name.replace(/\.[^/.]+$/, '');
      setValue('title', fallbackTitle);
    }
    if (!watch('artist')) {
      setValue('artist', 'Imported on ' + format(new Date(), 'MMM d, yyyy'));
    }
  };

  const onSubmit = handleSubmit(async (values) => {
    if (!file) {
      alert('Please choose an audio file to analyze.');
      return;
    }
    setProcessing(true);
    try {
      const bpm = detectBpm(file.name);
      const key = detectKey(file.name);
      const duration = inferDuration(file);
      const audioDataUrl = await readFileAsDataUrl(file);

      const song = createMockSong({
        title: values.title,
        artist: values.artist,
        bpm,
        key,
        duration,
        audioDataUrl
      });

      song.focus_instrument = values.focusInstrument;

      upsertSong(song);
      navigate(`/results/${song.id}`);
    } catch (error) {
      console.error('Failed to process song', error);
      alert('Failed to analyze the song. Please try again with a different file.');
    } finally {
      setProcessing(false);
    }
  });

  return (
    <div className="space-y-8">
      <ProcessingModal open={isProcessing} filename={file?.name} />
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Upload a Song</h1>
        <p className="text-sm text-slate-400">
          TabMaster generates a playable chord and tablature timeline from your audio file. Start with a demo upload or
          drag your own track.
        </p>
      </div>
      <form className="grid gap-8 lg:grid-cols-2" onSubmit={onSubmit}>
        <div className="space-y-6">
          <AudioUploadZone file={file} onFileChange={handleFileChange} />
          <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
            <div>
              <label className="text-sm font-semibold text-slate-300">Song title</label>
              <input
                {...register('title')}
                placeholder="e.g. Wonderwall"
                className="mt-2 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm focus:border-emerald-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-300">Artist</label>
              <input
                {...register('artist')}
                placeholder="e.g. Oasis"
                className="mt-2 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm focus:border-emerald-400 focus:outline-none"
              />
            </div>
            <InstrumentSelector value={focusInstrument} onChange={(val) => setValue('focusInstrument', val)} />
          </div>
        </div>
        <div className="flex flex-col justify-between gap-6">
          <div className="space-y-3 rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
            <h2 className="text-xl font-semibold">What happens next?</h2>
            <ul className="space-y-3 text-sm text-slate-300">
              <li>• Detect BPM, key signature, and approximate duration.</li>
              <li>• Generate a realistic chord progression and fretboard shapes.</li>
              <li>• Build a synced timeline for Guitar Hero-style playback.</li>
            </ul>
          </div>
          <button
            type="submit"
            className="rounded-xl bg-emerald-500 px-6 py-3 text-base font-semibold text-slate-950 shadow-lg transition hover:bg-emerald-400"
          >
            Analyze &amp; Open in Results
          </button>
        </div>
      </form>
    </div>
  );
}
