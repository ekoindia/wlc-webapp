"""
apply_changes.py
────────────────
Reads ai_file_changes.json and applies file operations to the working directory.

Supports two formats for "modify" action:
  - "changes": [{"search": "...", "replace": "..."}]  ← preferred (search/replace)
  - "content": "..."                                   ← full file (create only)

Path traversal guard prevents writes outside the repo root.
"""

import json
import pathlib
import sys

print("🔧 Applying AI-generated file changes...")

REPO_ROOT = pathlib.Path.cwd().resolve()

try:
    with open("ai_file_changes.json", encoding="utf-8") as f:
        fix_data = json.JSONDecoder(strict=False).decode(f.read())
except FileNotFoundError:
    print("❌ ai_file_changes.json not found.")
    sys.exit(1)

files_to_change = fix_data.get("files", [])

if not files_to_change:
    print("⚠️  No file changes in the fix. Nothing to apply.")
    sys.exit(0)

for item in files_to_change:
    path   = item.get("path", "").strip()
    action = item.get("action", "modify").strip().lower()

    if not path:
        print("⚠️  Skipping entry with no path.")
        continue

    file_path = pathlib.Path(path)

    # Path traversal guard
    resolved = (REPO_ROOT / file_path).resolve()
    if not str(resolved).startswith(str(REPO_ROOT)):
        print(f"   ⚠️  Skipping path outside repo: {path}")
        continue

    # ── DELETE ────────────────────────────────────────────────────────────────

    if action == "delete":
        if resolved.exists():
            resolved.unlink()
            print(f"   🗑️  DELETE: {path}")
        else:
            print(f"   ⚠️  DELETE: {path} (file not found, skipping)")
        continue

    # ── CREATE (full content required) ────────────────────────────────────────

    if action == "create":
        content = item.get("content", "")
        resolved.parent.mkdir(parents=True, exist_ok=True)
        resolved.write_text(content, encoding="utf-8")
        print(f"   ✅ CREATE: {path}")
        continue

    # ── MODIFY — prefer search/replace over full content ─────────────────────

    if action == "modify":
        changes = item.get("changes", [])

        if changes:
            # Search/replace mode — safe for large files
            if not resolved.exists():
                print(f"   ⚠️  MODIFY: {path} not found — skipping.")
                continue

            original = resolved.read_text(encoding="utf-8")
            updated = original
            applied = 0

            for change in changes:
                search  = change.get("search", "")
                replace = change.get("replace", "")

                if not search:
                    continue

                if search in updated:
                    updated = updated.replace(search, replace, 1)
                    applied += 1
                else:
                    print(f"   ⚠️  Search string not found in {path}:")
                    print(f"       {repr(search[:80])}")

            if applied == 0:
                print(f"   ⚠️  MODIFY: no changes applied to {path}")
            else:
                resolved.write_text(updated, encoding="utf-8")
                print(f"   ✅ MODIFY ({applied} change(s)): {path}")

        else:
            # Fallback: full content replacement (only safe for small/new files)
            content = item.get("content", "")
            if not content:
                print(f"   ⚠️  MODIFY: no 'changes' or 'content' for {path} — skipping.")
                continue
            resolved.parent.mkdir(parents=True, exist_ok=True)
            resolved.write_text(content, encoding="utf-8")
            print(f"   ✅ MODIFY (full rewrite): {path}")

        continue

    print(f"   ⚠️  Unknown action '{action}' for {path} — skipping.")

print("✅ All changes applied.")
