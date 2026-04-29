"""
ai_issue_solver.py
──────────────────
1. Reads the GitHub issue (title + body)
2. Scans the repo structure to give the LLM context
3. Reads project guidelines (AGENTS.md, README.md, etc.) for coding conventions
4. Reads relevant source files
5. Asks the LLM to generate a fix
6. Writes output files:
     - ai_file_changes.json   → picked up by apply_changes.py
     - ai_pr_description.md   → used as the PR body
"""

import os
import re
import sys
import json
import time
import requests
import pathlib

# Allow importing sibling scripts regardless of cwd
sys.path.insert(0, str(pathlib.Path(__file__).parent))
from ai_models import MODELS  # noqa: E402

# ── Config ────────────────────────────────────────────────────────────────────

API_KEY      = os.environ.get("OPENROUTER_API_KEY", "")
ISSUE_NUMBER = os.environ.get("ISSUE_NUMBER", "?")
ISSUE_TITLE  = os.environ.get("ISSUE_TITLE", "")
ISSUE_BODY   = os.environ.get("ISSUE_BODY", "")
REPO_NAME    = os.environ.get("REPO_NAME", "")
BASE_URL     = "https://openrouter.ai/api/v1/chat/completions"

# File extensions to include when scanning the repo
CODE_EXTENSIONS = {
    ".py", ".js", ".ts", ".jsx", ".tsx", ".java", ".go",
    ".rb", ".php", ".cs", ".cpp", ".c", ".h", ".rs",
    ".yml", ".yaml", ".json", ".md", ".html", ".css", ".scss",
    ".sh", ".toml", ".cfg", ".ini", ".example"
}

# Directories to always skip
SKIP_DIRS = {
    "node_modules", ".git", "__pycache__", ".venv", "venv",
    "dist", "build", ".next", ".nuxt", "coverage", ".pytest_cache",
    "vendor", "target", "bin", "obj"
}

# Project guideline files to inject into the AI prompt
GUIDELINE_FILES = [
    "AGENTS.md",
    "README.md",
    ".github/copilot-instructions.md",
]

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


def read_guidelines():
    """Read project guideline files (AGENTS.md, README.md, etc.) for AI context."""
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


def extract_json(text):
    """Extract a JSON object from an LLM response that may contain leading/trailing prose."""
    text = text.strip()
    # Strip markdown code fences
    text = re.sub(r'^```\w*\n?', '', text)
    text = re.sub(r'\n?```$', '', text)
    text = text.strip()
    # If the response starts with non-JSON prose, find the first { or [
    first_brace = text.find('{')
    first_bracket = text.find('[')
    candidates = [i for i in (first_brace, first_bracket) if i != -1]
    if candidates:
        start = min(candidates)
        if start > 0:
            text = text[start:]
    return text


def call_llm(messages, retries_per_model=2):
    """Call OpenRouter with multi-model fallback and retry on rate-limit."""
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type":  "application/json",
        "HTTP-Referer":  "https://github.com",
        "X-Title":       "GitHub AI Issue Solver"
    }

    last_error = None

    for model in MODELS:
        for attempt in range(retries_per_model):
            try:
                payload = {
                    "model":       model,
                    "messages":    messages,
                    "temperature": 0.1
                }
                print(f"   🔄 Trying {model} (attempt {attempt + 1})...")
                response = requests.post(BASE_URL, headers=headers, json=payload, timeout=120)

                if response.status_code == 429:
                    wait = 2 ** attempt * 5
                    print(f"   ⏳ Rate limited on {model}, waiting {wait}s...")
                    time.sleep(wait)
                    continue

                response.raise_for_status()
                result = response.json()["choices"][0]["message"]["content"]
                print(f"   ✅ Got response from {model}")
                return result, model

            except Exception as e:
                last_error = e
                print(f"   ⚠️  {model} failed: {e}")
                continue

        print(f"   ❌ All retries exhausted for {model}, trying next model...")

    raise Exception(f"All models failed. Last error: {last_error}")


def write_fallback_pr_description(reason):
    """Write a fallback PR description when the AI fix fails."""
    fallback = f"""## 🤖 AI-Generated Fix for Issue #{ISSUE_NUMBER}

**Issue:** {ISSUE_TITLE}

---

> ⚠️ The AI attempted to generate a fix but encountered an error: {reason}
> A human developer should review this issue manually.

> Closes #{ISSUE_NUMBER}
"""
    with open("ai_pr_description.md", "w") as f:
        f.write(fallback)
    print("📄 Wrote fallback ai_pr_description.md")


