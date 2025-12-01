---
FrontmatterVersion: 1
DocumentType: Guide
Title: EaC Sources Agents Guide
Summary: Guardrails for collaborating on source and DevOps Everything-as-Code modules.
Created: 2025-11-20
Updated: 2025-11-20
Owners:
  - fathym
References:
  - Label: Project README
    Path: ./README.md
  - Label: Project GUIDE
    Path: ./GUIDE.md
  - Label: EaC App Runtime Area README
    Path: ../README.md
  - Label: EaC App Runtime Area AGENTS
    Path: ../AGENTS.md
  - Label: EaC App Runtime Area GUIDE
    Path: ../GUIDE.md
  - Label: Projects AGENTS
    Path: ../../AGENTS.md
  - Label: Workspace AGENTS
    Path: ../../../AGENTS.md
---

# AGENTS: EaC Sources

Guardrails for humans and AI working on source/artifact/DevOps EaC modules.

## Core Guardrails

1. **Stay scoped.** Keep work under `projects/everything-as-code/eac-sources/` unless coordinating with another pod; link cross-pod dependencies.
2. **Frontmatter required.** All docs include frontmatter and relative references back to parent guides.
3. **API stability.** Avoid breaking source/action model contracts silently; document breaking changes and add migration notes for consumers.
4. **Provenance.** Capture provider/API version assumptions and release pins in `UPSTREAM.md` when publishing; prefer upstream-first fixes before diverging.
5. **Security & data handling.** Do not embed secrets or tokens in docs/tests; document required permissions clearly.

## Communication

- Declare intent before editing; summarize outcomes and next steps in the project README or a short log.
- Link consumer pods when behavior changes to keep dependencies aligned.
