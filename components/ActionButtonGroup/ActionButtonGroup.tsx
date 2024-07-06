import { Flex, ResponsiveValue } from "@chakra-ui/react";
// @ts-ignore
import { Button } from "components";
import { usePlatform } from "hooks";

const DEFAULT_BUTTON_STYLES = {
	fontWeight: "bold",
	borderRadius: { base: "none", md: "10" },
};

interface ButtonConfig {
	type?: string;
	variant?: string;
	size?: ResponsiveValue<string>;
	label: string;
	icon?: string;
	loading?: boolean;
	disabled?: boolean;
	onClick?: () => void;
	styles?: object;
}

interface ActionButtonGroupProps {
	buttonConfigList: ButtonConfig[];
	[key: string]: any;
}

/**
 * A ActionButtonGroup component renders a group of buttons based on the provided configuration.
 * @component
 * @param {object} props - Properties passed to the component
 * @param {ButtonConfig[]} props.buttonConfigList - List of objects containing configuration of buttons. Each object will consist of various properties like onClick, loading, disabled, variant, icon, type, etc.
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
	...rest
}: ActionButtonGroupProps): JSX.Element => {
	const { isMac } = usePlatform();

	if (!buttonConfigList?.length) return null;

	return (
		<Flex
			direction={{ base: "row-reverse", md: "row" }}
			w={{ base: "100%", md: "500px" }}
			position={{ base: "fixed", md: "initial" }}
			gap={{ base: "0", md: "16" }}
			align="center"
			bottom={isMac ? "64px" : "56px"}
			left="0"
			bg="white"
			{...rest}
		>
			{buttonConfigList.map(
				({
					type,
					variant,
					size,
					label,
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
								loading,
								disabled,
								onClick,
							}}
							{...DEFAULT_BUTTON_STYLES}
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
