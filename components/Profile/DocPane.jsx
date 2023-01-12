import { DownloadIcon } from "@chakra-ui/icons";
import {
	Box,
	Flex,
	Heading,
	Image,
	Stack,
	StackDivider,
	Text,
} from "@chakra-ui/react";
import { Buttons, Cards, IconButtons } from "../";

const DocPane = () => {
	return (
		<Cards w="530px">
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
						iconPath="/icons/download.svg"
						iconW="14px"
						iconH="14px"
						size="30px"
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
						iconPath="/icons/download.svg"
						iconW="14px"
						iconH="14px"
						size="30px"
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
						iconPath="/icons/download.svg"
						iconW="14px"
						iconH="14px"
						size="30px"
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
						iconPath="/icons/download.svg"
						iconW="14px"
						iconH="14px"
						size="30px"
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
						iconPath="/icons/download.svg"
						iconW="14px"
						iconH="14px"
						size="30px"
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
						iconPath="/icons/download.svg"
						iconW="14px"
						iconH="14px"
						size="30px"
					/>
				</Box>

				<Box mt={8}>
					<Buttons title="Download All" leftIcon={<DownloadIcon />} />
				</Box>
			</Stack>
		</Cards>
	);
};

export default DocPane;
