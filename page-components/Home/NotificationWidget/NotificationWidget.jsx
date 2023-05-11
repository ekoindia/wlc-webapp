import {
	Avatar,
	Box,
	Flex,
	Image,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Text,
} from "@chakra-ui/react";
import { Button } from "components";
import { useNotification } from "contexts";
import { useState } from "react";

/**
 * Homepage widget to show a list of notifications.
 */
const NotificationWidget = () => {
	// Get notifications from context
	const { notifications } = useNotification();
	const [selectedNotification, setSelectedNotification] = useState(null);

	console.log("NOTIFICATIONS: ", notifications);

	if (!notifications.length) {
		return null;
	}

	return (
		<>
			<Flex
				direction="column"
				background="white"
				h={{ base: "auto", md: "350px" }}
				pb="2"
				// p="5"
				borderRadius="10px"
				// m={{ base: "16px", md: "auto" }}
			>
				<Box top="0" zIndex="1" p="5">
					<Flex justifyContent="space-between">
						<Text as="b">Notifications</Text>
						{/* <Text
						as="b"
						color="primary.DEFAULT"
						onClick={() => handleShowHistory()}
						cursor="pointer"
						display={{ base: "none", md: "block" }}
					>
						Show All
					</Text> */}
					</Flex>
				</Box>
				<Flex
					direction="column"
					css={{
						"&::-webkit-scrollbar": {
							width: "2px",
							height: "2px",
							display: "none",
						},
						"&::-webkit-scrollbar-thumb": {
							background: "#cbd5e0",
							borderRadius: "2px",
						},
						"&:hover::-webkit-scrollbar": {
							display: "block",
						},
					}}
					overflowY={{ base: "none", md: "scroll" }}
					// rowGap={{ base: "19px", md: "10px" }}
					// mt="20px"
				>
					{notifications.map((notif, index) => (
						<Flex
							key={notif.id}
							p="8px 16px"
							cursor="pointer"
							_hover={{ bg: "darkShade" }}
							borderBottom="1px solid #F5F6F8"
							onClick={() => setSelectedNotification(notif)}
						>
							<Flex>
								<Avatar
									h={{ base: "38px", md: "42px" }}
									w={{ base: "38px", md: "42px" }}
									border="2px solid #D2D2D2"
									name={`${index + 1}`}
								/>
							</Flex>
							<Flex
								alignItems="center"
								justifyContent="space-between"
								w="100%"
								ml="15px"
							>
								<Flex direction="column">
									<Text
										fontSize={{ base: "xs", md: "sm" }}
										fontWeight="bold"
										noOfLines={1}
									>
										{notif.title}
									</Text>
									<Text mt="1" fontSize="xs" noOfLines={2}>
										{notif.desc}
									</Text>
								</Flex>
								{/* <Flex
								justifyContent="space-between"
								alignItems="center"
								ml={1}
								onClick={() => handleShowHistory(notif.tid)}
								cursor="pointer"
							>
								<Text
									color="primary.DEFAULT"
									paddingRight="6px"
									display={{ base: "none", md: "block" }}
									fontSize="sm"
								>
									Details
								</Text>
								<Icon
									w="12px"
									name="arrow-forward"
									color="primary.DEFAULT"
								/>
							</Flex> */}
							</Flex>
						</Flex>
					))}
				</Flex>
				{/* <Flex
					display={{ base: "block", md: "none" }}
					justifyContent="center"
					alignItems="center"
					textAlign="center"
					py="15px"
				>
					<Button
						onClick={() => handleShowHistory()}
						justifyContent="center"
						size="md"
					>
						+ Show All
					</Button>
				</Flex> */}
			</Flex>

			{/* Show Chakra Model with notification details id selectedNotification is not null: */}
			{selectedNotification && (
				<Modal
					isOpen={true}
					size="md"
					onClose={() =>
						setSelectedNotification(null)
					} /* isOpen={isOpen} onClose={onClose} */
				>
					<ModalOverlay bg="blackAlpha.600" backdropBlur="10px" />
					<ModalContent>
						<ModalHeader>{selectedNotification.title}</ModalHeader>
						<ModalCloseButton />
						<ModalBody>
							{("" + selectedNotification.desc)
								.split("\n")
								.map((line, index) => (
									<>
										<Text key={index}>{line}</Text>
										{/* <br /> */}
									</>
								))}

							{selectedNotification.image ? (
								<Image
									src={selectedNotification.image}
									alt="notification poster"
									mt="4"
								/>
							) : null}
						</ModalBody>

						<ModalFooter>
							<Button
								mr={3}
								onClick={() => setSelectedNotification(null)}
							>
								Close
							</Button>
							{/* <Button variant="ghost">Secondary Action</Button> */}
						</ModalFooter>
					</ModalContent>
				</Modal>
			)}
		</>
	);
};

export default NotificationWidget;
