import { useEffect /*, useDebugValue */, useState } from "react";
import { numericHash } from "utils/hash";

/**
 * Get a random HSL color. If str us provided, it generates a constent hue
 * 	value as the hash of 'str'.
 * @param {string} [str] The string to generate hash to get the hue value.
 * @returns Object with the generated 'h', 's' & 'l' values
 */
const useHslColor = (str) => {
	const [hslColor, setColor] = useState({ h: 0, s: 0, l: 0 });

	useEffect(() => {
		let _h = undefined;

		if (str) {
			_h = numericHash(str) % 360;
		}

		setColor({
			h: (_h ?? 360 * Math.random()).toFixed(2),
			s: (25 + 70 * Math.random()).toFixed(2),
			l: (85 + 10 * Math.random()).toFixed(2),
		});
	}, [str]);

	// useDebugValue(`hsl(${hslColor.h},${hslColor.s},${hslColor.l})`);

	return hslColor;
};

export default useHslColor;
