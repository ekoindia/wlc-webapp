---
mode: 'agent'
description: 'Technical specification for the BBPS API integration framework'
---

## **BBPS Bill Payment UI — Technical Specification**

Your goal is to generate responsive, user-friendly UI for the BBPS bill payment workflow that adapts to scenarios described in the BBPS API documentation. The workflow (Search → Preview/Select → Amount → Pay → Status) is implemented as a self-contained /products/bbps section of the web-app — isolated, reusable, and fully testable.
The UI dynamically caters to various bill selection and payment amount rules based on the attributes received in the Validate 
Payment API response and prepares requests as per Make Payment API specifications. This is for an assisted bill payment flow where 
an agent performs the transaction on behalf of a customer.

### **Overview**

The BBPS bill payment workflow (Search → Preview/Select → Amount → Pay → Status) will be implemented as a self-contained `/products/bbps` section in the web-app. The UI and state management must be modular, extensible, and testable, supporting all scenarios described in the BBPS API documentation. This document prescribes the folder structure, state model, component responsibilities, and validation logic to be implemented.

---

# **BBPS Integration — Technical Blueprint**

*Tech stack: **Next.js**, **TypeScript**, **Chakra UI**, **Context API**, **Jest***

## **1. Prescribed Folder & Routing Structure**

The following structure must be used for all BBPS-related code:

```
.
├── pages/
│   └── products/
│       └── bbps/
│           └── [[...slug]].tsx   # Dynamic route handler for all BBPS pages
└── page-components/
    └── products/
        └── bbps/
            ├── Bbps.tsx           # Product grid display
            ├── Search.tsx         # Search form
            ├── Preview.tsx        # Bill selection
            ├── Payment.tsx        # Payment form
            ├── Status.tsx         # Transaction status
            ├── BbpsProducts.ts    # Product configuration array
            ├── types.ts           # TypeScript interfaces and types
            ├── context/
            │   ├── BbpsContext.tsx # Context provider
            │   ├── reducer.ts      # State reducer
            │   └── types.ts        # Context state interfaces
            ├── hooks/
            │   ├── useBbpsApi.ts   # API interaction
            │   └── useBbpsNavigation.ts # Navigation helper
            └── utils/
                ├── mockData.ts     # Mock data for testing
                └── transformBillData.ts # API response transformation
```

- The dynamic route handler (`[[...slug]].tsx`) is required for step-based navigation and deep-linking.
- Each workflow step must be implemented as a separate component for clarity and testability.

---

## **2. State Management Model**

A dedicated `BbpsContext` must be used to manage the entire workflow state. The following state shape and actions are required:

### **2.1 State Shape**

```typescript
export interface BbpsState {
  currentStep: Step; // "product-view" | "search" | "preview" | "payment" | "status"
  selectedProduct: BbpsProduct | null;
  billFetchResult?: {
    selectionMode: "single" | "multiOptional" | "multiMandatory";
    bills: SelectedBill[];
  } | null;
  selectedBills: SelectedBill[];
  totalAmount: number;
  isLoading: boolean;
  error: string | null;
  searchFormData: Record<string, string>;
  useMockData?: boolean;
  mockResponseType?: PaymentStatusType;
  paymentStatus?: PaymentStatusData | null;
}
```

### **2.2 State Actions**

The following actions must be implemented in the reducer:
- Navigation: `SET_CURRENT_STEP`, `RESET_STATE`
- Product: `SET_SELECTED_PRODUCT`
- Search: `SET_SEARCH_PAYLOAD`
- Bill: `SET_VALIDATION_RESPONSE`, `TOGGLE_BILL_SELECTION`, `UPDATE_BILL_AMOUNT`
- Payment: `SET_PAYMENT_STATUS`, `SET_LOADING`, `SET_ERROR`
- Mocking: `SET_MOCK_RESPONSE_TYPE`, `SET_MOCK_DATA_FLAG`

- The reducer pattern is required for predictable state transitions and centralized validation logic.

