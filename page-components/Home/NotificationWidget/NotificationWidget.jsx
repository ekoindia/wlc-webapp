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
import { useAppLink, useFileView, useHslColor } from "hooks";
import { formatDateTime } from "libs";
import { WidgetBase } from "..";

const PRIORITY = {
	LOW: 1,
	NORMAL: 2,
	HIGH: 3,
};

const STATE = {
	NORMAL: 1,
	POSITIVE: 2,
	NEGATIVE: 3,
};

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
 * A thumbnail for the notification
 * MARK: Thumbnail
 * @param {object} props
 * @param {object} props.notification - The notification details like image, youtube, read status.
 * @returns {JSX.Element} NotificationThumbnail component
 */
const NotificationThumbnail = ({ notification }) => {
	const { title, image, youtube, read } = notification || {};
	const hasMedia = image || youtube;
	const { h } = useHslColor(title);

	return (
		<Flex position="relative">
			{
				// Show a blue dot if the notification is unread
				!read && (
					<Flex
						position="absolute"
						top="-2px"
						left="-2px"
						h="14px"
						w="14px"
						borderRadius="50%"
						bg="blue.500"
						border="2px solid white"
					/>
				)
			}
			<Flex
				justify="center"
				align="center"
				h={{ base: "38px", md: "42px" }}
				w={{ base: "38px", md: "42px" }}
				minW={{ base: "38px", md: "42px" }}
				borderRadius={hasMedia ? "6px" : "50%"}
				bg={read ? "gray.200" : `hsl(${h},50%,90%)`}
				border="1px solid"
				borderColor={read ? "#D2D2D2" : `hsl(${h},30%,85%)`}
				overflow="hidden"
			>
				{image ? (
					<Image
						fit="cover"
						loading="lazy"
						overflow="hidden"
						h="100%"
						w="100%"
						minW="100%"
						src={image}
						alt="Notification Poster"
					/>
				) : youtube ? (
					<Image
						fit="cover"
						loading="lazy"
						overflow="hidden"
						h={{ base: "38px", md: "42px" }}
						w={{ base: "38px", md: "42px" }}
						minW={{ base: "38px", md: "42px" }}
						borderRadius="10px"
						src={getYoutubeThumbnail(youtube)}
						alt="Video thumbnail"
					/>
				) : (
					<Icon
						size="22px"
						name={youtube ? "play-circle-outline" : "notifications"}
						// color="gray.400"
						color={read ? "gray.400" : `hsl(${h},20%,65%)`}
					/>
				)}
			</Flex>
		</Flex>
	);
};

/**
 * Homepage widget to show a list of notifications.
 * MARK: Widget
 * @param {object} props
 * @param {string} [props.title] Title of the widget
 * @param {boolean} [props.compactMode] Flag to display the widget in compact mode (default: false)
 * @param {boolean} [props.unreadOnly] Flag to display only unread notifications (default: false)
 * @returns {JSX.Element|null} NotificationWidget component or null if no notifications
 */
const NotificationWidget = ({
	title = "",
	compactMode = false,
	unreadOnly = false,
}) => {
	// Get notifications from context
	const {
		notifications,
		openedNotification,
		openNotification,
		closeNotification,
		openNotificationPanel,
	} = useNotification();
	const { openUrl } = useAppLink();
	const { showImage } = useFileView();

	// console.log("NOTIFICATIONS: ", notifications);

	if (!notifications.length) {
		return null;
	}

	const filteredNotifications = unreadOnly
		? notifications.filter((notif) => !notif.read)
		: notifications;

	if (!filteredNotifications.length) {
		return null;
	}

	console.log("NOTIFICATIONS: ", filteredNotifications);

	return (
		<>
			<WidgetBase
				title={title}
				linkLabel={unreadOnly ? "Show All" : undefined}
				linkOnClick={openNotificationPanel}
				autoHeight={compactMode ? false : true}
				noPadding
			>
				<Flex
					direction="column"
					className="customScrollbars"
					overflowY={{ base: "none", md: "scroll" }}
					borderTop="3px solid #E2E2E2"
					// rowGap={{ base: "19px", md: "10px" }}
					// mt="20px"
				>
					{filteredNotifications?.map((notif) => (
						<Flex
							key={notif.id}
							p={{
								base: "8px 16px",
								md: compactMode ? "8px 16px" : "16px",
							}}
							bg={notif.read ? "shade" : "white"}
							cursor="pointer"
							_hover={{ bg: "darkShade" }}
							borderBottom="1px ridge #E2E2E2"
							opacity={notif.read ? 0.8 : 1}
							onClick={() => openNotification(notif.id)}
							borderLeft="5px solid transparent"
							borderLeftColor={
								notif.priority === PRIORITY.HIGH
									? "accent.DEFAULT"
									: "transparent"
							}
						>
							<NotificationThumbnail notification={notif} />
							<Flex
								alignItems="center"
								justifyContent="space-between"
								w="100%"
								ml="15px"
							>
								<Flex direction="column">
									<Flex direction="row" align="center">
										{/* TODO: Add Status icon here: Success, Error, etc */}
										{notif.state === STATE.POSITIVE ? (
											<Icon
												name="check"
												size="18px"
												color="green.500"
												mr="1"
											/>
										) : notif.state === STATE.NEGATIVE ? (
											<Icon
												name="error"
												size="18px"
												color="red.500"
												mr="1"
											/>
										) : null}
										<Text
											fontSize={{ base: "xs", md: "sm" }}
											fontWeight="bold"
											noOfLines={compactMode ? 1 : 2}
										>
											{notif.title}
										</Text>
									</Flex>
									<Flex
										mt="1"
										fontSize="xs"
										noOfLines={compactMode ? 2 : 3}
									>
										{notif.desc
											.split("\n")
											.filter(
												(line) => line.trim() !== ""
											)
											.slice(0, 3)
											.map((line, index) => (
												<Text key={index}>{line}</Text>
											))}
									</Flex>
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
					size="xl"
					onClose={
						closeNotification
					} /* isOpen={isOpen} onClose={onClose} */
				>
					<ModalOverlay bg="blackAlpha.600" backdropBlur="10px" />
					<ModalContent>
						<ModalHeader display="flex" alignItems="center">
							{openedNotification.state === STATE.POSITIVE ? (
								<Icon
									name="check"
									size="1.4em"
									color="green.500"
									mr="1"
								/>
							) : openedNotification.state === STATE.NEGATIVE ? (
								<Icon
									name="error"
									size="1.4em"
									color="red.500"
									mr="1"
								/>
							) : null}
							{openedNotification.title}
						</ModalHeader>
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
									size="lg"
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
