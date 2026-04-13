import { Flex, ResponsiveValue } from "@chakra-ui/react";
// @ts-ignore
import { Button } from "components";
import { usePlatform } from "hooks";

const DEFAULT_BUTTON_STYLES = {
	fontWeight: "bold",
	h: "64px",
	w: { base: "100%", md: "200px" },
};

interface ButtonConfig {
	type?: string;
	variant?: string;
	size?: ResponsiveValue<string>;
	label: string;
	icon?: string;
	iconStyle?: object;
	loading?: boolean;
	disabled?: boolean;
	onClick?: () => void;
	styles?: object;
}

interface ActionButtonGroupProps {
	buttonConfigList: ButtonConfig[];
	/** Controls fixed positioning on mobile screens. Defaults to true (fixed at bottom). */
	isFixedOnMobile?: boolean;
	[key: string]: any;
}

/**
 * A ActionButtonGroup component renders a group of buttons based on the provided configuration.
 * @component
 * @param {object} props - Properties passed to the component
 * @param {ButtonConfig[]} props.buttonConfigList - List of objects containing configuration of buttons. Each object will consist of various properties like onClick, loading, disabled, variant, icon, type, etc.
 * @param {boolean} [props.isFixedOnMobile] - Whether buttons should be fixed at the bottom on mobile screens.
 * @param {...*} rest - Rest of the props to be passed to the Flex container.
 * @returns {JSX.Element} A group of buttons rendered based on the provided configuration.
 * @example
 * const buttonConfigs = [
 *   {
 *     type: 'button',
 *     variant: 'solid',
 *     size: 'md',
 *     label: 'Save',
 *     onClick: () => console.log('Save clicked'),
 *   },
 *   {
 *     type: 'button',
 *     variant: 'outline',
 *     size: 'md',
 *     label: 'Cancel',
 *     onClick: () => console.log('Cancel clicked'),
 *   },
 * ];
 *
 * <ActionButtonGroup buttonConfigList={buttonConfigs} />
 */
const ActionButtonGroup = ({
	buttonConfigList,
	isFixedOnMobile = true,
	...rest
}: ActionButtonGroupProps): JSX.Element => {
	const { isMac } = usePlatform();

	if (!buttonConfigList?.length) return null;

	// Conditional styles based on isFixedOnMobile prop
	// When fixed on mobile: row-reverse direction, no gap, fixed positioning at bottom
	// When not fixed: normal row direction with gap (desktop-like layout)
	const mobileLayoutStyles = isFixedOnMobile
		? {
				direction: { base: "row-reverse" as const, md: "row" as const },
				gap: { base: "0", md: "16" },
				position: { base: "fixed" as const, md: "initial" as const },
				bottom: isMac ? "64px" : "56px",
				left: "0",
			}
		: {
				direction: "row" as const,
				gap: { base: "0", md: "16" },
			};

	// Border radius: none on mobile when fixed (full-width buttons), rounded otherwise
	const buttonBorderRadius = isFixedOnMobile
		? { base: "none", md: "10" }
		: "10";

	return (
		<Flex
			w={{ base: "100%", md: "500px" }}
			align="center"
			bg="white"
			{...mobileLayoutStyles}
			{...rest}
		>
			{buttonConfigList.map(
				({
					type,
					variant,
					size,
					label,
					icon,
					iconStyle,
					loading,
					disabled,
					styles,
					onClick,
				}) => {
					return (
						// TODO: remove this directive after converting button to tsx.
						// @ts-ignore
						<Button
							key={label}
							{...{
								type,
								variant,
								size,
								label,
								icon,
								iconStyle,
								loading,
								disabled,
								onClick,
							}}
							{...DEFAULT_BUTTON_STYLES}
							{...{ borderRadius: buttonBorderRadius }}
							{...styles}
						>
							{label}
						</Button>
					);
				}
			)}
		</Flex>
	);
};

export default ActionButtonGroup;
