# TabMaster

TabMaster is a Guitar Hero–style chord learning environment. Upload an audio file, let the app synthesize a mock chord map, and
practice along with synchronized visualizations that include Guitar Hero tabbing, ASCII tablature, and fretboard guidance.

This repository now hosts the runnable Vite + React prototype as well as documentation for the project’s broader roadmap.

---

## Quick Start

```bash
npm install
npm run dev
```

The app launches on [http://localhost:5173](http://localhost:5173). Upload an MP3/WAV/M4A file to generate a mock song analysis
stored in `localStorage`, then explore the playback experience.

> **Note:** This prototype fabricates chord progressions using filename heuristics. Replace the mock generation pipeline with a
> real analysis service before shipping to production.

---

## Project Structure

```
tabmaster/
├── index.html
├── package.json
├── src/
│   ├── App.jsx
│   ├── Layout.js
│   ├── api/
│   │   └── songService.js
│   ├── components/
│   │   ├── learning/
│   │   │   ├── PracticeCoach.jsx
│   │   │   ├── StylePackPicker.jsx
│   │   │   └── stylepacks.js
│   │   ├── results/
│   │   │   ├── AsciiTab.jsx
│   │   │   ├── AudioPlayer.jsx
│   │   │   ├── ChordProgression.jsx
│   │   │   ├── GuitarHeroTab.jsx
│   │   │   ├── InteractiveCAGED.jsx
│   │   │   ├── SectionNavigator.jsx
│   │   │   ├── StemsPanel.jsx
│   │   │   └── TablatureDisplay.jsx
│   │   ├── upload/
│   │   │   ├── AudioUploadZone.jsx
│   │   │   ├── InstrumentSelector.jsx
│   │   │   └── ProcessingModal.jsx
│   │   └── utils/
│   │       ├── mockSong.js
│   │       ├── songAnalysis.js
│   │       └── timeline.js
│   ├── entities/
│   │   └── Song.json
│   ├── pages/
│   │   ├── Library.js
│   │   ├── Results.js
│   │   └── Upload.js
│   └── styles/
│       └── tailwind.css
├── tailwind.config.js
└── vite.config.js
```

Key frontend dependencies:

- **React + React Router** for routing (`Upload`, `Results`, `Library`).
- **TanStack React Query** for local song retrieval with cache-aware APIs.
- **Tailwind CSS** for styling, plus **Lucide React** icons and **Framer Motion** micro-interactions.
- **react-hook-form** handles the upload form, while **lodash** and **date-fns** power heuristics and formatting.

---

## Core Flows

### 1. Upload & Analysis (`pages/Upload.js`)

1. Drag-and-drop an audio file into `AudioUploadZone`.
2. `songAnalysis.js` guesses key, BPM, and duration from filename and file size.
3. `mockSong.js` builds a `Song` entity with sections, track events, and tablature positions.
4. `songService.upsertSong` stores the song in `localStorage` before navigating to `Results`.

### 2. Playback & Learning (`pages/Results.js`)

1. React Query fetches the song via `songService.getSong`.
2. `timeline.js` converts beat-based events to seconds for precise syncing.
3. `AudioPlayer` exposes playback controls and speed adjustments.
4. Visualization components consume the shared timeline:
   - `GuitarHeroTab` animates the active chord and fret numbers.
   - `ChordProgression` previews upcoming chords.
   - `TablatureDisplay` doubles as the click-to-seek “timeline display.”
   - `AsciiTab` renders text tablature, while `InteractiveCAGED` highlights CAGED positions.
   - `SectionNavigator` jumps between sections and synchronizes with playback.

### 3. Library (`pages/Library.js`)

Lists locally analyzed songs, with options to reopen or delete entries. This mirrors the intended Base44 storage and RLS model in
a lightweight prototype form.

---

## Song Entity Snapshot (`src/entities/Song.json`)

The mock pipeline produces entities that match the schema below, designed to align with Base44 storage:

- `global_music`: key, scale, capo, and reference tuning.
- `global_timing`: tempo map, time signature, and PPQ resolution.
- `sections`: verse/chorus metadata with bar and second ranges.
- `tracks[0].events`: beat-based chord events with tablature positions and Roman numeral hints.

---

## Timing Utilities (`components/utils/timeline.js`)

```js
const secondsPerBeat = 60 / bpm;
startSec = event.start_beat * secondsPerBeat;
endSec = (event.start_beat + event.duration_beats) * secondsPerBeat;
```

`currentItemAt(timeline, time)` returns the active chord for the current audio position, and `groupBySection(song)` bundles
events for section-based navigation.

---

## Future Enhancements

- Replace heuristic chord generation with an actual audio analysis pipeline (Essentia, Chordify, etc.).
- Support tempo changes and per-section BPM for better sync accuracy.
- Implement real stem separation and mixing controls.
- Expand the chord vocabulary to include barre shapes, 7ths, suspensions, and modal interchange.
- Persist songs via Base44 storage instead of browser `localStorage` and enforce row-level security.

---

## License

Released under the MIT License. See [LICENSE](LICENSE) for details.
