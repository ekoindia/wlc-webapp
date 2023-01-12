import { DownloadIcon } from "@chakra-ui/icons";
import {
	Box,
	Circle,
	Flex,
	Heading,
	Image,
	Stack,
	StackDivider,
	Text,
} from "@chakra-ui/react";
import { Buttons, Cards } from "../";

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

					<Buttons variant={"link"}>
						<Circle bg={"primary.DEFAULT"} size={6} mr={1.5}>
							<Image src="/icons/download.svg" w={3} h={3} />
						</Circle>
						<Text fontSize={16}>Download</Text>
					</Buttons>
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

					<Buttons variant={"link"}>
						<Circle bg={"primary.DEFAULT"} size={6} mr={1.5}>
							<Image src="/icons/download.svg" w={3} h={3} />
						</Circle>
						<Text fontSize={16}>Download</Text>
					</Buttons>
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

					<Buttons variant={"link"}>
						<Circle bg={"primary.DEFAULT"} size={6} mr={1.5}>
							<Image src="/icons/download.svg" w={3} h={3} />
						</Circle>
						<Text fontSize={16}>Download</Text>
					</Buttons>
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

					<Buttons variant={"link"}>
						<Circle bg={"primary.DEFAULT"} size={6} mr={1.5}>
							<Image src="/icons/download.svg" w={3} h={3} />
						</Circle>
						<Text fontSize={16}>Download</Text>
					</Buttons>
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

					<Buttons variant={"link"}>
						<Circle bg={"primary.DEFAULT"} size={6} mr={1.5}>
							<Image src="/icons/download.svg" w={3} h={3} />
						</Circle>
						<Text fontSize={16}>Download</Text>
					</Buttons>
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

					<Buttons variant={"link"}>
						<Circle bg={"primary.DEFAULT"} size={6} mr={1.5}>
							<Image src="/icons/download.svg" w={3} h={3} />
						</Circle>
						<Text fontSize={16}>Download</Text>
					</Buttons>
				</Box>

				<Box mt={8}>
					<Buttons title="Download All" leftIcon={<DownloadIcon />} />
				</Box>
			</Stack>
		</Cards>
	);
};

export default DocPane;
