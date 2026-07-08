import { ParamMeta, ParamType } from "constants/trxnFramework";
import { ConfigParameter, InteractionConfig } from "./types";

/** Default interaction_id used for hand-built configs (matches the example payloads). */
const DEFAULT_INTERACTION_ID = 99001;

/**
 * Options for the "add field" palette — every parameter type from ParamMeta.
 * Labels are derived from `ParamMeta[type].lbl` (e.g. "MOBILE" -> "Mobile").
 */
export const PARAM_TYPE_OPTIONS: { value: ParamType; label: string }[] =
	Object.entries(ParamMeta)
		.map(([id, meta]) => ({
			value: Number(id) as ParamType,
			label: prettifyLabel(meta.lbl),
		}))
		.sort((a, b) => a.label.localeCompare(b.label));

/**
 * Convert an uppercase ParamMeta label (e.g. "MONEY_ABSOLUTE") to a readable
 * title-case label (e.g. "Money Absolute").
 * @param {string} lbl - The raw uppercase label.
 * @returns {string} The prettified, title-cased label.
 */
function prettifyLabel(lbl: string): string {
	return lbl
		.toLowerCase()
		.split(/[_\s]+/)
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");
}

/**
 * Build a fresh, empty interaction config scaffold matching the example payloads.
 * @returns {InteractionConfig} A new config with an empty parameter list.
 */
export function createEmptyConfig(): InteractionConfig {
	return {
		request: {
			label: "Untitled Transaction",
			http_method: "GET",
			confirm_submit: "0",
			disable_redo: 0,
			interaction_behavior_id: 1,
			interaction_type_id: 150,
			save_interaction_type_id: 0,
			meta: null,
			description: "",
			uri_root_id: "0",
			parameter_list: [],
		},
		interaction_id: DEFAULT_INTERACTION_ID,
		flow_interaction_id: DEFAULT_INTERACTION_ID,
	};
}

/**
 * Create a new parameter of the given type, with sensible defaults auto-filled
 * from ParamMeta (length, pattern, pattern_keypress) where available.
 * @param {ParamType} type - The parameter_type_id for the new field.
 * @param {ConfigParameter[]} existingParams - Current params, used to derive a unique incremental id.
 * @returns {ConfigParameter} The new parameter.
 */
export function createParameter(
	type: ParamType,
	existingParams: ConfigParameter[]
): ConfigParameter {
	const nextId =
		existingParams.reduce((max, p) => Math.max(max, p.id || 0), 0) + 1;
	const meta = ParamMeta[type];

	const param: ConfigParameter = {
		id: nextId,
		label: prettifyLabel(meta?.lbl ?? "Field"),
		name: `param_${nextId}`,
		parameter_type_id: type,
		value: "",
		is_required: "1",
		is_visible: meta?.visible ?? true,
	};

	if (meta?.length_min !== undefined) param.length_min = meta.length_min;
	if (meta?.length_max !== undefined) param.length_max = meta.length_max;
	if (meta?.pattern) param.pattern = meta.pattern;
	if (meta?.pattern_keypress) param.pattern_keypress = meta.pattern_keypress;

	return param;
}
