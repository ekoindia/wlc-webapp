"""
ai_issue_solver.py
──────────────────
AI GitHub issue solver with:
- Sentry issue parsing
- Stack trace extraction
- Runtime/build error targeting
- Safe file restrictions
- Better relevant file detection
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

API_KEY = os.environ.get("OPENROUTER_API_KEY", "")
ISSUE_NUMBER = os.environ.get("ISSUE_NUMBER", "?")
REPO_NAME = os.environ.get("REPO_NAME", "")
BASE_URL = "https://openrouter.ai/api/v1/chat/completions"

CODE_EXTENSIONS = {
    ".py", ".js", ".ts", ".jsx", ".tsx", ".java", ".go",
    ".rb", ".php", ".cs", ".cpp", ".c", ".h", ".rs",
    ".yml", ".yaml", ".json", ".md", ".html", ".css",
    ".scss", ".sh"
}

SKIP_DIRS = {
    "node_modules",
    ".git",
    "__pycache__",
    ".next",
    "dist",
    "build",
    "coverage",
    ".venv",
    "venv"
}

BLOCKED_PATHS = [
    ".github/workflows",
    ".git",
    "package-lock.json",
    "yarn.lock",
    "pnpm-lock.yaml"
]

MAX_FILE_SIZE = 12000

# ── Read issue title / body from files (written by workflow fetch step) ───────

ISSUE_TITLE = os.environ.get("ISSUE_TITLE", "")
ISSUE_BODY = os.environ.get("ISSUE_BODY", "")

if pathlib.Path("issue_title.txt").exists():
    ISSUE_TITLE = pathlib.Path("issue_title.txt").read_text(encoding="utf-8").strip()

if pathlib.Path("issue_body.txt").exists():
    ISSUE_BODY = pathlib.Path("issue_body.txt").read_text(encoding="utf-8")

# ── Helpers ───────────────────────────────────────────────────────────────────


def extract_json(text):
    text = text.strip()
    # Strip any leading/trailing markdown code fences (```json ... ``` or ``` ... ```)
    text = re.sub(r"^```[^\n]*\n", "", text)
    text = re.sub(r"\n```\s*$", "", text)
    text = re.sub(r"^```", "", text)
    text = re.sub(r"```$", "", text)
    # Find the first { to skip any preamble text
    first = text.find("{")
    if first != -1:
        text = text[first:]
    return text.strip()


def call_llm(messages, retries=2):
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json",
        "HTTP-Referer": "https://github.com",
        "X-Title": "GitHub AI Issue Solver"
    }

    last_error = None

    for model in MODELS:
        for attempt in range(retries):
            try:
                print(f"🔄 Trying model: {model}")

                payload = {
                    "model": model,
                    "messages": messages,
                    "temperature": 0.1
                }

                response = requests.post(
                    BASE_URL,
                    headers=headers,
                    json=payload,
                    timeout=180
                )

                if response.status_code == 429:
                    wait = 5 * (attempt + 1)
                    print(f"⏳ Rate limited. Waiting {wait}s")
                    time.sleep(wait)
                    continue

                response.raise_for_status()

                result = response.json()
                return result["choices"][0]["message"]["content"], model

            except Exception as e:
                last_error = e
                print(f"⚠️ {model} failed: {e}")

    raise Exception(f"All models failed: {last_error}")


# ── Parse Sentry Issue ────────────────────────────────────────────────────────


def extract_issue_details(issue_body):
    details = {
        "error": "",
        "stack_trace": "",
        "files": [],
        "culprit": ""
    }

    error_match = re.search(
        r"(TypeError|ReferenceError|SyntaxError|Error):(.+)",
        issue_body,
        re.MULTILINE
    )
    if error_match:
        details["error"] = error_match.group(0)

    culprit_match = re.search(
        r"Culprit.*?\n.*?([\w\/\-.]+\.(jsx?|tsx?))",
        issue_body,
        re.IGNORECASE | re.DOTALL
    )
    if culprit_match:
        details["culprit"] = culprit_match.group(1)

    stack_match = re.search(
        r"Stack Trace(.*)",
        issue_body,
        re.DOTALL | re.IGNORECASE
    )
    if stack_match:
        details["stack_trace"] = stack_match.group(1)

    file_matches = re.findall(
        r"([\w\-\/\.]+\.(jsx?|tsx?|js|ts))",
        issue_body
    )

    cleaned = []
    for match in file_matches:
        path = match[0]
        if any(blocked in path for blocked in BLOCKED_PATHS):
            continue
        cleaned.append(path)

    details["files"] = list(set(cleaned))
    return details


# ── Read repo files ───────────────────────────────────────────────────────────


def read_repo_files():
    files = {}

    for path in pathlib.Path(".").rglob("*"):
        parts = path.parts

        if any(p in SKIP_DIRS for p in parts):
            continue
        if not path.is_file():
            continue
        if path.suffix not in CODE_EXTENSIONS:
            continue

        try:
            content = path.read_text(encoding="utf-8", errors="ignore")
            if len(content) > MAX_FILE_SIZE:
                content = content[:MAX_FILE_SIZE]
            files[str(path)] = content
        except Exception:
            continue

    return files


# ── Load build logs if present ────────────────────────────────────────────────

BUILD_LOG = ""
if pathlib.Path("build_output.txt").exists():
    BUILD_LOG = pathlib.Path("build_output.txt").read_text(
        encoding="utf-8", errors="ignore"
    )[:15000]

# ── Parse issue ───────────────────────────────────────────────────────────────

print("📥 Parsing issue details...")
issue_details = extract_issue_details(ISSUE_BODY)
print(json.dumps(issue_details, indent=2))

# ── Read repo ─────────────────────────────────────────────────────────────────

print("📂 Reading repository files...")
repo_files = read_repo_files()
print(f"Loaded {len(repo_files)} files")

# ── Determine relevant files ──────────────────────────────────────────────────

relevant_files = []

# Highest priority → exact path matches from stack trace
for path in issue_details["files"]:
    if path in repo_files:
        relevant_files.append(path)

# Try basename matching
if not relevant_files:
    for issue_path in issue_details["files"]:
        base = os.path.basename(issue_path)
        for repo_path in repo_files.keys():
            if repo_path.endswith(base):
                relevant_files.append(repo_path)

# Fallback
if not relevant_files:
    relevant_files = list(repo_files.keys())[:5]

relevant_files = list(set(relevant_files))[:10]

print("🎯 Relevant files:")
for f in relevant_files:
    print(" -", f)

# ── Build file context ────────────────────────────────────────────────────────

file_context = ""
for filepath in relevant_files:
    content = repo_files.get(filepath)
    if not content:
        continue
    file_context += f"\n\n### FILE: {filepath}\n\n```tsx\n{content}\n```\n"

# ── Build prompt ──────────────────────────────────────────────────────────────

print("🤖 Building prompt...")

system_prompt = """You are an expert software engineer specializing in JavaScript/TypeScript/React applications.
Analyze the GitHub issue and generate a precise, minimal code fix.

