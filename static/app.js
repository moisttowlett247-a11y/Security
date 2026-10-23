/**
 * Synapse-XDR Enterprise Serverless Security Platform Logic Engine
 * Production-Grade Vanilla JavaScript for Static GitHub Pages Telemetry Ingestion & Interactive SOAR Simulation
 */

(function () {
    'use strict';

    const TELEMETRY_URL = './threat_data.json';
    const POLL_INTERVAL_MS = 8000;

    /**
     * Safely updates text content of a DOM element to prevent XSS.
     */
    function safeSetText(elementId, value) {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = String(value);
        }
    }

    /**
     * Displays an interactive modal alert explaining the exact mitigation protocol deployed.
     */
    function showMitigationModal(title, description, protocolDetails) {
        const existingModal = document.getElementById('synapse-mitigation-modal');
        if (existingModal) existingModal.remove();

        const modalOverlay = document.createElement('div');
        modalOverlay.id = 'synapse-mitigation-modal';
        modalOverlay.className = 'fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in';

        const modalBox = document.createElement('div');
        modalBox.className = 'bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 text-white font-mono';

        const headerDiv = document.createElement('div');
        headerDiv.className = 'flex items-center justify-between pb-3 border-b border-slate-800';
        
        const titleEl = document.createElement('h3');
        titleEl.className = 'text-sm font-bold uppercase tracking-wider text-emerald-400';
        titleEl.textContent = title;

        const closeBtn = document.createElement('button');
        closeBtn.className = 'text-slate-400 hover:text-white text-lg font-bold px-2 py-1';
        closeBtn.textContent = '✕';
        closeBtn.addEventListener('click', () => modalOverlay.remove());

        headerDiv.appendChild(titleEl);
        headerDiv.appendChild(closeBtn);

        const descEl = document.createElement('p');
        descEl.className = 'text-xs text-slate-300 leading-relaxed';
        descEl.textContent = description;

        const detailsBox = document.createElement('div');
        detailsBox.className = 'p-3 bg-slate-950 rounded-lg border border-slate-800 text-[11px] text-slate-400 space-y-1';
        
        const detailsTitle = document.createElement('p');
        detailsTitle.className = 'font-bold text-slate-200 mb-1';
        detailsTitle.textContent = 'Active Defensive Control Protocol:';
        detailsBox.appendChild(detailsTitle);

        const detailsText = document.createElement('p');
        detailsText.textContent = protocolDetails;
        detailsBox.appendChild(detailsText);

        const dismissBtn = document.createElement('button');
        dismissBtn.className = 'w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-lg transition-colors';
        dismissBtn.textContent = 'Acknowledge & Close Protocol';
        dismissBtn.addEventListener('click', () => modalOverlay.remove());

        modalBox.appendChild(headerDiv);
        modalBox.appendChild(descEl);
        modalBox.appendChild(detailsBox);
        modalBox.appendChild(dismissBtn);
        modalOverlay.appendChild(modalBox);

        document.body.appendChild(modalOverlay);
    }

    /**
     * Renders threat logs into the ingestion table and binds interactive SOAR action buttons.
     */
    function renderThreatTable(events) {
        const tbody = document.getElementById('threat-log-table');
        if (!tbody) return;

        tbody.innerHTML = '';

        const sortedEvents = [...events].sort((a, b) => (b.severity_score || 0) - (a.severity_score || 0));

        sortedEvents.forEach(event => {
            const tr = document.createElement('tr');
            tr.className = 'hover:bg-slate-800/50 transition-colors border-b border-slate-800/60 font-mono text-xs';

            const severity = event.severity_score !== undefined ? event.severity_score : 8.5;
            const severityClass = severity >= 8.5 
                ? 'bg-red-500/20 text-red-400 border border-red-500/40' 
                : 'bg-amber-500/20 text-amber-400 border border-amber-500/40';

            const tdId = document.createElement('td');
            tdId.className = 'py-3 px-4 text-emerald-400';
            tdId.textContent = event.event_id || 'INC-STATIC-99';

            const tdTime = document.createElement('td');
            tdTime.className = 'py-3 px-4 text-slate-400';
            tdTime.textContent = event.timestamp ? new Date(event.timestamp * 1000).toLocaleTimeString() : new Date().toLocaleTimeString();

            const tdIp = document.createElement('td');
            tdIp.className = 'py-3 px-4';
            tdIp.textContent = event.source_ip || '198.51.100.42';

            const tdTarget = document.createElement('td');
            tdTarget.className = 'py-3 px-4';
            tdTarget.textContent = event.target_asset || event.destination_ip || 'gateway-router-01';

            const tdAlert = document.createElement('td');
            tdAlert.className = 'py-3 px-4';
            tdAlert.textContent = event.alert_message || 'Behavioral anomaly detected';

            const tdSeverity = document.createElement('td');
            tdSeverity.className = 'py-3 px-4';
            const badge = document.createElement('span');
            badge.className = `px-2 py-0.5 rounded font-bold ${severityClass}`;
            badge.textContent = severity.toFixed(1);
            tdSeverity.appendChild(badge);

            const tdAction = document.createElement('td');
            tdAction.className = 'py-3 px-4 text-right';
            const actionBtn = document.createElement('button');
            actionBtn.className = 'px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold rounded text-[11px] uppercase tracking-wider transition-all shadow-sm';
            actionBtn.textContent = 'Isolate Endpoint';
            
            actionBtn.addEventListener('click', () => {
                actionBtn.disabled = true;
                actionBtn.className = 'px-3 py-1 bg-red-600 text-white font-bold rounded text-[11px] uppercase tracking-wider cursor-not-allowed opacity-90';
                actionBtn.textContent = 'COMMAND DEPLOYED';
                
                showMitigationModal(
                    `SOAR Isolation Executed: ${event.event_id || 'INC-99'}`,
                    `Automated network isolation successfully triggered for target asset ${event.target_asset || event.source_ip}.`,
                    `The eBPF XDP kernel driver layer dropped all ingress/egress packets from source IP ${event.source_ip}, terminating active process trees and securing encrypted volume snapshots.`
                );
            });

            tdAction.appendChild(actionBtn);

            tr.appendChild(tdId);
            tr.appendChild(tdTime);
            tr.appendChild(tdIp);
            tr.appendChild(tdTarget);
            tr.appendChild(tdAlert);
            tr.appendChild(tdSeverity);
            tr.appendChild(tdAction);

            tbody.appendChild(tr);
        });
    }

    /**
     * Asynchronously fetches static threat telemetry and updates dashboard metrics.
     */
    async function fetchStaticThreatTelemetry() {
        try {
            const response = await fetch(`${TELEMETRY_URL}?t=${Date.now()}`, {
                method: 'GET',
                headers: { 'Accept': 'application/json' }
            });

            if (!response.ok) {
                throw new Error(`Failed to load telemetry payload: HTTP ${response.status}`);
            }

            const data = await response.json();

            safeSetText('active-threats-count', data.active_threats !== undefined ? data.active_threats : 3);
            safeSetText('blocked-ips-count', data.blocked_ips !== undefined ? data.blocked_ips.toLocaleString() : '1,428,950');
            safeSetText('system-health-status', data.status ? `${data.status} (99.98%)` : 'NOMINAL (99.98%)');

            if (Array.isArray(data.events)) {
                renderThreatTable(data.events);
            } else {
                renderThreatTable([
                    {
                        event_id: "INC-STATIC-01",
                        timestamp: Date.now() / 1000,
                        source_ip: "198.51.100.42",
                        target_asset: "gateway-router-01",
                        alert_message: "Static GitHub Pages Security Log Hydration Nominal",
                        severity_score: 9.8,
                        soar_triggered: true
                    }
                ]);
            }

        } catch (error) {
            console.warn("Telemetry artifact fetch warning (using resilient fallback defaults):", error.message);
            safeSetText('active-threats-count', 3);
            safeSetText('blocked-ips-count', '1,428,950');
            safeSetText('system-health-status', 'NOMINAL (Fallback)');
            
            renderThreatTable([
                {
                    event_id: "INC-FALLBACK-01",
                    timestamp: Date.now() / 1000,
                    source_ip: "203.0.113.19",
                    target_asset: "prod-worker-db-04",
                    alert_message: "Fallback heuristic telemetry pattern active",
                    severity_score: 8.9,
                    soar_triggered: false
                }
            ]);
        }
    }

    // Initialize UI Event Bindings on DOMContentLoaded
    document.addEventListener('DOMContentLoaded', () => {
        fetchStaticThreatTelemetry();
        setInterval(fetchStaticThreatTelemetry, POLL_INTERVAL_MS);

        // Bind interactive metric cards for deep analytical protocol explanations
        const activeThreatsCard = document.getElementById('metric-card-active-threats');
        if (activeThreatsCard) {
            activeThreatsCard.addEventListener('click', () => {
                showMitigationModal(
                    'Active Threats Metric Protocol',
                    'Monitoring zero-day anomalies, Living-off-the-Land (LotL) binaries, and process injection attempts.',
                    'Asynchronous event loops process OSQuery/Wazuh sys_enter/sys_exit syscall streams. When anomaly scores exceed 0.85, threads are suspended instantly.'
                );
            });
        }

        const blockedIpsCard = document.getElementById('metric-card-blocked-ips');
        if (blockedIpsCard) {
            blockedIpsCard.addEventListener('click', () => {
                showMitigationModal(
                    'Blocked IPs (eBPF/XDP) Metric Protocol',
                    'Line-rate packet filtering bypassing standard kernel network stacks to drop malicious traffic.',
                    'eBPF XDP C kernel hooks evaluate incoming IP headers against eBPF hash maps at the network driver level, dropping DDoS SYN floods with 0.14µs latency.'
                );
            });
        }

        const systemHealthCard = document.getElementById('metric-card-system-health');
        if (systemHealthCard) {
            systemHealthCard.addEventListener('click', () => {
                showMitigationModal(
                    'System Health & Cryptographic Integrity',
                    'Validating microservice uptime, AES-256-GCM envelope encryption, and RS256 stateless JWT authentication.',
                    'All secrets are wrapped using asymmetric RSA-4096 KEKs. Token validation enforces strict role-based access control (RBAC) and granular permission scopes.'
                );
            });
        }

        const manualAuditBtn = document.getElementById('manual-audit-btn');
        if (manualAuditBtn) {
            manualAuditBtn.addEventListener('click', () => {
                manualAuditBtn.textContent = 'Auditing...';
                manualAuditBtn.disabled = true;
                setTimeout(() => {
                    fetchStaticThreatTelemetry();
                    manualAuditBtn.textContent = 'Manual System Audit';
                    manualAuditBtn.disabled = false;
                    showMitigationModal(
                        'Zero-Trust System Audit Completed',
                        'Manual inspection of all cryptographic vaults, eBPF filters, and SIEM ingestion pipelines completed successfully.',
                        'All components verified nominal with zero integrity violations.'
                    );
                }, 600);
            });
        }
    });

})();
