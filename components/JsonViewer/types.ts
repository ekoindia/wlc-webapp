/**
 * Supported JSON primitive types
 */
export type JsonPrimitive = string | number | boolean | null | undefined;

/**
 * Supported JSON value types including objects and arrays
 */
export type JsonValue = JsonPrimitive | JsonObject | JsonArray;

/**
 * JSON object type
 */
export type JsonObject = { [key: string]: JsonValue };

/**
 * JSON array type
 */
export type JsonArray = JsonValue[];

/**
 * Type names for JSON values used in styling
 */
export type JsonValueType =
	| "string"
	| "number"
	| "boolean"
	| "null"
	| "undefined"
	| "object"
	| "array"
	| "circular";

/**
 * Configuration for transforming display values.
 * Supports both key-based (applies to all matching keys) and
 * path-based (applies to specific JSON paths) transformations.
 */
export interface ValueTransformConfig {
	/**
	 * Key-based value mappings. Applies to all occurrences of a key.
	 * Example: { Y: "Yes", N: "No" } transforms "Y" to "Yes" everywhere
	 */
	byKey?: Record<string, string>;

	/**
	 * Path-based value mappings. Applies only to specific JSON paths.
	 * Path uses dot notation without "root." prefix.
	 * Example: { "permanent_address.city": { delhi: "Delhi (Permanent)" } }
	 */
	byPath?: Record<string, Record<string, string>>;
}

/**
 * Props for the main JsonViewer component
 */
export interface JsonViewerProps {
	/**
	 * JSON data to render. Can be an object, array, or JSON string.
	 * If a string is provided, it will be parsed as JSON.
	 * Invalid JSON strings will render an error message.
	 */
	data: unknown;

	/**
	 * Collapse nodes beyond this depth level.
	 * Level 0 is the root. Default is 2.
	 * Set to Infinity to keep all nodes expanded.
	 */
	collapseAfterLevel?: number;

	/**
	 * Enable smooth expand/collapse animations.
	 * Default is true.
	 */
	animated?: boolean;

	/**
	 * Maximum height of the JSON viewer container.
	 * If content exceeds this, it becomes scrollable.
	 * Can be a responsive object or string value.
	 * Default is { base: "200px", md: "350px" }.
	 */
	maxHeight?:
		| string
		| { base?: string; sm?: string; md?: string; lg?: string; xl?: string };

	/**
	 * Additional CSS class name for the container
	 */
	className?: string;

	/**
	 * Show or hide the curly brackets and square brackets.
	 * Default is true.
	 */
	showBrackets?: boolean;

	/**
	 * Override specific key display names.
	 * Keys not in this object will use default formatting (underscore removal + capitalize).
	 * Example: { pan_number: "PAN Number", dob: "Date of Birth" }
	 */
	keyOverrides?: Record<string, string>;

	/**
	 * Configuration for transforming display values.
	 * Supports key-based and path-based transformations.
	 */
	valueTransforms?: ValueTransformConfig;
}

/**
 * Props for the internal JsonNode component
 */
export interface JsonNodeProps {
	/**
	 * The key/property name of this node (null for root or array items)
	 */
	nodeKey: string | number | null;

	/**
	 * The value to render at this node
	 */
	value: JsonValue;

	/**
	 * Current depth level (0 = root)
	 */
	level: number;

	/**
	 * Unique path to this node for stable React keys
	 */
	path: string;

	/**
	 * Depth at which nodes should be collapsed by default
	 */
	collapseAfterLevel: number;

	/**
	 * Whether animations are enabled
	 */
	animated: boolean;

	/**
	 * Array of ancestor objects for circular reference detection.
	 * Using array instead of WeakSet to allow proper cloning between branches.
	 */
	ancestors: object[];

	/**
	 * Whether this is the last item in a collection (for trailing comma logic)
	 */
	isLast?: boolean;

	/**
	 * Show or hide the curly brackets and square brackets.
	 */
	showBrackets: boolean;

	/**
	 * Override specific key display names.
	 */
	keyOverrides?: Record<string, string>;

	/**
	 * Configuration for transforming display values.
	 */
	valueTransforms?: ValueTransformConfig;
}

/**
 * Result of parsing JSON input
 */
export interface ParseResult {
	/**
	 * Whether parsing was successful
	 */
	success: boolean;

	/**
	 * Parsed data (only set if success is true)
	 */
	data?: JsonValue;

	/**
	 * Error message (only set if success is false)
	 */
	error?: string;
}
