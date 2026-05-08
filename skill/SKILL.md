---
name: tech-debt-audit
description: Performs a comprehensive technical debt and architecture audit across an entire codebase. Use this skill when the user explicitly requests a code audit, technical debt review, or codebase health assessment. Produces a structured markdown report saved to the project root.
allowed-tools:
  - Bash
  - Read
  - Glob
  - Write
---

# Tech Debt Audit Skill

This skill performs a full-codebase technical debt and architecture audit, producing a structured markdown report.

## When to Use

Use this skill when the user explicitly asks for:
- "tech debt audit" / "technical debt audit"
- "technical debt review" / "debt report"
- "audit the codebase" / "full codebase audit"
- "code health audit"

Do **not** trigger on vague requests ("what should we clean up") or single-file reviews.

## Safety Note

This skill only writes to `technical-debt-report.md` at the project root. Source code is never modified. User confirmation is requested before writing the report.

---

## Audit Process (Three Phases)

### Phase 1: Codebase Discovery

Run before analyzing any source code. This phase maps the codebase structure and identifies what languages/frameworks are present.

**Steps:**

1. **Detect language(s):** Look for marker files:
   - JavaScript/TypeScript: `package.json`
   - Python: `pyproject.toml`, `requirements.txt`, `setup.py`
   - Go: `go.mod`
   - Rust: `Cargo.toml`
   - Java: `pom.xml`
   - Ruby: `Gemfile`
   - Other: `Dockerfile`, `Makefile`

2. **Get directory tree:** Full structure, excluding:
   - `node_modules`, `.git`, `vendor`, `__pycache__`, `.venv`, `dist`, `build`, `.next`, `coverage`, `.pytest_cache`

3. **Identify hotspots:** Which directories have the most files?

4. **Size analysis:** Find 20 largest source files by line count. Look for god modules (400+ lines).

5. **CI/CD signals:** Check for `.github/workflows/`, `Dockerfile`, `Makefile`, `gitlab-ci.yml`, `.circleci/`

6. **Test coverage:** Identify test directories (`test/`, `tests/`, `__tests__/`, `spec/`). Estimate test-to-source ratio.

7. **Monorepo signals:** Check for `packages/`, `apps/`, `turbo.json`, `nx.json`, `go.work`

**Output:** Summarize findings for the report snapshot.

---

### Phase 2: Debt Signal Detection

Run targeted greps to surface debt signals without reading all files. This phase is fast and identifies high-risk areas.

