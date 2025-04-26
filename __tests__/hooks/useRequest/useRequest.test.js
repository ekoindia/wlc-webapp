import { useRequest } from "hooks";
import { renderHook } from "test-utils";

jest.mock("swr", () =>
	jest.fn(() => ({ data: null, error: null, mutate: jest.fn() }))
);

// jest.mock("helpers/apiHelper", () => ({
// 	fetcher: mockedFetcher,
// }));

describe("useRequest", () => {
	it("should return the expected data, error, and isLoading values", async () => {
		const testBaseUrl = "https://example.com/api/test";
		const { result } = renderHook(() =>
			useRequest({ baseUrl: testBaseUrl })
		);

		// result.current = {"controller": {}, "data": null, "error": null, "isLoading": undefined, "mutate": [Function mockConstructor]}
		expect(result.current).toEqual({
			controller: expect.any(AbortController),
			data: null,
			error: null,
			isLoading: undefined,
			mutate: expect.any(Function),
		});
	});
});

test.todo(
	"TODO: add proper test cases for useRequest in __tests__/hooks/useRequest/useRequest.test.js"
);
