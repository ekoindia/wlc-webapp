export const createPintwinFormat = (val, { pintwin_key, key_id }) => {
	try {
		console.log("pintwin 1", val, pintwin_key, key_id);
		const encoderIndices = `${val}`?.split("")?.map((it) => {
			it = pintwin_key.indexOf(it);
			return it;
		});
		return `${encoderIndices?.join("")}|${key_id}`;
	} catch (err) {
		console.error("In PintwinFormat => ", err);
	}
};
