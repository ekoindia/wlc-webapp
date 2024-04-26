import { ReactElement } from "react";
import { AccordionItemProps, AccordionProvider } from ".";

type AccordionProps = {
	className?: string;
	children: ReactElement<AccordionItemProps>;
	preExpanded?: Array<number>;
	allowMultipleExpanded?: boolean;
	allowZeroExpanded?: boolean;
	// eslint-disable-next-line no-unused-vars
	onChange?: (id: number) => void;
};

const Accordion = ({
	className = "accordion",
	children,
	preExpanded,
	allowMultipleExpanded,
	allowZeroExpanded,
	onChange,
}: AccordionProps): JSX.Element => {
	return (
		<AccordionProvider
			preExpanded={preExpanded}
			allowZeroExpanded={allowZeroExpanded}
			allowMultipleExpanded={allowMultipleExpanded}
			onChange={onChange ? (id: number) => onChange(id) : undefined}
		>
			<div className={className}>{children}</div>
		</AccordionProvider>
	);
};

export default Accordion;
