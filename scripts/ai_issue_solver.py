"""
ai_issue_solver.py
──────────────────
1. Reads the GitHub issue (title + body)
2. Scans the repo structure to give the LLM context
3. Reads relevant source files
4. Asks the LLM to generate a fix
5. Writes output files:
     - ai_file_changes.json   → picked up by apply_changes.py
     - ai_pr_description.md   → used as the PR body
"""

import os
import sys
import json
import requests
import pathlib

# ── Config ────────────────────────────────────────────────────────────────────

API_KEY      = os.environ.get("OPENROUTER_API_KEY", "")
ISSUE_NUMBER = os.environ.get("ISSUE_NUMBER", "?")
ISSUE_TITLE  = os.environ.get("ISSUE_TITLE", "")
ISSUE_BODY   = os.environ.get("ISSUE_BODY", "")
REPO_NAME    = os.environ.get("REPO_NAME", "")
BASE_URL     = "https://openrouter.ai/api/v1/chat/completions"

# Best free model for code generation tasks
# Switch to "deepseek/deepseek-chat:free" if this hits rate limits
MODEL = "google/gemini-2.0-flash-exp:free"

# File extensions to include when scanning the repo
CODE_EXTENSIONS = {
    ".py", ".js", ".ts", ".jsx", ".tsx", ".java", ".go",
    ".rb", ".php", ".cs", ".cpp", ".c", ".h", ".rs",
    ".yml", ".yaml", ".json", ".md", ".html", ".css", ".scss",
    ".sh", ".env.example", ".toml", ".cfg", ".ini"
}

# Directories to always skip
SKIP_DIRS = {
    "node_modules", ".git", "__pycache__", ".venv", "venv",
    "dist", "build", ".next", ".nuxt", "coverage", ".pytest_cache",
    "vendor", "target", "bin", "obj"
}

MAX_FILE_SIZE   = 8_000    # chars per file — trim if larger
MAX_TOTAL_CHARS = 40_000   # total repo context sent to LLM

# ── Helpers ───────────────────────────────────────────────────────────────────

def get_repo_tree(root="."):
    """Return a simple directory tree as a string."""
    tree_lines = []
    for path in sorted(pathlib.Path(root).rglob("*")):
        # Skip hidden files/dirs and blacklisted dirs
        parts = path.parts
        if any(p.startswith(".") or p in SKIP_DIRS for p in parts):
            continue
        if path.is_file() and path.suffix in CODE_EXTENSIONS:
            tree_lines.append(str(path))
    return "\n".join(tree_lines)


def read_repo_files(root="."):
    """Read source files and return as a dict {filepath: content}."""
    files = {}
    total_chars = 0

    for path in sorted(pathlib.Path(root).rglob("*")):
        parts = path.parts
        if any(p.startswith(".") or p in SKIP_DIRS for p in parts):
            continue
        if not path.is_file():
            continue
        if path.suffix not in CODE_EXTENSIONS:
            continue

        try:
            content = path.read_text(encoding="utf-8", errors="ignore")
        except Exception:
            continue

        if len(content) > MAX_FILE_SIZE:
            content = content[:MAX_FILE_SIZE] + "\n... [file truncated]"

        files[str(path)] = content
        total_chars += len(content)

        if total_chars >= MAX_TOTAL_CHARS:
            print(f"⚠️  Repo context limit reached at {total_chars} chars. Some files skipped.")
            break

    return files


def call_llm(messages):
    """Call OpenRouter and return the response text."""
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type":  "application/json",
        "HTTP-Referer":  "https://github.com",
        "X-Title":       "GitHub AI Issue Solver"
    }
    payload = {
        "model":       MODEL,
        "messages":    messages,
        "temperature": 0.1   # low temp = more deterministic code output
    }
    response = requests.post(BASE_URL, headers=headers, json=payload, timeout=120)
    response.raise_for_status()
    return response.json()["choices"][0]["message"]["content"]


# ── Step 1: Identify relevant files ──────────────────────────────────────────

print("📂 Scanning repository...")
repo_tree   = get_repo_tree()
repo_files  = read_repo_files()

print(f"   Found {len(repo_files)} files ({sum(len(v) for v in repo_files.values())} chars)")

# Ask the LLM which files are most relevant to this issue
RELEVANCE_PROMPT = f"""You are a software engineer. 
Given this GitHub issue and a list of files in a repository,
identify the TOP 5 most relevant files that likely need to be changed to fix the issue.

Issue Title: {ISSUE_TITLE}
Issue Description:
{ISSUE_BODY}

Repository file tree:
{repo_tree}

Reply ONLY with a JSON array of file paths (no explanation), like:
["src/utils.py", "src/models/user.py"]
If you cannot determine relevant files, return an empty array: []
"""

