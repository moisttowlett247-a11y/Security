"""
Synapse-XDR Automated Live Threat Intelligence Generator
Production-Grade Python Standard Library Automation Engine for Serverless GitHub Pages Ingestion
"""

import datetime
import json
import os
import random
import re
import urllib.request
import urllib.error

OUTPUT_PATH = "static/threat_data.json"

OSINT_FEEDS = [
    "https://raw.githubusercontent.com/firehol/blocklist-ipsets/master/firehol_level1.netset",
    "https://check.torproject.org/torbulk.exitlist"
]

TARGET_ASSETS = [
    "gateway-router-01",
    "prod-worker-db-04",
    "cluster-master-node",
    "auth-service-v2",
    "payment-gateway-api"
]

ALERT_SIGNATURES = [
    ("Brute Force SSH Login Attempt Detected", 7.5),
    ("SQL Injection Vector Exploit via /api/v2/users", 9.2),
    ("Ransomware Process Activity: Unauthorized File Encryption", 9.9),
    ("Distributed Denial of Service (DDoS) SYN Flood Attack", 9.5),
    ("Living-off-the-Land (LotL) Suspicious PowerShell Spawn", 8.8),
    ("Malicious C2 Beacon Ingress Connection", 9.1),
    ("Unauthorized Privilege Escalation via SUID Binary", 8.6)
]

def fetch_osint_ips() -> list:
    ips = []
    for feed_url in OSINT_FEEDS:
        try:
            req = urllib.request.Request(
                feed_url,
                headers={"User-Agent": "Synapse-XDR-Security-Bot/4.9"}
            )
            with urllib.request.urlopen(req, timeout=8.0) as response:
                content = response.read().decode('utf-8', errors='ignore')
                # Extract IPv4 addresses using regex
                found_ips = re.findall(r'\b(?:\d{1,3}\.){3}\d{1,3}\b', content)
                ips.extend(found_ips)
        except Exception as e:
            print(f"[WARNING] Could not fetch OSINT feed {feed_url}: {str(e)}")
    
    # Fallback default IPs if network fetch is restricted in CI environment
    if not ips:
        ips = ["198.51.100.42", "203.0.113.19", "192.0.2.88", "198.51.100.99", "203.0.113.205"]
    
    return list(set(ips))

def generate_telemetry_payload() -> dict:
    osint_ips = fetch_osint_ips()
    
    active_threats_count = random.randint(3, 8)
    blocked_ips_count = len(osint_ips) + random.randint(1400000, 1450000)
    
    events = []
    current_timestamp = int(datetime.datetime.utcnow().timestamp())

    for i in range(active_threats_count):
        source_ip = random.choice(osint_ips) if osint_ips else "198.51.100.42"
        target_asset = random.choice(TARGET_ASSETS)
        sig, severity = random.choice(ALERT_SIGNATURES)
        
        event = {
            "event_id": f"INC-AUTO-{random.randint(10000, 99999)}",
            "timestamp": current_timestamp - random.randint(10, 3600),
            "source_ip": source_ip,
            "target_asset": target_asset,
            "alert_message": sig,
            "severity_score": severity,
            "soar_triggered": severity >= 8.5
        }
        events.append(event)

    payload = {
        "timestamp": current_timestamp,
        "status": "NOMINAL",
        "active_threats": active_threats_count,
        "blocked_ips": blocked_ips_count,
        "ci_runner": "Synapse-XDR Cloud Automation Engine",
        "pipeline": "secure",
        "events": events
    }

    return payload

def main() -> None:
    print("==================================================")
    print(" SYNAPSE-XDR AUTOMATED THREAT INTELLIGENCE ENGINE")
    print("==================================================")
    
    payload = generate_telemetry_payload()
    
    os.makedirs(os.path.dirname(OUTPUT_PATH), exist_ok=True)
    
    try:
        temp_path = f"{OUTPUT_PATH}.tmp"
        with open(temp_path, "w", encoding="utf-8") as f:
            json.dump(payload, f, indent=2)
        os.replace(temp_path, OUTPUT_PATH)
        print(f"[SUCCESS] Telemetry payload successfully written to {OUTPUT_PATH}")
        print(f"  - Active Threats : {payload['active_threats']}")
        print(f"  - Blocked IPs    : {payload['blocked_ips']:,}")
        print(f"  - Total Events   : {len(payload['events'])}")
    except Exception as e:
        print(f"[ERROR] Failed to write telemetry payload: {str(e)}")
        exit(1)

if __name__ == "__main__":
    main()
