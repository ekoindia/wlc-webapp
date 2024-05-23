import { Box } from "@chakra-ui/react";
import { ReactNode } from "react";

type AccordionButtonProps = {
	children: ReactNode;
	isExpanded?: boolean; // Making this optional to avoid typescript error as this being passed from AccordionItem internally.
	handleOpenIndexes?: () => void; // Making this optional to avoid typescript error as this being passed from AccordionItem internally.
};

/**
 * AccordionButton is a component that toggles the expansion state of an accordion item.
 *
 * @param {AccordionButtonProps} props - Props for configuring the AccordionButton component.
 * @param {ReactNode} props.children - The content to be displayed within the button.
 * @param {boolean} props.isExpanded - Indicates whether the accordion item is expanded.
 * @param {() => void} props.handleOpenIndexes - Callback function to handle the toggling of the accordion item's expanded state.
 *
 * @returns {JSX.Element} The AccordionButton component.
 */
const AccordionButton = ({
	children,
	isExpanded,
	handleOpenIndexes,
}: AccordionButtonProps): JSX.Element => {
	return (
		<Box onClick={handleOpenIndexes} aria-expanded={isExpanded}>
			{children}
		</Box>
	);
};

export default AccordionButton;
