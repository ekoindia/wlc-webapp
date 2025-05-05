import { usePagination } from "hooks";
import { renderHook } from "test-utils";

describe("usePagination", () => {
	it("returns false with no parameters", () => {
		const { result } = renderHook(() => usePagination());
		expect(result.current).toBeDefined();
		expect(result.current).toBe(false);
	});

	it("returns page numbers", () => {
		const { result } = renderHook(() =>
			usePagination({
				totalCount: 100,
				pageSize: 10,
				siblingCount: 1,
				currentPage: 1,
			})
		);
		expect(result.current).toBeDefined();
		expect(result.current).toBeInstanceOf(Array);
		expect(result.current.length).toBe(7);
		expect(result.current[0]).toBe(1);
		expect(result.current[1]).toBe(2);
		expect(result.current[2]).toBe(3);
		expect(result.current[3]).toBe(4);
		expect(result.current[4]).toBe(5);
		expect(result.current[5]).toBe("...");
		expect(result.current[6]).toBe(10);
	});
});

test.todo("TODO: add proper test cases for usePagination hook");
