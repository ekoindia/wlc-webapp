Your goal is to generate new pages with forms to integrate a KYC API.

Ask for the API documentation if not provided.

## Instructions for Creating KYC API Integration Pages

### 1. Gather API Documentation

- Request the following details for each KYC API to be integrated:
	- Endpoint URL(s)
	- HTTP method(s)
	- Request parameters (with types and validation rules)
	- Response structure (success and error, with field descriptions)
	- Sample success and error responses

### 2. Page Structure & Routing

- All new KYC pages must be created under: `pages/products/kyc`
  - Add the KYC product details in the `KycTools` array in [KycVerificationTools](../../page-components/products/kyc/KycVerificationTools.tsx)
  - Ensure to include the necessary details such as label, description, icon, and URL for each KYC product.
  - For each new KYC product, create a corresponding page under `pages/products/kyc` with the appropriate form and API integration.
- If there are multiple related APIs (e.g., PAN lookup, GSTIN verify), group them in sub-pages:
	- Example:
	  `pages/products/kyc/gstin/pan.tsx`
	  `pages/products/kyc/gstin/verify.tsx`
- If an API depends on the result of another API, integrate these APIs as serial calls in the same page.
- Use `pages/products/kyc` & `pages/products/kyc/gstin/` as a reference for structure, naming, and component usage.

### 3. Technical & UI Implementation
- Use `useEpsV3Fetch` hook for API calls.
- No need to pass the following parameters to the hook (they are handled internally):
	- `initiator_id`
	- `client_ref_id`
- Create a beautiful, clean and responsive custom UI to show large nested JSON responses. Use table components for better readability.
- Use `PageTitle` component for the page title. Eg: `<PageTitle title="GSTIN Verification" />`
- Use the `InfoTileGrid` component for displaying a group of sub-item links (like PAN, GSTIN, etc.) in a grid format.
- Add the `ResponseToolbar` component for actions like Back, Reset, and Copy JSON, at the end of the response card.
- Always decompose large components into smaller internal components for better readability and maintainability.

### 4. Component Reuse & Modularity

- **Reuse all available UI and logic components from:**
  `page-components/products/common/`
	- Available Components:
		- `ResponseToolbar` (for Back, Reset, Copy JSON actions at the end of the response card)
		- `ResponseSection` (for displaying a section of the API responses. It shows the section heading and a left border. For nested JSON, use a nested `ResponseSection` for each level of nesting. For displaying a list of objects, use a `ResponseSection` for each object in the list and pass `index` as a prop to the `ResponseSection` component, starting with 1. Ensure to handle the rendering of the index correctly to maintain the order of items in the list.)
	- Example Import: `import { ResponseSection, ResponseToolbar } from 'page-components/products/common';`
- Place any new reusable logic/UI in `page-components/products/common/` for future use.
- For all page components, wrap the page contents inside a `PaddingBox` component.
- For sub-pages, use the `BreadcrumbsWrapper` component for navigation (inside the `PaddingBox` component)
- Before using any internal component, verify if it actually exists.

### 5. Coding & Style Guidelines

- See [Copilot-Instructions](../copilot-instructions.md)

---

### 6. Example Structure (for GSTIN)

```
pages/
└── products/
    └── kyc/
        ├── index.tsx
        └── gstin/
            ├── index.tsx
            ├── pan.tsx
            └── verify.tsx
page-components/
└── products/
    ├── common/
    │   └── ResponseToolbar.tsx
    └── kyc/
        └── [KycFormComponent].tsx
```

---

### 7. Verification & Testing
- Ensure to test the API integration thoroughly.
- Use the provided sample responses to validate the API integration.
- Ensure to test the UI for responsiveness and usability.
- Ensure to test the API integration with different scenarios (valid, invalid, edge cases).
- Check for any errors or warnings in the console and fix them.
