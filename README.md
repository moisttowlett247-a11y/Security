# Synapse-XDR: Enterprise Cybersecurity Detection, Response & Identity Orchestration Platform

[![Zero-Trust Architecture](https://img.shields.io/badge/Zero-Trust-Security-emerald.svg)](https://github.com)
[![FastAPI](https://img.shields.io/badge/FastAPI-v0.110.0-teal.svg)](https://fastapi.tiangolo.com)
[![Python](https://img.shields.io/badge/Python-3.11%2B-blue.svg)](https://www.python.org)
[![Docker](https://img.shields.io/badge/OCI-Docker-blueviolet.svg)](https://www.docker.com)

---

## System Overview

**Synapse-XDR** is an ultra-sophisticated, highly resilient, enterprise-grade Cybersecurity Detection, Response, and Identity Orchestration System designed for zero-trust cloud environments. Built to process high-throughput telemetry at line-rate, Synapse-XDR unifies SIEM log aggregation, automated SOAR playbooks, EDR behavioral anomaly detection, and cryptographic identity oversight into a single cohesive platform.

### Architectural Highlights:
- **Asynchronous Event Loop Tuning (`uvloop`)**: Leverages `uvloop` as the core policy driver for `asyncio`, maximizing raw event-loop execution speeds and slashing API request latency.
- **State & Connection Pooling (`asyncpg`)**: Implements strict asynchronous connection pooling with timeout limits and zero memory leaks, replacing naive per-request socket allocations.
- **Threat De-Duplication Cache**: Employs an in-memory sliding-window cache (5-second window) to intercept and aggregate repetitive malicious indicators of compromise (IoCs) before database writes, preserving disk I/O.
- **Real-Time Bulk Ingestion (`asyncio.gather`)**: Supports concurrent telemetry batching with bounded task concurrency to maximize CPU utilization without memory exhaustion.
- **Zero-Knowledge Envelope Encryption**: Enforces AES-256-GCM data encryption keys (DEKs) wrapped by asymmetric RSA-4096 Key Encryption Keys (KEKs).
- **Zero-Trust JWT Verification**: Stateless RS256 token verification with granular RBAC scope checks and robust signature validation.

---

## Repository Structure Map

```text
synapse-xdr/
├── .github/
│   └── workflows/
│       ├── security-sast-dast.yml       # Automated vulnerability scanning & CVSS threshold gates
│       └── container-scan.yml           # Trivy container hardening & SBOM generation
├── configs/
│   └── ebpf/
│       └── xdp_dropper.c                # eBPF XDP kernel-level packet filtering C code
├── src/
│   ├── core/
│   │   ├── config.py                    # Pydantic v2 BaseSettings configuration management
│   │   ├── crypto_engine.py             # AES-256-GCM envelope encryption & RS256 JWT auth
│   │   └── main.py                      # Asynchronous FastAPI orchestrator with uvloop & asyncpg
│   └── utils/
│       └── simulator.py                 # Asynchronous high-performance threat telemetry blaster
├── index.html                           # Enterprise Cybersecurity Command Center Dashboard UI
├── app.js                               # Frontend async bridge, polling, and XSS sanitizer
├── init.sql                             # PostgreSQL 16+ production schema with B-Tree indexes
├── docker-compose.yml                   # Hardened multi-container OCI deployment spec
├── requirements.txt                     # Exact Python package dependency manifest
└── README.md                            # Enterprise deployment & architecture handbook
```

---

## Prerequisites

Ensure your host environment has the following installed and configured:
- **Docker Engine** (v26.0+) with BuildKit enabled
- **Docker Compose** (v2.25+)
- **Python** (v3.11+) for local testing and simulator execution
- **PostgreSQL 16+** (if running outside containerized orchestration)

---

## Deployment Orchestration Steps

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/enterprise/synapse-xdr.git
   cd synapse-xdr
   ```

2. **Configure Environment Variables:**
   Create a `.env` file in the root directory based on production defaults:
   ```bash
   cat << EOF > .env
   ENVIRONMENT=production
   DEBUG=false
   DATABASE_URL=postgresql+asyncpg://synapse_user:secure_password_99@postgres:5432/synapse_db
   REDIS_URL=redis://redis:6379/0
   JWT_SECRET_KEY=super_secure_jwt_secret_key_rotation_2026_xdr
   ANOMALY_THRESHOLD=0.85
   CVSS_BLOCK_THRESHOLD=7.0
   EOF
   ```

3. **Execute Docker Compose Orchestration:**
   Build and launch the containerized stack in detached mode with rootless user enforcement:
   ```bash
   docker-compose up --build -d
   ```

4. **Verify Container Health and Logs:**
   Inspect running containers and health checks:
   ```bash
   docker-compose ps
   docker-compose logs -f backend
   ```

---

## Verification & Testing Protocols

1. **Install Python Simulator Dependencies:**
   ```bash
   pip install httpx structlog pydantic
   ```

2. **Run the Threat Telemetry Simulator:**
   Blast simulated brute-force, SQL injection, ransomware, and DDoS payloads against the FastAPI ingestion endpoint:
   ```bash
   python3 src/simulator.py
   ```

3. **Access the Command Center Dashboard:**
   Open your browser and navigate to `http://localhost:8000` or open `index.html` to observe real-time log ingestion, active threat counters, and automated SOAR playbook triggers.
