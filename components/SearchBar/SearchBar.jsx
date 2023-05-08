import { Flex } from "@chakra-ui/react";
import { useState } from "react";
import { Button, Icon, Input } from "..";

/**
 * A <SearchBar> component
 * TODO: A reusable component for SearchBar
 * @arg 	{Object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @example	`<SearchBar></SearchBar>`
 */
const SearchBar = ({
	type,
	setSearch,
	setIsSearching = () => {},
	minSearchLimit = 0,
	maxSearchLimit = 10,
	placeholder,
	showButton = false,
	seachContStyle,
	btnTitle,
	btnStyle,
}) => {
	const [value, setValue] = useState("");
	const [errorMsg, setErrorMsg] = useState(false);
	const [invalid, setInvalid] = useState(true);

	const handleKeyDown = (e) => {
		if (e.key === "Enter") {
			if (
				value.length >= minSearchLimit &&
				value.length <= maxSearchLimit
			) {
				setIsSearching(true);
				setSearch(value);
				setInvalid(false);
			} else {
				setInvalid(true);
				setErrorMsg("Please enter correct value");
			}
		}
		if (e.key !== "Enter" && invalid) {
			setInvalid(false);
		}
	};

	const handleBtnClick = () => {
		if (value.length >= minSearchLimit && value.length <= maxSearchLimit) {
			setIsSearching(true);
			setSearch(value);
			setInvalid(false);
		} else {
			setInvalid(true);
			setErrorMsg("Please enter correct value");
		}
	};

	const handleChange = (e) => {
		const inputValue = e.target.value;
		//TODO prevent user from entering letter 'e' when type is number
		if (inputValue.length <= maxSearchLimit) {
			//when type is number, this will prevent user from entering more value
			setValue(inputValue);
		}
	};

	return (
		<Flex
			w={{ base: "100%", md: "auto", xl: "600px" }}
			align="flex-start"
			gap={showButton ? "2" : null}
			{...seachContStyle}
		>
			<Input
				placeholder={placeholder || "Search by name or mobile number"}
				inputLeftElement={<Icon name="search" width="18px" />}
				inputLeftElementStyle={{ color: "light" }}
				type={type}
				radius={10}
				maxLength={maxSearchLimit} //will work when type is text
				value={value}
				invalid={invalid}
				errorMsg={errorMsg}
				onChange={handleChange}
				onKeyDown={handleKeyDown}
				_placeholder={{ fontSize: "sm" }}
			/>
			{showButton ? (
				<Button size="lg" onClick={handleBtnClick} {...btnStyle}>
					{btnTitle || "Search"}
				</Button>
			) : null}
		</Flex>
	);
};

export default SearchBar;
