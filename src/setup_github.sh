#!/usr/bin/env bash
# ==============================================================================
# Synapse-XDR Enterprise GitHub Setup & Repository Initialization Script
# Production-Grade Bash Automation for Workspace Packaging and Git Staging
# ==============================================================================

set -euo pipefail

# Color Codes for Terminal Output
GREEN='\033[0;32m'
CYAN='\033[0;36m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${CYAN}[INFO] Initializing Synapse-XDR workspace packaging...${NC}"

# 1. Directory Structure Setup
echo -e "${CYAN}[INFO] Creating secure directory hierarchy...${NC}"
directories=(
    "src/core"
    "src/utils"
    "static"
    "db"
    "configs/ebpf"
    ".github/workflows"
)

for dir in "${directories[@]}"; do
    if [ ! -d "$dir" ]; then
        mkdir -p "$dir"
        echo -e "  [CREATED] Directory: $dir"
    else
        echo -e "  [EXISTS]  Directory: $dir"
    fi
done

# 2. Secure .gitignore Generation
echo -e "${CYAN}[INFO] Generating production .gitignore safeguards...${NC} "
cat << 'EOF' > .gitignore
# Runtime Environment Secrets & Keys
.env
.env.local
*.pem
*.key
*.crt

# Python Runtime Artifacts & Caches
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
env/
venv/
ENV/
build/
develop-eggs/
dist/
downloads/
eggs/
.eggs/
lib/
lib64/
parts/
sdist/
var/
wheels/
share/python-wheels/
*.egg-info/
.installed.cfg
*.egg
MANIFEST
.pytest_cache/
.mypy_cache/
.ruff_cache/

# Database Storage & Persistent Volumes
*.db
*.sqlite
*.sqlite3
postgres_data/
redis_data/
vault_data/
*.log

# OS Generated Files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db
.idea/
.vscode/
EOF
echo -e "  [SUCCESS] .gitignore successfully written."

# 3. Git Repository Initialization & Staging
echo -e "${CYAN}[INFO] Initializing local Git repository...${NC}"
if [ ! -d ".git" ]; then
    git init
    echo -e "  [SUCCESS] Git repository initialized."
else
    echo -e "  [EXISTS]  Git repository already present."
fi

# Set default branch to main
git branch -M main

echo -e "${CYAN}[INFO] Staging enterprise architecture files...${NC}"
git add .

# Check if there are changes to commit
if git diff --cached --quiet; then
    echo -e "${CYAN}[INFO] No new changes to commit.${NC}"
else
    git commit -m "feat(core): initialize Synapse-XDR enterprise Zero-Trust SIEM/SOAR platform"
    echo -e "${GREEN}[SUCCESS] Initial secure baseline commit created.${NC}"
fi

# 4. Remote Binding Prompt & Push Instructions
REMOTE_URL="${1:-}"

if [ -n "$REMOTE_URL" ]; then
    echo -e "${CYAN}[INFO] Binding remote repository URL: $REMOTE_URL${NC}"
    if git remote | grep -q "origin"; then
        git remote set-url origin "$REMOTE_URL"
    else
        git remote add origin "$REMOTE_URL"
    fi
    
    echo -e "${CYAN}[INFO] Pushing master branch to remote origin...${NC}"
    git push -u origin main
    echo -e "${GREEN}[SUCCESS] Repository successfully published to GitHub!${NC}"
else
    echo -e "\n${CYAN}==============================================================================${NC}"
    echo -e "${GREEN}[READY] Workspace successfully packaged and committed locally!${NC}"
    echo -e "${CYAN}To publish your repository to GitHub, run:${NC}"
    echo -e "  bash src/setup_github.sh https://github.com/your-org/synapse-xdr.git"
    echo -e "${CYAN}==============================================================================${NC}"
fi
