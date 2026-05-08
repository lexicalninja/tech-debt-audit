# Tech Debt Audit Skill - Installation

## Install the Skill

Copy the skill directory to your Claude Code skills folder:

```bash
cp -r tech-debt-audit ~/.claude/skills/
```

Or create a symlink:

```bash
ln -s $(pwd)/tech-debt-audit ~/.claude/skills/tech-debt-audit
```

## Verify Installation

After installation, the skill should be available in Claude Code:

```bash
ls ~/.claude/skills/tech-debt-audit/
# Should show: SKILL.md, README.md, evals/
```

## Usage

Once installed, use the skill by explicitly asking:

- "Can you do a tech debt audit on this codebase?"
- "I need a technical debt review"
- "Audit the codebase for tech debt"
- "Generate a debt report"

## Test the Skill

Test codebases with intentional debt are included:

```bash
cd test-repos/js-seeded
# Then ask: "Can you do a tech debt audit?"
```

The skill will generate `technical-debt-report.md` with findings.

## Files

- **SKILL.md** — Complete skill instructions and three-phase procedure
- **README.md** — Skill documentation
- **evals/evals.json** — Test prompts for evaluation
- **test-repos/** — Sample codebases with known debt for testing

## What the Skill Does

1. **Phase 1: Discovery** — Detects language, maps files, checks test coverage
2. **Phase 2: Signal Detection** — Grep-based analysis for debt indicators (TODOs, hardcoded config, etc.)
3. **Phase 3: Deep Analysis** — Reads selected files, runs static tools, identifies architectural issues

## Output

Generates `technical-debt-report.md` with:
- Executive summary
- Codebase snapshot
- 5–15 issues with severity, location, fixes, and references
- Remediation roadmap

## References

- Martin Fowler: https://refactoring.com/
- OWASP: https://owasp.org/
- 12factor.net: https://12factor.net/
- Refactoring.guru: https://refactoring.guru/
