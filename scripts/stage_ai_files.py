"""
stage_ai_files.py
─────────────────
Stages ONLY AI-modified files from ai_file_changes.json
to avoid committing unrelated files/build artifacts.
"""

import json
import pathlib
import subprocess
import sys

BLOCKED_PATHS = [
    ".github/workflows",
    ".git",
    "package-lock.json",
    "yarn.lock",
    "pnpm-lock.yaml"
]

try:
    with open("ai_file_changes.json", encoding="utf-8") as f:
        data = json.load(f)

except FileNotFoundError:
    print("⚠️ ai_file_changes.json not found")
    sys.exit(0)

files = data.get("files", [])

if not files:
    print("⚠️ No files found in ai_file_changes.json")
    sys.exit(0)

staged_count = 0

for item in files:
    path = item.get("path", "").strip()

    action = item.get(
        "action",
        "modify"
    ).strip().lower()

    if not path:
        continue

    # ─────────────────────────────────────────────
    # Block dangerous paths
    # ─────────────────────────────────────────────

    if any(blocked in path for blocked in BLOCKED_PATHS):
        print(f"⛔ Blocked path skipped: {path}")
        continue

    file_path = pathlib.Path(path)

    # ─────────────────────────────────────────────
    # Delete handling
    # ─────────────────────────────────────────────

    if action == "delete":
        if file_path.exists():
            subprocess.run(
                ["git", "rm", path],
                check=False
            )

            print(f"🗑️ staged delete: {path}")

            staged_count += 1

        continue

    # ─────────────────────────────────────────────
    # Skip missing files
    # ─────────────────────────────────────────────

    if not file_path.exists():
        print(f"⚠️ File does not exist: {path}")
        continue

    # ─────────────────────────────────────────────
    # Stage file
    # ─────────────────────────────────────────────

    subprocess.run(
        ["git", "add", path],
        check=False
    )

    print(f"✅ staged [{action}]: {path}")

    staged_count += 1

# ─────────────────────────────────────────────────
# Final result
# ─────────────────────────────────────────────────

if staged_count == 0:
    print("⚠️ No valid AI files staged")
    sys.exit(0)

print(f"🎉 Successfully staged {staged_count} AI file(s)")