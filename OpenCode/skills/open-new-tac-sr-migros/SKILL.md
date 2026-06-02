---
name: open-new-tac-sr-migros
description: Open new TAC service requests for Migros customer engagements following internal process
export: false
---

# Open New TAC SR — Migros

You have expertise in opening new Cisco TAC Service Requests for the Migros customer account, following internal escalation and documentation processes.

## Customer Context

**Customer**: Migros (Swiss retail cooperative)  
**Account Team**: [Internal — do not expose externally]  
**Contract Level**: Premium (4-hour SLA for Sev 1/2)  
**Primary Contact**: [Refer to internal CRM]

## SR Opening Checklist

Before opening a new SR, confirm:
- [ ] Issue is reproducible (or has clear impact statement)
- [ ] Basic troubleshooting already performed (show commands gathered)
- [ ] Correct product and software version identified
- [ ] Customer impact clearly articulated (how many users/sites affected)

## SR Template

```
Title: [Product] - [Brief symptom] - [Customer impact]
Example: "Catalyst 9300 - Port flapping on uplink - 200 users affected, 2 access switches"

Severity: 
  Sev 1 = Complete outage, no workaround
  Sev 2 = Severe degradation, partial workaround
  Sev 3 = Partial outage, workaround exists
  Sev 4 = Question / minor issue

Product: <exact product name from CCO>
SW Version: <exact version string>

Problem Description:
- Environment: <topology overview>
- Symptom: <what is happening>
- Expected behavior: <what should happen>
- Impact: <business impact>
- Reproducible: <yes/no/intermittent>

Troubleshooting Done:
- <step 1>
- <step 2>

Attachments:
- show tech-support (always include for Sev 1/2)
- Relevant logs
- Topology diagram
```

## Internal Notes

- Always CC the account SE when opening Sev 1/2 for Migros
- Check if a related CDETS exists before opening — attach if found
- Update SR within 2 hours of customer contact
- Escalate to duty manager if Sev 1 is not acknowledged within 30 min

## RADKit Access

To access Migros devices via RADKit, open the SR first, then:
```bash
radkit-client session open --sr <SR_NUMBER>
```
