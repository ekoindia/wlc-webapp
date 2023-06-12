export const createPintwinFormat = (val, { pintwin_key, key_id }) => {
	try {
		console.log(
			"pintwin 1",
			val,
			`${val}`?.split(""),
			pintwin_key,
			`${pintwin_key}`?.split(""),
			key_id
		);
		let encodedKey = "";
		`${val}`?.split("")?.forEach((it) => {
			encodedKey = encodedKey + `${pintwin_key}`.split("")[it];
		});
		return `${encodedKey}|${key_id}`;
	} catch (err) {
		console.error("In PintwinFormat => ", err);
	}
};
