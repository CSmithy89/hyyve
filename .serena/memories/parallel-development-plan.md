# Hyyve Parallel Development Plan

**Created:** 2026-01-27
**Last Validated:** 2026-01-27
**Validation Sources:** `_bmad-output/planning-artifacts/epics.md`, `_bmad-output/implementation-artifacts/sprint-status.yaml`

## Current State (per sprint-status.yaml)

| Epic                            | Status         | Notes                           |
| ------------------------------- | -------------- | ------------------------------- |
| **E0.1** Backend Infrastructure | ✅ DONE        | All 23 stories complete         |
| **E0.2** Frontend Foundation    | ✅ DONE        | All 17 stories complete         |
| **E1.1** Auth & Identity        | 🔄 IN-PROGRESS | 1.1.1 done, 1.1.2 ready-for-dev |

---

## Validated Dependency Graph (Safe Dependencies Only)

```
PHASE 1 DEPENDENCY TREE (SAFE):
========================

E0.1 (DONE) ─┬─► E1.1 (Auth) ─┬─► E1.2 (API Keys)
             │                └─► E1.3 (Workspace/Project) ─► [Project-scoped epics]
             │
             ├─► E1.12 (Runtime) ─┬─► E1.13 (Triggers)
             │                    ├─► E1.14 (Sandbox)
             │                    ├─► E1.15 (Observability) ─► E1.16 (Cost)
             │                    └─► E1.17 (HITL)
             │
             └─► E1.9 (KB Ingestion) ─► E1.10 (KB Search) ─► E1.11 (KB Advanced)
                          ▲
                          └── Requires E1.3 (project context)

E0.2 (DONE) ─┬─► UI shells OK (no blocker)
             ├─► E1.4 (Module Canvas UI) ─► E1.5 (Node Types) ─► E1.6 (Conversational)
             └─► E1.7 (Chatbot Editor UI) ─► E1.8 (NLU & Policies)

NOTE: E1.4/E1.7 can start as UI work now, but full feature integration
      is blocked by E1.3 (projects) and E1.12 (runtime) depending on story.
```

---

## Safe Parallel Execution Tiers

### TIER 1: Immediate Start (Safe)

| Track             | Epic                 | Team Size | Duration  | Blocker |
| ----------------- | -------------------- | --------- | --------- | ------- |
| **UI Track**      | E1.4/E1.7 UI-only    | 2 FE devs | 2-3 weeks | None    |
| **Auth Track**    | E1.1 Auth & Identity | 1 BE dev  | 2 weeks   | None    |
| **Runtime Track** | E1.12 Agent Runtime  | 2 BE devs | 3 weeks   | None    |

### TIER 2: After Auth (E1.1)

| Track               | Epic                     | Team Size | Duration  | Blocker |
| ------------------- | ------------------------ | --------- | --------- | ------- |
| **Access Track**    | E1.2 API Key Management  | 1 BE dev  | 1.5 weeks | E1.1    |
| **Workspace Track** | E1.3 Workspace & Project | 1 BE dev  | 2 weeks   | E1.1    |

### TIER 3: After Workspace (E1.3)

| Track               | Epic                | Team Size | Duration | Blocker |
| ------------------- | ------------------- | --------- | -------- | ------- |
| **KB Track**         | E1.9 KB Ingestion    | 1 BE dev  | 1.5 weeks | E1.3    |
| **Module Builder**   | E1.4 Module Canvas   | 2 FE devs | 3 weeks  | E1.3    |
| **Chatbot Builder**  | E1.7 Chatbot Editor  | 2 FE devs | 3 weeks  | E1.3    |

---

## Sequential Chains (Safe)

**Chain A: Module Builder Pipeline**

```
E1.4 (Canvas) ──► E1.5 (Node Types) ──► E1.6 (Conversational)
   3 weeks           2 weeks              2 weeks
```

**Chain B: Chatbot Pipeline**

```
E1.7 (Editor) ──► E1.8 (NLU & Policies)
   3 weeks           2 weeks
```

**Chain C: Knowledge Base Pipeline**

```
E1.9 (Ingestion) ──► E1.10 (Search) ──► E1.11 (Advanced)
   1.5 weeks           2 weeks           2 weeks
```

**Chain D: Execution Pipeline**

```
E1.12 (Runtime) ──┬──► E1.13 (Triggers)     1.5 weeks
   3 weeks        ├──► E1.14 (Sandbox)      1.5 weeks
                  ├──► E1.15 (Observability) ──► E1.16 (Cost)
                  │       2 weeks                1 week
                  └──► E1.17 (HITL)         2 weeks
```

---

## 8-Week Timeline (Phase 1) - Tentative

