export const FrontendUrls = {
	transaction: (id) => {
		let url = "/transaction";
		if (Array.isArray(id)) {
			id.forEach((id) => (url += `/${id}`));
		} else url += `/${id}`;
		return url;
	},
};
