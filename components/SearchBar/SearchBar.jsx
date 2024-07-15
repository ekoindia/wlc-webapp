import { Flex } from "@chakra-ui/react";
import { useState } from "react";
import { Button, Icon, Input } from "..";

/**
 * A <SearchBar> component
 * TODO: A reusable component for SearchBar
 * @param 	{object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @param prop.type
 * @param prop.setSearch
 * @param prop.setIsSearching
 * @param prop.minSearchLimit
 * @param prop.maxSearchLimit
 * @param prop.placeholder
 * @param prop.showButton
 * @param prop.seachContStyle
 * @param prop.btnTitle
 * @param prop.btnStyle
 * @param prop.loading
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
	loading = false,
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

	const width = showButton
		? { base: "100%", md: "450px", xl: "500px", "2xl": "600px" }
		: { base: "100%", md: "350px", xl: "400px", "2xl": "500px" };

	return (
		<Flex
			w={width}
			align="flex-start"
			gap={showButton ? "2" : null}
			{...seachContStyle}
		>
			<Input
				placeholder={placeholder || ""}
				inputLeftElement={
					<Icon name="search" size="18px" color="light" />
				}
				type={type}
				borderRadius={10}
				maxLength={maxSearchLimit} //will work when type is text
				value={value}
				invalid={invalid}
				errorMsg={errorMsg}
				onChange={handleChange}
				onKeyDown={handleKeyDown}
				_placeholder={{ fontSize: "xs" }}
			/>
			{showButton ? (
				<Button
					size="lg"
					loading={loading}
					onClick={handleBtnClick}
					{...btnStyle}
				>
					{btnTitle || "Search"}
				</Button>
			) : null}
		</Flex>
	);
};

export default SearchBar;
