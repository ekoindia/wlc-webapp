import { Flex } from "@chakra-ui/react";

// Declare the props interface
interface FieldAgentOnboardingProps {
	prop1?: string;
	// size: "lg" | "md" | "sm" | "xs" | string;
	[key: string]: any;
}

/**
 * A <FieldAgentOnboarding> component
 * TODO: Write more description here
 * @component
 * @param {object} prop - Properties passed to the component
 * @param {string} prop.prop1 - TODO: Property description. A normal property.
 * @param {number} [prop.optionalProp2] - TODO: Property description. An optional property with default value.
 * @param {...*} rest - Rest of the props
 * @example	`<FieldAgentOnboarding></FieldAgentOnboarding>` TODO: Fix example
 */
const FieldAgentOnboarding = ({
	prop1,
	...rest
}: FieldAgentOnboardingProps) => {
	// MARK: JSX
	return <Flex {...rest}>FieldAgentOnboarding</Flex>;
};

export default FieldAgentOnboarding;
