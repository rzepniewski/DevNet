---
name: webex-calendar
description: Interact with Webex calendar, meetings, and scheduling via Webex APIs
---

# Webex Calendar

You help users interact with their Webex calendar and meetings using the Webex REST API. You can list upcoming meetings, create meeting invites, check availability, and manage scheduling.

## Authentication

Webex API requires a Personal Access Token or OAuth token. The user should have `WEBEX_TOKEN` set as an environment variable, or provide it explicitly.

```bash
export WEBEX_TOKEN="your-token-here"
```

Base URL: `https://webexapis.com/v1/`

## Key Endpoints

### List Meetings
```bash
curl -X GET "https://webexapis.com/v1/meetings?max=10&upcomingOrOngoing=true" \
  -H "Authorization: Bearer $WEBEX_TOKEN"
```

### Get Meeting Details
```bash
curl -X GET "https://webexapis.com/v1/meetings/{meetingId}" \
  -H "Authorization: Bearer $WEBEX_TOKEN"
```

### Create a Meeting
```bash
curl -X POST "https://webexapis.com/v1/meetings" \
  -H "Authorization: Bearer $WEBEX_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Meeting Title",
    "start": "2024-01-15T10:00:00-08:00",
    "end": "2024-01-15T11:00:00-08:00",
    "invitees": [{"email": "person@cisco.com"}],
    "agenda": "Agenda text here"
  }'
```

### List Meeting Participants
```bash
curl -X GET "https://webexapis.com/v1/meetingInvitees?meetingId={id}" \
  -H "Authorization: Bearer $WEBEX_TOKEN"
```

## Common Tasks

**Show upcoming meetings today:**
Filter meetings where `start` is today's date. Format as a clean schedule:
```
09:00 - 10:00  Weekly Standup (ID: abc123)
14:00 - 15:00  Design Review (ID: def456)
```

**Find free time slots:**
Fetch meetings for a day, then compute gaps between them. Suggest available 30/60 min windows.

**Cancel a meeting:**
```bash
curl -X DELETE "https://webexapis.com/v1/meetings/{meetingId}" \
  -H "Authorization: Bearer $WEBEX_TOKEN"
```

## Timezone Handling

Always ask the user their timezone if not set. Webex returns UTC; convert to local time for display. Use `TZ` environment variable if available.

## Output Format

Present calendars as clean text tables:
```
Date: Monday, January 15, 2024
────────────────────────────────
09:00  Weekly Standup         [30 min]
       with: alice@cisco.com, bob@cisco.com
10:30  (free)
14:00  Design Review          [60 min]
       https://cisco.webex.com/meet/xyz
────────────────────────────────
```
