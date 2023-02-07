import {
	Box,
	Divider,
	Flex,
	Heading,
	Image,
	Text,
	useMediaQuery,
} from "@chakra-ui/react";
import { Buttons, Cards, Icon, IconButtons } from "../";
import Router from "next/router";

const DocPane = () => {
	const [isSmallerThan440] = useMediaQuery("(max-width:440px)");
	return (
		<Cards>
			<Heading
				fontSize={{ base: 16, md: 18 }}
				fontWeight="semibold"
				color={"light"}
			>
				Document Center
			</Heading>

			<Flex direction={"column"} spacing="15px" mt={"5"}>
				{/* <Box h="439px"> */}
				<Box h="439px" fontSize={{ base: "14px", md: "16px" }}>
					<Box
						display={"flex"}
						alignContent={"center"}
						justifyContent={"space-between"}
					>
						<Flex align={"center"}>
							<Image
								src="/images/seller_logo.jpg"
								h={42}
								w={42}
								borderRadius={"5"}
							/>
							<Text>Customer Photo</Text>
						</Flex>
						<IconButtons
							onClick={() =>
								Router.push(
									"/admin/my-network/profile/up-sell-info"
								)
							}
							title="Download"
							iconPos="left"
							iconName="file-download"
							iconStyle={{
								width: "14px",
								height: "14px",
							}}
						/>
					</Box>
					<Divider my={2} />
					<Box
						display={"flex"}
						alignContent={"center"}
						justifyContent={"space-between"}
					>
						<Flex align={"center"}>
							<Image
								src="/images/seller_logo.jpg"
								h={42}
								w={42}
								borderRadius={"5"}
							/>
							<Text>Customer Photo</Text>
						</Flex>
						<IconButtons
							onClick={() =>
								Router.push(
									"/admin/my-network/profile/up-per-info"
								)
							}
							title="Download"
							iconPos="left"
							iconName="file-download"
							iconStyle={{
								width: "14px",
								height: "14px",
							}}
						/>
					</Box>
					<Divider my={2} />
					<Box
						display={"flex"}
						alignContent={"center"}
						justifyContent={"space-between"}
					>
						<Flex align={"center"}>
							<Image
								src="/images/seller_logo.jpg"
								h={42}
								w={42}
								borderRadius={"5"}
							/>
							<Text>Customer Photo</Text>
						</Flex>
						<IconButtons
							onClick={() =>
								Router.push(
									"/admin/my-network/profile/up-sell-add"
								)
							}
							title="Download"
							iconPos="left"
							iconName="file-download"
							iconStyle={{
								width: "14px",
								height: "14px",
							}}
						/>
					</Box>
					<Divider my={2} />
					<Box
						display={"flex"}
						alignContent={"center"}
						justifyContent={"space-between"}
					>
						<Flex align={"center"}>
							<Image
								src="/images/seller_logo.jpg"
								h={42}
								w={42}
								borderRadius={"5"}
							/>
							<Text>Customer Photo</Text>
						</Flex>
						<IconButtons
							title="Download"
							iconPos="left"
							iconName="file-download"
							iconStyle={{
								width: "14px",
								height: "14px",
							}}
						/>
					</Box>
					<Divider my={2} />
					<Box
						display={"flex"}
						alignContent={"center"}
						justifyContent={"space-between"}
					>
						<Flex align={"center"}>
							<Image
								src="/images/seller_logo.jpg"
								h={42}
								w={42}
								borderRadius={"5"}
							/>
							<Text>Customer Photo</Text>
						</Flex>
						<IconButtons
							title="Download"
							iconPos="left"
							iconName="file-download"
							iconStyle={{
								width: "14px",
								height: "14px",
							}}
						/>
					</Box>
					<Divider my={2} />
					<Box
						display={"flex"}
						alignContent={"center"}
						justifyContent={"space-between"}
					>
						<Flex align={"center"}>
							<Image
								src="/images/seller_logo.jpg"
								h={42}
								w={42}
								borderRadius={"5"}
							/>
							<Text>Customer Photo</Text>
						</Flex>
						<IconButtons
							title="Download"
							iconPos="left"
							iconName="file-download"
							iconStyle={{
								width: "14px",
								height: "14px",
							}}
						/>
					</Box>
					<Divider my={2} />
				</Box>

				<Box mt="15px" justifySelf="end">
					<Buttons w={{ base: "100%", md: "215px" }} h="60px">
						<Icon name="file-download" width="18px" />
						&nbsp; Download All
					</Buttons>
				</Box>
			</Flex>
		</Cards>
	);
};

export default DocPane;
