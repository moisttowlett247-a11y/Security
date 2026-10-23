"""
Synapse-XDR Infrastructure Diagnostic & Health Verification Script
Programmatically Audits Docker Containers, Network Sockets, and FastAPI Health Endpoints
"""

import json
import socket
import subprocess
import sys
import urllib.request
import urllib.error

# Diagnostic Configuration
CONTAINER_TARGETS = ["synapse_backend_engine", "synapse_postgres", "synapse_redis"]
SOCKET_TARGETS = [
    ("FastAPI Core (Backend)", 8000),
    ("PostgreSQL Data Layer", 5432),
    ("Redis Broker", 6379)
]
HEALTH_ENDPOINT = "http://localhost:8000/health"

def audit_docker_containers() -> bool:
    print("\n[AUDIT 1/3] Verifying OCI Docker Containers...")
    passed = True
    try:
        result = subprocess.run(
            ["docker", "ps", "--format", "{{.Names}}|{{.Status}}"],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            check=True
        )
        output = result.stdout.strip()
        running_lines = output.split("\n") if output else []
        
        container_status_map = {}
        for line in running_lines:
            if "|" in line:
                name, status = line.split("|", 1)
                container_status_map[name.strip()] = status.strip()

        for target in CONTAINER_TARGETS:
            if target in container_status_map:
                status_str = container_status_map[target]
                if "Up" in status_str:
                    print(f"  [PASSED] Container '{target}' is running ({status_str})")
                else:
                    print(f"  [FAILED - ACTION REQUIRED] Container '{target}' status abnormal: {status_str}")
                    passed = False
            else:
                print(f"  [FAILED - ACTION REQUIRED] Container '{target}' is not running or not found.")
                passed = False
    except subprocess.CalledProcessError as e:
        print(f"  [FAILED - ACTION REQUIRED] Failed to execute 'docker ps': {e.stderr.strip()}")
        passed = False
    except FileNotFoundError:
        print("  [FAILED - ACTION REQUIRED] Docker CLI utility not found on host system.")
        passed = False
    return passed

def audit_network_sockets() -> bool:
    print("\n[AUDIT 2/3] Verifying Network Sockets & Ports...")
    passed = True
    for service_name, port in SOCKET_TARGETS:
        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        s.settimeout(3.0)
        try:
            result = s.connect_ex(('127.0.0.1', port))
            if result == 0:
                print(f"  [PASSED] Port {port} ({service_name}) is open and accepting connections.")
            else:
                print(f"  [FAILED - ACTION REQUIRED] Port {port} ({service_name}) refused connection or is closed.")
                passed = False
        except Exception as e:
            print(f"  [FAILED - ACTION REQUIRED] Socket connection error on port {port} ({service_name}): {str(e)}")
            passed = False
        finally:
            s.close()
    return passed

def audit_rest_api() -> bool:
    print("\n[AUDIT 3/3] Performing REST API Deep Health Check...")
    passed = True
    try:
        req = urllib.request.Request(HEALTH_ENDPOINT, method="GET")
        with urllib.request.urlopen(req, timeout=5.0) as response:
            status_code = response.getcode()
            body_bytes = response.read()
            
            if status_code == 200:
                print(f"  [PASSED] Health endpoint returned HTTP {status_code} OK")
                try:
                    data = json.loads(body_bytes.decode('utf-8'))
                    if data.get("status") == "HEALTHY":
                        print(f"  [PASSED] Payload schema validated: status='HEALTHY', version={data.get('engine_version')}")
                    else:
                        print(f"  [FAILED - ACTION REQUIRED] Payload schema returned abnormal status: {data}")
                        passed = False
                except json.JSONDecodeError:
                    print("  [FAILED - ACTION REQUIRED] Health endpoint response is not valid JSON.")
                    passed = False
            else:
                print(f"  [FAILED - ACTION REQUIRED] Health endpoint returned unexpected status code: {status_code}")
                passed = False
    except urllib.error.URLError as e:
        print(f"  [FAILED - ACTION REQUIRED] Failed to connect to REST API at {HEALTH_ENDPOINT}: {e.reason}")
        passed = False
    except Exception as e:
        print(f"  [FAILED - ACTION REQUIRED] REST API audit encountered an unexpected exception: {str(e)}")
        passed = False
    return passed

def main() -> None:
    print("==================================================")
    print(" SYNAPSE-XDR INFRASTRUCTURE DIAGNOSTIC UTILITY")
    print("==================================================")

    docker_ok = audit_docker_containers()
    sockets_ok = audit_network_sockets()
    api_ok = audit_rest_api()

    print("\n==================================================")
    print(" DIAGNOSTIC REPORT COMPILATION MATRIX")
    print("==================================================")
    print(f" OCI Docker Audit    : {'[PASSED]' if docker_ok else '[FAILED - ACTION REQUIRED]'}")
    print(f" Network Sockets     : {'[PASSED]' if sockets_ok else '[FAILED - ACTION REQUIRED]'}")
    print(f" REST API Deep Check : {'[PASSED]' if api_ok else '[FAILED - ACTION REQUIRED]'}")
    print("==================================================")

    if docker_ok and sockets_ok and api_ok:
        print(" OVERALL SYSTEM STATUS: [PASSED] ALL SYSTEMS OPERATIONAL")
        print("==================================================")
        sys.exit(0)
    else:
        print(" OVERALL SYSTEM STATUS: [FAILED - ACTION REQUIRED]")
        print("==================================================")
        sys.exit(1)

if __name__ == "__main__":
    main()
