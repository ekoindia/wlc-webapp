# Coding Style Guide

## Prime Directives
- **ALWAYS** follow the rules in this file; if a suggestion would violate any rule, **do not generate it**.
- Prefer **clarity, safety, and performance** over cleverness.
- Use SOLID principles and functional programming patterns.
- If multiple rules appear to conflict, obey them in the following order:
  1. Security & data-integrity
  2. Type-safety
  3. Accessibility & UX
  4. Performance
  5. Formatting & stylistic niceties


## Project Context
- **Tech stack**: Next.js 14 / React 18, TypeScript `strict mode`, Chakra UI.
- **UI**: Use custom components in `/components` **before** reaching for Chakra UI.


## Formatting & Linting
- Enforced by Prettier (printWidth = 80, semi, useTabs, tabWidth = 4, endOfLine = lf).
- Use tabs for indentation.


## TypeScript Best Practices
- Use `explicit types` for all variables, parameters, function returns, and component props
- Prefer `interfaces` over types for object definitions and component props
- Use `type` for unions, intersections, or when working with primitives and tuples.
- Apply `readonly` modifier for immutable properties and arrays
- Use `type narrowing` over type casting when possible
- Define `constant objects` with `as const` assertion instead of enums
- Always include `explicit return types` on functions and components

```typescript
// Good
interface UserProps {
  readonly id: string;
  name: string;
  role?: "admin" | "user";
}

const fetchUser = async (id: string): Promise<UserProps> => {
  // implementation
};

// Bad
const fetchUser = async (id) => {
  // implementation
};
```

## React Patterns
- Write `functional components` with hooks instead of class components
- Wrap callbacks with `useCallback` to prevent unnecessary re-renders
- Use `useMemo` for expensive calculations
- Include proper `dependency arrays` in hooks
- Extract reusable logic into `custom hooks`
- Keep components `small and focused` on a single responsibility
- Implement `controlled components` for form inputs
- Apply `error boundaries` for graceful error handling

```typescript
// Good
const UserProfile: React.FC<UserProps> = ({ id, onUpdate }) => {
  const { data, isLoading } = useUserData(id);
  const handleUpdate = useCallback(() => {
    onUpdate(id);
  }, [id, onUpdate]);

  return isLoading ? <Loader /> : <ProfileView data={data} onUpdate={handleUpdate} />;
};

// Bad
const UserProfile = (props) => {
  const [data, setData] = useState();

  useEffect(() => {
    fetchData(props.id).then(setData);
  }, []); // Missing dependency

  // Implementation...
};
```

## Coding Style
- Write `concise, self-explanatory` code
- Prefer `functional and declarative patterns` over imperative; avoid OOP and classes
- Create `modular and reusable functions` to minimize duplication
- Use `descriptive, semantic naming` for variables and functions (e.g., `isLoading`, `hasError`)
- Apply `destructuring` for objects and arrays
- For conditional rendering, prefer `ternary operators` over `&&` and `||`
  ```typescript
  // Good
  {isLoading ? <Loader /> : <Content data={data} />}

  // Bad
  {isLoading && <Loader />}
  {!isLoading && <Content data={data} />}
  ```
- Always use **optional chaining** (`?.`) for object properties to avoid null/undefined errors
- Apply **nullish coalescing** (`??`) for default values instead of logical OR (`||`)
  ```typescript
  // Good
  const username = user?.name ?? "Guest";

  // Bad
  const username = user && user.name ? user.name : "Guest";
  ```
- Keep files small and focused on a single responsibility
- Use `template literals` for strings with variables
- Use `tabs` for indentation consistently across all files
- Create `constants` for magic values and place at file top

## State Management

- Keep state as **local as possible** to components
- Perform **immutable state updates** (with spread operators, map/filter/reduce)
- Split complex state into **multiple simpler states**
- Use **useReducer** for complex state logic
- Avoid state duplication across components

```typescript
// Good
const [isOpen, setIsOpen] = useState(false);
const [users, setUsers] = useState<User[]>([]);

const addUser = useCallback((newUser: User) => {
  setUsers(prevUsers => [...prevUsers, newUser]);
}, []);

// Bad
const [state, setState] = useState({ isOpen: false, users: [] });

const addUser = (newUser) => {
  state.users.push(newUser); // Mutating state directly
  setState({ ...state });
};
```

## Performance Optimization

- Use **React.memo** for components that render often with the same props
- Implement **virtualization** for long lists (react-window, react-virtualized)
- Apply **lazy loading** for code splitting
  ```typescript
  const HeavyComponent = dynamic(() => import('components/HeavyComponent'), {
    ssr: false
  });
  ```
- Properly **cleanup** event listeners, intervals, and effects
- Avoid unnecessary renders with **proper dependency arrays**

## Error Handling

- Implement consistent error handling patterns
- Use try/catch for async operations
- Provide meaningful error messages
- Add fallback UIs with error boundaries

```typescript
try {
  await api.saveData(formData);
} catch (error) {
  setError(error instanceof ApiError ? error.message : "An unknown error occurred");
}
```

## Code Comments

- Use JSDoc format for documenting functions, especially with complex parameters
- Focus comments on "why" not "what" for non-trivial logic
- Keep comments updated when code changes

```typescript
/**
 * Calculates the commission for a transaction
 * @param {number} amount - Transaction amount
 * @param {string} productId - Product identifier
 * @param {boolean} [isPromotion=false] - Whether promotion rates apply
 * @returns {number} - Calculated commission amount
 */
const calculateCommission = (amount: number, productId: string, isPromotion = false): number => {
  // Implementation
};
```