# ── Step 1: Identify relevant files ──────────────────────────────────────────

print("📂 Scanning repository...")
repo_tree   = get_repo_tree()
repo_files  = read_repo_files()

print(f"   Found {len(repo_files)} files ({sum(len(v) for v in repo_files.values())} chars)")

print("📖 Loading project guidelines...")
project_guidelines = read_guidelines()

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
    relevant_files_raw, _ = call_llm([
        {"role": "user", "content": RELEVANCE_PROMPT}
    ])
    relevant_files_raw = extract_json(relevant_files_raw)
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

FIX_SYSTEM_PROMPT = f"""You are a senior software engineer fixing a GitHub issue.
You will be given an issue description and relevant source files.

IMPORTANT — You MUST follow these project-specific guidelines strictly when generating code:
{project_guidelines}

Your job:
1. Understand exactly what is broken or missing
2. Generate the minimal, correct fix FOLLOWING THE PROJECT GUIDELINES ABOVE
3. Return your response as a JSON object with this exact structure:

{{
  "explanation": "Brief explanation of what was wrong and how you fixed it",
  "files": [
    {{
      "path": "relative/path/to/file.py",
      "action": "modify",
      "content": "FULL new content of the file after your fix"
    }}
  ],
  "confidence": "high | medium | low",
  "notes": "Any caveats, assumptions, or things a human reviewer should check"
}}

Rules:
- "action" must be "modify", "create", or "delete"
- For "modify" and "create", always include the FULL file content (not just the diff)
- For "delete", content can be empty string
- Keep changes minimal — only touch what is needed for the fix
- Do NOT wrap the JSON in markdown code fences
- If you cannot determine a fix with confidence, set "files" to [] and explain why
- TypeScript files MUST use tabs for indentation
- Use functional React patterns, no class components, no enums
- Use absolute imports (e.g., import X from 'components/X')
- Prefer ternary operators over && chains for conditional rendering
- Add tests in __tests__/ directory mirroring the source path when creating new logic
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
fix_raw = ""
used_model = MODELS[0]
try:
    fix_raw, used_model = call_llm([
        {"role": "system", "content": FIX_SYSTEM_PROMPT},
        {"role": "user",   "content": FIX_USER_PROMPT}
    ])

    fix_raw = extract_json(fix_raw)
    fix_data = json.loads(fix_raw)
    print(f"✅ Fix generated. Confidence: {fix_data.get('confidence', 'unknown')}")
    print(f"   Files to change: {[f['path'] for f in fix_data.get('files', [])]}")

except Exception as e:
    print(f"❌ Failed to parse LLM fix response: {e}")
    print(f"Raw response:\n{fix_raw[:500]}")
    write_fallback_pr_description(str(e))
    # Write an empty changes file so apply_changes.py / downstream steps don't explode
    with open("ai_file_changes.json", "w") as f:
        json.dump({"explanation": "Parse failed — no changes applied.", "files": [], "confidence": "low", "notes": str(e)}, f)
    sys.exit(0)

# ── Step 4: Write output files ────────────────────────────────────────────────

# File changes for apply_changes.py
with open("ai_file_changes.json", "w") as f:
    json.dump(fix_data, f, indent=2)
print("📝 Wrote ai_file_changes.json")

# PR description
files_list = "\n".join(
    f"- `{file['path']}` ({file['action']})"
    for file in fix_data.get('files', [])
)

pr_description = f"""## 🤖 AI-Generated Fix for Issue #{ISSUE_NUMBER}

**Issue:** {ISSUE_TITLE}

---

### What was wrong
{fix_data.get('explanation', 'See code changes.')}

### Files changed
{files_list}

### AI Confidence
**{fix_data.get('confidence', 'unknown').upper()}**

### Notes for reviewer
{fix_data.get('notes', 'No additional notes.')}

---

> ⚠️ **This PR was auto-generated by AI.** Please review carefully before merging.
> Closes #{ISSUE_NUMBER}

_Powered by [{used_model}](https://openrouter.ai) via OpenRouter_
"""

with open("ai_pr_description.md", "w") as f:
    f.write(pr_description)
print("📄 Wrote ai_pr_description.md")
print("🎉 Done!")
