import React, { ReactElement, ReactNode } from "react";
import { useAccordion } from "./AccordionContext";

type AccordionItemProps = {
	id: number;
	children:
		| ReactNode
		// eslint-disable-next-line no-unused-vars
		| ((props: {
				isExpanded: boolean;
				handleOpenIndexes: () => void;
		  }) => ReactNode);
};

/**
 * AccordionItem component represents an item within an accordion. It handles rendering its children based on whether the item is expanded or collapsed.
 *
 * @param {AccordionItemProps} props - The properties for the AccordionItem component.
 * @param {number} props.id - The unique identifier for the accordion item.
 * @param {React.ReactNode | function({isExpanded: boolean, handleOpenIndexes: function}): React.ReactNode} props.children - The content of the accordion item. This can either be a React node or a function that takes an object containing `isExpanded` and `handleOpenIndexes` and returns a React node.
 *
 * @returns {JSX.Element} The rendered accordion item component.
 */
const AccordionItem = ({ id, children }: AccordionItemProps) => {
	const { openIndex, handleOpenIndexes } = useAccordion();
	const isExpanded = openIndex.includes(id);

	const renderChildren = () => {
		if (typeof children === "function") {
			return children({
				isExpanded,
				handleOpenIndexes: () => handleOpenIndexes(id),
			});
		} else {
			return React.Children.map(children, (child) => {
				if (React.isValidElement(child)) {
					// When using React.cloneElement, explicitly cast child as ReactElement<any> to ensure TypeScript knows that child is indeed a valid React element.
					return React.cloneElement(child as ReactElement<any>, {
						isExpanded,
						handleOpenIndexes: () => handleOpenIndexes(id),
					});
				}
				return child;
			});
		}
	};
	return <div>{renderChildren()}</div>;
};

export default AccordionItem;
