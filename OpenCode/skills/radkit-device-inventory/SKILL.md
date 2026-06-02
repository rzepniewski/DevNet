---
name: radkit-device-inventory
description: Retrieve and manage device inventory for RADKit-accessible customer environments
export: false
---

# RADKit Device Inventory

You have the ability to retrieve, organize, and manage device inventory for customer environments accessible via RADKit.

## Purpose

This skill helps you quickly enumerate all devices in a customer's RADKit session, gather hardware/software details, and produce inventory reports for planning, documentation, and troubleshooting.

## Inventory Retrieval Workflow

1. Open RADKit session for the target SR
2. List all accessible devices
3. For each device, execute inventory commands
4. Aggregate into a structured inventory table

## Standard Inventory Commands

```bash
# IOS/IOS-XE
show version
show inventory
show ip interface brief
show running-config | include hostname

# IOS-XR
show version
show inventory
show ipv4 interface brief

# NX-OS
show version
show inventory
show interface brief
```

## Inventory Table Format

| Hostname | Platform | Serial | SW Version | Role | Management IP |
|---|---|---|---|---|---|
| R1 | ASR1001-X | FXS1234567 | 17.9.4a | WAN Edge | 10.0.0.1 |
| SW1 | C9300-48P | FOC9876543 | 17.12.1 | Access | 10.0.1.1 |

## Automation Script Pattern

```python
import radkit_client

session = radkit_client.Session(sr_number="<SR>")
devices = session.list_devices()

inventory = []
for device in devices:
    result = device.exec("show version")
    inventory.append(parse_show_version(result.output))

# Export to CSV
export_inventory(inventory, "customer_inventory.csv")
```

## Key Notes

- Always capture inventory at the start of any engagement — it's your baseline
- Serial numbers are required for RMA requests
- Flag end-of-life platforms and software versions
- Note devices not responding to inventory commands (may be unreachable via RADKit)
