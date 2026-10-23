/**
 * Synapse-XDR Frontend Client Orchestration & Telemetry Bridge
 * Production-Grade Vanilla JavaScript Handling Async API Polling, SOAR Triggers, and XSS Sanitization
 */

(function () {
    'use strict';

    // Configuration Constants
    const API_BASE_URL = window.location.origin;
    const POLLING_INTERVAL_MS = 5000;
    
    // Mock JWT token for zero-trust authorization in frontend simulations
    const DEMO_JWT_TOKEN = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c3ItOTk4NDAiLCJ1c2VybmFtZSI6ImFkbWluX3NlY3VyZV9vcGVyYXRvciIsInJvbGVzIjpbIkFETUlOIl0sInNjb3BlcyI6WyJ0ZWxlbWV0cnk6d3JpdGUiLCJ0ZWxlbWV0cnk6cmVhZCJdLCJpYXQiOjE3NjEwNjkxNDUsImV4cCI6MTc2MTA3Mjc0NX0.signature";

    /**
     * Sanitizes string inputs to prevent Cross-Site Scripting (XSS) when rendering into DOM.
     */
    function sanitizeHTML(str) {
        if (typeof str !== 'string') return '';
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#x27;');
    }

    /**
     * Programmatically injects a threat telemetry event into the terminal log table.
     */
    function renderThreatEventRow(event) {
        const tbody = document.getElementById('threat-log-tbody');
        if (!tbody) return;

        const tr = document.createElement('tr');
        tr.className = 'hover:bg-slate-800/50 transition-colors animate-fade-in';
        tr.id = `row-${sanitizeHTML(event.event_id)}`;

        const severityBg = event.severity_score >= 8.5 
            ? 'bg-red-500/20 text-red-400 border border-red-500/40' 
            : 'bg-amber-500/20 text-amber-400 border border-amber-500/40';

        const statusText = event.soar_action_triggered ? 'MITIGATED (SOAR)' : 'INGESTED';
        const statusColor = event.soar_action_triggered ? 'text-emerald-400 font-semibold' : 'text-blue-400';

        tr.innerHTML = `
            <td class="py-3 px-6 text-emerald-400">${sanitizeHTML(event.event_id)}</td>
            <td class="py-3 px-6 text-slate-400">${new Date().toLocaleTimeString()}</td>
            <td class="py-3 px-6 font-mono">${sanitizeHTML(event.source_ip || '127.0.0.1')}</td>
            <td class="py-3 px-6">${sanitizeHTML(event.target_asset || 'cluster-node-01')}</td>
            <td class="py-3 px-6">${sanitizeHTML(event.alert_message || 'Behavioral anomaly detected')}</td>
            <td class="py-3 px-6"><span class="px-2 py-0.5 rounded ${severityBg} font-bold">${event.severity_score.toFixed(1)}</span></td>
            <td class="py-3 px-6 text-right"><span class="${statusColor}">${statusText}</span></td>
        `;

        // Prepend new event to top of table
        tbody.insertBefore(tr, tbody.firstChild);

        // Keep table capped at 50 rows for performance
        if (tbody.children.length > 50) {
            tbody.removeChild(tbody.lastChild);
        }
    }

    /**
     * Asynchronously queries the FastAPI telemetry endpoint.
     */
    async function fetchThreatTelemetry() {
        try {
            const response = await fetch(`${API_BASE_URL}/health`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${DEMO_JWT_TOKEN}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            const statusIndicator = document.getElementById('system-status-indicator');
            if (statusIndicator) {
                statusIndicator.innerHTML = `
                    <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    ZERO-TRUST ORCHESTRATION: ONLINE (${data.active_modules.length} modules active)
                `;
            }
        } catch (error) {
            console.error("Telemetry polling connection failure:", error);
            const statusIndicator = document.getElementById('system-status-indicator');
            if (statusIndicator) {
                statusIndicator.innerHTML = `
                    <span class="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                    CONNECTION DEGRADED: RECONNECTING...
                `;
            }
        }
    }

    /**
     * Triggers automated SOAR incident response containment.
     */
    async function triggerSOARIsolation(endpointId) {
        console.warn(`Initiating SOAR Isolation Playbook for target: ${endpointId}`);
        
        const payload = {
            event_id: `INC-${Math.floor(10000 + Math.random() * 90000)}`,
            source_ip: "198.51.100.99",
            destination_ip: "10.0.0.15",
            alert_message: `Manual SOAR Playbook Execution triggered for ${endpointId}`,
            severity_score: 9.9,
            payload_signature: "manual_playbook_override_sig_99"
        };

        try {
            const response = await fetch(`${API_BASE_URL}/api/v1/telemetry`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${DEMO_JWT_TOKEN}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error(`SOAR execution failed with HTTP ${response.status}`);
            }

            const result = await response.json();
            showSoarBanner(`DEVICE ${sanitizeHTML(endpointId)} ISOLATED SUCCESSFULLY (SOAR ID: ${result.event_id})`, 'success');
            renderThreatEventRow({
                event_id: result.event_id,
                source_ip: payload.source_ip,
                target_asset: endpointId,
                alert_message: payload.alert_message,
                severity_score: payload.severity_score,
                soar_action_triggered: true
            });
        } catch (error) {
            console.error("SOAR Playbook Execution Error:", error);
            showSoarBanner(`SOAR Playbook Error: ${error.message}`, 'error');
        }
    }

    /**
     * Visually flashes a notification banner across the UI.
     */
    function showSoarBanner(message, type = 'success') {
        const existingBanner = document.getElementById('soar-notification-banner');
        if (existingBanner) existingBanner.remove();

        const banner = document.createElement('div');
        banner.id = 'soar-notification-banner';
        const bgColor = type === 'success' ? 'bg-emerald-600 text-slate-950' : 'bg-red-600 text-white';
        banner.className = `fixed top-16 right-6 z-50 px-6 py-3 rounded-xl shadow-2xl font-mono text-xs font-bold tracking-wider uppercase transition-all duration-300 transform translate-y-0 opacity-100 ${bgColor}`;
        banner.textContent = message;

        document.body.appendChild(banner);

        setTimeout(() => {
            banner.classList.add('opacity-0', '-translate-y-2');
            setTimeout(() => banner.remove(), 400);
        }, 4000);
    }

    // Bind UI Event Listeners upon DOM content loaded
    document.addEventListener('DOMContentLoaded', () => {
        const isolateBtn = document.getElementById('soar-btn-isolate-host');
        if (isolateBtn) {
            isolateBtn.addEventListener('click', () => triggerSOARIsolation('prod-worker-db-04'));
        }

        const xdpBtn = document.getElementById('soar-btn-xdp-drop');
        if (xdpBtn) {
            xdpBtn.addEventListener('click', () => triggerSOARIsolation('gateway-router-01'));
        }

        const wormBtn = document.getElementById('soar-btn-worm-snapshot');
        if (wormBtn) {
            wormBtn.addEventListener('click', () => triggerSOARIsolation('cluster-storage-hsm'));
        }

        const lockdownBtn = document.getElementById('global-lockdown-btn');
        if (lockdownBtn) {
            lockdownBtn.addEventListener('click', () => {
                if (confirm('CRITICAL: Execute Global Zero-Trust Cluster Lockdown?')) {
                    triggerSOARIsolation('GLOBAL-CLUSTER-LOCKDOWN');
                }
            });
        }

        const clearBtn = document.getElementById('clear-logs-btn');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                const tbody = document.getElementById('threat-log-tbody');
                if (tbody) tbody.innerHTML = '';
            });
        }

        // Start periodic telemetry polling
        setInterval(fetchThreatTelemetry, POLLING_INTERVAL_MS);
        fetchThreatTelemetry();
    });

})();
