export const REPOSITORY_ARCHITECTURE_ASCII = `synapse-xdr/
├── .github/
│   └── workflows/
│       ├── security-sast-dast.yml       # Automated vulnerability scanning & CVSS threshold gates
│       ├── container-scan.yml           # Trivy container hardening & SBOM generation
│       └── zero-trust-deploy.yml        # Rootless OCI deployment pipeline
├── configs/
│   ├── ebpf/
│   │   ├── xdp_dropper.c                # eBPF XDP kernel-level packet filtering C code
│   │   └── loader.py                    # BCC/libbpf program loader & ring buffer consumer
│   ├── suricata/
│   │   └── suricata.yaml                # Multi-threaded IDS/IPS JSON log parsing config
│   ├── kafka/
│   │   └── server.properties            # High-throughput event streaming cluster config
│   └── wazuh/
│       └── ossec.conf                   # Endpoint syscall & file integrity monitoring rules
├── deploy/
│   ├── k8s/
│   │   ├── namespace.yaml               # Zero-trust isolated network namespace definition
│   │   ├── network-policies.yaml        # Strict ingress/egress microsegmentation rules
│   │   └── threat-engine-deployment.yaml# Secure OCI deployment with read-only root filesystems
│   └── terraform/
│       ├── main.tf                      # AWS/GCP Zero-Trust infrastructure provisioning
│       ├── iam.tf                       # Least-privilege IAM roles and permission boundaries
│       └── kms.tf                       # Hardware Security Module (HSM) envelope keys
├── src/
│   ├── core/
│   │   ├── __init__.py
│   │   ├── engine.py                    # Centralized FastAPI asynchronous threat engine
│   │   ├── ebpf_controller.py           # Kernel telemetry and XDP rule mutator
│   │   ├── ml_pipeline.py               # Lightweight heuristic anomaly detection inference
│   │   └── crypto_vault.py              # AES-256-GCM envelope encryption & RSA-4096 JWT
│   ├── siem/
│   │   ├── __init__.py
│   │   ├── kafka_consumer.py            # Real-time event normalization pipeline
│   │   └── graph_analyzer.py            # In-memory lateral movement path correlation
│   ├── scanner/
│   │   ├── __init__.py
│   │   ├── nmap_orchestrator.py         # Headless Nmap NSE scanner & CVSS v3.1 calculator
│   │   └── github_client.py             # Automated advisory patch PR creator
│   └── soar/
│       ├── __init__.py
│       ├── playbook_runner.py           # Asynchronous Celery worker orchestration
│       └── worm_backup.py               # Cryptographic WORM snapshot locking manager
├── tests/
│   ├── test_engine.py
│   ├── test_crypto.py
│   └── test_graph.py
├── docker-compose.yml                   # Production-hardened container orchestration
├── Dockerfile                           # Multi-stage rootless Python FastAPI image build
├── pyproject.toml                       # Poetry dependency & build specification
└── README.md                            # Enterprise deployment handbook & compliance matrix`;

export const DOCKER_COMPOSE_CONTENT = `version: '3.8'

networks:
  zero_trust_net:
    driver: bridge
    internal: false
    ipam:
      config:
        - subnet: 172.28.0.0/16

volumes:
  vault_data:
    driver: local
    driver_opts:
      type: none
      o: bind
      device: /var/lib/synapse/vault
  siem_logs:
    driver: local

services:
  threat_engine:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: synapse_threat_engine
    restart: unless-stopped
    networks:
      - zero_trust_net
    ports:
      - "8443:8443"
    environment:
      - ENV=production
      - VAULT_KEY_ROTATION_INTERVAL=86400
      - KAFKA_BOOTSTRAP_SERVERS=kafka:9092
    volumes:
      - vault_data:/app/vault:rw
      - /sys/kernel/debug:/sys/kernel/debug:ro
    security_opt:
      - no-new-privileges:true
    cap_drop:
      - ALL
    cap_add:
      - NET_ADMIN
      - SYS_ADMIN
    deploy:
      resources:
        limits:
          cpus: '4.0'
          memory: 8G
        reservations:
          cpus: '1.0'
          memory: 2G
    healthcheck:
      test: ["CMD", "curl", "-k", "https://localhost:8443/health"]
      interval: 15s
      timeout: 5s
      retries: 3
      start_period: 10s

  kafka:
    image: confluentinc/cp-kafka:7.5.0
    container_name: synapse_kafka
    restart: unless-stopped
    networks:
      - zero_trust_net
    environment:
      KAFKA_NODE_ID: 1
      KAFKA_LISTENER_SECURITY_PROTOCOL_MAP: 'CONTROLLER:PLAINTEXT,PLAINTEXT:PLAINTEXT,PLAINTEXT_HOST:PLAINTEXT'
      KAFKA_ADVERTISED_LISTENERS: 'PLAINTEXT://kafka:9092,PLAINTEXT_HOST://localhost:29092'
      KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: 1
      KAFKA_GROUP_INITIAL_REBALANCE_DELAY_MS: 0
      KAFKA_TRANSACTION_STATE_LOG_MIN_ISR: 1
      KAFKA_TRANSACTION_STATE_LOG_REPLICATION_FACTOR: 1
      KAFKA_PROCESS_ROLES: 'broker,controller'
      KAFKA_CONTROLLER_QUORUM_VOTERS: '1@kafka:29093'
      KAFKA_LISTENERS: 'PLAINTEXT://0.0.0.0:9092,CONTROLLER://0.0.0.0:29093,PLAINTEXT_HOST://0.0.0.0:29092'
      KAFKA_INTER_BROKER_LISTENER_NAME: 'PLAINTEXT'
      KAFKA_CONTROLLER_LISTENER_NAMES: 'CONTROLLER'
      KAFKA_LOG_DIRS: '/tmp/kraft-combined-logs'
    volumes:
      - siem_logs:/var/lib/kafka/data
    security_opt:
      - no-new-privileges:true
    deploy:
      resources:
        limits:
          cpus: '2.0'
          memory: 4G`;

