import { createContext, ReactNode, useContext, useState } from "react";

type AccordionContextType = {
	openIndex: number[]; // The index of the open accordion items.
	setOpenIndex: React.Dispatch<React.SetStateAction<number[]>>; // Function to set the open accordion items.
	preExpanded?: Array<number>; // The pre-expanded accordion items.
	allowZeroExpanded?: boolean; // Whether to allow zero expanded accordion items.
	allowMultipleExpanded?: boolean; // Whether to allow multiple expanded accordion items.
	// eslint-disable-next-line no-unused-vars
	onChange?: (id: number) => void; // Function to call when an accordion item is changed.
};

/**
 * Context for Accordion component.
 * It provides the state and functions needed for the accordion behavior.
 */
const AccordionContext = createContext<AccordionContextType | undefined>(
	undefined
);

type AccordionProviderProps = {
	children: ReactNode; // The children components.
	preExpanded?: Array<number>; // The pre-expanded accordion items.
	allowZeroExpanded?: boolean; // Whether to allow zero expanded accordion items.
	allowMultipleExpanded?: boolean; // Whether to allow multiple expanded accordion items.
	// eslint-disable-next-line no-unused-vars
	onChange?: (id: number) => void; // Function to call when an accordion item is changed.
};

/**
 * AccordionProvider component.
 * It provides the Accordion context to its children.
 *
 * @param {AccordionProviderProps} props - The props to pass to the component.
 */
const AccordionProvider = ({
	children,
	preExpanded,
	allowZeroExpanded,
	allowMultipleExpanded,
	onChange,
}: AccordionProviderProps) => {
	const [openIndex, setOpenIndex] = useState<Array<number>>([]);

	return (
		<AccordionContext.Provider
			value={{
				openIndex,
				setOpenIndex,
				preExpanded,
				allowZeroExpanded,
				allowMultipleExpanded,
				onChange: onChange ? (id: number) => onChange(id) : undefined,
			}}
		>
			{children}
		</AccordionContext.Provider>
	);
};

/**
 * useAccordion hook.
 * It provides the Accordion context.
 *
 * @throws {Error} If used outside of an AccordionProvider.
 * @returns {AccordionContextType} The Accordion context.
 */
const useAccordion = (): AccordionContextType => {
	const context = useContext(AccordionContext);
	if (!context) {
		throw new Error(
			"useAccordion must be used within an AccordionProvider"
		);
	}
	return context;
};

export { AccordionProvider, useAccordion };
