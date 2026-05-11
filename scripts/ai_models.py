"""
ai_models.py
────────────
Anthropic Claude models used by all AI scripts.
Models are tried in order — first available / non-rate-limited wins.
"""

MODELS = [
    "claude-sonnet-4-6",           # latest Sonnet — best balance of speed and quality
    "claude-haiku-4-5-20251001",   # fast, cheap fallback
    "claude-opus-4-7",             # most capable, use when others fail
]
