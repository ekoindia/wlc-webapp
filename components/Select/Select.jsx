import {
	Checkbox,
	Flex,
	Table,
	TableContainer,
	Tbody,
	Td,
	Text,
	Tr,
} from "@chakra-ui/react";
import { useState } from "react";
import { Icon } from "..";

/**
 * A <Select> component
 * TODO: A custom <Select> component built on top of react-select.
 * @arg 	{Object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @example	`<Select></Select>`
 */

const dummyOptions = [
	{ value: "option1", label: "Option 1" },
	{ value: "option2", label: "Option 2" },
	{ value: "option3", label: "Option 3" },
	{ value: "option4", label: "Option 4" },
	{ value: "option5", label: "Option 5" },
	{ value: "option6", label: "Option 6" },
	{ value: "option7", label: "Option 7" },
	{ value: "option8", label: "Option 8" },
	{ value: "option9", label: "Option 9" },
	{ value: "option10", label: "Option 10" },
];

const Select = (props) => {
	const {
		options = dummyOptions,
		isSelectAllNeeded = true,
		variant = "striped",
		isScrollNeeded = true,
	} = props;
	const [open, setOpen] = useState(false);
	const [selectedOptions, setSelectedOptions] = useState([]);
	const [selectAllChecked, setSelectAllChecked] = useState(false);

	console.log("selectedOptions", selectedOptions);

	const selectObj = { value: "*", label: "Select All" };

	const handleInputClick = () => {
		setOpen(!open);
	};

	const handleOptionSelect = (optionValue) => {
		if (optionValue === "*") {
			// select all
			const allOptions = options.map((option) => option.value);
			setSelectedOptions(allOptions);
			setSelectAllChecked(true);
		} else {
			setSelectedOptions((prevState) => [...prevState, optionValue]);
		}
	};

	const handleOptionDeselect = (optionValue) => {
		if (optionValue === "*") {
			// deselect all
			setSelectedOptions([]);
			setSelectAllChecked(false);
		} else {
			setSelectedOptions(
				selectedOptions.filter((option) => option !== optionValue)
			);
			setSelectAllChecked(false);
		}
	};

	return (
		<>
			<Flex direction="column" w="500px">
				<Flex
					h="48px"
					w="100%"
					align="center"
					justify="space-between"
					border="1px solid #D2D2D2"
					borderRadius="10px"
					padding="9px 20px"
					onClick={handleInputClick}
				>
					<Flex>
						{!(selectedOptions.length > 0) ? (
							<Text>-- Select --</Text>
						) : (
							getSelectedStyle(selectedOptions)
							// selectedOptions
						)}
					</Flex>

					<Flex>
						<Icon name="drop-down" height="14px" width="10px" />
					</Flex>
				</Flex>
				<Flex w="100%">
					{open ? (
						<TableContainer
							w="100%"
							maxH={{ base: "380px" }}
							overflowY="auto"
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
							<Table variant={variant}>
								<Tbody>
									{/* select all */}
									{isSelectAllNeeded ? (
										<Tr key={selectObj.value}>
											<Td>
												<Checkbox
													variant="rounded"
													isChecked={selectAllChecked}
													onChange={(event) => {
														if (
															event.target.checked
														) {
															handleOptionSelect(
																selectObj.value
															);
														} else {
															handleOptionDeselect(
																selectObj.value
															);
														}
													}}
												>
													{selectObj.label}
												</Checkbox>
											</Td>
										</Tr>
									) : null}
									{/* options */}
									{options.map((row) => (
										<Tr key={row.value} h="50px" w="100%">
											<Td>
												<Checkbox
													variant="rounded"
													isChecked={selectedOptions.includes(
														row.value
													)}
													onChange={(event) => {
														if (
															event.target.checked
														) {
															handleOptionSelect(
																row.value
															);
														} else {
															handleOptionDeselect(
																row.value
															);
														}
													}}
												>
													{row.label}
												</Checkbox>
											</Td>
										</Tr>
									))}
								</Tbody>
							</Table>
						</TableContainer>
					) : null}
				</Flex>
			</Flex>
		</>
	);
};

export default Select;

const getSelectedStyle = (selectedOptions) => {
	return <>{selectedOptions}</>;
};
