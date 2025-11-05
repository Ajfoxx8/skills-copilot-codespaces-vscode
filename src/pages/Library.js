import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { formatDistanceToNow } from 'date-fns';
import { listSongs, removeSong } from '../api/songService.js';

export default function Library() {
  const { data: songs = [], refetch } = useQuery({
    queryKey: ['songs'],
    queryFn: () => listSongs(),
    staleTime: 0
  });

  const hasSongs = useMemo(() => songs.length > 0, [songs]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Your Library</h1>
        <p className="mt-2 text-sm text-slate-400">Browse previously analyzed songs and jump back into any session.</p>
      </div>

      {!hasSongs && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-8 text-center">
          <p className="text-lg font-semibold">No songs yet</p>
          <p className="mt-2 text-sm text-slate-400">Upload a song to start building your TabMaster library.</p>
          <Link className="mt-4 inline-block rounded-md bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950" to="/upload">
            Upload a Song
          </Link>
        </div>
      )}

      {hasSongs && (
        <div className="grid gap-4">
          {songs.map((song) => (
            <article
              key={song.id}
              className="flex flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-900/40 p-6 transition hover:border-emerald-400 md:flex-row md:items-center md:justify-between"
            >
              <div>
                <h2 className="text-xl font-semibold">{song.title}</h2>
                <p className="text-sm text-slate-400">{song.artist}</p>
                <p className="mt-2 text-xs text-slate-500">
                  Generated {formatDistanceToNow(new Date(song.created_at), { addSuffix: true })}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Link
                  to={`/results/${song.id}`}
                  className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-emerald-400"
                >
                  Open
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    removeSong(song.id);
                    refetch();
                  }}
                  className="rounded-lg border border-red-400 px-4 py-2 text-sm font-semibold text-red-300 hover:bg-red-500/10"
                >
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
