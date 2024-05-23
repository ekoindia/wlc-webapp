import { ReactNode } from "react";

type AccordionPanelProps = {
	children: ReactNode;
	isExpanded?: boolean; // Making this optional to avoid typescript error as this being passed from AccordionItem internally.
};

/**
 * AccordionPanel is a component that displays the content of an accordion item.
 * The content is visible only when the accordion item is expanded.
 *
 * @param {AccordionPanelProps} props - Props for configuring the AccordionPanel component.
 * @param {ReactNode} props.children - The content to be displayed within the panel.
 * @param {boolean} props.isExpanded - Indicates whether the accordion item is expanded.
 *
 * @returns {JSX.Element} The AccordionPanel component.
 */
const AccordionPanel = ({
	children,
	isExpanded,
}: AccordionPanelProps): JSX.Element => {
	if (!isExpanded) return;
	return <div>{children}</div>;
};

export default AccordionPanel;
