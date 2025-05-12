## GitHub Copilot Instructions

- **Explicitly state the rule(s)** you're applying in each output. Use concise phrases to indicate applied rules
- **When uncertain**, ask a series of concise, yes/no clarifying questions (maximum once per interaction)


## Project Context: Eloka SaaS Web App
Eloka is a **white-labeled, multi-tenant SaaS web app** enabling Admins to manage networks of agents handling financial transactions.

### Admin Capabilities
- Manage Agent Network: Onboarding, KYC verification, activity tracking, and business analytics
- Configure Fintech Products: Enable/disable products, feature toggles, and integrations
- Pricing & Commissions: Setup flexible commission structures per agent, product, and tier
- Customization & Branding: Domain, app name, logos, color themes, and landing page layout
- Wallet Management: Admin-level wallet operations, reconciliation, and monitoring

### Agent Capabilities
- Account Setup: Self-registration, KYC submission, and verification tracking
- Financial Transactions: Conduct various financial operations seamlessly
- Wallet Operations: Top-up, withdrawal, balance management, and transaction history
- Issue Resolution: Ticketing system for issue reporting and resolution tracking


## Code Standards

### Required Before Each Commit
- Run `npm run lint` to ensure code follows project standards
- Ensure all documentation is up-to-date and reflects the latest changes made to the codebase
- Make sure that the repository structure documentation is correct and accurate in the Copilot Instructions file
- Ensure all tests pass by running `npm run test` in the terminal

### TypeScript and React Patterns
- Use TypeScript interfaces/types for all props and data structures. Preferred interface over types.
- Follow React best practices (hooks, functional components)
- Use proper state management techniques
- Components should be modular and follow single-responsibility principle
- Use absolute imports for components and utilities (e.g., `import Button from 'components/Button'`)
- Avoid Enums: Use constant objects with `as const` assertion.
- Explicit return types on all functions/components.

### Coding Style
- Write **concise, self-explanatory TypeScript** code with accurate examples.
- Prefer **functional and declarative patterns**; avoid OOP and classes.
- Use **modular and reusable functions** to minimize duplication.
- **Descriptive, semantic naming** for variables/functions (e.g., `isLoading`, `hasError`).
- For conditional rendering, prefer **ternary operators** over && and ||.
- Always use **optional chaining** (`?.`) for object properties to avoid null/undefined errors.
- Use **nullish coalescing** (`??`) for default values instead of logical OR (`||`).
- Keep files small and focused on a single responsibility.
- Use **tabs for indentation** consistently across all files.

### Performance & Optimization
- Optimize components and pages for performance
- Implement **lazy loading** (dynamic imports) for non-critical components. Eg: `const Component = dynamic(() => import('components/Component'), { ssr: false })`
- Apply appropriate **caching strategies** to minimize unnecessary re-renders.
- Ensure proper **cleanup** for event listeners, intervals, and effects (`useEffect` cleanup).

### Styling
- Prefer custom components in the `components` folder over Chakra UI's built-in components (e.g., `components/Button`, `components/Input`, `components/Select`).
- Exclusively use **Chakra UI** for styling and base components where custom components aren't available.
- Use [theme variables](../styles/themes.tsx) for colors, fonts, and spacing.

### Naming Conventions
- Directories: lowercase with dashes (e.g., `layout-components`)
- Component files: PascalCase (`TextArea.tsx`)
- Utility files: camelCase (`formValidator.ts`)
- Exports: prefer named exports over defaults.


## Development Flow
- Install dependencies: `npm install`
- Development server: `npm run dev`
- Build: `npm run build`
- Test: `npm run test`
- Lint: `npm run lint`


## Repository Structure
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


## Tech Stack
- React
- Next.js (with pages directory)
- TypeScript
- Chakra UI (design system)
- Jest (unit testing)
- Storybook (component documentation)


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

### Example test structure for standalone components:
```js
import { render, pageRender } from "test-utils";
import { Button } from "components/Button";

describe("Button component", () => {
	it("renders successfully", () => {
		const { container } = render(<Button />);
		expect(container).not.toBeEmptyDOMElement();
	});
});
```

### Example test structure for page components or comonents which depend on global contexts:
```js
import { Home } from "page-components/Home";
import { pageRender } from "test-utils";

describe("Home page", () => {
	it("renders successfully", () => {
		const { container } = pageRender(<Home />);
		expect(container).not.toBeEmptyDOMElement();
	});
});
```


## Git Commit Guidelines
### Use semantic prefixes for clarity:
- `fix:` Bug fixes
- `feat:` New features
- `perf:` Performance improvements
- `docs:` Documentation updates
- `style:` Code formatting (no logic change)
- `ui`: UI changes
- `refactor:` Code refactoring
- `test:` Adding tests
- `build:` Build/configuration changes
- `chore:` Maintenance tasks
- `ci:` CI/CD pipeline updates
- `wip:` In-progress partial commits

### Commit Messages:
- Lowercase, concise, and descriptive summaries.
- Detailed body for non-obvious or major changes.


## Documentation Standards
- Maintain a clear, comprehensive **README** (setup, dependencies, usage).
- Maintain extensive technical documentation in the `docs/` folder.
- Add detailed comments/JSDoc for complex or non-trivial logic.
- Use JSDoc format explicitly, especially for optional parameters.

```ts
/**
 * Example function description
 * @param {string} userId - Unique identifier
 * @param {boolean} [isAdmin] - Admin privileges flag
 * @returns {void} - No return value
 */
```