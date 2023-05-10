import {
	Box,
	Divider,
	Flex,
	Tab,
	TabList,
	TabPanel,
	TabPanels,
	Tabs,
	Text,
} from "@chakra-ui/react";
import { Button, Headings } from "components";
import { useRouter } from "next/router";

import { useState } from "react";
import { MoveAgents, TransferSeller } from ".";

/**
 * A <ChangeRole> component
 * TODO: Write more description here
 * @example	`<ChangeRole></ChangeRole>`
 */

const ChangeRole = () => {
	const [isShowSelectAgent, setIsShowSelectAgent] = useState(false);
	console.log("isShowSelectAgent", isShowSelectAgent);
	const tab = +useRouter().query.tab;
	const [scspFromValue, setScspFromValue] = useState("");
	console.log("scspFromValue", scspFromValue);
	const [selectedEkocspidsCR, setSelectedEkocspidsCR] = useState([]);
	console.log("selectedEkocspidsCR", selectedEkocspidsCR);

	const handleScspFromChange = (value) => {
		setScspFromValue(value);
	};

	return !isShowSelectAgent ? (
		<>
			<Headings title="Change Role" />
			<Flex
				align={{ base: "center", md: "flex-start" }}
				pb={{ base: "0", md: "40px" }}
				bg={{ base: "none", md: "white" }}
				direction="column"
				rowGap={{ base: "10px", md: "0" }}
				border={{ base: "", md: "card" }}
				borderRadius={{ base: "0", md: "10" }}
				boxShadow={{ base: "", md: "0px 5px 15px #0000000D;" }}
				overflow={"hidden"}
			>
				<Flex
					w="100%"
					pt="3.5"
					px={{ base: "4", md: "7.5" }}
					pb={{ base: "3.5", md: "5" }}
					bg="white"
					borderTopLeftRadius={{ base: "0", md: "10" }}
					borderTopRightRadius={{ base: "0", md: "10" }}
					borderBottom={{ base: "card", md: "0" }}
					direction="column"
					rowGap={{ base: "10px", md: "0" }}
					borderRadius={{ base: "0px", md: "none" }}
					border={{ base: "1px solid #D2D2D2", md: "none" }}
					borderTop="none"
				>
					<Text
						as="h1"
						color="accent.DEFAULT"
						fontWeight="bold"
						fontSize={{ base: "lg", md: "2xl" }}
					>
						Angel Tech Private Limited
					</Text>
					<Text fontSize={{ base: "xs", md: "md" }}>
						Edit the fields below and click Preview.
						<Text
							as="span"
							display={{ base: "block", md: "inline" }}
						>
							Click Cancel to return to Client HomePage without
							submitting information.
						</Text>
					</Text>
				</Flex>

				<Divider
					w={{ base: "0", md: "calc(100% - 60px)" }}
					mx="auto"
					color="divider"
				/>

				<Tabs
					position="relative"
					defaultIndex={tab || 0}
					variant="colorful"
					//Responsive style
					bg={{ base: "#FFFFFF", md: "transparent" }}
					border={{ base: "card", md: "none" }}
					px={{ base: "0", md: "7.5" }}
					pt={{ base: "3", md: "10.5" }}
					w={{ base: "92%", md: "100%" }}
					boxShadow={{ base: "0px 5px 15px #0000000D", md: "none" }}
					borderRadius={{ base: "10px", md: "none" }}
				>
					<TabList
						color="light"
						css={{
							"&::-webkit-scrollbar": {
								display: "none",
							},
							"&::-moz-scrollbar": {
								display: "none",
							},
							"&::scrollbar": {
								display: "none",
							},
						}}
					>
						<Tab>Transfer Sellers</Tab>
						<Tab>Promote Seller To Distributor</Tab>
						<Tab>Demote Distributor</Tab>
						<Tab>Upgrade Seller To iSeller</Tab>
					</TabList>

					<TabPanels
						px={{ base: "18px", md: "0" }}
						mt={{ base: "23px", md: "32px", lg: "46px" }}
					>
						<TabPanel>
							<TransferSeller
								setIsShowSelectAgent={setIsShowSelectAgent}
								onScspFromChange={handleScspFromChange}
							/>
						</TabPanel>
						<TabPanel>
							<p>two!</p>
						</TabPanel>
						<TabPanel>
							<p>three!</p>
						</TabPanel>
						<TabPanel>
							<p>three!</p>
						</TabPanel>
					</TabPanels>
				</Tabs>
			</Flex>
		</>
	) : (
		<Box>
			{/* Move button for mobile responsive */}
			<MoveAgents
				options={scspFromValue}
				setSelectedEkocspidsCR={setSelectedEkocspidsCR}
			/>
			<Flex
				Flex
				display={{ base: "flex", md: "none" }}
				position={"fixed"}
				w={"100%"}
				h={"15vw"}
				maxH={"80px"}
				bottom={"0%"}
				left={"0%"}
				zIndex={"99"}
				boxShadow={"0px -3px 10px #0000001A"}
			>
				<Button
					variant="ghost"
					w={"50%"}
					h={"100%"}
					bg={"white"}
					fontSize="18px"
					color="accent.DEFAULT"
					onClick={() => setIsShowSelectAgent(false)}
				>
					Go Back
				</Button>
				<Button
					w={"50%"}
					h={"100%"}
					fontSize="18px"
					borderRadius="none"
				>
					Move Now
				</Button>
			</Flex>
		</Box>
	);
};

export default ChangeRole;
