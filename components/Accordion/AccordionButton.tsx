import { Flex } from "@chakra-ui/react";
import { IconNameType } from "constants/IconLibrary";
import { ReactNode } from "react";
import { Icon } from "..";

type AccordionButtonProps = {
	children: ReactNode;
	isExpanded?: boolean; // Making this optional to avoid typescript error as this being passed from AccordionItem internally.
	iconName?: IconNameType;
	iconSize?: "lg" | "md" | "sm" | "xs" | string;
	iconColor?: string;
	handleOpenIndexes?: () => void; // Making this optional to avoid typescript error as this being passed from AccordionItem internally.
	[key: string]: any; // rest
};

/**
 * AccordionButton is a component that toggles the expansion state of an accordion item.
 *
 * @param {AccordionButtonProps} props - Props for configuring the AccordionButton component.
 * @param {ReactNode} props.children - The content to be displayed within the button.
 * @param {boolean} [props.isExpanded] - Indicates whether the accordion item is expanded.
 * @param {IconNameType} [props.iconName="expand-more"] - The name of the icon to display.
 * @param {string} [props.iconSize='xs'] - The size of the icon.
 * @param {string} [props.iconColor='light'] - The color of the icon.
 * @param {() => void} [props.handleOpenIndexes] - Callback function to handle the toggling of the accordion item's expanded state.
 * @param {...Object} props.rest - A catch-all prop that allows any other prop to be passed in.
 *
 * @returns {JSX.Element} The AccordionButton component.
 */
const AccordionButton = ({
	children,
	isExpanded,
	iconName = "expand-more",
	iconSize = "sm",
	iconColor = "light",
	handleOpenIndexes,
	...rest
}: AccordionButtonProps): JSX.Element => {
	return (
		<Flex
			align="center"
			justify="space-between"
			onClick={handleOpenIndexes}
			aria-expanded={isExpanded}
			{...rest}
		>
			{children}
			<Icon
				name={iconName}
				size={iconSize}
				color={iconColor}
				style={{
					transform: isExpanded ? "rotate(-180deg)" : "rotate(0deg)",
					transition: "transform 0.1s ease-in-out",
				}}
			/>
		</Flex>
	);
};

export default AccordionButton;
