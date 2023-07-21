import { Avatar, Box, Checkbox, Circle, Flex, Text } from "@chakra-ui/react";
import { Button, Icon } from "components";
import { Endpoints } from "constants";
import { useSession } from "contexts";
import { fetcher } from "helpers";
import { useEffect, useState } from "react";

const renderer = {
	label: "name",
	value: "mobile",
};

const selectAllObj = { value: "*", label: "Select All" };

/**
 * A MoveAgents page-component
 * TODO: Write more description here
 * @arg 	{Object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @example	`<MoveAgents></MoveAgents>`
 */
const MoveAgents = ({
	options,
	setShowSelectAgent,
	agentList,
	transferAgentsFrom,
	transferAgentsTo,
	selectedAgentsToTransfer,
	onChange = () => {},
}) => {
	const [selectAllChecked, setSelectAllChecked] = useState(false);
	const [selectedOptions, setSelectedOptions] = useState([]);
	const [optionsValueList, setOptionsValueList] = useState([]);
	const selectedOptionsLength = selectedOptions?.length || 0;
	const { accessToken } = useSession();

	useEffect(() => {
		let _optionsValueList = [];
		options.forEach((option) => {
			_optionsValueList.push(option[renderer.value]);
		});

		setOptionsValueList(_optionsValueList);
	}, [options]);

	useEffect(() => {
		onChange(selectedOptions);
	}, [selectedOptions]);

	/* handle when user click on option */
	const handleClick = (checked, value) => {
		if (checked === true) {
			handleOptionMultiSelect(value);
		} else {
			handleOptionMultiDeselect(value);
		}
	};

	/* handle when user select a option */
	const handleOptionMultiSelect = (optionValue) => {
		if (optionValue === "*") {
			setSelectedOptions(optionsValueList);
			setSelectAllChecked(true);
		} else {
			let _selectedOptions = [...selectedOptions, optionValue];
			checkAndSetSelectAll(optionsValueList, _selectedOptions);
			setSelectedOptions([..._selectedOptions]);
		}
	};

	/* handle when user de-select a option */
	const handleOptionMultiDeselect = (optionValue) => {
		setSelectAllChecked(false);
		if (optionValue === "*") {
			setSelectedOptions([]);
		} else {
			let _selectedOptions = selectedOptions.filter(
				(val) => val !== optionValue
			);
			setSelectedOptions(_selectedOptions);
		}
	};

	/* checking whether select all should be enabled or not */
	const checkAndSetSelectAll = (_options, _selectedOptions) => {
		if (selectedOptionsLength > 0) {
			const _optionsSet = new Set(_options);
			const _selectedOptionsSet = new Set(_selectedOptions);
			const _shouldCheckSelectAll =
				_optionsSet.size === _selectedOptionsSet.size &&
				[..._optionsSet].every((item) => _selectedOptionsSet.has(item));
			setSelectAllChecked(_shouldCheckSelectAll);
		}
	};

	/* api call */
	const body = {
		scspFrom: transferAgentsFrom.value,
		scspTo: transferAgentsTo.value,
		selectedTransferredCSPsList: selectedAgentsToTransfer,
	};

	const handleMoveAgent = () => {
		fetcher(process.env.NEXT_PUBLIC_API_BASE_URL + Endpoints.TRANSACTION, {
			headers: {
				"tf-req-uri-root-path": "/ekoicici/v1",
				"tf-req-uri": `/network/agents/profile/changeRole/transfercsps`,
				"tf-req-method": "PUT",
			},
			body: body,
			token: accessToken,
		}).then((res) => {
			console.log("res", res);
			setShowSelectAgent(false);
		});
	};

	return (
		<>
			<Flex align="center" gap="8">
				<Flex
					direction="column"
					w={{ base: "100vw", md: "500px" }}
					h={{ base: "100vh", md: "auto" }}
					top={{ base: "0", md: "initial" }}
					left={{ base: "0", md: "initial" }}
					position={{ base: "absolute", md: "initial" }}
					bg="white"
					gap="3"
					zIndex="99"
				>
					<Flex
						fontWeight="semibold"
						gap="1"
						display={{ base: "none", md: "flex" }}
					>
						<Text color="light">
							Move Retailers From: &thinsp;
							<Text as="span" color="dark">
								{transferAgentsFrom?.label}
							</Text>
						</Text>
					</Flex>

					<Flex
						direction="column"
						border={{ base: "none", md: "card" }}
						borderRadius={{ base: "0", md: "10" }}
						h={{ base: "100%", md: "635px" }}
						overflow="hidden"
					>
						<Flex p="5" bg="divider" columnGap="15px">
							<Checkbox
								isChecked={selectAllChecked}
								onChange={(event) => {
									handleClick(
										event.target.checked,
										selectAllObj.value
									);
								}}
							/>
							<Text color="light">{selectAllObj.label}</Text>
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
							{/* Select Retailers From */}
							{options?.map((row, index) => {
								return (
									<Flex
										align="center"
										px="5"
										py={{ base: "2.5", md: "4" }}
										bg="inherit"
										key={index}
										columnGap="15px"
										_even={{
											backgroundColor: "shade",
										}}
										color="accent.DEFAULT"
										fontSize="sm"
									>
										<Checkbox
											isChecked={
												selectAllChecked ||
												selectedOptions.includes(
													row[renderer.value]
												)
											}
											onChange={(event) => {
												event.stopPropagation();
												handleClick(
													event.target.checked,
													row[renderer.value]
												);
											}}
										/>
										<Avatar
											name={row.name[0]}
											bg="accent.DEFAULT"
											w="36px"
											h="36px"
										/>
										<Text fontSize="sm">
											{row[renderer.label]}
										</Text>
									</Flex>
								);
							})}
						</Box>
					</Flex>
				</Flex>
				<Circle
					display={{ base: "none", md: "flex" }}
					size={{ base: "12", xl: "20" }}
					color="divider"
					bg="secondary.DEFAULT"
				>
					<Icon name="fast-forward" size={{ base: "sm", xl: "lg" }} />
				</Circle>
				<TransferAgentsToBox {...{ agentList, transferAgentsTo }} />
			</Flex>
			<Flex
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
					onClick={() => setShowSelectAgent(false)}
				>
					Go Back
				</Button>
				<Button
					w={"50%"}
					h={"100%"}
					fontSize="18px"
					borderRadius="none"
					onClick={handleMoveAgent}
				>
					Move Now
				</Button>
			</Flex>
		</>
	);
};

export default MoveAgents;

const TransferAgentsToBox = ({ agentList, transferAgentsTo }) => {
	return (
		<Flex
			display={{ base: "none", md: "flex" }}
			w="500px"
			direction="column"
			gap="3"
		>
			<Flex fontWeight="semibold" gap="1">
				<Text color="light">
					Move Retailers To: &thinsp;
					<Text as="span" color="dark">
						{transferAgentsTo.label}
					</Text>
				</Text>
			</Flex>
			<Flex
				w="100%"
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
				{agentList?.map((row, index) => (
					<Flex
						px="5"
						py="4"
						bg="inherit"
						key={index}
						_even={{
							bg: "shade",
						}}
						color="accent.DEFAULT"
						fontSize="sm"
						columnGap="15px"
						align="center"
					>
						<Avatar
							name={row.name[0]}
							bg="accent.DEFAULT"
							w="36px"
							h="36px"
						/>
						{row.name}
					</Flex>
				))}
			</Flex>
		</Flex>
	);
};
