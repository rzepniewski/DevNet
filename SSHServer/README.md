# Ubuntu SSH Server — Project Guide

## Overview

Unified Docker project that runs multiple Ubuntu SSH server instances from a single
Dockerfile. Supports both **SSH key** and **password** authentication modes.

## Project Structure

```
Ubuntu-SSHServer/
├── Dockerfile           # Parameterized — accepts USERNAME, USER_PASS, LOGIN_MODE
├── docker-compose.yml   # Defines 3 service instances (ssh-1, ssh-2, ssh-3)
├── .env                 # Instance configuration (ports, usernames, auth mode)
├── shared/
│   └── id_ed25519.pub   # SSH public key for key-based auth
└── .backup/             # Archived originals
```

## Instance Configuration (.env)

| Instance | Service | Port  | User      | Auth     |
|----------|---------|-------|-----------|----------|
| ssh-1    | ssh-1   | 2201  | przepnie  | key      |
| ssh-2    | ssh-2   | 2202  | przepnie  | key      |
| ssh-3    | ssh-3   | 2203  | przepnie  | password |

Edit `.env` to change usernames, passwords, ports, or hostnames.

## Quick Start

```bash
cd ~/DevNet/docker/Ubuntu-SSHServer

# Build and start all instances
docker compose up -d --build

# Start a single instance
docker compose up -d ssh-1

# Connect
ssh -p 2201 przepnie@localhost   # key auth
ssh -p 2202 przepnie@localhost   # key auth
ssh -p 2203 przepnie@localhost   # password auth
```

# To set the project name to 'myproject' use:
# docker compose -p myproject up -d.

## Common Commands

### Lifecycle

```bash
# Stop all containers
docker compose down

# Stop and remove volumes (wipes home directories)
docker compose down -v

# Restart a single instance
docker compose restart ssh-1

# Rebuild after Dockerfile changes
docker compose up -d --build

# Rebuild a single instance without cache
docker compose build --no-cache ssh-2
```

### Monitoring

```bash
# List running containers
docker compose ps

# View logs (all / single)
docker compose logs -f
docker compose logs -f ssh-1

# Check container health
docker inspect --format='{{.State.Health.Status}}' ssh-1

# Resource usage
docker stats ssh-1 ssh-2 ssh-3
```

### Debugging

```bash
# Shell into a running container
docker compose exec ssh-1 bash

# Check SSH config inside container
docker compose exec ssh-1 cat /etc/ssh/sshd_config | grep -E 'Password|Root|Pubkey'

# Test SSH connectivity
ssh -v -p 2201 przepnie@localhost

# Check if sshd is listening
docker compose exec ssh-1 ss -tlnp | grep 22
```

### Volume Management

```bash
# List volumes
docker volume ls | grep ssh

# Inspect a volume
docker volume inspect ubuntu-sshserver_ssh1-home

# Backup a home directory
docker compose exec ssh-1 tar czf /tmp/home-backup.tar.gz -C /home przepnie
docker compose cp ssh-1:/tmp/home-backup.tar.gz ./home-backup.tar.gz
```

## Auth Modes

### Key-based (LOGIN_MODE=key)

- Copies `shared/id_ed25519.pub` into the container as `authorized_keys`
- Password authentication disabled in sshd_config
- To use a different key, replace `shared/id_ed25519.pub`

### Password-based (LOGIN_MODE=password)

- Sets user password from the `USER_PASS` build arg
- Password authentication enabled in sshd_config
- SSH key directory is created but left empty

## Adding a New Instance

1. Add variables to `.env`:
   ```
   SSH4_CONTAINER_NAME=ssh-4
   SSH4_HOSTNAME=ubuntu-ssh-4
   SSH4_USERNAME=newuser
   SSH4_USER_PASS=SecurePass
   SSH4_LOGIN_MODE=password
   SSH4_HOST_PORT=2204
   ```

2. Add a service block to `docker-compose.yml`:
   ```yaml
   ssh-4:
     build:
       context: .
       dockerfile: Dockerfile
       args:
         USERNAME: ${SSH4_USERNAME}
         USER_PASS: ${SSH4_USER_PASS}
         LOGIN_MODE: ${SSH4_LOGIN_MODE}
     container_name: ${SSH4_CONTAINER_NAME}
     hostname: ${SSH4_HOSTNAME}
     ports:
       - "${SSH4_HOST_PORT}:22"
     volumes:
       - ssh4-home:/home/${SSH4_USERNAME}
     restart: unless-stopped
   ```

3. Add the volume to the `volumes:` section:
   ```yaml
   ssh4-home:
   ```

4. Build and start:
   ```bash
   docker compose up -d --build ssh-4
   ```
