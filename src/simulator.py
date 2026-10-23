"""
Synapse-XDR Production Telemetry Simulator
Asynchronous High-Performance Attack Profile Blaster
"""

import asyncio
import random
import time
import uuid
import httpx
import structlog

logger = structlog.get_logger("synapse.simulator")

API_ENDPOINT = "http://localhost:8000/api/v1/telemetry"
DEMO_JWT_TOKEN = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c3ItOTk4NDAiLCJ1c2VybmFtZSI6ImFkbWluX3NlY3VyZV9vcGVyYXRvciIsInJvbGVzIjpbIkFETUlNIl0sInNjb3BlcyI6WyJ0ZWxlbWV0cnk6d3JpdGUiLCJ0ZWxlbWV0cnk6cmVhZCJdLCJpYXQiOjE3NjEwNjkxNDUsImV4cCI6MTc2MTA3Mjc0NX0.signature"

ATTACK_PROFILES = [
    {
        "alert_message": "Brute Force SSH Login Attempt Detected (Multiple Failures)",
        "severity_score": 7.5,
        "payload_signature": "ssh_bruteforce_sig_01"
    },
    {
        "alert_message": "SQL Injection Vector Exploit via /api/v2/users?id=1' OR '1'='1",
        "severity_score": 9.2,
        "payload_signature": "sqli_payload_sig_02"
    },
    {
        "alert_message": "Ransomware Process Activity: Unauthorized File Encryption Execution",
        "severity_score": 9.9,
        "payload_signature": "ransomware_exec_sig_03"
    },
    {
        "alert_message": "Distributed Denial of Service (DDoS) SYN Flood Attack at XDP Layer",
        "severity_score": 9.5,
        "payload_signature": "ddos_syn_flood_sig_04"
    },
    {
        "alert_message": "Living-off-the-Land (LotL) Suspicious PowerShell Spawn from w3wp.exe",
        "severity_score": 8.8,
        "payload_signature": "lotl_powershell_sig_05"
    }
]

def generate_random_ip() -> str:
    return f"{random.randint(10, 200)}.{random.randint(0, 255)}.{random.randint(0, 255)}.{random.randint(1, 254)}"

async def send_telemetry_batch(client: httpx.AsyncClient, batch_size: int = 3) -> None:
    events = []
    for _ in range(batch_size):
        profile = random.choice(ATTACK_PROFILES)
        event = {
            "event_id": f"SIM-{uuid.uuid4().hex[:12].upper()}",
            "source_ip": generate_random_ip(),
            "destination_ip": "10.244.0.15",
            "alert_message": profile["alert_message"],
            "severity_score": profile["severity_score"],
            "payload_signature": profile["payload_signature"]
        }
        events.append(event)

    headers = {
        "Authorization": f"Bearer {DEMO_JWT_TOKEN}",
        "Content-Type": "application/json"
    }

    try:
        response = await client.post(API_ENDPOINT, json=events, headers=headers, timeout=5.0)
        if response.status_code == 202:
            logger.info("Telemetry batch successfully ingested", batch_size=len(events), status=response.status_code)
        else:
            logger.warning("Telemetry ingestion returned non-202 status", status_code=response.status_code, body=response.text)
    except httpx.TimeoutException:
        logger.error("HTTP request timed out while contacting threat engine API")
    except httpx.ConnectError:
        logger.error("Connection refused: Ensure FastAPI backend is running on localhost:8000")
    except Exception as e:
        logger.error("Unexpected error during simulation request", error=str(e))

async def main() -> None:
    logger.info("Starting Synapse-XDR Telemetry Simulator...")
    async with httpx.AsyncClient() as client:
        while True:
            batch_size = random.randint(1, 5)
            await send_telemetry_batch(client, batch_size=batch_size)
            sleep_duration = random.uniform(0.5, 2.0)
            await asyncio.sleep(sleep_duration)

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        logger.info("Simulator stopped by user.")
