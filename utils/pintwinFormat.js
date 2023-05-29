export const createPintwinFormat = (val, pintwin_key, pintwin_index) => {
	try {
		console.log("pintwin 1", val, pintwin_key);
		const encoderIndices = `${val}`?.split("")?.map((it) => {
			it = pintwin_key.indexOf(it);
			return it;
		});
		return `${encoderIndices?.join("")}|${pintwin_index}`;
	} catch (err) {
		console.error("In PintwinFormat => ", err);
	}
};
