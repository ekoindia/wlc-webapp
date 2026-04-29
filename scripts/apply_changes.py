"""
apply_changes.py
────────────────
Reads ai_file_changes.json and applies the file operations
(modify / create / delete) to the working directory.
Includes a path traversal guard to prevent writes outside the repo root.
"""

import json
import os
import pathlib
import sys

print("🔧 Applying AI-generated file changes...")

REPO_ROOT = pathlib.Path.cwd().resolve()

try:
    with open("ai_file_changes.json") as f:
        fix_data = json.load(f)
except FileNotFoundError:
    print("❌ ai_file_changes.json not found.")
    sys.exit(1)

files_to_change = fix_data.get("files", [])

if not files_to_change:
    print("⚠️  No file changes in the fix. Nothing to apply.")
    sys.exit(0)

for item in files_to_change:
    path    = item.get("path", "").strip()
    action  = item.get("action", "modify").strip().lower()
    content = item.get("content", "")

    if not path:
        print("⚠️  Skipping entry with no path.")
        continue

    file_path = pathlib.Path(path)

    # Path traversal guard — ensure resolved path stays within repo root
    resolved = (REPO_ROOT / file_path).resolve()
    if not str(resolved).startswith(str(REPO_ROOT)):
        print(f"   ⚠️  Skipping path outside repo: {path}")
        continue

    if action in ("modify", "create"):
        # Create parent directories if they don't exist
        resolved.parent.mkdir(parents=True, exist_ok=True)
        resolved.write_text(content, encoding="utf-8")
        print(f"   ✅ {action.upper()}: {path}")

    elif action == "delete":
        if resolved.exists():
            resolved.unlink()
            print(f"   🗑️  DELETE: {path}")
        else:
            print(f"   ⚠️  DELETE: {path} (file not found, skipping)")

    else:
        print(f"   ⚠️  Unknown action '{action}' for {path} — skipping.")

print("✅ All changes applied.")
