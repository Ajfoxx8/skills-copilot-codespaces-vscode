import { v4 as uuid } from 'uuid';

const chordShapes = {
  C: [
    { string: 5, fret: 3 },
    { string: 4, fret: 2 },
    { string: 2, fret: 1 }
  ],
  G: [
    { string: 6, fret: 3 },
    { string: 5, fret: 2 },
    { string: 1, fret: 3 }
  ],
  Am: [
    { string: 4, fret: 2 },
    { string: 3, fret: 2 },
    { string: 2, fret: 1 }
  ],
  F: [
    { string: 4, fret: 3 },
    { string: 3, fret: 2 },
    { string: 2, fret: 1 }
  ],
  Dm: [
    { string: 3, fret: 2 },
    { string: 2, fret: 3 },
    { string: 1, fret: 1 }
  ],
  Em: [
    { string: 5, fret: 2 },
    { string: 4, fret: 2 }
  ]
};

const defaultTimeline = [
  'C',
  'Am',
  'F',
  'G'
];

export function createMockSong({ title, artist = 'Unknown Artist', bpm = 110, key = 'C', duration = 120, audioDataUrl }) {
  const id = uuid();
  const events = Array.from({ length: 16 }).map((_, index) => {
    const chord = defaultTimeline[index % defaultTimeline.length];
    return {
      id: `${id}-event-${index}`,
      section_id: index < 8 ? 'verse1' : 'chorus1',
      start_beat: index * 4,
      duration_beats: 4,
      kind: 'chord',
      tab: {
        positions: chordShapes[chord] ?? []
      },
      chord_symbol: {
        name: chord,
        roman: 'I'
      }
    };
  });

  return {
    id,
    title,
    artist,
    duration_sec: duration,
    created_at: new Date().toISOString(),
    global_music: {
      key_signature: key,
      scale: key.endsWith('m') ? 'minor' : 'major',
      capo_fret: 0,
      tuning_ref_hz: 440
    },
    global_timing: {
      ppq: 960,
      time_signatures: [
        {
          bar_start: 1,
          num: 4,
          den: 4
        }
      ],
      tempo_map: [
        {
          bar_start: 1,
          bpm
        }
      ]
    },
    sections: [
      {
        id: 'verse1',
        label: 'Verse',
        start_sec: 0,
        end_sec: duration / 2,
        start_bar: 1,
        end_bar: 8
      },
      {
        id: 'chorus1',
        label: 'Chorus',
        start_sec: duration / 2,
        end_sec: duration,
        start_bar: 9,
        end_bar: 16
      }
    ],
    stems: [
      {
        id: 'main',
        label: 'Full Mix',
        role: 'guitar',
        audio_url: audioDataUrl,
        confidence: 0.9
      }
    ],
    tracks: [
      {
        id: 'guitar-track',
        instrument: {
          family: 'guitar',
          type: 'acoustic_guitar',
          tuning: ['E2', 'A2', 'D3', 'G3', 'B3', 'E4']
        },
        events
      }
    ]
  };
}
