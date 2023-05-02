import { Avatar, Box, Checkbox, Flex, Text } from "@chakra-ui/react";
import { useState } from "react";

/**
 * A <MoveAgents> component
 * TODO: Write more description here
 * @arg 	{Object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @example	`<MoveAgents></MoveAgents>`
 */

const MoveAgents = ({
	ShowSelectAgents,
	options,
	selectedEkocspids,
	onSelectedEkocspidsChange,
	setSelectedEkocspidsCR,
}) => {
	const [checked, setChecked] = useState(Array(options.length).fill(false));
	const [isSelectAll, setIsSelectAll] = useState(false);

	function selectAllHandler() {
		if (!isSelectAll) {
			setChecked(Array(checked.length).fill(true));
			onSelectedEkocspidsChange(options.map((option) => option.ekocspid));
		} else {
			setChecked(Array(checked.length).fill(false));
			onSelectedEkocspidsChange([]);
		}
		setIsSelectAll((prev) => !prev);
	}

	function OnCheckHandler(idx) {
		setChecked((prev) => {
			const newChecked = [...prev];
			newChecked[idx] = !newChecked[idx];
			return newChecked;
		});
		if (checked[idx]) {
			onSelectedEkocspidsChange((prev) => [
				...prev,
				options[idx].ekocspid,
			]);
			setSelectedEkocspidsCR((prev) => {
				[...prev, options[idx].ekocspid];
			});
		} else {
			onSelectedEkocspidsChange((prev) =>
				prev.filter((id) => id !== options[idx].ekocspid)
			);
		}
	}

	// for duplicated entry
	// useEffect(() => {
	//   const uniqueEkocspids = [...new Set(selectedEkocspids)];
	//   onSelectedEkocspidsChange(uniqueEkocspids);
	// }, [checked]);
	return (
		<Box w={{ base: "100%", md: "500px" }} bg="white">
			{!ShowSelectAgents ? (
				<Text
					color="inputlabel"
					fontSize="md"
					fontWeight="semibold"
					mb="15px"
				>
					<Text
						color="light"
						as="span"
						display={{ md: "block", lg: "inline-block" }}
					>
						Select Sellers From:
					</Text>{" "}
					AngelTech Private Limited
				</Text>
			) : (
				""
			)}

			<Flex
				direction="column"
				border={{ base: "none", md: "card" }}
				borderRadius={{ base: "0", md: "10" }}
				h={{ base: "100%", md: "635px" }}
				overflow="hidden"
			>
				<Flex p="5" bg="divider" columnGap="15px">
					<Checkbox
						variant="rounded"
						isChecked={isSelectAll}
						onChange={selectAllHandler}
					/>
					<Text color="light">Select All</Text>
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
					{/* Select Sellers From */}
					{options &&
						options.map((ele, idx) => {
							return (
								<Flex
									align="center"
									px="5"
									py={{ base: "2.5", md: "4" }}
									bg="inherit"
									key={idx}
									columnGap="15px"
									_even={{
										backgroundColor: "shade",
									}}
									color="accent.DEFAULT"
									fontSize="sm"
									onClick={() => OnCheckHandler(idx)}
								>
									<Checkbox
										variant="rounded"
										isChecked={checked[idx]}
										onChange={() => OnCheckHandler(idx)}
									/>
									<Avatar
										name={ele.DisplayName[0]}
										bg="accent.DEFAULT"
										w="36px"
										h="36px"
									/>
									<Text ml="-5px" fontSize="sm">
										{ele.DisplayName}
									</Text>
								</Flex>
							);
						})}
				</Box>
			</Flex>
		</Box>
	);
};

export default MoveAgents;
