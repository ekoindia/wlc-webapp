import { renderHook } from "test-utils";
import { useNavigationLists } from "hooks";

test("renders hook", () => {
	const { result } = renderHook(() => useNavigationLists());
	expect(result.current).toBeUndefined();
});
