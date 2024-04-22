import { BoxProps, chakra } from "@chakra-ui/react";
import { ReactElement, ReactNode } from "react";

/**
 * Props for the AccordionItem component.
 * @summary The summary to be displayed in the AccordionItem. This will be always visible.
 * @children The children to be rendered within the AccordionItem. This will be shown or hidden based on the state of the AccordionItem.
 * @open A boolean indicating whether the AccordionItem is currently open. If true, the children will be shown; if false, the children will be hidden.
 * @onClick A function to be called when the AccordionItem is toggled. Typically, this will be used to update the state in the parent Accordion component.
 */
export interface AccordionItemProps extends BoxProps {
	summary: ReactNode;
	children: ReactNode;
	open?: Boolean;
	onClick?: () => void;
}

/**
 * AccordionItem component. This component should be used as a child of the Accordion component.
 * @param {AccordionItemProps} props - The props to pass into the AccordionItem component.
 * @returns {ReactElement} The rendered AccordionItem component.
 */
const AccordionItem = ({
	summary,
	children,
	open,
	onClick,
}: AccordionItemProps): ReactElement => {
	return <Details {...{ summary, open, onClick }}>{children}</Details>;
};

export default AccordionItem;

/**
 * A `Details` component that uses the `chakra` function from Chakra UI to create
 * styled "details" and "summary" HTML elements. This component takes in `summary` and `children` props,
 * where `summary` is the content that will be always visible and `children` is the content that will be shown or hidden.
 * @param {AccordionItemProps} props - The props to pass into the Details component.
 * @example
 * ```jsx
 * <Details summary={<Text>Summary</Text>}>
 *   <Box>Hidden details</Box>
 * </Details>
 * ```
 */
const Details = ({
	summary,
	children,
	open,
	onClick,
	...rest
}: AccordionItemProps) => {
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

	console.log("[Details] open", open);

	return (
		<Details open={open} {...rest}>
			<Summary onClick={onClick}>{summary}</Summary>
			{children}
		</Details>
	);
};
