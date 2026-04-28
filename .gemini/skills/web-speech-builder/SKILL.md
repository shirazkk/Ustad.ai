---
name: web-speech-builder
description: |
  Builds robust React hooks and components for Voice Input (STT) and Voice Output (TTS) using the Web Speech API.
  Use when users ask to implement voice chat, speech recognition, text-to-speech, or Phase 4 of Ustaad.ai.
allowed-tools: Read, Write
---

# Web Speech API Builder

This skill guides the implementation of Speech-to-Text (STT) and Text-to-Speech (TTS) features in React applications using native browser APIs (`window.SpeechRecognition` and `window.speechSynthesis`).

## Before Implementation

Gather context to ensure successful implementation:

| Source | Gather |
|--------|--------|
| **Codebase** | Existing state management, UI component structure, theme variables. |
| **Conversation** | User's specific requirements, language preferences (e.g., 'en-US' for Roman Urdu), and constraints. |
| **Skill References** | Domain patterns from `references/best-practices.md`. |

Ensure all required context is gathered before implementing.

## 1. Speech-to-Text (Voice Input)

**Goal:** Create a hook `useSpeechInput` and wire it to the chat input UI.

### Step 1.1: Create Hook
Generate `hooks/useSpeechInput.ts` based on the template in `assets/useSpeechInput.ts.template`.
- Ensure it handles the `webkitSpeechRecognition` prefix.
- Implement graceful degradation (export `supported` boolean).

### Step 1.2: UI Integration
- Inject a Microphone button into the chat input area.
- Only render if `supported === true`.
- While `isListening`, show a pulsing animation or recording indicator.
- Auto-submit or populate the input field when `transcript` updates.

## 2. Text-to-Speech (Voice Output)

**Goal:** Create a hook `useSpeechOutput` and attach it to AI message bubbles.

### Step 2.1: Create Hook
Generate `hooks/useSpeechOutput.ts` based on the template in `assets/useSpeechOutput.ts.template`.
- Ensure markdown is stripped before passing text to `speechSynthesis.speak()`.
- Handle the global `window.speechSynthesis` API safely.

### Step 2.2: UI Integration
- Add a Speaker icon to AI message bubbles.
- Change icon state (e.g., Stop icon) while `isSpeaking`.
- Add a global toggle for voice (optional, based on user requirements).

## Output Standards

- **Graceful Degradation:** The app must not crash if the Web Speech API is unsupported (e.g., Firefox or non-HTTPS).
- **User Gestures:** TTS must only trigger after a user interaction (like clicking a speaker button) to bypass browser autoplay policies.
- **Clean Text:** Never send raw markdown (like `**bold**` or `# headings`) to the TTS engine. Strip it first.
