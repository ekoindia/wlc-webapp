## AI Coding Agent Playbook (Focused, Actionable, Project-Specific)

### Operating Rules
1. State applied rule tags briefly (e.g. `rules: style, tests, feature-flags`).
2. When blocked, ask up to 3 yes/no clarifiers in one message; otherwise proceed.
3. Do not apologize or add filler; respond with facts or code.
4. Prefer execution (edits, tests, lint) over advisory text.

### Domain Snapshot
Multi-tenant white‑label fintech platform. Two personas: Admin (configure, price, brand, monitor) & Agent (transact, wallet, support). Config & feature exposure is heavily file‑driven under `constants/`.

### Architectural Spine
Layout shell: `layout-components/Layout/Layout.tsx` orchestrates Nav (`components/NavBar`), Sidebar (`components/SideBar`), Bottom bar (`components/BottomAppBar`). Pages in `pages/` delegate UI to `page-components/**`. Global state via React Contexts in `contexts/` (menus, commissions, pub/sub, feature flags). Low‑code transaction & form primitives live in `tf-components/`.

### Core Cross-Cutting Patterns
| Concern | Implementation Anchor |
| ------- | --------------------- |
| Feature Flags | `constants/featureFlags.ts` + `hooks/useFeatureFlag.tsx` (returns `[enabled, checkFlag]`) |
| Pub/Sub | `contexts/PubSubContext.js` + topics in `constants/PubSubTopics.ts` |
| Menus / Nav | `constants/SidebarMenu.ts`, `constants/profileCardMenus.js`, processed by `contexts/MenuContext.tsx` |
| Theming / Branding | `styles/themes.tsx`, `constants/colorThemes.js`, org theme loaded in `_app.tsx` |
| Android Bridge | `utils/AndroidUtils.ts` & usage in layout for WebView comms |
| Auth Tokens | SessionStorage keys: `access_token`, `refresh_token`, etc.; route guard in `components/RouteProtecter/` |

### Development Workflow (Concrete Commands)
Setup: `npm i && npm run prepare && chmod +x .husky/pre-commit`
Run (HTTP): `npm run dev` (3002) | HTTPS: `npm run dev.https` (3004) | Perf scan: `npm run scan` (3006)
Quality Gate (pre-commit): `npm run lint && npm test` (or quicker focus: `npm run test:quick path/to/test/file`)
Bundle analysis: `npm run analyze`.

### Coding Conventions (Enforced / Observed)
Functional React + TypeScript; prefer interfaces, `as const` objects over enums, explicit return types. Tabs for indentation, ternaries instead of `&&` chains, optional chaining `?.`, defaults via `??`. Favor custom `components/*` wrappers over raw Chakra primitives; import absolutely (`import X from 'components/X'`). Keep one responsibility per file; config, not conditionals, drives variation.

### Performance & UX
Use dynamic import for non-critical or rarely-hit admin subpages: `const Widget = dynamic(() => import('page-components/Admin/HeavyWidget'), { ssr: false })`. Guard re-renders: memo derived lists (menus, pricing slabs). Clean up effects (events, intervals, observers).

### Testing Pattern
Tests mirror source tree under `__tests__/`. Render helpers in `__tests__/test-utils/` provide `pageRender`, `adminRender`, `loggedOutPageRender`. For a pure component use `render`; for context-dependent UI choose the matching wrapper. Always add at least: renders smoke + one behavioral expectation (e.g. feature flag branch) when touching logic.

### Adding / Modifying Key Features
New Sidebar / Bottom bar item: update `constants/SidebarMenu.ts` (respect shape), ensure any new pub/sub topic is added to `constants/PubSubTopics.ts`. New pricing page: add slug + meta in `ProductBusinessConfigurations.ts`, generate UI under `page-components/Admin/PricingCommission/SlugName`, optionally select `template="fileupload"` for upload-driven flows. New feature flag: append to `featureFlags.ts` and gate UI with `const [enabled] = useFeatureFlag('FLAG_KEY')`.

### Data & Storage
Short-lived auth + org/user metadata live in SessionStorage (`user_detail`, `org_detail`, tokens). Avoid duplicating this state in React unless deriving computed values. Daily caching pattern: see `useDailyCacheState`.

### Android / Native Consideration
When adding functionality that must work inside the Android WebView wrapper, centralize bridge calls in `AndroidUtils.ts`; do not inline `window.Android...` references inside feature components.

### Safe Change Checklist
1. Update or add tests in mirrored `__tests__` path.
2. Run lint + tests; fix before committing.
3. For new config-driven feature, document key/value in related `constants/*` file JSDoc.
4. If adding heavy dependency, justify via comment near first import.
5. Keep instructions file updated only with proven patterns (avoid aspirational text).

### What NOT To Do
No enums, no class components, no untyped `any`, no direct DOM access unless via ref & cleanup, no duplicate config keys, no silent catch blocks (log or rethrow).

### Quick Example (Feature Flag Branch)
```tsx
const [isNewFlow] = useFeatureFlag('NEW_FLOW');
return isNewFlow ? <NewComponent /> : <LegacyComponent />;
```

### Minimal Test Example
```ts
it('shows new flow when flag active', () => {
  const { getByText } = pageRender(<Target />);
  expect(getByText('New Flow')).toBeInTheDocument();
});
```

---
Feedback welcome: identify unclear sections or missing high-leverage patterns to iterate.