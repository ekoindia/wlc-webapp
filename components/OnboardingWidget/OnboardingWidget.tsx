import { Flex } from "@chakra-ui/react";

// Declare the props interface
interface OnboardingWidgetProps {
	prop1?: string;
	// size: "lg" | "md" | "sm" | "xs" | string;
	[key: string]: any;
}

/**
 * A <OnboardingWidget> component
 * TODO: Write more description here
 * @component
 * @param {object} prop - Properties passed to the component
 * @param {string} prop.prop1 - TODO: Property description. A normal property.
 * @param {number} [prop.optionalProp2] - TODO: Property description. An optional property with default value.
 * @param {...*} rest - Rest of the props
 * @example	`<OnboardingWidget></OnboardingWidget>` TODO: Fix example
 */
const OnboardingWidget = ({ prop1, ...rest }: OnboardingWidgetProps) => {
	// MARK: JSX
	return <Flex {...rest}>OnboardingWidget</Flex>;
};

export default OnboardingWidget;
