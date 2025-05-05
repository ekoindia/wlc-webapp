import { useSwipe } from "hooks";
import { renderHook } from "test-utils";

test("renders hook", () => {
	const { result } = renderHook(() => useSwipe());
	expect(result.current).toEqual({
		onTouchEnd: expect.any(Function),
		onTouchMove: expect.any(Function),
		onTouchStart: expect.any(Function),
	});
	// result.current = {"onTouchEnd": [Function onTouchEnd], "onTouchMove": [Function onTouchMove], "onTouchStart": [Function onTouchStart]}
});
