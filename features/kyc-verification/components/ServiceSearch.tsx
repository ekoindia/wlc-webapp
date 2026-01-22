/**
 * ServiceSearch component for filtering KYC services by search query.
 * Uses the Input component from components for consistent styling.
 */

import { Icon, Input } from "components";
import { useCallback, useState } from "react";
import { useDebouncedCallback } from "use-debounce";

interface ServiceSearchProps {
	/** Current search query */
	value: string;
	/** Callback when search query changes */
	onChange: (_query: string) => void;
	/** Placeholder text */
	placeholder?: string;
	/** Debounce delay in ms */
	debounceMs?: number;
}

/**
 * Search input for filtering KYC verification services by name/description.
 * Uses the shared Input component for consistent styling with debounced input.
 * @param {ServiceSearchProps} props - Component props
 * @param {string} props.value - Current search query value
 * @param {Function} props.onChange - Callback invoked when search query changes (debounced)
 * @param {string} [props.placeholder] - Placeholder text for the input field
 * @param {number} [props.debounceMs] - Debounce delay in milliseconds (default: 300)
 * @returns {JSX.Element} Rendered search input with clear functionality
 */
export const ServiceSearch = ({
	value,
	onChange,
	placeholder = "Search services...",
	debounceMs = 300,
}: ServiceSearchProps): JSX.Element => {
	const [localValue, setLocalValue] = useState(value);

	// Debounced callback to parent
	const debouncedOnChange = useDebouncedCallback((query: string) => {
		onChange(query);
	}, debounceMs);

	const handleChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement> | string) => {
			const newValue = typeof e === "string" ? e : e.target.value;
			setLocalValue(newValue);
			debouncedOnChange(newValue);
		},
		[debouncedOnChange]
	);

	const handleClear = useCallback(() => {
		setLocalValue("");
		onChange("");
	}, [onChange]);

	return (
		<Input
			value={localValue}
			onChange={handleChange}
			placeholder={placeholder}
			size="md"
			inputLeftElement={<Icon name="search" size="sm" color="gray.400" />}
			inputRightElement={
				localValue ? (
					<Icon
						name="close"
						size="xs"
						color="gray.400"
						cursor="pointer"
						onClick={handleClear}
					/>
				) : null
			}
			inputContStyle={{ w: { base: "100%", md: "280px" } }}
		/>
	);
};

export default ServiceSearch;
