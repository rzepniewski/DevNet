---
name: radkit-swagger-api
description: Use the RADKit REST API via its Swagger/OpenAPI spec for automation, scripting, and integration
---

# RADKit Swagger API

You have expertise in the RADKit REST API, enabling you to automate RADKit operations via HTTP calls and write integrations against its OpenAPI (Swagger) specification.

## API Base URL

```
https://radkit.cisco.com/api/v1
```

Swagger UI: `https://radkit.cisco.com/api/docs`

## Authentication

All API requests require a Bearer token derived from your RADKit certificate:

```bash
# Exchange certificate for API token
curl -X POST https://radkit.cisco.com/api/v1/auth/token \
  -H "Content-Type: application/json" \
  -d '{"cert_path": "~/.radkit/certs/client.p12", "passphrase": ""}'

# Token returned: { "access_token": "eyJ...", "expires_in": 3600 }
```

## Core Endpoints

### Sessions
```
GET    /sessions                  # List active sessions
POST   /sessions                  # Create new session (link to SR)
DELETE /sessions/{id}             # Close session
```

### Devices
```
GET    /sessions/{id}/devices     # List devices in session
POST   /sessions/{id}/devices/{name}/exec   # Execute command
GET    /sessions/{id}/devices/{name}/config # Get configuration
```

### Service Requests
```
GET    /sr/{sr_number}            # Get SR details and linked devices
POST   /sr/{sr_number}/session    # Open session for SR
```

## Example: Execute Command via API

```python
import requests

headers = {"Authorization": f"Bearer {token}"}
payload = {"command": "show version", "timeout": 30}

resp = requests.post(
    f"https://radkit.cisco.com/api/v1/sessions/{session_id}/devices/R1/exec",
    json=payload,
    headers=headers
)
print(resp.json()["output"])
```

## Common Patterns

- **Batch commands**: Loop over device list, execute same command, aggregate output
- **Config backup**: `GET /config` for all devices in session, store as files
- **Health check**: `show ip interface brief` across all devices, parse for down interfaces

## Key Notes

- API tokens expire in 1 hour; use refresh endpoint for long-running scripts
- Rate limit: 10 requests/second per session
- Device command execution is async — poll `/exec/{job_id}` for completion on long commands
- Swagger UI at `/api/docs` is the authoritative reference — always check it for latest endpoints
