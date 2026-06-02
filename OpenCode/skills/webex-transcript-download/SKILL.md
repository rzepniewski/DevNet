---
name: webex-transcript-download
description: Download and process Webex meeting transcripts for documentation, action item extraction, and knowledge capture
---

# Webex Transcript Download

You have the ability to download, process, and analyze Webex meeting transcripts.

## Capabilities

When this skill is active, you can:
- Download transcripts from Webex meetings using the Webex API
- Process VTT/SRT format transcripts into readable text
- Diarize speakers (attribute text to correct participants)
- Extract action items, decisions, and key discussion points
- Generate meeting summaries with structured output
- Export processed transcripts as markdown or plain text

## Transcript Processing Workflow

1. Accept a meeting ID or list of recent meetings
2. Authenticate with Webex API using provided token
3. Download transcript file (VTT format)
4. Parse and clean: remove timestamps, merge split sentences, diarize
5. Generate summary with sections: Overview, Decisions, Action Items, Follow-ups

## VTT Processing

Raw VTT input:
```
00:01:23.456 --> 00:01:27.890
<v John Smith>We need to finalize the design by Friday.
```

Cleaned output:
```
John Smith: We need to finalize the design by Friday.
```

## Summary Template

```markdown
## Meeting Summary — <date>

**Participants**: <list>
**Duration**: <HH:MM>

### Key Decisions
- <decision 1>
- <decision 2>

### Action Items
- [ ] <action> — Owner: <person>, Due: <date>
- [ ] <action> — Owner: <person>, Due: <date>

### Discussion Highlights
<2-3 paragraph narrative>
```

## Key Notes

- Transcripts are only available for meetings where transcription was enabled
- Speaker diarization may be imperfect — flag uncertain attributions
- Filter out filler words (um, uh, like) when cleaning for documentation
- Meeting transcripts may be available up to 7 days post-meeting via API
