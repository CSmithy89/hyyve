# Self-Hosted Deployment Options for Hyyve Platform

**Research Document**
**Date:** 2026-01-21
**Author:** Technical Architecture Team
**Version:** 1.1 (Validated & Enhanced)

> **Validation Status:** ✅ Validated on 2026-01-21
> **Changes in v1.1:** Updated component versions (Weaviate, Velero, K3s), removed deprecated Docker Compose version field, added GitOps section, added Supply Chain Security section, added Policy Enforcement section, strengthened Promtail EOL guidance.

---

## Executive Summary

This document provides comprehensive research on self-hosted deployment options for the Hyyve Platform. Enterprise customers increasingly require self-hosted deployments for data sovereignty, compliance requirements, and air-gapped environments. This research covers Docker deployment, Kubernetes orchestration, air-gapped installations, Infrastructure as Code (IaC), GitOps patterns, supply chain security, and operational considerations.

**Key Recommendations:**
- Use Docker Compose for small-scale deployments and development environments
- Deploy on Kubernetes with Helm charts for production-grade enterprise deployments
- Implement External Secrets Operator with HashiCorp Vault for secrets management
- Use Velero for backup/disaster recovery
- Deploy Harbor as a private registry for air-gapped environments
- Provide Terraform modules for multi-cloud Infrastructure as Code
- **NEW:** Implement GitOps with ArgoCD or Flux for declarative deployments
- **NEW:** Enforce supply chain security with SBOM generation and image signing

---

## Table of Contents

