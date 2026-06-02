---
name: radkit-grant-access
description: Grant RADKit access to customer devices for specific SRs and engineers following internal approval process
export: false
---

# RADKit Grant Access

You have expertise in granting RADKit remote access to customer devices for support engineers, following Cisco's internal access control and approval processes.

## Access Model

RADKit access is SR-scoped and engineer-specific:
- Access is tied to a specific Service Request number
- Only engineers listed in the SR team can access linked devices
- Access expires when the SR is closed or access is explicitly revoked
- Customer must have consented to remote access (tracked in SR notes)

## Grant Access Workflow

### Step 1: Verify Prerequisites
- [ ] SR is open and active
- [ ] Customer consent documented in SR (or on-call confirmation obtained)
- [ ] Requesting engineer has active RADKit certificate
- [ ] Devices are listed in the customer's RADKit inventory

### Step 2: Add Engineer to SR Team
```
In CS One / ServiceNow:
1. Open SR → Team Members section
2. Add engineer by CCO ID
3. Select role: "Collaborator" or "Technical Lead"
```

### Step 3: Link Devices to SR
```bash
# Via RADKit Portal (https://radkit.cisco.com)
# SR Management → Link Devices → Select from customer inventory

# Via API
curl -X POST https://radkit.cisco.com/api/v1/sr/{sr_number}/devices \
  -H "Authorization: Bearer {token}" \
  -d '{"device_names": ["R1", "R2", "SW1"]}'
```

### Step 4: Notify Engineer
Send engineer:
- SR number
- RADKit service URL
- Command: `radkit-client session open --sr {SR_NUMBER}`

## Access Revocation

```bash
# Revoke specific engineer access
radkit-client access revoke --sr {SR} --cco-id {engineer_cco}

# Revoke all access (SR closure)
radkit-client access revoke-all --sr {SR}
```

## Audit Log

All RADKit access grants and device interactions are logged and auditable. Access the audit log at:
`https://radkit.cisco.com/portal/sr/{sr_number}/audit`

## Key Notes

- Never grant access to engineers not on the SR — even for "quick looks"
- Document all access grants and revocations in SR notes
- Verify customer consent is recorded before each session
- Access grants auto-expire 48h after SR closure
