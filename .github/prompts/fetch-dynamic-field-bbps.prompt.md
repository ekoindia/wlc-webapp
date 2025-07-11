# BBPS Dynamic Fields Implementation Checklist

## Overview
Transform the current static BBPS search form into a dynamic one that fetches and renders fields based on operator selection.

---

## Phase 1: Analysis & API Integration

### 1.1 Current State Analysis
- [ ] **Review existing Search.tsx structure**
  - Current form uses static `product.searchFields`
  - Form submission goes directly to `fetchBills`
  - No operator selection workflow
  
- [ ] **Identify required changes**
  - Need to have static fields along with dynamic fields
  - Add field for operator selection AFTER the static fields
  - Implement field fetching based on operator selection
  - Update form state management to handle dynamic fields
  - **IMPORTANT**: If categoryId is present, operator selection is mandatory

### 1.2 API Integration Setup
- [ ] **Operators API (GET v2/billpayments/operators?category={categoryId})**
  - defaultUrlEndpoint: `/billpayments/operators?category={categoryId}`
  - Add API endpoint to `useBbpsApi` hook using `useEpsV3Fetch` hook from `hooks/useEpsV3Fetch.ts` with epsApiVersion as `2` in the settings
  - Get loading states from `useEpsV3Fetch` hook
  - Add error handling for network/API failures
  - Cache response if appropriate
  - This is how the response will look like, you need to map the response to the `Operator` interface and add it to the `operators` state and pass it to parameter list that is being passed to Form component

  ```json
    {
    "data": [
        {
        "operator_id": 28,
        "name": "Mahanagar Gas",
        "billFetchResponse": 0,
        "high_commission_channel": 1,
        "kyc_required": 0,
        "operator_category": 2,
        "location_id": 27
        },
        {
        "operator_id": 50,
        "name": "Gujarat Gas Limited",
        "billFetchResponse": 0,
        "high_commission_channel": 1,
        "kyc_required": 0,
        "operator_category": 2,
        "location_id": 24
        },
        {
        "operator_id": 51,
        "name": "Adani Gas",
        "billFetchResponse": 0,
        "high_commission_channel": 1,
        "kyc_required": 0,
        "operator_category": 2,
        "location_id": 0
        }
    ]
    }
```

- [ ] **Dynamic Fields API (GET /v2/billpayments/operators/{operator_id})**
  - defaultUrlEndpoint: `/billpayments/operators/{operator_id}`
  - Add API endpoint to `useBbpsApi` hook using `useEpsV3Fetch` hook from `hooks/useEpsV3Fetch.ts` with epsApiVersion as `2` in the settings
  - Implement parameter mapping logic
  - Add validation for response structure
  - Handle empty/invalid responses
  - Get loading states from `useEpsV3Fetch` hook
  - This is how the response will look like, you need to map the response to the `DynamicField` interface and add it to the `dynamicFields` state and pass it to parameter list that is being passed to Form component

  ```json
    {
    "operator_name": "Adani Gas",
    "data": [
        {
        "error_message": "Please enter a valid 10 digit Customer ID (eg. 1000111336)",
        "param_label": "Customer ID",
        "regex": "^[0-9]{10}$",
        "param_name": "utility_acc_no",
        "param_id": "1",
        "param_type": "Numeric"
        },
        {
        "error_message": "Please enter a valid 10 digit Customer Number (eg. 9876543210)",
        "param_label": "Customer Number",
        "regex": "^[0-9]{10}$",
        "param_name": "mobile_no",
        "param_id": "2",
        "param_type": "Numeric"
        }
    ]
    }
  ```

### 1.3 TypeScript Types
- [ ] **Create new interfaces**
  ```typescript
  interface Operator {
    operator_id: string;
    name: string;
    // other fields as needed
  }
  
  interface DynamicField {
    param_name: string;
    param_label: string;
    regex?: string;
    error_message?: string;
    // other validation rules
  }
  ```

---

## Phase 2: State Management Updates

### 2.1 BbpsContext Enhancement
- [ ] **Add new state properties**
  - `operators: Operator[]`
  - `selectedOperator: Operator | null`
  - `dynamicFields: DynamicField[]`
  - `isLoadingDynamicData: boolean` (single loading state for both operators and dynamic fields)

- [ ] **Add new actions**
  - `SET_OPERATORS`
  - `SET_SELECTED_OPERATOR`
  - `SET_DYNAMIC_FIELDS`
  - `SET_LOADING_DYNAMIC_DATA`
  - `RESET_DYNAMIC_FORM`

### 2.2 Form State Management
- [ ] **Implement form reset logic**
  - **ONLY clear dynamic field values when operator changes** (keep static fields)
  - Reset validation states for dynamic fields
  - Clear previous dynamic field values and parameters

---

## Phase 3: Component Development

