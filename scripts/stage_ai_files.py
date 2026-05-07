"""
stage_ai_files.py
─────────────────
Reads ai_file_changes.json and runs `git add <path>` (or `git rm`) for each
file the AI changed — so the commit never includes unrelated build artifacts.
"""

import json
import subprocess
import sys

try:
    with open("ai_file_changes.json") as f:
        data = json.load(f)
except FileNotFoundError:
    print("⚠️  ai_file_changes.json not found — no AI changes to stage.")
    sys.exit(0)

files = data.get("files", [])

if not files:
    print("⚠️  No files listed in ai_file_changes.json — nothing to stage.")
    sys.exit(0)

for item in files:
    path = item.get("path", "").strip()
    action = item.get("action", "modify").strip().lower()

    if not path:
        continue

    if action == "delete":
        subprocess.run(["git", "rm", "--cached", "--ignore-unmatch", path], check=False)
    else:
        subprocess.run(["git", "add", path], check=False)

    print(f"   staged [{action}]: {path}")

print(f"✅ Staged {len(files)} file(s) from ai_file_changes.json")