```
Week    1    2    3    4    5    6    7    8
═══════════════════════════════════════════════════
E0.2    ████████████                              (UI Foundation - DONE)
E1.1    ████████                                  (Auth)
E1.9    ██████                                    (KB Ingestion - after E1.3)
E1.12   ████████████                              (Runtime)
        ─────────────────────────────────────────
E1.2         ██████                               (API Keys)
E1.3         ████████                             (Workspace)
        ─────────────────────────────────────────
E1.4              ████████████                    (Module Canvas - after E1.3)
E1.7              ████████████                    (Chatbot Editor - after E1.3)
E1.10             ████████                        (KB Search)
E1.13             ██████                          (Triggers)
E1.14             ██████                          (Sandbox)
E1.15             ████████                        (Observability)
        ─────────────────────────────────────────
E1.5                        ████████              (Node Types)
E1.8                        ████████              (NLU/Policies)
E1.11                       ████████              (KB Advanced)
E1.16                            ████             (Cost)
E1.17                       ████████              (HITL)
        ─────────────────────────────────────────
E1.6                                 ████████     (Conversational)
═══════════════════════════════════════════════════
```

---

## Phase 2+ Parallel Tracks (Safe Dependencies)

| Track            | Epics              | Dependencies             |
| ---------------- | ------------------ | ------------------------ |
| **Voice Track**  | E2.1 → E2.2 → E2.3 | E1.7 (chatbot patterns), E1.12 (runtime) |
| **Canvas Track** | E2.4 → E2.5 → E2.6 | E1.12 (runtime), E1.3 (projects)         |
| **MCP Track**    | E2.8 → E2.9        | E1.5 (MCP nodes)                          |
| **Skills Track** | E2.10 → E2.11      | E1.5 (Skill nodes)                        |
| **Integration**  | E2.7               | E1.4, E1.7, E1.9 (shared RAG)             |
| **UI Gen**       | E2.12              | E1.4, E1.3                                 |
| **Deployment**   | E2.13              | E1.7, E1.8, E1.9 (RAG)                     |

---

## Maximum Parallelization by Phase

| Phase       | Total Epics | Max Parallel Tracks | Ideal Team Size |
| ----------- | ----------- | ------------------- | --------------- |
| **Phase 0** | 2           | 2                   | 4-6 devs        |
| **Phase 1** | 17          | 6 (at peak)         | 8-10 devs       |
| **Phase 2** | 13          | 5                   | 8-10 devs       |
| **Phase 3** | 9           | 4                   | 6-8 devs        |
| **Phase 4** | 7           | 3                   | 4-6 devs        |
| **Phase 5** | 6           | 3                   | 4-6 devs        |
| **Phase 6** | 5           | 5 (all parallel!)   | 5 devs          |

---

## Critical Path (Safe)

```
CRITICAL PATH (Longest Safe Chain):
E1.1 → E1.3 → E1.4 → E1.5 → E1.6 → E2.7
  2w     2w     3w     2w     2w     3w  = 14 weeks minimum
```

---

## Recommended Team Structure

| Team                    | Focus            | Epics                         |
| ----------------------- | ---------------- | ----------------------------- |
| **Team Alpha** (2 FE)   | Visual Builders  | E0.2 → E1.4 → E1.5 → E1.6     |
| **Team Beta** (2 FE)    | Chatbot + Voice  | E1.7 → E1.8 → E2.1 → E2.2     |
| **Team Gamma** (2 BE)   | Execution Engine | E1.12 → E1.13 → E1.14 → E1.17 |
| **Team Delta** (2 BE)   | Knowledge/RAG    | E1.9 → E1.10 → E1.11          |
| **Team Epsilon** (1 BE) | Auth/Access      | E1.1 → E1.2 → E1.3            |
| **Team Zeta** (1 BE)    | Observability    | E1.15 → E1.16 → E3.9          |

---

## Epic Summary (59 Total)

- **Phase 0:** 2 epics (Infrastructure)
- **Phase 1:** 17 epics (Foundation - 127 FRs)
- **Phase 2:** 13 epics (Builder Suite - 70 FRs)
- **Phase 3:** 9 epics (Marketplace - 23 FRs)
- **Phase 4:** 7 epics (Enterprise - 28 FRs)
- **Phase 5:** 6 epics (Collaboration - 9 FRs)
- **Phase 6:** 5 epics (Future - 10 FRs)

**Total:** 248 FRs, 70 NFRs, 146 UX screens

---

## Safe Parallel Development Rules

1. **Project-scoped work requires E1.3** (any story that starts with "Given I am in a project" or references project-scoped KB/RAG).
2. **Runtime-dependent work requires E1.12** (execution, triggers, observability, HITL, cross-builder invocation).
3. **UI-only work can proceed when E0.2 is done**, but integration work must respect rules 1–2.
4. **RAG-dependent work requires E1.9** (search, advanced retrieval, shared RAG, and any chat deployment story that queries KB).
5. **Declare assumptions** if a dependency is not explicit in epics.md; avoid treating assumptions as blockers.
