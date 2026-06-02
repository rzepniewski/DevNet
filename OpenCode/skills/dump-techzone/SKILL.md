---
name: dump-techzone
description: Interact with and dump Cisco TechZone lab reservation data, environment details, and topology information
---

# Cisco TechZone Dump

You have the ability to interact with Cisco TechZone (dCloud/TechZone) to retrieve, dump, and analyze lab reservations and environment data.

## Capabilities

When this skill is active, you can:
- List active and upcoming TechZone lab reservations
- Dump environment details: topology, devices, IP addresses, credentials
- Extract reservation metadata: ID, name, status, owner, start/end dates, datacenter
- Identify available labs for a given product or technology
- Export reservation data for documentation or handoff
- Summarize environment topology for documentation purposes

## Reservation Record Format

Standard TechZone dump output:
```
Reservation ID: <id>
Name: <lab name>
Status: <active|scheduled|expired>
Owner: <email>
Datacenter: <rtp|sjc|lon|...>
Start: <datetime>
End: <datetime>
URL: <access URL>
Devices:
  - <hostname>: <IP> (<role>)
Credentials:
  - <service>: <username> / <password or refer to lab guide>
```

## Workflow

1. Ask user for their TechZone username or reservation ID
2. Retrieve reservation list or specific reservation details
3. Present topology and access information clearly
4. Offer to export as markdown for lab documentation

## Key Notes

- Never store or log credentials in permanent memory
- Always note expiration time to prompt reservation extension if needed
- When dumping topology, draw ASCII diagram if device count is small (≤8 devices)
- Flag reservations expiring within 24 hours
