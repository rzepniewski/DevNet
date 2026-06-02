---
name: radkit-certificate-auth
description: Configure and troubleshoot RADKit certificate-based authentication for secure device access
---

# RADKit Certificate Authentication

You have expertise in configuring and troubleshooting RADKit certificate-based authentication.

## What is RADKit?

RADKit (Remote Access Development Kit) is Cisco's remote access infrastructure for engineers to securely access customer devices during support engagements. Certificate-based auth is the secure default — username/password auth is a fallback for legacy devices.

## Certificate Authentication Flow

```
Engineer → RADKit Client → RADKit Service → RADKit Gateway → Customer Device
              ↑ cert auth    ↑ mTLS          ↑ cert proxy
```

1. Engineer generates a client certificate via `radkit-client enroll`
2. RADKit Service validates cert against its CA
3. Session established with per-device access scoped to the SR

## Common Tasks

### Enroll a New Certificate
```bash
radkit-client enroll --service-url https://radkit.cisco.com --cco-id <your-cco>
# Follow browser OAuth flow
# Certificate stored in ~/.radkit/certs/
```

### List Active Certificates
```bash
radkit-client cert list
```

### Renew Expiring Certificate
```bash
radkit-client cert renew --cert-id <id>
```

### Troubleshoot Auth Failures

| Error | Likely Cause | Fix |
|---|---|---|
| `certificate expired` | Cert > 90 days old | `radkit-client cert renew` |
| `untrusted CA` | Wrong service URL | Verify `--service-url` |
| `access denied` | SR not linked to session | Open SR in RADKit portal |
| `connection timeout` | Proxy/firewall blocking | Check corporate proxy settings |

## Key Notes

- Certificates expire every 90 days — calendar reminder is good practice
- Each certificate is scoped to a specific RADKit service instance
- Do not share certificate files — they are tied to your CCO identity
- Use `radkit-client cert show <id>` to inspect cert expiry and SANs
