# Bulk IMPS Feature Documentation

## 1. Overview
The **Bulk IMPS** feature allows users to perform batch payout transactions. The feature has two main tabs visible from the start: **Upload** and **History**. In the Upload tab, users search for a customer, and depending on the search response (`response_type_id`), the system either displays the bulk payout upload interface or uses the transaction framework's configuration-driven UI via `EkoConnectWidget`.

---

## 2. User Flow & Logic

### Initial View
* **Action:** User clicks "Bulk IMPS" option.
* **UI:** Two tabs are immediately visible:
    * **Upload Tab** - Contains "Search Customer" interface
    * **History Tab** - Shows "Bulk Payout Transaction History"

### Upload Tab: Search Customer Flow
* **Input:** User enters a `Customer Number` in the search field.
* **API Call:** Trigger Search Customer API.

### Handle API Response
The system handles three specific `response_type_id` values:

| Response ID | Status | Action / Behavior |
| :--- | :--- | :--- |
| **308** | `NOT FOUND` | **1. Verification Flow:** Open **Customer Name Card**. Submit Name → Trigger OTP (payload: `customer_id`) → Verify OTP → **Re-trigger Search Customer**.<br>**2. UI:** Use `EkoConnectWidget` component to render transaction framework's configuration-driven UI. |
| **309** | `CUSTOMER FOUND` | **UI:** Display bulk payout upload interface (Dropzone + PinTwin + Submit). |
| **339** | `FOUND, NOT VERIFIED` | **1. Verification Flow:** Open **Customer Name Card**. Submit Name → Trigger OTP (payload: `customer_id`) → Verify OTP → **Re-trigger Search Customer**.<br>**2. UI:** Use `EkoConnectWidget` component to render transaction framework's configuration-driven UI. |

---

## 3. Bulk IMPS UI Specification

The Bulk IMPS feature displays two tabs from the start: **Upload** and **History**.

### Current Implementation Status
The following components have been developed:
* **BulkPayout Component** (`page-components/products/bulk-payout/BulkPayout.tsx`)
    * Main container with BulkPayoutProvider context wrapper
    * Tab navigation between Upload and History views (visible from start)
    * Customer info display panel (reads `customer_id`, `customer_name`, `user_code` from URL query params)
* **Context Management** (`BulkPayoutContext`)
    * State management for active tab switching
    * Customer parameter storage
    * Search response handling
* **Component Structure**
    * `UploadRecipients` - Search Customer + conditional UI (bulk payout or EkoConnectWidget) (in development)
    * `BatchHistory` - Transaction history list with status tracking (in development)

### Tab 1: Upload
This tab contains the Search Customer interface and conditionally renders UI based on the search response.

#### Search Customer Section
* **UI Elements:**
    * Customer Number input field
    * Search button
* **Workflow:**
    1. User enters Customer Number and clicks Search
    2. System calls Search Customer API
    3. Based on `response_type_id`:
        * **309 (CUSTOMER FOUND):** Display bulk payout upload interface
        * **308 (NOT FOUND) or 339 (FOUND, NOT VERIFIED):** 
            * Trigger verification flow (Name Card → OTP → Re-search)
            * Use `EkoConnectWidget` to render transaction framework's configuration-driven UI

#### Bulk Payout Upload Interface (Response ID 309)
* **UI Elements:**
    * **Dropzone:** Area to drag-and-drop or select the batch upload file
    * **PinTwin:** Security component to verify the user via PIN
    * **Submit Button:** Triggers the transaction
* **Workflow:**
    1. User uploads file and enters PIN in PinTwin
    2. User clicks **Submit**
    3. System calls **Batch Payout Transaction API**
* **API Logic:**
    * **Inputs:** Uploaded File + PinTwin Token/Value
    * **Processing:**
        * Validate PinTwin
        * Validate all rows in the file
    * **Response:** Return `Total Count` and `Invalid Count`

#### Transaction Framework UI (Response ID 308, 339)
* **Component:** `EkoConnectWidget`
* **Purpose:** Renders configuration-driven UI from transaction framework
* **Data Source:** Uses existing transaction framework configuration for Bulk IMPS
* **Usage:** (See `TestPage.jsx` for live example)
```tsx
<EkoConnectWidget start_id={998} />
```
* **Props:**
    * `start_id` (string | number): The transaction ID to load. This is the entry point for the transaction flow.
    * `paths` (Array<string>, optional): List of sub-paths to navigate within the transaction flow.
    * `language` (string, optional): Language for localization (default: "en").
* **Key Features:**
    * Loads and manages transaction flows (requests & responses)
    * Handles caching of transaction metadata
    * Theme & localization support
    * Location capture integration
    * Toast notifications
    * Built-in raise query/ticket management
    * Shadow DOM rendering (isolated from host page CSS)
* **Reference:** See implementation in `page-components/TestPage/TestPage.jsx` → `EkoConnectWidgetTest` component

### Tab 2: History
This tab displays the Bulk Payout Transaction History, visible from the start.

* **UI Elements:**
    * List of batch transactions
    * Pagination controls
    * **Download Button:** Visible on every row *except* rows where status is "In-Progress"
