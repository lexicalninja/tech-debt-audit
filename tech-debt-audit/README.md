# Tech Debt Audit Skill

A comprehensive codebase technical debt and architecture audit skill that produces structured markdown reports.

## Usage

**Explicit triggers:**
- "Can you do a tech debt audit on this codebase?"
- "I'd like a technical debt review"
- "Audit the codebase for tech debt"
- "Generate a debt report"

## What It Does

1. **Phase 1: Discovery** — Maps the codebase structure, detects languages, identifies test coverage
2. **Phase 2: Signal Detection** — Grep-based analysis for debt indicators (TODOs, hardcoded config, debug logging, etc.)
3. **Phase 3: Deep Analysis** — Reads selected files, runs static analysis tools, identifies architectural issues

## Output

Generates `technical-debt-report.md` with:
- Executive summary
- Codebase snapshot
- 5–15 issues with severity, location, fix suggestions, and authoritative references
- Remediation roadmap
- Audit methodology

## Key Features

- **Language-specific analysis:** Detects language and applies language-specific patterns
- **Hybrid approach:** Combines static tools (eslint, pylint, etc.) with LLM analysis
- **No source modification:** Only writes to report file; never modifies code
- **Confirmation prompt:** Asks for confirmation before writing the report

## Files

- `SKILL.md` — Complete skill instructions and procedure
- `evals/evals.json` — Test prompts for evaluation
- `README.md` — This file

## Testing

Six test codebases available at `~/Documents/repos/skillz/test-repos/`:

- **js-seeded/** — 3-file JavaScript project with security debt (hardcoded secrets, weak hashing)
- **python-seeded/** — Single Python file with SQL injection risk and input validation issues
- **go-seeded/** — Single Go file with error handling gaps and panic patterns
- **tiny-codebase/** — Edge case: minimal 1-file project (23 lines) with bare except and no validation
- **bare-minimal/** — Edge case: no config files, hardcoded credentials and eval() usage
- **mixed-monorepo/** — Edge case: multi-language monorepo (Go, Python, JavaScript) with cross-cutting security issues

For a quick test run:
```bash
cd ~/Documents/repos/skillz/test-repos/js-seeded
# Then say: "Can you do a tech debt audit?"
```

## References

- Martin Fowler: https://refactoring.com/
- OWASP: https://owasp.org/
- 12factor.net: https://12factor.net/
- Refactoring.guru: https://refactoring.guru/
