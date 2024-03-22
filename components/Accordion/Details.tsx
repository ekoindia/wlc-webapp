import { BoxProps, chakra } from "@chakra-ui/react";
import { ReactNode } from "react";

export interface DetailsProps extends BoxProps {
	summary: ReactNode;
	children: ReactNode;
	open?: Boolean;
	onClick?: () => void;
}

/**
 * A `Details` component that uses the `chakra` function from Chakra UI to create
 * styled "details" and "summary" HTML elements. This component takes in `summary` and `children` props,
 * where `summary` is the content that will be always visible and `children` is the content that will be shown or hidden.
 *
 * @param {ReactNode} summary - The content that will be always visible.
 * @param {ReactNode} children - The content that will be shown or hidden.
 * @param {BoxProps} rest - Any additional props will be spread onto the outer `details` element.
 *
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
}: DetailsProps) => {
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

	console.log("open", open);

	return (
		<Details open={open} {...rest}>
			<Summary onClick={onClick}>{summary}</Summary>
			{children}
		</Details>
	);
};

export default Details;
