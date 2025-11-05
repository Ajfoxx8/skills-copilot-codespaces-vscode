import { useMemo, useRef, useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Clock } from 'lucide-react';
import AudioPlayer from '../components/results/AudioPlayer.jsx';
import GuitarHeroTab from '../components/results/GuitarHeroTab.jsx';
import InteractiveCAGED from '../components/results/InteractiveCAGED.jsx';
import AsciiTab from '../components/results/AsciiTab.jsx';
import TablatureDisplay from '../components/results/TablatureDisplay.jsx';
import ChordProgression from '../components/results/ChordProgression.jsx';
import SectionNavigator from '../components/results/SectionNavigator.jsx';
import StemsPanel from '../components/results/StemsPanel.jsx';
import { getSong } from '../api/songService.js';
import { buildTimeline, currentItemAt, groupBySection } from '../components/utils/timeline.js';

export default function Results() {
  const { songId } = useParams();
  const audioRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [selectedSection, setSelectedSection] = useState(null);

  const { data: song } = useQuery({
    queryKey: ['song', songId],
    queryFn: () => getSong(songId),
    staleTime: Infinity
  });

  const timeline = useMemo(() => buildTimeline(song), [song]);
  const groupedSections = useMemo(() => groupBySection(song), [song]);
  const activeChord = useMemo(() => currentItemAt(timeline, currentTime), [timeline, currentTime]);

  useEffect(() => {
    const node = audioRef.current;
    if (!node) return;
    const handleTimeUpdate = () => setCurrentTime(node.currentTime);
    node.addEventListener('timeupdate', handleTimeUpdate);
    return () => node.removeEventListener('timeupdate', handleTimeUpdate);
  }, [audioRef]);

  useEffect(() => {
    if (selectedSection && audioRef.current) {
      audioRef.current.currentTime = selectedSection.start_sec;
    }
  }, [selectedSection]);

  if (!song) {
    return (
      <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/40 p-10 text-center">
        <p className="text-lg font-semibold">Song not found</p>
        <p className="text-sm text-slate-400">The requested song is missing. Try returning to the library.</p>
        <Link className="text-sm font-semibold text-emerald-300" to="/library">
          Go to Library
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-6 rounded-3xl border border-slate-800 bg-slate-900/50 p-8 lg:flex-row">
        <div className="flex-1 space-y-4">
          <div>
            <h1 className="text-3xl font-bold">{song.title}</h1>
            <p className="text-sm text-slate-400">{song.artist}</p>
          </div>
          <div className="flex flex-wrap gap-4 text-xs text-slate-300">
            <div className="flex items-center gap-2 rounded-full border border-slate-700 px-3 py-1">
              <Clock className="h-3.5 w-3.5 text-emerald-300" />
              {Math.round(song.duration_sec)}s
            </div>
            <div className="flex items-center gap-2 rounded-full border border-slate-700 px-3 py-1">
              BPM {song.global_timing.tempo_map[0].bpm}
            </div>
            <div className="flex items-center gap-2 rounded-full border border-slate-700 px-3 py-1">
              Key {song.global_music.key_signature}
            </div>
          </div>
          <AudioPlayer ref={audioRef} song={song} />
        </div>
        <div className="flex-1">
          <GuitarHeroTab activeChord={activeChord} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChordProgression timeline={timeline} currentTime={currentTime} />
        <InteractiveCAGED chord={activeChord} keySignature={song.global_music.key_signature} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <TablatureDisplay
          timeline={timeline}
          currentTime={currentTime}
          onSeek={(time) => {
            if (audioRef.current) {
              audioRef.current.currentTime = time;
            }
          }}
        />
        <AsciiTab timeline={timeline} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <SectionNavigator
          sections={groupedSections}
          currentTime={currentTime}
          onJump={(section) => setSelectedSection(section)}
        />
        <StemsPanel stems={song.stems} />
      </div>
    </div>
  );
}
