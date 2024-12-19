# Eloka SaaS Web App

Every time you choose to apply a rule(s), explicitly state the rule(s) in the output. You can abbreviate the rule description to a single word or phrase.

## Project Context
White-labeled, multi-tenant, SaaS web-app to manage a network of agents who make financial transactions via this app.
- Lets an Admin do the following:
	- manage agent network and their business
	- configure fintech products available for agents
	- configure pricing and commissions for each product
	- configure the UI of this app for their network, including custom domain, app name, logo, color theme, landing page design, etc
	- manage their wallet
- Lets users (agents) do the following:
	- signup and complete their KYC
	- use the financial services
	- manage their wallet
	- raise tickets for any issue

## Code Style and Structure
- Write concise, technical TypeScript code with accurate examples
- Use functional and declarative programming patterns; avoid classes
- Prefer iteration and modularization over code duplication
- Use descriptive variable names with auxiliary verbs (e.g., isLoading, hasError)
- Structure repository files as follows:
```
Eloka Web App
├── __tests__/			# All Unit and integration tests. Sub-folders follow the same structure as the main codebase
├── components/			# Reusable React UI components with sub-folders for each component
├── constants/			# Application constants
├── contexts/			# React context providers
├── docs/				# Detailed project documentation
├── helpers/			# Helper functions specific to the app business logic
├── hooks/				# Custom React hooks
├── layout-components/	# Layout-specific components with sub-folders for each component
├── libs/				# External shared libraries
├── page-components/	# Components specific to individual pages with sub-folders for each page and path
├── pages/				# Next.js pages
├── public/				# Public images, scripts and other files
├── styles/				# Chakra UI Theme configurations
├── tf-components/		# Special components for low-code form rendering based on transaction-framework rule engine
├── utils/				# General-purpose utility functions
└── README.md			# Project documentation
```

## Tech Stack
- React
- Next.js
- TypeScript
- ChakraUI
- Jest

## Naming Conventions
- Use lowercase with dashes for directories (e.g., components/form-wizard)
- Favor named exports for components and utilities
- Use PascalCase for component files (e.g., VisaForm.tsx)
- Use camelCase for utility files (e-g., formValidator.ts)

## TypeScript Usage
- Prefer interfaces over types
- Avoid enums; use const objects with 'as const' assertion
- Use functional components with TypeScript interfaces
- Use absolute imports for all files: 'components/...', 'hooks/...', etc
- Use explicit return types for all functions

## UI and Styling
- Use Chakra UI for components and styling
- Prefer components in the 'components/' directory

## Performance Optimization
- Implement proper lazy loading for non-critical components
- Use proper caching strategies
- Implement proper cleanup for event listeners, observers and useEffect hooks

## Testing
- Create test-cases for generated code
- Ensure full test coverage for all components and utilities
- Generate all tests in the `__tests__` folder. Sub-folders follow the same structure as the main codebase.
- Use Jest for unit tests
- Use `test-utils` helper for writing test code, which exports:
	- * from "@testing-library/dom"
	- * from "@testing-library/react";
	- userEvent from "@testing-library/user-event"
	- mockRouter from "next-router-mock"
	- pageRender - wrapper for render() with context providers for a logged-in user
	- adminRender - wrapper for render() with context providers for a logged-in Admin user
	- loggedOutPageRender - wrapper for render() with context providers for a logged-out user

For Example:
```
import { render, pageRender, adminRender, renderHook } from "test-utils";
import { Button } from "components";

describe("Button", () => {
	it("renders without error", () => {
		const { container } = render(<Button />);
		expect(container).not.toBeEmptyDOMElement();
  });
});
```

## Git Usage
Commit Message Prefixes:
- "fix:" for bug fixes
- "feat:" for new features
- "perf:" for performance improvements
- "docs:" for documentation changes
- "style:" for formatting changes
- "refactor:" for code refactoring
- "test:" for adding missing tests
- "build:" for build-related changes
- "chore:" for maintenance tasks
- "ci:" for CI/CD changes
- "wip:" for work in progress
- "revert:" for reverting changes
- "security:" for security updates
- "config:" for configuration changes

Rules:
- Use lowercase for commit messages
- keep the summary line concise
- Include description for non-obvious changes

## Documentation
- Maintain clear README with setup instructions
- Include detailed comments for complex logic
- Write detailed JSDoc-style comments wherever applicable
	1. For example, write JSDoc for an optional parameters in the following style: `@param {data-type} [paramName] - Description of the parameter`
- Maintain detailed documentation in `docs/` folder
