import { ReactElement } from "react";
import { AccordionItemProps, AccordionProvider } from ".";

type AccordionProps = {
	className?: string;
	children: ReactElement<AccordionItemProps>;
	allowToggle?: boolean;
	allowMultiple?: boolean;
	// eslint-disable-next-line no-unused-vars
	// onChange?: (id: number) => void; // TODO check if required!
};

/**
 * Accordion is a compound component that manages state for all its accordion items using the Context API.
 *
 * @param {AccordionProps} props - Props for configuring the Accordion component.
 * @param {string} [props.className="accordion"] - className for the accordion container.
 * @param {boolean} [props.allowToggle=false] - If true, any expanded accordion item can be collapsed again.
 * @param {boolean} [props.allowMultiple=false] - If true, multiple accordion items can be expanded at once.
 * @param {ReactElement<AccordionItemProps>} props.children - The accordion items.
 *
 * @returns {JSX.Element} The Accordion component.
 *
 */
const Accordion = ({
	className = "accordion",
	allowToggle = false,
	allowMultiple = false,
	// onChange,
	children,
}: AccordionProps): JSX.Element => {
	return (
		<AccordionProvider
			allowToggle={allowToggle}
			allowMultiple={allowMultiple}
			// onChange={onChange}
		>
			<div className={className}>{children}</div>
		</AccordionProvider>
	);
};

export default Accordion;
