import { Box, Checkbox, Flex, Input, keyframes, Text } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { Tag } from ".";
import { Icon } from "..";

const animSlideDown = keyframes`
	from {opacity: 0; transform: scaleY(0); transform-origin:top;}
	to {opacity: 1; transform: none; transform-origin:top;}
`;

/**
 * A MultiSelect component
 * with multiselect, search, checkbox functionality
 * @param	{Array}	[prop.options]	options (array of objects) from which multiselect component will populate data and let user select.
 * @param	{string}	[prop.placeholder]	placeholder to show when nothing is selected.
 * @param	{object}	[prop.renderer]	object which contains label & value, which will let multiselect component know what is going to be the label and value from particular data.
 * @param	{string}	[prop.onChange]	setter which parent component will pass to multiselect to get the data/values/options which is selected by the user.
 * @example	`<MultiSelect options={options}	renderer={renderer} placeholder = "Please Select Something"/>`
 */
const MultiSelect = ({
	options,
	placeholder = "-- Select --",
	renderer,
	onChange = () => {},
	label,
}) => {
	const inputRef = useRef();
	const [open, setOpen] = useState(false);
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedOptions, setSelectedOptions] = useState({});
	const [highlightedIndex, setHighlightedIndex] = useState(-1);
	const [selectAllChecked, setSelectAllChecked] = useState(false);
	const [filteredOptions, setFilteredOptions] = useState(options);
	const selectedOptionsLength = Object.keys(selectedOptions)?.length || 0;

	/* needed for select all option */
	const selectAllObj = { value: "*", label: "Select All" };

	useEffect(() => {
		setFilteredOptions(options);
	}, [options]);

	useEffect(() => {
		let _keys = Object.keys(selectedOptions);
		checkAndSetSelectAll(filteredOptions, selectedOptions);
		onChange(_keys);
	}, [selectedOptions]);

	const handleSelectBoxClick = () => {
		setOpen(!open);
	};

	const handleSearch = (searchedTerm) => {
		//  Search
		let _filteredOptions = options.filter((option) =>
			option[renderer.label]
				.toLowerCase()
				.includes(searchedTerm.toLowerCase())
		);
		return _filteredOptions;
	};

	/**
	 * Checking whether select all should be enabled or not
	 * @param {Array} _filteredOptions
	 * @param {Object} _selectedOptions
	 */
	const checkAndSetSelectAll = (_filteredOptions, _selectedOptions) => {
		if (selectedOptionsLength > 0) {
			let found = true;
			for (const item of _filteredOptions) {
				if (_selectedOptions[item[renderer.value]] === undefined) {
					found = false;
					break;
				}
			}
			setSelectAllChecked(found);
		}
	};

	// key press handling
	const handleInputKeyDown = (event) => {
		if (
			event.keyCode === 8 &&
			searchTerm === "" &&
			Object.keys(selectedOptions).length > 0
		) {
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
				let highlightedObj = filteredOptions[highlightedIndex];
				if (!selectedOptions[highlightedObj[renderer.value]]) {
					setSelectedOptions((prev) => ({
						...prev,
						[highlightedObj[renderer.value]]:
							highlightedObj[renderer.label],
					}));
				} else {
					setSelectedOptions((prev) => {
						let temp = { ...prev };
						delete temp[highlightedObj[renderer.value]];
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
		const _searchedTerm = event.target.value;
		setSearchTerm(_searchedTerm);
		const _filteredOptions = handleSearch(_searchedTerm);
		setFilteredOptions(_filteredOptions);
		// Check for select all
		checkAndSetSelectAll(_filteredOptions, selectedOptions);
	};

	/* handle when user click on option */
	const handleClick = (checked, value, label) => {
		if (checked) {
			handleOptionMultiSelect(value, label);
		} else {
			handleOptionMultiDeselect(value);
		}
	};

	/* handle when user select a option */
	const handleOptionMultiSelect = (optionValue, optionLabel) => {
		if (optionValue === "*") {
			// select all
			let allOptions = {};
			filteredOptions.forEach((option) => {
				allOptions[option[renderer.value]] = option[renderer.label];
			});
			setSelectedOptions((prev) => ({ ...prev, ...allOptions }));
			setSelectAllChecked((prev) => !prev);
		} else {
			let _selectedOptions = {
				...selectedOptions,
				[optionValue]: optionLabel,
			};
			checkAndSetSelectAll(filteredOptions, _selectedOptions);
			setSelectedOptions((prevState) => ({
				...prevState,
				..._selectedOptions,
			}));
		}
	};

	/* handle when user de-select a option */
	const handleOptionMultiDeselect = (optionValue) => {
		console.log("optionValue", optionValue);
		if (optionValue === "*") {
			// deselect all
			setSelectAllChecked(false);
			if (searchTerm !== "") {
				setSelectedOptions((prev) => {
					let temp = { ...prev };
					filteredOptions.forEach((option) => {
						delete temp[option[renderer.value]];
					});
					return temp;
				});
			} else setSelectedOptions({});
		} else {
			setSelectedOptions((prev) => {
				let temp = { ...prev };
				console.log("temp", temp);
				delete temp[optionValue];
				return temp;
			});
			setSelectAllChecked(false);
		}
	};

	/* handle when users click cross on tags */
	const onDelete = (value) => {
		setSelectedOptions((prev) => {
			let temp = { ...prev };
			delete temp[value];
			return temp;
		});
		if (selectAllChecked) {
			setSelectAllChecked(false);
		}
	};

	return (
		<Flex direction="column" rowGap="2">
			{label ? (
				<Box w="100%">
					<Text fontSize="md" fontWeight="semibold">
						{label}
					</Text>
				</Box>
			) : null}
			<Flex
				w="100%"
				cursor="pointer"
				direction="column"
				position="relative"
				onClick={() => inputRef.current.focus()}
			>
				<Flex
					minH="48px"
					w="100%"
					p="0px 10px 0px 20px"
					align="center"
					position="relative"
					transition="all 100ms ease 0s"
					border="card"
					borderRadius="6px"
					mb="1"
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
						{selectedOptionsLength > 0 ? (
							Object.entries(selectedOptions)?.map(
								([value, label]) => (
									<Tag
										key={value}
										{...{
											value,
											label,
											onDelete,
										}}
									/>
								)
							)
						) : searchTerm === "" ? (
							<Text fontSize="sm" whiteSpace="nowrap">
								{placeholder}
							</Text>
						) : null}
					</Flex>
					<Flex w="auto" align="center">
						<Input
							minW="2px"
							type="text"
							px="8px"
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
							size="14px"
						/>
					</Flex>
				</Flex>

				{open && (
					<Flex
						className="customScrollbars"
						position="absolute"
						top="100%"
						zIndex="1"
						bg="white"
						w="100%"
						borderRadius="6px"
						direction="column"
						maxH={{ base: "240px", md: "360px" }}
						overflowY="auto"
						border="card"
						boxShadow="basic"
						animation={`${animSlideDown} ease-out 0.1s forwards`}
					>
						{/* Show select all options */}
						{filteredOptions?.length > 0 && (
							<Flex
								key={selectAllObj.label}
								direction="column"
								justify="center"
								bg="divider"
								h="50px"
								w="100%"
								px="5"
								py={{ base: "2.5", md: "3" }}
							>
								<Checkbox
									isChecked={selectAllChecked}
									onChange={(event) => {
										handleClick(
											event.target.checked,
											selectAllObj.value,
											selectAllObj.label
										);
									}}
								>
									<Text fontSize="sm">
										{selectAllObj.label}
									</Text>
								</Checkbox>
							</Flex>
						)}
						{filteredOptions?.map((row, index) => {
							return (
								<Flex
									key={`${index}-${row.DisplayName}`}
									direction="column"
									justify="center"
									h="50px"
									w="100%"
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
										isChecked={
											selectAllChecked ||
											selectedOptions[
												row[renderer.value]
											] !== undefined
										}
										onChange={(event) => {
											handleClick(
												event.target.checked,
												row[renderer.value],
												row[renderer.label]
											);
										}}
									>
										<Text fontSize="sm">
											{row[renderer.label]}
										</Text>
									</Checkbox>
								</Flex>
							);
						})}
					</Flex>
				)}
			</Flex>
		</Flex>
	);
};

export default MultiSelect;
