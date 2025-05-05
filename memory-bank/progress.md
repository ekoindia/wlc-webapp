# Project Progress: Eloka Web App

## Current Status (as of Memory Bank Initialization)
The Eloka Web App is an active project with a range of implemented features for both Admins and Agents, built on a Next.js/React/TypeScript stack. The application includes core functionalities for agent network management, product configuration, financial transactions, UI customization, and more. Development environment setup, testing, and deployment via Docker are established processes.

## What Works (Based on Documentation)
-   **Core Platform:** White-labeled, multi-tenant SaaS structure.
-   **Admin Capabilities:**
    -   Agent network management (onboarding, KYC, tracking - assumed functional).
    -   Product configuration (enable/disable, feature toggles).
    -   Pricing & Commission setup (file upload and custom page methods).
    -   Branding customization (domain, logo, theme).
    -   Wallet management.
    -   Business Dashboard (`page-components/Admin/Dashboard/BusinessDashboard`).
-   **Agent Capabilities:**
    -   Account setup (self-registration, KYC submission).
    -   Financial transactions (general capability).
    -   Wallet operations (top-up, withdrawal, history).
    -   Issue resolution (ticketing system).
-   **UI Features:**
    -   Global Styles, Theming (Chakra UI base, custom themes).
    -   Icon Library (`/icons_demo` page).
    -   Navigation: Top Navbar, Left Sidebar, Bottom App Bar (responsive).
-   **Technical Features:**
    -   Feature Flag system (`useFeatureFlag`).
    -   Pub/Sub system (`usePubSub`).
    -   Android Communication layer.
    -   Various custom hooks (`hooks/`) and utility libraries (`libs/`).
    -   Dockerized development and production environments.
    -   Established testing framework (`Jest`, `Storybook`, `test-utils`).
    -   Code quality tools (ESLint, Prettier, Husky).

## What's Left to Build / TODOs (from README)
-   **Feature Flags:** Enhance system for A-B testing, gradual roll-out.
-   **LLM Chatbot (`AiChatWidget.jsx`):** Integrate `react-chatbot-kit` library.
-   **Global Contexts (`contexts/`):** Documentation incomplete in README.
-   **LocalStorage Usage:** Documentation incomplete in README.
-   **Know Your Commissions (`page-components/Home/KnowYourCommissionWidget`):** Further details might be needed beyond data fetching via `CommissionContext`.
-   **Testing:** Ensure comprehensive coverage across all components and features.
-   **Extended Documentation in `docs/` Folder:** Move detailed documentation, features, etc from README to `docs/` folder for better organization.
-   **Storybook:** Document all UI components in Storybook for better visibility and testing.
-   **Performance Optimization:** Review and enhance performance across the application.

## Known Issues / Areas for Improvement
-   **Duplicate Icon Names:** Exist for backward compatibility (`constants/IconLibrary.ts`).
-   **Experimental Features:** LLM Chatbot is marked as experimental/beta.

## Evolution of Project Decisions
-   **Docker:** Recent enhancements (Dec 2024) improved separation of dev/prod environments, and added health checks.
-   **UI Components:** Clear preference established for custom components over direct Chakra UI usage (`.clinerules`).
