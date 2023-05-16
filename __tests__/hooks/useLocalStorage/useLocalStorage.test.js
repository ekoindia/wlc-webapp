import { useLocalStorage } from "hooks";
import { act, renderHook } from "test-utils";

test("useLocalStorage", () => {
	const { result } = renderHook(() =>
		useLocalStorage("value", "initialValue")
	);
	expect(result.current[0]).toBe("initialValue");

	act(() => {
		result.current[1]("newValue");
	});
	expect(result.current[0]).toBe("newValue");
});
