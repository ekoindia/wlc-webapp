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
	 * Additional CSS class name for the container
	 */
	className?: string;
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
