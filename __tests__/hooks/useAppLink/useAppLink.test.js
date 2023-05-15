import { useAppLink } from "hooks";
import { renderHook } from "test-utils";

test("renders hook", () => {
	const { result } = renderHook(() => useAppLink());
	expect(result.current).toBeUndefined();
});
