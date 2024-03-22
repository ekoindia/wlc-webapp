import { ReactElement, ReactNode } from "react";
import { Details } from ".";

interface AccordionItemProps {
	/**
	 * The summary to be displayed in the AccordionItem. This will be always visible.
	 */
	summary: ReactNode;

	/**
	 * The children to be rendered within the AccordionItem. This will be shown or hidden based on the state of the AccordionItem.
	 */
	children: ReactNode;

	/**
	 * A boolean indicating whether the AccordionItem is currently open.
	 */
	isOpen: boolean;

	/**
	 * A function to be called when the AccordionItem is toggled. Typically, this will be used to update the state in the parent Accordion component.
	 */
	onClick?: () => void;
}

/**
 * AccordionItem component. This component should be used as a child of the Accordion component.
 *
 * @param {AccordionItemProps} props - The props to pass into the AccordionItem component.
 * @returns {ReactElement} The rendered AccordionItem component.
 */
const AccordionItem = ({
	summary,
	children,
	isOpen,
	onClick,
}: AccordionItemProps): ReactElement => {
	return (
		<Details summary={summary} open={isOpen} onClick={onClick}>
			{children}
		</Details>
	);
};

export default AccordionItem;
