import { useSessionStorage } from "hooks";
import { renderHook } from "test-utils";

test("renders hook", () => {
	const { result } = renderHook(() => useSessionStorage());
	expect(result.current).toBeUndefined();
});
