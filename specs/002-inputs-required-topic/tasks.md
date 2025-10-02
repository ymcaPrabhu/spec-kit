# Tasks: Research Application with Manager-Workers Architecture

**Input**: Design documents from `/specs/002-inputs-required-topic/`
**Prerequisites**: plan.md (required), research.md, data-model.md, quickstart.md

## Execution Flow (main)
```
1. Load plan.md from feature directory
   → If not found: ERROR "No implementation plan found"
   → Extract: tech stack, libraries, structure
2. Load optional design documents:
   → data-model.md: Extract entities → model tasks
   → research.md: Extract decisions → setup tasks
   → quickstart.md: Extract scenarios → integration tests
3. Generate tasks by category:
   → Setup: project init, dependencies, linting
   → Tests: contract tests, integration tests
   → Core: models, services, CLI commands
   → Integration: config, middleware, logging
   → Polish: unit tests, performance, docs
4. Apply task rules:
   → Different files = mark [P] for parallel
   → Same file = sequential (no [P])
   → Tests before implementation (TDD)
5. Number tasks sequentially (T001, T002...)
6. Generate dependency graph
7. Create parallel execution examples
8. Validate task completeness:
   → All entities have models?
   → All CLI commands implemented?
   → All configuration handled?
9. Return: SUCCESS (tasks ready for execution)
```

## Format: `[ID] [P?] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- Include exact file paths in descriptions

## Path Conventions
- **Monorepo with pnpm workspaces**: `apps/cli/`, `packages/`, `configs/` at repository root
- **Packages**: `packages/core/`, `packages/retrieval/`, `packages/citations/`, `packages/export/`, `packages/schema/`
- **Tests**: `apps/cli/tests/`, `packages/*/tests/` within each package

## Phase 3.1: Setup
- [ ] T001 Create project structure per implementation plan with pnpm workspaces
- [ ] T002 Initialize TypeScript monorepo project with pnpm dependencies
- [ ] T003 [P] Configure linting (ESLint with strict rules) and formatting (Prettier) tools
- [ ] T004 [P] Set up Knip, commitlint, and Husky pre-commit hooks (typecheck, unit tests)
- [ ] T005 Create configuration files: config.default.yaml, models.yaml, configs/csl/ieee.csl

## Phase 3.2: Tests First (TDD) ⚠️ MUST COMPLETE BEFORE 3.3
**CRITICAL: These tests MUST be written and MUST FAIL before ANY implementation**
- [ ] T006 [P] Contract test for ResearchTopic entity in packages/schema/tests/research-topic.test.ts
- [ ] T007 [P] Contract test for ResearchJob entity in packages/schema/tests/research-job.test.ts
- [ ] T008 [P] Contract test for Citation entity in packages/schema/tests/citation.test.ts
- [ ] T009 [P] Contract test for ResearchReport entity in packages/schema/tests/research-report.test.ts
- [ ] T010 [P] Integration test for CLI basic run in apps/cli/tests/cli-run.test.ts
- [ ] T011 [P] Integration test for Perplexity client in packages/retrieval/tests/perplexity-client.test.ts
- [ ] T012 [P] Integration test for OpenRouter client in packages/retrieval/tests/openrouter-client.test.ts
- [ ] T013 [P] Integration test for manager-worker communication in packages/core/tests/manager-worker.test.ts

## Phase 3.3: Core Implementation (ONLY after tests are failing)
- [ ] T014 [P] ResearchTopic model/schema in packages/schema/src/research-topic.ts
- [ ] T015 [P] ResearchJob model/schema in packages/schema/src/research-job.ts
- [ ] T016 [P] Citation model/schema in packages/schema/src/citation.ts
- [ ] T017 [P] ResearchReport model/schema in packages/schema/src/research-report.ts
- [ ] T018 [P] Perplexity API client in packages/retrieval/src/clients/perplexity.ts
- [ ] T019 [P] OpenRouter API client in packages/retrieval/src/clients/openrouter.ts
- [ ] T020 [P] HTTP fetcher with undici in packages/retrieval/src/fetcher/fetcher.ts
- [ ] T021 [P] Readability pipeline with JSDOM + @mozilla/readability in packages/retrieval/src/readability/extractor.ts
- [ ] T022 [P] Manager logic for outline generation in packages/core/src/manager/outline-generator.ts
- [ ] T023 [P] Worker implementation steps in packages/core/src/worker/worker.ts
- [ ] T024 [P] Queue/execution with Piscina in packages/core/src/queue/executor.ts
- [ ] T025 [P] Citation keying system in packages/citations/src/builder/key-generator.ts
- [ ] T026 [P] Citation normalization pipeline in packages/citations/src/normalizer/normalizer.ts
- [ ] T027 [P] Citation de-duplication logic in packages/citations/src/deduplicator/deduplicator.ts
- [ ] T028 [P] Report assembly logic in packages/export/src/assembler/assembler.ts
- [ ] T029 [P] PDF generation with Pandoc in packages/export/src/pdf/pdf-generator.ts
- [ ] T030 [P] Link checker in packages/export/src/checker/link-checker.ts
- [ ] T031 [P] Scorecard generator in packages/export/src/checker/scorecard.ts
- [ ] T032 [P] CLI setup with Commander.js in apps/cli/src/index.ts
- [ ] T033 [P] CLI option parsing in apps/cli/src/commands/research-command.ts
- [ ] T034 Configuration loading and validation in packages/core/src/config/config-loader.ts

