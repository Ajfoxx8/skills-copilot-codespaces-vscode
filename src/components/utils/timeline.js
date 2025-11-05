export function buildTimeline(song) {
  if (!song?.tracks?.length) return [];
  const bpm = song.global_timing?.tempo_map?.[0]?.bpm ?? 120;
  const secondsPerBeat = 60 / bpm;

  return song.tracks[0].events.map((event) => ({
    ...event,
    startSec: event.start_beat * secondsPerBeat,
    endSec: (event.start_beat + event.duration_beats) * secondsPerBeat
  }));
}

export function currentItemAt(timeline, currentTime) {
  if (!timeline?.length) return undefined;
  return timeline.find((item) => currentTime >= item.startSec && currentTime < item.endSec);
}

export function groupBySection(song) {
  if (!song?.sections?.length || !song?.tracks?.length) return [];
  const events = song.tracks[0].events;
  return song.sections.map((section) => ({
    ...section,
    events: events.filter((event) => event.section_id === section.id)
  }));
}
