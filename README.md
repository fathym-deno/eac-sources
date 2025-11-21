---
FrontmatterVersion: 1
DocumentType: Guide
Title: Fathym EaC Sources
Summary: Everything-as-Code models for sources, artifacts, and DevOps actions.
Created: 2025-11-20
Updated: 2025-11-20
Owners:
  - fathym
References:
  - Label: EaC Sub-Area README
    Path: ../README.md
  - Label: EaC Sub-Area AGENTS
    Path: ../AGENTS.md
  - Label: EaC Sub-Area GUIDE
    Path: ../GUIDE.md
  - Label: Projects README
    Path: ../../README.md
  - Label: Projects AGENTS
    Path: ../../AGENTS.md
  - Label: Projects GUIDE
    Path: ../../GUIDE.md
  - Label: Workspace README
    Path: ../../../README.md
  - Label: Workspace AGENTS
    Path: ../../../AGENTS.md
  - Label: Workspace GUIDE
    Path: ../../../WORKSPACE_GUIDE.md
---

# Fathym EaC Sources

EaC definitions for sources, artifacts, DevOps actions, and connection details
used to pull/build content across environments.

- **Goal:** standardize source connections, artifacts, and automation actions as
  EaC for reuse across builds and deployments.
- **Outputs:** models under `src/sources/**`.
- **Code location:** this folder hosts the source.

## Current Status

- Source and action models live under `src/sources/**`.
- Tasks: `deno task test`, `deno task build`, `deno task publish:check`,
  `deno task deploy`, `deno task version`.
- Licensing: MIT (non-commercial) with commercial option; see
  `LICENSE`/`COMMERCIAL_LICENSE.md`.

## How to Work in This Pod

1. Read parent EaC docs plus this project’s `AGENTS` and `GUIDE`.
2. Declare intent before editing; summarize outcomes and open questions in this
   README or a short log.
3. Capture provenance/release channels in `UPSTREAM.md` when publishing to
   jsr/npm; note source provider/API assumptions.
4. Keep links relative; reference dependent EaC modules and micro-frameworks
   when contracts change.
5. Record prompts/scripts used for modeling or automation in doc references.
