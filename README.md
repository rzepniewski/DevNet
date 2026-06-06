# DevNet

Personal workspace for networking, automation, cloud, and home-lab projects.
Each top-level folder is an independent project or experiment.

## Repository structure

```
DevNet/
├── .gitignore                              # Workspace-wide ignore rules (covers all subfolders)
├── .gitmodules                             # Git submodule definitions
├── PYTHON_VENV_GUIDE.md                    # Reference: Python venv, pip, pipx, troubleshooting
├── README.md                               # This file
│
├── _shared/                                # Shared utilities and notebooks
│   ├── ips generator/                      # IPv4/IPv6 address generators (Jupyter)
│   ├── scripts/                            # Misc Python scripts & notebooks
│   └── time_analysis/                      # Time-series analysis notebooks
│
├── aws-cloudformation/                     # AWS CloudFormation templates collection
│   ├── arch/                               # Architecture notes / diagrams
│   └── templates-main/                     # Service-specific CF templates (EC2, EKS, RDS, ...)
│
├── car-dashboard/             [submodule]  # Raspberry Pi car dashboard (OBD-II + Grafana + InfluxDB)
│   ├── app/                                # Python backend (FastAPI/Flask app)
│   ├── grafana/                            # Dashboards & provisioning
│   ├── install/                            # System setup scripts (Wi-Fi AP, shutdown, ...)
│   ├── systemd/                            # systemd unit files
│   └── web/                                # Frontend assets
│
├── ClaudeCode/                             # Claude Code CLI experiments
│
├── deckcraft/                              # DeckCraft project
│
├── github-pages/                           # GitHub Pages site experiments
│
├── iosxr_telemetry_stack_in_docker-master/ # Cisco IOS-XR telemetry stack (Docker)
│
├── JupyterLab/                             # JupyterLab Docker setup
│
├── OpenCloud/                              # OpenCloud self-hosted suite
│
├── OpenCode/                               # OpenCode tool & skills
│
├── Python-Jupyter/                         # Python + Jupyter Docker images
│
├── routinator/                             # NLnet Labs Routinator (RPKI validator) in Docker
│
├── SSHServer/                 [submodule]  # Ubuntu SSH server Docker setup
│
├── Telemetry-ML/                           # Telemetry data + ML experiments
│
└── virtualenv-test-project/                # Sandbox for testing virtualenv setups
```

## Submodules

This repo contains two Git submodules (own repos nested inside):

| Path | Repository |
|---|---|
| `car-dashboard/` | https://github.com/rzepniewski/car-dashboard |
| `Ubuntu-SSHServer/docker/Ubuntu-SSHServer-2/` | https://github.com/rzepniewski/Ubuntu-SSHServer |

Clone with submodules:

```bash
git clone --recurse-submodules https://github.com/rzepniewski/DevNet.git
```

Pull submodule updates later:

```bash
git submodule update --remote --merge
```

## Conventions

- **Python projects** use per-project virtual environments in `.venv/` (ignored by Git).
- **Docker** is used wherever possible to keep host system clean.
- **Secrets** (`.env`, keys, certs) are ignored globally — never commit them.
- See [PYTHON_VENV_GUIDE.md](PYTHON_VENV_GUIDE.md) for the Python environment workflow.

## Quick start (Python project)

```bash
cd <project-folder>
python3 -m venv .venv
source .venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt    # if present
```



