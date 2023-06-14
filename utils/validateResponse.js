export const validateResp = (resp) => {
	if (resp.response_status_id === 0) {
		return true;
	} else {
		return false;
	}
};
