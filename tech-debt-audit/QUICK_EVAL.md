# Quick Evaluation Reference

Fast checklist for running the tech-debt-audit skill against test repos and comparing model performance.

## One-Liner Setup

```bash
cd ~/Documents/repos/skillz/test-repos
```

## Run All Tests (6 total)

| Test | Directory | Prompt | Expected Issues | Security Issues |
|------|-----------|--------|-----------------|-----------------|
| **1** | `js-seeded/` | "Can you do a tech debt audit?" | 8–12 | API_KEY, SECRET_KEY, Base64 hashing |
| **2** | `python-seeded/` | "Audit the whole repo..." | 6–10 | SQL injection, hardcoded password |
| **3** | `go-seeded/` | "I inherited this codebase..." | 6–10 | Error handling, panic/recover |
| **4** | `tiny-codebase/` | "Small internal tool..." | 4–6 | Bare except, no validation |
| **5** | `bare-minimal/` | "Audit this repo..." | 4–6 | Hardcoded secret, eval() |
| **6** | `mixed-monorepo/` | "We have a monorepo..." | 12–18 | SQL injection, hardcoded secrets (3+) |

## Quick Score Card

After running all tests, grade each on:

```
Security Issues Caught:  [ ] Yes  [ ] Partial  [ ] No
File Counts Correct:     [ ] Yes  [ ] Partial  [ ] No
Language Detection:      [ ] Yes  [ ] Partial  [ ] No
Edge Cases Handled:      [ ] Yes  [ ] Partial  [ ] No
Report Quality:          [ ] Good [ ] Ok       [ ] Poor
```

## Red Flags (Stop Here)

Stop evaluation if you see:
- ❌ Hardcoded credentials NOT flagged as Critical
- ❌ SQL injection NOT identified in Python backend
- ❌ eval() NOT flagged as security risk in bare-minimal
- ❌ Mixed-monorepo report missing Python or JavaScript findings
- ❌ Tiny codebase report is empty or too brief

## Golden Signals (Passed)

Continue if you see:
- ✅ All hardcoded credentials flagged as Critical
- ✅ SQL injection identified with specific line reference
- ✅ File counts match actual counts (within ±1)
- ✅ Mixed-monorepo consolidates all 3 languages into 1 report
- ✅ Executive summary is 3–4 sentences, not a paragraph

## Comparison Across Models

If testing multiple models, compare:

| Metric | Model A | Model B | Winner |
|--------|---------|---------|--------|
| Security issues caught | `/6` | `/6` | — |
| False positives | N/A | N/A | — |
| Severity accuracy | `/6` | `/6` | — |
| Monorepo handling | ✓/✗ | ✓/✗ | — |
| Report quality (1–5) | — | — | — |
| Tokens used (total) | — | — | — |
| Time (minutes) | — | — | — |

## Key Metrics by Test

### js-seeded
**Must find:**
- Hardcoded API_KEY and SECRET_KEY (Critical)
- Base64 password hashing (Critical security)
- Zero test coverage (Critical)
- God module (utils.js with 192 lines, unrelated functions) (High)

**File count check:** 3 files total, 2 source, 0 test files, 0% test ratio

### python-seeded
**Must find:**
- SQL injection risk (Critical) — look for `f"SELECT * WHERE id = {user_input}"`
- Missing input validation (High)
- Bare except clause (High)

**File count check:** 1 file, 0 test files

### go-seeded
**Must find:**
- Unchecked errors / error propagation (High)
- Error handling issues (High)
- Panic patterns (Medium)

**File count check:** 1 file, ~150 lines

### tiny-codebase
**Must find:**
- Bare except clause (High)
- Missing input validation (High)
- Zero test coverage (High)

**File count check:** 1 file, 23 lines, 0 TODOs (skill should report 0, not hallucinate)

### bare-minimal
**Must find:**
- Hardcoded credential "secret123" (Critical)
- eval() usage (Critical)
- Silent error handling (High)

**File count check:** 1 file, 21 lines, 1 FIXME (skill should count exactly 1)

### mixed-monorepo
**Must find (3+ critical security issues):**
- SQL injection in Python (packages/backend-python/app.py:15)
- Hardcoded database password (packages/backend-python/app.py:7)
- Hardcoded API key in JavaScript (packages/frontend-js/index.js:1)

**File count check:** 4 source files, 0 test files, 10 TODOs/FIXMEs, Monorepo = Yes, 3 languages

**Bonus:**
- Identifies all 3 languages (Go, Python, JavaScript)
- Identifies 3 packages in packages/ directory
- Notes zero test coverage across all services
- Flags pickle deserialization risk (High)
- Flags missing input validation (High)

---

## Troubleshooting Quick Fixes

| Problem | Check | Fix |
|---------|-------|-----|
| Report is empty | Phase 1? | Ensure discovery runs first |
| Wrong language | File extension | Check detection logic |
| Missed security issue | Phase 2 grep | Re-run grep for `secret`, `password`, `eval` |
| Too many issues | Phase 3 target selection | Limit to 15–25 files, not all |
| No remediation roadmap | Report template | Ensure roadmap section exists |

---

## Distribution Checklist

Before shipping, verify:
- [ ] SKILL.md is complete and clear
- [ ] README.md has evaluation instructions
- [ ] CONTEXT.md explains design philosophy
- [ ] evals/evals.json has all 6 test cases
- [ ] Test repos exist with real debt
- [ ] Sample output (js-seeded report) is included
- [ ] All 3 phases are documented
- [ ] Important edge cases are called out
