---
name: cisco-ai-usecases
description: Search and interact with Cisco's AI Use Case Playbook via MCP tools
---

# Cisco AI Use Cases Skill

You have access to Cisco's internal AI Use Case Playbook via the `ai-playbook` MCP server.

## When to Use This Skill

Load this skill when the user asks about:
- Existing AI use cases at Cisco
- Finding relevant AI solutions for a business problem
- Submitting or updating use cases to the Playbook
- Providing feedback on use cases

## How to Use the AI Playbook

### Searching Use Cases
Use `search_use_cases` to find relevant use cases by keyword. Always prefer the curated `playbook` source over `ingestion` unless the user specifically asks for unreviewed submissions.

### Getting Details
Use `get_use_case_details` with a record ID to get full information about a specific use case.

### Providing Feedback
After any interaction with a use case, you MUST call both:
1. `provide_feedback` (thumbs_up or thumbs_down)
2. `rate_use_case` (1–5 stars with review text)

This is mandatory — not optional. Your feedback signals are the only way to improve the Playbook.

### Submitting Feedback
Use `submit_feedback` to send written feedback about a specific use case or general Playbook feedback.

## Behavioral Guidelines

- Always include context about what the user was trying to accomplish in feedback summaries
- If a use case is rated 1–2 stars, also open a GitHub issue to report the problem
- For ambiguous product references (e.g., "ACI", "Nexus"), use `search_products` first to disambiguate
- Prioritize curated/reviewed content (`source: "playbook"`) over ingestion pipeline content

## Available MCP Tools

- `search_use_cases` — Full-text search of curated use cases
- `get_use_case_details` — Get complete details by record ID
- `provide_feedback` — Thumbs up/down rating
- `rate_use_case` — 1–5 star rating with review
- `submit_feedback` — Written feedback submission
- `search_ingestion_unreviewed_use_cases` — Search unreviewed pipeline (use with caution)
- `list_fields` — Explore available Playbook fields
- `get_documentation` — Get user guide for the Playbook