1. [Docker Deployment](#1-docker-deployment)
2. [Kubernetes Deployment](#2-kubernetes-deployment)
3. [Air-Gapped Environments](#3-air-gapped-environments)
4. [Infrastructure as Code](#4-infrastructure-as-code)
5. [GitOps Deployment Patterns](#5-gitops-deployment-patterns) *(NEW)*
6. [Supply Chain Security](#6-supply-chain-security) *(NEW)*
7. [Policy Enforcement](#7-policy-enforcement) *(NEW)*
8. [Operational Considerations](#8-operational-considerations)
9. [Implementation Recommendations](#9-implementation-recommendations)
10. [References](#10-references)

---

## 1. Docker Deployment

### 1.1 Single-Container vs Multi-Container Approaches

#### Single-Container (All-in-One)
Suitable for development, testing, and small-scale deployments.

**Pros:**
- Simple deployment with single `docker run` command
- Lower resource overhead for small workloads
- Easier to manage for non-technical users

**Cons:**
- Cannot scale individual components
- Single point of failure
- Resource contention between services
- Not recommended for production

#### Multi-Container (Microservices)
Recommended for production deployments following the principle that each container should have only one concern.

**Architecture Components:**
```
+------------------+     +------------------+     +------------------+
|    Frontend      |     |    API Server    |     |    Worker        |
|    (Next.js)     |     |    (Python)      |     |    (Celery)      |
|    Port 3000     |     |    Port 5001     |     |                  |
+------------------+     +------------------+     +------------------+
         |                       |                       |
         v                       v                       v
+------------------+     +------------------+     +------------------+
|     Nginx        |     |   PostgreSQL     |     |     Redis        |
|   (Reverse Proxy)|     |   (Database)     |     |    (Cache/Queue) |
|    Port 80/443   |     |    Port 5432     |     |    Port 6379     |
+------------------+     +------------------+     +------------------+
         |
         v
+------------------+
|   Vector DB      |
| (Weaviate/Milvus)|
|    Port 8080     |
+------------------+
```

### 1.2 Docker Compose Configurations

#### Development Configuration

```yaml
# docker-compose.dev.yml
# NOTE: The 'version' field is deprecated in Docker Compose v2+ and has been removed.
# Modern Docker Compose uses the Compose Specification directly.

services:
  # Frontend Web Application
  web:
    build:
      context: ./frontend
      dockerfile: Dockerfile.dev
    ports:
      - "3000:3000"
    volumes:
      - ./frontend:/app
      - /app/node_modules
    environment:
      - NODE_ENV=development
      - API_URL=http://api:5001
    depends_on:
      - api
    networks:
      - hyyve-network

  # API Server
  api:
    build:
      context: ./backend
      dockerfile: Dockerfile.dev
    ports:
      - "5001:5001"
    volumes:
      - ./backend:/app
    environment:
      - FLASK_ENV=development
      - DATABASE_URL=postgresql://postgres:postgres@db:5432/hyyve
      - REDIS_URL=redis://redis:6379/0
      - VECTOR_DB_URL=http://weaviate:8080
    depends_on:
      - db
      - redis
      - weaviate
    networks:
      - hyyve-network

  # Background Worker
  worker:
    build:
      context: ./backend
      dockerfile: Dockerfile.dev
    command: celery -A app.celery worker --loglevel=info
    volumes:
      - ./backend:/app
    environment:
      - DATABASE_URL=postgresql://postgres:postgres@db:5432/hyyve
      - REDIS_URL=redis://redis:6379/0
    depends_on:
      - db
      - redis
    networks:
      - hyyve-network

  # PostgreSQL Database
  db:
    image: postgres:16-alpine
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgres
      - POSTGRES_DB=hyyve
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    networks:
      - hyyve-network

  # Redis Cache/Message Broker
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    networks:
      - hyyve-network

  # Vector Database
  weaviate:
    image: semitechnologies/weaviate:1.36.1
    ports:
      - "8080:8080"
    environment:
      - QUERY_DEFAULTS_LIMIT=25
      - AUTHENTICATION_ANONYMOUS_ACCESS_ENABLED=true
      - PERSISTENCE_DATA_PATH=/var/lib/weaviate
      - DEFAULT_VECTORIZER_MODULE=none
      - CLUSTER_HOSTNAME=node1
    volumes:
      - weaviate_data:/var/lib/weaviate
    networks:
      - hyyve-network

volumes:
  postgres_data:
  redis_data:
  weaviate_data:

networks:
  hyyve-network:
    driver: bridge
```

#### Production Configuration

```yaml
# docker-compose.prod.yml
# NOTE: The 'version' field is deprecated in Docker Compose v2+ and has been removed.
# Modern Docker Compose uses the Compose Specification directly.

services:
  # Nginx Reverse Proxy
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./nginx/ssl:/etc/nginx/ssl:ro
    depends_on:
      - web
      - api
    restart: always
    networks:
      - hyyve-network
    healthcheck:
      test: ["CMD", "wget", "-q", "--spider", "http://localhost/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 10s

  # Frontend Web Application
  web:
    image: ${REGISTRY}/hyyve-web:${VERSION:-latest}
    environment:
      - NODE_ENV=production
      - API_URL=${API_URL}
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 1G
        reservations:
          cpus: '0.25'
          memory: 256M
    restart: always
    networks:
      - hyyve-network
    healthcheck:
      test: ["CMD", "wget", "-q", "--spider", "http://localhost:3000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  # API Server
  api:
    image: ${REGISTRY}/hyyve-api:${VERSION:-latest}
    environment:
      - FLASK_ENV=production
      - DATABASE_URL=${DATABASE_URL}
      - REDIS_URL=${REDIS_URL}
      - VECTOR_DB_URL=${VECTOR_DB_URL}
      - SECRET_KEY=${SECRET_KEY}
      - ENCRYPTION_KEY=${ENCRYPTION_KEY}
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 4G
        reservations:
          cpus: '0.5'
          memory: 512M
      replicas: 2
    restart: always
    networks:
      - hyyve-network
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:5001/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  # Background Worker
  worker:
    image: ${REGISTRY}/hyyve-worker:${VERSION:-latest}
    command: celery -A app.celery worker --loglevel=info --concurrency=4
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - REDIS_URL=${REDIS_URL}
      - VECTOR_DB_URL=${VECTOR_DB_URL}
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 4G
        reservations:
          cpus: '0.5'
          memory: 512M
      replicas: 2
    restart: always
    networks:
      - hyyve-network

  # Worker Beat Scheduler
  worker_beat:
    image: ${REGISTRY}/hyyve-worker:${VERSION:-latest}
    command: celery -A app.celery beat --loglevel=info
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - REDIS_URL=${REDIS_URL}
    deploy:
      resources:
        limits:
          cpus: '0.5'
          memory: 512M
    restart: always
    networks:
      - hyyve-network

  # PostgreSQL Database
  db:
    image: postgres:16-alpine
    environment:
      - POSTGRES_USER=${POSTGRES_USER}
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
      - POSTGRES_DB=${POSTGRES_DB}
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./postgres/init:/docker-entrypoint-initdb.d:ro
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 4G
        reservations:
          cpus: '1'
          memory: 2G
    restart: always
    networks:
      - hyyve-network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER} -d ${POSTGRES_DB}"]
      interval: 30s
      timeout: 10s
      retries: 5

  # Redis Cache/Message Broker
  redis:
    image: redis:7-alpine
    command: redis-server --appendonly yes --requirepass ${REDIS_PASSWORD}
    volumes:
      - redis_data:/data
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 2G
        reservations:
          cpus: '0.25'
          memory: 256M
    restart: always
    networks:
      - hyyve-network
    healthcheck:
      test: ["CMD", "redis-cli", "-a", "${REDIS_PASSWORD}", "ping"]
      interval: 30s
      timeout: 10s
      retries: 3

  # Vector Database
  weaviate:
    image: semitechnologies/weaviate:1.36.1
    environment:
      - QUERY_DEFAULTS_LIMIT=25
      - AUTHENTICATION_ANONYMOUS_ACCESS_ENABLED=false
      - AUTHENTICATION_APIKEY_ENABLED=true
      - AUTHENTICATION_APIKEY_ALLOWED_KEYS=${WEAVIATE_API_KEY}
      - AUTHENTICATION_APIKEY_USERS=admin
      - PERSISTENCE_DATA_PATH=/var/lib/weaviate
      - DEFAULT_VECTORIZER_MODULE=none
      - CLUSTER_HOSTNAME=node1
      - ENABLE_MODULES=backup-filesystem
      - BACKUP_FILESYSTEM_PATH=/var/lib/weaviate/backups
    volumes:
      - weaviate_data:/var/lib/weaviate
    deploy:
      resources:
        limits:
          cpus: '4'
          memory: 8G
        reservations:
          cpus: '2'
          memory: 4G
    restart: always
    networks:
      - hyyve-network
    healthcheck:
      test: ["CMD", "wget", "-q", "--spider", "http://localhost:8080/v1/.well-known/ready"]
      interval: 30s
      timeout: 10s
      retries: 3

  # SSRF Proxy (Security)
  ssrf_proxy:
    image: ghcr.io/dify-ai/ssrf_proxy:latest
    environment:
      - SANDBOX_HOST=sandbox
    restart: always
    networks:
      - hyyve-network

  # Code Sandbox
  sandbox:
    image: ghcr.io/dify-ai/sandbox:latest
    environment:
      - SANDBOX_PORT=8194
    restart: always
    networks:
      - hyyve-network

volumes:
  postgres_data:
    driver: local
  redis_data:
    driver: local
  weaviate_data:
    driver: local

networks:
  hyyve-network:
    driver: bridge
    ipam:
      config:
        - subnet: 172.28.0.0/16
```

### 1.3 Resource Requirements and Sizing Guidelines

| Deployment Size | CPU Cores | RAM | Storage | Concurrent Users | Documents |
|----------------|-----------|-----|---------|------------------|-----------|
| **Development** | 4 | 8 GB | 50 GB SSD | 1-5 | < 10K |
| **Small** | 8 | 16 GB | 100 GB SSD | 10-50 | < 100K |
| **Medium** | 16 | 32 GB | 500 GB SSD | 50-200 | < 1M |
| **Large** | 32+ | 64 GB+ | 1 TB+ NVMe | 200-1000 | < 10M |
| **Enterprise** | 64+ | 128 GB+ | 2 TB+ NVMe | 1000+ | 10M+ |

**Component-Specific Resource Allocation:**

| Component | CPU (cores) | Memory | Storage |
|-----------|-------------|--------|---------|
| API Server (per replica) | 0.5-2 | 512MB-4GB | - |
| Worker (per replica) | 0.5-2 | 512MB-4GB | - |
| PostgreSQL | 1-4 | 2GB-8GB | 20GB-500GB |
| Redis | 0.25-1 | 256MB-2GB | 1GB-10GB |
| Vector DB (Weaviate) | 2-8 | 4GB-32GB | 50GB-1TB |
| Nginx | 0.1-0.5 | 128MB-512MB | - |

### 1.4 Environment Variable Configuration Patterns

```bash
# .env.template - Copy to .env and configure

# ===========================================
# APPLICATION SETTINGS
# ===========================================
APP_NAME=Hyyve Platform
APP_ENV=production
APP_DEBUG=false
APP_URL=https://rag.example.com
API_URL=https://api.rag.example.com

# ===========================================
# SECURITY
# ===========================================
SECRET_KEY=<generate-with-openssl-rand-base64-32>
ENCRYPTION_KEY=<generate-with-openssl-rand-base64-32>
JWT_SECRET=<generate-with-openssl-rand-base64-32>
COOKIE_DOMAIN=.example.com

# ===========================================
# DATABASE
# ===========================================
DATABASE_URL=postgresql://user:password@db:5432/hyyve
POSTGRES_USER=hyyve
POSTGRES_PASSWORD=<strong-password>
POSTGRES_DB=hyyve
POSTGRES_HOST=db
POSTGRES_PORT=5432

# ===========================================
# REDIS
# ===========================================
REDIS_URL=redis://:password@redis:6379/0
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=<strong-password>

# ===========================================
# VECTOR DATABASE
# ===========================================
VECTOR_DB_TYPE=weaviate
VECTOR_DB_URL=http://weaviate:8080
WEAVIATE_API_KEY=<api-key>

# ===========================================
# STORAGE
# ===========================================
STORAGE_TYPE=s3  # Options: local, s3, azure, gcs
STORAGE_LOCAL_PATH=/app/storage

# S3 Configuration
S3_ENDPOINT=https://s3.amazonaws.com
S3_BUCKET=hyyve-storage
S3_ACCESS_KEY=<access-key>
S3_SECRET_KEY=<secret-key>
S3_REGION=us-east-1

# ===========================================
# LLM PROVIDERS
# ===========================================
OPENAI_API_KEY=<api-key>
ANTHROPIC_API_KEY=<api-key>
AZURE_OPENAI_ENDPOINT=https://xxx.openai.azure.com
AZURE_OPENAI_API_KEY=<api-key>

# ===========================================
# OBSERVABILITY
# ===========================================
LOG_LEVEL=INFO
LOG_FORMAT=json
SENTRY_DSN=<sentry-dsn>
PROMETHEUS_ENABLED=true
PROMETHEUS_PORT=9090

# ===========================================
# MULTI-TENANCY
# ===========================================
TENANT_ISOLATION=strict  # Options: strict, shared
MAX_TENANTS=100
DEFAULT_TENANT_QUOTA_DOCUMENTS=10000
DEFAULT_TENANT_QUOTA_STORAGE_GB=10

# ===========================================
# LICENSE
# ===========================================
LICENSE_KEY=<license-key>
LICENSE_VALIDATION_MODE=offline  # Options: online, offline
```

### 1.5 Health Checks and Readiness Probes

```yaml
# Health check endpoints to implement

# API Health Check (/health)
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:5001/health"]
  interval: 30s
  timeout: 10s
  retries: 3
  start_period: 40s

# API Readiness Check (/ready)
# Verifies all dependencies are accessible
readinesscheck:
  test: ["CMD", "curl", "-f", "http://localhost:5001/ready"]
  interval: 10s
  timeout: 5s
  retries: 3

# Liveness Check (/live)
# Simple check that the process is running
livenesscheck:
  test: ["CMD", "curl", "-f", "http://localhost:5001/live"]
  interval: 15s
  timeout: 5s
  retries: 3
```

**Health Check Implementation Example (Python/FastAPI):**

```python
# health.py
from fastapi import APIRouter, HTTPException
from sqlalchemy import text
import redis
import aiohttp

router = APIRouter()

@router.get("/health")
async def health_check():
    """Basic health check - returns 200 if service is running"""
    return {"status": "healthy", "service": "hyyve-api"}

@router.get("/ready")
async def readiness_check(db=Depends(get_db), redis_client=Depends(get_redis)):
    """Readiness check - verifies all dependencies"""
    checks = {}

    # Check PostgreSQL
    try:
        await db.execute(text("SELECT 1"))
        checks["postgresql"] = "ok"
    except Exception as e:
        checks["postgresql"] = f"error: {str(e)}"

    # Check Redis
    try:
        await redis_client.ping()
        checks["redis"] = "ok"
    except Exception as e:
        checks["redis"] = f"error: {str(e)}"

    # Check Vector DB
    try:
        async with aiohttp.ClientSession() as session:
            async with session.get(f"{VECTOR_DB_URL}/v1/.well-known/ready") as resp:
                if resp.status == 200:
                    checks["vector_db"] = "ok"
                else:
                    checks["vector_db"] = f"error: status {resp.status}"
    except Exception as e:
        checks["vector_db"] = f"error: {str(e)}"

    all_healthy = all(v == "ok" for v in checks.values())

    if not all_healthy:
        raise HTTPException(status_code=503, detail=checks)

    return {"status": "ready", "checks": checks}

@router.get("/live")
async def liveness_check():
    """Liveness check - simple process check"""
    return {"status": "alive"}
```

---

## 2. Kubernetes Deployment

### 2.1 Helm Chart Best Practices and Structure

**Recommended Chart Structure:**

```
hyyve/
├── Chart.yaml
├── Chart.lock
├── values.yaml
├── values-dev.yaml
├── values-staging.yaml
├── values-prod.yaml
├── README.md
├── .helmignore
├── templates/
│   ├── NOTES.txt
│   ├── _helpers.tpl
│   ├── api/
│   │   ├── deployment.yaml
│   │   ├── service.yaml
│   │   ├── hpa.yaml
│   │   ├── pdb.yaml
│   │   └── serviceaccount.yaml
│   ├── web/
│   │   ├── deployment.yaml
│   │   ├── service.yaml
│   │   └── hpa.yaml
│   ├── worker/
│   │   ├── deployment.yaml
│   │   └── hpa.yaml
│   ├── ingress.yaml
│   ├── configmap.yaml
│   ├── secrets.yaml
│   ├── networkpolicy.yaml
│   └── tests/
│       └── test-connection.yaml
├── charts/
│   ├── postgresql/
│   ├── redis/
│   └── weaviate/
└── ci/
    └── values-ci.yaml
```

**Chart.yaml:**

```yaml
apiVersion: v2
name: hyyve
description: A Helm chart for deploying Hyyve Platform on Kubernetes
type: application
version: 1.0.0
appVersion: "1.0.0"
kubeVersion: ">=1.30.0-0"  # Updated: K8s 1.26-1.29 are EOL

keywords:
  - rag
  - llm
  - ai
  - machine-learning

home: https://github.com/your-org/hyyve
icon: https://your-org.com/logo.png

maintainers:
  - name: Platform Team
    email: platform@your-org.com

dependencies:
  - name: postgresql
    version: "13.x.x"
    repository: "https://charts.bitnami.com/bitnami"
    condition: postgresql.enabled
  - name: redis
    version: "18.x.x"
    repository: "https://charts.bitnami.com/bitnami"
    condition: redis.enabled
  - name: weaviate
    version: "17.x.x"
    repository: "https://weaviate.github.io/weaviate-helm"
    condition: weaviate.enabled

annotations:
  artifacthub.io/license: Apache-2.0
  artifacthub.io/prerelease: "false"
```

**values.yaml (Default Values):**

```yaml
# Global settings
global:
  imageRegistry: ""
  imagePullSecrets: []
  storageClass: ""

# Common settings
nameOverride: ""
fullnameOverride: ""

# Image settings
image:
  repository: your-registry/hyyve
  pullPolicy: IfNotPresent
  tag: ""  # Defaults to Chart.appVersion

# Service Account
serviceAccount:
  create: true
  annotations: {}
  name: ""

# Pod Security Context
podSecurityContext:
  fsGroup: 1000
  runAsNonRoot: true

securityContext:
  runAsUser: 1000
  runAsGroup: 1000
  readOnlyRootFilesystem: true
  allowPrivilegeEscalation: false
  capabilities:
    drop:
      - ALL

# API Server Configuration
api:
  enabled: true
  replicaCount: 2

  image:
    repository: ""  # Uses global if empty
    tag: ""

  resources:
    limits:
      cpu: 2000m
      memory: 4Gi
    requests:
      cpu: 500m
      memory: 512Mi

  autoscaling:
    enabled: true
    minReplicas: 2
    maxReplicas: 10
    targetCPUUtilizationPercentage: 70
    targetMemoryUtilizationPercentage: 80

  podDisruptionBudget:
    enabled: true
    minAvailable: 1

  service:
    type: ClusterIP
    port: 5001

  livenessProbe:
    httpGet:
      path: /live
      port: http
    initialDelaySeconds: 30
    periodSeconds: 15
    timeoutSeconds: 5
    failureThreshold: 3

  readinessProbe:
    httpGet:
      path: /ready
      port: http
    initialDelaySeconds: 10
    periodSeconds: 10
    timeoutSeconds: 5
    failureThreshold: 3

# Web Frontend Configuration
web:
  enabled: true
  replicaCount: 2

  resources:
    limits:
      cpu: 1000m
      memory: 1Gi
    requests:
      cpu: 250m
      memory: 256Mi

  autoscaling:
    enabled: true
    minReplicas: 2
    maxReplicas: 5
    targetCPUUtilizationPercentage: 70

  service:
    type: ClusterIP
    port: 3000

# Worker Configuration
worker:
  enabled: true
  replicaCount: 2
  concurrency: 4

  resources:
    limits:
      cpu: 2000m
      memory: 4Gi
    requests:
      cpu: 500m
      memory: 512Mi

  autoscaling:
    enabled: true
    minReplicas: 2
    maxReplicas: 20
    # Scale based on queue depth using KEDA
    kedaEnabled: false
    kedaScaledObject:
      triggers:
        - type: redis
          metadata:
            listName: celery
            listLength: "10"

# Worker Beat (Scheduler) - Single instance
workerBeat:
  enabled: true
  resources:
    limits:
      cpu: 500m
      memory: 512Mi
    requests:
      cpu: 100m
      memory: 128Mi

# Ingress Configuration
ingress:
  enabled: true
  className: nginx
  annotations:
    nginx.ingress.kubernetes.io/proxy-body-size: "100m"
    nginx.ingress.kubernetes.io/proxy-read-timeout: "300"
    cert-manager.io/cluster-issuer: letsencrypt-prod
  hosts:
    - host: rag.example.com
      paths:
        - path: /
          pathType: Prefix
          service: web
        - path: /api
          pathType: Prefix
          service: api
  tls:
    - secretName: hyyve-tls
      hosts:
        - rag.example.com

# External configuration
config:
  appEnv: production
  logLevel: INFO
  logFormat: json

# Secrets - Use External Secrets Operator in production
secrets:
  create: true
  # For development only - use External Secrets in production
  secretKey: ""
  encryptionKey: ""
  jwtSecret: ""
  databaseUrl: ""
  redisUrl: ""

# External Secrets Operator integration
externalSecrets:
  enabled: false
  secretStoreRef:
    name: vault-backend
    kind: ClusterSecretStore
  refreshInterval: 1h
  data:
    - secretKey: secret-key
      remoteRef:
        key: hyyve/secrets
        property: secret-key

# PostgreSQL (Bitnami subchart)
postgresql:
  enabled: true
  auth:
    username: hyyve
    database: hyyve
    existingSecret: hyyve-db-credentials
  primary:
    persistence:
      enabled: true
      size: 50Gi
    resources:
      limits:
        cpu: 2000m
        memory: 4Gi
      requests:
        cpu: 1000m
        memory: 2Gi

# Redis (Bitnami subchart)
redis:
  enabled: true
  auth:
    existingSecret: hyyve-redis-credentials
  master:
    persistence:
      enabled: true
      size: 10Gi
    resources:
      limits:
        cpu: 1000m
        memory: 2Gi
      requests:
        cpu: 250m
        memory: 256Mi

# Weaviate
weaviate:
  enabled: true
  replicas: 1
  storage:
    size: 100Gi
  resources:
    limits:
      cpu: 4000m
      memory: 8Gi
    requests:
      cpu: 2000m
      memory: 4Gi

# Network Policies
networkPolicy:
  enabled: true

# Pod Topology Spread Constraints
topologySpreadConstraints:
  enabled: true
  maxSkew: 1
  topologyKey: topology.kubernetes.io/zone
  whenUnsatisfiable: ScheduleAnyway
```

### 2.2 ConfigMaps and Secrets Management

**ConfigMap Template:**

```yaml
# templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ include "hyyve.fullname" . }}-config
  labels:
    {{- include "hyyve.labels" . | nindent 4 }}
data:
  APP_ENV: {{ .Values.config.appEnv | quote }}
  LOG_LEVEL: {{ .Values.config.logLevel | quote }}
  LOG_FORMAT: {{ .Values.config.logFormat | quote }}
  VECTOR_DB_URL: {{ printf "http://%s-weaviate:8080" .Release.Name | quote }}
  PROMETHEUS_ENABLED: "true"
  {{- range $key, $value := .Values.config.extra }}
  {{ $key }}: {{ $value | quote }}
  {{- end }}
```

**External Secrets Operator Integration:**

```yaml
# templates/external-secret.yaml
{{- if .Values.externalSecrets.enabled }}
apiVersion: external-secrets.io/v1beta1
kind: ExternalSecret
metadata:
  name: {{ include "hyyve.fullname" . }}-secrets
  labels:
    {{- include "hyyve.labels" . | nindent 4 }}
spec:
  refreshInterval: {{ .Values.externalSecrets.refreshInterval }}
  secretStoreRef:
    name: {{ .Values.externalSecrets.secretStoreRef.name }}
    kind: {{ .Values.externalSecrets.secretStoreRef.kind }}
  target:
    name: {{ include "hyyve.fullname" . }}-secrets
    creationPolicy: Owner
  data:
    {{- range .Values.externalSecrets.data }}
    - secretKey: {{ .secretKey }}
      remoteRef:
        key: {{ .remoteRef.key }}
        property: {{ .remoteRef.property }}
    {{- end }}
{{- end }}
```

**Vault SecretStore Configuration:**

```yaml
# cluster-secret-store.yaml
apiVersion: external-secrets.io/v1beta1
kind: ClusterSecretStore
metadata:
  name: vault-backend
spec:
  provider:
    vault:
      server: "https://vault.example.com"
      path: "secret"
      version: "v2"
      auth:
        kubernetes:
          mountPath: "kubernetes"
          role: "hyyve"
          serviceAccountRef:
            name: "hyyve"
            namespace: "hyyve"
```

### 2.3 Horizontal Pod Autoscaling (HPA) Configuration

**Standard HPA:**

```yaml
# templates/api/hpa.yaml
{{- if .Values.api.autoscaling.enabled }}
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: {{ include "hyyve.fullname" . }}-api
  labels:
    {{- include "hyyve.labels" . | nindent 4 }}
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: {{ include "hyyve.fullname" . }}-api
  minReplicas: {{ .Values.api.autoscaling.minReplicas }}
  maxReplicas: {{ .Values.api.autoscaling.maxReplicas }}
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: {{ .Values.api.autoscaling.targetCPUUtilizationPercentage }}
    - type: Resource
      resource:
        name: memory
        target:
          type: Utilization
          averageUtilization: {{ .Values.api.autoscaling.targetMemoryUtilizationPercentage }}
  behavior:
    scaleDown:
      stabilizationWindowSeconds: 300
      policies:
        - type: Percent
          value: 10
          periodSeconds: 60
    scaleUp:
      stabilizationWindowSeconds: 0
      policies:
        - type: Percent
          value: 100
          periodSeconds: 15
        - type: Pods
          value: 4
          periodSeconds: 15
      selectPolicy: Max
{{- end }}
```

**KEDA ScaledObject for Queue-Based Scaling:**

```yaml
# templates/worker/keda-scaledobject.yaml
{{- if and .Values.worker.autoscaling.kedaEnabled .Values.worker.enabled }}
apiVersion: keda.sh/v1alpha1
kind: ScaledObject
metadata:
  name: {{ include "hyyve.fullname" . }}-worker
  labels:
    {{- include "hyyve.labels" . | nindent 4 }}
spec:
  scaleTargetRef:
    name: {{ include "hyyve.fullname" . }}-worker
  pollingInterval: 15
  cooldownPeriod: 300
  minReplicaCount: {{ .Values.worker.autoscaling.minReplicas }}
  maxReplicaCount: {{ .Values.worker.autoscaling.maxReplicas }}
  triggers:
    - type: redis
      metadata:
        address: {{ printf "%s-redis-master:6379" .Release.Name }}
        passwordFromEnv: REDIS_PASSWORD
        listName: celery
        listLength: "10"
        enableTLS: "false"
{{- end }}
```

### 2.4 Ingress and Service Mesh Considerations

**Nginx Ingress Configuration:**

```yaml
# templates/ingress.yaml
{{- if .Values.ingress.enabled }}
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: {{ include "hyyve.fullname" . }}
  labels:
    {{- include "hyyve.labels" . | nindent 4 }}
  annotations:
    {{- with .Values.ingress.annotations }}
    {{- toYaml . | nindent 4 }}
    {{- end }}
    # Rate limiting
    nginx.ingress.kubernetes.io/limit-rps: "100"
    nginx.ingress.kubernetes.io/limit-connections: "50"
    # Security headers
    nginx.ingress.kubernetes.io/configuration-snippet: |
      add_header X-Frame-Options "SAMEORIGIN" always;
      add_header X-Content-Type-Options "nosniff" always;
      add_header X-XSS-Protection "1; mode=block" always;
      add_header Referrer-Policy "strict-origin-when-cross-origin" always;
spec:
  ingressClassName: {{ .Values.ingress.className }}
  {{- if .Values.ingress.tls }}
  tls:
    {{- range .Values.ingress.tls }}
    - hosts:
        {{- range .hosts }}
        - {{ . | quote }}
        {{- end }}
      secretName: {{ .secretName }}
    {{- end }}
  {{- end }}
  rules:
    {{- range .Values.ingress.hosts }}
    - host: {{ .host | quote }}
      http:
        paths:
          {{- range .paths }}
          - path: {{ .path }}
            pathType: {{ .pathType }}
            backend:
              service:
                name: {{ include "hyyve.fullname" $ }}-{{ .service }}
                port:
                  number: {{ if eq .service "api" }}5001{{ else }}3000{{ end }}
          {{- end }}
    {{- end }}
{{- end }}
```

**Istio Service Mesh Configuration:**

```yaml
# istio/virtual-service.yaml
apiVersion: networking.istio.io/v1beta1
kind: VirtualService
metadata:
  name: hyyve
spec:
  hosts:
    - rag.example.com
  gateways:
    - hyyve-gateway
  http:
    - match:
        - uri:
            prefix: /api
      route:
        - destination:
            host: hyyve-api
            port:
              number: 5001
      retries:
        attempts: 3
        perTryTimeout: 30s
        retryOn: "connect-failure,refused-stream,unavailable,cancelled,resource-exhausted"
      timeout: 60s
    - match:
        - uri:
            prefix: /
      route:
        - destination:
            host: hyyve-web
            port:
              number: 3000

---
apiVersion: networking.istio.io/v1beta1
kind: DestinationRule
metadata:
  name: hyyve-api
spec:
  host: hyyve-api
  trafficPolicy:
    connectionPool:
      tcp:
        maxConnections: 100
      http:
        h2UpgradePolicy: UPGRADE
        http1MaxPendingRequests: 100
        http2MaxRequests: 1000
    loadBalancer:
      simple: LEAST_CONN
    outlierDetection:
      consecutive5xxErrors: 5
      interval: 30s
      baseEjectionTime: 60s
      maxEjectionPercent: 50
```

### 2.5 Persistent Volume Claims for Data Storage

```yaml
# templates/pvc.yaml
{{- if .Values.persistence.enabled }}
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: {{ include "hyyve.fullname" . }}-storage
  labels:
    {{- include "hyyve.labels" . | nindent 4 }}
  {{- if .Values.persistence.annotations }}
  annotations:
    {{- toYaml .Values.persistence.annotations | nindent 4 }}
  {{- end }}
spec:
  accessModes:
    - {{ .Values.persistence.accessMode | default "ReadWriteOnce" }}
  {{- if .Values.persistence.storageClass }}
  storageClassName: {{ .Values.persistence.storageClass }}
  {{- end }}
  resources:
    requests:
      storage: {{ .Values.persistence.size | default "10Gi" }}
{{- end }}
```

**Storage Classes for Different Clouds:**

```yaml
# AWS EBS Storage Class
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: hyyve-ebs
provisioner: ebs.csi.aws.com
parameters:
  type: gp3
  encrypted: "true"
  iops: "3000"
  throughput: "125"
reclaimPolicy: Retain
allowVolumeExpansion: true
volumeBindingMode: WaitForFirstConsumer

---
# GCP PD Storage Class
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: hyyve-pd
provisioner: pd.csi.storage.gke.io
parameters:
  type: pd-ssd
  replication-type: regional-pd
reclaimPolicy: Retain
allowVolumeExpansion: true
volumeBindingMode: WaitForFirstConsumer

---
# Azure Disk Storage Class
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: hyyve-azure
provisioner: disk.csi.azure.com
parameters:
  skuName: Premium_LRS
  cachingMode: ReadOnly
reclaimPolicy: Retain
allowVolumeExpansion: true
volumeBindingMode: WaitForFirstConsumer
```

### 2.6 StatefulSets for Databases

```yaml
# Example PostgreSQL StatefulSet (when not using Bitnami subchart)
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: {{ include "hyyve.fullname" . }}-postgresql
  labels:
    {{- include "hyyve.labels" . | nindent 4 }}
    app.kubernetes.io/component: database
spec:
  serviceName: {{ include "hyyve.fullname" . }}-postgresql
  replicas: 1
  selector:
    matchLabels:
      {{- include "hyyve.selectorLabels" . | nindent 6 }}
      app.kubernetes.io/component: database
  template:
    metadata:
      labels:
        {{- include "hyyve.labels" . | nindent 8 }}
        app.kubernetes.io/component: database
    spec:
      securityContext:
        fsGroup: 999
        runAsUser: 999
        runAsNonRoot: true
      containers:
        - name: postgresql
          image: postgres:16-alpine
          imagePullPolicy: IfNotPresent
          ports:
            - containerPort: 5432
              name: postgresql
          env:
            - name: POSTGRES_USER
              valueFrom:
                secretKeyRef:
                  name: {{ include "hyyve.fullname" . }}-db-credentials
                  key: username
            - name: POSTGRES_PASSWORD
              valueFrom:
                secretKeyRef:
                  name: {{ include "hyyve.fullname" . }}-db-credentials
                  key: password
            - name: POSTGRES_DB
              value: hyyve
            - name: PGDATA
              value: /var/lib/postgresql/data/pgdata
          volumeMounts:
            - name: data
              mountPath: /var/lib/postgresql/data
          resources:
            {{- toYaml .Values.postgresql.resources | nindent 12 }}
          livenessProbe:
            exec:
              command:
                - pg_isready
                - -U
                - $(POSTGRES_USER)
                - -d
                - $(POSTGRES_DB)
            initialDelaySeconds: 30
            periodSeconds: 10
            timeoutSeconds: 5
            failureThreshold: 6
          readinessProbe:
            exec:
              command:
                - pg_isready
                - -U
                - $(POSTGRES_USER)
                - -d
                - $(POSTGRES_DB)
            initialDelaySeconds: 5
            periodSeconds: 10
            timeoutSeconds: 5
            failureThreshold: 6
  volumeClaimTemplates:
    - metadata:
        name: data
      spec:
        accessModes:
          - ReadWriteOnce
        {{- if .Values.postgresql.storageClass }}
        storageClassName: {{ .Values.postgresql.storageClass }}
        {{- end }}
        resources:
          requests:
            storage: {{ .Values.postgresql.persistence.size | default "50Gi" }}
```

---

## 3. Air-Gapped Environments

### 3.1 Offline Installation Packages

**Package Structure:**

```
hyyve-offline-bundle-v1.0.0/
├── README.md
├── install.sh
├── uninstall.sh
├── images/
│   ├── hyyve-api-v1.0.0.tar
│   ├── hyyve-web-v1.0.0.tar
│   ├── hyyve-worker-v1.0.0.tar
│   ├── postgres-16-alpine.tar
│   ├── redis-7-alpine.tar
│   ├── weaviate-1.24.1.tar
│   ├── nginx-alpine.tar
│   └── manifest.json
├── helm/
│   ├── hyyve-1.0.0.tgz
│   └── dependencies/
│       ├── postgresql-13.0.0.tgz
│       ├── redis-18.0.0.tgz
│       └── weaviate-17.0.0.tgz
├── binaries/
│   ├── helm-v3.14.0-linux-amd64.tar.gz
│   ├── kubectl-v1.29.0-linux-amd64.tar.gz
│   └── k3s-v1.33.1+k3s1
├── licenses/
│   └── offline-license.json
└── checksums.sha256
```

**Offline Installation Script:**

```bash
#!/bin/bash
# install.sh - Air-gapped installation script for Hyyve Platform

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
NAMESPACE="${NAMESPACE:-hyyve}"
REGISTRY="${REGISTRY:-localhost:5000}"
HELM_VALUES="${HELM_VALUES:-values-airgap.yaml}"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

log_info() { echo -e "${GREEN}[INFO]${NC} $1"; }
log_warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# Verify checksums
verify_checksums() {
    log_info "Verifying package integrity..."
    cd "$SCRIPT_DIR"
    sha256sum -c checksums.sha256
    if [ $? -ne 0 ]; then
        log_error "Checksum verification failed!"
        exit 1
    fi
    log_info "Checksum verification passed."
}

# Load images into local registry
load_images() {
    log_info "Loading container images into registry: $REGISTRY"

    for image_tar in "$SCRIPT_DIR/images/"*.tar; do
        image_name=$(basename "$image_tar" .tar)
        log_info "Loading $image_name..."

        # Load image
        docker load -i "$image_tar"

        # Get the loaded image name
        loaded_image=$(docker images --format "{{.Repository}}:{{.Tag}}" | grep -m1 "${image_name%%-v*}" || true)

        if [ -n "$loaded_image" ]; then
            # Tag for private registry
            new_tag="$REGISTRY/${loaded_image##*/}"
            docker tag "$loaded_image" "$new_tag"

            # Push to private registry
            docker push "$new_tag"
            log_info "Pushed $new_tag"
        fi
    done
}

# Validate license
validate_license() {
    log_info "Validating offline license..."

    if [ ! -f "$SCRIPT_DIR/licenses/offline-license.json" ]; then
        log_error "License file not found!"
        exit 1
    fi

    # Validate license signature (simplified example)
    python3 -c "
import json
import hashlib
from datetime import datetime

with open('$SCRIPT_DIR/licenses/offline-license.json') as f:
    license_data = json.load(f)

# Check expiration
expiry = datetime.fromisoformat(license_data['expires_at'].replace('Z', '+00:00'))
if expiry < datetime.now(expiry.tzinfo):
    print('License has expired!')
    exit(1)

# Check node limit
max_nodes = license_data.get('max_nodes', 0)
print(f'License valid until {expiry}, max nodes: {max_nodes}')
"

    if [ $? -ne 0 ]; then
        log_error "License validation failed!"
        exit 1
    fi

    log_info "License validation passed."
}

# Install Helm charts
install_charts() {
    log_info "Installing Hyyve Platform..."

    # Create namespace
    kubectl create namespace "$NAMESPACE" --dry-run=client -o yaml | kubectl apply -f -

    # Install from local charts
    helm upgrade --install hyyve \
        "$SCRIPT_DIR/helm/hyyve-1.0.0.tgz" \
        --namespace "$NAMESPACE" \
        --values "$SCRIPT_DIR/helm/$HELM_VALUES" \
        --set global.imageRegistry="$REGISTRY" \
        --set postgresql.image.registry="$REGISTRY" \
        --set redis.image.registry="$REGISTRY" \
        --wait \
        --timeout 10m

    log_info "Installation complete!"
}

# Main
main() {
    log_info "Starting air-gapped installation of Hyyve Platform"

    verify_checksums
    validate_license
    load_images
    install_charts

    log_info "Installation successful!"
    log_info "Access the application at: kubectl get ingress -n $NAMESPACE"
}

main "$@"
```

### 3.2 Private Container Registry Setup

**Harbor Deployment for Air-Gapped:**

```yaml
# harbor-values.yaml
expose:
  type: nodePort
  tls:
    enabled: true
    certSource: secret
    secret:
      secretName: harbor-tls
  nodePort:
    ports:
      https:
        nodePort: 30003

externalURL: https://harbor.internal.example.com:30003

persistence:
  enabled: true
  resourcePolicy: "keep"
  persistentVolumeClaim:
    registry:
      storageClass: "local-storage"
      size: 500Gi
    chartmuseum:
      storageClass: "local-storage"
      size: 10Gi
    trivy:
      storageClass: "local-storage"
      size: 5Gi

# Enable vulnerability scanning
trivy:
  enabled: true
  # For air-gapped, pre-download vulnerability database
  offlineScan: true

# Disable external connections
updateStrategy:
  type: Recreate

harborAdminPassword: "Harbor12345"

# Replication for syncing from external Harbor (pre-air-gap)
replication:
  enabled: false
```

**Image Sync Script (Pre-Air-Gap):**

```bash
#!/bin/bash
# sync-images.sh - Sync required images for offline bundle

IMAGES=(
    "your-registry/hyyve-api:v1.0.0"
    "your-registry/hyyve-web:v1.0.0"
    "your-registry/hyyve-worker:v1.0.0"
    "postgres:16-alpine"
    "redis:7-alpine"
    "semitechnologies/weaviate:1.36.1"
    "nginx:alpine"
    "bitnami/postgresql:16"
    "bitnami/redis:7.2"
)

OUTPUT_DIR="./images"
mkdir -p "$OUTPUT_DIR"

for image in "${IMAGES[@]}"; do
    echo "Pulling $image..."
    docker pull "$image"

    # Create safe filename
    filename=$(echo "$image" | tr '/:' '-')

    echo "Saving $image to $OUTPUT_DIR/$filename.tar..."
    docker save "$image" -o "$OUTPUT_DIR/$filename.tar"
done

# Generate manifest
echo '{"images": [' > "$OUTPUT_DIR/manifest.json"
first=true
for image in "${IMAGES[@]}"; do
    if [ "$first" = true ]; then
        first=false
    else
        echo ',' >> "$OUTPUT_DIR/manifest.json"
    fi
    filename=$(echo "$image" | tr '/:' '-')
    echo "  {\"image\": \"$image\", \"file\": \"$filename.tar\"}" >> "$OUTPUT_DIR/manifest.json"
done
echo ']}' >> "$OUTPUT_DIR/manifest.json"

# Generate checksums
cd "$OUTPUT_DIR"
sha256sum *.tar manifest.json > checksums.sha256

echo "Image sync complete!"
```

### 3.3 License Validation Without Internet

**Offline License Schema:**

```json
{
  "license_id": "lic_abc123xyz",
  "organization": "Acme Corporation",
  "product": "Hyyve Platform",
  "edition": "enterprise",
  "issued_at": "2026-01-01T00:00:00Z",
  "expires_at": "2027-01-01T00:00:00Z",
  "features": {
    "max_tenants": 100,
    "max_users_per_tenant": 1000,
    "max_documents": 10000000,
    "max_nodes": 10,
    "sso_enabled": true,
    "audit_logging": true,
    "custom_models": true,
    "priority_support": true
  },
  "hardware_binding": {
    "enabled": true,
    "fingerprints": [
      "hw_fp_123abc",
      "hw_fp_456def"
    ]
  },
  "signature": "base64-encoded-ed25519-signature"
}
```

**License Validation Code:**

```python
# license_validator.py
import json
import hashlib
import base64
from datetime import datetime, timezone
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.asymmetric.ed25519 import Ed25519PublicKey
from cryptography.exceptions import InvalidSignature
import subprocess

# Embedded public key (for offline validation)
PUBLIC_KEY_B64 = "MCowBQYDK2VwAyEA..."  # Ed25519 public key

class LicenseValidator:
    def __init__(self, license_path: str):
        self.license_path = license_path
        self.license_data = None
        self._load_license()

    def _load_license(self):
        with open(self.license_path, 'r') as f:
            self.license_data = json.load(f)

    def _get_hardware_fingerprint(self) -> str:
        """Generate hardware fingerprint from system information."""
        try:
            # Get CPU info
            cpu_id = subprocess.check_output(
                ["cat", "/sys/class/dmi/id/product_uuid"],
                text=True
            ).strip()
        except:
            cpu_id = "unknown"

        try:
            # Get primary MAC address
            mac = subprocess.check_output(
                ["cat", "/sys/class/net/eth0/address"],
                text=True
            ).strip()
        except:
            mac = "unknown"

        # Create fingerprint
        fingerprint_data = f"{cpu_id}:{mac}"
        return hashlib.sha256(fingerprint_data.encode()).hexdigest()[:16]

    def _verify_signature(self) -> bool:
        """Verify the license signature."""
        try:
            # Extract signature
            signature_b64 = self.license_data.pop('signature')
            signature = base64.b64decode(signature_b64)

            # Reconstruct signed data
            signed_data = json.dumps(self.license_data, sort_keys=True).encode()

            # Load public key
            public_key_bytes = base64.b64decode(PUBLIC_KEY_B64)
            public_key = Ed25519PublicKey.from_public_bytes(public_key_bytes)

            # Verify
            public_key.verify(signature, signed_data)

            # Restore signature
            self.license_data['signature'] = signature_b64
            return True
        except InvalidSignature:
            return False
        except Exception as e:
            print(f"Signature verification error: {e}")
            return False

    def validate(self) -> dict:
        """Perform full license validation."""
        result = {
            "valid": False,
            "errors": [],
            "warnings": [],
            "features": {}
        }

        # 1. Verify signature
        if not self._verify_signature():
            result["errors"].append("Invalid license signature")
            return result

        # 2. Check expiration
        expires_at = datetime.fromisoformat(
            self.license_data['expires_at'].replace('Z', '+00:00')
        )
        now = datetime.now(timezone.utc)

        if expires_at < now:
            result["errors"].append(f"License expired on {expires_at}")
            return result

        days_remaining = (expires_at - now).days
        if days_remaining < 30:
            result["warnings"].append(
                f"License expires in {days_remaining} days"
            )

        # 3. Verify hardware binding (if enabled)
        hw_binding = self.license_data.get('hardware_binding', {})
        if hw_binding.get('enabled', False):
            current_fingerprint = self._get_hardware_fingerprint()
            allowed_fingerprints = hw_binding.get('fingerprints', [])

            if current_fingerprint not in allowed_fingerprints:
                result["errors"].append(
                    f"Hardware fingerprint mismatch. Current: {current_fingerprint}"
                )
                return result

        # 4. Extract features
        result["features"] = self.license_data.get('features', {})
        result["valid"] = True
        result["organization"] = self.license_data.get('organization')
        result["expires_at"] = self.license_data.get('expires_at')

        return result


# Usage
if __name__ == "__main__":
    validator = LicenseValidator("/etc/hyyve/license.json")
    result = validator.validate()

    if result["valid"]:
        print(f"License valid for: {result['organization']}")
        print(f"Expires: {result['expires_at']}")
        print(f"Features: {result['features']}")
    else:
        print(f"License invalid: {result['errors']}")
```

### 3.4 Update Mechanisms for Disconnected Environments

**Update Package Structure:**

```
hyyve-update-v1.0.0-to-v1.1.0/
├── README.md
├── CHANGELOG.md
├── update.sh
├── rollback.sh
├── pre-update-checks.sh
├── post-update-checks.sh
├── images/
│   ├── hyyve-api-v1.1.0.tar
│   ├── hyyve-web-v1.1.0.tar
│   └── hyyve-worker-v1.1.0.tar
├── helm/
│   └── hyyve-1.1.0.tgz
├── migrations/
│   └── 001_v1.0.0_to_v1.1.0.sql
└── checksums.sha256
```

**Update Script:**

```bash
#!/bin/bash
# update.sh - Air-gapped update script

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
NAMESPACE="${NAMESPACE:-hyyve}"
REGISTRY="${REGISTRY:-localhost:5000}"
BACKUP_DIR="/var/backups/hyyve"

log_info() { echo "[INFO] $1"; }
log_error() { echo "[ERROR] $1"; exit 1; }

# Pre-update checks
pre_update_checks() {
    log_info "Running pre-update checks..."

    # Check current version
    current_version=$(helm list -n "$NAMESPACE" -o json | jq -r '.[0].chart' | grep -oP '\d+\.\d+\.\d+')
    log_info "Current version: $current_version"

    # Verify update path
    source_version="1.0.0"
    target_version="1.1.0"

    if [ "$current_version" != "$source_version" ]; then
        log_error "Update requires version $source_version, found $current_version"
    fi

    # Check cluster health
    kubectl get nodes -o json | jq -e '.items | all(.status.conditions[] | select(.type=="Ready") | .status == "True")' > /dev/null || \
        log_error "Not all nodes are ready"

    # Check available disk space
    available_space=$(df /var | tail -1 | awk '{print $4}')
    required_space=10485760  # 10GB in KB
    if [ "$available_space" -lt "$required_space" ]; then
        log_error "Insufficient disk space. Required: 10GB, Available: $((available_space/1024/1024))GB"
    fi

    log_info "Pre-update checks passed"
}

# Create backup
create_backup() {
    log_info "Creating backup..."

    timestamp=$(date +%Y%m%d_%H%M%S)
    backup_path="$BACKUP_DIR/backup_$timestamp"
    mkdir -p "$backup_path"

    # Backup Helm release
    helm get values hyyve -n "$NAMESPACE" -o yaml > "$backup_path/helm-values.yaml"
    helm get manifest hyyve -n "$NAMESPACE" > "$backup_path/helm-manifest.yaml"

    # Backup secrets
    kubectl get secrets -n "$NAMESPACE" -o yaml > "$backup_path/secrets.yaml"

    # Backup database (using pg_dump in pod)
    kubectl exec -n "$NAMESPACE" deploy/hyyve-postgresql -- \
        pg_dump -U postgres hyyve > "$backup_path/database.sql"

    # Create Velero backup if available
    if kubectl get crd backups.velero.io &> /dev/null; then
        velero backup create "pre-update-$timestamp" \
            --include-namespaces "$NAMESPACE" \
            --wait
    fi

    log_info "Backup created at $backup_path"
    echo "$backup_path" > /tmp/last_backup_path
}

# Load new images
load_images() {
    log_info "Loading new container images..."

    for image_tar in "$SCRIPT_DIR/images/"*.tar; do
        image_name=$(basename "$image_tar" .tar)
        log_info "Loading $image_name..."

        docker load -i "$image_tar"
        loaded_image=$(docker images --format "{{.Repository}}:{{.Tag}}" | grep -m1 "${image_name%%-v*}")

        new_tag="$REGISTRY/${loaded_image##*/}"
        docker tag "$loaded_image" "$new_tag"
        docker push "$new_tag"
    done
}

# Run migrations
run_migrations() {
    log_info "Running database migrations..."

    for migration in "$SCRIPT_DIR/migrations/"*.sql; do
        log_info "Applying migration: $(basename "$migration")"

        kubectl exec -n "$NAMESPACE" deploy/hyyve-postgresql -- \
            psql -U postgres -d hyyve -f - < "$migration"
    done
}

# Perform Helm upgrade
helm_upgrade() {
    log_info "Upgrading Helm release..."

    helm upgrade hyyve \
        "$SCRIPT_DIR/helm/hyyve-1.1.0.tgz" \
        --namespace "$NAMESPACE" \
        --reuse-values \
        --set global.imageRegistry="$REGISTRY" \
        --wait \
        --timeout 10m
}

# Post-update checks
post_update_checks() {
    log_info "Running post-update checks..."

    # Wait for all pods to be ready
    kubectl rollout status deployment -n "$NAMESPACE" --timeout=5m

    # Run health checks
    api_pod=$(kubectl get pod -n "$NAMESPACE" -l app.kubernetes.io/component=api -o jsonpath='{.items[0].metadata.name}')
    kubectl exec -n "$NAMESPACE" "$api_pod" -- curl -sf http://localhost:5001/health || \
        log_error "API health check failed"

    log_info "Post-update checks passed"
}

# Main
main() {
    log_info "Starting update to v1.1.0"

    pre_update_checks
    create_backup
    load_images
    run_migrations
    helm_upgrade
    post_update_checks

    log_info "Update completed successfully!"
}

main "$@"
```

### 3.5 Dependency Bundling Strategies

**Complete Dependency List:**

```yaml
# dependencies.yaml - All dependencies for air-gapped deployment

container_images:
  # Core application
  - name: hyyve-api
    versions: ["1.0.0", "1.1.0"]
  - name: hyyve-web
    versions: ["1.0.0", "1.1.0"]
  - name: hyyve-worker
    versions: ["1.0.0", "1.1.0"]

  # Databases
  - name: postgres
    versions: ["16-alpine"]
  - name: redis
    versions: ["7-alpine"]
  - name: semitechnologies/weaviate
    versions: ["1.24.1"]

  # Infrastructure
  - name: nginx
    versions: ["alpine"]
  - name: busybox
    versions: ["1.36"]

  # Monitoring (optional)
  - name: prom/prometheus
    versions: ["v2.48.0"]
  - name: grafana/grafana
    versions: ["10.2.0"]
  - name: grafana/loki
    versions: ["2.9.2"]

helm_charts:
  - name: hyyve
    repository: local
    version: "1.0.0"
  - name: postgresql
    repository: https://charts.bitnami.com/bitnami
    version: "13.4.0"
  - name: redis
    repository: https://charts.bitnami.com/bitnami
    version: "18.6.0"
  - name: weaviate
    repository: https://weaviate.github.io/weaviate-helm
    version: "17.0.0"
  - name: kube-prometheus-stack
    repository: https://prometheus-community.github.io/helm-charts
    version: "55.5.0"
    optional: true

system_packages:
  # For RHEL/CentOS
  rhel:
    - containerd.io
    - docker-ce
    - docker-ce-cli
    - docker-compose-plugin
  # For Ubuntu/Debian
  debian:
    - containerd.io
    - docker-ce
    - docker-ce-cli
    - docker-compose-plugin

binaries:
  - name: kubectl
    version: "1.29.0"
    platforms: ["linux-amd64", "linux-arm64", "darwin-amd64", "darwin-arm64"]
  - name: helm
    version: "3.14.0"
    platforms: ["linux-amd64", "linux-arm64", "darwin-amd64", "darwin-arm64"]
  - name: k3s
    version: "1.29.0+k3s1"
    platforms: ["linux-amd64", "linux-arm64"]
  - name: velero
    version: "1.13.0"
    platforms: ["linux-amd64", "linux-arm64"]
```

---

## 4. Infrastructure as Code

### 4.1 Terraform Modules for Cloud Deployment

**Module Structure:**

```
terraform/
├── modules/
│   ├── network/
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   ├── outputs.tf
│   │   └── versions.tf
│   ├── kubernetes/
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   ├── outputs.tf
│   │   └── versions.tf
│   ├── database/
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   ├── outputs.tf
│   │   └── versions.tf
│   └── storage/
│       ├── main.tf
│       ├── variables.tf
│       ├── outputs.tf
│       └── versions.tf
├── environments/
│   ├── dev/
│   │   ├── main.tf
│   │   ├── terraform.tfvars
│   │   └── backend.tf
│   ├── staging/
│   │   └── ...
│   └── prod/
│       └── ...
└── providers/
    ├── aws/
    │   └── main.tf
    ├── gcp/
    │   └── main.tf
    └── azure/
        └── main.tf
```

**AWS EKS Module:**

```hcl
# modules/kubernetes/aws/main.tf

terraform {
  required_version = ">= 1.5.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "~> 2.25"
    }
    helm = {
      source  = "hashicorp/helm"
      version = "~> 2.12"
    }
  }
}

# EKS Cluster
module "eks" {
  source  = "terraform-aws-modules/eks/aws"
  version = "~> 21.0"

  cluster_name    = var.cluster_name
  cluster_version = var.kubernetes_version

  vpc_id     = var.vpc_id
  subnet_ids = var.private_subnet_ids

  cluster_endpoint_public_access  = var.public_access
  cluster_endpoint_private_access = true

  # Cluster add-ons
  cluster_addons = {
    coredns = {
      most_recent = true
    }
    kube-proxy = {
      most_recent = true
    }
    vpc-cni = {
      most_recent = true
    }
    aws-ebs-csi-driver = {
      most_recent = true
    }
  }

  # Managed node groups
  eks_managed_node_groups = {
    # System node group
    system = {
      name           = "${var.cluster_name}-system"
      instance_types = var.system_node_instance_types

      min_size     = var.system_node_min_size
      max_size     = var.system_node_max_size
      desired_size = var.system_node_desired_size

      labels = {
        "node-type" = "system"
      }

      taints = []
    }

    # Application node group
    application = {
      name           = "${var.cluster_name}-app"
      instance_types = var.app_node_instance_types

      min_size     = var.app_node_min_size
      max_size     = var.app_node_max_size
      desired_size = var.app_node_desired_size

      labels = {
        "node-type" = "application"
      }

      taints = []
    }

    # Worker node group (for background jobs)
    worker = {
      name           = "${var.cluster_name}-worker"
      instance_types = var.worker_node_instance_types

      min_size     = var.worker_node_min_size
      max_size     = var.worker_node_max_size
      desired_size = var.worker_node_desired_size

      labels = {
        "node-type" = "worker"
      }

      taints = [
        {
          key    = "workload"
          value  = "worker"
          effect = "NO_SCHEDULE"
        }
      ]
    }
  }

  # IRSA for external-secrets
  enable_irsa = true

  # Cluster security group rules
  cluster_security_group_additional_rules = {
    ingress_nodes_ephemeral_ports = {
      description                = "Node to node ingress"
      protocol                   = "-1"
      from_port                  = 0
      to_port                    = 0
      type                       = "ingress"
      source_node_security_group = true
    }
  }

  tags = var.tags
}

# AWS Load Balancer Controller
module "aws_load_balancer_controller" {
  source  = "terraform-aws-modules/iam/aws//modules/iam-role-for-service-accounts-eks"
  version = "~> 5.0"

  role_name                              = "${var.cluster_name}-aws-lbc"
  attach_load_balancer_controller_policy = true

  oidc_providers = {
    main = {
      provider_arn               = module.eks.oidc_provider_arn
      namespace_service_accounts = ["kube-system:aws-load-balancer-controller"]
    }
  }

  tags = var.tags
}

resource "helm_release" "aws_load_balancer_controller" {
  name       = "aws-load-balancer-controller"
  repository = "https://aws.github.io/eks-charts"
  chart      = "aws-load-balancer-controller"
  namespace  = "kube-system"
  version    = "1.7.0"

  set {
    name  = "clusterName"
    value = module.eks.cluster_name
  }

  set {
    name  = "serviceAccount.create"
    value = "true"
  }

  set {
    name  = "serviceAccount.annotations.eks\\.amazonaws\\.com/role-arn"
    value = module.aws_load_balancer_controller.iam_role_arn
  }

  depends_on = [module.eks]
}

# External Secrets Operator
module "external_secrets_irsa" {
  source  = "terraform-aws-modules/iam/aws//modules/iam-role-for-service-accounts-eks"
  version = "~> 5.0"

  role_name = "${var.cluster_name}-external-secrets"

  attach_external_secrets_policy = true

  oidc_providers = {
    main = {
      provider_arn               = module.eks.oidc_provider_arn
      namespace_service_accounts = ["external-secrets:external-secrets"]
    }
  }

  tags = var.tags
}

# Outputs
output "cluster_endpoint" {
  value = module.eks.cluster_endpoint
}

output "cluster_certificate_authority_data" {
  value = module.eks.cluster_certificate_authority_data
}

output "cluster_name" {
  value = module.eks.cluster_name
}
```

**Variables for AWS Module:**

```hcl
# modules/kubernetes/aws/variables.tf

variable "cluster_name" {
  description = "Name of the EKS cluster"
  type        = string
}

variable "kubernetes_version" {
  description = "Kubernetes version"
  type        = string
  default     = "1.33"  # Updated: K8s 1.29 is EOL, use 1.30+ minimum
}

variable "vpc_id" {
  description = "VPC ID"
  type        = string
}

variable "private_subnet_ids" {
  description = "List of private subnet IDs"
  type        = list(string)
}

variable "public_access" {
  description = "Enable public access to cluster endpoint"
  type        = bool
  default     = false
}

# System nodes
variable "system_node_instance_types" {
  description = "Instance types for system node group"
  type        = list(string)
  default     = ["m6i.large"]
}

variable "system_node_min_size" {
  type    = number
  default = 2
}

variable "system_node_max_size" {
  type    = number
  default = 4
}

variable "system_node_desired_size" {
  type    = number
  default = 2
}

# Application nodes
variable "app_node_instance_types" {
  description = "Instance types for application node group"
  type        = list(string)
  default     = ["m6i.xlarge"]
}

variable "app_node_min_size" {
  type    = number
  default = 2
}

variable "app_node_max_size" {
  type    = number
  default = 10
}

variable "app_node_desired_size" {
  type    = number
  default = 3
}

# Worker nodes
variable "worker_node_instance_types" {
  description = "Instance types for worker node group"
  type        = list(string)
  default     = ["c6i.xlarge"]
}

variable "worker_node_min_size" {
  type    = number
  default = 1
}

variable "worker_node_max_size" {
  type    = number
  default = 20
}

variable "worker_node_desired_size" {
  type    = number
  default = 2
}

variable "tags" {
  description = "Tags to apply to resources"
  type        = map(string)
  default     = {}
}
```

### 4.2 Pulumi Alternatives

```typescript
// infrastructure/index.ts - Pulumi example

import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as eks from "@pulumi/eks";
import * as k8s from "@pulumi/kubernetes";

const config = new pulumi.Config();
const projectName = config.get("projectName") || "hyyve";
const environment = pulumi.getStack();

// VPC
const vpc = new aws.ec2.Vpc(`${projectName}-vpc`, {
    cidrBlock: "10.0.0.0/16",
    enableDnsHostnames: true,
    enableDnsSupport: true,
    tags: {
        Name: `${projectName}-${environment}-vpc`,
        Environment: environment,
    },
});

// Subnets
const azs = ["us-east-1a", "us-east-1b", "us-east-1c"];
const privateSubnets: aws.ec2.Subnet[] = [];
const publicSubnets: aws.ec2.Subnet[] = [];

azs.forEach((az, index) => {
    const publicSubnet = new aws.ec2.Subnet(`${projectName}-public-${index}`, {
        vpcId: vpc.id,
        cidrBlock: `10.0.${index * 2}.0/24`,
        availabilityZone: az,
        mapPublicIpOnLaunch: true,
        tags: {
            Name: `${projectName}-${environment}-public-${az}`,
            "kubernetes.io/role/elb": "1",
        },
    });
    publicSubnets.push(publicSubnet);

    const privateSubnet = new aws.ec2.Subnet(`${projectName}-private-${index}`, {
        vpcId: vpc.id,
        cidrBlock: `10.0.${index * 2 + 1}.0/24`,
        availabilityZone: az,
        tags: {
            Name: `${projectName}-${environment}-private-${az}`,
            "kubernetes.io/role/internal-elb": "1",
        },
    });
    privateSubnets.push(privateSubnet);
});

// EKS Cluster
const cluster = new eks.Cluster(`${projectName}-cluster`, {
    vpcId: vpc.id,
    privateSubnetIds: privateSubnets.map(s => s.id),
    publicSubnetIds: publicSubnets.map(s => s.id),
    instanceType: "m6i.xlarge",
    desiredCapacity: 3,
    minSize: 2,
    maxSize: 10,
    nodeAssociatePublicIpAddress: false,
    enabledClusterLogTypes: [
        "api",
        "audit",
        "authenticator",
        "controllerManager",
        "scheduler",
    ],
    tags: {
        Environment: environment,
        Project: projectName,
    },
});

// K8s Provider
const k8sProvider = new k8s.Provider(`${projectName}-k8s`, {
    kubeconfig: cluster.kubeconfig,
});

// Namespace
const namespace = new k8s.core.v1.Namespace(`${projectName}-ns`, {
    metadata: {
        name: projectName,
    },
}, { provider: k8sProvider });

// Deploy Hyyve via Helm
const agenticRag = new k8s.helm.v3.Release(`${projectName}-release`, {
    chart: "hyyve",
    repositoryOpts: {
        repo: "https://charts.your-org.com",
    },
    namespace: namespace.metadata.name,
    values: {
        global: {
            imageRegistry: config.get("imageRegistry"),
        },
        api: {
            replicaCount: 3,
            autoscaling: {
                enabled: true,
                minReplicas: 2,
                maxReplicas: 10,
            },
        },
        postgresql: {
            enabled: false, // Use RDS
        },
        externalDatabase: {
            host: rds.address, // Reference to RDS instance
            port: 5432,
            database: "hyyve",
        },
    },
}, { provider: k8sProvider });

// Exports
export const vpcId = vpc.id;
export const clusterName = cluster.eksCluster.name;
export const kubeconfig = pulumi.secret(cluster.kubeconfig);
```

### 4.3 Multi-Cloud Support

**Root Module for Multi-Cloud:**

```hcl
# main.tf - Multi-cloud deployment

variable "cloud_provider" {
  description = "Cloud provider: aws, gcp, or azure"
  type        = string
  validation {
    condition     = contains(["aws", "gcp", "azure"], var.cloud_provider)
    error_message = "cloud_provider must be aws, gcp, or azure"
  }
}

variable "environment" {
  description = "Environment name"
  type        = string
}

variable "project_name" {
  description = "Project name"
  type        = string
  default     = "hyyve"
}

# AWS
module "aws" {
  source = "./providers/aws"
  count  = var.cloud_provider == "aws" ? 1 : 0

  project_name = var.project_name
  environment  = var.environment
  region       = var.aws_region

  vpc_cidr             = var.vpc_cidr
  kubernetes_version   = var.kubernetes_version
  node_instance_types  = var.node_instance_types
  node_min_size        = var.node_min_size
  node_max_size        = var.node_max_size
  node_desired_size    = var.node_desired_size
}

# GCP
module "gcp" {
  source = "./providers/gcp"
  count  = var.cloud_provider == "gcp" ? 1 : 0

  project_name = var.project_name
  environment  = var.environment
  project_id   = var.gcp_project_id
  region       = var.gcp_region

  vpc_cidr            = var.vpc_cidr
  kubernetes_version  = var.kubernetes_version
  node_machine_type   = var.gcp_node_machine_type
  node_min_count      = var.node_min_size
  node_max_count      = var.node_max_size
  node_count          = var.node_desired_size
}

# Azure
module "azure" {
  source = "./providers/azure"
  count  = var.cloud_provider == "azure" ? 1 : 0

  project_name        = var.project_name
  environment         = var.environment
  location            = var.azure_location
  resource_group_name = var.azure_resource_group

  vnet_address_space = [var.vpc_cidr]
  kubernetes_version = var.kubernetes_version
  node_vm_size       = var.azure_node_vm_size
  node_min_count     = var.node_min_size
  node_max_count     = var.node_max_size
  node_count         = var.node_desired_size
}

# Outputs
output "cluster_endpoint" {
  value = coalesce(
    try(module.aws[0].cluster_endpoint, null),
    try(module.gcp[0].cluster_endpoint, null),
    try(module.azure[0].cluster_endpoint, null)
  )
}

output "cluster_name" {
  value = coalesce(
    try(module.aws[0].cluster_name, null),
    try(module.gcp[0].cluster_name, null),
    try(module.azure[0].cluster_name, null)
  )
}
```

### 4.4 Reference Architectures

**AWS Reference Architecture:**

```
                                    ┌─────────────────────────────────────────┐
                                    │              AWS Cloud                   │
                                    └─────────────────────────────────────────┘
                                                      │
                    ┌─────────────────────────────────┼─────────────────────────────────┐
                    │                                 │                                 │
              ┌─────┴─────┐                    ┌──────┴──────┐                   ┌──────┴──────┐
              │   AZ-1    │                    │    AZ-2     │                   │    AZ-3     │
              └─────┬─────┘                    └──────┬──────┘                   └──────┬──────┘
                    │                                 │                                 │
    ┌───────────────┼───────────────┐ ┌──────────────┼───────────────┐ ┌───────────────┼───────────────┐
    │               │               │ │              │               │ │               │               │
┌───┴───┐     ┌────┴────┐    ┌────┴────┐     ┌────┴────┐    ┌────┴────┐     ┌────┴────┐
│Public │     │ Private │    │Public   │     │Private  │    │Public   │     │Private  │
│Subnet │     │ Subnet  │    │Subnet   │     │Subnet   │    │Subnet   │     │Subnet   │
│10.0.0 │     │ 10.0.1  │    │10.0.2   │     │10.0.3   │    │10.0.4   │     │10.0.5   │
└───┬───┘     └────┬────┘    └────┬────┘     └────┬────┘    └────┬────┘     └────┬────┘
    │              │              │              │              │              │
    │              │              │              │              │              │
    └──────────────┼──────────────┴──────────────┼──────────────┴──────────────┤
                   │                             │                             │
                   ▼                             ▼                             ▼
          ┌────────────────┐            ┌────────────────┐            ┌────────────────┐
          │   EKS Node     │            │   EKS Node     │            │   EKS Node     │
          │   Group 1      │            │   Group 2      │            │   Group 3      │
          │ (m6i.xlarge)   │            │ (m6i.xlarge)   │            │ (m6i.xlarge)   │
          └───────┬────────┘            └───────┬────────┘            └───────┬────────┘
                  │                             │                             │
                  └─────────────────────────────┼─────────────────────────────┘
                                                │
                                    ┌───────────┴───────────┐
                                    │      EKS Cluster      │
                                    │   (Control Plane)     │
                                    └───────────┬───────────┘
                                                │
                  ┌─────────────────────────────┼─────────────────────────────┐
                  │                             │                             │
          ┌───────┴───────┐           ┌────────┴────────┐           ┌────────┴────────┐
          │ Application   │           │     Database    │           │     Storage     │
          │  Load         │           │                 │           │                 │
          │  Balancer     │           │ Aurora          │           │ S3 Bucket       │
          └───────────────┘           │ PostgreSQL      │           │ (Documents)     │
                                      │ (Multi-AZ)      │           │                 │
                                      └─────────────────┘           └─────────────────┘
                                                │
                                      ┌─────────┴─────────┐
                                      │                   │
                              ┌───────┴───────┐   ┌───────┴───────┐
                              │ ElastiCache   │   │ OpenSearch    │
                              │ (Redis)       │   │ (Optional)    │
                              └───────────────┘   └───────────────┘

Additional Services:
- AWS Secrets Manager (for secrets)
- AWS KMS (for encryption)
- CloudWatch (for monitoring)
- AWS WAF (for web application firewall)
- Route 53 (for DNS)
- ACM (for SSL certificates)
```

---

## 5. GitOps Deployment Patterns

> **NEW SECTION (v1.1):** GitOps is now considered essential for enterprise self-hosted deployments, providing declarative configuration, automated sync, and drift detection.

### 5.1 ArgoCD Integration

ArgoCD is the recommended GitOps tool for Kubernetes deployments due to its maturity, UI, and extensive ecosystem.

**ArgoCD Installation:**

```bash
# Install ArgoCD
kubectl create namespace argocd
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml

# Access the UI
kubectl port-forward svc/argocd-server -n argocd 8080:443
```

**ArgoCD Application for Hyyve:**

```yaml
# argocd-application.yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: hyyve
  namespace: argocd
spec:
  project: default
  source:
    repoURL: https://github.com/your-org/hyyve-config.git
    targetRevision: HEAD
    path: environments/production
    helm:
      valueFiles:
        - values.yaml
        - values-production.yaml
  destination:
    server: https://kubernetes.default.svc
    namespace: hyyve
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
    syncOptions:
      - CreateNamespace=true
      - PruneLast=true
    retry:
      limit: 5
      backoff:
        duration: 5s
        factor: 2
        maxDuration: 3m
```

### 5.2 Flux CD Alternative

For organizations preferring a more Kubernetes-native approach:

```yaml
# flux-kustomization.yaml
apiVersion: kustomize.toolkit.fluxcd.io/v1
kind: Kustomization
metadata:
  name: hyyve
  namespace: flux-system
spec:
  interval: 10m
  sourceRef:
    kind: GitRepository
    name: hyyve-config
  path: ./environments/production
  prune: true
  healthChecks:
    - apiVersion: apps/v1
      kind: Deployment
      name: hyyve-api
      namespace: hyyve
  timeout: 5m
```

### 5.3 GitOps Repository Structure

```
hyyve-config/
├── base/
│   ├── kustomization.yaml
│   ├── namespace.yaml
│   └── helm-release.yaml
├── environments/
│   ├── development/
│   │   ├── kustomization.yaml
│   │   └── values.yaml
│   ├── staging/
│   │   ├── kustomization.yaml
│   │   └── values.yaml
│   └── production/
│       ├── kustomization.yaml
│       ├── values.yaml
│       └── sealed-secrets.yaml
└── README.md
```

### 5.4 GitOps Best Practices

| Practice | Description |
|----------|-------------|
| **Single Source of Truth** | All configuration in Git, no manual kubectl apply |
| **Environment Promotion** | PR-based promotion: dev → staging → prod |
| **Sealed Secrets** | Encrypt secrets in Git with Bitnami Sealed Secrets |
| **Drift Detection** | Automatic detection and alerting on manual changes |
| **Rollback** | Git revert for instant rollback to previous state |

---

## 6. Supply Chain Security

> **NEW SECTION (v1.1):** Supply chain security is critical for enterprise deployments. This section covers SBOM generation, image signing, and vulnerability management.

### 6.1 Software Bill of Materials (SBOM)

Generate SBOM for all container images:

```bash
# Using Syft to generate SBOM
syft packages your-registry/hyyve-api:v1.0.0 -o spdx-json > sbom-api.spdx.json

# Attach SBOM to image using cosign
cosign attach sbom --sbom sbom-api.spdx.json your-registry/hyyve-api:v1.0.0
```

**CI/CD Integration:**

```yaml
# .github/workflows/build.yml
- name: Generate SBOM
  uses: anchore/sbom-action@v0
  with:
    image: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:${{ github.sha }}
    format: spdx-json
    output-file: sbom.spdx.json

- name: Upload SBOM to Dependency Track
  run: |
    curl -X POST "$DEPENDENCY_TRACK_URL/api/v1/bom" \
      -H "X-Api-Key: $DEPENDENCY_TRACK_API_KEY" \
      -H "Content-Type: application/vnd.cyclonedx+json" \
      -d @sbom.spdx.json
```

### 6.2 Container Image Signing with Sigstore/Cosign

```bash
# Generate key pair (or use keyless with OIDC)
cosign generate-key-pair

# Sign image
cosign sign --key cosign.key your-registry/hyyve-api:v1.0.0

# Verify signature
cosign verify --key cosign.pub your-registry/hyyve-api:v1.0.0
```

**Keyless Signing with OIDC (Recommended):**

```bash
# Sign using GitHub Actions OIDC
cosign sign --yes your-registry/hyyve-api:v1.0.0

# Verify with certificate identity
cosign verify \
  --certificate-identity "https://github.com/your-org/hyyve/.github/workflows/build.yml@refs/heads/main" \
  --certificate-oidc-issuer "https://token.actions.githubusercontent.com" \
  your-registry/hyyve-api:v1.0.0
```

### 6.3 SLSA Compliance

Target SLSA Level 2+ for production deployments:

| Level | Requirements | Implementation |
|-------|--------------|----------------|
| **SLSA 1** | Documentation of build process | Build logs retained |
| **SLSA 2** | Hosted build service, signed provenance | GitHub Actions + cosign |
| **SLSA 3** | Hardened build platform | Isolated runners |
| **SLSA 4** | Two-party review | Required PR approvals |

**Provenance Generation:**

```yaml
# .github/workflows/release.yml
- name: Generate SLSA Provenance
  uses: slsa-framework/slsa-github-generator/.github/workflows/generator_container_slsa3.yml@v2.0.0
  with:
    image: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}
    digest: ${{ steps.build.outputs.digest }}
```

### 6.4 Vulnerability Scanning Pipeline

```yaml
# harbor-scan-policy.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: vulnerability-policy
data:
  policy.json: |
    {
      "block_severity": ["Critical", "High"],
      "allow_list": [],
      "scan_on_push": true,
      "prevent_vulnerable_deploy": true
    }
```

**Kubernetes Admission Controller for Image Verification:**

```yaml
# kyverno-image-verify.yaml
apiVersion: kyverno.io/v1
kind: ClusterPolicy
metadata:
  name: verify-image-signatures
spec:
  validationFailureAction: Enforce
  background: false
  rules:
    - name: verify-signature
      match:
        any:
          - resources:
              kinds:
                - Pod
      verifyImages:
        - imageReferences:
            - "your-registry/hyyve-*"
          attestors:
            - entries:
                - keyless:
                    issuer: "https://token.actions.githubusercontent.com"
                    subject: "https://github.com/your-org/hyyve/*"
```

---

## 7. Policy Enforcement

> **NEW SECTION (v1.1):** Policy enforcement ensures consistent security and compliance across all deployments.

### 7.1 OPA Gatekeeper

**Installation:**

```bash
kubectl apply -f https://raw.githubusercontent.com/open-policy-agent/gatekeeper/v3.15.0/deploy/gatekeeper.yaml
```

**Constraint Template for Required Labels:**

```yaml
apiVersion: templates.gatekeeper.sh/v1
kind: ConstraintTemplate
metadata:
  name: k8srequiredlabels
spec:
  crd:
    spec:
      names:
        kind: K8sRequiredLabels
      validation:
        openAPIV3Schema:
          type: object
          properties:
            labels:
              type: array
              items:
                type: string
  targets:
    - target: admission.k8s.gatekeeper.sh
      rego: |
        package k8srequiredlabels

        violation[{"msg": msg}] {
          provided := {label | input.review.object.metadata.labels[label]}
          required := {label | label := input.parameters.labels[_]}
          missing := required - provided
          count(missing) > 0
          msg := sprintf("Missing required labels: %v", [missing])
        }
```

**Apply Constraint:**

```yaml
apiVersion: constraints.gatekeeper.sh/v1beta1
kind: K8sRequiredLabels
metadata:
  name: require-team-label
spec:
  match:
    kinds:
      - apiGroups: [""]
        kinds: ["Namespace"]
  parameters:
    labels:
      - "team"
      - "cost-center"
```

### 7.2 Kyverno Alternative

**Security Policies:**

```yaml
# kyverno-security-policies.yaml
apiVersion: kyverno.io/v1
kind: ClusterPolicy
metadata:
  name: disallow-privileged-containers
spec:
  validationFailureAction: Enforce
  rules:
    - name: deny-privileged
      match:
        any:
          - resources:
              kinds:
                - Pod
      validate:
        message: "Privileged containers are not allowed"
        pattern:
          spec:
            containers:
              - securityContext:
                  privileged: "false"
---
apiVersion: kyverno.io/v1
kind: ClusterPolicy
metadata:
  name: require-readonly-rootfs
spec:
  validationFailureAction: Audit  # Start with Audit, move to Enforce
  rules:
    - name: require-readonly
      match:
        any:
          - resources:
              kinds:
                - Pod
      validate:
        message: "Root filesystem must be read-only"
        pattern:
          spec:
            containers:
              - securityContext:
                  readOnlyRootFilesystem: true
```

### 7.3 Pod Security Standards Enforcement

```yaml
# namespace-security.yaml
apiVersion: v1
kind: Namespace
metadata:
  name: hyyve
  labels:
    pod-security.kubernetes.io/enforce: restricted
    pod-security.kubernetes.io/enforce-version: latest
    pod-security.kubernetes.io/audit: restricted
    pod-security.kubernetes.io/audit-version: latest
    pod-security.kubernetes.io/warn: restricted
    pod-security.kubernetes.io/warn-version: latest
```

### 7.4 Network Policies

```yaml
# network-policy.yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: hyyve-default-deny
  namespace: hyyve
spec:
  podSelector: {}
  policyTypes:
    - Ingress
    - Egress
---
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-api-to-db
  namespace: hyyve
spec:
  podSelector:
    matchLabels:
      app: hyyve-api
  policyTypes:
    - Egress
  egress:
    - to:
        - podSelector:
            matchLabels:
              app: postgresql
      ports:
        - protocol: TCP
          port: 5432
    - to:
        - podSelector:
            matchLabels:
              app: redis
      ports:
        - protocol: TCP
          port: 6379
    - to:
        - podSelector:
            matchLabels:
              app: weaviate
      ports:
        - protocol: TCP
          port: 8080
```

### 7.5 Policy Enforcement Summary

| Tool | Use Case | Recommendation |
|------|----------|----------------|
| **OPA Gatekeeper** | Complex policies, Rego expertise | Large enterprises |
| **Kyverno** | Kubernetes-native, YAML policies | Most deployments |
| **Pod Security Standards** | Basic security baseline | All deployments |
| **Network Policies** | Network segmentation | All deployments |

---

## 8. Operational Considerations

### 8.1 Backup and Restore Procedures

> **UPDATED (v1.1):** Velero 1.17 removes Restic support. Use Kopia for file system backups.

**Velero Installation:**

```yaml
# velero-values.yaml
configuration:
  backupStorageLocation:
    - name: default
      provider: aws
      bucket: hyyve-velero-backups
      config:
        region: us-east-1
  volumeSnapshotLocation:
    - name: default
      provider: aws
      config:
        region: us-east-1

initContainers:
  - name: velero-plugin-for-aws
    image: velero/velero-plugin-for-aws:v1.11.0  # Updated for Velero 1.17
    volumeMounts:
      - mountPath: /target
        name: plugins

schedules:
  daily-backup:
    disabled: false
    schedule: "0 2 * * *"
    template:
      ttl: "720h"  # 30 days
      includedNamespaces:
        - hyyve
      excludedResources:
        - events
      snapshotVolumes: true
      storageLocation: default
      volumeSnapshotLocations:
        - default

  weekly-backup:
    disabled: false
    schedule: "0 3 * * 0"
    template:
      ttl: "2160h"  # 90 days
      includedNamespaces:
        - hyyve
      snapshotVolumes: true
```

**Backup Script:**

```bash
#!/bin/bash
# backup.sh - Manual backup script

NAMESPACE="hyyve"
BACKUP_NAME="manual-$(date +%Y%m%d-%H%M%S)"

echo "Creating backup: $BACKUP_NAME"

# Create Velero backup
velero backup create "$BACKUP_NAME" \
    --include-namespaces "$NAMESPACE" \
    --snapshot-volumes \
    --wait

# Verify backup
velero backup describe "$BACKUP_NAME"

# Export database separately for additional safety
kubectl exec -n "$NAMESPACE" deploy/hyyve-postgresql -- \
    pg_dump -U postgres -Fc hyyve > "/backups/db-$BACKUP_NAME.dump"

echo "Backup complete: $BACKUP_NAME"
```

**Restore Procedure:**

```bash
#!/bin/bash
# restore.sh - Restore from backup

BACKUP_NAME="${1:-$(velero backup get -o json | jq -r '.items | sort_by(.metadata.creationTimestamp) | last | .metadata.name')}"

echo "Restoring from backup: $BACKUP_NAME"

# Pre-restore checks
echo "Pre-restore checks..."
kubectl get nodes
kubectl get pv

# Scale down to prevent conflicts
kubectl scale deployment -n hyyve --all --replicas=0

# Create restore
velero restore create "restore-$BACKUP_NAME" \
    --from-backup "$BACKUP_NAME" \
    --wait

# Verify restore
velero restore describe "restore-$BACKUP_NAME"

# Scale back up
kubectl scale deployment -n hyyve --all --replicas=1

# Run health checks
sleep 30
kubectl exec -n hyyve deploy/hyyve-api -- curl -sf http://localhost:5001/health

echo "Restore complete"
```

### 8.2 Disaster Recovery Planning

**DR Runbook:**

| Step | Action | RTO Target | Owner |
|------|--------|------------|-------|
| 1 | Assess damage and notify stakeholders | 5 min | On-call Engineer |
| 2 | Decide recovery strategy (same region/different region) | 10 min | Tech Lead |
| 3 | Provision new cluster if needed | 30 min | Platform Team |
| 4 | Install Velero on new cluster | 5 min | Platform Team |
| 5 | Restore from latest backup | 15 min | Platform Team |
| 6 | Verify database integrity | 10 min | DBA |
| 7 | Update DNS/Load Balancers | 5 min | Platform Team |
| 8 | Verify application functionality | 15 min | QA Team |
| 9 | Notify stakeholders of recovery | 5 min | On-call Engineer |
| **Total RTO** | | **100 min** | |

**Cross-Region DR Architecture:**

```yaml
# Cross-region replication configuration

# Primary Region (us-east-1)
primary:
  region: us-east-1
  cluster: hyyve-primary
  database:
    instance: hyyve-db-primary
    replication: async
  storage:
    bucket: hyyve-data-primary
    replication: enabled

# Secondary Region (us-west-2)
secondary:
  region: us-west-2
  cluster: hyyve-secondary
  mode: standby  # Options: standby, active-active
  database:
    instance: hyyve-db-replica
    source: hyyve-db-primary
  storage:
    bucket: hyyve-data-replica
    source: hyyve-data-primary

# Failover configuration
failover:
  automatic: false  # Manual failover for safety
  health_check_interval: 30s
  unhealthy_threshold: 3
  dns_ttl: 60
```

### 8.3 Monitoring and Alerting Setup

**Prometheus Rules:**

```yaml
# prometheus-rules.yaml
apiVersion: monitoring.coreos.com/v1
kind: PrometheusRule
metadata:
  name: hyyve-alerts
  namespace: monitoring
spec:
  groups:
    - name: hyyve
      rules:
        # High Error Rate
        - alert: AgenticRAGHighErrorRate
          expr: |
            sum(rate(http_requests_total{namespace="hyyve",status=~"5.."}[5m]))
            /
            sum(rate(http_requests_total{namespace="hyyve"}[5m])) > 0.05
          for: 5m
          labels:
            severity: critical
          annotations:
            summary: "High error rate detected"
            description: "Error rate is {{ $value | humanizePercentage }} (threshold: 5%)"

        # High Latency
        - alert: AgenticRAGHighLatency
          expr: |
            histogram_quantile(0.95,
              sum(rate(http_request_duration_seconds_bucket{namespace="hyyve"}[5m]))
              by (le)
            ) > 2
          for: 5m
          labels:
            severity: warning
          annotations:
            summary: "High API latency"
            description: "P95 latency is {{ $value }}s (threshold: 2s)"

        # Pod Restarts
        - alert: AgenticRAGPodRestarts
          expr: |
            increase(kube_pod_container_status_restarts_total{namespace="hyyve"}[1h]) > 3
          labels:
            severity: warning
          annotations:
            summary: "Pod {{ $labels.pod }} restarting frequently"
            description: "{{ $value }} restarts in the last hour"

        # Database Connection Pool
        - alert: AgenticRAGDatabaseConnectionsHigh
          expr: |
            pg_stat_activity_count{datname="hyyve"}
            /
            pg_settings_max_connections > 0.8
          for: 5m
          labels:
            severity: warning
          annotations:
            summary: "Database connections approaching limit"
            description: "{{ $value | humanizePercentage }} of max connections in use"

        # Queue Backlog
        - alert: AgenticRAGQueueBacklog
          expr: |
            redis_db_keys{db="db0"} > 10000
          for: 10m
          labels:
            severity: warning
          annotations:
            summary: "Large queue backlog"
            description: "{{ $value }} items in queue"

        # Vector DB Memory
        - alert: WeaviateMemoryHigh
          expr: |
            container_memory_usage_bytes{container="weaviate"}
            /
            container_spec_memory_limit_bytes{container="weaviate"} > 0.85
          for: 5m
          labels:
            severity: warning
          annotations:
            summary: "Weaviate memory usage high"
            description: "Memory at {{ $value | humanizePercentage }}"
```

### 8.4 Log Aggregation (Loki)

> **⚠️ CRITICAL WARNING (v1.1):** Promtail is **End-of-Life as of March 2026**. Commercial support ends February 28, 2026. You **MUST** use Grafana Alloy for new deployments. Migration guide: https://grafana.com/docs/loki/latest/setup/migrate/migrate-to-alloy/

**Loki Stack Installation (with Grafana Alloy - Promtail Replacement):**

```yaml
# loki-values.yaml
loki:
  auth_enabled: false

  storage:
    type: s3
    bucketNames:
      chunks: hyyve-loki-chunks
      ruler: hyyve-loki-ruler
    s3:
      region: us-east-1
      endpoint: s3.us-east-1.amazonaws.com

  limits_config:
    retention_period: 720h  # 30 days
    ingestion_rate_mb: 10
    ingestion_burst_size_mb: 20
    max_streams_per_user: 10000

  schema_config:
    configs:
      - from: 2024-01-01
        store: tsdb
        object_store: s3
        schema: v13
        index:
          prefix: loki_index_
          period: 24h

# Promtail replacement - Grafana Alloy
alloy:
  enabled: true
  configMap:
    content: |
      logging {
        level = "info"
      }

      discovery.kubernetes "pods" {
        role = "pod"
        namespaces {
          names = ["hyyve"]
        }
      }

      loki.source.kubernetes "pods" {
        targets    = discovery.kubernetes.pods.targets
        forward_to = [loki.write.default.receiver]
      }

      loki.write "default" {
        endpoint {
          url = "http://loki:3100/loki/api/v1/push"
        }
      }

grafana:
  enabled: true
  datasources:
    - name: Loki
      type: loki
      access: proxy
      url: http://loki:3100
      jsonData:
        maxLines: 1000
```

**Structured Logging Format:**

```python
# logging_config.py
import structlog
import logging.config

LOGGING_CONFIG = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "json": {
            "()": structlog.stdlib.ProcessorFormatter,
            "processor": structlog.processors.JSONRenderer(),
        },
    },
    "handlers": {
        "console": {
            "class": "logging.StreamHandler",
            "formatter": "json",
        },
    },
    "root": {
        "handlers": ["console"],
        "level": "INFO",
    },
    "loggers": {
        "hyyve": {
            "handlers": ["console"],
            "level": "DEBUG",
            "propagate": False,
        },
    },
}

structlog.configure(
    processors=[
        structlog.contextvars.merge_contextvars,
        structlog.processors.add_log_level,
        structlog.processors.TimeStamper(fmt="iso"),
        structlog.stdlib.ProcessorFormatter.wrap_for_formatter,
    ],
    logger_factory=structlog.stdlib.LoggerFactory(),
    wrapper_class=structlog.stdlib.BoundLogger,
    cache_logger_on_first_use=True,
)

# Usage
logger = structlog.get_logger("hyyve")
logger.info("request_processed",
    tenant_id="tenant_123",
    user_id="user_456",
    action="document_upload",
    duration_ms=150,
    document_count=5
)
```

### 8.5 Upgrade Paths and Migration Strategies

**Upgrade Strategy Matrix:**

| From Version | To Version | Strategy | Downtime | Notes |
|--------------|------------|----------|----------|-------|
| 1.0.x | 1.0.y | Rolling Update | None | Patch versions |
| 1.0.x | 1.1.x | Rolling Update | < 5 min | Minor versions |
| 1.x.x | 2.0.x | Blue-Green | < 15 min | Major versions |

**Blue-Green Deployment:**

```bash
#!/bin/bash
# blue-green-upgrade.sh

NAMESPACE="hyyve"
NEW_VERSION="2.0.0"

# Current deployment (blue)
BLUE_RELEASE="hyyve-blue"
# New deployment (green)
GREEN_RELEASE="hyyve-green"

echo "Starting blue-green upgrade to v$NEW_VERSION"

# 1. Deploy green environment
helm install "$GREEN_RELEASE" ./charts/hyyve \
    --namespace "$NAMESPACE" \
    --set image.tag="$NEW_VERSION" \
    --set service.name="hyyve-green" \
    --wait

# 2. Run smoke tests on green
echo "Running smoke tests..."
GREEN_SVC=$(kubectl get svc -n "$NAMESPACE" -l app.kubernetes.io/instance="$GREEN_RELEASE" -o jsonpath='{.items[0].metadata.name}')
kubectl run smoke-test --rm -i --restart=Never --image=curlimages/curl -- \
    curl -sf "http://$GREEN_SVC:5001/health"

if [ $? -ne 0 ]; then
    echo "Smoke tests failed! Rolling back..."
    helm uninstall "$GREEN_RELEASE" -n "$NAMESPACE"
    exit 1
fi

# 3. Run database migrations (if any)
kubectl exec -n "$NAMESPACE" deploy/"$GREEN_RELEASE"-api -- \
    python manage.py migrate

# 4. Switch traffic
echo "Switching traffic to green..."
kubectl patch ingress hyyve -n "$NAMESPACE" \
    --type='json' \
    -p='[{"op": "replace", "path": "/spec/rules/0/http/paths/0/backend/service/name", "value": "'"$GREEN_RELEASE"'-api"}]'

# 5. Wait and verify
sleep 30
echo "Verifying traffic on green..."
# Add verification logic

# 6. Cleanup blue
echo "Cleaning up blue deployment..."
helm uninstall "$BLUE_RELEASE" -n "$NAMESPACE"

echo "Blue-green upgrade complete!"
```

---

## 9. Implementation Recommendations

### 9.1 Recommended Deployment Architecture

**For Most Enterprise Customers:**

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            PRODUCTION ARCHITECTURE                           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────┐                                                        │
│  │   WAF/CDN       │  CloudFlare / AWS CloudFront / Azure Front Door        │
│  └────────┬────────┘                                                        │
│           │                                                                 │
│  ┌────────▼────────┐                                                        │
│  │ Ingress/ALB     │  NGINX Ingress / AWS ALB / Istio Gateway               │
│  └────────┬────────┘                                                        │
│           │                                                                 │
│  ┌────────┴────────────────────────────────┐                                │
│  │                KUBERNETES CLUSTER        │                                │
│  │  ┌──────────────────────────────────┐   │                                │
│  │  │          APPLICATION TIER         │   │                                │
│  │  │  ┌─────────┐  ┌─────────┐        │   │                                │
│  │  │  │ Web (3) │  │ API (3) │        │   │                                │
│  │  │  │ HPA 2-5 │  │ HPA 2-10│        │   │                                │
│  │  │  └─────────┘  └─────────┘        │   │                                │
│  │  └──────────────────────────────────┘   │                                │
│  │                                         │                                │
│  │  ┌──────────────────────────────────┐   │                                │
│  │  │          WORKER TIER              │   │                                │
│  │  │  ┌──────────────┐ ┌───────────┐  │   │                                │
│  │  │  │ Worker (2-20)│ │ Beat (1)  │  │   │                                │
│  │  │  │ KEDA Scaled  │ │ Single    │  │   │                                │
│  │  │  └──────────────┘ └───────────┘  │   │                                │
│  │  └──────────────────────────────────┘   │                                │
│  │                                         │                                │
│  │  ┌──────────────────────────────────┐   │                                │
│  │  │         OBSERVABILITY             │   │                                │
│  │  │  ┌────────────┐ ┌────────────┐   │   │                                │
│  │  │  │ Prometheus │ │   Loki     │   │   │                                │
│  │  │  └────────────┘ └────────────┘   │   │                                │
│  │  │  ┌────────────┐ ┌────────────┐   │   │                                │
│  │  │  │  Grafana   │ │  Velero    │   │   │                                │
│  │  │  └────────────┘ └────────────┘   │   │                                │
│  │  └──────────────────────────────────┘   │                                │
│  └─────────────────────────────────────────┘                                │
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────┐           │
│  │                    MANAGED SERVICES                           │           │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐          │           │
│  │  │ PostgreSQL  │  │    Redis    │  │  Weaviate   │          │           │
│  │  │ (Managed)   │  │  (Managed)  │  │ (StatefulSet│          │           │
│  │  │ Multi-AZ    │  │  Cluster    │  │  or Managed)│          │           │
│  │  └─────────────┘  └─────────────┘  └─────────────┘          │           │
│  └──────────────────────────────────────────────────────────────┘           │
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────┐           │
│  │                    SECURITY                                   │           │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐          │           │
│  │  │   Vault     │  │ External    │  │   Harbor    │          │           │
│  │  │ (Secrets)   │  │ Secrets Op  │  │ (Registry)  │          │           │
│  │  └─────────────┘  └─────────────┘  └─────────────┘          │           │
│  └──────────────────────────────────────────────────────────────┘           │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 9.2 Minimum and Recommended Specifications

**Minimum Specifications (Small Deployment):**

| Component | Specification |
|-----------|---------------|
| **Kubernetes Cluster** | |
| Nodes | 3 nodes |
| Node Size | 4 vCPU, 16 GB RAM |
| Storage | 100 GB SSD per node |
| **Database** | |
| PostgreSQL | 2 vCPU, 8 GB RAM, 100 GB SSD |
| Redis | 1 vCPU, 2 GB RAM |
| Vector DB | 4 vCPU, 16 GB RAM, 200 GB SSD |
| **Network** | |
| Bandwidth | 1 Gbps |
| Load Balancer | Layer 7 (HTTP/HTTPS) |

**Recommended Specifications (Production):**

| Component | Specification |
|-----------|---------------|
| **Kubernetes Cluster** | |
| Nodes | 6+ nodes (3 AZs) |
| Node Size | 8 vCPU, 32 GB RAM |
| Storage | 500 GB NVMe per node |
| **Database** | |
| PostgreSQL | 4 vCPU, 32 GB RAM, 500 GB SSD, Multi-AZ |
| Redis | 2 vCPU, 8 GB RAM, Cluster mode |
| Vector DB | 8 vCPU, 64 GB RAM, 1 TB NVMe |
| **Network** | |
| Bandwidth | 10 Gbps |
| Load Balancer | Layer 7 with WAF |
| CDN | Global edge locations |

### 9.3 Security Hardening Checklist

```markdown
## Security Hardening Checklist

### Network Security
- [ ] Network policies enabled and configured
- [ ] Ingress TLS/SSL configured with valid certificates
- [ ] mTLS enabled for service-to-service communication (Istio)
- [ ] Web Application Firewall (WAF) deployed
- [ ] DDoS protection enabled
- [ ] Private subnets for all workloads
- [ ] Egress filtering configured

### Container Security
- [ ] Images scanned for vulnerabilities (Trivy/Harbor)
- [ ] Base images from trusted registries only
- [ ] No containers running as root
- [ ] Read-only root filesystem where possible
- [ ] Security contexts configured (capabilities dropped)
- [ ] Pod Security Standards enforced (restricted)
- [ ] Image pull policy set to Always

### Secrets Management
- [ ] No secrets in environment variables or ConfigMaps
- [ ] External Secrets Operator configured
- [ ] Vault integration for dynamic secrets
- [ ] Secrets rotation policy in place
- [ ] Encryption at rest for all secrets

### Access Control
- [ ] RBAC properly configured
- [ ] Service accounts with minimal permissions
- [ ] API authentication required (JWT/OAuth2)
- [ ] Multi-factor authentication for admin access
- [ ] Audit logging enabled

### Data Protection
- [ ] Encryption at rest for databases
- [ ] Encryption at rest for object storage
- [ ] Encryption in transit (TLS 1.3)
- [ ] Backup encryption enabled
- [ ] Data retention policies configured
- [ ] PII handling compliant with regulations

### Monitoring & Compliance
- [ ] Security event logging configured
- [ ] Intrusion detection system deployed
- [ ] Compliance scanning (CIS benchmarks)
- [ ] Vulnerability scanning scheduled
- [ ] Incident response procedures documented
- [ ] Security patches applied regularly
```

### 9.4 Customer Onboarding Documentation Template

```markdown
# Hyyve Platform - Self-Hosted Deployment Guide

## Welcome

This guide will help you deploy the Hyyve Platform in your environment.

## Prerequisites

### Technical Requirements
- Kubernetes cluster v1.26+
- Helm v3.12+
- kubectl configured
- 16+ GB RAM available
- 100+ GB storage available

### Access Requirements
- Container registry credentials
- License key
- (Optional) Cloud provider credentials for managed services

## Quick Start

### Step 1: Add Helm Repository
```bash
helm repo add hyyve https://charts.your-org.com
helm repo update
```

### Step 2: Create Namespace
```bash
kubectl create namespace hyyve
```

### Step 3: Configure Values
```bash
# Download and customize values file
curl -O https://charts.your-org.com/values-template.yaml
# Edit values-template.yaml with your configuration
```

### Step 4: Install
```bash
helm install hyyve hyyve/hyyve \
  --namespace hyyve \
  --values values-template.yaml
```

### Step 5: Verify
```bash
kubectl get pods -n hyyve
kubectl get ingress -n hyyve
```

## Configuration Options

| Parameter | Description | Default |
|-----------|-------------|---------|
| `api.replicaCount` | Number of API replicas | 2 |
| `worker.replicaCount` | Number of worker replicas | 2 |
| `postgresql.enabled` | Deploy PostgreSQL | true |
| `ingress.enabled` | Enable ingress | true |
| `ingress.hosts[0].host` | Hostname | rag.example.com |

## Support

- Documentation: https://docs.your-org.com
- Support Portal: https://support.your-org.com
- Emergency: support@your-org.com
```

---

## 10. References

### Docker Best Practices
- [Docker Official Best Practices](https://docs.docker.com/build/building/best-practices/)
- [Docker in 2026: Top 10 Innovations](https://medium.com/devops-ai-decoded/docker-in-2026-top-10-must-see-innovations-and-best-practices-for-production-success-30a5e090e5d6)
- [Multi-Environment Deployments with Docker](https://overcast.blog/multi-environment-deployments-with-docker-a-guide-890e193191b6)

### Kubernetes & Helm
- [Helm Best Practices](https://helm.sh/docs/chart_best_practices/)
- [Building Robust Helm Charts](https://www.willmunn.xyz/devops/helm/kubernetes/2026/01/17/building-robust-helm-charts.html)
- [Kubernetes HPA Guide](https://www.devopsroles.com/kubernetes-hpa-to-horizontal-pod-autoscaling/)

### Air-Gapped Environments
- [Canonical Kubernetes Air-Gapped Install](https://documentation.ubuntu.com/canonical-kubernetes/latest/snap/howto/install/offline/)
- [K3s Air-Gap Install](https://docs.k3s.io/installation/airgap)
- [Bootstrap Air-Gapped Cluster with Kubeadm](https://kubernetes.io/blog/2023/10/12/bootstrap-an-air-gapped-cluster-with-kubeadm/)

### Infrastructure as Code
- [Terraform Multi-Cloud Provisioning](https://spacelift.io/blog/terraform-multi-cloud)
- [Multi-Cloud Terraform Module](https://github.com/wednesday-solutions/multi-cloud-terraform-module)
- [HashiCorp Federated Multi-Cloud Kubernetes](https://developer.hashicorp.com/terraform/tutorials/networking/multicloud-kubernetes)

### Operations
- [Velero Backup and Restore](https://velero.io/)
- [Kubernetes Backup with Velero](https://oneuptime.com/blog/post/2026-01-06-kubernetes-backup-restore-velero/view)
- [Grafana Loki Documentation](https://grafana.com/oss/loki/)
- [External Secrets Operator with Vault](https://external-secrets.io/latest/provider/hashicorp-vault/)

### Security
- [Harbor Vulnerability Scanning](https://goharbor.io/docs/2.0.0/administration/vulnerability-scanning/)
- [Trivy Security Scanner](https://trivy.dev/)
- [Container Security Tools 2026](https://www.ox.security/blog/container-security-tools-2026/)

### GitOps *(NEW)*
- [ArgoCD Documentation](https://argo-cd.readthedocs.io/en/stable/)
- [Flux CD Documentation](https://fluxcd.io/docs/)
- [GitOps Principles](https://opengitops.dev/)
- [Bitnami Sealed Secrets](https://github.com/bitnami-labs/sealed-secrets)

### Supply Chain Security *(NEW)*
- [Sigstore/Cosign Documentation](https://docs.sigstore.dev/)
- [SLSA Framework](https://slsa.dev/)
- [Syft SBOM Generator](https://github.com/anchore/syft)
- [Dependency Track](https://dependencytrack.org/)

### Policy Enforcement *(NEW)*
- [OPA Gatekeeper](https://open-policy-agent.github.io/gatekeeper/website/)
- [Kyverno](https://kyverno.io/)
- [Kubernetes Pod Security Standards](https://kubernetes.io/docs/concepts/security/pod-security-standards/)

### Log Aggregation *(UPDATED)*
- [Grafana Alloy (Promtail Replacement)](https://grafana.com/docs/alloy/latest/)
- [Promtail to Alloy Migration](https://grafana.com/docs/loki/latest/setup/migrate/migrate-to-alloy/)
- [Promtail EOL Announcement](https://community.grafana.com/t/promtail-end-of-life-eol-march-2026-how-to-migrate-to-grafana-alloy-for-existing-loki-server-deployments/159636)

### Similar Platforms
- [Dify Docker Compose Deployment](https://docs.dify.ai/en/self-host/quick-start/docker-compose)
- [Dify Kubernetes Helm Chart](https://github.com/BorisPolonsky/dify-helm)

---

## Appendix A: Quick Reference Commands

```bash
# Helm Operations
helm install hyyve ./charts/hyyve -n hyyve
helm upgrade hyyve ./charts/hyyve -n hyyve --reuse-values
helm rollback hyyve 1 -n hyyve
helm uninstall hyyve -n hyyve

# Kubectl Operations
kubectl get pods -n hyyve
kubectl logs -f deploy/hyyve-api -n hyyve
kubectl exec -it deploy/hyyve-api -n hyyve -- /bin/sh
kubectl port-forward svc/hyyve-api 5001:5001 -n hyyve

# Velero Operations
velero backup create manual-backup --include-namespaces hyyve
velero backup get
velero restore create --from-backup manual-backup

# Debugging
kubectl describe pod <pod-name> -n hyyve
kubectl get events -n hyyve --sort-by='.lastTimestamp'
kubectl top pods -n hyyve
```

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-01-21 | Technical Architecture Team | Initial document |
| 1.1 | 2026-01-21 | Claude Opus 4.5 (Validation) | **Validated & Enhanced:** Removed deprecated Docker Compose `version` field; Updated Weaviate 1.24.1→1.36.1; Updated Velero plugin for v1.17; Updated K3s v1.29→v1.33.1; Updated terraform-aws-eks ~>20.0→~>21.0; Updated minimum K8s version to 1.30+; Added Section 5 (GitOps); Added Section 6 (Supply Chain Security); Added Section 7 (Policy Enforcement); Strengthened Promtail EOL warning; Updated all section references |

---

*Document Version: 1.1 (Validated & Enhanced)*
*Last Updated: 2026-01-21*
*Next Review: 2026-04-21*
*Validation Report: technical-self-hosted-deployment-research-VALIDATION-REPORT-2026-01-21.md*
