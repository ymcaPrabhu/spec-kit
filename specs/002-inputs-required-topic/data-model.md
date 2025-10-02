# Data Model: Research Application

## Core Entities

### ResearchTopic
- **id**: string (UUID)
- **title**: string (the research topic string provided by user)
- **description**: string (optional detailed description)
- **createdAt**: Date
- **updatedAt**: Date
- **filters**: TopicFilters (optional scope filters)

### TopicFilters
- **dateRangeDays**: number (optional, default 365)
- **geography**: string[] (optional, e.g., ["US", "IN"])
- **sector**: string[] (optional, e.g., ["BFSI", "Technology"])
- **maxWorkers**: number (optional, default 6)
- **style**: "ieee" | "apa" | "mla" (optional, default "ieee")
- **allowlist**: string[] (optional domain allowlist)
- **denylist**: string[] (optional domain denylist)

### ResearchJob
- **id**: string (UUID)
- **topicId**: string (reference to ResearchTopic.id)
- **status**: "pending" | "in-progress" | "completed" | "failed" | "cancelled"
- **section**: string (section of the report this job handles)
- **queries**: string[] (sub-queries generated for this section)
- **sources**: ResearchSource[] (sources identified for this section)
- **draft**: string (draft content of the section)
- **createdAt**: Date
- **updatedAt**: Date
- **completedAt**: Date | null

### ResearchSource
- **id**: string (UUID)
- **jobId**: string (reference to ResearchJob.id)
- **url**: string
- **title**: string
- **author**: string | null
- **publishDate**: Date | null
- **fetchedAt**: Date
- **content**: string (extracted readable content)
- **isCited**: boolean (whether this source was cited in the final draft)
- **status**: "fetched" | "processed" | "cited" | "discarded"

### Citation
- **id**: string (UUID)
- **sourceId**: string (reference to ResearchSource.id)
- **key**: string (citation key in format authorYear or urlHash)
- **url**: string
- **doi**: string | null
- **title**: string
- **author**: string
- **journal**: string | null
- **year**: number
- **pages**: string | null
- **publisher**: string | null

### SectionContent
- **id**: string (UUID)
- **jobId**: string (reference to ResearchJob.id)
- **sectionTitle**: string
- **content**: string (the draft content)
- **claims**: Claim[] (claims made in this section with citation requirements)
- **citations**: Citation[] (citations used in this section)
- **factCheckResults**: FactCheckResult[] | null

### Claim
- **id**: string (UUID)
- **sectionId**: string (reference to SectionContent.id)
- **text**: string (the claim being made)
- **requiresCitation**: boolean
- **citationKey**: string | null (if cited)
- **isVerified**: boolean | null (null if not yet checked)
- **sourceUrl**: string | null (if verified)

### FactCheckResult
- **id**: string (UUID)
- **claimId**: string (reference to Claim.id)
- **status**: "verified" | "unverified" | "contradicted"
- **evidence**: string[] (evidence supporting or contradicting the claim)
- **confidence**: number (0-1 confidence score)
- **checkedAt**: Date

### ResearchReport
- **id**: string (UUID)
- **topicId**: string (reference to ResearchTopic.id)
- **title**: string (generated report title)
- **executiveSummary**: string
- **outline**: ReportOutline
- **sections**: SectionContent[]
- **citations**: Citation[]
- **status**: "draft" | "final" | "published"
- **createdAt**: Date
- **completedAt**: Date | null
- **scorecard**: Scorecard | null

### ReportOutline
- **id**: string (UUID)
- **reportId**: string (reference to ResearchReport.id)
- **structure**: OutlineSection[]
- **createdAt**: Date

### OutlineSection
- **id**: string (UUID)
- **parentId**: string | null (for nested sections)
- **title**: string
- **order**: number
- **children**: OutlineSection[] (nested sections)

### Scorecard
- **id**: string (UUID)
- **reportId**: string (reference to ResearchReport.id)
- **coveragePercent**: number
- **citationsPerSection**: number
- **deadLinkCount**: number
- **sectionsPassingFactCheck**: number
- **totalSections**: number
- **generatedAt**: Date
- **nonNegotiableStatus**: NonNegotiableStatus[]

### NonNegotiableStatus
- **requirement**: string (e.g., "≥90% sections include ≥2 reputable citations")
- **status**: boolean (true if met, false if not)
- **details**: string (details about why it was/wasn't met)

## Package-Level Schemas

### Core Package Schema
```typescript
interface JobSchema {
  id: string;
  topic: string;
  section: string;
  queries: string[];
  result: SectionContent | null;
  error: string | null;
  createdAt: Date;
  updatedAt: Date;
}
```

### Configuration Schema
```typescript
interface ConfigSchema {
  // Concurrency settings
  maxWorkers: number;
  maxExternalCalls: number;
  
  // API settings
  perplexity: {
    apiKey: string;
    model: string;
    timeout: number;
  };
  openrouter: {
    apiKey: string;
    model: string;
    timeout: number;
  };
  
  // Network settings
  http: {
    timeout: number;
    retryAttempts: number;
    retryDelay: number;
    cacheTtl: number;
  };
  
  // Research settings
  research: {
    days: number;
    maxTokens: number;
    citationStyle: "ieee" | "apa" | "mla";
    geography?: string[];
    sector?: string[];
    allowlist?: string[];
    denylist?: string[];
  };
  
  // Export settings
  export: {
    pdf: boolean;
    markdown: boolean;
    includeBib: boolean;
  };
  
  // Quality settings
  quality: {
    minCitationsPerSection: number;
    maxDeadLinks: number;
    factCheckThreshold: number; // minimum percentage of sections that must pass fact-check
  };
}
```

## Validation Rules

1. Every ResearchJob must have a valid topicId that references an existing ResearchTopic
2. Every ResearchSource must have a valid jobId that references an existing ResearchJob
3. Every Citation must have a valid sourceId that references an existing ResearchSource
4. Every SectionContent must have a valid jobId that references an existing ResearchJob
5. Claims that require citation must have a corresponding citationKey after verification
6. All URLs in ResearchSource, Citation, and Claim must be valid URL format
7. Scorecard percentages must be between 0 and 100
8. NonNegotiableStatus requirements must align with constitution requirements