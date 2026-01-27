/**
 * Configuration for mapping option object keys to label and value fields.
 * @interface SelectRenderer
 */
export interface SelectRenderer {
	/** Key in option object to use as display label */
	label: string;
	/** Key in option object to use as option value */
	value: string;
}

/**
 * Props for the Select component.
 * @template T - The type of options in the select dropdown
 * @interface SelectProps
 */
export interface SelectProps<T = unknown> {
	/** Placeholder text shown when no option is selected */
	placeholder?: string;
	/** Callback fired when selection changes */
	onChange: (_option: T | null) => void;
	/** Array of options to display */
	options?: T[];
	/** Mapping for label and value keys in options */
	renderer?: SelectRenderer;
	/** Enable multi-select mode */
	isMulti?: boolean;
	/** Currently selected value(s) */
	value: T | T[] | null;
	/** Label text displayed above the select */
	label?: string;
	/** HTML id attribute */
	id?: string;
	/** Whether the select is disabled */
	disabled?: boolean;
	/** Whether the field is required */
	required?: boolean;
	/** Hide the "(optional)" mark for non-required fields */
	hideOptionalMark?: boolean;
	/** Custom styles for the label */
	labelStyle?: Record<string, unknown>;
	/** Custom function to get the display label from an option */
	getOptionLabel?: (_option: T) => string;
	/** Custom function to get the value from an option */
	getOptionValue?: (_option: T) => string;
	/** Additional props passed to the container */
	[key: string]: unknown;
}

/**
 * A customizable Select dropdown component built on react-select.
 * Supports single and multi-select modes with custom styling.
 * @template T - The type of options in the select dropdown
 * @param {SelectProps<T>} _props - The component props
 * @returns {JSX.Element} The rendered Select component
 * @example
 * ```tsx
 * <Select
 *   label="Choose an option"
 *   options={[{ label: 'Option 1', value: '1' }]}
 *   value={selectedValue}
 *   onChange={setSelectedValue}
 * />
 * ```
 */
declare const Select: <T = unknown>(_props: SelectProps<T>) => JSX.Element;

export default Select;
