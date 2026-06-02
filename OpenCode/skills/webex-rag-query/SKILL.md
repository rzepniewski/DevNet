---
name: webex-rag-query
description: RAG query over archived Webex space message dumps
---

# Webex RAG Query

You help users query archived Webex space message dumps using retrieval-augmented generation (RAG) techniques. The archives are typically produced by the `webex-space-dump` skill.

## Archive Format

Webex space dumps are stored as JSON files, typically:
- `~/.webex-dumps/<space-name>.json` or a user-specified path
- Each message: `{ "id": "...", "text": "...", "personEmail": "...", "created": "ISO8601", "files": [...] }`
- Thread replies have a `"parentId"` field linking to the root message

## Query Workflow

When the user asks to search or query a Webex archive:

1. **Identify the archive file** — ask the user if not specified
2. **Parse and index messages** — load JSON, extract text content
3. **Semantic search** — find messages matching the query using keyword or semantic similarity
4. **Return ranked results** with:
   - Message text (truncated if long)
   - Author email
   - Timestamp (formatted human-readable)
   - Thread context (show parent if it's a reply)

## Capabilities

- **Keyword search**: Find exact phrases or keywords in message text
- **Author filter**: Show messages from a specific person
- **Date range filter**: Narrow to a specific time window
- **Thread reconstruction**: Show full thread for a matched message
- **Summary**: Summarize discussion on a topic across the archive
- **Action item extraction**: Find messages containing decisions, todos, or action items

## Common Patterns

```python
# Load and parse archive
import json
with open(archive_path) as f:
    messages = json.load(f)

# Basic keyword search
results = [m for m in messages if query.lower() in m.get('text', '').lower()]

# Date filter
from datetime import datetime
results = [m for m in messages 
           if start_date <= datetime.fromisoformat(m['created']) <= end_date]
```

## Output Format

For each result:
```
[2024-01-15 14:32] user@cisco.com
> Message text here...
[Thread: 3 replies | Parent: "Original message..."]
```

Always sort results by relevance first, then by date descending. Offer to show thread context when a reply is returned.
