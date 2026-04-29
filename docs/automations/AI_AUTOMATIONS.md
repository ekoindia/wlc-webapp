# AI Automations — Implementation Guide

Documentation for the AI-powered GitHub automations in this repository.
These automations automatically analyse issues, generate fixes, and review pull requests using free LLM models via [OpenRouter](https://openrouter.ai).

---

## Overview

Two independent workflows are available:

| Workflow | Trigger | What it does |
|----------|---------|-------------|
| 🤖 AI Issue Solver | Issue labelled `ai-fix`, or manual dispatch | Reads the issue, identifies relevant files, generates a code fix, opens a PR against `dev` |
| 🔍 AI PR Reviewer | PR labelled `ai-generated` opened/updated | Reviews the diff for correctness, security, conventions, and project guidelines; posts a structured review comment |

---

## File Structure

```
scripts/
├── ai_models.py          # Shared pool of LLM models (single source of truth)
├── ai_issue_solver.py    # Generates code fixes for GitHub issues
├── ai_pr_reviewer.py     # Reviews AI-generated pull request diffs
└── apply_changes.py      # Applies LLM-generated file changes to disk

.github/
└── workflows/
    ├── ai-issue-solver.yml   # Workflow for the issue solver
    └── ai-pr-reviewer.yml    # Workflow for the PR reviewer
```

---

## Required Secrets

Add these in **Settings → Secrets and variables → Actions**:

| Secret | Description |
|--------|-------------|
| `OPENROUTER_API_KEY` | API key from [openrouter.ai/keys](https://openrouter.ai/keys) |
| `GITHUB_TOKEN` | Automatically provided by GitHub Actions — no setup needed |

---

## Required Labels

The following labels must exist in your repository (**Settings → Labels**):

| Label | Used by |
|-------|---------|
| `ai-fix` | Applied to issues to trigger the AI solver |
| `ai-generated` | Applied automatically to AI-created PRs; triggers the PR reviewer |

---

## Workflow 1 — AI Issue Solver

**File:** `.github/workflows/ai-issue-solver.yml`
**Script:** `scripts/ai_issue_solver.py`

### How to trigger

- **Automatic:** Add the `ai-fix` label to any open issue.
- **Manual:** Go to **Actions → 🤖 AI Issue Solver → Run workflow** and enter the issue number.

### What happens step by step

```
Issue labelled "ai-fix"
        │
        ▼
1. Post "Working on it" comment on the issue
        │
        ▼
2. Scan repo file tree (skips node_modules, .git, dist, build, etc.)
        │
        ▼
3. Load project guidelines:
   - AGENTS.md
   - README.md
   - .github/copilot-instructions.md
        │
        ▼
4. Ask LLM: "Which TOP 5 files are most relevant to this issue?"
        │
        ▼
5. Read those files + build context (max 40,000 chars total)
        │
        ▼
6. Ask LLM to generate a fix (with project guidelines injected into the prompt)
        │
        ▼
7. Write ai_file_changes.json + ai_pr_description.md
        │
        ▼
8. Create branch  ai/fix-issue-<N>
   Apply file changes via apply_changes.py
   Commit + push
        │
        ▼
9. Open PR → base: dev, label: ai-generated
```

### Output files (temporary, created in CI runner)

| File | Purpose |
|------|---------|
| `ai_file_changes.json` | JSON describing files to create/modify/delete |
| `ai_pr_description.md` | PR body (written even on failure, with error message) |

---

## Workflow 2 — AI PR Reviewer

**File:** `.github/workflows/ai-pr-reviewer.yml`
**Script:** `scripts/ai_pr_reviewer.py`

### How to trigger

Automatically runs when a PR labelled `ai-generated` is **opened, synchronised, or reopened**.

### What happens step by step

```
PR opened with label "ai-generated"
        │
        ▼
1. Fetch the full PR diff  →  pr.diff
        │
        ▼
2. Load project guidelines:
   - AGENTS.md
   - README.md
   - .github/copilot-instructions.md
        │
        ▼
3. Ask LLM to review the diff against:
   - Correctness / bugs / edge cases
   - Security risks
   - Performance
   - Project conventions (TypeScript, tabs, functional React, etc.)
   - Test coverage
   - Breaking changes
        │
        ▼
4. Write:
   - ai_review_summary.md     → posted as the PR review body
   - ai_review_verdict.txt    → APPROVE | REQUEST_CHANGES | COMMENT
   - ai_review_comments.json  → inline file/line comments
        │
        ▼
5. Post GitHub PR review via API
   (maps verdict to GitHub review event)
```

### Verdict mapping

| Verdict | Meaning |
|---------|---------|
| `APPROVE` | Code looks good — only nits |
| `REQUEST_CHANGES` | Critical or major issues must be fixed before merge |
| `COMMENT` | Issues worth discussing but not blocking |

> ⚠️ The AI review is **advisory only**. A human reviewer must approve before merging.

---

## Multi-Model Fallback

**File:** `scripts/ai_models.py`

Both scripts share a single ordered pool of free LLM models. If a model is unavailable or rate-limited, the next one is tried automatically.

```python
MODELS = [
    "google/gemini-2.0-flash-exp:free",
    "google/gemma-4-31b-it:free",
    "qwen/qwen3-coder:free",
    "meta-llama/llama-3.3-70b-instruct:free",
    "nvidia/nemotron-3-super:free",
    "minimax/minimax-m2.5:free",
    "openai/gpt-oss-120b:free",
    "z-ai/glm-4.5-air:free",
    "tencent/hy3-preview:free",
]
```

Each model gets **2 retry attempts** with exponential backoff on `429 Rate Limited` responses before moving on to the next. To add or reorder models, edit `scripts/ai_models.py` only — both scripts import from it.

Find available free models at: https://openrouter.ai/models?q=free

---

## Project Guidelines Injection

A key feature of these automations is that the LLM is given the project's own coding conventions before generating any code. At runtime, both scripts read and inject:

| File | Why |
|------|-----|
| `AGENTS.md` | Full coding conventions, patterns, anti-patterns, testing rules |
| `README.md` | Project structure, available scripts, feature docs |
| `.github/copilot-instructions.md` | Code style rules, TypeScript/React patterns, file naming |

This means the AI will:
- Use **tabs** for indentation (not spaces)
- Use **TypeScript interfaces** (not types or enums)
- Use **functional React** (no class components)
- Use **absolute imports** (`import X from 'components/X'`)
- Use **ternary operators** for conditional rendering (not `&&`)
- Add tests in `__tests__/` mirroring the source path
- Use `useFeatureFlag` for feature flag checks
- Use `usePubSub` for cross-component events

---

## Security Design

### Shell injection prevention (workflow YAML)

`ISSUE_TITLE` from GitHub is user-controlled and could contain shell metacharacters. The workflow sanitizes it before use:

```bash
SAFE_TITLE=$(echo "$ISSUE_TITLE" | tr -dc '[:print:]' | head -c 100)
git commit -m "🤖 AI fix for issue #${ISSUE_NUMBER}: ${SAFE_TITLE}"
```

### Script injection prevention (github-script)

Instead of interpolating `${{ github.event.inputs.issue_number }}` directly into JavaScript (which executes it), the issue number is passed via env var and read with `process.env`:

```yaml
env:
  ISSUE_NUM: ${{ github.event.inputs.issue_number || '0' }}
script: |
  const issueNumber = parseInt(process.env.ISSUE_NUM, 10);
```

### Path traversal prevention (apply_changes.py)

Before writing any LLM-generated file, the resolved path is checked to be within the repository root:

```python
REPO_ROOT = pathlib.Path.cwd().resolve()
resolved = (REPO_ROOT / file_path).resolve()
if not str(resolved).startswith(str(REPO_ROOT)):
    print(f"⚠️  Skipping path outside repo: {path}")
    continue
```

---

## Robustness Details

| Concern | Solution |
|---------|----------|
| LLM wraps JSON in markdown fences | Regex stripping: `re.sub(r'^```\w*\n?', '', text)` |
| LLM API call fails before variable is assigned | Both `fix_raw` and `raw` initialized to `""` before `try` block |
| `ai_pr_description.md` missing when AI fails | `write_fallback_pr_description()` always creates the file, even on error |
| PR create step runs even after AI failure | `if: success()` guard on the "Create branch and raise PR" step |
| Wrong base branch (`main` vs `master`) | Hardcoded `--base dev` — no fragile fallback logic |
| `ai-generated` label dropped on fallback attempt | Single `gh pr create` call, label always included |

---

## Adding a New Model

1. Open `scripts/ai_models.py`
2. Add the model ID to the `MODELS` list in the desired priority position
3. Commit — both workflows pick it up automatically

```python
MODELS = [
    "google/gemini-2.0-flash-exp:free",
    "your-new/model-id:free",   # ← add here
    ...
]
```

---

## Customising the Fix Prompt

To change what the AI focuses on when generating a fix, edit `FIX_SYSTEM_PROMPT` in `scripts/ai_issue_solver.py`.

To change what the reviewer checks, edit `SYSTEM_PROMPT` in `scripts/ai_pr_reviewer.py`.

---

## Limits & Caveats

| Limit | Value | Notes |
|-------|-------|-------|
| Max repo context | 40,000 chars | Files read until limit hit; most relevant files are prioritised |
| Max file size | 8,000 chars | Larger files are truncated with a `[file truncated]` note |
| Max diff size | 60,000 chars | PR diffs over this are trimmed for the reviewer |
| LLM retries per model | 2 | With 5s/10s exponential backoff on rate limits |
| Models in pool | 9 | Tried in order until one succeeds |
| Commit message max length | 100 chars | `ISSUE_TITLE` is truncated to 100 printable characters |
