# Development Report: Chat Panel

**Commit:** 66a953c
**Phase:** Feature Addition
**Breakthrough:** no

## Objective

Add a natural language chat interface that lets users search and ask questions about results using conversational input powered by OpenAI.

## Summary

Introduced a ChatPanel component and useChat hook that enable natural language search. The chat uses a dual-mode approach: messages are first evaluated as potential search queries (extracting structured filters and search terms from natural language), and if not a search request, the LLM answers questions about the currently displayed results. Minor layout adjustments were made to App.tsx.

## Changes Made

| File | Change |
|------|--------|
| `src/components/ChatPanel/ChatPanel.tsx` | New component — sticky chat panel with message history, input field, auto-scroll, loading/error states |
| `src/components/ChatPanel/index.ts` | Barrel export |
| `src/hooks/useChat.ts` | New hook — dual-mode LLM calls (search param extraction vs. conversational Q&A), tag normalization, filter validation against TAG_TAXONOMY |
| `src/App.tsx` | Reduced outer padding from `xxxl` to `xl`, commented out app title |

## Issues Resolved

1. **Tag normalization** — LLM may return tags like "Christopher Nolan" instead of "christopher-nolan"; `normalizeTag()` handles space-to-hyphen conversion and lowercasing
2. **Filter validation** — LLM output is validated against TAG_TAXONOMY to prevent hallucinated categories/tags from being applied

## Next Steps

- Wire ChatPanel into the App layout
- Add conversation history persistence or clear button
- Consider streaming responses for better UX
- Add rate limiting or token usage tracking
- Evaluate switching from OpenAI to Claude API