print("🔍 Identifying relevant files...")
try:
    relevant_files_raw = call_llm([
        {"role": "user", "content": RELEVANCE_PROMPT}
    ])
    # Strip markdown fences if present
    relevant_files_raw = relevant_files_raw.strip().strip("```json").strip("```").strip()
    relevant_files = json.loads(relevant_files_raw)
    print(f"   Relevant files identified: {relevant_files}")
except Exception as e:
    print(f"⚠️  Could not parse relevant files: {e}. Using all files.")
    relevant_files = list(repo_files.keys())[:10]

# ── Step 2: Build context from relevant files ─────────────────────────────────

file_context = ""
for filepath in relevant_files:
    content = repo_files.get(filepath) or repo_files.get("./" + filepath, "")
    if content:
        file_context += f"\n\n### FILE: {filepath}\n```\n{content}\n```"

if not file_context:
    # Fallback: send all files we have
    for fp, content in list(repo_files.items())[:8]:
        file_context += f"\n\n### FILE: {fp}\n```\n{content}\n```"

# ── Step 3: Generate the fix ──────────────────────────────────────────────────

FIX_SYSTEM_PROMPT = """You are a senior software engineer fixing a GitHub issue.
You will be given an issue description and relevant source files.

Your job:
1. Understand exactly what is broken or missing
2. Generate the minimal, correct fix
3. Return your response as a JSON object with this exact structure:

{
  "explanation": "Brief explanation of what was wrong and how you fixed it",
  "files": [
    {
      "path": "relative/path/to/file.py",
      "action": "modify",
      "content": "FULL new content of the file after your fix"
    }
  ],
  "confidence": "high | medium | low",
  "notes": "Any caveats, assumptions, or things a human reviewer should check"
}

Rules:
- "action" must be "modify", "create", or "delete"
- For "modify" and "create", always include the FULL file content (not just the diff)
- For "delete", content can be empty string
- Keep changes minimal — only touch what is needed for the fix
- Do NOT wrap the JSON in markdown code fences
- If you cannot determine a fix with confidence, set "files" to [] and explain why
"""

FIX_USER_PROMPT = f"""Fix this GitHub issue:

**Issue #{ISSUE_NUMBER}: {ISSUE_TITLE}**

{ISSUE_BODY}

---

Here are the relevant source files:
{file_context}

Generate the fix now.
"""

print("🤖 Generating fix...")
try:
    fix_raw = call_llm([
        {"role": "system", "content": FIX_SYSTEM_PROMPT},
        {"role": "user",   "content": FIX_USER_PROMPT}
    ])

    # Clean up if LLM wrapped in markdown fences anyway
    fix_raw = fix_raw.strip()
    if fix_raw.startswith("```"):
        fix_raw = fix_raw.split("\n", 1)[1]
    if fix_raw.endswith("```"):
        fix_raw = fix_raw.rsplit("```", 1)[0]

    fix_data = json.loads(fix_raw.strip())
    print(f"✅ Fix generated. Confidence: {fix_data.get('confidence', 'unknown')}")
    print(f"   Files to change: {[f['path'] for f in fix_data.get('files', [])]}")

except Exception as e:
    print(f"❌ Failed to parse LLM fix response: {e}")
    print(f"Raw response:\n{fix_raw[:500]}")
    sys.exit(1)

# ── Step 4: Write output files ────────────────────────────────────────────────

# File changes for apply_changes.py
with open("ai_file_changes.json", "w") as f:
    json.dump(fix_data, f, indent=2)
print("📝 Wrote ai_file_changes.json")

# PR description
pr_description = f"""## 🤖 AI-Generated Fix for Issue #{ISSUE_NUMBER}

**Issue:** {ISSUE_TITLE}

---

### What was wrong
{fix_data.get('explanation', 'See code changes.')}

### Files changed
{chr(10).join(f"- `{file['path']}` ({file['action']})" for file in fix_data.get('files', []))}

### AI Confidence
**{fix_data.get('confidence', 'unknown').upper()}**

### Notes for reviewer
{fix_data.get('notes', 'No additional notes.')}

---

> ⚠️ **This PR was auto-generated by AI.** Please review carefully before merging.
> Closes #{ISSUE_NUMBER}

_Powered by [{MODEL}](https://openrouter.ai) via OpenRouter_
"""

with open("ai_pr_description.md", "w") as f:
    f.write(pr_description)
print("📄 Wrote ai_pr_description.md")
print("🎉 Done!")
