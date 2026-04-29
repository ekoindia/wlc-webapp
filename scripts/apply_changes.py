"""
apply_changes.py
────────────────
Reads ai_file_changes.json and applies the file operations
(modify / create / delete) to the working directory.
"""

import json
import os
import pathlib
import sys

print("🔧 Applying AI-generated file changes...")

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

    if action in ("modify", "create"):
        # Create parent directories if they don't exist
        file_path.parent.mkdir(parents=True, exist_ok=True)
        file_path.write_text(content, encoding="utf-8")
        print(f"   ✅ {action.upper()}: {path}")

    elif action == "delete":
        if file_path.exists():
            file_path.unlink()
            print(f"   🗑️  DELETE: {path}")
        else:
            print(f"   ⚠️  DELETE: {path} (file not found, skipping)")

    else:
        print(f"   ⚠️  Unknown action '{action}' for {path} — skipping.")

print("✅ All changes applied.")
