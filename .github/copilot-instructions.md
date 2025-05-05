## GitHub Copilot Instructions

- **Explicitly state the rule(s)** you're applying in each output. Use concise phrases to indicate applied rules.
- **When uncertain**, ask a series of concise, yes/no clarifying questions (maximum once per interaction).

---

## Project Context: Eloka SaaS Web App

Eloka is a **white-labeled, multi-tenant SaaS web app** enabling Admins to manage networks of agents handling financial transactions.

### Admin Capabilities
- **Manage Agent Network**: Onboarding, KYC verification, activity tracking, and business analytics.
- **Configure Fintech Products**: Enable/disable products, feature toggles, and integrations.
- **Pricing & Commissions**: Setup flexible commission structures per agent, product, and tier.
- **Customization & Branding**: Domain, app name, logos, color themes, and landing page layout.
- **Wallet Management**: Admin-level wallet operations, reconciliation, and monitoring.

### Agent Capabilities
- **Account Setup**: Self-registration, KYC submission, and verification tracking.
- **Financial Transactions**: Conduct various financial operations seamlessly.
- **Wallet Operations**: Top-up, withdrawal, balance management, and transaction history.
- **Issue Resolution**: Ticketing system for issue reporting and resolution tracking.

---

## Coding Style Guidelines

- Write **concise, self-explanatory TypeScript** code with accurate examples.
- Prefer **functional and declarative patterns**; avoid OOP and classes.
- Use **modular and reusable functions** to minimize duplication.
- **Descriptive, semantic naming** for variables/functions (e.g., `isLoading`, `hasError`).
- Use **tabs for indentation** consistently across all files.
- For conditional rendering, prefer **ternary operators** over && and ||.
- Always use **optional chaining** (`?.`) for object properties to avoid null/undefined errors.
- Use **nullish coalescing** (`??`) for default values instead of logical OR (`||`).

### Repository Structure
```
Eloka Web App
├── __tests__/              # All tests (unit/integration), mirroring main code structure
├── components/             # Reusable React UI components
├── constants/              # Application-wide constants
├── contexts/               # React context providers
├── docs/                   # Comprehensive project documentation
├── helpers/                # Business-specific helper functions
├── hooks/                  # Custom React hooks
├── layout-components/      # Components specific to layout and navigation
├── libs/                   # External and shared libraries
├── page-components/        # Page-specific React components
├── pages/                  # Next.js page routes
├── public/                 # Static assets (images, scripts)
├── styles/                 # Chakra UI theme and global styling
├── tf-components/          # Components for low-code forms (transaction framework)
├── utils/                  # General-purpose utility functions
└── README.md               # Setup and usage documentation
```

---

## Tech Stack

- **React** (Hooks, Functional Components)
- **Next.js** (SSR, Dynamic Routes)
- **TypeScript**
- **Chakra UI** (Design system)
- **Jest** (Unit/Integration Testing)
- **Storybook** (Component Documentation)

---

## Naming Conventions

- **Directories**: lowercase with dashes (e.g., `form-wizard`)
- **Component Files**: PascalCase (`VisaForm.tsx`)
- **Utility Files**: camelCase (`formValidator.ts`)
- **Exports**: Prefer named exports over defaults.

---

## TypeScript Best Practices

- **Prefer Interfaces** over types for defining object shapes.
- **Avoid Enums**: Use constant objects with `as const` assertion.
- **Explicit Return Types** on all functions/components.
- **Absolute Imports** consistently (e.g., `components/Button`).

---

## UI & Styling

- Prefer custom components in the `components` folder over Chakra UI's built-in components (e.g., `components/Button`, `components/Input`, `components/Select`).
- Exclusively use **Chakra UI** for styling and base components where custom components aren't available.

---

## Performance & Optimization

- Implement **lazy loading** (dynamic imports) for non-critical components.
- Apply appropriate **caching strategies** to minimize unnecessary re-renders.
- Ensure proper **cleanup** for event listeners, intervals, and effects (`useEffect` cleanup).

---

## Testing Practices

- Ensure comprehensive test coverage (**unit & integration**).
- Write tests within the `__tests__/` directory, mirroring the main file structure.
- Utilize `test-utils` to standardize rendering tests:
  - Re-export from:
    - `@testing-library/react`
    - `@testing-library/dom`
    - `@testing-library/user-event`
    - `next-router-mock`
  - Custom render wrappers:
    - `pageRender` (logged-in user)
    - `adminRender` (logged-in Admin)
    - `loggedOutPageRender` (logged-out user)

**Example Test Structure:**

```tsx
import { render, pageRender } from "test-utils";
import { Button } from "components/Button";

describe("Button component", () => {
	it("renders successfully", () => {
		const { container } = render(<Button />);
		expect(container).not.toBeEmptyDOMElement();
	});
});
```

---

## Git Commit Guidelines

Use **semantic prefixes** for clarity:

- `fix:` Bug fixes
- `feat:` New features
- `perf:` Performance improvements
- `docs:` Documentation updates
- `style:` Code formatting (no logic change)
- `refactor:` Code refactoring
- `test:` Adding tests
- `build:` Build/configuration changes
- `chore:` Maintenance tasks
- `ci:` CI/CD pipeline updates
- `wip:` Work-in-progress
- `revert:` Reverting commits
- `security:` Security patches
- `config:` Configuration changes

**Commit Messages:**
- Lowercase, concise, and descriptive summaries.
- Detailed body for non-obvious or major changes.

---

## Documentation Standards

- Maintain a clear, comprehensive **README** (setup, dependencies, usage).
- Add detailed comments/JSDoc for complex or non-trivial logic.
- Use JSDoc format explicitly, especially for optional parameters:

```typescript
/**
 * Example function description
 * @param {string} userId - Unique identifier
 * @param {boolean} [isAdmin] - Admin privileges flag
 */
```

- Keep extensive technical documentation in the `docs/` folder.
