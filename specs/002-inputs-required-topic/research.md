# Research: Research Application with Manager-Workers Architecture

## Decision: Perplexity API vs Alternative Search Services
**Rationale**: Perplexity API was chosen for its research-focused capabilities, direct answers with citations, and API-friendly interface that provides source references alongside responses.
**Alternatives considered**: 
- Google Custom Search API: Requires separate citation tracking, less research-focused
- SerpAPI/Bright Data: More generic web scraping tools without built-in research features
- Academic APIs (Semantic Scholar, PubMed): Limited to academic papers, not general web content

## Decision: OpenRouter vs Direct LLM Providers
**Rationale**: OpenRouter provides access to multiple high-quality LLMs through a single API, allowing for model experimentation and fallback options. It supports advanced models suitable for research synthesis and fact-checking.
**Alternatives considered**:
- Direct OpenAI API: Limited to OpenAI models only
- Anthropic API: Limited to Claude models only
- Self-hosted models: Higher infrastructure complexity

## Decision: Pandoc vs Typst for PDF Export
**Rationale**: Pandoc was chosen for its mature ecosystem, extensive format support, and reliable CSL (Citation Style Language) implementation for IEEE citations. It has broad community support and extensive documentation.
**Alternatives considered**:
- Typst: Newer language with modern syntax but smaller ecosystem
- LaTeX: More complex syntax, steeper learning curve
- HTML/CSS to PDF converters: Less control over academic formatting standards

## Decision: Piscina vs Native Node.js Workers for Parallel Processing
**Rationale**: Piscina was chosen for its optimized pool management, better task distribution algorithms, and cleaner API for compute-intensive tasks like research processing. It integrates well with Node.js while providing true parallelism.
**Alternatives considered**:
- Native worker_threads: Lower-level API, requires more boilerplate for pool management
- Thread Pool: Less mature ecosystem
- Child processes: Higher overhead for frequent tasks

## Decision: JSDOM + @mozilla/readability for Content Extraction
**Rationale**: This combination provides reliable content extraction from web pages, removing navigation, ads, and other non-content elements. @mozilla/readability is a mature library specifically designed for this purpose.
**Alternatives considered**:
- Cheerio + custom extraction logic: Requires more custom development
- Article Extractor: Different API, less predictable results
- Puppeteer with custom extraction: Higher resource usage

## Decision: SQLite vs File System for Caching
**Rationale**: SQLite was chosen for structured caching with query capabilities, better performance for cache lookups, and easier management of cache metadata like TTLs. It also provides ACID properties for cache operations.
**Alternatives considered**:
- File system: Simpler but less efficient for complex cache queries
- Redis: More complex setup, overkill for single-user research application
- In-memory cache: No persistence across runs

## Decision: Commander.js vs Alternative CLI Frameworks
**Rationale**: Commander.js was chosen for its simplicity, active maintenance, good TypeScript support, and widespread adoption in the Node.js ecosystem. It handles option parsing, help generation, and subcommand structures elegantly.
**Alternatives considered**:
- Oclif: More complex, enterprise-focused framework
- yargs: Different API, slightly more verbose
- Inquirer: Not focused on command-line interface structure

## Decision: Zod vs Alternative Validation Libraries
**Rationale**: Zod was chosen for its TypeScript integration, schema inference capabilities, runtime validation, and excellent error messages. It ensures type safety across the manager-worker communication.
**Alternatives considered**:
- Joi: Different API, less TypeScript-friendly
- Yup: More focused on form validation
- Class-validator: Decorator-based, more complex for this use case