---

## **3. User Flow & Page Logic**

The following workflow must be implemented:

1. **Product Discovery (`/products/bbps`)**
   - Display all available biller categories using `InfoTileGrid`.
   - Each tile must show the product's label, description, and icon.
2. **Product Selection & Navigation**
   - Clicking a product tile must navigate to the search form for that product (`/products/bbps/[productId]`).
   - The `SET_SELECTED_PRODUCT` action must be dispatched.
3. **Bill Payment Workflow**
   - The search form must be generated from the product's `searchFields` config.
   - On successful validation, the Preview step must display bills with selection controls (checkboxes/radios as appropriate).
   - The Payment step must validate amounts and construct the payment request.
   - The Status step must show transaction results and error/success feedback.

---

## **4. Bill Payment Product Configuration**

Products must be defined in the `BbpsProducts` array with the following structure:

```typescript
export interface BbpsProduct {
  id: string;           // "electricity", "echallan", etc.
  label: string;        // "Electricity Bill"
  desc: string;         // Short description
  icon: string;         // Icon identifier
  url: string;          // URL for the product
  searchFields: SearchFieldDef[]; // Form field definitions
  useMockData?: boolean; // Toggle for mock data mode
}
```

- The `searchFields` array enables dynamic form generation and must be used for all billers.
- `useMockData` is required for UI development and testing before backend APIs are stable.

---

## **5. Bill Selection Logic**

The UI logic must be driven by the `payMultipleBills` attribute from the Validate Payment API response, mapped as follows:

- `selectionMode: "single"` (from `payMultipleBills: "N"`): radio buttons, only one bill selectable.
- `selectionMode: "multiOptional"` (from `payMultipleBills: "Y"`): checkboxes, one or more bills selectable.
- `selectionMode: "multiMandatory"` (from `payMultipleBills: "M"`): disabled, pre-selected checkboxes, all bills must be paid.
- If `payMultipleBills` is absent, default to `single` selection mode.

Edge cases (e.g., empty bill lists, missing attributes) must be handled gracefully.

---

## **6. Amount Input Rules**

For each bill, the following payment amount rules must be enforced:

- **min & max:** Display and enforce allowed payment range.
- **multiple:** Display and enforce required multiple value.
- Rules are derived from `minBillPayAmount`, `maxBillPayAmount`, and `amount_multiple` in the API response.
- The UI must provide real-time feedback for invalid input.
- If any of these fields are missing, validation must be skipped for that bill.

---

## **7. Payment Request Construction**

The payment request payload must have the following structure:

```typescript
const paymentRequest = {
  payment_amount: totalAmount,
  payment_amount_breakup: selectedBills.map((bill) => ({
    billid: bill.billid,
    bill_payment_amount: bill.amount,
  })),
  // Additional fields as required by API
};
```

- Validation must ensure the sum of all `bill_payment_amount` values matches `payment_amount`.

---

## **8. Enhancement & Testing Requirements**

The following requirements must be met:

1. **Error Handling:**
   - Implement comprehensive error states and recovery mechanisms.
   - Provide clear validation feedback for users.
2. **Performance:**
   - Optimize component rendering to reduce unnecessary re-renders.
   - Use memoization for expensive calculations.
3. **UI/UX:**
   - Add loading states and skeleton loaders for better user experience.
   - Ensure accessibility and mobile responsiveness.
4. **Testing:**
   - Achieve comprehensive test coverage (unit and integration).
   - Use mock data for end-to-end UI flow testing.
5. **Documentation:**
   - Use JSDoc comments for all complex logic.
   - Provide usage examples for context and hooks.

---

## **9. Implementation Guidelines**

- Follow the project's TypeScript and React patterns.
- Maintain the prescribed folder structure and naming conventions.
- Use Chakra UI for styling and components.
- Ensure all components are properly typed with TypeScript interfaces.
- Write unit tests for all new functionality.
- Maintain backward compatibility with the API contract.