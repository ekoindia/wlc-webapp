import {
	JsonValue,
	JsonValueType,
	ParseResult,
	ValueTransformConfig,
} from "./types";

/**
 * Capitalizes the first letter of each word in a string.
 * @param str - The string to capitalize
 * @returns Capitalized string
 */
export const capitalizeWords = (str: string): string => {
	return str.replace(/\b\w/g, (char) => char.toUpperCase());
};

/**
 * Formats a key for display by applying default transformation or using override.
 * Default: removes underscores and capitalizes each word.
 * @param key - The original key name
 * @param overrides - Optional override mappings for specific keys
 * @returns Formatted key string
 * @example
 * formatKeyLabel("pan_number") // "Pan Number"
 * formatKeyLabel("pan_number", { pan_number: "PAN Number" }) // "PAN Number"
 */
export const formatKeyLabel = (
	key: string,
	overrides?: Record<string, string>
): string => {
	// Check for explicit override first
	if (overrides?.[key]) {
		return overrides[key];
	}

	// Default: replace underscores with spaces and capitalize each word
	return capitalizeWords(key.replace(/_/g, " "));
};

/**
 * Transforms a display value based on configuration.
 * Resolution order: byPath (exact path match) > byKey (any matching key) > original value
 * @param value - The original value
 * @param key - The key name of this value
 * @param path - The full JSON path (e.g., "root.permanent_address.city")
 * @param config - Optional transformation configuration
 * @returns Transformed value or original if no transformation applies
 * @example
 * // byKey transformation
 * transformDisplayValue("Y", "status", "root.status", { byKey: { Y: "Yes" } }) // "Yes"
 *
 * // byPath transformation (takes precedence)
 * transformDisplayValue("delhi", "city", "root.permanent_address.city", {
 *   byKey: { delhi: "Delhi" },
 *   byPath: { "permanent_address.city": { delhi: "Delhi (Permanent)" } }
 * }) // "Delhi (Permanent)"
 */
export const transformDisplayValue = (
	value: unknown,
	key: string | number,
	path: string,
	config?: ValueTransformConfig
): unknown => {
	// Only transform string values
	if (typeof value !== "string" || !config) {
		return value;
	}

	// Remove "root." prefix from path for cleaner config keys
	const cleanPath = path.startsWith("root.") ? path.slice(5) : path;

	// Check byPath first (higher priority)
	if (config.byPath?.[cleanPath]?.[value] !== undefined) {
		return config.byPath[cleanPath][value];
	}

	// Check byKey (lower priority, applies to any matching key)
	if (typeof key === "string" && config.byKey?.[value] !== undefined) {
		return config.byKey[value];
	}

	return value;
};

/**
 * Determines the type of a JSON value for styling purposes.
 * @param value - The value to check
 * @returns The type name
 */
export const getValueType = (value: JsonValue): JsonValueType => {
	if (value === null) return "null";
	if (value === undefined) return "undefined";
	if (Array.isArray(value)) return "array";
	if (typeof value === "object") return "object";
	if (typeof value === "string") return "string";
	if (typeof value === "number") return "number";
	if (typeof value === "boolean") return "boolean";
	return "null";
};

/**
 * Safely parses JSON input that can be an object, array, or string.
 * @param input - The input to parse
 * @returns ParseResult with success status and data or error
 */
export const parseJsonInput = (input: unknown): ParseResult => {
	// Handle null/undefined
	if (input === null || input === undefined) {
		return { success: true, data: input as JsonValue };
	}

	// If it's already an object or array, return as-is
	if (typeof input === "object") {
		return { success: true, data: input as JsonValue };
	}

	// If it's a primitive, return as-is
	if (
		typeof input === "string" ||
		typeof input === "number" ||
		typeof input === "boolean"
	) {
		// Try to parse string as JSON
		if (typeof input === "string") {
			// Check if it looks like JSON (starts with { or [)
			const trimmed = input.trim();
			if (
				(trimmed.startsWith("{") && trimmed.endsWith("}")) ||
				(trimmed.startsWith("[") && trimmed.endsWith("]"))
			) {
				try {
					const parsed = JSON.parse(input);
					return { success: true, data: parsed };
				} catch (err) {
					return {
						success: false,
						error: `Invalid JSON: ${err instanceof Error ? err.message : String(err)}`,
					};
				}
			}
		}
		return { success: true, data: input as JsonValue };
	}

	return { success: true, data: input as JsonValue };
};

/**
 * Checks if a value is a circular reference within the current ancestor chain.
 * @param value - The value to check
 * @param ancestors - Array of ancestor objects
 * @returns True if circular reference detected
 */
export const isCircularReference = (
	value: JsonValue,
	ancestors: object[]
): boolean => {
	if (value === null || typeof value !== "object") {
		return false;
	}
	return ancestors.includes(value);
};

/**
 * Creates a new ancestor array with the given value added.
 * Returns a new array to ensure each branch has its own ancestor chain.
 * @param value - The value to add
 * @param ancestors - Existing ancestor array
 * @returns New array with value added
 */
export const addToAncestors = (
	value: object,
	ancestors: object[]
): object[] => {
	return [...ancestors, value];
};

/**
 * Gets a descriptive string for object/array collections.
 * @param value - The object or array
 * @returns Description like "{3 keys}" or "[5 items]"
 */
export const getCollectionInfo = (value: object | unknown[]): string => {
	if (Array.isArray(value)) {
		const count = value.length;
		return count === 0 ? "[]" : `[${count} item${count !== 1 ? "s" : ""}]`;
	}
	const keys = Object.keys(value);
	const count = keys.length;
	return count === 0 ? "{}" : `{${count} key${count !== 1 ? "s" : ""}}`;
};

/**
 * Gets the color for syntax highlighting based on value type.
 * @param type - The JSON value type
 * @returns Chakra UI color string
 */
export const getTypeColor = (type: JsonValueType): string => {
	switch (type) {
		case "string":
			return "green.500";
		case "number":
			return "orange.400";
		case "boolean":
			return "cyan.500";
		case "null":
		case "undefined":
			return "gray.500";
		case "circular":
			return "red.500";
		default:
			return "inherit";
	}
};

/**
 * Key color for syntax highlighting
 */
export const KEY_COLOR = "purple.500";

/**
 * Bracket/punctuation color
 */
export const BRACKET_COLOR = "gray.600";

/**
 * Formats a primitive value for display.
 * @param value - The primitive value
 * @param type - The value type
 * @returns Formatted string representation
 */
export const formatPrimitiveValue = (
	value: unknown,
	type: JsonValueType
): string => {
	switch (type) {
		case "string":
			return `"${value}"`;
		case "null":
			return "null";
		case "undefined":
			return "undefined";
		case "boolean":
			return String(value);
		case "number":
			return String(value);
		default:
			return String(value);
	}
};
