# Tech Debt Audit Skill — Context & Important Notes

## Purpose

This skill was created to provide structured, actionable technical debt audits across diverse codebases. It's designed for:
- **Practitioners:** Tech leads wanting a quick debt assessment before starting new features
- **Evaluators:** Testing Claude model performance across languages and edge cases
- **Teams:** Getting a written, prioritized remediation roadmap

## Design Philosophy

The three-phase methodology exists for a reason:

1. **Phase 1 (Discovery)** is fast and always runs first. It maps structure without reading all code. This prevents token explosion on large repos.
2. **Phase 2 (Signals)** is grep-based and language-aware. It rapidly identifies high-risk areas without needing full semantic analysis.
3. **Phase 3 (Deep Read)** is selective. Only 15–25 files are read in detail, chosen by debt signal density + size + coupling.

**Why this matters:** If a model skips Phase 1 or Phase 2 and tries to read the whole codebase immediately, it will:
- Burn tokens unnecessarily
- Miss the prioritization opportunity
- Produce generic findings instead of targeted ones
- Struggle with large monorepos

**The skill structure is load-bearing.** Don't skip steps.

## Critical Edge Cases Validated

### 1. Tiny Codebases (1–3 files)

**What happens:** Phase 1 still produces metrics. Snapshot shows "1 file, 23 lines, 0% test coverage."

**What to watch for:**
- The skill should NOT skip analysis just because the project is small.
- Small does not mean low-debt. A 20-line file can have critical security issues.
- Test evaluation on `tiny-codebase/` (CSV converter with bare except, no validation).

**Expected behavior:** Report 4–6 real issues in a 1-file project. Severity should be proportional to actual risk, not project size.

### 2. Mixed-Language Monorepos

**What happens:** Phase 1 detects Go, Python, JavaScript. Phase 2 applies language-specific signals to each directory. Phase 3 selects target files across all three languages.

**What to watch for:**
- The skill should detect ALL languages present, not just the first one found.
- Cross-language debt signals should be identified (e.g., hardcoded secrets in JS frontend, SQL injection in Python backend).
- The final report should be ONE consolidated report, not three separate reports.
- Per-package effort estimates are helpful but secondary; the report should focus on consolidated priority.

**Expected behavior:** Test on `mixed-monorepo/`. Should identify 12–18 issues spanning Go, Python, JS. Security issues (SQL injection, hardcoded credentials) should rank as Critical regardless of language.

### 3. Bare-Minimal Projects (No package.json, go.mod, etc.)

**What happens:** Phase 1 can't rely on standard marker files. It must infer language from file extensions and content.

**What to watch for:**
- If a project has no config files, the skill should still detect language (usually by .js, .py, .go extension).
- The snapshot will show "No CI/CD", "No monorepo", "No test files" — this is correct.
- Phase 2 and 3 should still find debt signals even without standard tooling context.

**Expected behavior:** Test on `bare-minimal/`. Should identify language as JavaScript, find hardcoded secrets and eval() usage, and not fail due to missing package.json.

---

## What Models Frequently Get Wrong (Watch Out For)

### 1. Skipping Phase 1

**Symptom:** Report jumps straight to "reading all files" or "running static tools."

**Why it's wrong:** Phase 1 discovery sets context. It tells you:
- How big the project is (prevents token overrun)
- What languages are present (guides Phase 2)
- What test coverage looks like (frames remediation effort)

**Fix:** Always do Phase 1 first. Even for tiny projects, run the discovery steps.

### 2. Not Counting TODOs/FIXMEs Accurately

**Symptom:** Report says "2 TODOs" but there are actually 10 in the code.

**Why it's wrong:** TODOs are a signal of abandoned work. The skill explicitly greps for them. Missing them suggests Phase 2 is incomplete.

**Fix:** Phase 2 requires explicit grep for `TODO`, `FIXME`, `HACK`, `XXX` with counts. Verify the numbers match.

### 3. Missing Security Issues

**Symptom:** Report doesn't flag hardcoded credentials, SQL injection, or eval().

**Why it's wrong:** These are not subtle. The skill has explicit Phase 2 patterns for:
- `password =`, `secret`, `API_KEY=` (config)
- String interpolation in SQL queries (injection risk in Python/JS)
- `eval(` (JavaScript), `eval()` (Python), `panic(recover())` (Go)

**Fix:** If these aren't in the report, Phase 2 signal detection was skipped or done incorrectly. Re-run Phase 2.

### 4. False Positives (Flagging Non-Issues)

**Symptom:** Report flags `test.py` as having "unused imports" or flags logger.debug() in test files as "debug logging pollution."

**Why it's wrong:** The skill is selective about where to apply patterns. Debug logging in test files is fine. Test files can have unused imports.

**Fix:** When flagging an issue, verify:
- Is it actually a file that matters? (exclude test files, vendor, node_modules)
- Is the pattern actually problematic in this context?
- Did you read the file or just grep blindly?

### 5. Vague Suggested Fixes

**Symptom:** "Improve error handling" or "Add tests" without specifics.

