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
import { Button, Card, IcoButton } from "components";

/**
 * A <DocPane> component
 * TODO: Write more description here
 * @arg 	{Object}	prop	Properties passed to the component
 * @param	{string}	[prop.className]	Optional classes to pass to this component.
 * @example	`<DocPane></DocPane>`
 */
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
		<Card>
			<Heading
				fontSize={{ base: 20, md: 15, lg: 17, xl: 18 }}
				fontWeight="semibold"
				color={"light"}
				mt="5px"
			>
				Document Center
			</Heading>

			<Flex direction={"column"}>
				<Box h="474px" fontSize={{ base: 16, md: 14, lg: 16 }}>
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
										src="/images/seller_logo.jpg" // TODO: Replace with actual doc image
										alt="Doc preview image"
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
								<IcoButton
									title={
										item.available ? "Download" : "Upload"
									}
									theme={
										item.available ? "accent" : "primary"
									}
									iconName={
										item.available
											? "file-download"
											: "file-upload"
									}
									size="sm"
								/>
							</Box>
						))}
					</Stack>
					<Divider mt="10px" />
				</Box>

				<Button w={{ base: "100%", md: "215px" }} h="60px">
					Download All
				</Button>
			</Flex>
		</Card>
	);
};

export default DocPane;
