/* eslint-disable  no-unused-vars */

/**
 * Constants used in Transaction Framework.
 * Make sure the IDs are in sync with INTERACTION-FRAMEWORK database.
 * The following constants are used in the following places:
 * - ParamType: Parameter types to parameter_type_id mapping.
 * - ParamMeta: Metadata for the parameter types.
 * - DisplayMedia: Mapping of media_type_ids.
 */

/**
 * Parameter types to parameter_type_id mapping.
 * Make sure the IDs are in sync with INTERACTION-FRAMEWORK database.
 */
export enum ParamType {
	FIXED = 1,
	PINTWIN = 2,
	LIST = 3,
	RESPONSE_PROFILE_STUB = 4,
	RESPONSE_PARAMETER_GROUP = 5,
	UNIQUE_ID = 6,
	USER_IDENTIFIER = 7, // Represents user-id / initiator-id / logged-in user's cellnumber, etc
	FILE = 8,
	MONEY = 9,
	MONEY_ABSOLUTE = 10,
	NUMERIC = 11,
	TEXT = 12,
	FLOATING_POINT = 13,
	DATETIME = 14,
	MOBILE = 15,
	FROM_DATE = 16,
	TO_DATE = 17,
	BOOLEAN = 18,
	OTP = 19,
	LABEL = 20, // Show some text information without requiring any user-input
	MARKDOWN = 21, // Renders text in MarkDown (MD) format (for LABEL type fields; not for user input)
	EMAIL = 22,
	USER_AUTH_TYPE_PINTWIN = 23, // 0 = Old Paper Booklet User or, 1 = PinTwin App User [Update Global Setting if this param changes]
	GEOLOCATION = 24, // Comma separated location values: <latitude>,<longitude>,<accuracy>
	HTMLEMBED = 25,
	RECHARGE_PLAN_WIDGET = 26, // Show Mobile prepaid plan selector. Pass operator code in 'value'
	USER_PROFILE_PARAMETER = 27, // A hidden field that loads/receives a user login detail property. Name of the user login detail goes in the 'metadata' of the parameter or is the same as parameter name
	QRCODE = 28,
	FINGERPRINT = 29, // Scan fingerprint
	IMAGE = 30, // An image to show in request/response card ("value"=absolute image URL)
	LINK = 31, // A link to an external website/resource. The "value" field conatins the link
	MAP = 32, // Show a map
	API_TEXT = 33, // Non-editable field whose value is fetched by an API call
	MAP_CURRENT_LOCATION = 34, // Ask user to select the location within the detected current location accuracy radius
	YOUTUBE_VIDEO = 35, // The "value" field should contain the youtube video Id to show.
	MEDIA_LIST = 36, // A comma-separated list of images (URL) & videos (youtube video id) (in the "value" field)
	NAVIGATION_LINK = 37, // Link to open Map Navigation from current user location to provided location
	IFSC_SEARCH = 38, // Widget to search IFSC codes for bank branches
	UIDAI_DEVICE_SETUP_HELP = 39, // Widget to show installation instructions for UIDAI Fingerprint device RDService drivers
	FAQ_LIST = 40, // A comma separated list of FAQ with question and answer
	CALCULATED = 41, // Response parameter value calculated from the expression stored in the 'type_metadata' field
	STATUS_LABEL = 42, // Text shown with status color configured in metadata {"success":"successvalue","failed":"failedvalue","wait":"pendingvalue"}
	REQ_LIST = 51, //Request List. TODO: Fix or Remove this type.
	PARAM_SEPARATOR = 99, // A dummy parameter that acts as a SEPARATOR or GROUP for the parameters that follow. Type is described in 'metadata' as in table 'parameter_separator_types_master'
}

type ParamMetaType = {
	[key in ParamType]: {
		lbl: string;
		focusable: boolean;
		editable: boolean;
		interactable: boolean;
		validatable: boolean;
		numeric: boolean;
		text_input: boolean;
		submit: boolean;
		value_prefilled?: boolean;
		visible: boolean;
		auto_chain: boolean;
		no_persist?: boolean;
		inputmode?: string;
		pattern?: string;
		pattern_keypress?: string;
		length_min?: number;
		length_max?: number;
		pintwin_input?: boolean;
		copy?: boolean;
		pattern_format?: string;
	};
};

