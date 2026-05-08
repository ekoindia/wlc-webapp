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
MAX_CHANGED_FILES = 3

# ── Read issue title / body ───────────────────────────────────────────────────

ISSUE_TITLE = os.environ.get("ISSUE_TITLE", "")
ISSUE_BODY = os.environ.get("ISSUE_BODY", "")

if pathlib.Path("issue_title.txt").exists():
    ISSUE_TITLE = pathlib.Path("issue_title.txt").read_text(
        encoding="utf-8"
    ).strip()

if pathlib.Path("issue_body.txt").exists():
    ISSUE_BODY = pathlib.Path("issue_body.txt").read_text(
        encoding="utf-8"
    )

# ── Helpers ───────────────────────────────────────────────────────────────────


def extract_json(text):
    text = text.strip()

    text = re.sub(r"^```[^\n]*\n", "", text)
    text = re.sub(r"\n```\s*$", "", text)
    text = re.sub(r"^```", "", text)
    text = re.sub(r"```$", "", text)

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
        r"([A-Za-z0-9_\-\/]+(?:\.jsx|\.tsx|\.js|\.ts))",
        issue_body
    )

    cleaned = []

    for path in file_matches:
        if any(blocked in path for blocked in BLOCKED_PATHS):
            continue

        if any(
            key in path.lower()
            for key in [
                "src",
                "components",
                "pages",
                "page-components"
            ]
        ):
            cleaned.append(path)

    details["files"] = list(set(cleaned))

    return details


# ── Read repository files ─────────────────────────────────────────────────────


def read_repo_files():
    files = {}

    for path in pathlib.Path(".").rglob("*"):
        parts = path.parts

        if any(p in SKIP_DIRS for p in parts):
            continue

        if ".github/workflows" in str(path):
            continue

        if not path.is_file():
            continue

        if path.suffix not in CODE_EXTENSIONS:
            continue

        try:
            content = path.read_text(
                encoding="utf-8",
                errors="ignore"
            )

            if len(content) > MAX_FILE_SIZE:
                content = content[:MAX_FILE_SIZE]

            files[str(path)] = content

        except Exception:
            continue

    return files


# ── Load build logs ───────────────────────────────────────────────────────────

BUILD_LOG = ""

if pathlib.Path("build_output.txt").exists():
    BUILD_LOG = pathlib.Path("build_output.txt").read_text(
        encoding="utf-8",
        errors="ignore"
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

# Highest priority → culprit file
if issue_details["culprit"]:
    culprit_base = os.path.basename(issue_details["culprit"])

    for repo_path in repo_files.keys():
        if repo_path.endswith(culprit_base):
            relevant_files.append(repo_path)

# Exact matches
for path in issue_details["files"]:
    if path in repo_files:
        relevant_files.append(path)

# Basename matching
if not relevant_files:
    for issue_path in issue_details["files"]:
        base = os.path.basename(issue_path)

        for repo_path in repo_files.keys():
            if repo_path.endswith(base):
                relevant_files.append(repo_path)

# Fallback
if not relevant_files:
    preferred_dirs = [
        "src",
        "app",
        "components",
        "pages",
        "page-components"
    ]

    for repo_path in repo_files.keys():
        if any(repo_path.startswith(d) for d in preferred_dirs):
            relevant_files.append(repo_path)

relevant_files = list(set(relevant_files))[:3]

print("🎯 Relevant files:")

for f in relevant_files:
    print(" -", f)

# ── Build file context ────────────────────────────────────────────────────────

file_context = ""

for filepath in relevant_files:
    content = repo_files.get(filepath)

    if not content:
        continue

    file_context += f"""

### FILE: {filepath}

```tsx
{content}