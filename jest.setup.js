import "@testing-library/jest-dom";

// Mock localStorage & sessionStorage
const localStorageMock = (() => {
	let store = {};
	return {
		getItem: (key) => store[key] || null,
		setItem: (key, value) => {
			store[key] = value.toString();
		},
		removeItem: (key) => {
			delete store[key];
		},
		clear: () => {
			store = {};
		},
	};
})();

Object.defineProperty(window, "localStorage", {
	value: localStorageMock,
});
Object.defineProperty(window, "sessionStorage", {
	value: localStorageMock,
});

// Mock next/router using next-router-mock
jest.mock("next/router", () => require("next-router-mock"));

// Mock next/dist/client/router (often needed for next/link)
// If next/link is used, ensure it's handled. next-router-mock might cover this,
// but explicitly mocking can prevent issues.
jest.mock("next/dist/client/router", () => require("next-router-mock"));

// Rule: Add mock for Chakra UI's useBreakpointValue hook
jest.mock("@chakra-ui/media-query", () => ({
	useBreakpointValue: jest.fn((values, options) => {
		// Return the base value or fallback value
		if (values && typeof values === "object" && "base" in values) {
			return values.base;
		} else if (options?.fallback) {
			return options.fallback;
		}
		return (
			values?.md ||
			values?.lg ||
			values?.sm ||
			values?.xs ||
			values?.xl ||
			values?.xxl ||
			""
		); // Default fallback
	}),
	useMediaQuery: jest.fn(() => [true]),
}));

beforeEach(() => {
	// ✅ Mock AbortSignal.timeout()
	global.AbortSignal = {
		...global.AbortSignal,
		timeout: jest.fn((ms) => {
			const controller = new AbortController();
			setTimeout(() => controller.abort(), ms);
			return controller.signal;
		}),
	};

	// ✅ Mock fetch() with abort support
	global.fetch = jest.fn((url, options = {}) => {
		return new Promise((resolve, reject) => {
			if (options.signal?.aborted) {
				return reject(new DOMException("Aborted", "AbortError"));
			}

			options.signal?.addEventListener("abort", () => {
				reject(new DOMException("Aborted", "AbortError"));
			});

			setTimeout(() => {
				resolve({
					ok: true,
					json: async () => ({ success: true }),
				});
			}, 100); // Simulate network delay
		});
	});
});

afterEach(() => {
	jest.restoreAllMocks();
});
