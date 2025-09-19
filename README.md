# Early Reader Adventure

Early Reader Adventure is a colorful, gamified teaching aid that helps kindergarten-age kids practice early reading skills in English and Hebrew. The first release focuses on letter identification through play, encouraging feedback, and sound cues. The codebase is structured so new languages and activities can be added easily.

## Features

- 🎯 **Three progressive game modes** that cover matching letters to their names, identifying letter shapes from names, and listening to phonemes to spot the right letter.
- 🔊 **Speech prompts and replayable phoneme audio** powered by the browser speech synthesis API.
- 🎵 **Friendly encouragement tones** for success and gentle guidance for mistakes.
- 🌍 **Bilingual support (English & Hebrew)** with right-to-left layout handling and color themes per language.
- 🧩 **Scalable language packs** – add new alphabets by extending a single configuration file.
- 💫 **Modern, responsive design** with playful typography and gradients that remain accessible on tablets and desktops.

## Getting started

```bash
npm install
npm run dev
```

Then open the local address printed in the terminal (usually `http://localhost:5173`).

### Production build

```bash
npm run build
npm run preview
```

The preview command serves the optimized build locally.

## Project structure

```
├── index.html          # Application entry document with font imports
├── package.json        # Dependencies and scripts
├── src
│   ├── App.tsx         # Main application shell and game flow
│   ├── components      # Reusable UI building blocks
│   ├── data            # Language and letter definitions
│   ├── hooks           # Audio + speech synthesis helpers
│   └── styles          # Global and component styling
└── vite.config.ts      # Vite bundler configuration
```

## Adding a new language

1. Open `src/data/languages.ts`.
2. Append a new language object with its locale, direction (`'ltr'` or `'rtl'`), palette, and letter list.
3. Each letter requires a symbol, display name, and a phoneme hint string that will be read aloud.

Once the language pack is saved, it automatically appears in the language selector.

## Browser requirements

- A modern browser with support for the Web Speech API (for spoken prompts) and the Web Audio API (for tone feedback).
- If speech synthesis is unavailable, gameplay still works; the speaker button simply becomes silent.

Enjoy exploring letters through sound, sight, and play! 🎉
