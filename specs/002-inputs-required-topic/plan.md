
# Implementation Plan: Research Application with Manager-Workers Architecture

**Branch**: `002-inputs-required-topic` | **Date**: 2025-10-02 | **Spec**: /workspaces/spec-kit/specs/002-inputs-required-topic/spec.md
**Input**: Feature specification from `/specs/002-inputs-required-topic/spec.md`

## Execution Flow (/plan command scope)
```
1. Load feature spec from Input path
   → If not found: ERROR "No feature spec at {path}"
2. Fill Technical Context (scan for NEEDS CLARIFICATION)
   → Detect Project Type from file system structure or context (web=frontend+backend, mobile=app+api)
   → Set Structure Decision based on project type
3. Fill the Constitution Check section based on the content of the constitution document.
4. Evaluate Constitution Check section below
   → If violations exist: Document in Complexity Tracking
   → If no justification possible: ERROR "Simplify approach first"
   → Update Progress Tracking: Initial Constitution Check
5. Execute Phase 0 → research.md
   → If NEEDS CLARIFICATION remain: ERROR "Resolve unknowns"
6. Execute Phase 1 → contracts, data-model.md, quickstart.md, agent-specific template file (e.g., `CLAUDE.md` for Claude Code, `.github/copilot-instructions.md` for GitHub Copilot, `GEMINI.md` for Gemini CLI, `QWEN.md` for Qwen Code or `AGENTS.md` for opencode).
7. Re-evaluate Constitution Check section
   → If new violations: Refactor design, return to Phase 1
   → Update Progress Tracking: Post-Design Constitution Check
8. Plan Phase 2 → Describe task generation approach (DO NOT create tasks.md)
9. STOP - Ready for /tasks command
```

**IMPORTANT**: The /plan command STOPS at step 7. Phases 2-4 are executed by other commands:
- Phase 2: /tasks command creates tasks.md
- Phase 3-4: Implementation execution (manual or via tools)

## Summary
Build a global-standard research application that takes a topic, spawns parallel worker agents to perform retrieval and synthesis, and uses a manager to orchestrate outline creation, workload distribution, merge, cross-checks, and export of a thesis-style PDF with proper citations and references. Implements manager-workers architecture with Perplexity API for search/qa, OpenRouter for LLM synthesis, and Pandoc/Typst for PDF export with IEEE citations.

## Technical Context
**Language/Version**: TypeScript 5.0+ with Node.js LTS  
**Primary Dependencies**: pnpm (monorepo), Piscina (worker pool), p-limit (concurrency), undici (HTTP), JSDOM + @mozilla/readability (content extraction), markdown-it (markup), Pandoc/Typst (PDF export), OpenAPI/GraphQL (contracts) 
**Storage**: JSON/NDJSON artifacts, SQLite for cache/index (optional), .env for secrets  
**Testing**: vitest/jest (unit), Playwright (E2E)  
**Target Platform**: Linux/MacOS/Windows server environments
**Project Type**: Monorepo with CLI application and multiple packages - determines source structure  
**Performance Goals**: ≤20 min build time with 8 workers on typical topic, ≤200ms p95 for external API calls, ≥80% sections pass fact-check  
**Constraints**: Rate limits from Perplexity and OpenRouter APIs, token budgeting per section, external API quotas  
**Scale/Scope**: Single research topic execution with configurable number of workers (default 6-8)

## Constitution Check
*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Truth & Traceability Compliance
- All research claims must map to ≥1 verifiable source
- Citation tracking: claim→citation map in notes/<k>.json
- Source validation: HTTP 200 check on all links before finalization

### Reproducibility Compliance  
- Deterministic configs via config.default.yaml with config.local.yaml overrides
- Seeded operations for consistent LLM outputs where possible
- Pinned model versions via configs/models.yaml

### Security Compliance
- Secret management via .env and dotenv loading (never logged)
- Rate limits on external API calls with backoff
- Robots.txt compliance for HTTP fetcher
- PII redaction in logs

### Modularity Compliance
- Clean boundaries: retrieval → extract → synthesize → merge → export
- Package structure: core, retrieval, citations, export, cli
- Separation of concerns between manager and worker processes

### Idempotence Compliance
- Safe retries via persistent queue with resumable runs
- Idempotent operations that can handle repeated execution

