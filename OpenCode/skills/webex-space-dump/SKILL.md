---
name: webex-space-dump
description: Export and analyze Webex space (room) message history for documentation, search, and knowledge extraction
---

# Webex Space Dump

You have the ability to export, search, and analyze Webex space message history.

## Capabilities

When this skill is active, you can:
- Dump all messages from a Webex space/room
- Filter messages by date range, sender, keyword, or message type
- Extract links, files, and attachments shared in a space
- Identify decisions, action items, and key discussions
- Generate a structured summary of a space's conversation history
- Export messages as JSON, CSV, or markdown

## Message Record Format

```
[<timestamp>] <sender_name> (<email>):
<message_content>
[Attachments: <filename>, ...]
```

## Workflow

1. Ask for the Webex space ID or name
2. Authenticate using the user's Webex API token
3. Paginate through the message history (newest to oldest)
4. Apply any requested filters
5. Present results or export in the requested format

## Summary Output

When summarizing a space:
- Total message count and date range
- Top 5 contributors by message count
- Key links and files shared
- Extracted decisions and action items
- Notable threads (high reply count)

## Key Notes

- Webex API returns messages newest-first; reverse for chronological display
- Rate limit: 5 requests/second — paginate with delay if space is large
- Messages with `html` field should be stripped to plain text for readability
- Always include sender email (not just display name) for unambiguous attribution
- Bot messages are often noise — offer to filter them out