/**
 * Metadata for the parameter types:
 * - focusable: Can it be auto-focused when user presses Enter to goto next field?
 * - editable: Can user edit the input field in the input forms?
 * - interactable: Can the user interact with this element?
 * - validatable: Does this parameter need to be validated before submitting to server?
 * - numeric: Is the parameter numeric?
 * - text_input: Can the user type text into this field?
 * - pintwin_input: Is it a PinTwin field?
 * - inputmode: Default keyboard input mode (tel, numeric, etc).
 * - pattern: Default validation pattern.
 * - pattern_keypress: Default keypress validation pattern.
 * - length_min: Default min length.
 * - length_max: Default max length.
 * - submit: Can this field be submitted to the server?
 * - value_prefilled: Is the value already provided? Eg: label, image, link, etc.
 * - visible: Is it visible to the user?
 * - copy: Show a UI to easily copy value for this parameter type.
 * - auto_chain: Should this parameter be automatically chained when all params are chained?
 * - no_persist: For secure field types, delete user data from memory/form after it has been submitted to the server.
 */
export const ParamMeta: ParamMetaType = {
	[ParamType.FIXED]: {
		lbl: "FIXED",
		focusable: false,
		editable: false,
		interactable: false,
		validatable: false,
		numeric: false,
		text_input: false,
		submit: true,
		value_prefilled: true,
		visible: false,
		auto_chain: true,
	},

	[ParamType.PINTWIN]: {
		lbl: "PINTWIN",
		focusable: true,
		editable: true,
		interactable: true,
		validatable: true,
		numeric: true,
		text_input: false,
		pintwin_input: true,
		inputmode: "tel",
		submit: true,
		pattern: "^(?!([0-9])\\1+$)[0-9]{4}(?:\\|[0-9]{0,5})?$",
		pattern_keypress: "^[0-9]{0,4}$",
		length_min: 4,
		length_max: 4,
		visible: true,
		auto_chain: false,
		no_persist: true,
	},

	[ParamType.LIST]: {
		lbl: "LIST",
		focusable: true,
		editable: true,
		interactable: true,
		validatable: true,
		numeric: false,
		text_input: false,
		submit: true,
		visible: true,
		auto_chain: true,
	},

	[ParamType.RESPONSE_PROFILE_STUB]: {
		lbl: "RESPONSE_PROFILE_STUB",
		focusable: false,
		editable: false,
		interactable: true,
		validatable: false,
		numeric: false,
		text_input: false,
		submit: false,
		visible: true,
		auto_chain: false,
	},

	[ParamType.RESPONSE_PARAMETER_GROUP]: {
		lbl: "RESPONSE_PARAMETER_GROUP",
		focusable: true,
		editable: false,
		interactable: true,
		validatable: false,
		numeric: false,
		text_input: false,
		submit: false,
		visible: true,
		auto_chain: false,
	},

	[ParamType.UNIQUE_ID]: {
		lbl: "UNIQUE_ID",
		focusable: false,
		editable: false,
		interactable: false,
		validatable: false,
		numeric: false,
		text_input: false,
		submit: true,
		visible: false,
		auto_chain: false,
	},

	[ParamType.USER_IDENTIFIER]: {
		lbl: "USER_IDENTIFIER",
		focusable: false,
		editable: false,
		interactable: false,
		validatable: false,
		numeric: false,
		text_input: false,
		submit: true,
		visible: false,
		auto_chain: false,
	},

	[ParamType.FILE]: {
		lbl: "FILE",
		focusable: true,
		editable: true,
		interactable: true,
		validatable: true,
		numeric: false,
		text_input: false,
		submit: true,
		visible: true,
		auto_chain: true,
	},

	[ParamType.MONEY]: {
		lbl: "MONEY",
		focusable: true,
		editable: true,
		interactable: true,
		validatable: true,
		numeric: true,
		text_input: true,
		inputmode: "numeric",
		submit: true,
		pattern: "^[0-9]+(?:.[0-9]{1,2})?$",
		pattern_keypress: "^(?:[0-9]*|[0-9]+(?:.[0-9]{1,2})?)$",
		length_max: 15,
		copy: true,
		visible: true,
		auto_chain: true,
	},

	[ParamType.MONEY_ABSOLUTE]: {
		lbl: "MONEY_ABSOLUTE",
		focusable: true,
		editable: true,
		interactable: true,
		validatable: true,
		numeric: true,
		text_input: true,
		inputmode: "tel",
		submit: true,
		pattern: "^[1-9][0-9]*$",
		pattern_keypress: "^(?:[1-9]?[0-9]*)$",
		length_max: 15,
		copy: true,
		visible: true,
		auto_chain: true,
	},

	[ParamType.NUMERIC]: {
		lbl: "NUMERIC",
		focusable: true,
		editable: true,
		interactable: true,
		validatable: true,
		numeric: true,
		text_input: true,
		inputmode: "tel",
		submit: true,
		pattern: "^[0-9]+$",
		pattern_keypress: "^[0-9]*$",
		length_max: 25,
		copy: true,
		visible: true,
		auto_chain: true,
	},

	[ParamType.TEXT]: {
		lbl: "TEXT",
		focusable: true,
		editable: true,
		interactable: true,
		validatable: true,
		numeric: false,
		text_input: true,
		submit: true,
		pattern: "^[-a-zA-Z0-9ँ-ॲ₹ _.,&@()'\"!#$%+/*={}\\[\\]<>?:;]+$",
		pattern_keypress: "^[-a-zA-Z0-9ँ-ॲ₹ _.,&@()'\"!#$%+/*={}\\[\\]<>?:;]*$",
		length_max: 250,
		visible: true,
		auto_chain: true,
	}, // "^[-a-zA-Z0-9ँ-ॲ₹ _.,&@()'\"!#$%+/*={}\\[\\]<>?:;]+$"

	[ParamType.FLOATING_POINT]: {
		lbl: "FLOATING_POINT",
		focusable: true,
		editable: true,
		interactable: true,
		validatable: true,
		numeric: true,
		text_input: true,
		inputmode: "numeric",
		submit: true,
		pattern: "^[0-9]+(?:.[0-9]{1,3})?$",
		pattern_keypress: "^(?:[0-9]*|[0-9]+(?:.[0-9]{1,3})?)$",
		length_max: 25,
		visible: true,
		auto_chain: true,
	},

	[ParamType.DATETIME]: {
		lbl: "DATETIME",
		focusable: true,
		editable: true,
		interactable: true,
		validatable: true,
		numeric: false,
		text_input: false,
		submit: true,
		visible: true,
		auto_chain: true,
	},

	[ParamType.MOBILE]: {
		lbl: "MOBILE",
		focusable: true,
		editable: true,
		interactable: true,
		validatable: true,
		numeric: true,
		text_input: true,
		inputmode: "tel",
		submit: true,
		pattern: "^[6-9](?!0+$)[0-9]{9}$",
		pattern_keypress: "^(?:[6-9]?|[6-9][0-9]{0,9})$",
		pattern_format: "XXX XXX XXXX",
		length_min: 10,
		length_max: 10,
		copy: true,
		visible: true,
		auto_chain: true,
	},

	[ParamType.FROM_DATE]: {
		lbl: "FROM_DATE",
		focusable: true,
		editable: true,
		interactable: true,
		validatable: true,
		numeric: false,
		text_input: false,
		submit: true,
		visible: true,
		auto_chain: true,
	},

	[ParamType.TO_DATE]: {
		lbl: "TO_DATE",
		focusable: true,
		editable: true,
		interactable: true,
		validatable: true,
		numeric: false,
		text_input: false,
		submit: true,
		visible: true,
		auto_chain: true,
	},

	[ParamType.BOOLEAN]: {
		lbl: "BOOLEAN",
		focusable: true,
		editable: true,
		interactable: true,
		validatable: true,
		numeric: false,
		text_input: false,
		submit: true,
		visible: true,
		auto_chain: true,
	},

	[ParamType.OTP]: {
		lbl: "OTP",
		focusable: true,
		editable: true,
		interactable: true,
		validatable: true,
		numeric: true,
		text_input: true,
		inputmode: "tel",
		submit: true,
		pattern: "^[0-9]+$",
		pattern_keypress: "^[0-9]*$",
		length_min: 3,
		length_max: 10,
		visible: true,
		auto_chain: false,
	},

	[ParamType.LABEL]: {
		lbl: "LABEL",
		focusable: false,
		editable: false,
		interactable: false,
		validatable: false,
		numeric: false,
		text_input: false,
		submit: false,
		value_prefilled: true,
		visible: true,
		auto_chain: false,
	},

	[ParamType.MARKDOWN]: {
		lbl: "MARKDOWN",
		focusable: false,
		editable: false,
		interactable: false,
		validatable: false,
		numeric: false,
		text_input: false,
		submit: false,
		visible: true,
		auto_chain: false,
	},

	[ParamType.EMAIL]: {
		lbl: "EMAIL",
		focusable: true,
		editable: true,
		interactable: true,
		validatable: true,
		numeric: false,
		text_input: true,
		inputmode: "email",
		submit: true,
		copy: true,
		visible: true,
		auto_chain: true,
	},

	[ParamType.USER_AUTH_TYPE_PINTWIN]: {
		lbl: "USER_AUTH_TYPE_PINTWIN",
		focusable: false,
		editable: false,
		interactable: false,
		validatable: false,
		numeric: false,
		text_input: false,
		submit: true,
		visible: false,
		auto_chain: false,
	},

	[ParamType.GEOLOCATION]: {
		lbl: "GEOLOCATION",
		focusable: false,
		editable: false,
		interactable: true,
		validatable: true,
		numeric: false,
		text_input: false,
		submit: true,
		value_prefilled: true,
		visible: false,
		auto_chain: false,
	},

	[ParamType.HTMLEMBED]: {
		lbl: "HTMLEMBED",
		focusable: false,
		editable: false,
		interactable: false,
		validatable: false,
		numeric: false,
		text_input: false,
		submit: false,
		visible: true,
		auto_chain: false,
	},

	[ParamType.RECHARGE_PLAN_WIDGET]: {
		lbl: "RECHARGE_PLAN_WIDGET",
		focusable: false,
		editable: false,
		interactable: false,
		validatable: false,
		numeric: false,
		text_input: false,
		submit: false,
		visible: true,
		auto_chain: false,
	},

	[ParamType.USER_PROFILE_PARAMETER]: {
		lbl: "USER_PROFILE_PARAMETER",
		focusable: false,
		editable: false,
		interactable: false,
		validatable: false,
		numeric: false,
		text_input: false,
		submit: true,
		value_prefilled: true,
		visible: false,
		auto_chain: false,
	},

	[ParamType.QRCODE]: {
		lbl: "QRCODE",
		focusable: false,
		editable: false,
		interactable: true,
		validatable: false,
		numeric: false,
		text_input: false,
		submit: false,
		visible: true,
		auto_chain: true,
	},

	[ParamType.FINGERPRINT]: {
		lbl: "FINGERPRINT",
		focusable: true,
		editable: true,
		interactable: true,
		validatable: true,
		numeric: false,
		text_input: false,
		submit: true,
		visible: true,
		auto_chain: false,
		no_persist: true,
	},

	[ParamType.IMAGE]: {
		lbl: "IMAGE",
		focusable: false,
		editable: false,
		interactable: true,
		validatable: false,
		numeric: false,
		text_input: false,
		submit: false,
		value_prefilled: true,
		visible: true,
		auto_chain: false,
	},

	[ParamType.LINK]: {
		lbl: "LINK",
		focusable: false,
		editable: true,
		interactable: true,
		validatable: false,
		numeric: false,
		text_input: false,
		submit: false,
		value_prefilled: true,
		visible: true,
		auto_chain: false,
	},

	[ParamType.MAP]: {
		lbl: "MAP",
		focusable: false,
		editable: false,
		interactable: true,
		validatable: false,
		numeric: false,
		text_input: false,
		submit: false,
		visible: true,
		auto_chain: false,
	},

	[ParamType.API_TEXT]: {
		lbl: "API_TEXT",
		focusable: false,
		editable: false,
		interactable: false,
		validatable: true,
		numeric: false,
		text_input: false,
		submit: true,
		visible: true,
		auto_chain: true,
	},

	[ParamType.MAP_CURRENT_LOCATION]: {
		lbl: "MAP_CURRENT_LOCATION",
		focusable: false,
		editable: true,
		interactable: true,
		validatable: true,
		numeric: false,
		text_input: false,
		submit: true,
		visible: true,
		auto_chain: true,
	},

	[ParamType.YOUTUBE_VIDEO]: {
		lbl: "YOUTUBE_VIDEO",
		focusable: false,
		editable: false,
		interactable: true,
		validatable: false,
		numeric: false,
		text_input: false,
		submit: false,
		value_prefilled: true,
		visible: true,
		auto_chain: false,
	},

	[ParamType.MEDIA_LIST]: {
		lbl: "MEDIA_LIST",
		focusable: false,
		editable: false,
		interactable: true,
		validatable: false,
		numeric: false,
		text_input: false,
		submit: false,
		value_prefilled: true,
		visible: true,
		auto_chain: false,
	},

	[ParamType.NAVIGATION_LINK]: {
		lbl: "NAVIGATION_LINK",
		focusable: false,
		editable: false,
		interactable: true,
		validatable: false,
		numeric: false,
		text_input: false,
		submit: false,
		value_prefilled: true,
		visible: true,
		auto_chain: true,
	},

	[ParamType.IFSC_SEARCH]: {
		lbl: "IFSC_SEARCH",
		focusable: false,
		editable: false,
		interactable: false,
		validatable: false,
		numeric: false,
		text_input: false,
		submit: false,
		value_prefilled: true,
		visible: true,
		auto_chain: false,
	},

	[ParamType.UIDAI_DEVICE_SETUP_HELP]: {
		lbl: "UIDAI_DEVICE_SETUP_HELP",
		focusable: false,
		editable: false,
		interactable: true,
		validatable: false,
		numeric: false,
		text_input: false,
		submit: false,
		value_prefilled: true,
		visible: true,
		auto_chain: false,
	},

	[ParamType.FAQ_LIST]: {
		lbl: "FAQ_LIST",
		focusable: false,
		editable: false,
		interactable: true,
		validatable: false,
		numeric: false,
		text_input: false,
		submit: false,
		value_prefilled: true,
		visible: true,
		auto_chain: false,
	},

	[ParamType.CALCULATED]: {
		lbl: "CALCULATED",
		focusable: false,
		editable: false,
		interactable: false,
		validatable: false,
		numeric: false,
		text_input: false,
		submit: true,
		value_prefilled: true,
		visible: false,
		auto_chain: true,
	},

	[ParamType.STATUS_LABEL]: {
		lbl: "STATUS_LABEL",
		focusable: false,
		editable: false,
		interactable: false,
		validatable: false,
		numeric: false,
		text_input: false,
		submit: false,
		value_prefilled: true,
		visible: true,
		auto_chain: false,
	},

	[ParamType.REQ_LIST]: {
		lbl: "REQ_LIST",
		focusable: true,
		editable: false,
		interactable: true,
		validatable: false,
		numeric: false,
		text_input: false,
		submit: false,
		visible: true,
		auto_chain: false,
	},

	[ParamType.PARAM_SEPARATOR]: {
		lbl: "PARAM_SEPARATOR",
		focusable: false,
		editable: false,
		interactable: false,
		validatable: false,
		numeric: false,
		text_input: false,
		submit: false,
		visible: true,
		auto_chain: false,
	},
};

/**
 * Show a field in a particular display media (screen/print/both/none).
 */
export const DisplayMedia = {
	BOTH: 0, // Default - show in both screen & print
	SCREEN: 1, // Show only in screen
	PRINT: 2, // Show only in print
	NONE: 3, // Hide
};

/**
 * Enum for interaction behaviors.
 * @enum {number}
 * @readonly
 */
export enum InteractionBehavior {
	NORMAL = 1, // Normal Interaction. Request SimpliBank.
	LINK = 2, // Interaction Flow. Only used for left-menu entry. Load another interaction.
	LOCAL = 3, // Local Interaction. No server request. Use default response from DB & pass all request params in response.
	FILE_DOWNLOAD = 4, // The response to this interaction is a file (binary data) instead of normal JSON response
	INFORMATION = 5, // Do not fire any request. Just show a static information card
	GROUP = 6, // A group of interactions as per 'group_interaction_ids' field. Show a menu to select between them
	GRID = 7, // Similar to GROUP but shown as a GRID (Store Listing). First one not selected by default
	BRAND = 8, // A Brand with products (brand_products table) pointing to other transactions
	TOKEN_SCANNER = 9, // Scan Token and Pay
}
