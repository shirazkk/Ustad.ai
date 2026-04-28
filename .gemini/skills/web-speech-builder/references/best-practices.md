# Web Speech API Best Practices

## 1. Speech Recognition (STT)

### Browser Support & Prefixes
- `window.SpeechRecognition` is standard, but Chrome and Safari still require `window.webkitSpeechRecognition`.
- Firefox has experimental support behind a flag. Always check for support before rendering UI.
- Example check: `const SpeechRecognition = typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition);`

### Quirks
- **HTTPS Required:** STT only works on secure origins (HTTPS) or `localhost`.
- **Language:** For Roman Urdu/Hinglish, `'en-US'` or `'en-IN'` usually works best as the engine tries to transcribe phonetic English.
- **Continuous Mode:** `continuous = true` keeps the mic open, but `interimResults = true` can cause flickering. For simple chat bots, single utterance (default) is often more reliable.

## 2. Speech Synthesis (TTS)

### Autoplay Policies
- Browsers block TTS unless initiated by a direct user gesture (click or touch).
- Never attempt to auto-play audio on page load.

### Content Cleanup
- Screen readers and TTS engines will literally pronounce markdown characters (e.g., "asterisk asterisk bold text asterisk asterisk").
- Strip markdown using a simple regex before speaking: `text.replace(/[*#_`~]/g, '')`.

### State Management
- `window.speechSynthesis.speaking` isn't always reliable for React state. Use the `onstart` and `onend` events of the `SpeechSynthesisUtterance` to toggle React state.
- If TTS gets "stuck" (a known Chrome bug on long texts), call `window.speechSynthesis.cancel()` before starting a new utterance.
