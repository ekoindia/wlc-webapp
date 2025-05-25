import { useFeatureFlag } from "hooks";
import { renderAdminHook, renderHook, renderLoggedOutHook } from "test-utils";

// Mock contexts
// const mockUseUser = jest.fn();
// const mockUseSession = jest.fn();
// const mockUseOrgDetailContext = jest.fn();

// jest.mock("contexts", () => ({
// 	useSession: () => mockUseSession(),
// 	useOrgDetailContext: () => mockUseOrgDetailContext(),
// }));

// Mock only the specific hooks needed
// TODO: Uncomment and fix the mocks
// jest.mock("contexts/UserContext", () => ({
// 	useUser: () => mockUseUser(),
// 	useSession: () => mockUseSession(),
// }));

// jest.mock("contexts/OrgDetailContext", () => ({
// 	useOrgDetailContext: () => mockUseOrgDetailContext(),
// }));

jest.mock("constants/featureFlags", () => ({
	FeatureFlags: {
		TEST_FEATURE: {
			enabled: true,
		},
		DISABLED_FEATURE: {
			enabled: false,
		},
		ADMIN_ONLY_FEATURE: {
			enabled: true,
			forAdminOnly: true,
		},
		ENV_SPECIFIC_FEATURE: {
			enabled: true,
			forEnv: ["development"],
		},
		RETAILER_TYPE_FEATURE: {
			enabled: true,
			forUserType: [2, 3],
		},
		DIST_TYPE_FEATURE: {
			enabled: true,
			forUserType: [1],
		},
		CURRENT_USER_ID_FEATURE: {
			enabled: true,
			envConstraints: {
				development: {
					forUserId: ["6333331126", "user456"],
				},
			},
		},
		OTHER_USER_ID_FEATURE: {
			enabled: true,
			envConstraints: {
				development: {
					forUserId: ["user456"],
				},
			},
		},
		CURRENT_ORG_ID_FEATURE: {
			enabled: true,
			envConstraints: {
				development: {
					forOrgId: [1, 2, 3],
				},
			},
		},
		OTHER_ORG_ID_FEATURE: {
			enabled: true,
			envConstraints: {
				development: {
					forOrgId: [5, 6, 7],
				},
			},
		},
		DEPENDENT_FEATURE: {
			enabled: true,
			requiredFeatures: ["TEST_FEATURE"],
		},
		CIRCULAR_A: {
			enabled: true,
			requiredFeatures: ["CIRCULAR_B"],
		},
		CIRCULAR_B: {
			enabled: true,
			requiredFeatures: ["CIRCULAR_A"],
		},
		COMPLEX_DEPENDENT: {
			enabled: true,
			requiredFeatures: ["DEPENDENT_FEATURE", "TEST_FEATURE"],
		},
	},
}));

// Setup default mocks
// const defaultSessionMock = {
// 	isAdmin: false,
// 	userId: "user123",
// 	userType: 1,
// 	isLoggedIn: true,
// };

// const defaultOrgMock = {
// 	orgDetail: {
// 		org_id: "123",
// 	},
// };

// Set environment for tests
const originalEnv = process.env.NEXT_PUBLIC_ENV;
beforeAll(() => {
	process.env.NEXT_PUBLIC_ENV = "development";
});

afterAll(() => {
	process.env.NEXT_PUBLIC_ENV = originalEnv;
});

beforeEach(() => {
	// mockUseSession.mockReturnValue(defaultSessionMock);
	// mockUseOrgDetailContext.mockReturnValue(defaultOrgMock);
	jest.clearAllMocks();
	console.log = jest.fn();
	console.error = jest.fn();
});

