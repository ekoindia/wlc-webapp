import { Children, cloneElement, ReactElement } from "react";
import { DetailsProps } from ".";

type AccordionProps = {
	children: ReactElement<DetailsProps>;
	openIndex: number | null;
	// setOpenIndex: () => void;
};

/**
 * Accordion component that ensures only one Details component is open at a time.
 *
 * @param {AccordionProps} props - The props to pass into the Accordion component.
 * @returns {JSX.Element} The rendered Accordion component.
 */
const Accordion = ({
	children,
	openIndex,
}: // setOpenIndex,
AccordionProps): JSX.Element => {
	return (
		<>
			{Children.map(children, (child, index) => {
				// Clone the child element and add the 'open' and 'onClick' props
				return cloneElement(child, {
					open: index === openIndex,
					// onClick: () => setOpenIndex(index),
				});
			})}
		</>
	);
};

export default Accordion;
