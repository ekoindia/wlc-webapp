import "@testing-library/jest-dom";
import mockRouter from "next-router-mock";

jest.mock("next/router", () => mockRouter);
// This is needed for mocking 'next/link':
jest.mock("next/dist/client/router", () => mockRouter);

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