### Accessible PDF Compliance
- Clean table of contents in generated PDF
- Consistent IEEE citation format via CSL
- Tagged bookmarks for accessibility

## Project Structure

### Documentation (this feature)
```
specs/[###-feature]/
├── plan.md              # This file (/plan command output)
├── research.md          # Phase 0 output (/plan command)
├── data-model.md        # Phase 1 output (/plan command)
├── quickstart.md        # Phase 1 output (/plan command)
├── contracts/           # Phase 1 output (/plan command)
└── tasks.md             # Phase 2 output (/tasks command - NOT created by /plan)
```

### Source Code (repository root)
```
apps/
└── cli/
    ├── src/
    │   ├── index.ts
    │   ├── commands/
    │   └── types/
    └── tests/

packages/
├── core/
│   ├── src/
│   │   ├── manager/
│   │   ├── worker/
│   │   ├── queue/
│   │   └── types/
│   └── tests/
├── retrieval/
│   ├── src/
│   │   ├── clients/
│   │   │   ├── perplexity.ts
│   │   │   └── openrouter.ts
│   │   ├── fetcher/
│   │   └── readability/
│   └── tests/
├── citations/
│   ├── src/
│   │   ├── builder/
│   │   ├── normalizer/
│   │   └── deduplicator/
│   └── tests/
├── export/
│   ├── src/
│   │   ├── assembler/
│   │   ├── pdf/
│   │   └── checker/
│   └── tests/
└── schema/
    ├── src/
    │   └── zod-schemas.ts
    └── tests/

configs/
├── config.default.yaml
├── models.yaml
└── csl/
    └── ieee.csl

output/
└── <slug>/
    ├── report.md
    ├── report.pdf
    ├── references.bib
    ├── references.json
    ├── outline.json
    ├── sections/
    ├── notes/
    └── logs/

tests/
└── integration/
    └── fixtures/

docs/
└── ...
```

**Structure Decision**: Monorepo using pnpm workspaces with separate packages for each major component (core, retrieval, citations, export) to maintain modularity as required by the constitution. CLI app serves as the main entry point. Configuration files in `configs/` and output artifacts in `output/<slug>/` directory.

## Phase 0: Outline & Research
1. **Extract unknowns from Technical Context** above:
   - For each NEEDS CLARIFICATION → research task
   - For each dependency → best practices task
   - For each integration → patterns task

2. **Generate and dispatch research agents**:
   ```
   For each unknown in Technical Context:
     Task: "Research {unknown} for {feature context}"
   For each technology choice:
     Task: "Find best practices for {tech} in {domain}"
   ```

3. **Consolidate findings** in `research.md` using format:
   - Decision: [what was chosen]
   - Rationale: [why chosen]
   - Alternatives considered: [what else evaluated]

**Key Research Areas Based on Implementation Details**:
- Perplexity API integration: search, follow-ups, source citations
- OpenRouter client implementation for synthesis/critic with model selection
- Query planning: expand topic → sub-queries with synthesis prompts that include "cite with URLs/DOIs"
- HTTP fetching with undici, retries/backoff, robots check, caching
- Readability pipeline with JSDOM + @mozilla/readability and fallbacks
- Manager–Workers orchestration: outline generation, queue/execution with Piscina worker pool
- Citation keying (authorYear or urlHash) and normalization pipeline
- Pandoc vs Typst comparison for PDF export with IEEE CSL
- Performance optimization: concurrency tuning, streaming LLM, cache hits tracking

**Output**: research.md with all NEEDS CLARIFICATION resolved

## Phase 1: Design & Contracts
*Prerequisites: research.md complete*

1. **Extract entities from feature spec** → `data-model.md`:
   - Entity name, fields, relationships
   - Validation rules from requirements
   - State transitions if applicable

2. **Generate API contracts** from functional requirements:
   - For each user action → endpoint
   - Use standard REST/GraphQL patterns
   - Output OpenAPI/GraphQL schema to `/contracts/`

3. **Generate contract tests** from contracts:
   - One test file per endpoint
   - Assert request/response schemas
   - Tests must fail (no implementation yet)

4. **Extract test scenarios** from user stories:
   - Each story → integration test scenario
   - Quickstart test = story validation steps

