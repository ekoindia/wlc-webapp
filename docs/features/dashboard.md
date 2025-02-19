# Dashboard
The Dashboard module consists of two main sections: Business Dashboard and Onboarding Dashboard. Each section is built using multiple components for displaying key business metrics and onboarding statistics.

## Business Dashboard
[page-components/Admin/Dashboard/BusinessDashboard](/page-components/Admin/Dashboard/BusinessDashboard/BusinessDashboard.jsx)

Business Dashboard consists of 4 component:
- [Top Panel](/page-components/Admin/Dashboard/TopPanel.jsx)
    - Have the data of Active agents
- [Earning Overview](/page-components/Admin/Dashboard/BusinessDashboard/EarningOverview.jsx)
- [Success Rate](/page-components/Admin/Dashboard/BusinessDashboard/SuccessRate.jsx)
- [GTV-Wise Top Retailers](/page-components/Admin/Dashboard/BusinessDashboard/TopMerchants.jsx)

## Onboarding Dashboard
[page-components/Admin/Dashboard/OnboadingDashboard](/page-components/Admin/Dashboard/OnboardingDashboard/OnboardingDashboard.jsx)

Onboarding Dashboard consisites of 2 component:
- [Top Panel](/page-components/Admin/Dashboard/TopPanel.jsx)
    - Have the data of Onboarded Retailers and Onboarded Distributors
    -
- Onboarding Agents
    - Filters as per agents stage
    - Table based on the selected stage

## Dashboard Context
[page-components/Admin/Dashboard/DashboardContext.jsx](/page-components/Admin/Dashboard/DashboardContext.jsx)
- Use to cache data to avoid multiple API calls.

## DashboardDateFilter
[page-components/Admin/Dashboard/DashboardDateFilter.jsx](/page-components/Admin/Dashboard/DashboardDateFilter.jsx)
- Date filter on both BusinessDashboard and OnboardingDashboard having filters like `Today`, `Yesterday`, `Last 7 Days` & `Last 30 Days`

---