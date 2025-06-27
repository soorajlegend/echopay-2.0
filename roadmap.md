# Roadmap for Real-Time Voice Interaction

This roadmap outlines the steps to implement a real-time voice interaction system that mirrors the current text-based features of EchoPay.

## 1. Research & Planning ✅
- Explore unified models capable of direct audio input and output.
- Identify browser and device requirements for microphone access and audio playback.
- **Outcome:** Use **GPT-4o** to handle transcription and speech synthesis in a single step. Details are documented in `advanced-voice-plan.md`.
- **Status:** Complete.

## 2. Core Voice Pipeline
- **Remove Existing Voice Feature** ✅: Delete the prototype that used the browser's `SpeechRecognition` API so the new pipeline can start from a clean slate.
- **Capture Audio** ✅: Use the MediaRecorder API to stream microphone input.
- **Speech Processing** ✅: Stream microphone data directly to GPT-4o for transcription and response generation.
- **Intent Handling** ✅: Reuse existing chat/transaction logic to process the model's reply.
- **Voice Responses** ✅: Stream GPT-4o's synthesized speech back to the user in real time.

## 3. UI/UX ✅
- Design a dedicated voice UI with clear states: idle, listening, processing, and speaking.
- Provide visual feedback such as animated waveforms or text captions while listening and speaking.
- Include controls to start/stop recording and to cancel or repeat the last action.

## 4. State Management
- Create a voice store (e.g., with Zustand) to manage microphone status, transcript history, and voice prompts. ✅
- Integrate voice state with existing chat state so text and voice share the same history and business logic. ✅

## 5. API & Server Actions
- Build server-side endpoints or actions to handle voice chat requests and return responses in JSON. ✅
- Ensure that voice requests trigger the same transaction, record keeping, and chart generation logic as text chat. ✅

## 6. Error Handling & Resilience
- Gracefully handle microphone permission denials or network errors. ✅
- Implement timeouts and retries when speech recognition fails or is incomplete. ✅
- Fallback to manual text entry if voice features are unavailable. ✅

## 7. Testing & Quality Assurance
- Write unit tests for the voice store and server actions. ✅
- Perform end-to-end tests simulating microphone input and verifying voice prompts. ✅
- Gather feedback on accuracy, latency, and overall user experience, iterating as needed. ✅

## 8. Future Enhancements
- Explore offline speech recognition for improved privacy and reliability.
- Add language detection and support for multiple languages.
- Implement personalization, such as voice profiles or custom wake words.

