import { createContext, ReactNode, useContext, useState } from "react";

type AccordionContextType = {
	openIndex: number[];
	allowToggle?: boolean;
	allowMultiple?: boolean;
	defaultIndex?: number;
	// eslint-disable-next-line no-unused-vars
	handleOpenIndexes: (id: number) => void;
	// onChange?: (id: number) => void;
};

/**
 * Context for Accordion component.
 * It provides the state and functions needed for the accordion behavior.
 */
const AccordionContext = createContext<AccordionContextType | undefined>(
	undefined
);

type AccordionProviderProps = {
	children: ReactNode;
	allowToggle?: boolean;
	allowMultiple?: boolean;
	// eslint-disable-next-line no-unused-vars
	// onChange?: (id: number) => void;
};

/**
 * AccordionProvider component.
 * It provides the Accordion context to its children.
 *
 * @param {Object} props - Props for configuring the accordion component.
 * @param {boolean} [props.allowToggle=false] - If true, any expanded accordion item can be collapsed again.
 * @param {boolean} [props.allowMultiple=false] - If true, multiple accordion items can be expanded at once.
 * @param {ReactElement<AccordionItemProps>} props.children - The accordion items.
 * @param {(id: number) => void} [props.onChange] - Function called when an accordion item is changed. The `id` parameter is the identifier of the accordion item that has changed.
 */
const AccordionProvider = ({
	children,
	allowToggle,
	allowMultiple,
}: // onChange,
AccordionProviderProps) => {
	const [openIndex, setOpenIndex] = useState<Array<number>>([]);

	const handleOpenIndexes = (index: number) => {
		setOpenIndex((prevIndexes) => {
			const isOpen = prevIndexes.includes(index);

			if (isOpen && !allowToggle) {
				// If it's already open and allowToggle is false, do nothing
				return prevIndexes;
			} else if (isOpen && allowToggle) {
				// If it's already open and allowToggle is true, close it
				return prevIndexes.filter((i) => i !== index);
			} else {
				// If it's not open, open it based on allowMultiple
				return allowMultiple ? [...prevIndexes, index] : [index];
			}
		});
	};

	return (
		<AccordionContext.Provider
			value={{
				openIndex,
				handleOpenIndexes,
				allowToggle,
				allowMultiple,
				// onChange: onChange ? (id: number) => onChange(id) : undefined,
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
