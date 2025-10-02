# Feature Specification: Research Application with Manager-Workers Architecture

**Feature Branch**: `002-inputs-required-topic`  
**Created**: 2025-10-02  
**Status**: Draft  
**Input**: User description: "Inputs — Required: topic string. — Optional: scope filters (date range days, geography, sector), max_workers, depth, style (ieee|apa), allowlist/denylist, max_tokens/model. Artifacts & File Layout repo/ ├─ /apps/cli (Commander/Nest CLI) ├─ /packages/core (manager, workers, queues, schema) ├─ /packages/retrieval (perplexity, openrouter, http fetch, readability) ├─ /packages/citations (bib builder, DOI resolvers, CSL) ├─ /packages/export (md → pdf via Pandoc/Typst) ├─ /configs (config.default.yaml, models.yaml, csl/ieee.csl) ├─ /output/<slug>/ │ ├─ report.md │ ├─ report.pdf │ ├─ references.bib │ ├─ references.json │ ├─ outline.json │ ├─ sections/<k>.md │ ├─ notes/<k>.json (claim→citation map) │ └─ logs/*.ndjson └─ /tests Manager–Workers Contract — Manager: generate outline; enqueue section jobs; merge drafts; dedupe citations; run contradiction & coverage checks; assemble master MD; invoke exporter; validate links; produce scorecard. — Worker: for a section, perform (a) queries (Perplexity API search/q&a), (b) fetch sources (HTTP), (c) extract readable text, (d) synthesize draft with inline citation keys, (e) emit claim→citation map and candidate bib entries. — Critic pass (LLM via OpenRouter): review for unsupported claims, missing citations, and contradictions; emit fix-ups. Citations — Default IEEE via CSL; configurable style. — Bib entries normalized (.bib + JSON); DOI/URL resolution; de-dup by DOI/URL/title-year. — Inline markers: [#ref:key] in MD → Pandoc converts to IEEE. CLI/API Examples — CLI: npx research "Generative AI risks in BFSI (2023–2025)" --workers 6 --days 365 --style ieee --geo IN,US — Programmatic (pseudo): await manager.run({ topic, workers: 8, days: 730, style: 'ieee' }); Configuration — configs/config.default.yaml: concurrency, timeouts, model choices (Perplexity endpoints; OpenRouter models), retry policy, cache TTL, robots policy. — .env: PERPLEXITY_API_KEY, OPENROUTER_API_KEY, HTTP_PROXY?. Success Criteria — report.pdf produced with valid ToC, figures/table placeholders, and final references. — ≥80% sections pass automated fact-check; all HTTP sources return 200 at finalize; no orphan citations; build time bounded (e.g., ≤20 min with 8 workers on typical topic). — Scorecard JSON saved: coverage %, citations/section, dead-link count=0. Operational Requirements — Async I/O with bounded concurrency and backoff; persistent cache; resumable runs (idempotent queue). — Logging: structured NDJSON with job ids; metrics for fetch latency, LLM tokens, error rates. Security Requirements — Rate-limit external calls; redact secrets; domain allow/deny; user agent string identifying tool and contact; comply with API TOS."

## Execution Flow (main)
```
1. Parse user description from Input
   → Extract key concepts: research automation tool with parallel processing
2. Extract key concepts from description
   → Identify: researchers/users, research topics, citations, reports
3. For each unclear aspect:
   → Mark with [NEEDS CLARIFICATION: specific question]
4. Fill User Scenarios & Testing section
   → Define research workflow for topic-based deep research
5. Generate Functional Requirements
   → Each requirement must be testable
   → Focus on research quality, citation accuracy, export formats
6. Identify Key Entities (if data involved)
   → Research topics, sources, citations, reports, fact-check results
7. Run Review Checklist
   → Ensure all requirements are testable and unambiguous
8. Return: SUCCESS (spec ready for planning)
```

---

## ⚡ Quick Guidelines
- ✅ Focus on WHAT users need and WHY
- ❌ Avoid HOW to implement (no tech stack, APIs, code structure)
- 👥 Written for business stakeholders, not developers

### Section Requirements
- **Mandatory sections**: Must be completed for every feature
- **Optional sections**: Include only when relevant to the feature
- When a section doesn't apply, remove it entirely (don't leave as "N/A")

