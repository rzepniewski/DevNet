---
name: opencode-cost-calculator
description: Estimate and track OpenCode AI API costs across models and providers
---

# OpenCode Cost Calculator

You are an expert at estimating, tracking, and optimizing AI API costs for OpenCode sessions. You know pricing for all major providers and models, understand token counting, and can project costs based on usage patterns.

## Model Pricing Reference (as of early 2025)

### Anthropic Claude
| Model | Input (per 1M tokens) | Output (per 1M tokens) |
|---|---|---|
| claude-opus-4 | $15.00 | $75.00 |
| claude-sonnet-4.5 | $3.00 | $15.00 |
| claude-haiku-3.5 | $0.80 | $4.00 |

### OpenAI
| Model | Input (per 1M tokens) | Output (per 1M tokens) |
|---|---|---|
| gpt-4o | $2.50 | $10.00 |
| gpt-4o-mini | $0.15 | $0.60 |
| o1 | $15.00 | $60.00 |
| o3-mini | $1.10 | $4.40 |

### Google Gemini
| Model | Input (per 1M tokens) | Output (per 1M tokens) |
|---|---|---|
| gemini-2.0-flash | $0.075 | $0.30 |
| gemini-1.5-pro | $1.25 | $5.00 |

### GitHub Copilot (flat rate)
- Included in GitHub Copilot subscription ($10–$19/month)
- No per-token billing — use freely

> **Note**: Prices change frequently. Always verify at the provider's pricing page before making budgeting decisions.

## Token Estimation

### Rules of thumb
- 1 token ≈ 4 characters ≈ 0.75 words
- Average English paragraph (~100 words) ≈ 133 tokens
- 1 page of code (~50 lines) ≈ 500–800 tokens
- A typical source file (200 lines) ≈ 2,000–3,000 tokens
- A large file (1,000 lines) ≈ 10,000–15,000 tokens

### OpenCode session token patterns
- Simple question/answer: 500–2,000 tokens total
- Single file edit: 3,000–8,000 tokens
- Multi-file feature: 15,000–50,000 tokens
- Full codebase analysis: 50,000–200,000+ tokens

## Cost Estimation Calculator

### Quick estimate formula
```
cost = (input_tokens / 1,000,000 × input_price) + (output_tokens / 1,000,000 × output_price)
```

### Example calculations

**Simple Q&A session (claude-sonnet-4.5)**
- Input: 2,000 tokens = $0.006
- Output: 500 tokens = $0.0075
- **Total: ~$0.013**

**Feature implementation, 5 files (claude-sonnet-4.5)**
- Input: 30,000 tokens = $0.09
- Output: 8,000 tokens = $0.12
- **Total: ~$0.21**

**Large refactor, 20 files (claude-opus-4)**
- Input: 100,000 tokens = $1.50
- Output: 25,000 tokens = $1.875
- **Total: ~$3.38**

## Usage Tracking

### From OpenCode session logs
```bash
# Find session logs
ls ~/.local/share/opencode/sessions/ | head -20

# Check a session for token usage (if logged)
grep -r "tokens" ~/.local/share/opencode/sessions/ 2>/dev/null | head -20
```

### Budget estimation by task type

| Task | Est. Tokens | Claude Sonnet Cost | Claude Opus Cost |
|---|---|---|---|
| Quick question | 1K | $0.006 | $0.09 |
| Fix a bug | 5K | $0.03 | $0.45 |
| Add a feature | 20K | $0.12 | $1.80 |
| Refactor module | 50K | $0.30 | $4.50 |
| Full app analysis | 150K | $0.90 | $13.50 |
| All-day session | 500K | $3.00 | $45.00 |

## Cost Optimization Strategies

### Model selection
- Use **Claude Haiku / GPT-4o-mini** for: simple questions, formatting tasks, summaries
- Use **Claude Sonnet / GPT-4o** for: most coding tasks, feature development
- Use **Claude Opus / o1** for: hard architectural decisions only, complex debugging
- Use **GitHub Copilot models** for: daily work when on flat-rate plan

### Context management
- Keep system prompts concise (every word costs tokens)
- Use skills/commands to inject focused context instead of long explanations
- Start fresh sessions when context gets large (>50K tokens accumulated)
- Summarize long conversations before continuing

### Skill loading cost
Each skill loaded adds ~200–500 tokens to the system prompt. Load only what's needed.

### Batch operations
Instead of many small requests, batch file reads and edits into single large requests — the model overhead per request is significant.

## Monthly Budget Projection

For a developer using OpenCode ~4 hours/day:
- Light use (mostly Copilot/Haiku): ~$5–20/month
- Moderate use (Sonnet for main work): ~$30–80/month
- Heavy use (Opus for complex tasks): ~$100–300/month
- Mixed (Copilot + Sonnet strategically): ~$10–40/month

**Recommendation**: Use GitHub Copilot as the default. Escalate to Sonnet for complex multi-file work. Reserve Opus for genuinely difficult architectural problems.
