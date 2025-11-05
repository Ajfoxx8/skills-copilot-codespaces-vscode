# AudioCraft on Base44

AudioCraft is an AI-assisted production companion for narrative podcasts and audio dramas. Built entirely on the Base44 platform, it helps creative teams convert raw scripts into production-ready documentation that voice actors, directors, and sound designers can act on immediately.

> **Important Limitation**
> AudioCraft does **not** generate `.mp3`/`.wav` files. It focuses on rich text deliverables: character briefs, narration scripts, music cue sheets, sound effect plans, and end-to-end production timelines that can be exported for use in downstream audio workstations.

---

## Table of Contents

1. [Platform Snapshot](#platform-snapshot)
2. [Feature Overview](#feature-overview)
3. [Entity Schemas](#entity-schemas)
4. [Application Architecture](#application-architecture)
5. [Primary Workflows](#primary-workflows)
6. [Integrations & API Usage](#integrations--api-usage)
7. [Styling System](#styling-system)
8. [Testing Checklist](#testing-checklist)
9. [Roadmap & Enhancements](#roadmap--enhancements)
10. [Support](#support)

---

## Platform Snapshot

| Area | Stack | Notes |
| ---- | ----- | ----- |
| Frontend | React, TypeScript, Tailwind CSS | Runs on the Base44-hosted React runtime with [shadcn/ui](https://ui.shadcn.com), Lucide Icons, Framer Motion, and helpers such as `react-hook-form`. |
| Backend | Base44 BaaS | No custom server; persistence and business logic rely on Base44 entities and automations. |
| AI | Base44 Core.InvokeLLM | Handles script parsing, scene extraction, and content generation. |
| Storage | Base44 File Storage | Uploads `.txt` and `.md` scripts; `.docx` uploads are **not** supported. |
| Deployment | Base44 App | No external build or deploy pipeline is required. |

### Current Constraints

* ❌ No text-to-speech (TTS) or audio rendering APIs are available.
* ❌ Audio mixing, editing, and playback features are not part of the current build.
* ❌ Additional npm packages cannot be installed beyond the Base44 default set.
* ✅ Rich AI-generated documentation and production planning assets are supported end-to-end.

---

## Feature Overview

### 1. Script Upload & Processing

* Accepts `.txt` and `.md` script files via Base44's file uploader.
* Runs InvokeLLM-powered extraction to detect scenes, locations, moods, and character participation.
* Automatically updates script status (`uploaded → processing → ready` or `error`).

### 2. Character Studio

* Manage voice profiles per script with personality traits and tone guidance.
* Capture demographic and vocal qualities (gender, age range, accent, tone, pace).
* Auto-generate voice descriptions and export character briefs.

### 3. Audio Generation Workspace

* Select any processed scene and configure narration style, music intensity, and SFX richness.
* Generate multi-track production documentation (dialogue, narration, music, SFX, full mix script).
* Track generation progress and download each output as a `.txt` file.

### 4. Dashboard

* Provides KPIs for total scripts, characters, and generation count.
* Highlights recent activity and presents shortcuts into core flows.

---

## Entity Schemas

AudioCraft relies on three Base44 entities. These definitions should be mirrored in the Base44 data model.

### `Script`

```jsonc
{
  "title": "string",
  "description": "string",
  "file_url": "string",
  "status": "uploaded | processing | ready | error",
  "scenes": [
    {
      "scene_number": "number",
      "title": "string",
      "content": "string",
      "characters": ["string"],
      "setting": "string",
      "mood": "string"
    }
  ],
  "total_scenes": "number",
  "estimated_duration": "string"
}
```

### `Character`

```jsonc
{
  "name": "string",
  "script_id": "string",
  "description": "string",
  "personality_traits": ["string"],
  "voice_profile": {
    "gender": "male | female | neutral",
    "age_range": "child | teen | young_adult | adult | elderly",
    "accent": "american | british | australian | neutral",
    "tone": "warm | authoritative | playful | serious | mysterious",
    "pace": "slow | normal | fast"
  },
  "voice_sample_url": "string"
}
```

### `AudioGeneration`

```jsonc
{
  "script_id": "string",
  "scene_number": "number",
  "status": "queued | processing | completed | failed",
  "settings": {
    "narration_style": "dramatic | conversational | documentary | intimate",
    "music_intensity": "subtle | moderate | intense",
    "sfx_level": "minimal | moderate | rich"
  },
  "audio_tracks": {
    "dialogue_content": "string",
    "narration_content": "string",
    "music_content": "string",
    "sfx_content": "string",
    "mixed_content": "string"
  },
  "processing_time": "number",
  "error_message": "string"
}
```

---

## Application Architecture

```
entities/
├── Script.json              # Script metadata and scenes
├── Character.json           # Character voice profiles
└── AudioGeneration.json     # Generated production outputs

pages/
├── Dashboard.js             # KPI overview & quick actions
├── Upload.js                # Script ingestion flow
├── Characters.js            # Character studio
└── Generation.js            # Scene selection & generation settings

components/
├── characters/
│   ├── CharacterForm.jsx        # Create/edit characters
│   └── VoicePreview.jsx         # AI-generated voice direction
└── generation/
    ├── SceneSelector.jsx        # Scene picker from Script.scenes
    ├── AudioSettings.jsx        # Narration/music/SFX controls
    ├── GenerationProgress.jsx   # Status feedback
    └── AudioPreview.jsx         # Downloadable script outputs

Layout.js                    # App shell with sidebar navigation
```

Each page fetches from Base44 entities using `list`, `filter`, `create`, `update`, and `delete` operations. Shared hooks should centralize entity access to keep the UI declarative and resilient to schema changes.

---

## Primary Workflows

### Upload & Process Scripts

1. Call `base44.integrations.Core.UploadFile` with `.txt` or `.md` files.
2. Kick off scene extraction using `Core.InvokeLLM`, persisting results in `Script.scenes` and updating status to `processing`/`ready`.
3. Display scenes in `SceneSelector` once processing completes.

### Build Character Voice Profiles

1. Use `CharacterForm` to capture the persona, vocal descriptors, and references.
2. Optionally generate descriptive copy via `Core.InvokeLLM` using persona traits as prompt context.
3. Link each character to its parent script via `script_id`.

### Generate Production Documentation

1. Choose the script and scene in `Generation.js`.
2. Configure narration/music/SFX preferences through `AudioSettings`.
3. Submit the generation job to persist an `AudioGeneration` record with status `queued`.
4. A background automation runs `Core.InvokeLLM` prompts to populate the track fields.
5. `GenerationProgress` polls entity status and unlocks downloads when complete.

### Export for External Production

* `AudioPreview` offers `.txt` downloads for dialogue, narration, music, SFX, and mixed scripts.
* Encourage teams to import these documents into DAWs (Audition, Pro Tools, Reaper) or collaborate with voice actors.

---

## Integrations & API Usage

```ts
import { base44 } from "@/api/base44Client";

// Upload files
const { file_url } = await base44.integrations.Core.UploadFile({ file });

// Invoke the LLM for parsing/generation
await base44.integrations.Core.InvokeLLM({
  prompt: promptText,
  add_context_from_internet: false,
  response_json_schema: schema
});

// Persist entities
await Script.create({ ...data });
await Script.update(id, { status: "ready" });
await Character.filter({ script_id });
await AudioGeneration.create({ ...settings });
```

> **Tip:** All entity operations should guard against Base44's rate limits and include user-visible error messaging sourced from `error_message` fields.

---

## Styling System

The theme is defined via CSS custom properties and consumed in Tailwind config or component styles.

```css
:root {
  --primary-navy: #0B1426;
  --accent-gold: #D4AF37;
  --soft-gold: #F5E6A3;
  --deep-blue: #1E3A8A;
  --slate: #64748B;
  --pearl: #F8FAFC;
}
```

Combine these with shadcn/ui tokens to maintain a cinematic, premium aesthetic across dashboards and forms.

---

## Testing Checklist

To validate a deployment, walk through the following scenarios:

1. **Script Upload** – Upload `.txt` and `.md` files, confirm `Script.status` transitions correctly.
2. **Scene Extraction** – Verify characters, settings, and moods populate as expected in `SceneSelector`.
3. **Character Profiles** – Create, edit, and delete characters; ensure AI-generated descriptions render.
4. **Generation Runs** – Execute production scripts for multiple scenes; confirm each track downloads successfully.
5. **Dashboard Accuracy** – Check that KPIs increment and recent lists refresh.

Document findings and report platform issues through Base44's feedback channel.

---

## Roadmap & Enhancements

| Status | Idea | Notes |
| ------ | ---- | ----- |
| Ready | Improved parsing prompts | Tune InvokeLLM templates for better scene boundaries and duration estimates. |
| Ready | Template packs | Offer preset narration/music/SFX profiles for quick starts. |
| Exploring | PDF exports | Generate polished production packets for clients. |
| Exploring | Collaboration | Share scripts with team members and capture revisions. |
| Blocked | Audio rendering | Await Base44 TTS or external integrations before pursuing. |

When Base44 introduces audio APIs, consider integrating ElevenLabs or Google TTS, adding playback, waveform visualization, and direct `.mp3` export.

---

## Support

* Report feature requests or bugs through the Base44 dashboard feedback widget.
* Review the [Base44 documentation](https://www.base44.com/) for platform updates.
* For collaboration inquiries, contact the product team directly via the Base44 community channels.

---

**License:** MIT
