# Tech Debt Audit Skill

A comprehensive codebase technical debt and architecture audit skill that produces structured markdown reports. Designed for evaluating model performance across different codebases and edge cases.

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
- Executive summary (health level, remediation effort estimate)
- Codebase snapshot (files, languages, frameworks, test coverage)
- 5–15 issues with severity, category, location, description, evidence, fix suggestions, and references
- Remediation roadmap organized by severity tier
- Audit methodology and tools used

## Key Features

- **Language-specific analysis:** Go, Python, JavaScript, Java, Rust — detects and applies language-specific patterns
- **Hybrid approach:** Combines static tools (eslint, pylint, go vet, etc.) with LLM deep-read analysis
- **No source modification:** Read-only; only writes to report file
- **Confirmation prompt:** Asks for confirmation before writing the report
- **Robust edge cases:** Handles tiny codebases (1 file), monorepos (multiple languages), and projects with minimal config files

## Files

- `SKILL.md` — Complete skill instructions and three-phase procedure
- `evals/evals.json` — Test prompts covering nominal and edge cases
- `README.md` — This file
- `EVALUATION.md` — Instructions for evaluating model performance

## Quick Start

```bash
cd ~/Documents/repos/skillz/test-repos/js-seeded
# Then run:
# "Can you do a tech debt audit on this codebase?"
```

---

# Evaluation Guide for Model Performance

This section is for evaluators testing different Claude models or prompt variations.

## Test Codebases

**Location:** `~/Documents/repos/skillz/test-repos/`

| Directory | Type | Files | Debt Level | Purpose |
|-----------|------|-------|-----------|---------|
| `js-seeded/` | Single-lang (JS) | 3 | Critical | Baseline: hardcoded secrets, zero tests |
| `python-seeded/` | Single-lang (Python) | 1 | High | Baseline: Flask app with auth issues |
| `go-seeded/` | Single-lang (Go) | 1 | High | Baseline: error handling, coupling |
| `tiny-codebase/` | Edge case | 1 | High | Minimal project (CSV converter) |
| `bare-minimal/` | Edge case | 1 | Critical | No config files, hardcoded secrets, eval() |
| `mixed-monorepo/` | Edge case | 4 across 3 languages | Critical | Go + Python + JS, multi-package |

## Running the Evaluation

### Setup

```bash
cd ~/Documents/repos/skillz/test-repos
```

### Test Each Codebase

For each test repo, run the skill with the corresponding eval prompt from `evals/evals.json`:

**Eval 1: js-seeded**
```
Prompt: "Can you do a tech debt audit on this codebase? 
         We're starting a big new feature and I want to understand 
         what's in rough shape first. Save the report somewhere."
```

**Eval 2: python-seeded**
```
Prompt: "We've been moving fast for 18 months. I'm worried the code 
         is getting hairy and it's slowing us down. Can you audit 
         the whole repo and tell me what the biggest problems are? 
         I want a written report for the team."
```

**Eval 3: go-seeded**
```
Prompt: "I inherited this codebase from a consultant. It has a 
         packages/ directory with like 6 sub-packages. No idea what 
         shape it's in — can you map it and find the worst tech debt? 
         Especially interested in missing tests and half-finished code."
```

**Eval 4: tiny-codebase**
```
Prompt: "I'm auditing a small internal tool I wrote. It's pretty 
         minimal — just a few files. Can you tell me what tech debt 
         issues might be lurking? Save me a report."
```

**Eval 5: bare-minimal**
```
Prompt: "Audit this repo for me. Fair warning: it's pretty bare-bones, 
         might not have all the standard config files. Just do your 
         best to understand the structure and find issues."
```

**Eval 6: mixed-monorepo**
```
Prompt: "We have a monorepo with backend services in Go and Python, 
         and a frontend in JavaScript. Can you audit all of it and 
         give me a consolidated report on the biggest problems across 
         the whole system?"
```

---

## Evaluation Criteria

### Phase 1: Codebase Discovery

**What to check:**
- [ ] Language detection is accurate (matches actual language markers)
- [ ] File counts are correct (source files vs. test files)
- [ ] Test-to-source ratio is reasonable (even if rough estimate)
- [ ] Largest files are correctly identified
- [ ] Monorepo detection (if applicable) is correct
- [ ] TODOs/FIXMEs count matches actual count (or is within ±2)

**Expected behavior for edge cases:**
- **Tiny codebase:** Metrics should be accurate even with just 1 file
- **Bare-minimal:** Should infer language from file extensions; report no CI/CD, no monorepo
- **Mixed-monorepo:** Should identify all three languages and count per-package files

### Phase 2: Debt Signal Detection

**What to check:**
- [ ] All obvious TODOs/FIXMEs are caught
- [ ] Language-specific signals detected (e.g., `except:` in Python, `: any` in JS)
- [ ] Hardcoded credentials/config are flagged
- [ ] Dead code annotations identified (e.g., `# type: ignore`, `@ts-ignore`)
- [ ] 15–25 target files selected for Phase 3 (appropriate priorities)

**Expected findings:**
- **js-seeded:** Hardcoded secrets, no tests, untyped code, deprecated APIs
- **python-seeded:** SQL injection risk, bare except, missing input validation
- **go-seeded:** Error handling issues, unchecked errors, panic patterns
- **tiny-codebase:** Bare except, missing input validation
- **bare-minimal:** Hardcoded secrets, eval(), silent error handling
- **mixed-monorepo:** SQL injection, hardcoded credentials (across all languages), no tests