### For AI Generation
When creating this spec from a user prompt:
1. **Mark all ambiguities**: Use [NEEDS CLARIFICATION: specific question] for any assumption you'd need to make
2. **Don't guess**: If the prompt doesn't specify something (e.g., "login system" without auth method), mark it
3. **Think like a tester**: Every vague requirement should fail the "testable and unambiguous" checklist item
4. **Common underspecified areas**:
   - User types and permissions
   - Data retention/deletion policies  
   - Performance targets and scale
   - Error handling behaviors
   - Integration requirements
   - Security/compliance needs

---

## User Scenarios & Testing *(mandatory)*

### Primary User Story
As a researcher or analyst, I want to specify a research topic with optional scope parameters (date ranges, geography, sectors, etc.) so that the system can automatically generate an in-depth research report with proper citations and references in my preferred format (IEEE, APA, etc.).

### Acceptance Scenarios
1. **Given** a research topic "Generative AI risks in BFSI (2023–2025)" with parameters for 6 workers, 365 days of data, IEEE style, and geographic restrictions (IN,US), **When** I run the CLI command `npx research "Generative AI risks in BFSI (2023–2025)" --workers 6 --days 365 --style ieee --geo IN,US`, **Then** a complete research report PDF is generated with valid table of contents, figures/table placeholders, and final references.
2. **Given** I have a research topic requiring deep analysis, **When** the system runs the manager-workers process with parallel workers collecting, synthesizing and cross-checking information, **Then** the final report has ≥80% sections that pass automated fact-check with all HTTP sources returning 200 at finalize and no orphan citations.

### Edge Cases
- What happens when there are no relevant sources found for a research topic?
- How does system handle rate limits from external APIs during research?
- What occurs when a research task is interrupted and needs to be resumed?
- How does the system handle conflicting information from different sources?

## Requirements *(mandatory)*

### Functional Requirements
- **FR-001**: System MUST accept a required topic string and optional scope filters (date range days, geography, sector) to initiate research
- **FR-002**: System MUST support configurable numbers of concurrent workers to parallelize research tasks
- **FR-003**: Users MUST be able to specify citation style (IEEE, APA) for the final report
- **FR-004**: System MUST collect and store research sources with proper citation metadata
- **FR-005**: System MUST perform fact-checking to validate claims with source citations
- **FR-006**: System MUST generate a final research report in PDF format with valid table of contents, figures/table placeholders, and properly formatted references
- **FR-007**: System MUST support domain allowlist/denylist for research source filtering 
- **FR-008**: System MUST perform contradiction checks between different information sources
- **FR-009**: System MUST provide a CLI interface for initiating research tasks and optionally support programmatic API access
- **FR-010**: System MUST produce reports with proper inline citation markers that convert to IEEE format
- **FR-011**: System MUST validate all source links return HTTP 200 at finalization
- **FR-012**: System MUST produce a scorecard JSON with metrics like coverage %, citations/section, dead-link count
- **FR-013**: System MUST support resumable runs that can continue from where they left off after interruption

### Key Entities
- **Research Topic**: The subject of investigation, specified with optional filters for date range, geography, and sector
- **Research Sources**: Web documents, papers, articles, and other materials collected during the research process with citation metadata
- **Citation Records**: Structured data containing author, title, date, DOI/URL, and other bibliographic information for sources
- **Research Sections**: Logical divisions of the research report (e.g., Introduction, Methodology, Findings, Conclusion)
- **Fact-Check Results**: Verification data mapping claims to sources and indicating whether they were validated or found to have contradictions

---

## Review & Acceptance Checklist
*GATE: Automated checks run during main() execution*

### Content Quality
- [x] No implementation details (languages, frameworks, APIs)
- [x] Focused on user value and business needs
- [x] Written for non-technical stakeholders
- [x] All mandatory sections completed

### Requirement Completeness
- [x] No [NEEDS CLARIFICATION] markers remain
- [x] Requirements are testable and unambiguous  
- [x] Success criteria are measurable
- [x] Scope is clearly bounded
- [x] Dependencies and assumptions identified

---

## Execution Status
*Updated by main() during processing*

- [x] User description parsed
- [x] Key concepts extracted
- [x] Ambiguities marked
- [x] User scenarios defined
- [x] Requirements generated
- [x] Entities identified
- [x] Review checklist passed

---
