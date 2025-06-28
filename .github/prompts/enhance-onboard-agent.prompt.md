### **Feature Enhancement: Role-Based UI for Agent Onboarding**

**1. Objective**

To enhance the agent onboarding user interface to dynamically adapt based on the logged-in user's role and permissions. The implementation should be driven by a structured configuration map to ensure scalability and maintainability, without requiring any changes to existing APIs.

**2. Core Requirements: User Permissions & Onboarding Capabilities**

The UI must enforce the following business rules based on the user's role:

| Login User Role | Identifier | Can Onboard Distributor? | Can Onboard Retailer? |
| :---- | :---- | ----- | ----- |
| Admin | isAdmin \= true | Yes | Yes |
| Super-Distributor | usertype \= 7 | Yes | Yes |
| Distributor | usertype \= 1 | No | Yes |
| Field Executive | usertype \= 4 | No | Yes |

**3. Proposed Architecture: Configuration-Driven UI**

To avoid hard-coding if/else logic, we will implement a centralized permissions map (similar to a finite-state machine configuration) in the front-end code. This map will define the capabilities for each user role.

**Example Permissions Map:**

```JavaScript

const ONBOARDING_PERMISSIONS = {  
  ADMIN: {  
    key: 'admin', // Corresponds to isAdmin = true  
    allowedAgentTypes: [1, 2], // 1 = Distributor, 2 = Retailer
  },  
  SUPER_DISTRIBUTOR: {  
    key: 7, // Corresponds to usertype = 7  
    allowedAgentTypes: [1, 2], // 1 = Distributor, 2 = Retailer
  },  
  DISTRIBUTOR: {  
    key: 1, // Corresponds to usertype = 1  
    allowedAgentTypes: [2], // 2 = Retailer only
    autoMapDistributor: true
  },  
  FIELD_EXECUTIVE: {  
    key: 4, // Corresponds to usertype = 4  
    allowedAgentTypes: [2], // 2 = Retailer only
    autoMapDistributor: false
  }  
};
```

This configuration will be the single source of truth for all UI decisions outlined below.

**4. Detailed UI/UX Flow Changes**

**4.1. Page Routing**
    - Already handled, no need to do anything.

**4.2. Dynamic Form Controls**

* **"Select Agent Type" Field Visibility:**  
  * This Radio Input field should **only be visible** if the logged-in user is permitted to onboard more than one type of agent (i.e., allowedAgentTypes.length > 1 in the permissions map).  
  * For **Distributors** and **Field Executives**, this field should be hidden, as they can only onboard Retailers.  
* **"Distributor's Number" Field Visibility:**  
  * This input field should be hidden if the `autoMapDistributor` property  is true. The form should not ask for this information.

**4.3. onboardViaFile Tab Behavior**

* Within the bulk upload feature (onboardViaFile tab), the Download Sample button's behavior must be conditional:  
  * **If** `autoMapDistributor` is true: The button must trigger a download using the `SAMPLE_DOWNLOAD_LINK.DISTRIBUTOR` constant.  
  * **Else**: The button should retain its default behavior.
* Input labels like "Upload the List of *Retailers* to Onboard" or "Download Sample File (for Onboarding *Retailers*)" should reflect the selected agent type.

**5. Scope & Constraints**

* **UI-Only Changes:** This task is strictly limited to front-end (UI) modifications.  
* **No API Changes:** Do not make any changes to the API calls.

**6. Acceptance Criteria**

* **Given** I am logged in as an **Admin** (isAdmin = true):  
  * **When** I navigate to the onboarding section.  
  * **Then** I should land on the /onboard-agents page.  
  * **And** I must see the "Select Agent Type" Radio Inputs  with both "Distributor" and "Retailer" options.  
* **Given** I am logged in as a **Super-Distributor** (usertype = 7):  
  * **When** I navigate to the onboarding section.  
  * **Then** I should land on the /onboard page.  
  * **And** I must see the "Select Agent Type" Radio Inputs with both "Distributor" and "Retailer" options.  
* **Given** I am logged in as a **Distributor** (usertype = 1):  
  * **When** I navigate to the onboarding section.  
  * **Then** I should land on the /onboard page.  
  * **And** the "Select Agent Type" Radio Inputs must not be visible. The form should be implicitly set for "Retailer" onboarding.  
* **Given** the `autoMapDistributor` property is true for my session:  
  * **When** I am on the onboarding form.  
  * **Then** the input field for "Distributor's Number" must be hidden.  
  * **And** in the onboardViaFile tab, the "Download Sample" link must point to `SAMPLE_DOWNLOAD_LINK.DISTRIBUTOR`.