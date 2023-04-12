/*
import { UserProvider } from "contexts/UserContext";
import { useRequest } from "hooks/useRequest";
import { renderHook } from "test-utils";
import { MockUser } from "test-utils.mocks";

// const mockedFetcher = jest.fn(() =>
// 	Promise.resolve({
// 		data: {
// 			name: "John Doe",
// 			age: 30,
// 		},
// 	})
// );

jest.mock("swr", () =>
	jest.fn(() => ({ data: null, error: null, mutate: jest.fn() }))
);

// jest.mock("helpers/apiHelper", () => ({
// 	fetcher: mockedFetcher,
// }));

describe("useRequest", () => {
	it("should return the expected data, error, and isLoading values", async () => {
		const testData = { id: 1, name: "test" };
		const testBaseUrl = "https://example.com/api/test";
		const { result, waitForNextUpdate } = renderHook(
			() => useRequest({ baseUrl: testBaseUrl }),
			{
				wrapper: ({ children }) => (
					<UserProvider userMockData={MockUser}>
						{children}
					</UserProvider>
				),
			}
		);

		expect(result.current.isLoading).toBe(true);
		expect(result.current.data).toBe(null);
		expect(result.current.error).toBe(null);

		await waitForNextUpdate();

		expect(result.current.isLoading).toBe(false);
		expect(result.current.data).toEqual(testData);
		expect(result.current.error).toBe(null);
	});
});
*/

test.todo(
	"TODO: add proper test cases for useRequest in __tests__/hooks/useRequest/useRequest.test.js"
);