**Why it's wrong:** The user needs actionable guidance. "Use try/catch with logger.error(e)" is actionable. "Handle errors better" is not.

**Fix:** When suggesting a fix:
- Reference the specific pattern (use bcrypt, not Base64)
- Include an example (e.g., `logger.error(f"Failed to fetch: {e}")`)
- Link to authoritative sources (OWASP, PEP 8, refactoring.guru)

### 6. Ignoring Effort Estimates

**Symptom:** Report flags a security fix as "Epic (3+ weeks)" or a linting cleanup as "Small (hours)" inconsistently.

**Why it's wrong:** Effort estimates should be calibrated:
- **Small (hours):** Config changes, fix one function, enable a linter
- **Medium (1–3 days):** Add a test suite for one module, refactor one coupling issue
- **Large (1–2 weeks):** Full test suite, major auth rework, monorepo refactor
- **Epic:** Multi-quarter effort (new architecture, dependency replacement)

**Fix:** Effort should scale with scope. Security fixes are often Small (move to env var) unless they require architectural change (Medium/Large).

---

## Important Assumptions

### What the Skill Assumes Is True

1. **Languages are detectable by markers or content.** If a repo has package.json, it's JavaScript. If it has go.mod, it's Go. If it lacks markers, file extensions are used.

2. **Code quality correlates with test coverage.** Projects with <20% test-to-source ratio are flagged. This is heuristic-based; it's not perfect but is a good signal.

3. **Static tools are optional.** If eslint is installed, use it. If not, the LLM-based analysis carries the weight. The report should note which tools were available.

4. **Monorepos have a `packages/`, `apps/`, or similar directory.** The skill looks for these patterns. Monorepos with custom structures might not be detected perfectly.

5. **The user is a tech lead or engineer, not a novice.** The report should be technical but not overly jargon-heavy. It should assume familiarity with concepts like "coupling," "error handling," and "test coverage."

### What the Skill Does NOT Assume

- That CI/CD is present (it notes if it's absent)
- That all languages have linters installed (it gracefully skips them)
- That the repo is well-organized (messy repos are handled)
- That the user has unlimited tokens (Phase 2 prioritizes high-value targets)

---

## Troubleshooting

### Problem: Report is truncated or missing sections

**Likely cause:** Token limit hit during Phase 3.

**Fix:** Phase 2 should have selected only 15–25 target files, not all files. If the report is truncated, it means too many files were read. Re-check Phase 2 prioritization.

### Problem: Detected language is wrong

**Likely cause:** Phase 1 language detection failed.

**Fix:** Check for marker files (package.json, go.mod, etc.). If absent, check file extensions. If still ambiguous, note it in the Audit Methodology.

### Problem: Issues seem generic or not specific to this codebase

**Likely cause:** Phase 3 didn't actually read the target files. Generic advice is being given instead.

**Fix:** Phase 3 must read the selected files and provide evidence (file:line). If evidence is missing, files weren't read.

### Problem: Critical security issues were missed

**Likely cause:** Phase 2 grep patterns were incomplete or skipped.

**Fix:** Explicitly grep for:
- `password=`, `secret`, `API_KEY`, `hardcoded` (credentials)
- String interpolation in SQL (e.g., `f"SELECT * WHERE id = {user_input}"`)
- `eval(`, `unsafe`, `.unwrap()` (dangerous functions)

---

## What to Communicate to Users

When presenting a tech debt report to a user, highlight:

1. **Overall Debt Level:** Is this Critical (fix now), High (next sprint), Medium (next quarter), or Low (backlog)?

2. **Top 3 Issues:** Which 3 issues should they fix first? (Usually security > error handling > testing)

3. **Remediation Roadmap:** "These are the critical fixes (2–3 days), these are high (1 week), these are medium (next quarter)."

4. **Root Causes:** "You have 10 FIXMEs because the codebase was built fast without testing. Adding a basic test suite will prevent future issues."

5. **Next Steps:** "Run `mls:security-scanner` for OWASP-specific checks. Run language linters (eslint, pylint) for mechanical issues."

---

## Future Improvements (Not in Scope Now)

These are ideas for future iterations if needed:

- Per-package debt levels in monorepos (e.g., "backend-go: 3 issues, frontend-js: 5 issues")
- Cost-benefit analysis for each issue (effort vs. impact)
- Confidence scores for findings (high/medium/low)
- Integration with GitHub Issues API to auto-create tickets
- Comparison against industry baselines (e.g., "projects in your category average 15 issues")

---

## Calibration Notes

The skill was validated against 6 test codebases:
- **js-seeded** (3 files, critical security debt) ✓
- **python-seeded** (1 file, injection vulnerability) ✓
- **go-seeded** (1 file, error handling) ✓
- **tiny-codebase** (1 file, minimal but real debt) ✓
- **bare-minimal** (1 file, no config, security issues) ✓
- **mixed-monorepo** (4 files, 3 languages, cross-cutting issues) ✓

All tests produced credible, actionable reports. The skill is ready for distribution.
