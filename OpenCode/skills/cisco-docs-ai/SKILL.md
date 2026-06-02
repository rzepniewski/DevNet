---
name: cisco-docs-ai
description: Search and query Cisco official technical documentation using the Cisco Docs AI MCP server (v3.2.4). Answers questions about configuration, troubleshooting, CLI commands, architecture, and feature specifications across all Cisco products (IOS XR, IOS XE, NX-OS, ACI, ASA, Firepower, Catalyst, Nexus, Meraki, Webex, and 5000+ more).
---

# Cisco Docs AI Skill

Use this skill to answer any technical question about Cisco products by querying the official Cisco documentation corpus via AI-powered search.

## When to Use

Load this skill when the user asks:
- How to configure a specific Cisco feature, protocol, or product
- What a specific IOS XR / IOS XE / NX-OS / ACI CLI command does
- Troubleshooting steps for a Cisco issue
- Architecture or design questions about Cisco solutions
- "What does Cisco recommend for...?" / "Find the Cisco doc for..."
- What products/technologies exist in a given Cisco category

## MCP Server

**Server**: `cisco-docs-ai` (pre-configured in opencode.json)  
**Endpoint**: `https://docs-ai.cloudapps.cisco.com/mcp`  
**Version**: 3.2.4  
**Auth**: `X-API-Key` header (pre-configured, no setup needed)

---

## Available Tools

### 1. `ask_cisco_documentation` ⭐ PRIMARY TOOL

AI-powered Q&A against Cisco's official documentation corpus.

**Parameters:**
| Parameter | Required | Description |
|-----------|----------|-------------|
| `question` | ✅ Yes | Technical question in natural language |
| `product` | ⚠️ Strongly recommended | Product name (fuzzy-matched). E.g. `"IOS XR"`, `"Cisco ACI"`, `"ASR 9000"` |
| `sessionId` | Optional | Reuse same value across follow-up questions to maintain conversation context (valid 24h) |
| `userId` | Optional | For tracking (use `przepnie@cisco.com`) |

**Best practices:**
- **Always include `product`** — without it, search spans 5000+ products and results are diluted
- If product name is ambiguous (e.g. `"Nexus"`, `"Catalyst"`), call `search_products` first
- Use the same `sessionId` for follow-up questions in the same conversation thread
- Ask specific questions: "How do I configure IS-IS on IOS XR 7.x?" beats "tell me about IS-IS"

**Example questions:**
- `"How do I configure MPLS LDP on IOS XR?"` + product: `"IOS XR"`
- `"What are the BFD timer recommendations for ASR 9000?"` + product: `"ASR 9000 Series"`
- `"How to configure VLAN pruning on Nexus 9000?"` + product: `"Nexus 9000"`
- `"What is the default BGP holddown timer on IOS XE?"` + product: `"IOS XE"`
- `"How to enable NETCONF on IOS XR?"` + product: `"IOS XR"`

---

### 2. `search_products`

Find and verify the correct Cisco product name before using `ask_cisco_documentation`.

**Parameters:**
| Parameter | Required | Description |
|-----------|----------|-------------|
| `query` | ✅ Yes | Product search string (supports fuzzy/partial match) |
| `limit` | Optional | Max results (default: 10, max: 50) |

**Use when:** Product reference is ambiguous — e.g. user says "Nexus" (could be 9000, 7000, Dashboard, Insights...) or "Catalyst" (many series).

---

### 3. `list_cisco_products`

Browse the Cisco product catalog with optional filtering.

**Parameters:**
| Parameter | Required | Description |
|-----------|----------|-------------|
| `category` | Optional | Keyword filter in product name (e.g. `"nexus"`, `"security"`, `"wireless"`) |
| `node_type` | Optional | `"series"` \| `"model"` \| `"solution"` \| `"productLine"` |
| `limit` | Optional | Max results (default: 20, max: 100) |

---

### 4. `list_categories`

List all Cisco product categories with product counts. No parameters needed.  
Use when user asks "what categories exist?" before filtering.

---

### 5. `list_technologies`

List Cisco technologies (protocols/standards like BGP, OSPF, IPSec, VPN).

**Parameters:**
| Parameter | Required | Description |
|-----------|----------|-------------|
| `category` | Optional | Filter by category (use `list_categories` for valid values) |
| `limit` | Optional | Max results (default: 20, max: 100) |

---

### 6. `health_check`

Verify the Cisco Docs AI service is operational. No parameters needed.

---

## Recommended Workflow

```
User question
    │
    ▼
Is the product name clear?
    ├─ No → search_products("query") → get correct name
    └─ Yes ↓
    ▼
ask_cisco_documentation(question, product, sessionId)
    │
    ▼
Follow-up question?
    └─ Yes → ask_cisco_documentation(follow-up, product, SAME sessionId)
```

---

## Response Format

Structure answers from this skill as:

1. **Direct answer** — lead with the answer from the documentation
2. **Config/command block** — include CLI examples or config snippets in code blocks
3. **Platform/version note** — specify which software version or platform the answer applies to
4. **Sources** — cite the document(s) returned by the tool

```
**Answer:**
[direct answer]

**Configuration Example:**
\`\`\`
[CLI or config snippet]
\`\`\`

**Platform:** IOS XR 7.x | ASR 9000 Series
**Source:** [Document Title] — [URL from tool response]
```

---

## Common Use Cases for This Project

Since this environment focuses on **IOS XR validation** (ASR 9000, Orange IMN/OINIS projects):

- Configuration verification: "Is this IOS XR config syntax correct for 25.2.2?"
- Feature support checks: "Is feature X supported on ASR 9000 with IOS XR 25.2.2?"
- Troubleshooting: "Why is BFD flapping on ASR 9000?"
- Test case reference: "What are the expected behaviors for IS-IS graceful restart on IOS XR?"
