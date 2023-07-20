import { Avatar, Box, Checkbox, Flex, Text } from "@chakra-ui/react";
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
const MoveAgents = ({ options, label, onChange = () => {} }) => {
	const [selectAllChecked, setSelectAllChecked] = useState(false);
	const [selectedOptions, setSelectedOptions] = useState([]);
	const [optionsValueList, setOptionsValueList] = useState([]);
	const selectedOptionsLength = selectedOptions?.length || 0;

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
		if (checked) {
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

	return (
		<Flex
			direction="column"
			w={{ base: "100%", md: "500px" }}
			bg="white"
			gap="3"
		>
			<Flex fontWeight="semibold" gap="1">
				<Text color="light">
					Move Retailers From: &thinsp;
					<Text as="span" color="dark">
						{label}
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
								onChange={(event) => {
									handleClick(
										event.target.checked,
										row[renderer.value]
									);
								}}
							>
								<Checkbox
									isChecked={
										selectAllChecked ||
										selectedOptions.includes(
											row[renderer.value]
										)
									}
									onChange={(event) => {
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
								<Text ml="-5px" fontSize="sm">
									{row[renderer.label]}
								</Text>
							</Flex>
						);
					})}
				</Box>
			</Flex>
		</Flex>
	);
};

export default MoveAgents;
