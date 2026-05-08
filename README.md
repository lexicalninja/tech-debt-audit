# Tech Debt Audit Skill

A comprehensive codebase technical debt and architecture audit skill for Claude Code. Produces structured markdown reports with prioritized remediation roadmaps.

## Quick Start

See [`tech-debt-audit/README.md`](./tech-debt-audit/README.md) for complete documentation.

**Basic usage:**
```bash
cd your-codebase/
# Then in Claude Code say: "Can you do a tech debt audit on this codebase?"
```

## What's In This Repo

- **`tech-debt-audit/`** — Skill documentation and methodology
  - `SKILL.md` — Three-phase audit process
  - `README.md` — User guide & evaluation instructions
  - `CONTEXT.md` — Design philosophy & assumptions
  - `QUICK_EVAL.md` — Fast reference for evaluators
  - `MANIFEST.md` — Package overview
  - `evals/evals.json` — 6 test cases

- **`test-repos/`** — Validation test codebases (6 real examples)
  - Single-language: `js-seeded/`, `python-seeded/`, `go-seeded/`
  - Edge cases: `tiny-codebase/`, `bare-minimal/`, `mixed-monorepo/`
  - Each includes generated `technical-debt-report.md` as reference output

## For Evaluators

See [`tech-debt-audit/QUICK_EVAL.md`](./tech-debt-audit/QUICK_EVAL.md) for fast checklist and scoring rubric.

## Key Features

- **Multi-language:** Go, Python, JavaScript, Java, Rust
- **Security-aware:** Flags hardcoded credentials, SQL injection, eval(), etc.
- **Scales:** Works on 1-file projects and 1000+ file monorepos
- **Safe:** Read-only, confirmation before writing, no source modification
- **Actionable:** Specific fixes with authoritative references (OWASP, Martin Fowler, etc.)

## Documentation Map

| File | Purpose |
|------|---------|
| `tech-debt-audit/SKILL.md` | How the skill works (three phases) |
| `tech-debt-audit/README.md` | User guide + evaluation criteria |
| `tech-debt-audit/CONTEXT.md` | Design decisions & assumptions |
| `tech-debt-audit/QUICK_EVAL.md` | Fast reference for testing |
| `tech-debt-audit/MANIFEST.md` | Package contents & quality gates |
