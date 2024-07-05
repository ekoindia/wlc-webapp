import { TouchEvent, useRef } from "react";

const minSwipeDistance = 50;
const maxSwipeTime = 500;

interface SwipeInput {
	onSwipedLeft?: () => void;
	onSwipedRight?: () => void;
	onSwipedUp?: () => void;
	onSwipedDown?: () => void;
}

interface SwipeOutput {
	onTouchStart: (_e: TouchEvent) => void;
	onTouchMove: (_e: TouchEvent) => void;
	onTouchEnd: () => void;
}

/**
 * Custom hook to detect swipe gestures.
 * @param {SwipeInput} input - Object containing swipe handlers.
 * @param {() => void} [input.onSwipedLeft] - Callback for left swipe.
 * @param {() => void} [input.onSwipedRight] - Callback for right swipe.
 * @param {() => void} [input.onSwipedUp] - Callback for upward swipe.
 * @param {() => void} [input.onSwipedDown] - Callback for downward swipe.
 * @returns {SwipeOutput} Object containing touch event handlers.
 */
const useSwipe = (input: SwipeInput): SwipeOutput => {
	const touchStartX = useRef(0);
	const touchEndX = useRef(0);
	const touchStartY = useRef(0);
	const touchEndY = useRef(0);
	const startTime = useRef(0);

	const onTouchStart = (e: TouchEvent) => {
		touchEndX.current = 0;
		touchStartX.current = e.targetTouches[0].clientX;
		touchEndY.current = 0;
		touchStartY.current = e.targetTouches[0].clientY;
		startTime.current = new Date().getTime();
	};

	const onTouchMove = (e: TouchEvent) => {
		touchEndX.current = e.targetTouches[0].clientX;
		touchEndY.current = e.targetTouches[0].clientY;
	};

	const onTouchEnd = () => {
		const deltaX = touchStartX.current - touchEndX.current;
		const deltaY = touchStartY.current - touchEndY.current;
		const elapsedTime = new Date().getTime() - startTime.current;

		if (elapsedTime > maxSwipeTime) return; // Ignore if gesture takes too long

		const isLeftSwipe = deltaX > minSwipeDistance;
		const isRightSwipe = deltaX < -minSwipeDistance;
		const isUpSwipe = deltaY > minSwipeDistance;
		const isDownSwipe = deltaY < -minSwipeDistance;

		if (isLeftSwipe && input.onSwipedLeft) input.onSwipedLeft();
		if (isRightSwipe && input.onSwipedRight) input.onSwipedRight();
		if (isUpSwipe && input.onSwipedUp) input.onSwipedUp();
		if (isDownSwipe && input.onSwipedDown) input.onSwipedDown();
	};

	return {
		onTouchStart,
		onTouchMove,
		onTouchEnd,
	};
};

export default useSwipe;
