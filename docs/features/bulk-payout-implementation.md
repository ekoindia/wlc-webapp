# Bulk IMPS Feature Documentation

## 1. Overview
The **Bulk IMPS** feature allows users to perform batch payout transactions. The entry point is a "Search Customer" interface. Depending on the search response (`response_type_id`), the system either triggers a verification flow, loads the existing transaction framework, or opens the new "Eloka's UI" for batch processing.

---

## 2. User Flow & Logic

### Step 1: Search Customer
* **Action:** User clicks "Bulk IMPS" option.
* **UI:** Display "Search Customer" screen.
* **Input:** User enters a `Customer Number`.
* **API Call:** Trigger Search Customer API.

### Step 2: Handle API Response
The system handles three specific `response_type_id` values:

| Response ID | Status | Action / Behavior |
| :--- | :--- | :--- |
| **308** | `NOT FOUND` | **1. Verification Flow:** Open **Customer Name Card**. Submit Name → Trigger OTP (payload: `customer_id`) → Verify OTP → **Re-trigger Search Customer**.<br>**2. Framework:** Copy transaction framework's existing configuration. |
| **309** | `CUSTOMER FOUND` | **UI Load:** Open **Eloka's UI** (contains Upload & History tabs). |
| **339** | `FOUND, NOT VERIFIED` | **1. Verification Flow:** Open **Customer Name Card**. Submit Name → Trigger OTP (payload: `customer_id`) → Verify OTP → **Re-trigger Search Customer**.<br>**2. Framework:** Copy transaction framework's existing configuration. |

---

## 3. Eloka's UI Specification (Triggered by ID 309)

This UI contains two main tabs: **Upload** and **Transaction History**.

### Current Implementation Status
The following components have been developed:
* **BulkPayout Component** (`page-components/products/bulk-payout/BulkPayout.tsx`)
    * Main container with BulkPayoutProvider context wrapper
    * Tab navigation between Upload and History views
    * Customer info display panel (reads `customer_id`, `customer_name`, `user_code` from URL query params)
* **Context Management** (`BulkPayoutContext`)
    * State management for active tab switching
    * Customer parameter storage
* **Component Structure**
    * `UploadRecipients` - File upload and submission interface (in development)
    * `BatchHistory` - Transaction history list with status tracking (in development)

### Tab 1: Upload
* **UI Elements:**
    * **Dropzone:** Area to drag-and-drop or select the batch upload file.
    * **PinTwin:** Security component to verify the user via PIN.
    * **Submit Button:** Triggers the transaction.
* **Workflow:**
    1.  User uploads file and enters PIN in PinTwin.
    2.  User clicks **Submit**.
    3.  System calls **Batch Payout Transaction API**.
* **API Logic:**
    * **Inputs:** Uploaded File + PinTwin Token/Value.
    * **Processing:**
        * Validate PinTwin.
        * Validate all rows in the file.
    * **Response:** Return `Total Count` and `Invalid Count`.

### Tab 2: Transaction History
* **UI Elements:**
    * List of batch transactions.
    * Pagination controls.
    * **Download Button:** Visible on every row *except* rows where status is "In-Progress".
* **Data Fetching:**
    * **Initial Load:** Call **Batch Transaction History API** (Generic API, supports pagination).
    * **Auto-Refresh:** Call **Batch Status Check API** every **5 seconds** (Timer-based) using `batch-id`.
* **Download Feature:**
    * Action: Clicking download triggers **Batch Status File Download API**.
    * Input: `batch-id`.
    * Output: Excel file containing details for each TID (Transaction ID) in the batch.

---

## 4. API Summary

| API Name | Input Parameters | Description |
| :--- | :--- | :--- |
| **Search Customer** | `Customer Number` | Returns `response_type_id` (308, 309, 339). |
| **Send OTP** | `customer_id` | Triggered upon submitting Customer Name card (Cases 308 & 339). |
| **Batch Payout Transaction** | `File`, `PinTwin` | Validates user and file rows; initiates batch payout. Returns counts. |
| **Batch Transaction History** | `Pagination params` | Retrieves list of past batch transactions. |
| **Batch Status File Download** | `batch-id` | Generates Excel with TID-level status for a specific batch. |
| **Batch Status Check** | `batch-id` | Polling API (5s interval) to update status of in-progress batches. |

---

## 5. Workflow Diagram (Mermaid)

