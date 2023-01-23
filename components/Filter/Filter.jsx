import React from "react";

import {
	Box,
	Button,
	Checkbox,
	Drawer,
	DrawerBody,
	DrawerContent,
	DrawerHeader,
	DrawerOverlay,
	Flex,
	Input,
	Text,
	useDisclosure,
} from "@chakra-ui/react";
import { Buttons, IconButtons, Icon } from "..";
/**
 * A <Filter> component
 * TODO: Write more description here
 * @arg 	{Object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @example	`<Filter></Filter>`
 */

// const [count, setCount] = useState(0);		// TODO: Edit state as required

//  useEffect(() => {
// 	// TODO: Add your useEffect code here and update dependencies as required
//  }, []);

function Filter() {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const btnRef = React.useRef();

	return (
		<>
			<Button
				ref={btnRef}
				onClick={onOpen}
				h={"48px"}
				w={"122px"}
				bg={"#FFFFFF"}
				border="1px solid #11299E"
				boxShadow="box-shadow: 0px 3px 10px #11299E1A"
				_hover={{
					bg: "white",
				}}
				_active={{
					bg: "white",
				}}
			>
				<Text
					color="#11299E"
					display={"flex"}
					alignItems={"center"}
					fontSize={"18px"}
				>
					<Icon
						name="filter"
						width="24px"
						height="25px"
						size={"30px"}
						style={{ marginRight: ".3rem" }}
					/>
					Filter
				</Text>
				{/* //TODO need to add icon here as well */}
			</Button>

			<Drawer
				isOpen={isOpen}
				placement="right"
				onClose={onClose}
				finalFocusRef={btnRef}
				size={"md"}
			>
				<DrawerOverlay />
				<DrawerContent>
					<DrawerHeader>
						<Box display={"flex"} justifyContent={"space-between"}>
							<Box
								display={"flex"}
								alignItems={"center"}
								fontWeight={"semibold"}
								fontSize={"30px"}
							>
								<Icon
									name="filter"
									width="40px"
									height="40px"
									size={"30px"}
									style={{ marginRight: ".3rem" }}
								/>
								Filter
							</Box>
							<Box
								display={"flex"}
								alignItems={"center"}
								onClick={onClose}
								fontSize={"18px"}
								cursor={"pointer"}
								color={"light"}
							>
								<Icon
									name="close-outline"
									width="24px"
									height="24px"
									style={{ marginRight: ".3rem" }}
								/>
								Close
							</Box>
							{/* //TODO update this to button after updating buttons to accept multiple colors */}
						</Box>
					</DrawerHeader>

					<DrawerBody>
						<Box mt={2}>
							<Text
								color={"light"}
								fontWeight={"semibold"}
								fontSize={"18px"}
							>
								Filter by profile type
							</Text>
							<Flex wrap={"wrap"} gap={24} mt="3">
								<Checkbox colorScheme="orange">
									iMerchant
								</Checkbox>
								<Checkbox colorScheme="orange">Seller</Checkbox>
							</Flex>
						</Box>
						<Box mt={16}>
							<Text
								color={"light"}
								fontWeight={"semibold"}
								fontSize={"18px"}
							>
								Filter by account status
							</Text>
							<Flex wrap={"wrap"} gap={24} mt="3">
								<Checkbox colorScheme="orange">Active</Checkbox>
								<Checkbox colorScheme="orange">
									Inactive
								</Checkbox>
							</Flex>
						</Box>
						<Box mt={16}>
							<Text>Filter by activation date range</Text>
							<Flex wrap={"wrap"} mt="3">
								<Input
									w={"3xs"}
									size="md"
									type="date"
									min="1970-01-01"
									max="2100-12-31"
								/>
								<Input
									w={"3xs"}
									size="md"
									type="date"
									min="1970-01-01"
									max="2100-12-31"
								/>
							</Flex>
						</Box>
						<Box
							display={"flex"}
							justifyContent={"flex-end"}
							gap={16}
							mt={44}
						>
							<IconButtons
								title="Clear All"
								colorType="0"
								textStyle={{
									fontSize: "20px",
								}}
							></IconButtons>
							<Buttons
								w="118px"
								h="64px"
								fontSize="20px"
								title="Apply"
							></Buttons>
						</Box>
					</DrawerBody>
				</DrawerContent>
			</Drawer>
		</>
	);
}
export default Filter;