## Phase 3.4: Integration
- [ ] T035 Connect manager to worker processes via Piscina pool
- [ ] T036 Integrate Perplexity client with query planning
- [ ] T037 Integrate OpenRouter client for synthesis/critic
- [ ] T038 Integrate retrieval pipeline with content extraction
- [ ] T039 Integrate citation system with report assembly
- [ ] T040 Integrate PDF export pipeline
- [ ] T041 Set up structured logging with pino
- [ ] T042 Implement resumable runs with persistent queue

## Phase 3.5: Polish
- [ ] T043 [P] Unit tests for HTTP fetcher in packages/retrieval/tests/fetcher.test.ts
- [ ] T044 [P] Unit tests for readability extraction in packages/retrieval/tests/extractor.test.ts
- [ ] T045 [P] Unit tests for citation de-duplication in packages/citations/tests/deduplicator.test.ts
- [ ] T046 [P] Unit tests for scorecard generator in packages/export/tests/scorecard.test.ts
- [ ] T047 [P] Update docs/api.md with API reference
- [ ] T048 [P] Update docs/configuration.md with config options
- [ ] T049 [P] Update docs/quickstart.md based on implementation
- [ ] T050 Run golden topic snapshot integration test to verify artifacts exist and links resolve

## Dependencies
- Tests (T006-T013) before implementation (T014-T034)
- T014 blocks T022 (ResearchTopic needed for manager)
- T015 blocks T022, T023 (ResearchJob needed for manager/worker)
- T018 blocks T036 (Perplexity client needed for query planning)
- T019 blocks T037 (OpenRouter client needed for synthesis)
- T025, T026 blocks T039 (Citation system needed for report assembly)
- T032 blocks T033 (CLI base needed for command options)
- Implementation before polish (T043-T050)

## Parallel Example
```
# Launch T006-T009 together (entity contract tests):
Task: "Contract test for ResearchTopic entity in packages/schema/tests/research-topic.test.ts"
Task: "Contract test for ResearchJob entity in packages/schema/tests/research-job.test.ts"
Task: "Contract test for Citation entity in packages/schema/tests/citation.test.ts"
Task: "Contract test for ResearchReport entity in packages/schema/tests/research-report.test.ts"

# Launch T014-T017 together (entity implementations):
Task: "ResearchTopic model/schema in packages/schema/src/research-topic.ts"
Task: "ResearchJob model/schema in packages/schema/src/research-job.ts"
Task: "Citation model/schema in packages/schema/src/citation.ts"
Task: "ResearchReport model/schema in packages/schema/src/research-report.ts"

# Launch T043-T045 together (unit tests):
Task: "Unit tests for HTTP fetcher in packages/retrieval/tests/fetcher.test.ts"
Task: "Unit tests for readability extraction in packages/retrieval/tests/extractor.test.ts"
Task: "Unit tests for citation de-duplication in packages/citations/tests/deduplicator.test.ts"
```

## Notes
- [P] tasks = different files, no dependencies
- Verify tests fail before implementing
- Commit after each task
- Avoid: vague tasks, same file conflicts

## Task Generation Rules
*Applied during main() execution*

1. **From Data Model**:
   - Each entity → model creation task [P]
   - Relationships → service layer tasks
   
2. **From Implementation Details**:
   - Each package → package implementation tasks
   - Each API client → client implementation tasks
   - Each CLI option → option handling tasks

3. **From User Stories**:
   - Each quickstart scenario → integration test [P]

4. **Ordering**:
   - Setup → Tests → Models → Services → Integration → Polish
   - Dependencies block parallel execution

## Validation Checklist
*GATE: Checked by main() before returning*

- [ ] All entities have corresponding model tasks
- [ ] All tests come before implementation
- [ ] Parallel tasks truly independent
- [ ] Each task specifies exact file path
- [ ] No task modifies same file as another [P] task
- [ ] All configuration and secret handling tasks included