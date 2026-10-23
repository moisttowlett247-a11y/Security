"""
Synapse-XDR Production Cryptographic & Zero-Trust Authentication Engine
Implements AES-256-GCM Envelope Encryption & Asymmetric RS256 JWT Verification.
"""

import base64
import logging
import os
import time
from typing import Dict, List, Optional, Tuple, Any
from pydantic import BaseModel, Field
import jwt
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
from cryptography.hazmat.primitives.asymmetric import rsa, padding
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.serialization import Encoding, PublicFormat, PrivateFormat, NoEncryption

logger = logging.getLogger("synapse.crypto")
logger.setLevel(logging.INFO)

class UserClaims(BaseModel):
    sub: str = Field(..., description="Subject identifier (User ID)")
    username: str = Field(..., description="Username")
    roles: List[str] = Field(default_factory=list, description="Assigned RBAC roles")
    scopes: List[str] = Field(default_factory=list, description="Granular permission scopes")
    exp: int = Field(..., description="Expiration timestamp")
    iat: int = Field(..., description="Issued at timestamp")

class EnvelopeEncryptionResult(BaseModel):
    ciphertext_b64: str
    nonce_b64: str
    wrapped_dek_b64: str
    algorithm: str = "AES-256-GCM + RSA-OAEP-4096"

class CryptographicVaultEngine:
    def __init__(self, rsa_key_size: int = 4096) -> None:
        try:
            logger.info("Initializing CryptographicVaultEngine and generating Master RSA Keypair...")
            self.master_private_key = rsa.generate_private_key(
                public_exponent=65537,
                key_size=rsa_key_size
            )
            self.master_public_key = self.master_private_key.public_key()
            logger.info("Master RSA Keypair generated successfully.")
        except Exception as e:
            logger.error(f"Failed to initialize RSA keypair: {str(e)}")
            raise

    def encrypt_envelope(self, plaintext: str, associated_data: Optional[bytes] = None) -> EnvelopeEncryptionResult:
        """
        Encrypts plaintext using AES-256-GCM DEK, then wraps the DEK using RSA-4096 OAEP public key.
        """
        try:
            # 1. Generate 256-bit AES-GCM Data Encryption Key (DEK)
            dek = AESGCM.generate_key(bit_length=256)
            aesgcm = AESGCM(dek)
            
            # 2. Generate cryptographically secure nonce (12 bytes for GCM)
            nonce = os.urandom(12)
            
            # 3. Encrypt payload
            plaintext_bytes = plaintext.encode('utf-8')
            ciphertext = aesgcm.encrypt(nonce, plaintext_bytes, associated_data)
            
            # 4. Wrap (encrypt) DEK with RSA-4096 public key
            wrapped_dek = self.master_public_key.encrypt(
                dek,
                padding.OAEP(
                    mgf=padding.MGF1(algorithm=hashes.SHA256()),
                    algorithm=hashes.SHA256(),
                    label=None
                )
            )
            
            return EnvelopeEncryptionResult(
                ciphertext_b64=base64.b64encode(ciphertext).decode('utf-8'),
                nonce_b64=base64.b64encode(nonce).decode('utf-8'),
                wrapped_dek_b64=base64.b64encode(wrapped_dek).decode('utf-8')
            )
        except Exception as e:
            logger.error(f"Envelope encryption failed: {str(e)}")
            raise RuntimeError(f"Envelope encryption error: {str(e)}") from e

    def decrypt_envelope(self, ciphertext_b64: str, nonce_b64: str, wrapped_dek_b64: str, associated_data: Optional[bytes] = None) -> str:
        """
        Unwraps DEK using RSA-4096 private key, then decrypts ciphertext using AES-256-GCM.
        """
        try:
            ciphertext = base64.b64decode(ciphertext_b64)
            nonce = base64.b64decode(nonce_b64)
            wrapped_dek = base64.b64decode(wrapped_dek_b64)
            
            # 1. Unwrap DEK with RSA private key
            dek = self.master_private_key.decrypt(
                wrapped_dek,
                padding.OAEP(
                    mgf=padding.MGF1(algorithm=hashes.SHA256()),
                    algorithm=hashes.SHA256(),
                    label=None
                )
            )
            
            # 2. Decrypt ciphertext with DEK
            aesgcm = AESGCM(dek)
            plaintext_bytes = aesgcm.decrypt(nonce, ciphertext, associated_data)
            return plaintext_bytes.decode('utf-8')
        except Exception as e:
            logger.error(f"Envelope decryption failed: {str(e)}")
            raise RuntimeError(f"Envelope decryption error: {str(e)}") from e

class ZeroTrustAuthEngine:
    def __init__(self) -> None:
        # For validation testing, export public key in PEM format
        self._rsa_vault = CryptographicVaultEngine(rsa_key_size=2048) # Faster for JWT testing if needed, or 4096
        self.public_pem = self._rsa_vault.master_public_key.public_bytes(
            encoding=Encoding.PEM,
            format=PublicFormat.SubjectPublicKeyInfo
        ).decode('utf-8')
        self.private_pem = self._rsa_vault.master_private_key.private_bytes(
            encoding=Encoding.PEM,
            format=PrivateFormat.TraditionalOpenSSL,
            encryption_algorithm=NoEncryption()
        ).decode('utf-8')

    def generate_token(self, subject: str, username: str, roles: List[str], scopes: List[str], expires_in_minutes: int = 30) -> str:
        try:
            now = int(time.time())
            payload = {
                "sub": subject,
                "username": username,
                "roles": roles,
                "scopes": scopes,
                "iat": now,
                "exp": now + (expires_in_minutes * 60)
            }
            token = jwt.encode(payload, self.private_pem, algorithm="RS256")
            return token
        except Exception as e:
            logger.error(f"Failed to generate JWT token: {str(e)}")
            raise RuntimeError(f"Token generation failed: {str(e)}") from e

    def verify_and_parse_token(self, token: str, required_role: Optional[str] = None, required_scope: Optional[str] = None) -> UserClaims:
        """
        Decodes, verifies signature using RS256, validates expiration, checks RBAC roles/scopes, and parses into UserClaims.
        """
        try:
            payload = jwt.decode(
                token,
                self.public_pem,
                algorithms=["RS256"],
                options={"verify_signature": True, "verify_exp": True, "verify_iat": True}
            )
            
            claims = UserClaims(**payload)
            
            # Role verification
            if required_role and required_role not in claims.roles:
                logger.warning(f"Access denied for user {claims.sub}: missing required role '{required_role}'")
                raise PermissionError(f"Required role '{required_role}' not present in token claims.")
                
            # Scope verification
            if required_scope and required_scope not in claims.scopes:
                logger.warning(f"Access denied for user {claims.sub}: missing required scope '{required_scope}'")
                raise PermissionError(f"Required scope '{required_scope}' not present in token claims.")
                
            return claims
            
        except jwt.ExpiredSignatureError as ese:
            logger.warning("Token verification failed: Signature has expired.")
            raise ValueError("Authentication token has expired.") from ese
        except jwt.InvalidTokenError as ite:
            logger.warning(f"Token verification failed: Invalid token format or signature. Details: {str(ite)}")
            raise ValueError(f"Invalid authentication token: {str(ite)}") fromite
        except PermissionError as pe:
            raise pe
        except Exception as e:
            logger.error(f"Unexpected error during token verification: {str(e)}")
            raise RuntimeError(f"Token validation error: {str(e)}") from e
