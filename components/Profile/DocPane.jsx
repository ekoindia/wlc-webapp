import {
	Box,
	Divider,
	Flex,
	Heading,
	Image,
	Stack,
	StackDivider,
	Text,
} from "@chakra-ui/react";
import { Buttons, Cards, Icon, IconButtons } from "../";

const DocPane = () => {
	const docData = [
		{
			image: "/images/seller_logo.jpg",
			name: "Customer Photo",
			available: true,
		},
		{
			image: "/images/seller_logo.jpg",
			name: "Aadhaar front",
			available: true,
		},
		{
			image: "/images/seller_logo.jpg",
			name: "Aadhaar back",
			available: true,
		},
		{
			image: "/images/seller_logo.jpg",
			name: "PAN Card",
			available: true,
		},
		{
			image: "/images/seller_logo.jpg",
			name: "Post dated cheque",
			available: false,
		},
		{
			image: "/images/seller_logo.jpg",
			name: "e-Sign Agreement",
			available: false,
		},
	];

	return (
		<Cards>
			<Heading
				fontSize={{ base: 16, md: 18 }}
				fontWeight="semibold"
				color={"light"}
			>
				Document Center
			</Heading>

			<Flex direction={"column"}>
				<Box h="474px" fontSize={{ base: "14px", md: "16px" }}>
					<Stack direction="column" divider={<StackDivider />} mt="5">
						{docData.map((item, index) => (
							<Box
								display={"flex"}
								alignContent={"center"}
								justifyContent={"space-between"}
								key={index}
								my="5px"
							>
								<Flex align={"center"}>
									<Image
										src="/images/seller_logo.jpg"
										h={42}
										w={42}
										borderRadius={"5"}
									/>
									<Box>
										<Text>{item.name}</Text>
										{item.available ? (
											<></>
										) : (
											<>
												<Text
													color="error"
													fontSize="12px"
												>
													Not Available
												</Text>
											</>
										)}
									</Box>
								</Flex>
								<IconButtons
									title={
										item.available ? "Download" : "Upload"
									}
									iconPos="left"
									variant={
										item.available ? "primary" : "accent"
									}
									iconName={
										item.available
											? "file-download"
											: "file-upload"
									}
									iconStyle={{
										width: "14px",
										height: "14px",
									}}
									textStyle={{
										fontSize: "16px",
									}}
								/>
							</Box>
						))}
					</Stack>
					<Divider mt="10px" />
				</Box>

				<Buttons w={{ base: "100%", md: "215px" }} h="60px">
					<Icon name="file-download" width="18px" />
					&nbsp; Download All
				</Buttons>
			</Flex>
		</Cards>
	);
};

export default DocPane;
