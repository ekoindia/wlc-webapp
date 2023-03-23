import { Checkbox, Flex, Input, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Icon } from "..";

/**
 * A <Select> component
 * TODO: A custom <Select> component built on top of react-select.
 * @arg 	{Object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @example	`<Select></Select>`
 */

const dummyOptions = [
	{ value: "apple", label: "Apple" },
	{ value: "banana", label: "Banana" },
	{ value: "orange", label: "Orange" },
	{ value: "pear", label: "Pear" },
	{ value: "grape", label: "Grape" },
	{ value: "kiwi", label: "Kiwi" },
	{ value: "mango", label: "Mango" },
	{ value: "pineapple", label: "Pineapple" },
	{ value: "watermelon", label: "Watermelon" },
	{ value: "strawberry", label: "Strawberry" },
	{ value: "blueberry", label: "Blueberry" },
	{ value: "raspberry", label: "Raspberry" },
	{ value: "blackberry", label: "Blackberry" },
	{ value: "pomegranate", label: "Pomegranate" },
	{ value: "peach", label: "Peach" },
	{ value: "apricot", label: "Apricot" },
	{ value: "plum", label: "Plum" },
	{ value: "cherry", label: "Cherry" },
	{ value: "grapefruit", label: "Grapefruit" },
	{ value: "lemon", label: "Lemon" },
	{ value: "lime", label: "Lime" },
	{ value: "tangerine", label: "Tangerine" },
	{ value: "mandarin", label: "Mandarin" },
	{ value: "peppermint", label: "Peppermint" },
	{ value: "persimmon", label: "Persimmon" },
	{ value: "guava", label: "Guava" },
	{ value: "papaya", label: "Papaya" },
	{ value: "dragonfruit", label: "Dragonfruit" },
	{ value: "starfruit", label: "Starfruit" },
	{ value: "passionfruit", label: "Passionfruit" },
];

const Select = (props) => {
	const {
		options = dummyOptions,
		multiple = true, // Enable multiple selection - bool
		searchable = true, // User can filter items - bool
		taggable, // Selected items rendered as tags - bool
		placeholder = "-- Select --", // select placeholders - string
		variant = "striped",
	} = props;

	// const selectOptions = multiple
	// 	? [{ value: "*", label: "Select All" }, ...options]
	// 	: options;

	const selectObject = { value: "*", label: "Select All" };

	const [open, setOpen] = useState(false);
	const [selectedOptions, setSelectedOptions] = useState({});
	const [selectAllChecked, setSelectAllChecked] = useState(false);
	const [filteredOptions, setFilteredOptions] = useState(options);
	const [searchTerm, setSearchTerm] = useState("");
	console.log("selectedOptions", selectedOptions);

	useEffect(() => {
		if (Object.keys(selectedOptions)?.length === options.length) {
			setSelectAllChecked(true);
		}
	}, [selectedOptions]);

	// useEffect(() => {
	// 	let tempOptions = options.filter((option) =>
	// 		option.label.toLowerCase().includes(searchTerm.toLowerCase())
	// 	);
	// 	setFilteredOptions(tempOptions);
	// }, [searchTerm]);

	const handleSelectBoxClick = () => {
		setOpen(!open);
	};

	const handleInputChange = (event) => {
		console.log("eee", event.target.value);
		let isSelectAll = true;
		setSearchTerm(event.target.value);
		//  Search
		let tempOptions = options.filter((option) =>
			option.label
				.toLowerCase()
				.includes(event.target.value.toLowerCase())
		);
		console.log("tempOptions", tempOptions);
		setFilteredOptions(tempOptions);
		// Check for select all
		tempOptions.forEach((ele) => {
			if (!selectedOptions[ele.value]) isSelectAll = false;
		});
		if (isSelectAll) {
			setSelectAllChecked(true);
		} else setSelectAllChecked(false);
	};

	const handleClick = (checked, value) => {
		if (checked) {
			handleOptionMultiSelect(value);
		} else {
			handleOptionMultiDeselect(value);
		}
	};

	const handleOptionMultiSelect = (optionValue) => {
		if (optionValue === "*") {
			console.log("optionValue", optionValue);
			// select all
			let allOptions = {};
			filteredOptions.forEach((option) => {
				allOptions[option.value] = 1;
			});
			console.log("allOptions", allOptions);
			setSelectedOptions(allOptions);
			setSelectAllChecked(true);
		} else {
			setSelectedOptions((prevState) => ({
				...prevState,
				[optionValue]: 1,
			}));
		}
	};

	const handleOptionMultiDeselect = (optionValue) => {
		if (optionValue === "*") {
			// deselect all
			setSelectedOptions({});
			setSelectAllChecked(false);
		} else {
			setSelectedOptions(
				selectedOptions.filter((option) => option !== optionValue)
			);
			setSelectAllChecked(false);
		}
	};
	console.log("filtered", filteredOptions);
	const selectedOptionsLength = Object.keys(selectedOptions);
	return (
		<>
			<Flex w="500px" cursor="pointer" direction="column">
				<Flex
					h="48px"
					w="100%"
					align="center"
					justify="space-between"
					border="1px solid #D2D2D2"
					borderRadius="10px"
					padding="9px 20px"
					onClick={handleSelectBoxClick}
				>
					<Flex align="center">
						<Flex>
							{!(selectedOptionsLength > 0) ? (
								<Text>{placeholder}</Text>
							) : (
								getSelectedStyle(selectedOptions)
								// selectedOptions
							)}
						</Flex>
						{searchable && (
							<Flex>
								<Input
									w="100%"
									minW="2px"
									type="text"
									opacity="1"
									outline="0px"
									px="10px"
									margin="0px"
									border="0px"
									value={searchTerm}
									onChange={handleInputChange}
								/>
							</Flex>
						)}
					</Flex>

					<Flex>
						<Icon name="drop-down" height="14px" width="10px" />
					</Flex>
				</Flex>
				<Flex w="100%">
					{open && (
						<Flex
							w="100%"
							direction="column"
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
							{/* Show select all options */}
							{multiple && filteredOptions.length > 0 && (
								<Flex
									key={selectObject.value}
									h="50px"
									w="100%"
									direction="column"
									px="5"
									py={{ base: "2.5", md: "3" }}
									bg="#E9EDF1"
								>
									<Checkbox
										variant="rounded"
										// isChecked={
										// 	selectAllChecked ||
										// 	selectedOptions.includes(selectObject.value)
										// }
										isChecked={
											selectAllChecked ||
											selectedOptions[selectObject.value]
										}
										onChange={(event) => {
											handleClick(
												event.target.checked,
												selectObject.value
											);
										}}
									>
										{selectObject.label}
									</Checkbox>
								</Flex>
							)}
							{filteredOptions.map((row) => (
								<Flex
									key={row.value}
									h="50px"
									w="100%"
									direction="column"
									px="5"
									py={{ base: "2.5", md: "3" }}
									_odd={{
										backgroundColor: "shade",
									}}
								>
									<Checkbox
										variant="rounded"
										// isChecked={
										// 	selectAllChecked ||
										// 	selectedOptions.includes(row.value)
										// }
										isChecked={
											selectAllChecked ||
											selectedOptions[row.value]
										}
										onChange={(event) => {
											handleClick(
												event.target.checked,
												row.value
											);
										}}
									>
										{row.label}
									</Checkbox>
								</Flex>
							))}
						</Flex>
					)}
				</Flex>
			</Flex>
		</>
	);
};

export default Select;

const getSelectedStyle = (selectedOptions) => {
	return <>{selectedOptions}</>;
};
