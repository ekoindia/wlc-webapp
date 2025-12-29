import {
	Box,
	BoxProps,
	Flex,
	FlexProps,
	InputGroup,
	InputLeftAddon,
	Text,
} from "@chakra-ui/react";
import { Icon, InputLabel } from "components";
import { ChangeEvent, forwardRef, ReactNode, Ref, useRef } from "react";

/**
 * Props for the Calendar component
 */
export interface CalendarProps
	extends Omit<FlexProps, "onChange" | "position"> {
	/** Label displayed above the input */
	label?: string;
	/** Left addon content (e.g., "From", "To") displayed at the start of the input */
	leftAddon?: ReactNode;
	/** Name attribute for the input element */
	name?: string;
	/** Whether the field is required */
	required?: boolean;
	/** Custom styles for the label */
	labelStyle?: Record<string, unknown>;
	/** Custom styles for the input container */
	inputContStyle?: BoxProps;
	/** Additional props passed to the underlying date input */
	calendarProps?: Record<string, unknown>;
	/** Selected date value in YYYY-MM-DD format */
	value?: string;
	/** Minimum selectable date in YYYY-MM-DD format */
	minDate?: string;
	/** Maximum selectable date in YYYY-MM-DD format */
	maxDate?: string;
	/** Whether to hide the "(optional)" mark for non-required fields */
	hideOptionalMark?: boolean;
	/** Callback fired when the date value changes */
	onChange?: (_event: ChangeEvent<HTMLInputElement>) => void;
	/** Whether the input is disabled */
	disabled?: boolean;
	/** Size variant of the input */
	size?: "sm" | "md" | "lg";
	/** Unique identifier for the input element */
	id?: string;
	/** Placeholder text shown when no date is selected */
	placeholder?: string;
}

/**
 * A date picker input component that displays a styled date input with an optional label.
 *
 * This component renders a custom date picker UI with the following features:
 * - Customizable label above the input
 * - Optional left addon for prefix labels (e.g., "From", "To")
 * - Visual calendar icon that triggers the native date picker
 * - Support for min/max date constraints
 * - Controlled input behavior to prevent React warnings
 * - Responsive design with hover state styling
 * @example
 * ```tsx
 * // Basic usage
 * <Calendar
 *   label="Start Date"
 *   name="startDate"
 *   value={dateValue}
 *   onChange={(e) => setDateValue(e.target.value)}
 *   required
 * />
 *
 * // With left addon
 * <Calendar
 *   label="Date Range"
 *   leftAddon="From"
 *   name="fromDate"
 *   value={fromDate}
 *   onChange={(e) => setFromDate(e.target.value)}
 * />
 * ```
 */
const Calendar = forwardRef<HTMLDivElement, CalendarProps>(
	(
		{
			label,
			leftAddon,
			name,
			required = false,
			labelStyle,
			inputContStyle,
			calendarProps,
			value,
			minDate,
			maxDate,
			hideOptionalMark = false,
			onChange = () => {},
			placeholder = "YYYY-MM-DD",
			...rest
		},
		ref: Ref<HTMLDivElement>
	) => {
		const calendarRef = useRef<HTMLInputElement>(null);

		const handleClickForInput = () => {
			calendarRef.current?.showPicker();
		};

		return (
			<Flex
				direction={{ base: "column", md: undefined }}
				ref={ref}
				{...rest}
			>
				{label ? (
					<InputLabel
						required={required}
						hideOptionalMark={hideOptionalMark}
						{...labelStyle}
					>
						{label}
					</InputLabel>
				) : null}

				<InputGroup
					size="lg"
					onClick={handleClickForInput}
					cursor="pointer"
					{...inputContStyle}
				>
					{leftAddon ? (
						<InputLeftAddon
							bg="transparent"
							borderColor="hint"
							borderLeftRadius="5px"
							fontSize={{ base: "sm", md: "sm" }}
							fontWeight="medium"
							color="dark"
							px="12px"
						>
							{leftAddon}
						</InputLeftAddon>
					) : null}

					<Box
						flex="1"
						display="flex"
						alignItems="center"
						justifyContent="space-between"
						border="1px solid"
						borderColor="hint"
						borderLeftRadius={leftAddon ? "0" : "5px"}
						borderRightRadius="5px"
						borderLeft={leftAddon ? "none" : undefined}
						bg="white"
						px="12px"
						h="3rem"
						_hover={{
							bg: "focusbg",
							boxShadow: "0px 3px 6px #0000001A",
							borderColor: "hint",
							transition: "box-shadow 0.3s ease-out",
						}}
					>
						<Text
							fontSize={{ base: "sm", md: "sm" }}
							color={value ? "dark" : "gray.400"}
							lineHeight="normal"
						>
							{value || placeholder}
						</Text>

						<Flex align="center" gap="2">
							{/* Hidden native date input that triggers the browser's date picker */}
							<input
								type="date"
								name={name}
								value={value ?? ""}
								min={minDate}
								max={maxDate}
								ref={calendarRef}
								onChange={(e) => onChange(e)}
								style={{
									position: "absolute",
									width: "1px",
									height: "1px",
									opacity: 0,
									pointerEvents: "none",
								}}
								{...calendarProps}
							/>
							<Icon color="dark" name="calender" size="24px" />
						</Flex>
					</Box>
				</InputGroup>
			</Flex>
		);
	}
);

Calendar.displayName = "Calendar";

export default Calendar;
