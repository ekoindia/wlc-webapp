import {
	Box,
	Button,
	Center,
	Menu,
	MenuButton,
	MenuDivider,
	MenuGroup,
	MenuItem,
	MenuList,
	Radio,
	RadioGroup,
	Stack,
	StackDivider,
	Text,
} from "@chakra-ui/react";
import { Icon } from "components";
import { Fragment, useState } from "react";

/**
 * A <NetworkSort> component
 * TODO: Write more description here
 * @arg 	{Object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @example	`<NetworkSort></NetworkSort>`
 */
const NetworkSort = ({ setSort }) => {
	const [selectedSortType, setSelectedSortType] = useState("Data Added");
	const handleStatusClick = (value) => {
		setSort(value);
		console.log("setSort(value)", setSort(value));
		setSelectedSortType(value);
	};
	const sortType = [
		{
			id: 1,
			value: "recent",
		},
		{
			id: 2,
			value: "active",
			status: "Status:",
		},
		{
			id: 3,
			value: "inactive",
			status: "Status:",
		},
	];
	return (
		<>
			<Box
				display={{ base: "none", md: "flex" }}
				// mt={{ base: "1vw", "2xl": ".5vw" }}
				h={{
					base: "8.5vw",
					sm: "5.5vw",
					md: "4vw",
					lg: "3vw",
					xl: "2.6vw",
					"2xl": "2.2vw",
				}}
			>
				<Menu autoSelect={false} matchWidth={"false"}>
					{({ isOpen }) => (
						<Box
							display="flex"
							alignItems="center"
							// justifyContent={"space-between"}
							columnGap="10px"
						>
							<Box
								fontSize={{
									base: "5px",
									sm: "xs",
									md: "xs",
									lg: "xs",
									xl: "sm",
									"2xl": "lg",
								}}
								color="dark"
								fontWeight={"bold"}
							>
								Sort By :
							</Box>
							<MenuButton
								w={{
									base: "5vw",
									sm: "20vw",
									md: "20vw",
									lg: "13vw",
									xl: "14vw",
									"2xl": "11vw",
								}}
								h={{
									base: "3rem",
									md: "2.5rem",
									"2xl": "3rem",
								}}
								fontSize={{
									base: "5px",
									sm: "xs",
									md: "xs",
									lg: "xs",
									xl: "sm",
									"2xl": "md",
								}}
								fontWeight={"medium"}
								textAlign="start"
								borderRadius="6px"
								boxShadow="0px 5px 15px #0000001A"
								border="card"
								isActive={isOpen}
								bg="white"
								as={Button}
								rightIcon={
									<Center
										width={{
											base: "10px",
											sm: "10px",
											md: "12px",
											lg: "13px",
											xl: "14px",
											"2xl": "20px",
										}}
										height={{
											base: "10px",
											sm: "10px",
											md: "12px",
											lg: "13px",
											xl: "14px",
											"2xl": "20px",
										}}
									>
										<Icon
											name="caret-down"
											size="16px"
											color="light"
										/>
									</Center>
								}
								_active={{
									bg: "white",
								}}
								_hover={{
									bg: "white",
								}}
								textTransform="capitalize"
							>
								{selectedSortType}
							</MenuButton>

							<MenuList
								p="5px"
								minW={{
									base: "5vw",
									sm: "5vw",
									md: "5vw",
									lg: "13vw",
									xl: "10vw",
									"2xl": "11vw",
								}}
								fontSize={{
									base: "5px",
									sm: "xs",
									md: "xs",
									lg: "xs",
									xl: "sm",
									"2xl": "md",
								}}
								border="card"
							>
								{sortType.map((item, index) => (
									<Fragment key={item.id}>
										<MenuItem
											divider={
												<StackDivider borderColor="gray.200" />
											}
											fontWeight={"medium"}
											color="dark"
											_hover={{
												bg: "white",
											}}
											pt="10px"
											onClick={() =>
												handleStatusClick(item.value)
											}
										>
											<Text color="light" pr="3px">
												{item?.status}
											</Text>
											<Text textTransform="capitalize">
												{item.value}
											</Text>
										</MenuItem>
										{index !== sortType.length - 1 && (
											<MenuDivider
												margin="auto"
												mx="10px"
											/>
										)}
									</Fragment>
								))}
							</MenuList>
						</Box>
					)}
				</Menu>
			</Box>

			<Box
				display={{ md: "none" }}
				w={"100%"}
				overflow={"hidden"}
				h={"100%"}
			>
				<Menu autoSelect={false} matchWidth={"false"} flip={"true"}>
					<MenuButton
						as={Button}
						aria-label="Options"
						w={"100%"}
						bg="white"
						h={"100%"}
						borderRadius={"0px"}
						color="accent.DEFAULT"
						_active={{
							bg: "white",
						}}
						_hover={{
							bg: "white",
						}}
					>
						<Text
							color="accent.DEFAULT"
							fontSize={"18px"}
							lineHeight={"0"}
							fontWeight={"semibold"}
							display={"flex"}
							justifyContent={"center"}
							alignItems={"center"}
							gap={"10px"}
						>
							<Icon
								name="sort-by"
								size="24px"
								// height="21px"
							/>
							Sort by
						</Text>
					</MenuButton>

					<MenuList
						borderRadius={"15px 15px 0px 0px"}
						border="0"
						minW={"100%"}
						boxShadow="0px -10px 30px #0000001A"
					>
						<MenuGroup title="Sort by" fontSize={"18px"}>
							<RadioGroup mx={"16px"} my="16px">
								<Stack
									divider={
										<StackDivider borderColor="gray.200" />
									}
									direction="column"
									fontWeight={"medium"}
								>
									{sortType.map((item) => (
										<MenuItem
											p={"0px"}
											bgColor={"white"}
											key={item.id}
										>
											<Radio
												value={item.value}
												size="lg"
												onChange={(event) =>
													handleStatusClick(
														event.target.value
													)
												}
											>
												<Text
													color="light"
													pr="3px"
													as="span"
													fontWeight="normal"
													fontSize="sm"
												>
													{item?.status}
												</Text>
												<Text
													as="span"
													fontWeight="normal"
													fontSize="sm"
													textTransform="capitalize"
												>
													{item.value}
												</Text>
											</Radio>
										</MenuItem>
									))}
								</Stack>
							</RadioGroup>
						</MenuGroup>
					</MenuList>
				</Menu>
			</Box>
		</>
	);
};

export default NetworkSort;
