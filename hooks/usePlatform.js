import { useEffect, useState } from "react";

const usePlatform = () => {
	const [platform, setPlatform] = useState("");
	const [isMac, setIsMac] = useState(false);

	useEffect(() => {
		const userAgent = window?.navigator?.userAgent?.toLowerCase();
		if (!userAgent) {
			setPlatform("Unknown");
			return;
		}
		if (userAgent.indexOf("mac") !== -1) {
			setPlatform("Mac");
			setIsMac(true);
		} else if (userAgent.indexOf("android") !== -1) {
			setPlatform("Android");
		} else if (userAgent.indexOf("iphone") !== -1) {
			setPlatform("iPhone");
		} else if (userAgent.indexOf("win") !== -1) {
			setPlatform("Windows");
		} else {
			setPlatform("Unknown"); // for other platforms not being considered
		}
	}, []);

	return { platform, isMac };
};

export default usePlatform;
