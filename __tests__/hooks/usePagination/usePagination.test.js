import { usePagination } from "hooks";
import { renderHook } from "test-utils";

test("renders hook", () => {
	const { result } = renderHook(() => usePagination({}));
	expect(result.current).toBeUndefined();
});

test.todo("TODO: add proper test cases for usePagination hook");
