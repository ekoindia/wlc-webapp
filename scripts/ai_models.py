"""
ai_models.py
────────────
Shared pool of free OpenRouter models used by all AI scripts.
Models are tried in order — first available / non-rate-limited wins.

To add a new model: append its OpenRouter model ID to the list.
Check available free models at: https://openrouter.ai/models?q=free
"""

MODELS = [
    # 🧠 ROUTER — OpenRouter picks the best available free model automatically
    "openrouter/free",

    # 💻 CODING SPECIALISTS — best at reading/writing code and structured JSON
    "qwen/qwen3-coder:free",             # top-tier code model, strong JSON adherence
    "deepseek/deepseek-r1:free",         # chain-of-thought reasoning, excellent for complex fixes
    "qwen/qwen2.5-coder-32b-instruct:free",  # strong fallback coder

    # 🧠 STRONG GENERAL — reliable instruction-following and high context
    "openai/gpt-oss-120b:free",          # confirmed working, large context
    "deepseek/deepseek-chat:free",       # DeepSeek V3, fast and capable
    "z-ai/glm-4.5-air:free",            # confirmed working

    # 🧩 LATE FALLBACKS — use only when all above are rate-limited
    "google/gemma-3-27b-it:free",        # reliable, lighter weight
    "meta-llama/llama-3.3-70b-instruct:free",
    "mistralai/mistral-small-3.1-24b-instruct:free",

    # Removed: google/gemini-2.0-flash-exp:free → 404 (model retired)
    # Removed: nvidia/nemotron-3-super:free      → 400 (broken on OpenRouter)
    # Removed: minimax/minimax-m2.5:free         → outputs prose before JSON; unreliable
    # Removed: tencent/hy3-preview:free          → preview/unstable
    # Removed: google/gemma-4-31b-it:free        → consistently rate-limited
]
