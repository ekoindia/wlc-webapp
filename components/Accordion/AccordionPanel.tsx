import { Box, Collapse } from "@chakra-ui/react";
import { ReactNode } from "react";

type AccordionPanelProps = {
	children: ReactNode;
	isExpanded?: boolean; // Making this optional to avoid typescript error as this being passed from AccordionItem internally.
	[key: string]: any; // rest
};

/**
 * AccordionPanel is a component that displays the content of an accordion item.
 * The content is visible only when the accordion item is expanded.
 * @param {AccordionPanelProps} props - Props for configuring the AccordionPanel component.
 * @param {ReactNode} props.children - The content to be displayed within the panel.
 * @param {boolean} [props.isExpanded] - Indicates whether the accordion item is expanded.
 * @param {...object} props.rest - A catch-all prop that allows any other prop to be passed in.
 * @returns {JSX.Element} The AccordionPanel component.
 */
const AccordionPanel = ({
	children,
	isExpanded,
	...rest
}: AccordionPanelProps): JSX.Element => {
	// if (!isExpanded) return;
	return (
		<Collapse in={isExpanded} animateOpacity>
			<Box {...rest}>{children}</Box>
		</Collapse>
	);
};

export default AccordionPanel;
