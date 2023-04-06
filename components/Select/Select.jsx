import { Checkbox, Flex, Input } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
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
		//taggable, // Selected items rendered as tags - bool
		//placeholder = "-- Select --", // select placeholders - string
		//variant = "striped",
	} = props;

	const inputRef = useRef();
	const [open, setOpen] = useState(false);
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedOptions, setSelectedOptions] = useState({});
	const [highlightedIndex, setHighlightedIndex] = useState(-1);
	const [selectAllChecked, setSelectAllChecked] = useState(false);
	const [filteredOptions, setFilteredOptions] = useState(options);

	useEffect(() => {
		if (Object.keys(selectedOptions)?.length === options.length) {
			setSelectAllChecked(true);
		}
	}, [selectedOptions]);

	const selectObject = { value: "*", label: "Select All" };

	const handleSelectBoxClick = () => {
		setOpen(!open);
	};

	const handleSearch = () => {
		//  Search
		let tempOptions = options.filter((option) =>
			option.label
				.toLowerCase()
				.includes(event.target.value.toLowerCase())
		);
		return tempOptions;
	};

	/* this is checking whether */
	const setSelectAll = (options, selectedOptions) => {
		let isSelectAll = true;
		options.forEach((ele) => {
			if (!selectedOptions[ele.value]) isSelectAll = false;
		});
		if (isSelectAll) {
			setSelectAllChecked(true);
		} else {
			setSelectAllChecked(false);
		}
	};
	// key press handling
	//TODO add scroll on arrow key up & down
	const handleInputKeyDown = (event) => {
		if (event.keyCode === 8 && searchTerm === "") {
			//BACKSPACE
			setSelectedOptions((prev) => {
				let temp = { ...prev };
				let keyArr = Object.keys(temp);
				delete temp[keyArr[keyArr.length - 1]];
				return temp;
			});
		}
		if (event.keyCode === 40) {
			//DOWN
			setHighlightedIndex((prev) => {
				const next = prev + 1;
				return next >= filteredOptions.length ? 0 : next;
			});
		} else if (event.keyCode === 38) {
			//UP
			setHighlightedIndex((prev) => {
				const next = prev - 1;
				return next < 0 ? options.length - 1 : next;
			});
		} else if (event.keyCode === 13) {
			//ENTER
			if (highlightedIndex !== -1) {
				let temp = filteredOptions[highlightedIndex];
				setSelectedOptions((prev) => ({ ...prev, [temp.value]: true }));
			}
		}
	};

	const handleInputChange = (event) => {
		if (!open) {
			setOpen(true);
		}
		setSearchTerm(event.target.value);
		const updatedOptions = handleSearch();
		setFilteredOptions(updatedOptions);
		// Check for select all
		setSelectAll(updatedOptions, selectedOptions);
	};

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
			// select all
			let allOptions = {};
			filteredOptions.forEach((option) => {
				allOptions[option.value] = true;
			});
			setSelectedOptions((prev) => ({ ...prev, ...allOptions }));
			setSelectAllChecked((prev) => !prev);
		} else {
			let temp = { ...selectedOptions, [optionValue]: true };
			setSelectAll(filteredOptions, temp);
			setSelectedOptions((prevState) => ({
				...prevState,
				[optionValue]: true,
			}));
		}
	};
	/* handle when user de-select a option */
	const handleOptionMultiDeselect = (optionValue) => {
		console.log("handleOptionMultiDeselect", optionValue);
		if (optionValue === "*") {
			console.log("*", optionValue);
			// deselect all
			setSelectAllChecked(false);
			if (searchTerm !== "") {
				console.log("searchTerm", searchTerm);
				setSelectedOptions((prev) => {
					let temp = { ...prev };
					filteredOptions.forEach((option) => {
						delete temp[option.value];
					});
					return temp;
				});
			} else setSelectedOptions({});
		} else {
			setSelectedOptions((prev) => {
				let temp = { ...prev };
				delete temp[optionValue];
				return temp;
			});
			setSelectAllChecked(false); //TODO FOR DELETE
		}
	};

	/* handle when users click cross on tags */
	const onDeleteHandler = (key) => {
		setSelectedOptions((prev) => {
			let temp = { ...prev };
			delete temp[key];
			return temp;
		});
		setSelectAllChecked(false); //TODO TEST FOR DELETE
	};

	return (
		<>
			<Flex
				w="500px"
				cursor="pointer"
				direction="column"
				onClick={() => inputRef.current.focus()}
			>
				<Flex
					minH="48px"
					w="100%"
					px="20px"
					align="center"
					position="relative"
					// justify="space-between"
					transition="all 100ms ease 0s"
					border="card"
					borderRadius="10px"
					onClick={handleSelectBoxClick}
				>
					<Flex
						w="auto"
						gap="5px"
						overflowX="scroll"
						css={{
							"&::-webkit-scrollbar": {
								display: "none",
							},
							"&::-webkit-scrollbar-track": {
								display: "none",
							},
						}}
					>
						{/* {placeholder} */}
						{Object.keys(selectedOptions).map((name, index) => {
							return getSelectedStyle(
								name,
								index,
								onDeleteHandler
							);
						})}
						{/* {!(selectedOptionsLength > 0) ? (
								<Text>{placeholder}</Text>
							) : (
								getSelectedStyle(selectedOptions)
								// selectedOptions
							)} */}
					</Flex>
					<Flex w="auto" align="center">
						{searchable && (
							<Input
								w="100%"
								minW="2px"
								type="text"
								// opacity="1"
								padding="2px 8px"
								outline="none"
								border="none"
								value={searchTerm}
								onChange={handleInputChange}
								onKeyDown={handleInputKeyDown}
								ref={inputRef}
								_focus={{
									border: "none",
									outline: "none",
									boxShadow: "none",
								}}
							/>
						)}
					</Flex>
					<Flex ml="auto">
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
									bg="divider"
								>
									<Checkbox
										variant="rounded"
										// isChecked={
										// 	selectAllChecked ||
										// 	selectedOptions.includes(selectObject.value)
										// }
										isChecked={
											selectAllChecked
											//  ||	selectedOptions[selectObject.value]
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
							{filteredOptions.map((row, index) => {
								return (
									<Flex
										key={index}
										h="50px"
										w="100%"
										direction="column"
										px="5"
										py={{ base: "2.5", md: "3" }}
										_odd={{
											backgroundColor: "shade",
										}}
										bg={
											highlightedIndex === index &&
											"red.100"
										}
										onKeyDown={handleInputKeyDown}
									>
										<Checkbox
											variant="rounded"
											// isChecked={
											// 	selectAllChecked ||
											// 	selectedOptions.includes(row.value)
											// }
											isChecked={
												selectAllChecked ||
												selectedOptions[row.value] !==
													undefined
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
								);
							})}
						</Flex>
					)}
				</Flex>
			</Flex>
		</>
	);
};

export default Select;

const getSelectedStyle = (name, index, onDeleteHandler) => {
	return (
		<>
			<Flex
				gap={4}
				key={index}
				bg="#EEF1FF"
				maxW={{ base: "140px" }}
				h={{ base: "30px" }}
				align="center"
				justify="center"
				px="12px"
			>
				<Flex
					fontSize={{ base: "12px" }}
					textColor="light"
					maxW={{ base: "90px" }}
				>
					{name}
				</Flex>
				<Flex>
					<Icon
						name="arrow-down"
						width="12px"
						onClick={(e) => {
							onDeleteHandler(name);
							e.stopPropagation();
						}}
					/>
				</Flex>
			</Flex>
		</>
	);
};
