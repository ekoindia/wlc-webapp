"""
ai_pr_reviewer.py
─────────────────
1. Reads the PR diff (pr.diff written by the workflow)
2. Sends it to the LLM for a thorough code review
3. Writes output files:
     - ai_review_summary.md      → overall review body posted to the PR
     - ai_review_verdict.txt     → APPROVE | REQUEST_CHANGES | COMMENT
     - ai_review_comments.json   → optional inline file comments
"""

import os
import sys
import json
import re
import requests

# ── Config ────────────────────────────────────────────────────────────────────

API_KEY    = os.environ.get("OPENROUTER_API_KEY", "")
PR_NUMBER  = os.environ.get("PR_NUMBER", "?")
PR_TITLE   = os.environ.get("PR_TITLE", "")
PR_BODY    = os.environ.get("PR_BODY", "")
REPO_NAME  = os.environ.get("REPO_NAME", "")
BASE_URL   = "https://openrouter.ai/api/v1/chat/completions"
MODEL      = "google/gemini-2.0-flash-exp:free"

MAX_DIFF_CHARS = 60_000   # trim very large diffs

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

# ── Call LLM ─────────────────────────────────────────────────────────────────

def call_llm(messages):
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type":  "application/json",
        "HTTP-Referer":  "https://github.com",
        "X-Title":       "GitHub AI PR Reviewer"
    }
    payload = {
        "model":       MODEL,
        "messages":    messages,
        "temperature": 0.2
    }
    resp = requests.post(BASE_URL, headers=headers, json=payload, timeout=120)
    resp.raise_for_status()
    return resp.json()["choices"][0]["message"]["content"]


SYSTEM_PROMPT = """You are a senior software engineer doing a thorough code review.
You will be given a PR title, description, and a git diff.

Your review must be fair, constructive, and specific. Focus on:
- Correctness: Will the code work as intended? Any bugs or edge cases?
- Security: Any injection risks, exposed secrets, unsafe operations?
- Performance: Any obvious inefficiencies?
- Code quality: Readability, naming, unnecessary complexity
- Test coverage: Are there tests? Should there be?
- Breaking changes: Could this break existing behaviour?

Return a JSON object with this exact structure (no markdown fences):
{
  "verdict": "APPROVE | REQUEST_CHANGES | COMMENT",
  "summary": "2-4 sentence overall assessment of the PR",
  "strengths": ["thing 1", "thing 2"],
  "issues": [
    {
      "severity": "critical | major | minor | nit",
      "description": "What the issue is and why it matters",
      "suggestion": "Concrete fix or improvement"
    }
  ],
  "inline_comments": [
    {
      "path": "relative/file/path.py",
      "line": 42,
      "body": "Comment text (be specific and actionable)"
    }
  ],
  "overall_notes": "Any final thoughts, caveats, or things the human reviewer should pay special attention to"
}

Verdict rules:
- APPROVE: code looks good, any issues are nits only
- REQUEST_CHANGES: there are critical or major issues that must be addressed before merge
- COMMENT: issues worth discussing but not blocking — reviewer's call

inline_comments should only be included when you can pinpoint the exact file and line number from the diff.
If you cannot determine line numbers confidently, return an empty array for inline_comments.
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
try:
    raw = call_llm([
        {"role": "system", "content": SYSTEM_PROMPT},
        {"role": "user",   "content": USER_PROMPT}
    ])

    # Strip markdown fences if the LLM added them anyway
    raw = raw.strip()
    if raw.startswith("```"):
        raw = raw.split("\n", 1)[1]
    if raw.endswith("```"):
        raw = raw.rsplit("```", 1)[0]

    review = json.loads(raw.strip())
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
_Reviewed by [{MODEL}](https://openrouter.ai) via OpenRouter_
"""

# ── Write output files ────────────────────────────────────────────────────────

with open("ai_review_summary.md", "w") as f:
    f.write(summary_md)
print("📝 Wrote ai_review_summary.md")

with open("ai_review_verdict.txt", "w") as f:
    f.write(verdict)
print(f"📝 Wrote ai_review_verdict.txt ({verdict})")

# Inline comments — only include if path and line are present
inline = review.get("inline_comments", [])
valid_inline = [
    {"path": c["path"], "line": c["line"], "body": c["body"]}
    for c in inline
    if c.get("path") and c.get("line") and c.get("body")
]

with open("ai_review_comments.json", "w") as f:
    json.dump(valid_inline, f, indent=2)
print(f"📝 Wrote ai_review_comments.json ({len(valid_inline)} inline comments)")

print("🎉 Done!")
