import { Circle, Flex } from "@chakra-ui/react";
import { useState } from "react";

/**
 * A <Switch> component
 * TODO: Write more description here
 * @arg 	{Object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @example	`<Switch></Switch>`
 */
const Switch = (props) => {
	const { initialValue, setVisible } = props;

	const [switched, setSwitched] = useState(initialValue);

	const handleSwitch = () => {
		setSwitched(!switched);
		setVisible(!switched);
	};
	return (
		<Flex
			bg={switched ? "success" : "error"}
			h="30px"
			w="70px"
			borderRadius="100px"
			onClick={handleSwitch}
			align="center"
			justify="center"
			cursor="pointer"
			userSelect="none"
		>
			<Flex
				direction={switched ? "row" : "row-reverse"}
				justify="space-between"
				align="center"
				w="90%"
				h="23px"
			>
				<Flex color="white" fontSize="12px" px="8px">
					{switched ? "Yes" : "No"}
				</Flex>
				<Flex>
					<Circle
						bg="white"
						size="23px"
						boxShadow={
							switched
								? "0px 3px 6px #009B34"
								: "0px 3px 6px #CA1B56"
						}
					/>
				</Flex>
			</Flex>
		</Flex>
	);
};

export default Switch;