5. **Update agent file incrementally** (O(1) operation):
   - Run `.specify/scripts/bash/update-agent-context.sh qwen`
     **IMPORTANT**: Execute it exactly as specified above. Do not add or remove any arguments.
   - If exists: Add only NEW tech from current plan
   - Preserve manual additions between markers
   - Update recent changes (keep last 3)
   - Keep under 150 lines for token efficiency
   - Output to repository root

**Key Design Elements Based on Implementation Details**:
- **Job Schema**: Using zod for validation of worker job structure
- **CLI Command Structure**: Commander.js with options: --workers, --days, --style, --geo, --allowlist, --denylist, --model, --maxTokens, --resume
- **Package Interfaces**: 
  - core: manager (outline generation, queue/execution), worker (query → fetch → extract → draft → emit)
  - retrieval: Perplexity client, OpenRouter client, HTTP fetcher, readability pipeline
  - citations: keying system, normalization (citation-js or custom), de-duplication
  - export: assembly, PDF generation, link validation
- **Configuration Schema**: config.default.yaml with defaults; config.local.yaml for overrides
- **Manager-Worker Contract**: Job schema defines what data moves between manager and workers
- **Citation Flow**: claim→citation mapping in notes.json, bib normalization to .bib + .json

**Output**: data-model.md, /contracts/*, failing tests, quickstart.md, agent-specific file

## Phase 2: Task Planning Approach
*This section describes what the /tasks command will do - DO NOT execute during /plan*

**Task Generation Strategy**:
- Load `.specify/templates/tasks-template.md` as base
- Generate tasks from Phase 1 design docs (contracts, data model, quickstart)
- Each contract → contract test task [P]
- Each entity → model creation task [P] 
- Each user story → integration test task
- Implementation tasks to make tests pass

**Ordering Strategy**:
- TDD order: Tests before implementation 
- Dependency order: Models before services before UI
- Mark [P] for parallel execution (independent files)

**Additional Task Categories Based on Implementation Details**:
- **Bootstrap tasks**: Monorepo setup with pnpm, TypeScript config, ESLint (strict), Prettier, Knip, commitlint + Conventional Commits, Husky pre-commit (typecheck, unit tests)
- **Retrieval layer tasks**: Perplexity client implementation, OpenRouter client, query planning, HTTP fetcher with undici, readability pipeline
- **Manager-Worker orchestration tasks**: Outline generator, queue/execution with Piscina, worker implementation steps, critic pass
- **Citations & References tasks**: Citation keying system, normalization pipeline, de-duplication logic, IEEE CSL implementation
- **Assembly & Export tasks**: Report assembly, Pandoc/Typst pipeline, link checker
- **Quality Gates tasks**: Heuristics (≥2 citations per section), unsupported-claim detector, contradiction detector, scorecard generator
- **Configuration & Secrets tasks**: Config file structure, .env handling, secret loading with dotenv
- **CLI App tasks**: Commander setup, option parsing, output handling
- **Testing tasks**: Unit tests (mocked HTTP, readability extraction, citation de-dup), Integration tests (golden topic snapshots), E2E dry-run mode

**Estimated Output**: 25-30 numbered, ordered tasks in tasks.md

**IMPORTANT**: This phase is executed by the /tasks command, NOT by /plan

## Phase 3+: Future Implementation
*These phases are beyond the scope of the /plan command*

**Phase 3**: Task execution (/tasks command creates tasks.md)  
**Phase 4**: Implementation (execute tasks.md following constitutional principles)  
**Phase 5**: Validation (run tests, execute quickstart.md, performance validation)

## Complexity Tracking
*Fill ONLY if Constitution Check has violations that must be justified*

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |


## Progress Tracking
*This checklist is updated during execution flow*

**Phase Status**:
- [x] Phase 0: Research complete (/plan command)
- [x] Phase 1: Design complete (/plan command)
- [ ] Phase 2: Task planning complete (/plan command - describe approach only)
- [ ] Phase 3: Tasks generated (/tasks command)
- [ ] Phase 4: Implementation complete
- [ ] Phase 5: Validation passed

**Gate Status**:
- [x] Initial Constitution Check: PASS
- [x] Post-Design Constitution Check: PASS
- [x] All NEEDS CLARIFICATION resolved
- [ ] Complexity deviations documented

---
*Based on Constitution v2.1.1 - See `/memory/constitution.md`*
