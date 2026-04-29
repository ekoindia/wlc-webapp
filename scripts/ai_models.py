"""
ai_models.py
────────────
Shared pool of free OpenRouter models used by all AI scripts.
Models are tried in order — first available / non-rate-limited wins.

To add a new model: append its OpenRouter model ID to the list.
Check available free models at: https://openrouter.ai/models?q=free
"""

MODELS = [
    "google/gemini-2.0-flash-exp:free",
    "google/gemma-4-31b-it:free",
    "qwen/qwen3-coder:free",
    "meta-llama/llama-3.3-70b-instruct:free",
    "nvidia/nemotron-3-super:free",
    "minimax/minimax-m2.5:free",
    "openai/gpt-oss-120b:free",
    "z-ai/glm-4.5-air:free",
    "tencent/hy3-preview:free",
]
