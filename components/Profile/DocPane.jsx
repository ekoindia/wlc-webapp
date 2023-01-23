import {
	Box,
	Flex,
	Heading,
	Image,
	Stack,
	StackDivider,
	Text,
} from "@chakra-ui/react";
import { Buttons, Cards, Icon, IconButtons } from "../";

const DocPane = () => {
	return (
		<Cards>
			<Heading fontSize={18} fontWeight="semibold" color={"light"}>
				Document Center
			</Heading>

			<Stack direction={"column"} divider={<StackDivider />} mt={"5"}>
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
						iconStyle={{ h: "14px", w: "14px" }}
					/>
				</Box>
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
						iconStyle={{ h: "14px", w: "14px" }}
					/>
				</Box>
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
						iconStyle={{ h: "14px", w: "14px" }}
					/>
				</Box>
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
						iconStyle={{ h: "14px", w: "14px" }}
					/>
				</Box>
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
						iconStyle={{ h: "14px", w: "14px" }}
					/>
				</Box>
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
						iconStyle={{ h: "14px", w: "14px" }}
					/>
				</Box>

				<Box mt={8}>
					<Buttons w="215px" h="60px">
						<Icon name="file-download" width="18px" />
						&nbsp; Download All
					</Buttons>
				</Box>
			</Stack>
		</Cards>
	);
};

export default DocPane;
