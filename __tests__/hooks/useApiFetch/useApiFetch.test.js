import { renderHook } from "test-utils";
import { useApiFetch } from "hooks";

test("renders hook", () => {
	const { result } = renderHook(() => useApiFetch());
	expect(result.current).toBeUndefined();
});
