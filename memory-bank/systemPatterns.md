# System Patterns: Eloka Web App

## Architecture Overview
-   **Framework:** Next.js (SSR, Dynamic Routes) built on React.
-   **Language:** TypeScript.
-   **Architecture Style:** Modular, component-based architecture favoring functional and declarative patterns. Avoids OOP/classes.
-   **Multi-Tenant SaaS:** Designed to support multiple organizations (tenants) with white-labeling capabilities.
-   **State Management:** Primarily uses React Context API (`contexts/`) and custom hooks (`hooks/`). Local/Session storage is used for specific data persistence (`useLocalStorage`, `useSessionStorage`, `useDailyCacheState`).
-   **UI:** Chakra UI serves as the base design system, but the application prioritizes custom reusable components (`components/`) built on top of or replacing Chakra UI elements.
-   **Routing:** Managed by Next.js. Differentiates between public (`constants/validRoutes.js`) and private routes (requiring authentication).

## Key Technical Decisions & Patterns
-   **Functional Programming:** Emphasis on pure functions, immutability, and avoiding side effects where possible. Heavy use of React Hooks.
-   **Modularity:** Code is organized into distinct directories based on function (`components`, `hooks`, `pages`, `utils`, etc.). Reusability is key.
-   **Custom Components:** Preference for building custom UI components (`components/Button`, `components/Input`) over directly using Chakra UI components to ensure consistency and control.
-   **Feature Flags:** Centralized system (`constants/featureFlags.ts`, `hooks/useFeatureFlag.tsx`) for toggling features based on environment, user type, etc.
-   **Pub/Sub System:** Internal event bus (`contexts/PubSubContext.js`, `constants/PubSubTopics.ts`) for decoupled communication between components.
-   **Configuration Driven UI:** Certain features, like Admin Pricing Configuration (`constants/ProductBusinessConfigurations.ts`) and Sidebar/Navbar menus (`constants/SidebarMenu.ts`, `constants/profileCardMenus.js`), are driven by configuration files.
-   **Android Communication:** Specific mechanism using `JavascriptInterface` and `postMessage` for interaction with an Android WebView wrapper (`utils/AndroidUtils.ts`, `layout-components/Layout/Layout.tsx`).
-   **Dockerization:** Separate Docker configurations for development (`Dockerfile.dev`) and production (`Dockerfile`) managed via `docker-compose.yaml` for consistent environments.

## Component Relationships & UI Structure
-   **Core Layout:** Managed by `layout-components/Layout/Layout.tsx`.
-   **Navigation:**
    -   Top: `components/NavBar/NavBar.jsx` (includes `ProfileCard` with menu from `constants/profileCardMenus.js`).
    -   Left: `components/SideBar/SideBar.jsx` (menu items from `constants/SidebarMenu.ts`, data processed via `contexts/MenuContext.tsx` and `hooks/useNavigationLists.js`).
    -   Bottom (Small Screens): `components/BottomAppBar/BottomAppBar.tsx` (items configured via `components/BottomAppBar/useBottomAppBar.ts`).
-   **Page Structure:** Next.js pages reside in `pages/`, often utilizing specific components from `page-components/`.
-   **Low-Code Forms:** Dedicated components under `tf-components/` for the transaction framework.

## Critical Implementation Paths
-   **Authentication & Authorization:** Login flow (`helpers/loginHelper.js`), token management (SessionStorage), route protection (`components/RouteProtecter/`).
-   **Admin Configuration:** Setting up pricing/business rules via file upload or custom pages (`constants/ProductBusinessConfigurations.ts`, `page-components/Admin/PricingCommission/`).
-   **Agent Transactions:** Core financial operations flow (details likely within specific product page components and contexts).
-   **Data Fetching:** Primarily through custom hooks (`hooks/useApiFetch.js`, `hooks/useRequest.js`) interacting with backend APIs (`helpers/apiHelper.js`). Contexts (`contexts/`) often manage fetched global state.
-   **Testing:** Standardized setup using `__tests__/test-utils/test-utils.js` wrappers (`pageRender`, `adminRender`, etc.) for rendering components in tests.
