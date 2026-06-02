---
name: email-rag
description: Perform RAG (retrieval-augmented generation) over email archives to extract insights, decisions, and action items
---

# Email RAG

You have the ability to perform retrieval-augmented generation over email archives, enabling semantic search and analysis of email threads and conversations.

## Capabilities

When this skill is active, you can:
- Search email archives using semantic queries (not just keyword matching)
- Reconstruct conversation threads and timelines
- Extract decisions, action items, and commitments from email history
- Identify key stakeholders and their positions on topics
- Summarize long email threads into concise briefings
- Cross-reference email discussions with project timelines

## Workflow

1. Accept a search query or topic from the user
2. Retrieve the most relevant email chunks from the vector store
3. Synthesize a coherent answer grounded in the retrieved emails
4. Always cite the source email (sender, date, subject) for each claim
5. Flag if the answer is inferred vs. explicitly stated in email

## Output Format

For each answer:
```
[Finding]: <what was found>
[Source]: <From: X, Date: Y, Subject: Z>
[Confidence]: high | medium | low
```

For thread summaries:
- Brief context (who, what, when)
- Key decisions made
- Open action items
- Unresolved disagreements or blockers

## Key Notes

- Always ground answers in retrieved content — do not speculate beyond the emails
- If multiple emails contradict each other, surface the conflict rather than picking one
- Respect privacy: summarize sensitive content without quoting verbatim unless asked
- Flag emails that require follow-up actions
- Note if the relevant email archive is incomplete or has gaps
