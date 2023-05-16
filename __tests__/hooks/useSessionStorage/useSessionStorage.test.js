import { useSessionStorage } from "hooks";
import { act, renderHook } from "test-utils";

test("useSessionStorage", () => {
	const { result } = renderHook(() =>
		useSessionStorage("value", "initialValue")
	);
	expect(result.current[0]).toBe("initialValue");

	act(() => {
		result.current[1]("newValue");
	});
	expect(result.current[0]).toBe("newValue");
});
