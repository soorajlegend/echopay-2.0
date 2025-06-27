# Advanced Voice Conversation Plan

This plan outlines how we will integrate a single advanced voice mode in EchoPay. The goal is to replicate the natural, low‑latency experience of ChatGPT's advanced voice capability using GPT‑4o.

## Goals
- Provide real‑time spoken conversations with expressive synthesized voices.
- Remove the old two‑step STT + TTS pipeline. All audio processing will be handled by a unified model (GPT‑4o) whenever available.
- No distinction between "standard" and "advanced" modes – voice chat always uses the advanced pipeline.

## Architecture Overview
1. **Client microphone capture** streams audio to the server.
2. **Server processing** uses GPT‑4o to transcribe the input, generate a response and synthesize speech in one step.
3. **Streaming audio** is sent back to the client with minimal delay. The user can interrupt at any time and the model stops speaking to listen.
4. **Transcripts** of each exchange are saved to the chat history once the session ends.

## Feature Highlights
- Choose from the official OpenAI voices (Arbor, Breeze, etc.) for spoken replies.
- Responses include emotional inflection and support quick turn‑taking.
- Voice conversations can be resumed or switched to text seamlessly.
- Daily usage limits are enforced based on total audio duration.

## Next Steps
1. Replace existing STT and TTS helpers with server calls to the GPT‑4o voice API once available.
2. Update the `use-voice-recorder` hook to stream audio and support user interruption.
3. Extend `voice-ui` to indicate listening vs. speaking with a single blue orb similar to ChatGPT.
4. Remove any code paths that attempt to fall back to browser speech synthesis.

This document supersedes the old `voice-research.md` plan.
