# DEPLOYMENT

This file documents deployment considerations.

- Cloud keys for STT/TTS must be stored as repository secrets (GitHub Actions) or environment variables on the host.
- Do not commit private keys. Use GitHub Secrets for CI deployments.
