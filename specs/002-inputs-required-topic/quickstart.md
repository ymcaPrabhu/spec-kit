# Quickstart Guide: Research Application

## Prerequisites
- Node.js LTS (v18 or higher)
- pnpm package manager
- Perplexity API key (PERPLEXITY_API_KEY)
- OpenRouter API key (OPENROUTER_API_KEY)

## Setup

1. **Install dependencies:**
   ```bash
   pnpm install
   ```

2. **Set up environment variables:**
   Create a `.env` file in the project root:
   ```env
   PERPLEXITY_API_KEY=your_perplexity_api_key_here
   OPENROUTER_API_KEY=your_openrouter_api_key_here
   ```

3. **Build the project:**
   ```bash
   pnpm build
   ```

## Basic Usage

### Run a research project:
```bash
pnpm research "Generative AI risks in BFSI (2023–2025)" --workers 6 --days 365 --style ieee --geo IN,US
```

### Available Options:
- `--workers <number>`: Number of parallel workers (default: 6)
- `--days <number>`: Date range in days (default: 365)
- `--style <ieee|apa>`: Citation style (default: ieee)
- `--geo <codes>`: Geographic restrictions (e.g., US,IN)
- `--allowlist <domains>`: Comma-separated domain allowlist
- `--denylist <domains>`: Comma-separated domain denylist
- `--model <name>`: Specific model to use
- `--maxTokens <number>`: Maximum tokens per request
- `--resume`: Resume an interrupted research run

## Example Commands

### Basic Research:
```bash
pnpm research "Impact of renewable energy on grid stability"
```

### Focused Research with Filters:
```bash
pnpm research "Machine learning applications in healthcare" --days 730 --style apa --workers 8
```

### Geographic-Limited Research:
```bash
pnpm research "Electric vehicle adoption trends" --geo US,DE,JP --workers 4
```

### Domain-Restricted Research:
```bash
pnpm research "Blockchain technology in finance" --allowlist arxiv.org,ssrn.com --days 180
```

## Project Structure
After running a research project, you'll find output in `output/<slug>/`:
```
output/<topic-slug>/
├── report.md          # Master markdown document
├── report.pdf         # Generated PDF with IEEE citations
├── references.bib     # BibTeX references
├── references.json    # JSON references
├── outline.json       # Report structure
├── sections/          # Individual section files
├── notes/             # Claim→citation mapping
└── logs/              # Detailed execution logs
```

## Verification
After completion, check the scorecard.json to verify:
- ≥80% sections passed fact-check
- Zero dead links (all sources returned HTTP 200)
- Each section has ≥2 citations
- PDF generated with valid table of contents

## Troubleshooting
- If API calls fail, verify your API keys in `.env`
- For slow performance, reduce the number of workers
- For citation issues, ensure IEEE CSL files are properly configured