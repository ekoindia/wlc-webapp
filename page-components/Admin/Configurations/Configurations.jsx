import { Flex, Text } from "@chakra-ui/react";
import { PillTab } from "components";
import { useState } from "react";
import { GeneralConfig, ThemeConfig } from ".";

/**
 * A Configurations page-component
 */
const Configurations = () => {
	const [currTab, setCurrTab] = useState(0);

	const list = [
		{ label: "General", component: <GeneralConfig /> },
		{ label: "Theme", component: <ThemeConfig /> },
	];

	const onClick = (idx) => setCurrTab(idx);

	const getComp = (idx) => list[idx].component;

	return (
		<div>
			<Flex
				bg={{ base: "white", md: "none" }}
				borderRadius="0px 0px 20px 20px"
				my={{
					base: "0",
					md: "5",
				}}
			>
				<Flex
					direction={{ base: "column", md: "row" }}
					align={{ base: "flex-start", md: "center" }}
					gap={{ base: "2", md: "8" }}
					w="100%"
					m={{ base: "20px", md: "0" }}
					fontSize="sm"
					justify="space-between"
				>
					<Text fontWeight="semibold" fontSize="2xl">
						Configurations
					</Text>
					<PillTab {...{ list, currTab, onClick }} />
				</Flex>
			</Flex>
			{getComp(currTab)}
		</div>
	);
};

export default Configurations;