### 3.1 Operator Selection
- [ ] **Functionality**
  - Fetch operators on mount
  - Handle operator selection
  - Trigger dynamic field fetch
  - Clear previous dynamic form data
  - Render this using Form component from tf-components/Form/Form.jsx using `parameter_type_id` to ParamType.LIST.
  - create a renderer to be passed with correct mapping of the key and value to the Form component

### 3.2 Dynamic Parameter Form
- [ ] **Map API response to FormField format**
  - Use `param_name` as form field name
  - Use `param_label` as field label
  - Apply `regex` for validation
  - Show `error_message` on validation failure
  - **Form field order**: Static fields → Operator selection → Dynamic fields

### 3.3 Enhanced Search Component
- [ ] **Update component structure**
  - Replace static form with dynamic workflow
  - Add operator selection step
  - Implement conditional rendering
  - Maintain existing submit logic

- [ ] **UI Flow States**
  - Loading operators
  - Operator selection
  - Loading dynamic fields
  - Dynamic form display
  - Form submission
  - Results display

---

## Phase 4: UI/UX Implementation

### 4.1 Error Handling UI
- [ ] **API Error States**
  - Network error messages should be shown using `useToast`
  - **IMPORTANT**: Use `useToast` for API integration errors (not final payment errors)

- [ ] **Form Validation Display**
  - Real-time validation feedback
  - Clear error messages
  - Field-specific error styling

---

## Phase 5: Integration & Testing

### 5.1 Form Integration
- [ ] **Form submission flow**
  - Aggregate static + dynamic field data
  - Maintain existing `fetchBills` integration
  - Preserve error handling logic
  - **Update mock data handling**: Include random dynamic fields without API calls

### 5.1.1 Mock Data Enhancement
- [ ] **Mock Data for Dynamic Fields**
  - When `useMockData` is true, generate random dynamic fields
  - Mimic real API response structure for operators and dynamic fields
  - Include sample operators with realistic names
  - Generate dynamic fields with various param_types (Numeric, Text, etc.)
  - No actual API calls in mock mode

### 5.2 Validation Integration
- [ ] **Client-side validation**
  - Apply regex patterns from API
  - Show appropriate error messages
  - Integrate with react-hook-form
  - Maintain form state consistency

### 5.3 Unit Testing
- [ ] **Component tests**
  - OperatorSelector functionality
  - DynamicParameterForm rendering
  - Form validation logic
  - Error state handling

- [ ] **Integration tests**
  - Complete user flow
  - API interaction mocking
  - State management testing
  - Error scenario coverage

---

## Phase 6: Edge Cases & Polish

### 6.1 Edge Cases
- [ ] **Handle empty responses**
  - No operators available
  - No dynamic fields for operator
  - Invalid API responses

- [ ] **Network issues**
  - Retry mechanisms
  - Offline state handling
  - Timeout scenarios

### 6.2 Performance Considerations
- [ ] **Optimize API calls**
  - Debounce operator selection
  - Cache operator list
  - Prevent unnecessary re-renders

### 6.3 Accessibility
- [ ] **ARIA labels and roles**
  - Proper form labels
  - Loading announcements
  - Error announcements

---

## Implementation Notes

### Key Design Decisions
1. **Field Order**: Static fields → Operator selection → Dynamic fields
2. **State Management**: Only clear dynamic field values when operator changes (keep static fields)
3. **Error Handling**: Use `useToast` for API integration errors (not final payment errors)
4. **Mock Data**: Use fixed set of sample operators (not random generation) when `useMockData` is true
5. **Loading States**: Single loading state with skeleton for both form and dynamic fields
6. **Mandatory Selection**: If `product.categoryId` is present, operator selection is mandatory
7. **API Version**: Use `epsApiVersion: 2` for both operators and dynamic fields APIs
8. **Form Integration**: Pass operator selection and dynamic fields as additional parameters to existing Form component
9. **Field Validation**: Dynamic field validation happens in real-time (on change)
10. **Persistence**: Selected operator stored in context for navigation persistence
11. **API Error Handling**: If operators API fails, show error and prevent form submission
12. **Form Re-render**: Don't preserve previously entered values during form re-render
13. **Performance**: Minimize unnecessary API calls and re-renders

### Dependencies
- Existing Form component from tf-components/
- Existing Select component from components/
- react-hook-form integration
- BbpsContext state management
- useBbpsApi hook structure

### Testing Strategy
- Unit tests for each new component
- Integration tests for complete flow
- Error scenario testing
- Mock API response testing
- Accessibility testing

---

## Success Criteria
- [ ] User can select an operator from dropdown
- [ ] Dynamic fields render based on operator selection
- [ ] Form validation works with API-provided rules
- [ ] Form submission integrates with existing bill fetch logic
- [ ] Loading states provide clear feedback
- [ ] Error handling is comprehensive and user-friendly
- [ ] All tests pass and coverage is maintained