"""
ai_pr_reviewer.py
─────────────────
1. Reads the PR diff (pr.diff written by the workflow)
2. Reads project guidelines (AGENTS.md, README.md, etc.) for convention checking
3. Sends it to the LLM for a thorough code review
4. Writes output files:
     - ai_review_summary.md      → overall review body posted to the PR
     - ai_review_verdict.txt     → APPROVE | REQUEST_CHANGES | COMMENT
     - ai_review_comments.json   → optional inline file comments
"""

import os
import re
import sys
import json
import time
import pathlib
import requests

# ── Config ────────────────────────────────────────────────────────────────────

API_KEY    = os.environ.get("OPENROUTER_API_KEY", "")
PR_NUMBER  = os.environ.get("PR_NUMBER", "?")
PR_TITLE   = os.environ.get("PR_TITLE", "")
PR_BODY    = os.environ.get("PR_BODY", "")
REPO_NAME  = os.environ.get("REPO_NAME", "")
BASE_URL   = "https://openrouter.ai/api/v1/chat/completions"

# Ordered list of free models — will try each in sequence on failure / rate-limit
MODELS = [
    "google/gemini-2.0-flash-exp:free",
    "nvidia/nemotron-3-super:free",
    "minimax/minimax-m2.5:free",
    "openai/gpt-oss-120b:free",
    "z-ai/glm-4.5-air:free",
    "tencent/hy3-preview:free",
]

MAX_DIFF_CHARS = 60_000   # trim very large diffs

# Project guideline files to inject into the review prompt
GUIDELINE_FILES = [
    "AGENTS.md",
    "README.md",
    ".github/copilot-instructions.md",
]

# ── Helpers ───────────────────────────────────────────────────────────────────

def read_guidelines():
    """Read project guideline files for AI context."""
    guidelines = ""
    for fname in GUIDELINE_FILES:
        path = pathlib.Path(fname)
        if path.exists():
            try:
                content = path.read_text(encoding="utf-8", errors="ignore")
                guidelines += f"\n\n### PROJECT GUIDELINE: {fname}\n{content}\n"
                print(f"   📖 Loaded guideline: {fname} ({len(content)} chars)")
            except Exception:
                continue
    return guidelines


def strip_markdown_fences(text):
    """Remove markdown code fences from LLM response."""
    text = text.strip()
    text = re.sub(r'^```\w*\n?', '', text)
    text = re.sub(r'\n?```$', '', text)
    return text.strip()


def call_llm(messages, retries_per_model=2):
    """Call OpenRouter with multi-model fallback and retry on rate-limit."""
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type":  "application/json",
        "HTTP-Referer":  "https://github.com",
        "X-Title":       "GitHub AI PR Reviewer"
    }

    last_error = None

    for model in MODELS:
        for attempt in range(retries_per_model):
            try:
                payload = {
                    "model":       model,
                    "messages":    messages,
                    "temperature": 0.2
                }
                print(f"   🔄 Trying {model} (attempt {attempt + 1})...")
                resp = requests.post(BASE_URL, headers=headers, json=payload, timeout=120)

                if resp.status_code == 429:
                    wait = 2 ** attempt * 5
                    print(f"   ⏳ Rate limited on {model}, waiting {wait}s...")
                    time.sleep(wait)
                    continue

                resp.raise_for_status()
                result = resp.json()["choices"][0]["message"]["content"]
                print(f"   ✅ Got response from {model}")
                return result, model

            except Exception as e:
                last_error = e
                print(f"   ⚠️  {model} failed: {e}")
                continue

        print(f"   ❌ All retries exhausted for {model}, trying next model...")

    raise Exception(f"All models failed. Last error: {last_error}")


# ── Read the diff ─────────────────────────────────────────────────────────────

try:
    with open("pr.diff", "r", encoding="utf-8", errors="ignore") as f:
        diff = f.read()
except FileNotFoundError:
    print("❌ pr.diff not found.")
    sys.exit(1)

if not diff.strip():
    print("⚠️  Diff is empty — nothing to review.")
    sys.exit(0)

if len(diff) > MAX_DIFF_CHARS:
    diff = diff[:MAX_DIFF_CHARS] + "\n\n... [diff truncated — too large]"
    print(f"⚠️  Diff truncated to {MAX_DIFF_CHARS} chars.")

print(f"📄 Diff loaded ({len(diff)} chars)")

# ── Load project guidelines ──────────────────────────────────────────────────

print("📖 Loading project guidelines...")
project_guidelines = read_guidelines()

# ── Call LLM ─────────────────────────────────────────────────────────────────

