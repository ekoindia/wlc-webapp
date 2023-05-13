import {
	Center,
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
import { Button, Icon } from "components";
import { useNotification } from "contexts";
import { useAppLink } from "hooks";
import { useState } from "react";
import { WidgetBase } from "..";

/**
 * Homepage widget to show a list of notifications.
 */
const NotificationWidget = () => {
	// Get notifications from context
	const { notifications, markAsRead } = useNotification();
	const [selectedNotification, setSelectedNotification] = useState(null);
	const { openUrl } = useAppLink();

	console.log("NOTIFICATIONS: ", notifications);

	if (!notifications.length) {
		return null;
	}

	// Open/expand a notification to show details
	const openNotification = (notif) => {
		setSelectedNotification(notif);
		markAsRead(notif.id);
	};

	return (
		<>
			<WidgetBase title="Notifications" noPadding>
				<Flex
					direction="column"
					className="customScrollbars"
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
							onClick={() => openNotification(notif)}
						>
							<Flex>
								{/* <Avatar
									h={{ base: "38px", md: "42px" }}
									w={{ base: "38px", md: "42px" }}
									border="2px solid #D2D2D2"
									name={`${index + 1}`}
								/> */}
								{notif.image ? (
									<Image
										fit="fill"
										loading="lazy"
										overflow="hidden"
										h={{ base: "38px", md: "42px" }}
										w={{ base: "38px", md: "42px" }}
										minW={{ base: "38px", md: "42px" }}
										borderRadius="10px"
										src={notif.image}
										alt="Notification Poster"
									/>
								) : (
									<Center
										h={{
											base: "38px",
											md: "42px",
										}}
										w={{
											base: "38px",
											md: "42px",
										}}
										borderRadius="10px"
										bg="gray.300"
									>
										<Icon
											width="22px"
											height="22px"
											name="notifications"
											color="gray.400"
										/>
									</Center>
								)}
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
							</Flex>
						</Flex>
					))}
				</Flex>
			</WidgetBase>

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
									<Text key={index}>{line}</Text>
								))}

							{selectedNotification.link ? (
								<Button
									mt={2}
									fontSize="lg"
									variant="link"
									color="accent.DEFAULT"
									onClick={() => {
										openUrl(selectedNotification.link);
									}}
								>
									Open Link
								</Button>
							) : null}

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
