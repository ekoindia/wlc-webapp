import { Box, Flex, VStack } from "@chakra-ui/react";
import { useDebouncedState } from "hooks";
import { useEffect, useRef, useState } from "react";
import { Icon, Input } from "../";

/**
 * Props for the SearchBar component.
 * @interface SearchBarProps
 */
export interface SearchBarProps {
	/** Optional class name for the wrapper element */
	className?: string;
	/** HTML input type (e.g., "text", "number", "email") */
	type?: string;
	/** Callback function triggered when a valid search is submitted */
	setSearch: (_value: string) => void;
	/** Optional callback triggered immediately when search execution begins */
	setIsSearching?: (_isSearching: boolean) => void;
	/** Minimum number of characters required to trigger a search or show dropdown items */
	minSearchLimit?: number;
	/** Maximum number of characters allowed in the search input */
	maxSearchLimit?: number;
	/** Placeholder text displayed when the input is empty */
	placeholder?: string;
	/** Optional boolean to control legacy button display (deprecated for RightIcon) */
	showButton?: boolean;
	/** Custom style object applied to the search container Flex element */
	seachContStyle?: any;

	// --- Dropdown Feature Props ---

	/** Array of objects to populate the dropdown suggestions list */
	dataList?: any[];
	/** Custom render function for each dropdown item. Receives the row data as an argument. */
	renderItem?: (_item: any) => React.ReactNode;
	/** Callback function triggered when a dropdown suggestion is clicked */
	onItemSelect?: (_item: any) => void;
	/** Array of object keys in `dataList` to perform fuzzy search against (ignoring case and spaces) */
	searchKeys?: string[];
	/** Maximum number of suggested items to display in the dropdown (default: 5) */
	maxDropdownItems?: number;
	/** Approximate height of a single dropdown item, useful for virtualization */
	dropdownItemHeight?: number;
}

/**
 * A versatile SearchBar component supporting type-ahead debounced fuzzy searching,
 * dropdown suggestions, and customizable search key fields.
 * @param {SearchBarProps} props
 * @returns {JSX.Element}
 */
const SearchBar = ({
	type = "text",
	setSearch,
	setIsSearching = () => {},
	minSearchLimit = 0,
	maxSearchLimit = 10,
	placeholder,
	seachContStyle,
	dataList,
	renderItem,
	onItemSelect,
	searchKeys = ["name", "mobile"],
	maxDropdownItems = 5,
}: SearchBarProps) => {
	const [value, setValue] = useState("");
	const [debouncedValue, setDebouncedValue] = useDebouncedState("", 300);
	const [errorMsg, setErrorMsg] = useState("");
	const [invalid, setInvalid] = useState(false);
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const [filteredList, setFilteredList] = useState<any[]>([]);
	const wrapperRef = useRef<HTMLDivElement>(null);

	// Ensure dropdown closes on outside click
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (
				wrapperRef.current &&
				!wrapperRef.current.contains(event.target)
			) {
				setIsDropdownOpen(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	// Filter list when debounced value changes
	useEffect(() => {
		if (
			!dataList ||
			dataList.length === 0 ||
			!debouncedValue ||
			debouncedValue.length < minSearchLimit
		) {
			setFilteredList([]);
			setIsDropdownOpen(false);
			return;
		}

		const cleanQuery = debouncedValue.toLowerCase().replace(/\s+/g, "");
		const results = dataList.filter((item) => {
			return searchKeys.some((key) => {
				const itemValue = item[key];
				if (itemValue !== null && itemValue !== undefined) {
					const cleanItemValue = String(itemValue)
						.toLowerCase()
						.replace(/\s+/g, "");
					return cleanItemValue.includes(cleanQuery);
				}
				return false;
			});
		});

		setFilteredList(results.slice(0, maxDropdownItems));
		setIsDropdownOpen(results.length > 0);
	}, [
		debouncedValue,
		dataList,
		minSearchLimit,
		searchKeys,
		maxDropdownItems,
	]);

	const triggerSearch = (searchValue: string) => {
		if (
			searchValue.length >= minSearchLimit &&
			searchValue.length <= maxSearchLimit
		) {
			setIsSearching(true);
			setSearch(searchValue);
			setInvalid(false);
			setIsDropdownOpen(false); // Close dropdown on hard search
		} else {
			setInvalid(true);
			setErrorMsg("Please enter correct value");
		}
	};

	const handleKeyDown = (e) => {
		if (e.key === "Enter") {
			triggerSearch(value);
		}
		if (e.key !== "Enter" && invalid) {
			setInvalid(false);
		}
	};

	const handleBtnClick = () => {
		triggerSearch(value);
	};

	const handleChange = (e) => {
		const inputValue = e.target.value;
		if (inputValue.length <= maxSearchLimit) {
			setValue(inputValue);
			setDebouncedValue(inputValue);
		}
	};

	const width = { base: "100%", md: "350px", xl: "400px", "2xl": "500px" };

	return (
		<Flex
			w={width}
			align="flex-start"
			position="relative"
			ref={wrapperRef}
			{...seachContStyle}
		>
			<VStack w="100%" align="stretch" spacing={0} position="relative">
				<Input
					placeholder={placeholder || ""}
					inputRightElement={
						<Box
							display="flex"
							alignItems="center"
							justifyContent="center"
							height="100%"
							cursor="pointer"
							onClick={handleBtnClick}
							px={2}
						>
							<Icon
								name="search"
								size="18px"
								color="primary.DEFAULT"
							/>
						</Box>
					}
					type={type}
					borderRadius={10}
					maxLength={maxSearchLimit}
					value={value}
					invalid={invalid}
					errorMsg={errorMsg}
					onChange={handleChange}
					onKeyDown={handleKeyDown}
					_placeholder={{ fontSize: "xs" }}
				/>

				{/* Dropdown */}
				{isDropdownOpen && dataList && (
					<Box
						position="absolute"
						top="calc(100% + 4px)"
						left={0}
						right={0}
						bg="white"
						boxShadow="0px 4px 20px rgba(0, 0, 0, 0.08)"
						borderRadius="lg"
						zIndex={10}
						maxH="300px"
						overflowY="auto"
						border="1px solid"
						borderColor="gray.100"
						py={2}
					>
						{filteredList.map((item, idx) => (
							<Box
								key={idx}
								px={4}
								py={3}
								mx={2}
								my={1}
								borderRadius="md"
								transition="all 0.2s"
								_hover={{
									bg: "gray.50",
									transform: "scale(1.01)",
								}}
								cursor="pointer"
								onClick={() => {
									setIsDropdownOpen(false);
									setValue(item[searchKeys[0]] || "");
									setDebouncedValue("");
									if (onItemSelect) {
										onItemSelect(item);
									}
								}}
							>
								{renderItem ? (
									renderItem(item)
								) : (
									<Box fontSize="sm">
										{item[searchKeys[0]]}
									</Box>
								)}
							</Box>
						))}
					</Box>
				)}
			</VStack>
		</Flex>
	);
};

export default SearchBar;