SYSTEM_PROMPT = f"""You are a senior software engineer doing a thorough code review.
You will be given a PR title, description, and a git diff.

IMPORTANT — Review the code against these project-specific guidelines:
{project_guidelines}

Your review must be fair, constructive, and specific. Focus on:
- Correctness: Will the code work as intended? Any bugs or edge cases?
- Security: Any injection risks, exposed secrets, unsafe operations?
- Performance: Any obvious inefficiencies?
- Code quality: Readability, naming, unnecessary complexity
- Project conventions: Does the code follow the project guidelines above?
  - TypeScript with tabs for indentation
  - Functional React, no class components, no enums
  - Absolute imports (import X from 'components/X')
  - Ternary operators over && chains
  - Custom component wrappers over raw Chakra primitives
  - Feature flags via useFeatureFlag hook
  - Tests in __tests__/ mirroring source structure
- Test coverage: Are there tests? Should there be?
- Breaking changes: Could this break existing behaviour?

Return a JSON object with this exact structure (no markdown fences):
{{
  "verdict": "APPROVE | REQUEST_CHANGES | COMMENT",
  "summary": "2-4 sentence overall assessment of the PR",
  "strengths": ["thing 1", "thing 2"],
  "issues": [
    {{
      "severity": "critical | major | minor | nit",
      "description": "What the issue is and why it matters",
      "suggestion": "Concrete fix or improvement"
    }}
  ],
  "inline_comments": [
    {{
      "path": "relative/file/path.py",
      "line": 42,
      "side": "RIGHT",
      "body": "Comment text (be specific and actionable)"
    }}
  ],
  "overall_notes": "Any final thoughts, caveats, or things the human reviewer should pay special attention to"
}}

Verdict rules:
- APPROVE: code looks good, any issues are nits only
- REQUEST_CHANGES: there are critical or major issues that must be addressed before merge
- COMMENT: issues worth discussing but not blocking — reviewer's call

inline_comments should only be included when you can pinpoint the exact file and line number from the diff.
If you cannot determine line numbers confidently, return an empty array for inline_comments.
Always set "side" to "RIGHT" for inline comments (the new code side of the diff).
"""

USER_PROMPT = f"""Review this AI-generated pull request:

**PR #{PR_NUMBER}: {PR_TITLE}**

PR Description:
{PR_BODY}

---

Git Diff:
```diff
{diff}
```

Perform a thorough review and return the JSON response.
"""

print("🤖 Asking AI to review the PR...")
raw = ""
used_model = MODELS[0]
try:
    raw, used_model = call_llm([
        {"role": "system", "content": SYSTEM_PROMPT},
        {"role": "user",   "content": USER_PROMPT}
    ])

    raw = strip_markdown_fences(raw)
    review = json.loads(raw)
    print(f"✅ Review generated. Verdict: {review.get('verdict', 'COMMENT')}")

except Exception as e:
    print(f"❌ Failed to parse LLM review response: {e}")
    print(f"Raw:\n{raw[:500]}")
    sys.exit(1)

# ── Build the markdown summary ────────────────────────────────────────────────

verdict      = review.get("verdict", "COMMENT")
summary      = review.get("summary", "")
strengths    = review.get("strengths", [])
issues       = review.get("issues", [])
overall      = review.get("overall_notes", "")

verdict_emoji = {
    "APPROVE":          "✅",
    "REQUEST_CHANGES":  "❌",
    "COMMENT":          "💬",
}.get(verdict, "💬")

severity_emoji = {
    "critical": "🔴",
    "major":    "🟠",
    "minor":    "🟡",
    "nit":      "⚪",
}

strengths_md = "\n".join(f"- {s}" for s in strengths) if strengths else "_None identified._"

if issues:
    issues_md = ""
    for issue in issues:
        sev   = issue.get("severity", "minor")
        emoji = severity_emoji.get(sev, "⚪")
        issues_md += f"\n#### {emoji} {sev.upper()}: {issue.get('description', '')}\n"
        if issue.get("suggestion"):
            issues_md += f"> **Suggestion:** {issue['suggestion']}\n"
else:
    issues_md = "_No issues found._"

summary_md = f"""## {verdict_emoji} AI Code Review — {verdict}

> ⚠️ This is an automated review. A human reviewer must approve before merging.

### Summary
{summary}

### Strengths
{strengths_md}

### Issues
{issues_md}

### Reviewer Notes
{overall}

---
_Reviewed by [{used_model}](https://openrouter.ai) via OpenRouter_
"""

# ── Write output files ────────────────────────────────────────────────────────

with open("ai_review_summary.md", "w") as f:
    f.write(summary_md)
print("📝 Wrote ai_review_summary.md")

with open("ai_review_verdict.txt", "w") as f:
    f.write(verdict)
print(f"📝 Wrote ai_review_verdict.txt ({verdict})")

# Inline comments — only include if path, line, and body are present
inline = review.get("inline_comments", [])
valid_inline = [
    {
        "path": c["path"],
        "line": c["line"],
        "side": c.get("side", "RIGHT"),
        "body": c["body"]
    }
    for c in inline
    if c.get("path") and c.get("line") and c.get("body")
]

with open("ai_review_comments.json", "w") as f:
    json.dump(valid_inline, f, indent=2)
print(f"📝 Wrote ai_review_comments.json ({len(valid_inline)} inline comments)")

print("🎉 Done!")