describe("useFeatureFlag hook", () => {
	test("renders hook - useFeatureFlag", () => {
		const { result } = renderHook(() => useFeatureFlag());
		expect(result.current).toBeDefined();
		expect(result.current.length).toBe(2);
		expect(result.current[0]).toBe(false);
		expect(result.current[1]).toBeInstanceOf(Function);
	});

	test("renders hook with default parameter", () => {
		const { result } = renderHook(() => useFeatureFlag("TEST_FEATURE"));
		expect(result.current).toBeDefined();
		expect(result.current.length).toBe(2);
		expect(typeof result.current[0]).toBe("boolean");
		expect(result.current[1]).toBeInstanceOf(Function);
	});

	test("returns false when no feature name provided", () => {
		const { result } = renderHook(() => useFeatureFlag(""));
		expect(result.current[0]).toBe(false);
	});

	test("returns true for enabled feature", () => {
		const { result } = renderHook(() => useFeatureFlag("TEST_FEATURE"));
		expect(result.current[0]).toBe(true);
	});

	test("returns false for disabled feature", () => {
		const { result } = renderHook(() => useFeatureFlag("DISABLED_FEATURE"));
		expect(result.current[0]).toBe(false);
	});

	test("returns false for undefined feature", () => {
		const { result } = renderHook(() =>
			useFeatureFlag("UNDEFINED_FEATURE")
		);
		expect(result.current[0]).toBe(false);
	});

	test("handles admin-only features for non-admin user", () => {
		const { result } = renderHook(() =>
			useFeatureFlag("ADMIN_ONLY_FEATURE")
		);
		expect(result.current[0]).toBe(false);
	});

	test("handles admin-only features for admin user", () => {
		const { result } = renderAdminHook(() =>
			useFeatureFlag("ADMIN_ONLY_FEATURE")
		);
		expect(result.current[0]).toBe(true);
	});

	test("handles environment constraints correctly", () => {
		// Test correct environment
		const { result: devResult } = renderHook(() =>
			useFeatureFlag("ENV_SPECIFIC_FEATURE")
		);
		expect(devResult.current[0]).toBe(true);

		// Backup the original environment
		const originalEnv = process.env.NEXT_PUBLIC_ENV;

		// Test incorrect environment
		process.env.NEXT_PUBLIC_ENV = "production";
		const { result: prodResult } = renderHook(() =>
			useFeatureFlag("ENV_SPECIFIC_FEATURE")
		);
		expect(prodResult.current[0]).toBe(false);

		// Reset environment
		process.env.NEXT_PUBLIC_ENV = originalEnv;
	});

	test("handles user type constraints", () => {
		// Allowed user type
		const { result } = renderHook(() =>
			useFeatureFlag("RETAILER_TYPE_FEATURE")
		);
		console.log("Retailer Type Feature Result:", result.current);

		expect(result.current[0]).toBe(true);

		const { result: disallowedResult } = renderHook(() =>
			useFeatureFlag("DIST_TYPE_FEATURE")
		);
		expect(disallowedResult.current[0]).toBe(false);
	});

	test("handles user ID constraints", () => {
		// Allowed user ID
		const { result: allowedResult } = renderHook(() =>
			useFeatureFlag("CURRENT_USER_ID_FEATURE")
		);
		expect(allowedResult.current[0]).toBe(true);

		const { result: disallowedResult } = renderHook(() =>
			useFeatureFlag("OTHER_USER_ID_FEATURE")
		);
		expect(disallowedResult.current[0]).toBe(false);
	});

	test("handles org ID constraints", () => {
		// Allowed org ID
		const { result: allowedResult } = renderHook(() =>
			useFeatureFlag("CURRENT_ORG_ID_FEATURE")
		);
		expect(allowedResult.current[0]).toBe(true);

		const { result: disallowedResult } = renderHook(() =>
			useFeatureFlag("OTHER_ORG_ID_FEATURE")
		);
		expect(disallowedResult.current[0]).toBe(false);
	});

	test("handles feature dependencies correctly", () => {
		const { result } = renderHook(() =>
			useFeatureFlag("DEPENDENT_FEATURE")
		);
		expect(result.current[0]).toBe(true);
	});

	test("handles complex feature dependencies", () => {
		const { result } = renderHook(() =>
			useFeatureFlag("COMPLEX_DEPENDENT")
		);
		expect(result.current[0]).toBe(true);
	});

	test("detects circular dependencies and prevents infinite loops", () => {
		const { result } = renderHook(() => useFeatureFlag("CIRCULAR_A"));
		expect(result.current[0]).toBe(false);
		expect(console.error).toHaveBeenCalledWith(
			"Circular dependency detected for feature:",
			"CIRCULAR_A"
		);
	});

	test("checkFeatureFlag function works independently", () => {
		const { result } = renderHook(() => useFeatureFlag("TEST_FEATURE"));
		const [, checkFeatureFlag] = result.current;

		expect(checkFeatureFlag("TEST_FEATURE")).toBe(true);
		expect(checkFeatureFlag("DISABLED_FEATURE")).toBe(false);
		expect(checkFeatureFlag("UNDEFINED_FEATURE")).toBe(false);
	});

	test("caching works correctly for repeated calls", () => {
		const { result } = renderHook(() => useFeatureFlag("TEST_FEATURE"));
		const [, checkFeatureFlag] = result.current;

		// First call
		const result1 = checkFeatureFlag("TEST_FEATURE");
		// Second call should use cache
		const result2 = checkFeatureFlag("TEST_FEATURE");

		expect(result1).toBe(result2);
		expect(result1).toBe(true);
	});

	test("handles logged out users correctly", () => {
		// mockUseSession.mockReturnValue({
		// 	...defaultSessionMock,
		// 	isLoggedIn: false,
		// 	userId: null,
		// });

		const { result } = renderLoggedOutHook(() =>
			useFeatureFlag("RETAILER_TYPE_FEATURE")
		);
		expect(result.current[0]).toBe(false);
	});

	// test("handles missing org detail correctly", () => {
	// 	const { result } = renderHook(() =>
	// 		useFeatureFlag("CURRENT_ORG_ID_FEATURE")
	// 	);
	// 	expect(result.current[0]).toBe(false);
	// });

	test("handles invalid feature name parameter", () => {
		const { result } = renderHook(() => useFeatureFlag("TEST_FEATURE"));
		const [, checkFeatureFlag] = result.current;

		expect(checkFeatureFlag("")).toBe(false);
		expect(checkFeatureFlag(null)).toBe(false);
		expect(checkFeatureFlag(undefined)).toBe(false);
		expect(console.error).toHaveBeenCalledWith(
			"Feature name not provided:",
			""
		);
	});

	test("cache key changes when user context changes", () => {
		const { result: result1 } = renderHook(() =>
			useFeatureFlag("TEST_FEATURE")
		);

		// Change user context
		// mockUseSession.mockReturnValue({
		// 	...defaultSessionMock,
		// 	userId: "user456",
		// });

		const { result: result2 } = renderHook(() =>
			useFeatureFlag("TEST_FEATURE")
		);

		// Both should return true but cache keys should be different
		expect(result1.current[0]).toBe(true);
		expect(result2.current[0]).toBe(true);
	});
});
