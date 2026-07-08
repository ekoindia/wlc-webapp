import { ParamType } from "constants/trxnFramework";

/**
 * A single parameter (form field) inside a request's `parameter_list`.
 * Extra/unknown keys are preserved on round-trip with the raw-JSON editor.
 */
export type ConfigParameter = {
	id: number;
	label: string;
	name: string;
	parameter_type_id: ParamType;
	value: string;
	/** "1" = required, "0" = optional (string, matching the widget's wire format). */
	is_required: "0" | "1";
	is_visible: boolean;
	length_min?: number;
	length_max?: number;
	pattern?: string;
	pattern_keypress?: string;
	text_case_type_id?: number;
	[key: string]: unknown;
};

/**
 * The full `interaction_config` object passed to <EkoConnectWidget>.
 */
export type InteractionConfig = {
	request: {
		label: string;
		http_method: string;
		parameter_list: ConfigParameter[];
		[key: string]: unknown;
	};
	interaction_id: number;
	flow_interaction_id: number;
	[key: string]: unknown;
};
