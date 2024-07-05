import { Box } from "@chakra-ui/react";
import { ReactElement } from "react";
import { AccordionProvider } from ".";
import { AccordionItemProps } from "./AccordionItem";

type AccordionProps = {
	className?: string;
	children: ReactElement<AccordionItemProps>;
	allowToggle?: boolean;
	allowMultiple?: boolean;
	[key: string]: any; // rest
};

/**
 * Accordion is a compound component that manages state for all its accordion items using the Context API.
 * @param {AccordionProps} props - Props for configuring the Accordion component.
 * @param {string} [props.className] - className for the accordion container.
 * @param {boolean} [props.allowToggle] - If true, any expanded accordion item can be collapsed again.
 * @param {boolean} [props.allowMultiple] - If true, multiple accordion items can be expanded at once.
 * @param {ReactElement<AccordionItemProps>} props.children - The accordion items.
 * @param {...object} props.rest - A catch-all prop that allows any other prop to be passed in.
 * @returns {JSX.Element} The Accordion component.
 */
const Accordion = ({
	className = "accordion",
	allowToggle = false,
	allowMultiple = false,
	// onChange,
	children,
	...rest
}: AccordionProps): JSX.Element => {
	return (
		<AccordionProvider
			allowToggle={allowToggle}
			allowMultiple={allowMultiple}
			// onChange={onChange}
		>
			<Box className={className} {...rest}>
				{children}
			</Box>
		</AccordionProvider>
	);
};

export default Accordion;