```mermaid
flowchart TD
    Start([User Clicks Bulk IMPS]) --> SearchUI[Search Customer UI]
    SearchUI -->|Enter Number| SearchAPI[Call Search Customer API]
    
    SearchAPI -->|Response| Decision{Check response_type_id}
    
    %% Case 308: Not Found
    Decision -- 308: NOT FOUND --> NameCard308[Open Customer Name Card]
    NameCard308 --> SubmitName308[Submit Name]
    SubmitName308 --> OTP308[Trigger Send OTP\nPayload: customer_id]
    OTP308 --> VerifyOTP308[Verify OTP]
    VerifyOTP308 --> SearchAPI
    
    Decision -- 308 --> ExistingConfig308[Copy Existing Framework Config]
    
    %% Case 309: Found
    Decision -- 309: FOUND --> ElokaUI[Open Eloka's UI]
    
    %% Case 339: Found, Not Verified
    Decision -- 339: FOUND, NOT VERIFIED --> NameCard339[Open Customer Name Card]
    NameCard339 --> SubmitName339[Submit Name]
    SubmitName339 --> OTP339[Trigger Send OTP\nPayload: customer_id]
    OTP339 --> VerifyOTP339[Verify OTP]
    VerifyOTP339 --> SearchAPI
    
    Decision -- 339 --> ExistingConfig339[Copy Existing Framework Config]
    
    %% Eloka's UI Details
    subgraph ElokaUI_Container [Eloka's UI]
        direction TB
        Tab1[Tab: Upload]
        Tab2[Tab: Transaction History]
        
        %% Upload Tab Logic
        Tab1 --> Dropzone[File Dropzone]
        Tab1 --> PinTwin[PinTwin Verification]
        PinTwin --> SubmitBatch[Submit]
        SubmitBatch --> BatchPayoutAPI[Call Batch Payout Transaction API]
        BatchPayoutAPI --> Validate[Validate PinTwin & Rows]
        Validate --> ResponseBatch[Return Total & Invalid Count]
        
        %% History Tab Logic
        Tab2 --> HistoryAPI[Call Batch Transaction History API]
        HistoryAPI --> RenderList[Render List with Pagination]
        RenderList --> CheckStatus{Status In-Progress?}
        CheckStatus -- Yes --> PollStatus[Call Batch Status Check API\n(Every 5s)]
        PollStatus --> RenderList
        CheckStatus -- No --> ShowDownload[Show Download Button]
        ShowDownload --> DownloadAPI[Call Batch Status File Download API]
        DownloadAPI --> Excel[Return Excel File]
    end

    ElokaUI --> ElokaUI_Container

---

## 6. API Reference
For detailed API specifications, request/response structures, and implementation details, refer to:
**[Bulk Payout API Documentation](https://docs.google.com/document/d/1s9O81RN6V4DU2cuZYqdx2Et-CpGFl0LimyV3txq64vM/edit?tab=t.0)**

---

## 7. Current Development Structure

The Bulk Payout feature is organized under the following directory structure:

```
page-components/products/bulk-payout/
├── BulkPayout.tsx                    # Main container component with provider wrapper
├── index.ts                          # Module exports
├── components/
│   ├── BatchHistory.tsx              # Transaction history tab component
│   └── UploadRecipients.tsx          # File upload tab component
├── context/
│   ├── BulkPayoutContext.tsx         # Context provider and hooks
│   ├── reducer.ts                    # State reducer logic
│   └── types.ts                      # TypeScript type definitions
└── hooks/
    └── useBulkPayoutApi.ts           # API integration hook
                                      # Endpoints:
                                      # - /bulk-payout/process-records
                                      # - /bulk-payout/batch-list
                                      # - /bulk-payout/batch
                                      # - /bulk-payout/download

pages/products/bulk-payout/
└── index.tsx                         # Next.js page route

constants/
└── SidebarMenu.ts                    # Menu entry: /products/bulk-payout
```

### Component Overview
- **BulkPayout.tsx**: Main entry point with context provider, tab navigation, and customer info display
- **UploadRecipients.tsx**: Handles file dropzone, PinTwin verification, and batch submission
- **BatchHistory.tsx**: Displays transaction list with pagination, status polling, and download functionality
- **BulkPayoutContext**: Manages active tab state and customer parameters from URL query
- **useBulkPayoutApi**: Centralizes all API calls for batch operations

### Required Reusable Components & Hooks
The project already contains all necessary building blocks for the Bulk Payout feature. **Use these existing components/hooks instead of creating new ones:**

| Component/Hook | Location | Usage in Bulk Payout |
| :--- | :--- | :--- |
| **Dropzone** | `components/Dropzone` | Upload Tab: File upload for batch recipient CSV/Excel |
| **PinTwin** | `components/PinTwin` | Upload Tab: User PIN verification before batch submission |
| **useApiFetch** | `hooks/useApiFetch` | All API calls in `useBulkPayoutApi` hook |
| **Table** | `components/Table` | History Tab: Display batch transaction list |
| **Button** | `components/Button` | Submit button, download actions |

**Important:** All required components already exist in the project. Do not create new ones—reuse maximizes consistency and reduces maintenance overhead.