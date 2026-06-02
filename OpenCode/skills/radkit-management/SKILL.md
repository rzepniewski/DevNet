---
name: radkit-management
description: Manage RADKit infrastructure, users, and policies for the team's remote access operations
export: false
---

# RADKit Management

You have expertise in managing RADKit infrastructure, user accounts, device inventories, and access policies for the team's remote support operations.

## Administrative Areas

### User Management
- Provision/deprovision engineer accounts
- Manage certificate enrollment and renewal
- Assign roles: engineer, team lead, admin
- Monitor certificate expiration across the team

### Device Inventory Management
- Onboard new customer device inventories
- Update device credentials and SSH keys
- Remove decommissioned devices
- Validate connectivity for all inventory items

### Policy Management
- Configure SR-based access control policies
- Set session duration limits
- Enable/disable command logging per customer
- Manage allowed command lists for restricted access

## Common Admin Tasks

### Check Certificate Expiry Across Team
```bash
radkit-admin cert list --all-users --format table
# Flag certs expiring within 14 days
```

### Audit Active Sessions
```bash
radkit-admin session list --active --format json | jq '.[] | {user, sr, devices, start_time}'
```

### Force-Close Stale Session
```bash
radkit-admin session close --session-id {id} --reason "SR closed"
```

### Add Customer Device Inventory
```bash
radkit-admin inventory add \
  --customer "Acme Corp" \
  --gateway acme-radkit.cisco.com \
  --inventory-file acme_devices.yaml
```

## Team Health Dashboard

Key metrics to monitor:
- Certificates expiring in < 14 days: aim for 0
- Active sessions with no activity > 4h: investigate
- Failed auth attempts in last 24h: investigate > 5 per user
- Inventory devices unreachable: follow up with customer

## Key Notes

- Admin actions are fully audited — all changes logged with admin CCO and timestamp
- Bulk user operations should be staged in a test environment first
- Customer inventory files are confidential — do not commit to public repos
- Escalate persistent gateway connectivity issues to RADKit infrastructure team (radkit-infra@cisco.com)
