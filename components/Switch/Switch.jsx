import { Circle, Flex, Text } from "@chakra-ui/react";
import { useState } from "react";

/**
 * A <Switch> component
 * TODO: Write more description here
 * @param 	{object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @param prop.initialValue
 * @param prop.onChange
 * @example	`<Switch></Switch>`
 */
const Switch = ({ initialValue, onChange = () => {} }) => {
	const [switched, setSwitched] = useState(initialValue);

	const handleSwitch = () => {
		setSwitched(!switched);
		onChange(!switched);
	};

	return (
		<Flex
			bg={switched ? "success" : "error"}
			h="30px"
			w="70px"
			borderRadius="100px"
			onClick={handleSwitch}
			justify="center"
			cursor="pointer"
			userSelect="none"
		>
			<Flex
				direction={switched ? "row" : "row-reverse"}
				justify="space-between"
				align="center"
				w="100%"
				p="1"
			>
				<Text color="white" fontSize="xs" p="2">
					{switched ? "Yes" : "No"}
				</Text>

				<Circle
					bg="white"
					size="24px"
					boxShadow={
						switched
							? "0px 3px 6px var(--chakra-colors-success)"
							: "0px 3px 6px var(--chakra-colors-error)"
					}
				/>
			</Flex>
		</Flex>
	);
};

export default Switch;
