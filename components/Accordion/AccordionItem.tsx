import { chakra } from "@chakra-ui/react";
import { ReactElement, ReactNode } from "react";
import { useAccordion } from "./AccordionContext";

/**
 * Props for the AccordionItem component.
 * @summary The summary to be displayed in the AccordionItem. This will be always visible.
 * @children The children to be rendered within the AccordionItem. This will be shown or hidden based on the state of the AccordionItem.
 * @open A boolean indicating whether the AccordionItem is currently open. If true, the children will be shown; if false, the children will be hidden.
 * @onClick A function to be called when the AccordionItem is toggled. Typically, this will be used to update the state in the parent Accordion component.
 */
export interface AccordionItemProps {
	id: number;
	summary: ReactNode;
	children: ReactNode;
}

/**
 * AccordionItem component. This component should be used as a child of the Accordion component.
 * @param {AccordionItemProps} props - The props to pass into the AccordionItem component.
 * @returns {ReactElement} The rendered AccordionItem component.
 */
const AccordionItem = ({
	id,
	summary,
	children,
}: AccordionItemProps): ReactElement => {
	const { openIndex } = useAccordion();
	const open = openIndex.includes(id) ?? false;
	return <Details {...{ id, summary, open }}>{children}</Details>;
};

export default AccordionItem;

/**
 * Props for the Details component.
 * @summary The summary to be displayed in the AccordionItem. This will be always visible.
 * @children The children to be rendered within the AccordionItem. This will be shown or hidden based on the state of the AccordionItem.
 * @open A boolean indicating whether the AccordionItem is currently open. If true, the children will be shown; if false, the children will be hidden.
 */
export interface DetailsProp {
	summary: ReactNode;
	children: ReactNode;
	open: boolean;
	id: number;
}

/**
 * A `Details` component that uses the `chakra` function from Chakra UI to create
 * styled "details" and "summary" HTML elements. This component takes in `summary` and `children` props,
 * where `summary` is the content that will be always visible and `children` is the content that will be shown or hidden.
 * @param {DetailsProp} props - The props to pass into the Details component.
 * @example
 * ```jsx
 * <Details summary={<Text>Summary</Text>}>
 *   <Box>Hidden details</Box>
 * </Details>
 * ```
 */
const Details = ({ id, summary, children, open, ...rest }: DetailsProp) => {
	const { setOpenIndex, onChange } = useAccordion();
	//TODO: handling for preExpanded, allowZeroExpanded, allowMultipleExpanded

	const toggleExpanded = (id: number): void => {
		setOpenIndex((prev: Array<number>) => {
			if (prev.includes(id)) {
				return prev.filter((i) => i !== id); // If already open, close it
			}
			return [...prev, id]; // If not open, open it
		});
		if (onChange) {
			onChange(id); // Notify about the change
		}
	};

	const Details = chakra("details", {
		baseStyle: {
			w: "100%",
			listStyle: "none",
			"::-webkit-details-marker": {
				// for iphone
				display: "none",
			},
		},
	});
	const Summary = chakra("summary", {
		baseStyle: {
			w: "100%",
			listStyle: "none",
			"::-webkit-details-marker": {
				// for iphone
				display: "none",
			},
		},
	});

	return (
		<Details open={open} {...rest}>
			<Summary onClick={() => toggleExpanded(id)}>{summary}</Summary>
			{children}
		</Details>
	);
};
