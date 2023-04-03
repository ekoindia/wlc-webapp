import { Box, Center, Input } from "@chakra-ui/react";
import { useState } from "react";
import { Icon } from "..";

export function SearchBar(props) {
  const { setSearch, searchlimit } = props;
  const [value, setValue] = useState("");
  const [isInvalid, setIsInvalid] = useState(false);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && value.length === searchlimit) {
      console.log(value);
      setSearch(value);
      setIsInvalid(false);
    } else {
      setIsInvalid(true);
    }
  };

  const handleChange = (e) => {
    const inputValue = e.target.value;
    if (inputValue.length <= searchlimit) {
      setValue(inputValue);
      setIsInvalid(false);
    } else {
      setIsInvalid(true);
    }
  };

  return (
    <Box
      position="relative"
      w={"100%"}
      h={{ base: "3rem", md: "2.5rem", "2xl": "3rem" }}
      width={{
        base: "100%",
        md: "50vw",
        lg: "30vw",
        xl: "30vw",
        "2xl": "30vw",
      }}
    >
      <Input
        value={value}
        placeholder="Search by name or mobile number"
        size="lg"
        borderRadius="10px"
        w="100%"
        h="100%"
        fontSize={{ base: "xs", "2xl": "sm" }}
        border=" 1px solid #D2D2D2"
        bg="white"
        _focus={{
          bg: "focusbg",
          boxShadow: "0px 3px 6px #0000001A",
          border: isInvalid ? "1px solid #FF0000" : "1px solid #D2D2D2",
          boxShadow:isInvalid ? "0 0 2px 2px rgba(255, 0, 0, 0.5)" : ""
        }}
        pl={{ base: "30px", lg: "35px", "2xl": "55px" }}
        onKeyDown={handleKeyDown}
        onChange={handleChange}
      />
      <Center
				position="absolute"
				top="0"
				left="0"
				width={{ base: "35px", lg: "40px", "2xl": "60px" }}
				height="100%"
				zIndex="1"
				// h="48px"
				color={"light"}
			>
				<Icon name="search" height="40%" />
			</Center>
			{/* {value !== "" && (
				<Box
					position="absolute"
					top="106%"
					width="100%"
					h="214px"
					zIndex="1"
					bg="white"
					borderRadius="10"
					border="1px solid #D2D2D2"
					p="20px 29px 24px 20px "
				>
					<VStack
						align="flex-start"
						divider={<StackDivider />}
						spacing="15px"
					>
						<Box>
							<Text as="p" fontSize="sm">
								9891745076
							</Text>
							<Text as="p" fontSize="10px" color="accent.DEFAULT">
								Rajesh Enterprises
							</Text>
						</Box>
						<Box>
							<Text as="p" fontSize="sm">
								9891745076
							</Text>
							<Text as="p" fontSize="10px" color="accent.DEFAULT">
								Rajesh Enterprises
							</Text>
						</Box>
						<Box>
							<Text as="p" fontSize="sm">
								9891745076
							</Text>
							<Text as="p" fontSize="10px" color="accent.DEFAULT">
								Rajesh Enterprises
							</Text>
						</Box>
					</VStack>
				</Box>
			)} */}
		</Box>
	);
}

export default SearchBar;