**Language-agnostic signals:**
- `TODO`, `FIXME`, `HACK`, `XXX` — sample and count
- `@deprecated` markers
- Dead code annotations: `# type: ignore`, `# noqa`, `@SuppressWarnings`, `// @ts-ignore`, `// eslint-disable`
- Hardcoded config: `localhost:`, `127.0.0.1`, `password =`, `API_KEY=`, `secret`
- Empty catch/except blocks: `catch {}`, `except: pass`, `except Exception:`
- Debug logging in non-test files: `console.log`, `print(`, `fmt.Println`, `logger.debug` (check it's not in test files)

**Language-specific signals:**

*JavaScript/TypeScript:*
- `: any` type annotations
- `// @ts-ignore`, `// eslint-disable`
- Untyped imports (`import * as`)
- `eval()`

*Python:*
- `except:` (bare except, no exception type)
- `# type: ignore`, `# pylint: disable`
- `globals()`, `eval()`
- Unused imports

*Go:*
- `panic(recover())`
- Unchecked errors (`_ = err`)
- `unsafe` keyword

*Java:*
- Raw types (e.g., `List` instead of `List<String>`)
- `@Deprecated`
- `@SuppressWarnings`

*Rust:*
- `unsafe`
- `.unwrap()` outside tests
- `panic!()`

**Ranking:** Score files by debt signal density. Select **15–25 target files** for Phase 3:
- Highest debt signal density
- Largest files (complexity proxy)
- High-import files (coupling)
- Files with lowest test coverage

---

### Phase 3: Selective Deep Reads + Hybrid Analysis

Read the selected files and combine static analysis tool output with LLM analysis to identify architectural issues.

**Static Analysis Tools (per language):**

- **JavaScript/TypeScript:** Run `eslint` if available. Parse output for:
  - Complexity warnings
  - Unused variables
  - Broad exception handling
  - Deprecated APIs
  
- **Python:** Run `pylint` or `flake8` if available. Parse for:
  - Line length violations (indicator of complexity)
  - Unused imports/variables
  - Bare except blocks
  - Cyclomatic complexity
  
- **Go:** Run `go vet` and `golangci-lint` if available. Parse for:
  - Unused variables
  - Shadowed variables
  - Error handling issues
  
- **Rust:** Run `clippy` if available. Parse for:
  - Complexity warnings
  - Error handling (`unwrap()` calls)
  
- **Java:** Run `checkstyle` or `spotbugs` if available.

**LLM Analysis (reading selected files):**

Read selected files and look for:

1. **God modules:** Single file doing too many things. High line count + unrelated functions/classes. Example: `utils.js` with 30 unrelated utility functions.

2. **Coupling:** Count imports per file. Files importing many others = high coupling. Circular imports = architectural risk.

3. **Duplication:** Repeated code patterns that should be extracted into shared functions.

4. **Error handling:** Missing error checks, silent failures, broad `try/catch` or `try/except` blocks, `panic(recover())` patterns.

5. **Missing tests:** Code with no corresponding test file, high cyclomatic complexity without test coverage.

6. **Code smells:**
   - Long methods (150+ lines)
   - Deeply nested logic (4+ levels)
   - Magic numbers without explanation
   - Cryptic variable names

**Combine results:** Merge static tool findings + LLM findings into a unified list of issues.

---

## Report Template

Save the report to `technical-debt-report.md` at the project root.

```markdown
# Technical Debt & Architecture Audit

**Project:** [name]  
**Date:** [YYYY-MM-DD]  
**Scope:** full codebase

## Executive Summary

[3–5 sentences. Written for a tech lead or EM. Summarize overall health, top 2–3 risks, and remediation priority.]

**Overall Debt Level:** Critical | High | Medium | Low  
**Estimated Remediation Effort:** [X days / weeks / months]

## Codebase Snapshot

| Metric | Value |
|--------|-------|
| Language(s) | [comma-separated] |
| Framework(s) | [comma-separated] |
| Total Files | [N] |
| Source Files | [N] |
| Test Files | [N] |
| Test-to-Source Ratio | [N%] |
| Largest File | [filename:lines] |
| CI/CD Present | Yes/No |
| Monorepo | Yes/No |
| TODOs/FIXMEs | [count] |

## Issues

### [CAT-NNN]: [Short Title]
- **Severity:** Critical | High | Medium | Low
- **Category:** [DEBT, ARCH, DEPS, TEST, DOCS, DEAD, PERF, CMPL]
- **Location:** [file:line or directory]
- **Description:** [What + why, 2–4 sentences]
- **Evidence:** [Specific observation or grep hit]
- **Suggested Fix:** [Actionable approach]
- **References:**
  - [Title](URL)
  - [Title](URL)
- **Effort:** Small (hours) | Medium (1–3 days) | Large (1–2 weeks) | Epic

[Repeat for 5–15 issues, ordered by severity then effort]

## Remediation Roadmap

### Critical (Immediate)
[List critical issues with fix approach]

### High (Next Sprint)
[High-severity issues prioritized by impact/effort]

### Medium (Next Quarter)
[Medium issues]

### Backlog
[Low issues]

## Patterns & Root Causes

[Systemic findings that appear across multiple files. Example: "Lack of error handling is pervasive because error types are not standardized."]

## Audit Methodology

- **Phase 1:** Language detection, file tree, size/hotspot analysis, CI/CD check
- **Phase 2:** Grep-based debt signals (language-agnostic and language-specific)
- **Phase 3:** Deep read of [N] target files + static analysis tool output + LLM analysis
- **Tools used:** [eslint, pylint, etc. as applicable]
- **Files analyzed:** [list of deep-read files]
- **Limitations:** [e.g., "Large test suites not fully examined", "Monorepo sub-packages analyzed individually"]
- **Recommendations:** Run `mls:security-scanner` for OWASP-specific scan; run language linters directly for mechanical issues

---
```

## Issue Categories & Severity

**Categories:**
- `DEBT` — Technical debt (hacky code, shortcuts, quick fixes)
- `ARCH` — Architecture (modularity, coupling, design)
- `DEPS` — Dependencies (outdated, unused, version conflicts)
- `TEST` — Testing (low coverage, missing tests, brittle tests)
- `DOCS` — Documentation (missing, stale, unclear)
- `DEAD` — Dead code (unused functions, unreachable code)
- `PERF` — Performance (inefficient algorithms, N+1 queries)
- `CMPL` — Complexity (long methods, nested logic)

**Severity Criteria:**
- **Critical:** Production incident risk, credential exposure, unmaintainable at current scale
- **High:** Significantly increases cost of every future change
- **Medium:** Creates drag or risk; project still functional
- **Low:** Cleanup opportunities; low impact

---

## References for Issues

Use authoritative sources when citing best practices:

- **Martin Fowler (refactoring.com):** God Class, Long Method, Duplicate Code, etc.
- **OWASP (owasp.org):** Security issues, hardcoded secrets, etc.
- **12factor.net:** Configuration, logs, environment management
- **Refactoring.guru:** Design patterns, code smells
- **Google Style Guides:** Language-specific idioms (Python, Go, etc.)
- **Rust Book:** Ownership, error handling patterns

---

## Execution Checklist

Before writing the report:

- [ ] Phase 1 complete: Language(s), file count, test ratio, largest files identified
- [ ] Phase 2 complete: Debt signals ranked, 15–25 target files selected
- [ ] Phase 3 complete: Target files read, static tools run, LLM analysis done
- [ ] Issues compiled: 5–15 issues with severity, location, fix, references
- [ ] Report structure verified: All sections present (summary, snapshot, issues, roadmap, methodology)
- [ ] False positives checked: Remove flagged items that aren't real debt
- [ ] Ready to write report

---

## Writing the Report

1. **Ask for confirmation:** "Ready to save the audit report to `technical-debt-report.md` at [project root]? Proceed?"
2. **On confirmation:** Write the report to `technical-debt-report.md`
3. **Summary:** Output a brief summary for the user (3–5 sentences) highlighting top issues and next steps

---

## Notes

- **In-memory approach:** Analysis is done in-memory; no persistence. If persistence/querying is needed later, can migrate to graphdb.
- **Monorepos:** Handle as best effort; note limitations in Audit Methodology section.
- **Test-to-source ratio:** Rough estimate. Low ratio (<20%) is a debt signal.
- **Static tools:** Only use if installed. If not available, note in Audit Methodology.
