---
FrontmatterVersion: 1
DocumentType: Guide
Title: EaC Sources Guide
Summary: Playbook for maintaining source, artifact, and DevOps action models in Everything-as-Code.
Created: 2025-11-20
Updated: 2025-11-20
Owners:
  - fathym
References:
  - Label: Project README
    Path: ./README.md
  - Label: Project AGENTS
    Path: ./AGENTS.md
  - Label: EaC App Runtime Area README
    Path: ../README.md
  - Label: EaC App Runtime Area GUIDE
    Path: ../GUIDE.md
  - Label: Workspace GUIDE
    Path: ../../../WORKSPACE_GUIDE.md
---

# EaC Sources Guide

Steps for keeping source/artifact/DevOps EaC modules predictable and well-documented.

## Current Focus

- Maintain source, connection, artifact, and DevOps action models and helpers.
- Align with applications/build systems that consume these definitions.
- Capture provider/action version assumptions and change notes.

## Workflow

1. **Align scope** in [`README.md`](./README.md): clarify intended change (model update, helper change, release prep) and note target repo/branch if code moves.
2. **Design & docs**: capture model/contract updates in `docs/` (create if needed) with frontmatter and links to upstream assumptions.
3. **Capture provenance**: record upstream source, release channels, and version pins in `UPSTREAM.md` once publishing.
4. **Validate behavior**: run `deno task test`; use `deno task build` and `deno task publish:check` before releases; add/update examples when models change.
5. **Communicate changes**: document breaking changes with migration guidance and notify dependents (other EaC packages, micro-frameworks).

## Verification

- Ensure links stay relative and parent guides remain discoverable.
- Keep the roster entry in `../README.md` current when docs or status change.
- When workspace tasks exist, also run: `deno task prompts:verify-frontmatter`, `deno task link:verify`, `deno task workspace:check`.
