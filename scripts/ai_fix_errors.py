"""
ai_fix_errors.py
────────────────
Called when the initial AI fix causes build or lint errors.

1. Reads build_output.txt (the failed build log)
2. Reads the current state of changed files
3. Asks the LLM to produce a corrected fix
4. Overwrites ai_file_changes.json so apply_changes.py can apply it
"""

import os
import re
import sys
import json
import time
import pathlib
import anthropic

# Allow importing sibling scripts regardless of cwd
sys.path.insert(0, str(pathlib.Path(__file__).parent))
from ai_models import MODELS  # noqa: E402

# ── Config ────────────────────────────────────────────────────────────────────

API_KEY      = os.environ.get("ANTHROPIC_API_KEY", "")
ISSUE_NUMBER = os.environ.get("ISSUE_NUMBER", "?")
ISSUE_TITLE  = os.environ.get("ISSUE_TITLE", "")
ISSUE_BODY   = os.environ.get("ISSUE_BODY", "")

_client = anthropic.Anthropic(api_key=API_KEY)

MAX_BUILD_LOG_CHARS  = 8_000
MAX_FILE_CHARS       = 6_000

# ── Helpers ───────────────────────────────────────────────────────────────────

def strip_markdown_fences(text):
    text = text.strip()
    text = re.sub(r'^```\w*\n?', '', text)
    text = re.sub(r'\n?```$', '', text)
    return text.strip()


def call_llm(messages, retries_per_model=2):
    system_prompt = next(
        (m["content"] for m in messages if m["role"] == "system"), ""
    )
    user_messages = [m for m in messages if m["role"] != "system"]

    last_error = None
    for model in MODELS:
        for attempt in range(retries_per_model):
            try:
                print(f"   🔄 Trying {model} (attempt {attempt + 1})...")
                kwargs = {
                    "model": model,
                    "max_tokens": 4096,
                    "temperature": 0.1,
                    "messages": user_messages,
                }
                if system_prompt:
                    kwargs["system"] = system_prompt
                response = _client.messages.create(**kwargs)
                result = response.content[0].text
                print(f"   ✅ Got response from {model}")
                return result, model
            except anthropic.RateLimitError:
                wait = 2 ** attempt * 5
                print(f"   ⏳ Rate limited, waiting {wait}s...")
                time.sleep(wait)
            except Exception as e:
                last_error = e
                print(f"   ⚠️  {model} failed: {e}")
                break
        print(f"   ❌ All retries exhausted for {model}, trying next...")
    raise Exception(f"All models failed. Last error: {last_error}")


# ── Read the build error log ──────────────────────────────────────────────────

try:
    build_log = pathlib.Path("build_output.txt").read_text(encoding="utf-8", errors="ignore")
except FileNotFoundError:
    print("❌ build_output.txt not found.")
    sys.exit(1)

if len(build_log) > MAX_BUILD_LOG_CHARS:
    # Keep the end of the log — errors are usually at the bottom
    build_log = "... [truncated] ...\n" + build_log[-MAX_BUILD_LOG_CHARS:]

print(f"📋 Build log loaded ({len(build_log)} chars)")

# ── Read the files that were changed by the previous AI fix ──────────────────

try:
    with open("ai_file_changes.json") as f:
        previous_fix = json.load(f)
except FileNotFoundError:
    print("❌ ai_file_changes.json not found.")
    sys.exit(1)

changed_files_context = ""
for item in previous_fix.get("files", []):
    path    = item.get("path", "")
    content = item.get("content", "")
    action  = item.get("action", "modify")
    if action == "delete":
        continue
    # Read the current on-disk version (may have been modified by lint-fix)
    disk_path = pathlib.Path(path)
    if disk_path.exists():
        try:
            content = disk_path.read_text(encoding="utf-8", errors="ignore")
        except Exception:
            pass
    if len(content) > MAX_FILE_CHARS:
        content = content[:MAX_FILE_CHARS] + "\n... [truncated]"
    changed_files_context += f"\n\n### FILE: {path}\n```\n{content}\n```"

if not changed_files_context:
    print("⚠️  No changed files to fix. Exiting.")
    sys.exit(0)

# ── Ask the LLM to fix the errors ────────────────────────────────────────────

SYSTEM_PROMPT = """You are a senior software engineer fixing build and lint errors in a Next.js / TypeScript project.

You will be given:
1. The original issue the AI was solving
2. The files the AI changed
3. The build error output

Your job: fix ONLY the errors in the build log. Do not re-solve the original issue.
Make the minimal changes needed to make the code compile and pass lint.

Return a JSON object (no markdown fences):
{
  "explanation": "What errors you fixed and how",
  "files": [
    {
      "path": "relative/path/to/file.tsx",
      "action": "modify",
      "content": "FULL corrected file content"
    }
  ],
  "confidence": "high | medium | low",
  "notes": "Any remaining concerns"
}

Rules:
- Include FULL file content for every file you modify (not just the changed lines)
- TypeScript files must use tabs for indentation
- Use functional React patterns, no class components, no enums
- Use absolute imports (e.g., import X from 'components/X')
"""

USER_PROMPT = f"""Fix the build errors in these files.

Original issue being solved: {ISSUE_TITLE}
{ISSUE_BODY}

---

Files that were changed:
{changed_files_context}

---

Build error output:
```
{build_log}
```

Fix ONLY the build errors. Return the corrected JSON.
"""

print("🤖 Asking AI to fix build errors...")
raw = ""
try:
    raw, used_model = call_llm([
        {"role": "system", "content": SYSTEM_PROMPT},
        {"role": "user",   "content": USER_PROMPT}
    ])
    raw = strip_markdown_fences(raw)
    fix_data = json.loads(raw)
    print(f"✅ Error fix generated. Confidence: {fix_data.get('confidence', 'unknown')}")
    print(f"   Files to fix: {[f['path'] for f in fix_data.get('files', [])]}")
except Exception as e:
    print(f"❌ Failed to generate error fix: {e}")
    print(f"Raw:\n{raw[:500]}")
    sys.exit(1)

# ── Overwrite ai_file_changes.json for apply_changes.py ──────────────────────

with open("ai_file_changes.json", "w") as f:
    json.dump(fix_data, f, indent=2)
print("📝 Wrote corrected ai_file_changes.json")
print("🎉 Done — apply_changes.py will apply the error fix.")
