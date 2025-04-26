import { useAppLink } from "hooks";
import { renderHook } from "test-utils";

test("renders hook", () => {
	const { result } = renderHook(() => useAppLink());
	expect(result.current).toBeDefined();
	expect(result.current.openUrl).toBeDefined();
	expect(result.current.router).toBeDefined();
});
