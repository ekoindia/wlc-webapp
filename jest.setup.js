import "@testing-library/jest-dom";

// Mock JSDOM Methods (https://jestjs.io/docs/manual-mocks#mocking-methods-which-are-not-implemented-in-jsdom)
Object.defineProperty(window, "matchMedia", {
	writable: true,
	value: jest.fn().mockImplementation((query) => ({
		matches: false,
		media: query,
		onchange: null,
		addListener: jest.fn(), // deprecated
		removeListener: jest.fn(), // deprecated
		addEventListener: jest.fn(),
		removeEventListener: jest.fn(),
		dispatchEvent: jest.fn(),
	})),
});

// Mock react-markdown
jest.mock("react-markdown", () => {
	return jest.fn(({ children, className }) => {
		return {
			$$typeof: Symbol.for("react.element"),
			type: "div",
			props: {
				className: className || "react-markdown-mock",
				dangerouslySetInnerHTML: { __html: children || "" },
				"data-testid": "react-markdown-mock",
			},
		};
	});
});

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

// Mock Chakra UI's useBreakpointValue hook
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

// Geolocation mock
const mockGeolocation = {
	getCurrentPosition: jest.fn((success) => {
		success({
			coords: {
				latitude: 27.01234,
				longitude: 38.01234,
				accuracy: 5,
			},
		});
	}),
	watchPosition: jest.fn((success) =>
		Promise.resolve(
			success({
				coords: {
					latitude: 27.01234,
					longitude: 38.01234,
					accuracy: 5,
				},
				timestamp: Date.now(),
			})
		)
	),
	clearWatch: jest.fn(),
};
Object.defineProperty(global.navigator, "geolocation", {
	value: mockGeolocation,
});

// Mock next/dynamic
// jest.mock("next/dynamic", () => ({
// 	__esModule: true,
// 	default: (importFunc) => {
// 		const Component = React.lazy(importFunc);
// 		Component.preload = importFunc;
// 		return Component;
// 	},
// }));

// Mock AbortSignal.any polyfill for testing
if (!AbortSignal.any) {
	AbortSignal.any = function (signals) {
		// Create a new AbortController
		const controller = new AbortController();

		// Set up listeners for all signals
		for (const signal of signals) {
			// If any signal is already aborted, abort the controller immediately
			if (signal.aborted) {
				controller.abort();
				break;
			}

			// Add listener to abort when any signal aborts
			signal.addEventListener("abort", () => controller.abort(), {
				once: true,
			});
		}

		return controller.signal;
	};
}

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
