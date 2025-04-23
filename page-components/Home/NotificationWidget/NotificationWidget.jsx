import {
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
import { Button, Icon, YoutubePlayer } from "components";
import { useNotification } from "contexts";
import { useAppLink, useFileView } from "hooks";
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
 * Helper function to get Youtube Thumbnail URL
 * @param {string} youtubeId - Youtube Video ID
 * @param {string} size - Size of the thumbnail: "mqdefault", "hqdefault", "sddefault", "maxresdefault" (default: "mqdefault")
 * @returns {string} Youtube Thumbnail URL
 */
const getYoutubeThumbnail = (youtubeId, size = "mqdefault") => {
	return `https://img.youtube.com/vi/${youtubeId}/${size}.jpg`;
};

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
	const { showImage } = useFileView();

	console.log("NOTIFICATIONS: ", notifications);

	if (!notifications.length) {
		return null;
	}

	return (
		<>
			<WidgetBase
				title={title}
				autoHeight={compactMode ? false : true}
				noPadding
			>
				<Flex
					direction="column"
					className="customScrollbars"
					overflowY={{ base: "none", md: "scroll" }}
					borderTop="2px solid #E2E2E2"
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
							bg={notif.read ? "shade" : "white"}
							cursor="pointer"
							_hover={{ bg: "darkShade" }}
							borderBottom="2px solid #E2E2E2"
							onClick={() => openNotification(notif.id)}
						>
							<Flex position="relative">
								{notif.read ? null : (
									// Show a blue dot in the top-left corner if the notification is unread
									<Flex
										position="absolute"
										top="-5px"
										left="-5px"
										h="14px"
										w="14px"
										borderRadius="50%"
										bg="blue.500"
										border="2px solid white"
									/>
								)}
								<Flex
									justify="center"
									align="center"
									h={{ base: "38px", md: "42px" }}
									w={{ base: "38px", md: "42px" }}
									minW={{ base: "38px", md: "42px" }}
									borderRadius="8px"
									bg="gray.300"
									border="1px solid #D2D2D2"
									overflow="hidden"
								>
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
											h="100%"
											w="100%"
											minW="100%"
											src={notif.image}
											alt="Notification Poster"
										/>
									) : notif.youtube ? (
										<Image
											fit="cover"
											loading="lazy"
											overflow="hidden"
											h={{ base: "38px", md: "42px" }}
											w={{ base: "38px", md: "42px" }}
											minW={{ base: "38px", md: "42px" }}
											borderRadius="10px"
											src={getYoutubeThumbnail(
												notif.youtube,
												"mqdefault"
											)}
											alt="Video thumbnail"
										/>
									) : (
										<Icon
											size="22px"
											name={
												notif.youtube
													? "play-circle-outline"
													: "notifications"
											}
											color="gray.400"
										/>
									)}
								</Flex>
							</Flex>

							<Flex
								alignItems="center"
								justifyContent="space-between"
								w="100%"
								ml="15px"
							>
								<Flex direction="column">
									<Flex direction="row" align="center">
										{/* TODO: Add Status icon here: Success, Error, Warning, etc */}
										<Text
											fontSize={{ base: "xs", md: "sm" }}
											fontWeight="bold"
											noOfLines={compactMode ? 1 : 2}
										>
											{notif.title}
										</Text>
									</Flex>
									<Text
										mt="1"
										fontSize="xs"
										noOfLines={compactMode ? 2 : 3}
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
									my={4}
									fontSize="lg"
									variant="primary"
									onClick={() => {
										openUrl(openedNotification.link);
									}}
								>
									{openedNotification.link_label ||
										"Open Link"}
								</Button>
							) : null}

							{openedNotification.image ? (
								<Image
									src={openedNotification.image}
									alt="notification poster"
									mt="4"
									onClick={() =>
										showImage(openedNotification.image)
									}
									cursor="pointer"
								/>
							) : null}

							{openedNotification.youtube ? (
								// <Image
								// 	src={getYoutubeThumbnail(
								// 		openedNotification.youtube,
								// 		"hqdefault"
								// 	)}
								// 	alt="Video thumbnail"
								// 	mt="4"
								// />
								<YoutubePlayer
									videoId={openedNotification.youtube}
									autoplay={false}
									controls={true}
									// width="100%"
									// height="100%"
									style={{
										width: "100%",
										height: "200px",
										marginTop: "10px",
									}}
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
