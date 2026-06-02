---
name: csone-sr-dump
description: Dump and export Cisco CX One (CS One) service request data for analysis and reporting
---

# CS One Service Request Dump

You have the ability to extract, dump, and analyze Cisco CX One (CS One) service request data.

## Capabilities

When this skill is active, you can:
- Fetch service request lists and details from CS One
- Export SR metadata: ID, title, status, severity, owner, customer, timestamps
- Filter SRs by date range, status, severity, owner, or customer
- Format SR data as structured JSON, CSV, or markdown tables
- Identify patterns across multiple SRs (common failures, recurring customers, trends)
- Cross-reference SR data with bug IDs (CDETS) and product versions

## Workflow

1. Ask the user which SRs to dump (by SR number, owner, date range, or all open)
2. Retrieve SR details including notes, attachments, and history
3. Present data in a clean, structured format for analysis
4. Offer to export as CSV or JSON for further processing

## Output Format

Default SR dump format:
```
SR#: <number>
Title: <title>
Status: <open|closed|pending>
Severity: <1|2|3|4>
Customer: <name>
Owner: <engineer>
Created: <date>
Last Updated: <date>
Summary: <brief description>
```

## Key Notes

- Always redact sensitive customer PII unless explicitly needed
- Group SRs by severity when dumping multiple records
- Flag SRs that have been open longer than their SLA target
- When exporting, include a summary row with counts by status and severity
