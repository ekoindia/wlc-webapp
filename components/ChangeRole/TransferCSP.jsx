import {
	Avatar,
	Box,
	Button,
	Checkbox,
	Circle,
	Flex,
	Select,
	Text,
} from "@chakra-ui/react";
import { Buttons, Icon } from "..";

// text - align: left;
// font: normal normal 600 16px / 18px Inter;
// letter - spacing: 0px;
// color: #0C243B;
// opacity: 1;

const data = [
	{
		title: "R. J. Technology",
		img: "",
	},
	{
		title: "Aarkay Finance",
		img: "",
	},
	{
		title: "R. J. Technology",
		img: "",
	},
	{
		title: "Aarkay Finance",
		img: "",
	},
	{
		title: "R. J. Technology",
		img: "",
	},
	{
		title: "Aarkay Finance",
		img: "",
	},
	{
		title: "R. J. Technology",
		img: "",
	},
	{
		title: "Aarkay Finance",
		img: "",
	},
	{
		title: "Aarkay Finance",
		img: "",
	},
	{
		title: "Aarkay Finance",
		img: "",
	},
	{
		title: "Aarkay Finance",
		img: "",
	},
	{
		title: "Aarkay Finance",
		img: "",
	},
	{
		title: "Aarkay Finance",
		img: "",
	},
];

const TransferCSP = () => {
	return (
		<Box>
			{/* Select  */}
			<Flex
				px="0"
				columnGap={{ base: "0", md: "180px" }}
				rowGap={{ base: "40px", md: "0" }}
				flexWrap="wrap"
			>
				<Box w={{ base: "100%", md: "500px" }}>
					<Text
						color="#0C243B"
						fontSize={{ base: "sm", md: "md" }}
						fontWeight="semibold"
						mb="2.5"
					>
						Select distributor to transfer agents from
					</Text>
					<Select
						placeholder="--Select--"
						h="12"
						icon={<Icon name="caret-down" />}
					>
						<option value="option1">Option 1</option>
						<option value="option2">Option 2</option>
						<option value="option3">Option 3</option>
					</Select>
				</Box>
				<Box w={{ base: "100%", md: "500px" }}>
					<Text
						color="#0C243B"
						fontSize={{ base: "sm", md: "md" }}
						fontWeight="semibold"
						mb="2.5"
					>
						Select distributor to transfer agents to
					</Text>
					<Select
						placeholder="--Select--"
						size="md"
						h="12"
						icon={<Icon name="caret-down" />}
					>
						<option value="option1">Option 1</option>
						<option value="option2">Option 2</option>
						<option value="option3">Option 3</option>
					</Select>
				</Box>
			</Flex>

			{/* Button for mobile responsive */}
			<Flex
				mt="70px"
				direction="column"
				display={{ base: "flex", md: "none" }}
			>
				<Buttons h="54px" fontSize="md">
					Select Agents
				</Buttons>
				<Button variant="link" color="accent.DEFAULT" my="35px">
					Cancel
				</Button>
			</Flex>

			{/* Select for Move */}
			<Flex mt="10.5" h="auto" display={{ base: "none", md: "flex" }}>
				<Box w="500px">
					<Text
						color="#0C243B"
						fontSize="md"
						fontWeight="semibold"
						mb="15px"
					>
						<Text color="light" as="span">
							Select Sellers From:
						</Text>{" "}
						AngelTech Private Limited
					</Text>

					<Flex
						direction="column"
						border="card"
						borderRadius="10"
						h="635px"
						overflow="hidden"
					>
						<Flex p="5" bg="divider" columnGap="15px">
							<Checkbox variant="rounded" />
							<Text>Select All</Text>
						</Flex>
						<Box
							overflow="auto"
							css={{
								"&::-webkit-scrollbar": {
									width: "7px",
								},
								"&::-webkit-scrollbar-track": {
									width: "7px",
								},
								"&::-webkit-scrollbar-thumb": {
									background: "#555555",
									borderRadius: "5px",
									border: "1px solid #707070",
								},
							}}
						>
							{data.map((ele, idx) => {
								return (
									<Flex
										align="center"
										px="5"
										py="4"
										bg="inherit"
										key={idx}
										columnGap="15px"
										_even={{
											backgroundColor: "shade",
										}}
										color="accent.DEFAULT"
										fontSize="sm"
									>
										<Checkbox variant="rounded" />
										<Avatar src="https://bit.ly/broken-link" />
										<Text ml="-5px">{ele.title}</Text>
									</Flex>
								);
							})}
						</Box>
					</Flex>
				</Box>

				<Flex width="180px" align="center" justify="center">
					<Circle bg="#1F5AA7" w="82px" h="82px" color="#E9EDF1">
						<Icon name="fast-forward" width="34px" height="36px" />
					</Circle>
				</Flex>

				<Box w="500px">
					<Text
						color="#0C243B"
						fontSize={"md"}
						fontWeight="semibold"
						mb="15px"
					>
						<Text as="span" color="light">
							Select Sellers From:
						</Text>{" "}
						AngelTech Private Limited
					</Text>
					<Flex
						direction="column"
						border="card"
						borderRadius="10"
						h="635px"
						overflow="auto"
						css={{
							"&::-webkit-scrollbar": {
								width: "7px",
							},
							"&::-webkit-scrollbar-track": {
								width: "7px",
							},
							"&::-webkit-scrollbar-thumb": {
								background: "#555555",
								borderRadius: "5px",
								border: "1px solid #707070",
							},
						}}
					>
						<Flex
							px="5"
							py="4"
							bg="inherit"
							color="accent.DEFAULT"
							fontSize="sm"
							align="center"
							columnGap="15px"
						>
							<Avatar src="https://bit.ly/broken-link" />R J
							Finance
						</Flex>
						{data.map((ele, idx) => {
							return (
								<Flex
									px="5"
									py="4"
									bg="inherit"
									key={idx}
									_even={{
										bg: "shade",
									}}
									color="accent.DEFAULT"
									fontSize="sm"
									columnGap="15px"
									align="center"
								>
									{" "}
									<Avatar src="https://bit.ly/broken-link" />
									{ele.title}
								</Flex>
							);
						})}
					</Flex>
				</Box>
			</Flex>

			{/* Buttons */}
			<Flex
				mt="70px"
				columnGap="36px"
				display={{ base: "none", md: "flex" }}
			>
				<Buttons w="164px" h="64px">
					Move Now
				</Buttons>
				<Button variant="link" color="accent.DEFAULT">
					Cancel
				</Button>
			</Flex>
		</Box>
	);
};

export default TransferCSP;
