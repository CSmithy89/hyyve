# Validation Report: Self-Hosted Deployment Research Document

**Validation Date:** January 21, 2026
**Document Reviewed:** `technical-self-hosted-deployment-research-2026-01-21.md`
**Validation Status:** REQUIRES SIGNIFICANT UPDATES

---

## Executive Summary

This validation report provides a comprehensive, critical evaluation of the self-hosted deployment research document. Using DeepWiki, Context7, and current web research, we validated the technical claims across all major sections.

**Overall Assessment:** The document has **solid architectural foundations** but contains **multiple outdated version references** and **missing critical 2025-2026 best practices** that must be addressed before implementation.

| Category | Accuracy | Critical Issues |
|----------|----------|-----------------|
| Docker Deployment | **OUTDATED** | `version: '3.8'` deprecated, needs removal |
| Kubernetes/Helm | **MOSTLY ACCURATE** | Good patterns, minor version updates needed |
| Air-Gapped Environments | **ACCURATE** | Harbor and offline package approaches correct |
| Infrastructure as Code | **OUTDATED** | terraform-aws-eks module version outdated |
| Velero Backup/Restore | **OUTDATED** | Version 1.13.0 → 1.17; Restic removed |
| Component Versions | **CRITICALLY OUTDATED** | Weaviate, K3s, Velero all need updates |
| Observability | **PARTIALLY OUTDATED** | Promtail EOL March 2026, Alloy mentioned but incomplete |
| Missing Topics | **SIGNIFICANT GAPS** | GitOps, Supply Chain Security, OPA/Gatekeeper |

---

## 1. Docker Deployment - CRITICAL UPDATE REQUIRED

### 1.1 Docker Compose Version Field