RULES:
1. Fix only the specific files that contain the bug — no unrelated changes
2. Return ONLY valid JSON — no markdown outside the JSON, no extra text
3. Never modify: package.json, package-lock.json, .github/workflows, or lock files
4. Preserve existing code style and formatting
5. Keep changes minimal and targeted to the reported error

OUTPUT FORMAT (strict JSON, nothing else):
{
  "summary": "one-line description of the fix",
  "root_cause": "what caused the bug",
  "files": [
    {
      "path": "relative/path/to/file.tsx",
      "action": "modify",
      "content": "COMPLETE file content with the fix applied"
    }
  ]
}"""

user_prompt = f"""## GitHub Issue #{ISSUE_NUMBER}: {ISSUE_TITLE}

### Issue Details
{ISSUE_BODY}

### Parsed Error
- **Error**: {issue_details['error']}
- **Culprit**: {issue_details['culprit']}
- **Stack Trace**:
{issue_details['stack_trace'][:2000]}

### Relevant Source Files
{file_context}

### Build Log (if any)
{BUILD_LOG[:3000] if BUILD_LOG else "No build errors detected."}

---

Analyze the error carefully. Return ONLY a valid JSON object with the minimal fix."""

messages = [
    {"role": "system", "content": system_prompt},
    {"role": "user", "content": user_prompt}
]

# ── Call LLM ──────────────────────────────────────────────────────────────────

print("🤖 Calling AI model...")

try:
    response_text, used_model = call_llm(messages)
    print(f"✅ Got response from: {used_model}")
except Exception as e:
    print(f"❌ All models failed: {e}")
    sys.exit(1)

# ── Parse response ────────────────────────────────────────────────────────────

print("🔍 Parsing AI response...")

raw = extract_json(response_text)

try:
    # strict=False allows literal control characters (newlines/tabs) inside strings
    fix_data = json.JSONDecoder(strict=False).decode(raw)
except json.JSONDecodeError as e:
    print(f"❌ JSON parse error: {e}")
    print("Raw response (first 2000 chars):")
    print(response_text[:2000])
    sys.exit(1)

# ── Filter blocked paths ──────────────────────────────────────────────────────

files = fix_data.get("files", [])
safe_files = []

for f in files:
    path = f.get("path", "")
    if any(blocked in path for blocked in BLOCKED_PATHS):
        print(f"⛔ Blocked path skipped: {path}")
        continue
    safe_files.append(f)

fix_data["files"] = safe_files

# ── Write ai_file_changes.json ────────────────────────────────────────────────

with open("ai_file_changes.json", "w") as out:
    json.dump(fix_data, out, indent=2)

print(f"✅ Written ai_file_changes.json ({len(safe_files)} file(s))")

# ── Write ai_pr_description.md ────────────────────────────────────────────────

summary = fix_data.get("summary", "AI-generated fix")
root_cause = fix_data.get("root_cause", "See issue for details")
changed_paths = [f["path"] for f in safe_files]
changed_list = "\n".join(f"- `{p}`" for p in changed_paths) if changed_paths else "No files changed"

pr_description = f"""## 🤖 AI Fix for Issue #{ISSUE_NUMBER}

**Issue**: {ISSUE_TITLE}

### Root Cause
{root_cause}

### Fix Summary
{summary}

### Files Changed
{changed_list}

### References
- Closes #{ISSUE_NUMBER}
- AI Model: `{used_model}`

> ⚠️ This PR was auto-generated by AI. Please review carefully before merging.
"""

with open("ai_pr_description.md", "w") as out:
    out.write(pr_description)

print("✅ Written ai_pr_description.md")
print(f"🎉 Done! Fix generated for {len(safe_files)} file(s).")
