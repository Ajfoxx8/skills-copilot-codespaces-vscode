import { useCallback, useState } from 'react';
import { UploadCloud } from 'lucide-react';

export default function AudioUploadZone({ file, onFileChange }) {
  const [isDragActive, setIsDragActive] = useState(false);

  const handleDrop = useCallback(
    (event) => {
      event.preventDefault();
      setIsDragActive(false);
      const droppedFile = event.dataTransfer.files?.[0];
      if (droppedFile) {
        onFileChange(droppedFile);
      }
    },
    [onFileChange]
  );

  const handleDragOver = useCallback((event) => {
    event.preventDefault();
    setIsDragActive(true);
  }, []);

  const handleDragLeave = useCallback((event) => {
    event.preventDefault();
    setIsDragActive(false);
  }, []);

  const handleInputChange = useCallback(
    (event) => {
      const selectedFile = event.target.files?.[0];
      if (selectedFile) {
        onFileChange(selectedFile);
      }
    },
    [onFileChange]
  );

  return (
    <div
      className={`flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed p-10 text-center transition-colors ${
        isDragActive ? 'border-emerald-400 bg-emerald-400/10' : 'border-slate-700'
      }`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <UploadCloud className="h-10 w-10 text-emerald-300" />
      <div>
        <p className="text-lg font-semibold">Drop an audio file here</p>
        <p className="text-sm text-slate-400">We support MP3, WAV, and M4A up to 20 minutes.</p>
      </div>
      <label className="cursor-pointer rounded-md bg-emerald-500 px-5 py-2 text-sm font-semibold text-slate-900 shadow hover:bg-emerald-400">
        Choose a file
        <input type="file" accept="audio/*" className="hidden" onChange={handleInputChange} />
      </label>
      {file && (
        <div className="rounded-md bg-slate-800 px-4 py-2 text-sm text-slate-300">
          Selected: <span className="font-medium text-white">{file.name}</span>
        </div>
      )}
    </div>
  );
}
