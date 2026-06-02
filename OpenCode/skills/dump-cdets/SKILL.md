---
name: dump-cdets
description: Dump and analyze Cisco CDETS (defect tracking system) bug records for troubleshooting and reporting
---

# Cisco CDETS Dump

You have the ability to retrieve, dump, and analyze Cisco CDETS (Customer Defect Entry and Tracking System) bug records.

## Capabilities

When this skill is active, you can:
- Fetch bug details by CDETS ID (e.g., CSCvx12345)
- Dump bug lists for a given product, release, or component
- Extract key fields: status, severity, title, description, affected versions, fixed versions, workarounds
- Cross-reference bugs with service requests and customer cases
- Format output as markdown tables, JSON, or plain text summaries
- Identify duplicate or related defects across a product family

## Bug Record Format

Standard CDETS dump output:
```
Bug ID: CSCxx99999
Title: <short description>
Status: <Open|Fixed|Resolved|Duplicate>
Severity: <1-6>
Product: <product name>
Component: <component>
Affected Versions: <list>
Fixed In: <version(s)>
Workaround: <yes|no — summary>
Summary: <detailed description>
```

## Workflow

1. Accept a list of CDETS IDs, a product/component, or a search query
2. Retrieve each bug's full details
3. Present as a structured table or list, sorted by severity
4. Highlight bugs with no available workaround and no fix version (most critical)
5. Optionally export to CSV or JSON

## Key Notes

- Always include the fixed version when available — it's the most actionable field
- Flag severity 1 and 2 bugs prominently
- Group bugs by component when dumping a full product's defects
- Note whether a workaround exists for each unfixed bug
