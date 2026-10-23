"""
Synapse-XDR Configuration Management Module
Strict Pydantic v2 BaseSettings Implementation
"""

import os
from typing import Optional
from pydantic import Field, PostgresDsn, RedisDsn
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore"
    )

    ENVIRONMENT: str = Field(default="production", description="Deployment environment")
    DEBUG: bool = Field(default=False, description="Debug mode flag")
    
    # Database Configuration
    DATABASE_URL: str = Field(
        default="postgresql+asyncpg://synapse_user:secure_password_99@postgres:5432/synapse_db",
        description="PostgreSQL asynchronous connection string"
    )
    
    # Redis Broker Configuration
    REDIS_URL: str = Field(
        default="redis://redis:6379/0",
        description="Redis broker connection string"
    )
    
    # JWT Security Configuration
    JWT_SECRET_KEY: str = Field(
        default="super_secure_jwt_secret_key_rotation_2026_xdr",
        description="Cryptographic secret for JWT signing"
    )
    JWT_ALGORITHM: str = Field(default="RS256", description="JWT cryptographic signature algorithm")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = Field(default=30, description="Token expiration window")
    
    # Security Engine Thresholds
    ANOMALY_THRESHOLD: float = Field(default=0.85, ge=0.0, le=1.0, description="ML anomaly alert threshold")
    CVSS_BLOCK_THRESHOLD: float = Field(default=7.0, ge=0.0, le=10.0, description="Minimum CVSS score to block deployment")
    
    # Encryption Vault
    VAULT_ENCRYPTION_KEY: Optional[str] = Field(default=None, description="Master Key Encryption Key (KEK) base64 encoded")

# Global Settings Instance
settings = Settings()
