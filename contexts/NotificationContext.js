import { useToast } from "@chakra-ui/react";
import { TransactionTypes } from "constants";
import { useSession } from "contexts";
import { fetcher } from "helpers";
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useState,
} from "react";

// Create the NotificationContext
const NotificationContext = createContext();

// Notification update type IDs
const NOTIF_STATUS_UPDATE = {
	READ: 1,
	DISMISSED: 2,
};

// Notification types
const NOTIF_TYPE = {
	NORMAL: 0, // Normal notification message
	COMMAND: 1, // Command Notification. Eg: Clear Cache or Reload Connect
	AD: 2, // Advertisement
	CUSTOMER_AD: 3, // Ad to be delivered to customer. Eg: in WhatsApp shared response
};

// Notification type metadata
const NOTIF_TYPE_META = {
	[NOTIF_TYPE.NORMAL]: { label: "notification", limit: 50 },
	[NOTIF_TYPE.COMMAND]: { label: "command-notification", limit: 5 },
	[NOTIF_TYPE.AD]: { label: "ad-notification", limit: 15 },
	[NOTIF_TYPE.CUSTOMER_AD]: { label: "customer-ad-notification", limit: 5 },
};

/**
 * Custom hook to fetch & manage notifications
 */
const useNotifications = () => {
	const [notifications, setNotifications] = useState([]);
	const [ads, setAds] = useState([]);
	// const [customerNotifications, setCustomerNotifications] = useState([]);
	const [unreadNotificationCount, setUnreadNotificationCount] = useState(0);
	const [isLoading, setIsLoading] = useState(true);

	// Notification settings. TODO: useLocalStorage()
	const [notifSettings, setNotifSettings] = useState({
		userId: 0,
		last_notif_id: 0,
	});

	// Id for Notification setInterval(): fetching every 10-minutes.
	const [intervalId, setIntervalId] = useState(null);

	const { isLoggedIn, userId, accessToken } = useSession();
	const toast = useToast();

	const fetchNotifications = useCallback(async () => {
		setIsLoading(true);
		try {
			const resp = await fetcher(
				process.env.NEXT_PUBLIC_API_BASE_URL + "/transactions/do",
				{
					body: {
						interaction_type_id: TransactionTypes.GET_NOTIFICATIONS,
					},
					token: accessToken,
				}
			);
			handleNotificationsResponse(resp);
		} catch (error) {
			console.error("Failed to fetch notifications:", error);
		} finally {
			setIsLoading(false);
		}
	}, [accessToken]);

	const handleNotificationsResponse = (response) => {
		const data_list = response?.data?.notifications;

		console.log("[NotificationContext] notifications fetched: ", data_list);

		if (!data_list) {
			return;
		}

		let _unread_notif = 0; // Unread notifications count
		const _notif_list = []; // Normal notifications
		const _ad_list = []; // Ad notifications
		// const _customer_ad_list = []; // Customer Ad notifications

		data_list.forEach((_notif) => {
			_notif = processNotification(_notif);

			if (_notif.notification_type === NOTIF_TYPE.NORMAL) {
				_notif_list.push(_notif);
				if (!_notif.read) {
					_unread_notif++;
				}
			} else if (_notif.notification_type === NOTIF_TYPE.AD) {
				_ad_list.push(_notif);
			}
			// else if (_notif.notification_type === NOTIF_TYPE.CUSTOMER_AD)
			// {
			// 	_customer_ad_list.push(_notif);
			// }

			// Mark as delivered via Pull...
			if ("delivery_status" in _notif && _notif.delivery_status == 0) {
				updateEMS({
					interaction_type_id: 10023,
					notification_id: _notif.id,
					delivery_status: 2, // PULL
				});

				// Google Analytics
				// fire("iron-signal", {
				// 	name: "track-event",
				// 	data: {
				// 		category:
				// 			NOTIF_TYPE_LABEL[_notif.notification_type] ||
				// 			"notification",
				// 		action: "pull-delivered",
				// 		label: _notif.id + "|" + (_notif.title || ""),
				// 	},
				// });
			}
		});

		setNotifications(
			sanitizeList(_notif_list, NOTIF_TYPE_META[NOTIF_TYPE.NORMAL].limit)
		);
		setAds(sanitizeList(_ad_list, NOTIF_TYPE_META[NOTIF_TYPE.AD].limit));
		setUnreadNotificationCount(_unread_notif);

		// TODO: Remove expired notifications & ads

		if (_notif_list?.length > 0) {
			// Show toast message, etc...
			processLatestNotification(_notif_list[0], _unread_notif);
		}
	};

	// Process a single notification data.
	// Set proper defaults for type & process polls.
	const processNotification = (notif) => {
		// Process notification type...
		notif.notification_type = notif.notification_type || NOTIF_TYPE.NORMAL;

		// Process polls...
		if (notif.poll && typeof notif.poll === "string") {
			notif.poll = notif.poll.split("|").map(function (p) {
				var p2 = p.split(/%%/);
				return {
					option: p2[0].trim(),
					comment: p2[1] ? p2[1].trim() : undefined,
				};
			});
		} else {
			notif.poll = [];
		}
		return notif;
	};

	const processLatestNotification = (notif, unread_count) => {
		// Show Notification Toast...
		if (
			(notifSettings.userId != userId ||
				notifSettings.last_notif_id != notif.id) &&
			notif.read == 0
		) {
			if (!toast.isActive(notif.id)) {
				toast({
					id: notif.id,
					title: notif.title,
					description:
						notif.desc + unread_count > 1
							? ` (+ ${unread_count - 1} more...)`
							: "",
					status: "info",
					duration: 9000,
					position: "top-right",
					isClosable: true,
					containerStyle: {
						marginTop: "4rem",
					},
				});
			}

			// this.fire("iron-signal", {
			// 	name: "show-notification-toast",
			// 	data: {
			// 		id: notif.id,
			// 		title: notif.title,
			// 		desc: notif.desc,
			// 		priority: notif.priority,
			// 		state: notif.state,
			// 		video: notif.youtube || "",
			// 		link: notif.link,
			// 		link_label: this._getLinkLabel(notif),
			// 		link_ico: this._getLinkIcon(notif.link),
			// 		qr_code: notif.qr_code,
			// 		image: notif.image,
			// 		poll: notif.poll,
			// 		unread_count: unread_count || 0,
			// 	},
			// });
		}

		// Store last notification details
		setNotifSettings({
			userId: userId,
			last_notif_id: notif.id,
		});
		// TODO: Save on server...
		// this.fire("iron-signal", {
		// 	name: "save-user-setting",
		// 	data: { path: "tf-config-notif", data: notifSettings },
		// });
	};

	/**
	 * Process the notification or ad list. Remove duplicates and trim to limit.
	 * @param {Array} list List of notifications or ads
	 * @param {Number} limit Limit of notifications or ads
	 */
	const sanitizeList = (list, limit) => {
		// Remove duplicates where title, desc, etc. are the same
		const _list = list.filter(
			(notif, index, self) =>
				index ===
				self.findIndex(
					(t) =>
						t.title === notif.title &&
						t.desc === notif.desc &&
						t.link === notif.link &&
						t.image === notif.image &&
						t.youtube === notif.youtube &&
						t.qr_code === notif.qr_code &&
						t.poll === notif.poll
				)
		);

		// Trim to limit...
		return _list.slice(0, limit);
	};

	const updateEMS = (body) => {
		// TODO: USE BEACON...
		fetcher(process.env.NEXT_PUBLIC_API_BASE_URL + "/transactions/do", {
			body: body,
			token: accessToken,
		});
	};

	const updateNotifStatus = (notificationId, status) => {
		if (!notificationId) {
			return;
		}

		updateEMS({
			interaction_type_id: 10012,
			notification_id: notificationId,
			notification_status: status,
		});
	};

	// Mark a notification as read
	const markAsRead = async (notificationId) => {
		setNotifications(
			notifications.map((notification) =>
				notification.id === notificationId
					? { ...notification, read: 1 }
					: notification
			)
		);

		updateNotifStatus(notificationId, NOTIF_STATUS_UPDATE.READ);

		// Remove system notification (if any)
		// if (navigator.serviceWorker && navigator.serviceWorker.controller) {
		// 	navigator.serviceWorker.controller.postMessage({
		// 		action: "hide-notification",
		// 		id: notificationId,
		// 	});
		// }

		// Google Analytics
		// this.fire("iron-signal", {
		// 	name: "track-event",
		// 	data: {
		// 		category: "notification",
		// 		action: "read",
		// 		label: this.data[notification_index].title || "",
		// 	},
		// });
	};

	// Refetch notifications every 10 minutes
	useEffect(() => {
		let _interval;

		if (isLoggedIn) {
			// user logged in
			fetchNotifications();
			if (!intervalId) {
				_interval = setInterval(() => {
					fetchNotifications();
				}, 600000); // 10 minutes in milliseconds
				setIntervalId(_interval);
			}
		} else {
			// user not logged in
			if (intervalId) {
				clearInterval(intervalId);
				setIntervalId(null);
			}
			setNotifications([]);
		}

		return () => clearInterval(_interval);
	}, [isLoggedIn, userId]);

	return {
		notifications,
		ads,
		unreadNotificationCount,
		isLoading,
		fetchNotifications,
		markAsRead,
	};
};

// NotificationProvider Component
const NotificationProvider = ({ children }) => {
	const notificationState = useNotifications();

	return (
		<NotificationContext.Provider value={notificationState}>
			{children}
		</NotificationContext.Provider>
	);
};

// Custom hook to use the NotificationContext
const useNotification = () => {
	const context = useContext(NotificationContext);
	if (!context) {
		throw new Error(
			"useNotification must be used within a NotificationProvider"
		);
	}
	return context;
};

export { NotificationProvider, useNotification };