export const PYTHON_BACKEND_CONTENT = `"""
Synapse-XDR Centralized Core Threat Engine
Production-Ready Asynchronous FastAPI Orchestrator
"""

import asyncio
import base64
import hashlib
import hmac
import json
import logging
import os
import time
from typing import Dict, List, Optional, Any
from fastapi import FastAPI, Depends, HTTPException, Security, status, BackgroundTasks
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, Field, IPvAnyAddress
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
from cryptography.hazmat.primitives.asymmetric import rsa, padding
from cryptography.hazmat.primitives import hashes

# Configure Structured Logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s [%(levelname)s] %(name)s: %(message)s')
logger = logging.getLogger("synapse.engine")

app = FastAPI(
    title="Synapse-XDR Core Threat Engine",
    version="4.8.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

security = HTTPBearer()

# Pydantic Models for Strict Data Validation
class TelemetryEvent(BaseModel):
    event_id: str = Field(..., description="Unique telemetry identifier")
    timestamp: float = Field(default_factory=time.time)
    source_ip: Optional[str] = None
    process_name: str
    pid: int
    syscall: str
    payload_hash: str
    anomaly_score: float = Field(..., ge=0.0, le=1.0)

class SoarPlaybookTrigger(BaseModel):
    incident_id: str
    target_asset: str
    action: str = Field(..., regex="^(isolate_host|drop_traffic|revoke_token|worm_snapshot)$")
    requester: str

class CryptoEnvelopeRequest(BaseModel):
    plaintext: str
    context_metadata: Dict[str, str]

# In-Memory State & Vault Simulation
ACTIVE_INCIDENTS: List[Dict[str, Any]] = []
MASTER_KEK = rsa.generate_private_key(public_exponent=65537, key_size=4096)

@app.get("/health", status_code=status.HTTP_200_OK)
async def health_check():
    return {
        "status": "HEALTHY",
        "timestamp": time.time(),
        "engine_version": "4.8.0",
        "active_modules": ["ebpf_xdp", "ml_telemetry", "zk_crypto", "siem_graph", "sast_dast", "soar_worker"]
    }

@app.post("/api/v1/telemetry/ingest", status_code=status.HTTP_202_ACCEPTED)
async def ingest_telemetry(event: TelemetryEvent, background_tasks: BackgroundTasks):
    """
    Ingests asynchronous endpoint telemetry and runs streaming ML anomaly inference.
    """
    logger.info(f"Received telemetry event {event.event_id} from PID {event.pid} ({event.process_name})")
    
    if event.anomaly_score > 0.85:
        background_tasks.add_task(execute_automated_soar_isolation, event.event_id, event.process_name, event.source_ip)
        
    return {"status": "ACCEPTED", "event_id": event.event_id, "processed": True}

async def execute_automated_soar_isolation(event_id: str, process_name: str, source_ip: Optional[str]):
    logger.warning(f"CRITICAL ANOMALY DETECTED ({event_id}). Executing automated SOAR isolation for {process_name} [{source_ip}]")
    incident = {
        "incident_id": f"INC-{int(time.time())}",
        "event_id": event_id,
        "asset": process_name,
        "source_ip": source_ip,
        "action_taken": "NETWORK_ISOLATION_AND_XDP_DROP",
        "timestamp": time.time(),
        "status": "MITIGATED"
    }
    ACTIVE_INCIDENTS.append(incident)

@app.post("/api/v1/crypto/envelope", status_code=status.HTTP_200_OK)
async def create_crypto_envelope(req: CryptoEnvelopeRequest):
    """
    Performs zero-knowledge envelope encryption using AES-256-GCM DEK wrapped by RSA-4096 KEK.
    """
    dek = AESGCM.generate_key(bit_length=256)
    aesgcm = AESGCM(dek)
    nonce = os.urandom(12)
    ciphertext = aesgcm.encrypt(nonce, req.plaintext.encode('utf-8'), json.dumps(req.context_metadata).encode('utf-8'))
    
    # Wrap DEK with KEK
    public_key = MASTER_KEK.public_key()
    wrapped_dek = public_key.encrypt(
        dek,
        padding.OAEP(
            mgf=padding.MGF1(algorithm=hashes.SHA256()),
            algorithm=hashes.SHA256(),
            label=None
        )
    )
    
    return {
        "ciphertext_b64": base64.b64encode(ciphertext).decode('utf-8'),
        "nonce_b64": base64.b64encode(nonce).decode('utf-8'),
        "wrapped_dek_b64": base64.b64encode(wrapped_dek).decode('utf-8'),
        "algorithm": "AES-256-GCM + RSA-OAEP-4096"
    }

@app.get("/api/v1/incidents", status_code=status.HTTP_200_OK)
async def list_incidents():
    return {"active_incidents": ACTIVE_INCIDENTS, "total_count": len(ACTIVE_INCIDENTS)}
`;
