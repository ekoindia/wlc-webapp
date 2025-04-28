# Active Context: Eloka Web App

## Current Focus
-   Initial setup and population of the Memory Bank based on existing project documentation (`README.md`, `docs/`, `.clinerules`).

## Recent Changes (from docs/aichanges.md)
-   **2024-12-26:**
    -   Enhanced Docker configuration (separate dev/prod Dockerfiles, optimized builds, updated compose file).
    -   Added Docker environment management (health checks, networking, npm scripts, documentation).

## Next Steps
-   Complete the initialization of the Memory Bank core files (`progress.md`).
-   Await the next development task.

## Active Decisions & Considerations
-   Establishing the Memory Bank structure and content based on the provided documentation and `.clinerules`.

## Important Patterns & Preferences (from .clinerules & README)
-   **Coding Style:** Functional, declarative, modular TypeScript. Tabs for indentation. Ternaries, optional chaining (`?.`), nullish coalescing (`??`).
-   **TypeScript:** Interfaces over types, no Enums (`as const`), explicit returns, absolute imports.
-   **UI:** Custom components preferred over direct Chakra UI usage.
-   **Testing:** Comprehensive unit/integration tests in `__tests__/` using `test-utils`.
-   **Git:** Semantic commit messages.
-   **Feature Flags:** Use `useFeatureFlag` hook / `checkFeatureFlag` function.
-   **Pub/Sub:** Use `usePubSub` hook for event handling.
-   **State:** Context API, custom hooks, browser storage (`localStorage`/`sessionStorage`).

## Learnings & Project Insights
-   The project has a well-defined structure and coding standards documented in `.clinerules`.
-   Extensive use of configuration files (`constants/`) drives UI elements like menus and feature availability.
-   Specific patterns exist for common tasks like Android communication, feature flagging, and business logic configuration.
-   Docker setup is mature, with distinct development and production environments.