### Phase 3: Deep Analysis & Report Quality

**What to check:**
- [ ] Report structure matches template (summary, snapshot, issues, roadmap, methodology)
- [ ] Issues are real (not false positives)
- [ ] Severity levels are appropriate (critical > high > medium > low)
- [ ] Evidence is specific (file:line references, code snippets)
- [ ] Suggested fixes are actionable (not vague)
- [ ] References are relevant and authoritative (Martin Fowler, OWASP, etc.)
- [ ] Remediation effort estimates are reasonable
- [ ] Executive summary is written for a tech lead (not too technical, highlights risk)

**Expected issue counts:**
- **js-seeded:** 8–12 issues (security, testing, architecture)
- **python-seeded:** 6–10 issues (security, error handling, validation)
- **go-seeded:** 6–10 issues (error handling, coupling, logging)
- **tiny-codebase:** 4–6 issues (error handling, validation, tests)
- **bare-minimal:** 4–6 issues (security, error handling)
- **mixed-monorepo:** 12–18 issues (security across all three languages, testing, architecture)

### Critical Security Findings

**Must be flagged (should never be missed):**
- Hardcoded credentials (passwords, API keys, secrets)
- SQL injection vulnerabilities
- eval() usage
- Insecure deserialization (pickle, marshal)
- Unsafe DOM manipulation
- Bare except/catch blocks in critical paths

**js-seeded:**
- ✅ Hardcoded API_KEY and SECRET_KEY
- ✅ Base64 "hashing" of passwords (not real hashing)
- ✅ Zero test coverage

**bare-minimal:**
- ✅ Hardcoded secret ("secret123")
- ✅ eval() usage
- ✅ Silent error handling

**mixed-monorepo:**
- ✅ SQL injection in Python backend
- ✅ Hardcoded database password
- ✅ Hardcoded API key in frontend JavaScript
- ✅ Unsafe pickle deserialization
- ✅ Zero test coverage across all three services

---

## Metrics to Track

When comparing models or skill versions, capture:

1. **Completeness:** How many true debt signals were missed? (should be <5% false-negative rate)
2. **False-positive rate:** How many flagged issues are invalid? (should be <10%)
3. **Severity accuracy:** Are critical issues ranked as critical? (severity mismatch rate)
4. **Report quality:**
   - Is the summary concise and exec-ready? (yes/no)
   - Are fixes actionable? (vague vs. specific)
   - Are references authoritative? (yes/no)
5. **Edge case handling:** Does the skill gracefully handle tiny/bare/monorepo codebases? (yes/no per edge case)
6. **Language breadth:** Does the skill detect all languages in mixed-monorepo? (yes/no)
7. **Time & tokens:** How long does each audit take? How many tokens?

---

## What Should Remain Consistent Across Models

These aspects of the skill should NOT change regardless of model or iteration:

- **Three-phase methodology** (discovery → signals → deep read) — this structure prevents hallucination
- **Confirmation prompt before writing** — safety guardrail
- **No source code modification** — read-only principle
- **Report template** — consistent format helps users parse reports
- **Issue categories** (DEBT, ARCH, DEPS, TEST, DOCS, DEAD, PERF, CMPL) — standardized vocabulary
- **Reference to authoritative sources** — avoids made-up guidance

---

## Important Notes for Evaluators

### Known Limitations

1. **Monorepo handling:** The skill analyzes the full tree but may miss sub-package-specific architectures. This is acceptable; note it in the Audit Methodology section of the report.

2. **Static tool availability:** If eslint, pylint, go vet, etc. are not installed, the skill gracefully notes their absence. The LLM-based analysis carries the weight.

3. **Test coverage estimates:** The test-to-source ratio is rough (heuristic-based). Low ratios (<20%) are flagged as a signal, but exact coverage requires running the actual test suite.

4. **Large codebases:** The skill selects 15–25 files for deep read. For 1000+ file projects, this is sampling; some debt signals will be missed. This is intentional (prevent token overflow).

### What Counts as Success

A successful audit:
- ✅ Identifies 3+ critical security issues if they exist
- ✅ Correctly ranks severity (critical security > high error handling > medium cleanup)
- ✅ Produces actionable fixes (not vague advice)
- ✅ Handles all test repo edge cases without crashing or producing empty reports
- ✅ Consolidates multi-language findings into one coherent narrative
- ✅ Includes an executive summary a tech lead can act on
- ✅ Provides a remediation roadmap by priority tier

### Red Flags (Indicate a Problem)

- ❌ Missing critical security findings (hardcoded secrets, SQL injection)
- ❌ False positives (flagging non-issues as debt)
- ❌ Vague fixes ("use better error handling" instead of "use try/catch with logger.error()")
- ❌ Missing language detection in mixed-monorepo
- ❌ Incorrect file counts or test ratios
- ❌ Empty or truncated reports
- ❌ Inconsistent formatting or missing report sections

---

## References

- **Martin Fowler (refactoring.com):** God Class, Long Method, Duplicate Code, code smells
- **OWASP (owasp.org):** Security vulnerabilities, injection attacks, secrets management
- **12factor.net:** Configuration, environment management, logs
- **Refactoring.guru:** Design patterns, code smells
- **Google Style Guides:** Language-specific idioms
- **Rust Book:** Ownership, error handling patterns
