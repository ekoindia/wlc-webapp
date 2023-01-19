import { renderHook } from "test-utils";
import { usePagination } from "hooks";

test("renders hook", () => {
	const { result } = renderHook(() => usePagination());
	expect(result.current).toBeUndefined();
});
