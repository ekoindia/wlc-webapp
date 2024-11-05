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
	Spacer,
	Text,
} from "@chakra-ui/react";
import { Button, Icon } from "components";
import { useNotification } from "contexts";
import { useAppLink } from "hooks";
import { formatDateTime } from "libs";
import { WidgetBase } from "..";

// const PRIORITY = {
// 	LOW: 1,
// 	NORMAL: 2,
// 	HIGH: 3,
// };

// const STATE = {
// 	NORMAL: 1,
// 	POSITIVE: 2,
// 	NEGATIVE: 3,
// };

/**
 * Homepage widget to show a list of notifications.
 * @param {object} props
 * @param {string} [props.title] Title of the widget
 * @param {boolean} [props.compactMode] Flag to display the widget in compact mode
 */
const NotificationWidget = ({ title = "", compactMode = false }) => {
	// Get notifications from context
	const {
		notifications,
		openedNotification,
		openNotification,
		closeNotification,
	} = useNotification();
	const { openUrl } = useAppLink();

	console.log("NOTIFICATIONS: ", notifications);

	if (!notifications.length) {
		return null;
	}

	return (
		<>
			<WidgetBase title={title} noPadding>
				<Flex
					direction="column"
					className="customScrollbars"
					overflowY={{ base: "none", md: "scroll" }}
					// rowGap={{ base: "19px", md: "10px" }}
					// mt="20px"
				>
					{notifications.map((notif) => (
						<Flex
							key={notif.id}
							p={{
								base: "8px 16px",
								md: compactMode ? "8px 16px" : "16px",
							}}
							cursor="pointer"
							_hover={{ bg: "darkShade" }}
							borderBottom="1px solid #F5F6F8"
							onClick={() => openNotification(notif.id)}
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
										fit="cover"
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
											size="22px"
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
										noOfLines={compactMode ? 1 : 2}
									>
										{notif.title}
									</Text>
									<Text
										mt="1"
										fontSize="xs"
										noOfLines={compactMode ? 2 : 4}
									>
										{notif.desc}
									</Text>
								</Flex>
							</Flex>
						</Flex>
					))}
				</Flex>
			</WidgetBase>

			{/* Show Chakra Model with notification details if openedNotification is not null: */}
			{openedNotification && openedNotification.id ? (
				<Modal
					isOpen={true}
					size="md"
					onClose={
						closeNotification
					} /* isOpen={isOpen} onClose={onClose} */
				>
					<ModalOverlay bg="blackAlpha.600" backdropBlur="10px" />
					<ModalContent>
						<ModalHeader>{openedNotification.title}</ModalHeader>
						<ModalCloseButton _hover={{ color: "error" }} />
						<ModalBody>
							{("" + openedNotification.desc)
								.split("\n")
								.map((line, index) => (
									<Text key={index}>{line}</Text>
								))}

							{openedNotification.link ? (
								<Button
									mt={2}
									fontSize="lg"
									variant="link"
									color="primary.DEFAULT"
									onClick={() => {
										openUrl(openedNotification.link);
									}}
								>
									Open Link
								</Button>
							) : null}

							{openedNotification.image ? (
								<Image
									src={openedNotification.image}
									alt="notification poster"
									mt="4"
								/>
							) : null}
						</ModalBody>

						<ModalFooter>
							<Text fontSize="xs">
								{formatDateTime(
									openedNotification.notify_time,
									"dd MMM yyyy, hh:mm a"
								)}
							</Text>
							<Spacer />
							<Button mr={3} onClick={closeNotification}>
								Close
							</Button>
						</ModalFooter>
					</ModalContent>
				</Modal>
			) : null}
		</>
	);
};

export default NotificationWidget;