| Claim in Document | Validation Result | Source |
|-------------------|-------------------|--------|
| Uses `version: '3.8'` | **DEPRECATED** | [Docker Docs](https://docs.docker.com/reference/compose-file/legacy-versions/) |

**CRITICAL FINDING:**

The `version` field in docker-compose.yaml is now **completely deprecated**. Modern Docker Compose files should no longer include version specifications.

> "Compose v2 ignores the version top-level element in the compose.yaml file and relies entirely on the Compose Specification to interpret the file."

**Correction Required:**
- Remove `version: '3.8'` from both `docker-compose.dev.yml` and `docker-compose.prod.yml`
- Update reference from `docker-compose` (hyphen) to `docker compose` (space) - the hyphen version is legacy

### 1.2 Docker Image Versions

| Image | Document Version | Current Version | Status |
|-------|------------------|-----------------|--------|
| `postgres:16-alpine` | 16-alpine | 16.11-alpine3.23 | ✅ OK (tag still valid) |
| `redis:7-alpine` | 7-alpine | 7-alpine | ✅ CURRENT |
| `nginx:alpine` | alpine | alpine | ✅ CURRENT |
| `semitechnologies/weaviate:1.24.1` | 1.24.1 | ~1.36.x | ❌ **SIGNIFICANTLY OUTDATED** |

### 1.3 Docker Best Practices

| Practice | Validation | Notes |
|----------|------------|-------|
| Multi-container microservices approach | **CORRECT** | Follows Docker best practices |
| Resource limits with `deploy` | **CORRECT** | Good production practice |
| Health checks | **CORRECT** | Proper implementation |
| Network isolation | **CORRECT** | Bridge network appropriate |

---

## 2. Kubernetes/Helm Configuration - MOSTLY ACCURATE

### 2.1 Helm Chart Structure

| Claim | Validation Result | Source |
|-------|-------------------|--------|
| Chart structure with templates/, values.yaml | **CORRECT** | [Helm Best Practices](https://helm.sh/docs/chart_best_practices/) |
| Subchart dependencies | **CORRECT** | Standard pattern |
| `kubeVersion: ">=1.26.0-0"` | **ACCEPTABLE** but note K8s 1.26-1.28 are EOL | [Kubernetes Releases](https://kubernetes.io/releases/) |

### 2.2 HPA Configuration

| Feature | Validation Result | Source |
|---------|-------------------|--------|
| `autoscaling/v2` API | **CORRECT** | Current stable API |
| `stabilizationWindowSeconds: 300` for scaleDown | **CORRECT** | Matches default/recommended |
| `behavior` configuration | **CORRECT** | Proper scale-up/scale-down policies |
| CPU/Memory metrics | **CORRECT** | Standard resource metrics |

**Note:** The HPA configuration in the document aligns with Kubernetes best practices from Context7/kubernetes.io.

### 2.3 KEDA Configuration

| Claim | Validation Result | Source |
|-------|-------------------|--------|
| KEDA ScaledObject structure | **CORRECT** | DeepWiki: kedacore/keda |
| Redis list trigger for Celery | **CORRECT** | Proper pattern |
| `pollingInterval`, `cooldownPeriod` | **CORRECT** | Best practice parameters |

**Current KEDA Version:** 2.17.2 (document doesn't specify, which is fine as it uses Helm)

### 2.4 External Secrets Operator

| Claim | Validation Result | Source |
|-------|-------------------|--------|
| ExternalSecret CRD structure | **CORRECT** | DeepWiki: external-secrets/external-secrets |
| Vault ClusterSecretStore | **CORRECT** | Proper integration pattern |
| `refreshInterval: 1h` | **ACCEPTABLE** | Within recommended range |

**Current ESO Version:** 0.18.2

### 2.5 Kubernetes Version Issues

| Version Reference | Status | Current Supported |
|-------------------|--------|-------------------|
| K8s 1.26 minimum | ⚠️ EOL | 1.33, 1.34, 1.35 |
| K8s 1.29 in Terraform | ⚠️ EOL | 1.33, 1.34, 1.35 |

**Recommendation:** Update minimum Kubernetes version to `>=1.30.0-0` and terraform examples to 1.33.

---

## 3. Air-Gapped Environments - ACCURATE

### 3.1 Harbor Registry

| Claim | Validation Result | Source |
|-------|-------------------|--------|
| Harbor for air-gapped | **CORRECT** | DeepWiki: goharbor/harbor |
| Offline installer package | **CORRECT** | `make package_offline` confirmed |
| Trivy integration | **CORRECT** | Default scanner, properly integrated |

**Current Harbor Version:** 2.13

### 3.2 Offline Package Structure

| Component | Validation Result | Notes |
|-----------|-------------------|-------|
| Image tar bundles | **CORRECT** | Standard approach |
| Helm chart bundling | **CORRECT** | Proper offline helm usage |
| Checksum verification | **CORRECT** | Security best practice |
| License validation | **CORRECT** | Ed25519 signature approach valid |

### 3.3 K3s Air-Gapped

| Claim | Validation Result | Source |
|-------|-------------------|--------|
| K3s air-gapped install process | **CORRECT** | [K3s Docs](https://docs.k3s.io/installation/airgap) |
| `k3s-v1.29.0+k3s1` | **OUTDATED** | Current is v1.33.1+k3s1 |

---

## 4. Infrastructure as Code - REQUIRES UPDATES

### 4.1 Terraform AWS EKS Module

| Claim | Validation Result | Source |
|-------|-------------------|--------|
| Module source `terraform-aws-modules/eks/aws` | **CORRECT** | Standard module |
| Version `~> 20.0` | **OUTDATED** | Current is 21.3.1 |
| Managed node groups configuration | **MOSTLY CORRECT** | Minor updates needed |

**DeepWiki Findings:**
- Default `update_config` changed to `{ max_unavailable_percentage = 33 }`
- `before_compute` flag for addon ordering is now important
- Auth moved from `aws-auth` ConfigMap to EKS cluster access entry in v20.x

**Required Update:**
```hcl
# Change from:
version = "~> 20.0"

# To:
version = "~> 21.0"
```

### 4.2 Pulumi Configuration

| Claim | Validation Result | Notes |
|-------|-------------------|-------|
| Pulumi TypeScript structure | **CORRECT** | Valid approach |
| EKS cluster configuration | **CORRECT** | Proper pattern |

### 4.3 Multi-Cloud Structure

| Claim | Validation Result | Notes |
|-------|-------------------|-------|
| Conditional module loading | **CORRECT** | Standard Terraform pattern |
| Provider abstraction | **CORRECT** | Good multi-cloud approach |

---

## 5. Velero Backup/Restore - REQUIRES SIGNIFICANT UPDATES

### 5.1 Velero Version

| Document Version | Current Version | Status |
|------------------|-----------------|--------|
| v1.13.0 | v1.17 | **OUTDATED** |

### 5.2 Critical Changes in Velero 1.17

**CRITICAL FINDING from DeepWiki:**

> "Restic, the legacy file-system backup implementation, has been deprecated and removed in Velero v1.17"

The document should be updated to reflect:
1. Restic is **REMOVED** - Kopia is now the only FSB option
2. `defaultVolumesToFsBackup: true` replaces Restic-specific flags

### 5.3 Velero Configuration Accuracy

| Feature | Validation Result | Notes |
|---------|-------------------|-------|
| Backup schedules | **CORRECT** | Cron syntax valid |
| TTL retention | **CORRECT** | Default 720h (30 days) matches |
| Volume snapshots | **CORRECT** | Proper configuration |
| S3 backup location | **CORRECT** | Standard pattern |

**Required Updates:**
- Update Velero version to 1.17
- Remove any Restic references
- Add note about Kopia as FSB backend

---

## 6. Observability - PARTIALLY OUTDATED

### 6.1 Promtail Deprecation

**CRITICAL FINDING:**

> "Promtail (default agent for Grafana Loki) will be End-Of-Life by March 2026. Commercial support ends February 28, 2026."

The document correctly mentions Grafana Alloy as a replacement in section 5.4, but this needs stronger emphasis.

**Sources:**
- [Grafana Community - Promtail EOL](https://community.grafana.com/t/promtail-end-of-life-eol-march-2026-how-to-migrate-to-grafana-alloy-for-existing-loki-server-deployments/159636)
- [SUSE - Grafana Alloy Replacing Promtail](https://www.suse.com/c/grafana-alloy-part-1-replacing-promtail/)

### 6.2 Loki Configuration

| Feature | Validation Result | Notes |
|---------|-------------------|-------|
| Loki storage config | **CORRECT** | S3/TSDB schema valid |
| Alloy configuration | **CORRECT** | Proper replacement for Promtail |
| Retention period | **CORRECT** | 720h reasonable |

### 6.3 Prometheus Rules

| Feature | Validation Result | Notes |
|---------|-------------------|-------|
| PrometheusRule CRD | **CORRECT** | Standard prometheus-operator pattern |
| Alert expressions | **CORRECT** | Valid PromQL |
| Severity labels | **CORRECT** | Follows conventions |

---

## 7. CRITICAL GAPS AND MISSING TOPICS

The document is missing several critical 2025-2026 best practices:

### 7.1 Missing: GitOps Deployment Patterns

**CRITICAL OMISSION**

For self-hosted enterprise deployments, GitOps is now considered essential:
- **ArgoCD** or **Flux CD** for declarative Kubernetes deployments
- Git as single source of truth for configuration
- Automated sync and drift detection

**Recommendation:** Add section on GitOps integration with ArgoCD/Flux

### 7.2 Missing: Supply Chain Security

**CRITICAL OMISSION**

Not covered but essential for enterprise:
- **SBOM (Software Bill of Materials)** generation
- **Sigstore/cosign** for container image signing
- **SLSA** compliance levels
- **Vulnerability scanning in CI/CD** (not just Harbor)

### 7.3 Missing: Policy Enforcement

**SIGNIFICANT OMISSION**

No mention of:
- **OPA/Gatekeeper** for Kubernetes policy enforcement
- **Kyverno** as alternative policy engine
- Pod Security Standards enforcement (mentioned in checklist but no implementation)

### 7.4 Missing: Service Mesh Security Details

While Istio is mentioned, missing:
- **mTLS enforcement** configuration details
- **Authorization policies** examples
- **PeerAuthentication** resources

### 7.5 Missing: Disaster Recovery Testing

Document covers DR procedures but missing:
- **Chaos engineering** considerations (Chaos Monkey, Litmus)
- **DR drill schedules** and automation
- **RTO/RPO validation** testing

### 7.6 Missing: Cost Optimization

No coverage of:
- **Spot/Preemptible instances** for workers
- **Cluster autoscaler** configuration
- **Resource quotas** per namespace
- **Cost allocation** tagging strategies

### 7.7 Missing: Container Runtime Options

Document assumes containerd but missing:
- **Podman** considerations for rootless containers
- **CRI-O** as alternative
- Runtime security with **gVisor** or **Kata Containers** (covered in security doc)

---

## 8. VERSION CORRECTIONS SUMMARY

| Component | Document Version | Current Version | Urgency |
|-----------|------------------|-----------------|---------|
| **Weaviate** | 1.24.1 | ~1.36.x | 🔴 CRITICAL |
| **Velero** | 1.13.0 | 1.17 | 🔴 CRITICAL |
| **K3s** | v1.29.0+k3s1 | v1.33.1+k3s1 | 🟡 HIGH |
| **terraform-aws-eks** | ~> 20.0 | ~> 21.0 | 🟡 HIGH |
| **Kubernetes minimum** | 1.26 | 1.30+ | 🟡 HIGH |
| **Docker Compose** | version: '3.8' | (remove field) | 🟡 HIGH |
| **Helm chart versions** | Various | Need audit | 🟢 MEDIUM |

---

## 9. RECOMMENDATIONS

### 9.1 High Priority Updates

1. **Remove Docker Compose version field** from all compose files
2. **Update Weaviate to ~1.36.x** (12+ minor versions behind)
3. **Update Velero to 1.17** and remove Restic references (use Kopia)
4. **Update terraform-aws-eks to ~> 21.0**
5. **Add GitOps section** with ArgoCD/Flux patterns
6. **Add Supply Chain Security section** (SBOM, Sigstore)

### 9.2 Medium Priority Updates

7. Update K3s version to v1.33.x track
8. Update minimum Kubernetes version to 1.30+
9. Add OPA/Gatekeeper policy enforcement section
10. Strengthen Promtail → Alloy migration guidance
11. Add cost optimization section

### 9.3 Low Priority Updates

12. Add chaos engineering/DR testing section
13. Add container runtime alternatives section
14. Update code examples to use modern patterns
15. Add benchmarks for different deployment sizes

---

## 10. DOCUMENT STRENGTHS

Despite the issues identified, the document has significant strengths:

### 10.1 Well-Structured Architecture
- Clear separation between dev/prod configurations
- Proper microservices decomposition
- Good security considerations in checklists

### 10.2 Comprehensive Coverage
- Multi-cloud IaC approach is solid
- Air-gapped deployment thoroughly covered
- Backup/restore procedures well-documented

### 10.3 Practical Examples
- Real-world Helm chart structure
- Useful bash scripts for operations
- Clear resource sizing guidelines

### 10.4 Security Awareness
- Network policies mentioned
- Secrets management via ESO
- Security checklist comprehensive

---

## 11. CONCLUSION

The research document provides a **solid foundation** for self-hosted deployments but requires **significant updates** to component versions and **additions of missing 2025-2026 best practices**.

**Overall Grade: C+**

| Criterion | Score | Notes |
|-----------|-------|-------|
| Technical accuracy | 65% | Many outdated versions |
| Completeness | 70% | Missing GitOps, supply chain security |
| Actionability | 85% | Good practical examples |
| Currency | 55% | Multiple critical version issues |
| Best practices alignment | 70% | Missing several 2026 patterns |

**Primary Weaknesses:**
1. Weaviate version 12+ minor versions behind
2. Velero version misses major FSB changes
3. Docker Compose deprecated syntax
4. No GitOps patterns (critical for enterprise)
5. No supply chain security coverage

**Recommendation:** This document should NOT be used for production deployment without the high-priority updates being applied first.

---

## Sources Used for Validation

### DeepWiki Repositories
- weaviate/weaviate (version 1.36.0-dev confirmed)
- vmware-tanzu/velero (version 1.17, Restic removed)
- kedacore/keda (version 2.17.2)
- external-secrets/external-secrets (version 0.18.2)
- goharbor/harbor (version 2.13)
- terraform-aws-modules/terraform-aws-eks (version 21.3.1)

### Context7 Documentation
- Kubernetes.io HPA best practices
- Helm.sh chart best practices

### Web Sources
- [Docker Compose Legacy Versions](https://docs.docker.com/reference/compose-file/legacy-versions/)
- [Docker Compose History](https://docs.docker.com/compose/intro/history/)
- [Kubernetes Releases](https://kubernetes.io/releases/)
- [Kubernetes EOL](https://endoflife.date/kubernetes)
- [K3s Air-Gap Install](https://docs.k3s.io/installation/airgap)
- [Grafana Promtail EOL](https://community.grafana.com/t/promtail-end-of-life-eol-march-2026-how-to-migrate-to-grafana-alloy-for-existing-loki-server-deployments/159636)
- [PostgreSQL Docker Hub](https://hub.docker.com/_/postgres)

---

*Validation performed: January 21, 2026*
*Validator: Claude Opus 4.5*
