import { Checkbox, Flex, Input, Text } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { Icon } from "..";

/**
 * A <MultiSelect> select component
 * with multiselect, search, checkbox functionality
 * @param	{Array}	[prop.options]	options (array of objects) from which multiselect component will populate data and let user select.
 * @param	{string}	[prop.placeholder]	placeholder to show when nothing is selected.
 * @param	{object}	[prop.renderer]	object which contains label & value, which will let multiselect component know what is going to be the label and value from particular data.
 * @param	{string}	[prop.setData]	setter which parent component will pass to multiselect to get the data/values/options which is selected by the user.
 * @example	`<MultiSelect options={options}	renderer={renderer} placeholder = "Please Select Something"/>`
 */
const MultiSelect = ({
	options,
	placeholder = "-- Select --",
	renderer,
	setData,
}) => {
	const inputRef = useRef();
	const [open, setOpen] = useState(false);
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedOptions, setSelectedOptions] = useState({});
	const [selectedOptionsArr, setSelectedOptionsArr] = useState([]);
	const [highlightedIndex, setHighlightedIndex] = useState(-1);
	const [selectAllChecked, setSelectAllChecked] = useState(false);
	const [filteredOptions, setFilteredOptions] = useState(options);

	/* needed for select all option */
	const selectObject = { value: "*", label: "Select All" };

	useEffect(() => {
		let keys = Object.keys(selectedOptions);
		if (keys?.length === filteredOptions.length) {
			setSelectAllChecked(true);
		} else {
			setSelectAllChecked(false);
		}
		setSelectAll(filteredOptions, selectedOptions);
		setSelectedOptionsArr(keys);
		setData(keys);
	}, [selectedOptions]);

	const handleSelectBoxClick = () => {
		setOpen(!open);
	};

	const handleSearch = (event) => {
		//  Search
		let tempOptions = options.filter((option) =>
			option[renderer.label]
				// option.label
				.toLowerCase()
				.includes(event.target.value.toLowerCase())
		);
		return tempOptions;
	};

	/* this is checking whether */
	const setSelectAll = (options, selectedOptions) => {
		let isSelectAll = true;
		options.forEach((ele) => {
			if (!selectedOptions[ele[renderer.value]]) isSelectAll = false;
			// if (!selectedOptions[ele.value]) isSelectAll = false;
		});
		if (isSelectAll) {
			setSelectAllChecked(true);
		} else {
			setSelectAllChecked(false);
		}
	};

	// key press handling
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
			event.preventDefault();
			setHighlightedIndex((prev) => {
				const next = prev + 1;
				return next >= filteredOptions.length ? 0 : next;
			});
		} else if (event.keyCode === 38) {
			//UP
			event.preventDefault();
			setHighlightedIndex((prev) => {
				const next = prev - 1;
				return next < 0 ? filteredOptions.length - 1 : next;
			});
		} else if (event.keyCode === 13) {
			//ENTER
			if (highlightedIndex !== -1) {
				let valObj = filteredOptions[highlightedIndex];
				if (!selectedOptions[valObj[renderer.value]]) {
					// if (!selectedOptions[valObj.value]) {
					setSelectedOptions((prev) => ({
						...prev,
						[valObj[renderer.value]]: true,
						// [valObj.value]: true,
					}));
				} else {
					setSelectedOptions((prev) => {
						let temp = { ...prev };
						delete temp[valObj[renderer.value]];
						// delete temp[valObj.value];
						return temp;
					});
				}
			}
		}
	};

	const handleInputChange = (event) => {
		if (!open) {
			setOpen(true);
		}
		setSearchTerm(event.target.value);
		const updatedOptions = handleSearch(event);
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
				console.log("option", option);
				allOptions[option[renderer.value]] = true;
				// allOptions[option.value] = true;
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
		if (optionValue === "*") {
			// deselect all
			setSelectAllChecked(false);
			if (searchTerm !== "") {
				setSelectedOptions((prev) => {
					let temp = { ...prev };
					filteredOptions.forEach((option) => {
						delete temp[option[renderer.value]];
						// delete temp[option.value];
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
			setSelectAllChecked(false);
		}
	};

	/* handle when users click cross on tags */
	const onDeleteHandler = (key) => {
		setSelectedOptions((prev) => {
			let temp = { ...prev };
			delete temp[key];
			return temp;
		});
		if (selectAllChecked) {
			setSelectAllChecked(false);
		}
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
						{selectedOptionsArr.length > 0 ? (
							selectedOptionsArr.map((name, index) =>
								getSelectedStyle(name, index, onDeleteHandler)
							)
						) : searchTerm === "" ? (
							<Text>{placeholder}</Text>
						) : null}
					</Flex>
					<Flex w="auto" align="center">
						<Input
							w="100%"
							minW="2px"
							type="text"
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
					</Flex>
					<Flex ml="auto">
						<Icon
							name={open ? "caret-up" : "caret-down"}
							height="14px"
							width="10px"
						/>
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
							{filteredOptions.length > 0 && (
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
										isChecked={selectAllChecked}
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
										style={{
											backgroundColor:
												highlightedIndex === index &&
												"#e6e6e6",
										}}
										onKeyDown={handleInputKeyDown}
									>
										<Checkbox
											variant="rounded"
											isChecked={
												selectAllChecked ||
												selectedOptions[
													row[renderer.value]
												] !== undefined
											}
											// isChecked={
											// 	selectAllChecked ||
											// 	selectedOptions[row.value] !==
											// 		undefined
											// }
											onChange={(event) => {
												handleClick(
													event.target.checked,
													row[renderer.value]
													// row.value
												);
											}}
										>
											{row[renderer.label]}
											{/* {row.label} */}
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

export default MultiSelect;

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
						name="close"
						width="8px"
						color="accent.DEFAULT"
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
