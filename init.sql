-- Synapse-XDR Enterprise Database Initialization Schema
-- Production-Optimized PostgreSQL 16+ Schema with B-Tree Indexes & Security Constraints

-- Enable UUID extension if not already present
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables if re-initializing in development
DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS threat_logs CASCADE;
DROP TABLE IF EXISTS telemetry_events CASCADE;

-- 1. Threat Logs Table (SIEM & eBPF Telemetry Storage)
CREATE TABLE threat_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id VARCHAR(64) UNIQUE NOT NULL,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    source_ip VARCHAR(45) NOT NULL,
    destination_ip VARCHAR(45) NOT NULL,
    attack_signature TEXT NOT NULL,
    severity_score NUMERIC(4, 2) NOT NULL CHECK (severity_score >= 0.00 AND severity_score <= 10.00),
    mitigation_status VARCHAR(32) NOT NULL DEFAULT 'PENDING' CHECK (mitigation_status IN ('PENDING', 'BLOCKED', 'IGNORED', 'MITIGATED', 'ISOLATED')),
    soar_triggered BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 2. Telemetry Events Table (Asynchronous Bulk Log Ingestion Cache)
CREATE TABLE telemetry_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id VARCHAR(64) UNIQUE NOT NULL,
    source_ip VARCHAR(45) NOT NULL,
    destination_ip VARCHAR(45) NOT NULL,
    alert_message TEXT NOT NULL,
    severity_score NUMERIC(4, 2) NOT NULL CHECK (severity_score >= 0.00 AND severity_score <= 10.00),
    soar_triggered BOOLEAN NOT NULL DEFAULT FALSE,
    timestamp DOUBLE PRECISION NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 3. Audit Logs Table (Zero-Trust Validation & Admin Compliance)
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(64) NOT NULL,
    username VARCHAR(128) NOT NULL,
    action_performed VARCHAR(255) NOT NULL,
    target_resource VARCHAR(255),
    ip_address VARCHAR(45),
    status VARCHAR(32) NOT NULL DEFAULT 'SUCCESS',
    timestamp TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 4. Performance Optimization B-Tree Indexes for Real-Time Dashboard Queries
CREATE INDEX idx_threat_logs_source_ip ON threat_logs (source_ip);
CREATE INDEX idx_threat_logs_timestamp ON threat_logs (timestamp DESC);
CREATE INDEX idx_threat_logs_severity ON threat_logs (severity_score DESC);

CREATE INDEX idx_telemetry_source_ip ON telemetry_events (source_ip);
CREATE INDEX idx_telemetry_timestamp ON telemetry_events (timestamp DESC);

CREATE INDEX idx_audit_logs_user_id ON audit_logs (user_id);
CREATE INDEX idx_audit_logs_timestamp ON audit_logs (timestamp DESC);
