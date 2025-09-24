import { useEffect, useState } from "react";
import { str2Hue } from "utils";

/**
 * Get a random HSL color. If str us provided, it generates a constent hue
 * 	value as the hash of 'str'.
 * Where hooks can not be used, use str2Hue() function from `utils`.
 * @param {string} [str] The string to generate hash to get the hue value.
 * @returns Object with the generated 'h', 's' & 'l' values
 */
const useHslColor = (str) => {
	const [hslColor, setColor] = useState({ h: 0, s: 0, l: 0 });

	useEffect(() => {
		let _h = str2Hue(str);

		setColor({
			h: _h,
			s: (25 + 70 * Math.random()).toFixed(2),
			l: (85 + 10 * Math.random()).toFixed(2),
		});
	}, [str]);

	return hslColor;
};

export default useHslColor;