* **Data Fetching:**
    * **Initial Load:** Call **Batch Transaction History API** (Generic API, supports pagination)
    * **Auto-Refresh:** Call **Batch Status Check API** every **5 seconds** (Timer-based) using `batch-id`
* **Download Feature:**
    * Action: Clicking download triggers **Batch Status File Download API**
    * Input: `batch-id`
    * Output: Excel file containing details for each TID (Transaction ID) in the batch

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
    Start([User Clicks Bulk IMPS]) --> TabView[Display Two Tabs]
    
    subgraph TabView_Container [Bulk IMPS Interface]
        direction TB
        UploadTab[Upload Tab]
        HistoryTab[History Tab]
    end
    
    TabView --> TabView_Container
    
    %% Upload Tab Flow
    UploadTab --> SearchUI[Search Customer Interface]
    SearchUI -->|Enter Customer Number| SearchAPI[Call Search Customer API]
    
    SearchAPI -->|Response| Decision{Check response_type_id}
    
    %% Case 308: Not Found
    Decision -- 308: NOT FOUND --> NameCard308[Open Customer Name Card]
    NameCard308 --> SubmitName308[Submit Name]
    SubmitName308 --> OTP308[Trigger Send OTP\nPayload: customer_id]
    OTP308 --> VerifyOTP308[Verify OTP]
    VerifyOTP308 --> SearchAPI
    
    Decision -- 308 --> EkoConnect308[Render EkoConnectWidget\nTransaction Framework UI]
    
    %% Case 309: Found
    Decision -- 309: FOUND --> BulkPayoutUI[Display Bulk Payout Upload UI]
    
    %% Case 339: Found, Not Verified
    Decision -- 339: FOUND, NOT VERIFIED --> NameCard339[Open Customer Name Card]
    NameCard339 --> SubmitName339[Submit Name]
    SubmitName339 --> OTP339[Trigger Send OTP\nPayload: customer_id]
    OTP339 --> VerifyOTP339[Verify OTP]
    VerifyOTP339 --> SearchAPI
    
    Decision -- 339 --> EkoConnect339[Render EkoConnectWidget\nTransaction Framework UI]
    
    %% Bulk Payout Upload UI (309)
    subgraph BulkPayoutUpload [Bulk Payout Upload Interface]
        direction TB
        Dropzone[File Dropzone]
        PinTwin[PinTwin Verification]
        SubmitBatch[Submit Button]
        
        Dropzone --> SubmitBatch
        PinTwin --> SubmitBatch
        SubmitBatch --> BatchPayoutAPI[Call Batch Payout Transaction API]
        BatchPayoutAPI --> Validate[Validate PinTwin & Rows]
        Validate --> ResponseBatch[Return Total & Invalid Count]
    end
    
    BulkPayoutUI --> BulkPayoutUpload
    
    %% History Tab Flow
    HistoryTab --> HistoryAPI[Call Batch Transaction History API]
    HistoryAPI --> RenderList[Render List with Pagination]
    RenderList --> CheckStatus{Status In-Progress?}
    CheckStatus -- Yes --> PollStatus[Call Batch Status Check API\n(Every 5s)]
    PollStatus --> RenderList
    CheckStatus -- No --> ShowDownload[Show Download Button]
    ShowDownload --> DownloadAPI[Call Batch Status File Download API]
    DownloadAPI --> Excel[Return Excel File]

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
│   ├── BatchHistory.tsx              # History tab: Bulk Payout Transaction History
│   └── UploadRecipients.tsx          # Upload tab: Search Customer + conditional UI
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
- **BulkPayout.tsx**: Main entry point with context provider and tab navigation (both tabs visible from start)
- **UploadRecipients.tsx**: Search Customer interface + conditional rendering:
    - Response 309: Bulk payout UI (Dropzone, PinTwin, Submit)
    - Response 308/339: EkoConnectWidget for transaction framework UI
- **BatchHistory.tsx**: Bulk Payout Transaction History with pagination, status polling, and download functionality
- **BulkPayoutContext**: Manages active tab state, customer parameters, and search response handling
- **useBulkPayoutApi**: Centralizes all API calls for batch operations

### Required Reusable Components & Hooks
The project already contains all necessary building blocks for the Bulk Payout feature. **Use these existing components/hooks instead of creating new ones:**

| Component/Hook | Location | Usage in Bulk Payout |
| :--- | :--- | :--- |
| **EkoConnectWidget** | `components/EkoConnectWidget` | Upload Tab: Render transaction framework UI (Response 308, 339) |
| **Dropzone** | `components/Dropzone` | Upload Tab: File upload for batch recipient CSV/Excel (Response 309) |
| **PinTwin** | `components/PinTwin` | Upload Tab: User PIN verification before batch submission (Response 309) |
| **useApiFetch** | `hooks/useApiFetch` | All API calls in `useBulkPayoutApi` hook |
| **Table** | `components/Table` | History Tab: Display batch transaction list |
| **Button** | `components/Button` | Submit button, download actions |
| **Input** | `components/Input` | Search Customer input field |

**Important:** All required components already exist in the project. Do not create new ones—reuse maximizes consistency and reduces maintenance overhead.