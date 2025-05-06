# Tech Context: Eloka Web App

## Core Technologies
-   **Frontend Framework:** React (using Hooks and Functional Components)
-   **Meta-Framework:** Next.js (for SSR, routing, API routes, etc.)
-   **Language:** TypeScript
-   **UI Library:** Chakra UI (as a base, with preference for custom components)
-   **Testing:** Jest (Unit/Integration), Storybook (Component Documentation/Testing)
-   **Styling:** Chakra UI (primary), Global styles (`styles/globals.ts`), Theming (`styles/themes.tsx`)

## Development Setup & Environment
-   **Package Manager:** npm
-   **Prerequisites:** Node.js (version specified in `.nvmrc` if present)
-   **One-time Setup:**
    1.  `npm i` (Install dependencies)
    2.  `npm run prepare` (Likely sets up Husky hooks)
    3.  `chmod +x .husky/pre-commit` (Ensure pre-commit hook is executable)
-   **Running Locally:**
    -   `npm run dev` (HTTP server on port 3002)
    -   `npm run dev.https` (HTTPS server on port 3004)
    -   `npm run scan` (Dev server with react-scan on port 3006)
    -   `npm run inspect` (Dev server with Node inspector)
-   **Environment Variables:** Managed via `.env.*` files (`.env.local`, `.env.development`, `.env.production`, `.env.test`).
-   **Docker:**
    -   Development: `npm run docker:dev` (uses `Dockerfile.dev`, hot-reload, debug port 9229)
    -   Production: `npm run docker:prod` (uses `Dockerfile`, optimized build)
    -   Management scripts available (`docker:dev:build`, `docker:prod:build`, `docker:stop`, `docker:clean`). See `docs/docker-usage.md`.

## Technical Constraints & Best Practices
-   **Coding Style:** Functional/declarative, modular, reusable functions, descriptive naming, tabs for indentation, ternaries for conditional rendering, optional chaining (`?.`), nullish coalescing (`??`). (See `.clinerules`)
-   **TypeScript:** Prefer Interfaces, avoid Enums (use `as const`), explicit return types, absolute imports. (See `.clinerules`)
-   **UI:** Prefer custom components over direct Chakra UI usage. (See `.clinerules`)
-   **Performance:** Lazy loading (dynamic imports), caching, effect cleanup. (See `.clinerules`)
-   **Testing:** Comprehensive coverage (unit/integration) in `__tests__/`, use `test-utils` wrappers. (See `.clinerules`)
-   **Git:** Semantic commit messages required. (See `.clinerules`)
-   **Documentation:** JSDoc for complex logic/optional params, README maintenance, `docs/` folder for extensive docs. (See `.clinerules`)

## Key Dependencies & Libraries (Inferred)
-   `react`, `react-dom`
-   `next`
-   `typescript`
-   `@chakra-ui/react` and related packages
-   `jest`, `@testing-library/react`, `next-router-mock`
-   `eslint`, `prettier`
-   `husky` (for pre-commit hooks)
-   `plop` (for component generation)
-   `storybook`
-   `date-fns` (via `libs/dateFormat.js`)
-   `tinykeys` (via `hooks/useHotkey.js`)
-   `react-chatbot-kit` (Experimental feature)
-   MediaPipe (via `libs/faceDetector.js`)

## Tool Usage Patterns
-   **Code Generation:** `npm run g` or `npm run generate` (uses Plop).
-   **Linting/Formatting:** `npm run lint`, `npm run eslint`, `npm run format` (integrated with pre-commit hooks via Husky).
-   **Testing:** `npm test`, `npm run test-file`, `npm run test-watch`, `npm run test-coverage`.
-   **Dependency Management:** `npm i`, `npm run check-updates`, `npm run check-deps`.
-   **Build/Analysis:** `npm run build`, `npm run analyze`.
-   **Storybook:** `npm run sb`, `npm run build-storybook`.
-   **Icon Optimization:** Manual optimization using SVGO GUI recommended (`README.md`).
