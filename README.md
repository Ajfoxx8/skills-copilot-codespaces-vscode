# TabMaster

TabMaster is a Guitar Hero–inspired chord learning application that turns any uploaded audio file into a synchronized, interactive guitar practice experience. The platform ingests a track, produces a structured song entity, and renders multiple real-time visualizations that guide players through chord progressions, fretboard positions, and song sections while the audio plays.

> **Repository status:** This repository currently contains **documentation only**. The React application, Base44 project configuration, and related implementation artifacts described below are part of the intended design but are not committed here. Use this README as a product and engineering reference while the codebase is being developed.

---

## Table of Contents

1. [Repository Contents](#repository-contents)
2. [Key Capabilities](#key-capabilities)
3. [System Architecture (Planned)](#system-architecture-planned)
   - [Frontend](#frontend)
   - [Backend (Base44 Platform)](#backend-base44-platform)
   - [Supporting Libraries](#supporting-libraries)
4. [Data Model](#data-model)
   - [Song Entity](#song-entity)
   - [Timing & Synchronization](#timing--synchronization)
5. [User Flows (Proposed)](#user-flows-proposed)
   - [Upload & Analysis](#upload--analysis)
   - [Playback & Learning](#playback--learning)
6. [Core Components (Conceptual)](#core-components-conceptual)
7. [Algorithms & Business Logic (Prototype)](#algorithms--business-logic-prototype)
   - [Chord Progression Generation](#chord-progression-generation)
   - [Beat-to-Second Conversion](#beat-to-second-conversion)
   - [Active Chord Detection](#active-chord-detection)
8. [Development Environment](#development-environment)
9. [Testing & Debugging](#testing--debugging)
10. [Limitations](#limitations)
11. [Roadmap](#roadmap)

---

## Repository Contents

- `README.md` – Product overview and technical reference (this file).
- `LICENSE` – MIT license for the future TabMaster codebase.

## Key Capabilities

- **Audio Upload & Processing** – Drag-and-drop upload with duration detection, filename heuristics for BPM/key discovery, and mock chord progression synthesis.
- **Real-Time Visual Guidance** – Synchronizes chord highlights, tablature, and fretboard visuals with audio playback using a shared timing system.
- **Song Library Management** – Persisted song entities with Base44 row-level security so users see only their uploads, plus search, filter, delete, and export options.
- **Responsive Learning Experience** – Guitar Hero–style tab visual, ASCII tabs, section navigation, and playback controls optimized for desktop and mobile usage.

---

## System Architecture (Planned)

### Frontend

- **Framework:** React with React Router for multi-page navigation (`Upload`, `Results`, `Library`).
- **Styling:** Tailwind CSS, shadcn/ui component library, Lucide React icons, and Framer Motion animations for UI polish.
- **State/Data:** TanStack React Query manages asynchronous Base44 API calls and caching.
- **Structure:** Key UI code will live in `pages/` (top-level screens) and `components/` (modular widgets). Utility logic is planned for `components/utils/`.

### Backend (Base44 Platform)

- **Entity Storage:** PostgreSQL-backed storage for `Song` entities with row-level security (RLS) to ensure per-user data isolation.
- **File Storage:** Public bucket for uploaded audio assets referenced by `stems[].audio_url`.
- **Authentication:** Base44 managed auth gating CRUD operations.

### Supporting Libraries

- `date-fns` for date formatting, `react-hook-form` for form state management, and `lodash` for utility helpers.

---

## Data Model

### Song Entity

The `Song` entity captures everything required to drive the learning experience:

```json
{
  "title": "string",
  "artist": "string",
  "duration_sec": 0,
  "global_music": {
    "key_signature": "C",
    "scale": "major",
    "capo_fret": 0,
    "tuning_ref_hz": 440
  },
  "global_timing": {
    "ppq": 960,
    "time_signatures": [{ "bar_start": 1, "num": 4, "den": 4 }],
    "tempo_map": [{ "bar_start": 1, "bpm": 120 }]
  },
  "sections": [
    {
      "id": "verse1",
      "label": "verse",
      "start_sec": 0,
      "end_sec": 30,
      "start_bar": 1,
      "end_bar": 8
    }
  ],
  "stems": [
    {
      "id": "main_stem",
      "label": "Full Mix",
      "role": "guitar",
      "audio_url": "https://...",
      "confidence": 0.95
    }
  ],
  "tracks": [
    {
      "id": "guitar_track",
      "instrument": {
        "family": "guitar",
        "type": "acoustic_guitar",
        "tuning": ["E2", "A2", "D3", "G3", "B3", "E4"]
      },
      "events": [
        {
          "section_id": "verse1",
          "start_beat": 0,
          "duration_beats": 4,
          "kind": "chord",
          "tab": {
            "positions": [
              { "string": 5, "fret": 3 },
              { "string": 4, "fret": 2 }
            ]
          },
          "chord_symbol": {
            "name": "C",
            "roman": "I"
          }
        }
      ]
    }
  ]
}
```

### Timing & Synchronization

- **Beats vs Seconds:** Events are stored in beats; runtime views operate in seconds. A shared tempo map (typically constant BPM) converts between the two domains.
- **Timeline Builder (`components/utils/timeline.js`):** Precomputes `startSec`/`endSec` for each event using `secondsPerBeat = 60 / bpm`.
- **Runtime Lookup:** UI widgets call `currentItemAt()` with the current audio time to find the active chord and associated tablature.

---

## User Flows (Proposed)

### Upload & Analysis

1. **File Intake (`pages/Upload.js`):** Drag-and-drop zone validates audio, determines duration via HTML5 Audio API, and extracts hints (key, tempo, style) from the filename.
2. **Heuristic Analysis:** Uses keyword heuristics to assign BPM (`"slow" → 70`, `"fast" → 140`, default `90–130`) and detect key signatures (`"c_"`, `"gmaj"`, `"am"`, etc.).
3. **Chord Progression Synthesis:** Selects chord sequences from a curated table of common progressions per key (e.g., I–vi–IV–V in C major) and assigns fret positions from hard-coded chord shapes.
4. **Song Entity Creation:** Builds sections, track events, stems, and metadata, storing the result via Base44 and redirecting to the Results page.

### Playback & Learning

1. **Song Retrieval (`pages/Results.js`):** Fetches the song via URL `song` param and constructs a timeline.
2. **Audio Synchronization:** Binds `timeupdate` events from the `<audio>` element to React state for current playback time.
3. **Visualization Updates:** Components such as `GuitarHeroTab`, `InteractiveCAGED`, and `AsciiTab` highlight the current chord, show upcoming events, and animate fretboard positions.
4. **Section Navigation:** `SectionNavigator` enables jumping between labeled song sections; `TablatureDisplay` (which includes the event list and scrub controls) supports seek and scrub interactions.

---

## Core Components (Conceptual)

### Results Page Widgets (`components/results/`)

- **`GuitarHeroTab.jsx`** – Primary now-playing display with animated fret indicators.
- **`InteractiveCAGED.jsx`** – Shows fretboard shapes aligned to the song’s key using the CAGED system.
- **`AudioPlayer.jsx`** – Audio element wrapper with playback speed, progress bar, and seek support.
- **`AsciiTab.jsx`** & **`TablatureDisplay.jsx`** – Render tablature in ASCII and list forms for reference, including timeline scrubbing controls.
- **`ChordProgression.jsx`** – Displays the upcoming chord queue.
- **`SectionNavigator.jsx`** – Jump between structural sections.
- **`StemsPanel.jsx`** – Placeholder for future isolated stem playback.

### Upload Page Widgets (`components/upload/`)

- **`AudioUploadZone.jsx`** – Drag-and-drop input and validation.
- **`InstrumentSelector.jsx`** – Choose target instrument focus (currently guitar-centric).
- **`ProcessingModal.jsx`** – Upload/progress feedback UI.

### Learning Experiments (`components/learning/`)

- **`PracticeCoach.jsx`, `StylePackPicker.jsx`, `stylepacks.js`** – Future-facing modules for AI practice guidance and genre customization.

### Utilities (`components/utils/`)

- **`timeline.js`** – Timing conversions and active chord detection helpers.
- **`mockSong.js`** – Generates synthetic song data for local testing.

---

## Algorithms & Business Logic (Prototype)

### Chord Progression Generation

```javascript
const progressions = {
  C: [
    ["C", "Am", "F", "G"],
    ["C", "G", "Am", "F"],
    ["Am", "F", "C", "G"],
  ],
  G: [
    ["G", "Em", "C", "D"],
    ["G", "D", "Em", "C"],
  ],
  // ... additional keys
};

const key = detectKey(filename);
const progression = progressions[key][randomIndex];
```

### Beat-to-Second Conversion

```javascript
const bpm = song.global_timing.tempo_map[0].bpm;
const secondsPerBeat = 60 / bpm;

const timeline = song.tracks[0].events.map(event => ({
  startSec: event.start_beat * secondsPerBeat,
  endSec: (event.start_beat + event.duration_beats) * secondsPerBeat,
  chord: event.chord_symbol.name,
  positions: event.tab.positions,
}));
```

### Active Chord Detection

```javascript
function currentItemAt(timeline, currentTime) {
  return timeline.find(item =>
    currentTime >= item.startSec &&
    currentTime < item.endSec
  );
}
```

---

## Development Environment

Because this repository only tracks documentation, there is no runnable project yet. When the implementation phase begins:

1. **Project Scaffold:** Create a React application (for example, with Vite or Create React App) and check in the generated `package.json`, source files, and build configuration.
2. **Prerequisites:** Install Node.js 18+, npm or yarn, and provision a Base44 project with the TabMaster schemas.
3. **Dependencies:** Run `npm install`/`yarn` after the scaffold exists to fetch dependencies defined in `package.json`.
4. **Environment Variables:** Configure Base44 credentials (API keys, project IDs) according to internal deployment docs.
5. **Local Development:** Start the dev server with `npm run dev` (or the equivalent script defined by the chosen scaffold) once the application code is in place.

---

## Testing & Debugging

- **Timeline Validation:** Console-log outputs from `buildTimeline()` and `currentItemAt()` when diagnosing sync drift.
- **Audio Issues:** Confirm `stems[].audio_url` is reachable (check for CORS) and that files upload successfully.
- **Library Visibility:** Ensure RLS predicates include the current user; inspect `Song.list()` filters on the `Library` page.
- **Mobile QA:** Verify touch interactions for scrubbing and section navigation.

---

## Limitations

- **Mock Analysis:** Chord progressions rely on heuristics and do not reflect actual audio analysis.
- **Static Tempo:** Assumes constant BPM; tempo changes cause timing drift.
- **Limited Chord Vocabulary:** Only a handful of open-position chords with fixed voicings.
- **Stems Placeholder:** `StemsPanel` currently references the main mix only; no stem separation.

---

## Roadmap

### Phase 1 – Core Enhancements

- Integrate real-time chord detection services (e.g., Essentia, Chordify).
- Expand chord dictionary (barre shapes, 7ths, suspended, diminished).
- Improve timing accuracy with tempo map handling and drift correction.
- Add practice tools: looped sections, tempo slowdown.

### Phase 2 – Advanced Learning Tools

- Stem separation via Demucs/Spleeter with per-stem mixing.
- AI-driven practice feedback and performance scoring.
- Custom tunings, left-handed mode, capo-aware chord shapes.

### Phase 3 – Social Features

- Shareable song links with collaboration controls.
- Community-sourced chord corrections and ratings.
- Playlists and progress tracking dashboards.

---

## License

This project is licensed under the [MIT License](LICENSE).

