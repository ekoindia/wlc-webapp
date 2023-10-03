/**
 * Object mapping error types to their corresponding error messages.
 */
const errorTypeMessages = {
	required: "Required",
	pattern: "Please enter the correct value",
	maxLength: "Length exceeds",
	minLength: "Insufficient Characters",
	email: "Please enter a valid email address",
	url: "Please enter a valid URL",
	min: "Please enter a higher value",
	max: "Please enter a lower value",
};

/**
 * Get the appropriate error message for a form field based on its name and errors object.
 */
export const getFormErrorMessage = (name, errors) => {
	//TODO add provision for custom messages
	const errorType = errors[name]?.type;

	return errorTypeMessages[errorType] || "";
};
